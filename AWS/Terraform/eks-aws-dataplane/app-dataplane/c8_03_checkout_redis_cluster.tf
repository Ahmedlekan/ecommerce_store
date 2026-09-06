# Single-shard ElastiCache Redis replication group for the checkout service.
# This is the managed replacement for the in-cluster Redis deployment.
resource "aws_elasticache_replication_group" "checkout_redis" {
  replication_group_id       = "${local.name}-checkout-redis"
  description                = "Redis for checkout persistence"
  engine                     = "redis"
  engine_version             = "7.1"
  node_type                  = "cache.t3.micro"
  port                       = 6379
  parameter_group_name       = "default.redis7"
  num_cache_clusters         = 1
  automatic_failover_enabled = false
  multi_az_enabled           = false
  at_rest_encryption_enabled = false
  transit_encryption_enabled = false
  subnet_group_name          = aws_elasticache_subnet_group.checkout_redis.name
  security_group_ids         = [aws_security_group.checkout_redis_sg.id]

  tags = {
    Name        = "${local.name}-checkout-redis"
    Environment = var.environment_name
    Component   = "Checkout Redis"
  }
}

output "checkout_redis_primary_endpoint" {
  description = "Primary endpoint address for the checkout ElastiCache Redis cluster"
  value       = aws_elasticache_replication_group.checkout_redis.primary_endpoint_address
}

output "checkout_redis_port" {
  description = "Port used by the checkout ElastiCache Redis cluster"
  value       = aws_elasticache_replication_group.checkout_redis.port
}
