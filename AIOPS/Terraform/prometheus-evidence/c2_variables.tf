# AWS region. Existing observability Terraform and ADOT manifests use us-east-1.
variable "aws_region" {
  description = "AWS region where AMP and the Lambda function run."
  type        = string
  default     = "us-east-1"
}

# Logical environment name used for resource naming and tags.
variable "environment_name" {
  description = "Environment name used in AIOps resource names."
  type        = string
  default     = "dev"
}

# Business division used to keep names consistent with the existing Terraform.
variable "business_division" {
  description = "Business division used in resource names."
  type        = string
  default     = "retail"
}

# Existing AMP workspace ID from Observability/OpenTelemetry_terraform output.
variable "amp_workspace_id" {
  description = "Existing AMP workspace ID, for example ws-xxxxxxxx."
  type        = string
}

# Namespace is intentionally scoped to the existing application namespace.
variable "default_namespace" {
  description = "Default Kubernetes namespace for evidence queries."
  type        = string
  default     = "micro-tier"
}

# Lambda timeout is intentionally short but above a single AMP request timeout.
variable "lambda_timeout_seconds" {
  description = "Lambda timeout for bounded AMP evidence queries."
  type        = number
  default     = 25
}

# Tags applied to AIOps resources.
variable "tags" {
  description = "Tags applied to AIOps resources."
  type        = map(string)
  default = {
    Terraform = "true"
    Component = "AIOps"
  }
}
