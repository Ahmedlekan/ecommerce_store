# AWS Dataplane Mode

Use these manifests when a service should run against AWS-managed backends.

Examples:

- RDS for `catalog`
- DynamoDB for `cart`
- ElastiCache Redis for `checkout`
- RDS PostgreSQL and SQS for `orders`

These manifests are intended to be paired with `AWS/Terraform/eks-aws-dataplane/app-dataplane/`.

