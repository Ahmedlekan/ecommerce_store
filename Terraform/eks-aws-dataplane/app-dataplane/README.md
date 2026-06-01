# AWS App Dataplane Stack

This stack owns AWS-managed backends and app-specific IAM or Pod Identity resources.

Included here:

- `catalog` RDS MySQL and secret access
- `cart` DynamoDB and Pod Identity
- `checkout` ElastiCache Redis
- `orders` RDS PostgreSQL, SQS, and secret access

This stack should be the only owner for app-specific AWS resources and app-specific Pod Identity associations used by the AWS dataplane manifests.

