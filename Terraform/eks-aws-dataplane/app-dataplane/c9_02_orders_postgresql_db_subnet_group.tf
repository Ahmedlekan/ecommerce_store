# Place the orders PostgreSQL RDS instance into the private subnets used by the VPC.
resource "aws_db_subnet_group" "orders_postgresql_private" {
  name       = "${local.name}-orders-postgresql-private"
  subnet_ids = data.terraform_remote_state.vpc.outputs.private_subnet_ids

  tags = {
    Name = "${local.name}-orders-postgresql-private"
  }
}

output "orders_postgresql_db_subnet_group_name" {
  description = "DB subnet group name for the orders PostgreSQL RDS instance"
  value       = aws_db_subnet_group.orders_postgresql_private.name
}
