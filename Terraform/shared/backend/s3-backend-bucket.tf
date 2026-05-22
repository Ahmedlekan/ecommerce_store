locals {
  backend_bucket_name = "tfstate-dev-us-east-1-ahmedlekan"

  backend_tags = {
    Terraform = "true"
    Purpose   = "terraform-backend"
    Project   = "ecommerce-store"
  }
}

resource "aws_s3_bucket" "vpc_backend" {
  bucket = local.backend_bucket_name

  tags = merge(local.backend_tags, {
    Name = local.backend_bucket_name
  })
}

# resource "aws_s3_bucket_versioning" "vpc_backend" {
#   bucket = aws_s3_bucket.vpc_backend.id

#   versioning_configuration {
#     status = "Enabled"
#   }
# }

resource "aws_s3_bucket_server_side_encryption_configuration" "vpc_backend" {
  bucket = aws_s3_bucket.vpc_backend.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "vpc_backend" {
  bucket = aws_s3_bucket.vpc_backend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "vpc_backend_bucket_name" {
  description = "S3 bucket name used for the VPC Terraform backend"
  value       = aws_s3_bucket.vpc_backend.bucket
}

