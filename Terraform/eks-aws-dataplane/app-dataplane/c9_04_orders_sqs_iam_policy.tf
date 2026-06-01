# Allow the orders app pod to resolve the queue and publish events to it.
resource "aws_iam_policy" "orders_sqs_access_policy" {
  name        = "${local.name}-orders-sqs-access-policy"
  path        = "/"
  description = "Allows the orders app pod to send events to the orders SQS queue"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "OrdersSQSAccess"
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:GetQueueUrl",
          "sqs:ListQueues",
          "sqs:PurgeQueue"
        ]
        Resource = aws_sqs_queue.orders_events.arn
      }
    ]
  })

  tags = {
    Name        = "${local.name}-orders-sqs-access-policy"
    Environment = var.environment_name
    Component   = "Orders SQS"
  }
}

# Reuse the existing orders pod identity role so one service account can read
# the DB secret and publish SQS messages without extra role switching.
resource "aws_iam_role_policy_attachment" "orders_sqs_access_policy_attach" {
  role       = aws_iam_role.orders_db_secrets_role.name
  policy_arn = aws_iam_policy.orders_sqs_access_policy.arn
}

output "orders_sqs_access_policy_arn" {
  description = "IAM policy ARN allowing the orders app to publish to the SQS queue"
  value       = aws_iam_policy.orders_sqs_access_policy.arn
}
