# Bedrock Agent ID for direct AWS CLI or console lookup.
output "bedrock_agent_id" {
  description = "Bedrock Agent ID."
  value       = aws_bedrockagent_agent.aiops.agent_id
}

# Bedrock Agent ARN for IAM/security review.
output "bedrock_agent_arn" {
  description = "Bedrock Agent ARN."
  value       = aws_bedrockagent_agent.aiops.agent_arn
}

# Alias ID for invoking the prepared agent alias.
output "bedrock_agent_alias_id" {
  description = "Bedrock Agent alias ID."
  value       = aws_bedrockagent_agent_alias.dev.agent_alias_id
}

# Action group name connected to the Prometheus evidence Lambda.
output "prometheus_action_group_name" {
  description = "Prometheus evidence action group name."
  value       = aws_bedrockagent_agent_action_group.prometheus_evidence.action_group_name
}
