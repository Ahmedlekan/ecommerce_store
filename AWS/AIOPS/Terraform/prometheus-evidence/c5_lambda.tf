# Dedicated log group lets IAM scope log writes and sets retention explicitly.
resource "aws_cloudwatch_log_group" "prometheus_evidence_lambda" {
  name              = local.lambda_log_group
  retention_in_days = 14
  tags              = var.tags
}

# Read-only Prometheus evidence Lambda. No VPC configuration is set because AMP
# is reached through the regional AMP endpoint and the repository does not define
# private AMP networking for Lambda.
resource "aws_lambda_function" "prometheus_evidence" {
  function_name    = local.lambda_name
  description      = "Read-only AMP evidence collector for Bedrock Agent action group."
  role             = aws_iam_role.prometheus_evidence_lambda.arn
  runtime          = "python3.12"
  handler          = "prometheus_evidence.handler.lambda_handler"
  filename         = data.archive_file.prometheus_evidence_lambda.output_path
  source_code_hash = data.archive_file.prometheus_evidence_lambda.output_base64sha256
  timeout          = var.lambda_timeout_seconds
  memory_size      = 256

  environment {
    variables = {
      AMP_QUERY_ENDPOINT          = local.amp_query_range_endpoint
      DEFAULT_NAMESPACE           = var.default_namespace
      DEFAULT_HOURS_BACK          = "1"
      MAX_HOURS_BACK              = "24"
      DEFAULT_MAX_SERIES          = "20"
      MAX_SERIES                  = "50"
      QUERY_STEP_SECONDS          = "60"
      AMP_REQUEST_TIMEOUT_SECONDS = "5"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.prometheus_evidence_lambda,
    aws_cloudwatch_log_group.prometheus_evidence_lambda
  ]

  tags = var.tags
}
