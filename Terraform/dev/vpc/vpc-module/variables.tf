variable "environment_name" {
  description = "Environment name used in resource names and tags"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "subnet_newbits" {
  description = "Number of new bits to add to VPC CIDR to generate subnets"
  type        = number
}

variable "tags" {
  description = "Global tags to apply to all resources"
  type        = map(string)
}
