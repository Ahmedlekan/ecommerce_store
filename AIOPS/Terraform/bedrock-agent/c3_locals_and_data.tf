# Account and partition data are used to build least-privilege ARNs.
data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}

# Read the existing Prometheus evidence Lambda instead of recreating it here.
data "aws_lambda_function" "prometheus_evidence" {
  function_name = var.prometheus_evidence_lambda_name
}

# Shared local values mirror the existing retail-dev naming convention.
locals {
  owners      = var.business_division
  environment = var.environment_name
  name        = "${local.owners}-${local.environment}"

  agent_name          = "${local.name}-aiops-agent"
  action_group_name   = "prometheus-evidence"
  agent_resource_name = "${local.name}-aiops-bedrock-agent"

  prometheus_schema_path = "${path.module}/../../Schemas/prometheus-evidence-action-group.openapi.yaml"
  prometheus_schema_body = file(local.prometheus_schema_path)

  foundation_model_arn = "arn:${data.aws_partition.current.partition}:bedrock:${var.aws_region}::foundation-model/${var.foundation_model}"
}
