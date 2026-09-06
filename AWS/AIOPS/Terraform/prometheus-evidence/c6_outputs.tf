# Lambda ARN for future Bedrock Agent action-group wiring.
output "prometheus_evidence_lambda_arn" {
  description = "ARN of the read-only Prometheus evidence Lambda."
  value       = aws_lambda_function.prometheus_evidence.arn
}

# Lambda function name for manual test invokes and future integrations.
output "prometheus_evidence_lambda_name" {
  description = "Name of the read-only Prometheus evidence Lambda."
  value       = aws_lambda_function.prometheus_evidence.function_name
}

# IAM role ARN for security review.
output "prometheus_evidence_lambda_role_arn" {
  description = "Execution role ARN for the Prometheus evidence Lambda."
  value       = aws_iam_role.prometheus_evidence_lambda.arn
}
