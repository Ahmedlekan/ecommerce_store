# Allows this Bedrock Agent to invoke the existing Prometheus evidence Lambda.
# The Lambda role still owns AMP access; the Agent role does not.
resource "aws_lambda_permission" "allow_bedrock_prometheus_evidence" {
  statement_id  = "AllowBedrockAgentInvokePrometheusEvidence"
  action        = "lambda:InvokeFunction"
  function_name = data.aws_lambda_function.prometheus_evidence.function_name
  principal     = "bedrock.amazonaws.com"
  source_arn    = aws_bedrockagent_agent.aiops.agent_arn
}
