# --------------------------------------------------------------------
# Orders DB and RabbitMQ secret access through EKS Pod Identity
# --------------------------------------------------------------------
# The orders app pod, in-cluster PostgreSQL pod, and RabbitMQ pod all need
# to read credentials from AWS Secrets Manager through the CSI driver.

variable "orders_db_secret_namespace" {
  description = "Kubernetes namespace containing the orders service accounts."
  type        = string
  default     = "micro-tier"
}

variable "orders_db_secret_service_accounts" {
  description = "Kubernetes service accounts associated with the orders secrets role."
  type        = set(string)
  default = [
    "orders",
    "orders-postgresql-sa",
    "orders-rabbitmq-sa"
  ]
}

variable "orders_secret_name_prefixes" {
  description = "Secrets Manager secret name prefixes for the orders DB and RabbitMQ secrets."
  type        = list(string)
  default = [
    "orders-db-secret",
    "orders-rabbitmq-secret"
  ]
}

variable "orders_db_secret_kms_key_arns" {
  description = "Optional customer-managed KMS key ARNs required to decrypt orders DB secret values."
  type        = list(string)
  default     = []
}

resource "aws_iam_policy" "orders_db_secret_policy" {
  name        = "${local.name}-orders-db-secret-policy"
  path        = "/"
  description = "Allows orders pods to read only the orders DB and RabbitMQ secrets from AWS Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [
        {
          Sid    = "ReadOrdersSecrets"
          Effect = "Allow"
          Action = [
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret"
          ]
          Resource = [
            for secret_prefix in var.orders_secret_name_prefixes :
            "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${secret_prefix}*"
          ]
        }
      ],
      length(var.orders_db_secret_kms_key_arns) > 0 ? [
        {
          Sid    = "DecryptOrdersDbSecret"
          Effect = "Allow"
          Action = [
            "kms:Decrypt"
          ]
          Resource = var.orders_db_secret_kms_key_arns
        }
      ] : []
    )
  })

  tags = {
    Name        = "${local.name}-orders-db-secret-policy"
    Environment = var.environment_name
    Component   = "Orders DB Secret"
    Scope       = "DB and RabbitMQ"
  }
}

resource "aws_iam_role" "orders_db_secrets_role" {
  name               = "${local.name}-orders-db-secrets-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    Name        = "${local.name}-orders-db-secrets-role"
    Environment = var.environment_name
    Component   = "Orders DB Secret"
  }
}

# Attach the least-privilege orders secrets policy to the shared pod identity role.
resource "aws_iam_role_policy_attachment" "orders_db_secret_policy_attach" {
  role       = aws_iam_role.orders_db_secrets_role.name
  policy_arn = aws_iam_policy.orders_db_secret_policy.arn
}

# Bind the role to the orders app pod and both in-cluster stateful workloads.
resource "aws_eks_pod_identity_association" "orders_db_secret" {
  for_each = var.orders_db_secret_service_accounts

  cluster_name    = aws_eks_cluster.main.name
  namespace       = var.orders_db_secret_namespace
  service_account = each.value
  role_arn        = aws_iam_role.orders_db_secrets_role.arn

  depends_on = [
    aws_eks_addon.podidentity,
    aws_iam_role_policy_attachment.orders_db_secret_policy_attach
  ]
}

output "orders_db_secret_policy_arn" {
  description = "IAM policy ARN allowing read access to the orders DB and RabbitMQ secrets"
  value       = aws_iam_policy.orders_db_secret_policy.arn
}

output "orders_db_secrets_role_arn" {
  description = "IAM role ARN associated with the orders secret-reading service accounts"
  value       = aws_iam_role.orders_db_secrets_role.arn
}

output "orders_db_secret_pod_identity_association_arn" {
  description = "EKS Pod Identity association ARNs for orders DB secret access"
  value = {
    for service_account, association in aws_eks_pod_identity_association.orders_db_secret :
    service_account => association.association_arn
  }
}
