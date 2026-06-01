# Read the existing orders database secret from AWS Secrets Manager so
# Terraform can create the RDS instance with the same credentials used by the app.
data "aws_secretsmanager_secret" "ordersdb_secret" {
  name = "orders-db-secret"
}

data "aws_secretsmanager_secret_version" "ordersdb_secret_value" {
  secret_id = data.aws_secretsmanager_secret.ordersdb_secret.id
}

locals {
  ordersdb_secret_json = jsondecode(data.aws_secretsmanager_secret_version.ordersdb_secret_value.secret_string)
}

# Provision the managed PostgreSQL instance used by the orders service.
resource "aws_db_instance" "orders_postgresql_rds" {
  identifier               = "${local.name}-orders-postgresql"
  engine                   = "postgres"
  engine_version           = "17.6"
  instance_class           = "db.t4g.micro"
  allocated_storage        = 20
  max_allocated_storage    = 100
  storage_type             = "gp3"
  db_name                  = "orders"
  username                 = local.ordersdb_secret_json.RETAIL_ORDERS_PERSISTENCE_USERNAME
  password                 = local.ordersdb_secret_json.RETAIL_ORDERS_PERSISTENCE_PASSWORD
  db_subnet_group_name     = aws_db_subnet_group.orders_postgresql_private.name
  vpc_security_group_ids   = [aws_security_group.orders_postgresql_sg.id]
  skip_final_snapshot      = true
  publicly_accessible      = false
  storage_encrypted        = true
  port                     = 5432
  delete_automated_backups = true
  multi_az                 = false
  backup_retention_period  = 1

  tags = {
    Name = "${local.name}-orders-postgresql-rds"
  }
}

output "orders_postgresql_rds_endpoint" {
  description = "RDS endpoint for the orders PostgreSQL database"
  value       = aws_db_instance.orders_postgresql_rds.address
}

output "orders_postgresql_rds_port" {
  description = "Port exposed by the orders PostgreSQL RDS instance"
  value       = aws_db_instance.orders_postgresql_rds.port
}
