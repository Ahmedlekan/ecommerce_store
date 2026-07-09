# EKS Pod Troubleshooting Runbook

This runbook is for debugging pods in this repository after deployment to Amazon EKS. It follows the actual pod startup path so failures are checked in the right order.

## Goal

Use this sequence:

`Scheduled -> Pulled -> Mounted -> Started -> Ready -> Reachable`

Do not jump straight to application logs. Many EKS pod failures happen before the container starts.

## Fast Triage

Start with these commands:

```bash
kubectl get pods -A
kubectl get pod <pod-name> -n <namespace> -o wide
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
kubectl get events -n <namespace> --sort-by=.lastTimestamp
```

If the container has already restarted:

```bash
kubectl logs <pod-name> -n <namespace> --previous
```

## 1. Scheduling

Check whether Kubernetes could place the pod on a node.

Look for:

- `FailedScheduling`
- insufficient CPU or memory
- taints and tolerations mismatch
- node selectors or affinity rules
- PVCs waiting for a volume

Commands:

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get nodes
kubectl top nodes
```

Questions:

- Was the pod assigned to a node?
- Does the target node have enough free resources?
- Is a storage dependency delaying scheduling?

## 2. Image Pull

Check whether the node can pull the container image.

Look for:

- `ErrImagePull`
- `ImagePullBackOff`
- wrong repository or tag
- missing image pull secret
- network egress problems

Commands:

```bash
kubectl describe pod <pod-name> -n <namespace>
```

Questions:

- Is the image name correct?
- Does the image exist in ECR or the external registry?
- Does the node role or pull secret allow access?

## 3. Volume Mounts

Check whether volumes are mounted before the container starts.

This is a high-value step for this repo because catalog uses the Secrets Store CSI driver to mount AWS Secrets Manager values.

Look for:

- `FailedMount`
- CSI driver errors
- missing `SecretProviderClass`
- PVC binding failures
- file permission issues on mounted volumes

Commands:

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get pvc -n <namespace>
kubectl get sc
kubectl get secretproviderclass -A
```

If using Secrets Store CSI:

```bash
kubectl get pods -n kube-system
kubectl get csidriver
kubectl describe pod <pod-name> -n <namespace>
```

Questions:

- Did the CSI driver mount succeed?
- Does the `SecretProviderClass` name match the pod volume definition?
- Does the workload depend on a file that never got mounted?

## 4. Service Account and AWS Identity

On EKS, confirm the pod has the expected Kubernetes service account and AWS identity wiring.

Look for:

- wrong `serviceAccountName`
- missing EKS Pod Identity association
- missing IRSA annotation if using IRSA
- missing token projection into the pod
- missing AWS credential env vars

Commands:

```bash
kubectl get pod <pod-name> -n <namespace> -o jsonpath="{.spec.serviceAccountName}"
kubectl get pod <pod-name> -n <namespace> -o jsonpath="{.metadata.namespace}"
kubectl get pod <pod-name> -n <namespace> -o yaml
aws eks list-pod-identity-associations --cluster-name <cluster-name>
```

For EKS Pod Identity, confirm the pod contains:

- `AWS_CONTAINER_CREDENTIALS_FULL_URI`
- `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE`
- a projected volume under `/var/run/secrets/pods.eks.amazonaws.com/serviceaccount`

Questions:

- Is the service account correct for this workload?
- Does the namespace match the Pod Identity association?
- Was the pod created after the association was added?

## 5. Secrets Store CSI Driver Checks

If the pod uses AWS Secrets Manager through the Secrets Store CSI driver, validate all four layers:

1. The Secrets Store CSI driver is installed.
2. The AWS provider is installed.
3. The workload has AWS identity permissions.
4. The `CSIDriver` object is configured to request service account tokens when Pod Identity is used.

Commands:

```bash
kubectl get pods -n kube-system | grep -E "secrets-store|provider-aws"
kubectl get csidriver secrets-store.csi.k8s.io -o yaml
kubectl describe pod <pod-name> -n <namespace>
```

Important signals:

- `FailedMount`
- `serviceAccount.tokens not provided`
- `AccessDeniedException`
- `SecretProviderClass not found`
- `failed to mount secrets store objects`

Repo-specific note:

The Terraform Helm release for the Secrets Store CSI driver must configure `tokenRequests` for EKS Pod Identity. Without it, kubelet does not pass the service account token to the CSI driver during mount.

File:

- [c16-01-secretstorecsi-helm-install.tf](C:\Users\PC\Documents\Coding_projects\ecommerce_store\Terraform\dev\EKS\EKS_terraform-manifests\c16-01-secretstorecsi-helm-install.tf:2)

## 6. Secrets Manager Data Validation

If the CSI mount succeeds but the app still fails, validate the secret contents.

For catalog, the secret must contain:

- `MYSQL_USER`
- `MYSQL_PASSWORD`

Commands:

```bash
aws secretsmanager describe-secret --secret-id catalog-db-secret --region us-east-1
aws secretsmanager get-secret-value --secret-id catalog-db-secret --region us-east-1
kubectl exec -it <pod-name> -n <namespace> -- ls /mnt/secrets-store
kubectl exec -it <pod-name> -n <namespace> -- cat /mnt/secrets-store/MYSQL_USER
kubectl exec -it <pod-name> -n <namespace> -- cat /mnt/secrets-store/MYSQL_PASSWORD
```

Questions:

- Does the secret exist?
- Do the expected keys exist?
- Does the application read the right mounted file names?

## 7. Container Startup

