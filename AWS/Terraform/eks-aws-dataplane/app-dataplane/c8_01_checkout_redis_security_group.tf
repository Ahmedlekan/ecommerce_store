# Security group for the checkout Redis cluster.
# This allows Redis traffic from the EKS cluster into ElastiCache.
resource "aws_security_group" "checkout_redis_sg" {
  name        = "${local.name}-checkout-redis-sg"
  description = "Allow Redis access from EKS cluster"
  vpc_id      = data.terraform_remote_state.vpc.outputs.vpc_id

  ingress {
    description = "Allow Redis from EKS cluster security group"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    security_groups = [
      data.terraform_remote_state.eks.outputs.eks_cluster_security_group_id
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${local.name}-checkout-redis-sg"
    Environment = var.environment_name
    Component   = "Checkout Redis"
  }
}

output "checkout_redis_security_group_id" {
  description = "Security group ID for the checkout ElastiCache Redis cluster"
  value       = aws_security_group.checkout_redis_sg.id
}
