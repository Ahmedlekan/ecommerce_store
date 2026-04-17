
output "vpc_id" {
  value       = module.vpc_module.vpc_id
  description = "The ID of the created VPC"
}

output "public_subnet_ids" {
  value       = module.vpc_module.public_subnet_ids
  description = "List of public subnet IDs"
}

output "private_subnet_ids" {
  value       = module.vpc_module.private_subnet_ids
  description = "List of private subnet IDs"
}

output "public_subnet_map" {
  value       = module.vpc_module.public_subnet_map
  description = "Map of AZ to Public Subnet ID"
}
