# Catalog on AWS RDS

This manifest set deploys the `catalog` service with an external AWS RDS MySQL database instead of the in-cluster MySQL `StatefulSet`.

Files intentionally omitted from the `01_catalog_statefulset` variant:

- `01_catalog_mysql_service_account.yaml`
- `04_catalog_mysql_statefulset.yaml`
- `08_storage_class_ebs.yaml`

Why they are omitted:

- RDS runs outside Kubernetes, so no MySQL pod or MySQL pod service account is needed.
- No PVC or EBS `StorageClass` is needed for catalog database storage when the database is hosted in RDS.

Important configuration:

- Update `05_catalog_mysql_clusterip_service.yaml` and set `spec.externalName` to your real RDS endpoint.
- Store the RDS database username and password in AWS Secrets Manager under `catalog-db-secret`.
- Keep the JSON keys as `MYSQL_USER` and `MYSQL_PASSWORD` so the existing catalog startup command continues to work.

Apply this folder with:

```bash
kubectl apply -f 01_catalog_aws_rds/
```
