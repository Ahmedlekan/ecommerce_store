# Create the SQS queue used by the orders service to publish checkout events.
resource "aws_sqs_queue" "orders_events" {
  name                       = "${local.name}-orders-events"
  delay_seconds              = 10
  visibility_timeout_seconds = 30
  message_retention_seconds  = 345600

  tags = {
    Name = "${local.name}-orders-events"
  }
}

output "orders_sqs_queue_name" {
  description = "SQS queue name used by the orders service"
  value       = aws_sqs_queue.orders_events.name
}

output "orders_sqs_queue_url" {
  description = "SQS queue URL used by the orders service"
  value       = aws_sqs_queue.orders_events.url
}

output "orders_sqs_queue_arn" {
  description = "SQS queue ARN used by the orders service"
  value       = aws_sqs_queue.orders_events.arn
}
