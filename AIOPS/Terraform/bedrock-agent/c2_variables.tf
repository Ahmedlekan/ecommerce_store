# AWS region where the Bedrock Agent and Prometheus evidence Lambda run.
variable "aws_region" {
  description = "AWS region where Bedrock Agent resources are created."
  type        = string
  default     = "us-east-1"
}

# Logical environment name used in AIOps resource names.
variable "environment_name" {
  description = "Environment name used in resource names."
  type        = string
  default     = "dev"
}

# Business division used to keep names consistent with existing Terraform stacks.
variable "business_division" {
  description = "Business division used in resource names."
  type        = string
  default     = "retail"
}

# Claude Sonnet 4.6 is enabled in this AWS account and region.
variable "foundation_model" {
  description = "Foundation model used by the Bedrock Agent."
  type        = string
  default     = "anthropic.claude-sonnet-4-6"
}

# Existing Lambda created by AIOPS/Terraform/prometheus-evidence.
variable "prometheus_evidence_lambda_name" {
  description = "Existing Prometheus evidence Lambda function name."
  type        = string
  default     = "retail-dev-prometheus-evidence"
}

# Stable alias name used to test and invoke the Bedrock Agent.
variable "agent_alias_name" {
  description = "Bedrock Agent alias name."
  type        = string
  default     = "dev"
}

# Tags applied to Bedrock Agent resources.
variable "tags" {
  description = "Tags applied to Bedrock Agent resources."
  type        = map(string)
  default = {
    Terraform = "true"
    Component = "AIOps"
  }
}
