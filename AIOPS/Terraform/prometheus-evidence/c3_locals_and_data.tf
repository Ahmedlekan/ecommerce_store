# Account and partition data are used to construct least-privilege ARNs.
data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}

# Shared local names mirror the existing retail-dev naming convention.
locals {
  owners      = var.business_division
  environment = var.environment_name
  name        = "${local.owners}-${local.environment}"

  lambda_name      = "${local.name}-prometheus-evidence"
  lambda_log_group = "/aws/lambda/${local.lambda_name}"

  amp_workspace_arn        = "arn:${data.aws_partition.current.partition}:aps:${var.aws_region}:${data.aws_caller_identity.current.account_id}:workspace/${var.amp_workspace_id}"
  amp_query_range_endpoint = "https://aps-workspaces.${var.aws_region}.amazonaws.com/workspaces/${var.amp_workspace_id}/api/v1/query_range"
}

# Package the local Lambda source directory for deployment.
data "archive_file" "prometheus_evidence_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../bedrock-agent/action-groups/prometheus-evidence/lambda"
  output_path = "${path.module}/prometheus-evidence-lambda.zip"
}
