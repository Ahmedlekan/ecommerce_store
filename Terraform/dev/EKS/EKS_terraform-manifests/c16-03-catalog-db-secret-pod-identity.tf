# --------------------------------------------------------------------
# Catalog DB secret access through EKS Pod Identity
# --------------------------------------------------------------------
# The Secrets Store CSI Driver and AWS provider are cluster add-ons.
# They do not automatically grant application pods permission to read
# AWS Secrets Manager secrets.
#
# This file follows least privilege:
# - one IAM policy for one Secrets Manager secret prefix
# - one IAM role for one Kubernetes service account
# - one EKS Pod Identity association
# --------------------------------------------------------------------

# Used to build the Secrets Manager ARN for the current AWS account.
data "aws_caller_identity" "current" {}

# Namespace where the catalog MySQL service account will exist.
# Your example uses "default"; change this if you deploy the app into "micro-tier".
variable "catalog_db_secret_namespace" {
  description = "Kubernetes namespace containing the catalog MySQL service account."
  type        = string
  default     = "default"
}

# Service accounts that need to read the catalog DB secret.
# The catalog MySQL pod needs the secret to initialize the DB user.
# The catalog application pod needs the same secret to connect to MySQL.
variable "catalog_db_secret_service_accounts" {
  description = "Kubernetes service accounts associated with the catalog DB Secrets Manager IAM role."
  type        = set(string)
  default = [
    "catalog-mysql-sa",
    "catalog"
  ]
}

# Secrets Manager secret name prefix.
# AWS appends random characters to secret ARNs, so the IAM resource uses a trailing wildcard.
variable "catalog_db_secret_name_prefix" {
  description = "Secrets Manager secret name prefix for the catalog database secret."
  type        = string
  default     = "catalog-db-secret"
}

# Optional KMS key ARNs if catalog-db-secret uses a customer-managed KMS key.
# Leave empty when using the default AWS managed key for Secrets Manager.
variable "catalog_db_secret_kms_key_arns" {
  description = "Optional customer-managed KMS key ARNs required to decrypt catalog DB secret values."
  type        = list(string)
  default     = []
}

# IAM policy that allows reading only catalog-db-secret* from AWS Secrets Manager.
resource "aws_iam_policy" "catalog_db_secret_policy" {
  name        = "${local.name}-catalog-db-secret-policy"
  path        = "/"
  description = "Allows the catalog MySQL pod to read only the catalog DB secret from AWS Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [
        {
          Sid    = "ReadCatalogDbSecret"
          Effect = "Allow"
          Action = [
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret"
          ]
          Resource = "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${var.catalog_db_secret_name_prefix}*"
        }
      ],
      length(var.catalog_db_secret_kms_key_arns) > 0 ? [
        {
          Sid    = "DecryptCatalogDbSecret"
          Effect = "Allow"
          Action = [
            "kms:Decrypt"
          ]
          Resource = var.catalog_db_secret_kms_key_arns
        }
      ] : []
    )
  })

  tags = {
    Name        = "${local.name}-catalog-db-secret-policy"
    Environment = var.environment_name
    Component   = "Catalog DB Secret"
  }
}

# IAM role assumed by catalog MySQL pods through EKS Pod Identity.
# The trust policy is defined in c13-podidentity-assumerole.tf and trusts
# pods.eks.amazonaws.com with sts:AssumeRole and sts:TagSession.
resource "aws_iam_role" "catalog_db_secrets_role" {
  name               = "${local.name}-catalog-db-secrets-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    Name        = "${local.name}-catalog-db-secrets-role"
    Environment = var.environment_name
    Component   = "Catalog DB Secret"
  }
}

# Attach the least-privilege catalog DB secret policy to the pod identity role.
resource "aws_iam_role_policy_attachment" "catalog_db_secret_policy_attach" {
  role       = aws_iam_role.catalog_db_secrets_role.name
  policy_arn = aws_iam_policy.catalog_db_secret_policy.arn
}

# Associate the IAM role with each Kubernetes service account that needs the catalog DB secret.
# It is okay if the Kubernetes ServiceAccount is created later, as long as
# the namespace and service account name match this association.
resource "aws_eks_pod_identity_association" "catalog_db_secret" {
  for_each = var.catalog_db_secret_service_accounts

  cluster_name    = aws_eks_cluster.main.name
  namespace       = var.catalog_db_secret_namespace
  service_account = each.value
  role_arn        = aws_iam_role.catalog_db_secrets_role.arn

  depends_on = [
    aws_eks_addon.podidentity,
    aws_iam_role_policy_attachment.catalog_db_secret_policy_attach
  ]
}

output "catalog_db_secret_policy_arn" {
  description = "IAM policy ARN allowing read access to catalog-db-secret*"
  value       = aws_iam_policy.catalog_db_secret_policy.arn
}

output "catalog_db_secrets_role_arn" {
  description = "IAM role ARN associated with the catalog MySQL service account"
  value       = aws_iam_role.catalog_db_secrets_role.arn
}

output "catalog_db_secret_pod_identity_association_arn" {
  description = "EKS Pod Identity association ARNs for catalog DB secret access"
  value = {
    for service_account, association in aws_eks_pod_identity_association.catalog_db_secret :
    service_account => association.association_arn
  }
}
