# Action group exposes the read-only Prometheus evidence Lambda to the Agent.
# The OpenAPI schema is loaded from AWS/AIOPS/Schemas and permits only POST
# /metrics/evidence with the fixed infrastructure metric enum.
resource "aws_bedrockagent_agent_action_group" "prometheus_evidence" {
  agent_id                   = aws_bedrockagent_agent.aiops.agent_id
  agent_version              = "DRAFT"
  action_group_name          = local.action_group_name
  description                = "Read-only Prometheus/AMP evidence collection for EKS infrastructure metrics."
  action_group_state         = "ENABLED"
  prepare_agent              = true
  skip_resource_in_use_check = true

  action_group_executor {
    lambda = data.aws_lambda_function.prometheus_evidence.arn
  }

  api_schema {
    payload = local.prometheus_schema_body
  }

  depends_on = [
    aws_lambda_permission.allow_bedrock_prometheus_evidence
  ]
}
