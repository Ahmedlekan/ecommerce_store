# Legacy App Identity

These files are preserved for reference from the older layout:

- `c16-03-catalog-db-secret-pod-identity.tf`
- `c16-04-orders-db-secret-pod-identity.tf`

They are not the active source of truth anymore.

Active ownership for app secret access now lives in:

- `../../app_dataplane_aws/c5_02_secretstorecsi_iam_policy.tf`
- `../../app_dataplane_aws/c5_03_secretstorecsi_iam_policy.tf`

Do not apply both the legacy files and the active app dataplane files for the same service accounts.

