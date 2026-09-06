# Agent alias provides a stable target for testing and future application calls.
resource "aws_bedrockagent_agent_alias" "dev" {
  agent_id         = aws_bedrockagent_agent.aiops.agent_id
  agent_alias_name = var.agent_alias_name
  description      = "Dev alias for the AIOps Bedrock Agent."
  tags             = var.tags

  depends_on = [
    aws_bedrockagent_agent_action_group.prometheus_evidence
  ]
}
