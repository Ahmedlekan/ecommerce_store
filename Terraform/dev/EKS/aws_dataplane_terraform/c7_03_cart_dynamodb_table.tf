# DynamoDB table for the carts service.
# The primary key is `id`, and the application also queries by customerId
# through the `idx_global_customerId` global secondary index.
resource "aws_dynamodb_table" "cart_items" {
  provider       = aws.west2
  name         = var.cart_dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "customerId"
    type = "S"
  }

  global_secondary_index {
    name            = "idx_global_customerId"
    hash_key        = "customerId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "${local.name}-cart-dynamodb-table"
    Environment = var.environment_name
    Component   = "Cart DynamoDB"
  }
}

output "cart_dynamodb_table_name" {
  description = "DynamoDB table name used by the carts service"
  value       = aws_dynamodb_table.cart_items.name
}

output "cart_dynamodb_table_arn" {
  description = "DynamoDB table ARN used by the carts service"
  value       = aws_dynamodb_table.cart_items.arn
}
