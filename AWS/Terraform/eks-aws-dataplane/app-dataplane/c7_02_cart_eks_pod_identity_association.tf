# Associate the carts application service account with the DynamoDB access role
# so the AWS SDK can obtain credentials through EKS Pod Identity.
resource "aws_eks_pod_identity_association" "cart_dynamodb_access" {
  for_each = var.cart_dynamodb_service_accounts

  cluster_name    = data.terraform_remote_state.eks.outputs.eks_cluster_name
  namespace       = var.cart_dynamodb_namespace
  service_account = each.value
  role_arn        = aws_iam_role.cart_dynamodb_access_role.arn

  depends_on = [
    aws_iam_role_policy_attachment.cart_dynamodb_access_policy_attach
  ]
}

output "cart_dynamodb_pod_identity_association_arn" {
  description = "EKS Pod Identity association ARNs for carts DynamoDB access"
  value = {
    for service_account, association in aws_eks_pod_identity_association.cart_dynamodb_access :
    service_account => association.association_arn
  }
}
