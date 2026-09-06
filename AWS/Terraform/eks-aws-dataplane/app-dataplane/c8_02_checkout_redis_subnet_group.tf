# Subnet group for the checkout Redis cluster.
# Private subnets keep ElastiCache reachable only inside the VPC.
resource "aws_elasticache_subnet_group" "checkout_redis" {
  name       = "${local.name}-checkout-redis-subnets"
  subnet_ids = data.terraform_remote_state.vpc.outputs.private_subnet_ids

  tags = {
    Name        = "${local.name}-checkout-redis-subnets"
    Environment = var.environment_name
    Component   = "Checkout Redis"
  }
}

output "checkout_redis_subnet_group_name" {
  description = "Subnet group name used by the checkout ElastiCache Redis cluster"
  value       = aws_elasticache_subnet_group.checkout_redis.name
}
