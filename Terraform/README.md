# Terraform Layout

This directory is split by infrastructure ownership and deployment path.

## Shared

`shared/backend` creates the S3 backend bucket used by Terraform state.

`shared/vpc` creates the shared VPC and exports subnet IDs used by the EKS stacks.

## EKS StatefulSet Path

`eks-statefulset/cluster-and-addons` creates the EKS cluster and platform add-ons for the Kubernetes StatefulSet deployment path.

Use this with:

```text
Kubernetes_manifest/statefulset_k8manifest
```

## EKS AWS Dataplane Path

`eks-aws-dataplane/cluster-and-addons` creates the EKS cluster and platform add-ons for the AWS-managed dataplane deployment path.

`eks-aws-dataplane/app-dataplane` creates the application AWS resources such as RDS, DynamoDB, ElastiCache, SQS, IAM policies, and Pod Identity associations.

Use this with:

```text
Kubernetes_manifest/aws_dataplane_k8manifest
```

## Apply Order

1. `shared/backend`
2. `shared/vpc/terraform-manifests`
3. One EKS cluster path:
   - `eks-statefulset/cluster-and-addons`
   - `eks-aws-dataplane/cluster-and-addons`
4. For the AWS dataplane path only: `eks-aws-dataplane/app-dataplane`
