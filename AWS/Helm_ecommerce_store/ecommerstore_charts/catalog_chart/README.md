# Catalog Helm Chart

This chart packages the stateful catalog deployment used in this repository:

- catalog application deployment
- optional in-cluster MySQL `StatefulSet`
- AWS Secrets Manager credentials mounted through the Secrets Store CSI driver
- optional monitoring resources
- environment-specific values files

## Prerequisites

- EKS cluster with:
  - Secrets Store CSI Driver installed
  - AWS provider for Secrets Store CSI installed
  - EKS Pod Identity configured for the `catalog` and `catalog-mysql-sa` service accounts
- AWS Secrets Manager secret named `catalog-db-secret`
- If `mysql.persistence.storageClass.create` is `false`, the configured storage class must already exist

## Secret shape

The chart expects the AWS Secrets Manager secret to contain:

```json
{
  "MYSQL_USER": "catalog",
  "MYSQL_PASSWORD": "change-me"
}
```

## Install examples

Development:

```bash
helm upgrade --install catalog ./catalog_chart \
  --namespace default \
  --values values.yaml \
  --values values-dev.yaml
```

Staging:

```bash
helm upgrade --install catalog ./catalog_chart \
  --namespace staging \
  --values values.yaml \
  --values values-staging.yaml
```

Production:

```bash
helm upgrade --install catalog ./catalog_chart \
  --namespace prod \
  --values values.yaml \
  --values values-prod.yaml
```

Override the image tag:

```bash
helm upgrade --install catalog ./catalog_chart \
  --namespace default \
  --values values.yaml \
  --set image.tag=latest
```

Use external MySQL or RDS instead of the in-cluster `StatefulSet`:

```bash
helm upgrade --install catalog ./catalog_chart \
  --namespace default \
  --values values.yaml \
  --set mysql.enabled=false \
  --set configMap.externalEndpoint=mydb.example.us-east-1.rds.amazonaws.com:3306
```

Create the gp3-like storage class from the chart:

```bash
helm upgrade --install catalog ./catalog_chart \
  --namespace default \
  --values values.yaml \
  --set mysql.persistence.storageClass.create=true
```

## Files

- `values.yaml`: default production-leaning settings
- `values-dev.yaml`: lower-scale development defaults
- `values-staging.yaml`: staging defaults
- `values-prod.yaml`: production defaults

## Notes for the remaining microservices

This chart only packages the catalog service for now. The same chart layout can be reused for:

- carts
- checkout
- orders
- ui

The usage model stays the same: base `values.yaml` plus environment overrides per service.
