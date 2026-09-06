# Security group for the orders PostgreSQL RDS instance.
resource "aws_security_group" "orders_postgresql_sg" {
  name        = "${local.name}-orders-postgresql-sg"
  description = "Allow PostgreSQL access from the EKS cluster to the orders RDS instance"
  vpc_id      = data.terraform_remote_state.vpc.outputs.vpc_id

  ingress {
    description = "Allow PostgreSQL from the EKS cluster security group"
    from_port   = 5432
    to_port     = 5432
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
    Name = "${local.name}-orders-postgresql-sg"
  }
}

output "orders_postgresql_security_group_id" {
  description = "Security group ID attached to the orders PostgreSQL RDS instance"
  value       = aws_security_group.orders_postgresql_sg.id
}