After scheduling, image pull, and mount succeed, inspect the container startup path.

Look for:

- bad `command` or `args`
- missing binaries
- shell quoting problems
- application exit on missing config
- dependency connection failures during startup

Commands:

```bash
kubectl logs <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --previous
kubectl get pod <pod-name> -n <namespace> -o yaml
```

Repo-specific note:

The catalog workloads export environment variables from mounted secret files before starting the process. If those files are empty or missing, startup fails later even though the pod may get past the mount phase.

Files:

- [06_catalog_deployment.yaml](C:\Users\PC\Documents\Coding_projects\ecommerce_store\Kubernetes_Ingress\Kubernetes_Ingress_http\http_retail_store_k8s_manifests\01_catalog\06_catalog_deployment.yaml:37)
- [04_catalog_mysql_statefulset.yaml](C:\Users\PC\Documents\Coding_projects\ecommerce_store\Kubernetes_Ingress\Kubernetes_Ingress_http\http_retail_store_k8s_manifests\01_catalog\04_catalog_mysql_statefulset.yaml:30)

## 8. Readiness and Liveness

A container can be running and still not be serving traffic.

Look for:

- failed readiness probes
- failed liveness probes
- wrong probe path or port
- application binding only to localhost

Commands:

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
kubectl get endpoints <service-name> -n <namespace>
```

Questions:

- Is the process actually listening on the expected port?
- Does the readiness probe match the application endpoint?
- Has the pod been added to the service endpoints?

## 9. Service and Port Validation

If the pod is healthy but unreachable, check the Service definition.

Look for:

- wrong service name
- wrong service selector
- wrong target port
- wrong port-forward target

Commands:

```bash
kubectl get svc -n <namespace>
kubectl describe svc <service-name> -n <namespace>
kubectl get endpoints <service-name> -n <namespace>
```

Examples from this repo:

- The catalog service name is `catalog`, not `catalog-service`.
- The catalog service exposes port `80`.
- The MySQL service exposes port `3306`.

Correct port-forward examples:

```bash
kubectl port-forward svc/catalog 7080:80
kubectl port-forward svc/catalog-mysql 3306:3306
```

## 10. In-Pod Connectivity Tests

Once the pod is running, test dependencies from inside the cluster.

Commands:

```bash
kubectl exec -it <pod-name> -n <namespace> -- sh
kubectl run netshoot --rm -it --image=nicolaka/netshoot --restart=Never -- sh
kubectl run mysql-client --rm -it --image=mysql:8.0 --restart=Never -- mysql -h catalog-mysql -u <user> -p'<password>'
```

Watch for:

- DNS failures
- wrong service names
- wrong ports
- missing passwords
- database users that do not match the current secret values

Important note:

If the MySQL client says `using password: NO`, the command did not send a password.

## 11. Resource and Node Health

If behavior is inconsistent, verify node health and pod resource settings.

Look for:

- `OOMKilled`
- CPU throttling
- disk pressure
- memory pressure
- container runtime issues on the node

Commands:

```bash
kubectl top pod -n <namespace>
kubectl top nodes
kubectl describe node <node-name>
```

Questions:

- Is the pod underprovisioned?
- Is the node healthy?
- Is the kubelet reporting pressure conditions?

## 12. Common EKS Failure Patterns

Use these patterns to narrow the root cause quickly.

### Pod stuck in `Pending`

Usually one of:

- failed scheduling
- unbound PVC
- failed CSI mount

### Pod stuck in `ContainerCreating`

Usually one of:

- image pull problem
- volume mount problem
- CSI driver problem

### Pod `Running` but not `Ready`

Usually one of:

- failed readiness probe
- application dependency failure
- bad config

### Pod restarts repeatedly

Usually one of:

- crash loop from app startup failure
- liveness probe failure
- memory pressure or `OOMKilled`

## 13. Repo-Specific Catalog Checks

For the catalog service in this repository, check these in order:

1. `catalog` and `catalog-mysql-sa` service accounts exist.
2. EKS Pod Identity associations exist for both in namespace `default`.
3. `catalog-db-secrets` `SecretProviderClass` exists.
4. `catalog-db-secret` exists in AWS Secrets Manager.
5. The secret contains `MYSQL_USER` and `MYSQL_PASSWORD`.
6. The Secrets Store CSI driver `CSIDriver` includes `tokenRequests`.
7. The `catalog` service exists and exposes the right port.

Useful commands:

```bash
kubectl get sa
kubectl get secretproviderclass
kubectl get svc
kubectl describe pod catalog-<suffix>
kubectl describe pod catalog-mysql-0
aws eks list-pod-identity-associations --cluster-name retail-dev-eksdemo1
```

## 14. Escalation Path

If the pod still fails after the steps above, collect these artifacts before changing anything:

```bash
kubectl get pod <pod-name> -n <namespace> -o yaml
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --previous
kubectl get events -n <namespace> --sort-by=.lastTimestamp
kubectl get svc -n <namespace>
kubectl get endpoints -n <namespace>
kubectl get pods -n kube-system
```

Then decide whether the root cause belongs to:

- Kubernetes scheduling
- image registry access
- storage or CSI
- AWS IAM or Pod Identity
- Secrets Manager data
- application startup
- readiness or service routing

## Summary

Use this order every time:

1. `kubectl describe pod`
2. check events
3. confirm image pull
4. confirm volume mounts
5. confirm AWS identity
6. confirm startup logs
7. confirm readiness
8. confirm service name and port

That sequence is faster and more reliable than starting from the application code or guessing from the pod phase alone.
