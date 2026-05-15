# Use existing AWS Secrets Manager Secret (already created manually)
data "aws_secretsmanager_secret" "catalogdb_secret" {
  name = "catalog-db-secret"
}

data "aws_secretsmanager_secret_version" "catalogdb_secret_value" {
  secret_id = data.aws_secretsmanager_secret.catalogdb_secret.id
}

locals {
  catalogdb_secret_json = jsondecode(data.aws_secretsmanager_secret_version.catalogdb_secret_value.secret_string)
}

# If you want to actually see the values just once (for validation), you can run:
# terraform output -json | jq -r '.debug_catalogdb_secret_MYSQL_USER.value'
# terraform output -json | jq -r '.debug_catalogdb_secret_MYSQL_PASSWORD.value'