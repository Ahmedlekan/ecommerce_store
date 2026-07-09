# --------------------------------------------------------
# AWS Region (used in provider block)
# --------------------------------------------------------
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

# --------------------------------------------------------
# Environment & Business Division Info
# --------------------------------------------------------

# Logical environment name (used in tags and resource names)
variable "environment_name" {
  description = "Environment name used in resource names and tags"
  type        = string
  default     = "dev"
}

# Business unit or department (used in tags and naming)
variable "business_division" {
  description = "Business Division in the large organization this infrastructure belongs to"
  type        = string
  default     = "retail"
}

# --------------------------------------------------------
# ADOT Collector Namespace
# --------------------------------------------------------

# Kubernetes namespace where the ADOT collector ServiceAccount and collector pods run.
# This must match the namespace used by the OpenTelemetryCollector manifest.
variable "adot_collector_namespace" {
  description = "Kubernetes namespace for the ADOT collector resources"
  type        = string
  default     = "micro-tier"
}

# --------------------------------------------------------
# Amazon Managed Grafana Access
# --------------------------------------------------------

# IAM Identity Center user IDs that should be assigned Admin access to the Grafana workspace.
# These are Identity Store UserId values, not IAM user names or email addresses.
variable "grafana_admin_user_ids" {
  description = "IAM Identity Center user IDs to assign as Amazon Managed Grafana workspace admins"
  type        = list(string)
  default     = []
}

# --------------------------------------------------------
# Common Tags
# --------------------------------------------------------

# Tags applied to all resources created by this configuration
variable "tags" {
  description = "Tags to apply to EKS and related resources"
  type        = map(string)
  default = {
    Terraform = "true"
  }
}
