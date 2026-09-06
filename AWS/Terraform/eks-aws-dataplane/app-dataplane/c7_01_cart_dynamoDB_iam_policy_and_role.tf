variable "cart_dynamodb_namespace" {
  description = "Kubernetes namespace containing the carts application service account."
  type        = string
  default     = "micro-tier"
}

variable "cart_dynamodb_service_accounts" {
  description = "Kubernetes service accounts associated with the cart DynamoDB access role."
  type        = set(string)
  default = [
    "carts"
  ]
}

variable "cart_dynamodb_table_name" {
  description = "DynamoDB table name used by the carts service."
  type        = string
  default     = "Items"
}

# IAM policy that allows the carts pod to read and write only the cart table
# and its global secondary index.
resource "aws_iam_policy" "cart_dynamodb_access_policy" {
  name        = "${local.name}-cart-dynamodb-access-policy"
  path        = "/"
  description = "Allows the carts app pod to access only the cart DynamoDB table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CartTableReadWrite"
        Effect = "Allow"
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:ConditionCheckItem",
          "dynamodb:DeleteItem",
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          aws_dynamodb_table.cart_items.arn,
          "${aws_dynamodb_table.cart_items.arn}/index/*"
        ]
      }
    ]
  })

  tags = {
    Name        = "${local.name}-cart-dynamodb-access-policy"
    Environment = var.environment_name
    Component   = "Cart DynamoDB"
  }
}

# IAM role assumed by the carts application pod through EKS Pod Identity.
resource "aws_iam_role" "cart_dynamodb_access_role" {
  name               = "${local.name}-cart-dynamodb-access-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    Name        = "${local.name}-cart-dynamodb-access-role"
    Environment = var.environment_name
    Component   = "Cart DynamoDB"
  }
}

# Attach the least-privilege DynamoDB access policy to the carts pod role.
resource "aws_iam_role_policy_attachment" "cart_dynamodb_access_policy_attach" {
  role       = aws_iam_role.cart_dynamodb_access_role.name
  policy_arn = aws_iam_policy.cart_dynamodb_access_policy.arn
}

output "cart_dynamodb_access_policy_arn" {
  description = "IAM policy ARN allowing carts app access to the DynamoDB table"
  value       = aws_iam_policy.cart_dynamodb_access_policy.arn
}

output "cart_dynamodb_access_role_arn" {
  description = "IAM role ARN associated with the carts application service account"
  value       = aws_iam_role.cart_dynamodb_access_role.arn
}
