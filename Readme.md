# 🚀 Advanced End-to-End DevSecOps Project: Micro-service Application on AWS with Docker, Kubernetes [EKS, HPA, KARPENTER], Terraform, Helm, ArgoCD, Github Action, GitOps, SonarQube, Prometheus, Grafana, OpenTelemetry, Cloudwatch, X-Ray #

📌 Introduction

This project demonstrates a complete DevSecOps pipeline for deploying a micro-service application on AWS. It brings together Infrastructure as Code, containerization, Kubernetes orchestration, GitOps, CI/CD automation, security scanning, and observability into a single, production-grade workflow.

The goal is to showcase how to design, secure, deploy, and monitor a scalable cloud-native application with modern DevSecOps practices.

Required Prerequisites:

AWS Account: Active AWS account with permissions to create resources (EKS, VPC, RDS, EC2, etc.). Free tier works for initial modules.

Computer: System capable of running SSH and web browsers (any OS: Windows, macOS, Linux). We'll use EC2 for Docker demos, so no need for Docker Desktop locally.

Basic Command Line: Familiarity with terminal/command prompt and basic Linux commands.

Text Editor: Any code editor (VS Code recommended) for editing configuration files.

Internet Connection: Stable connection for AWS console access and downloading tools.
Helpful (But Not Mandatory):

Basic Programming: Understanding of basic programming concepts helps with microservices code, but not required.

AWS Basics: Familiarity with core AWS concepts (EC2, VPC, IAM) is helpful but we cover what's needed.

Version Control: Basic Git knowledge beneficial for CI/CD section.
Networking Fundamentals: Understanding of IP addresses, subnets, and ports enhances learning.



# Instrumentation


# Docker


# Terraform on AWS EKS Cluster with AddOns (LBC, EBS CSI, Secret Store CSI)

# Step-01

## 🔧 EKS Add-ons Overview

These add-ons extend Kubernetes functionality on AWS EKS for security, networking, storage, and secrets management.

| Add-On | Purpose |
|--------|--------|
| **Pod Identity Agent** | Enables Pods to assume IAM roles securely without storing credentials. |
| **AWS Load Balancer Controller (LBC)** | Manages ALBs/NLBs for Ingress resources and Service type LoadBalancer. |
| **EBS CSI Driver** | Enables dynamic provisioning of Amazon EBS volumes for stateful workloads. |
| **Secrets Store CSI Driver + ASCP** | Mounts AWS Secrets Manager / SSM Parameter Store secrets directly into Pods. |


# Step-02: Project Structure

## 📁 Terraform EKS Cluster with Add-ons

```bash
13_Terraform_EKS_Cluster_with_AddOns/
│
├── 01_VPC_terraform-manifests/                # Stage 1 - Networking foundation
│   ├── c1-versions.tf                         # Terraform + provider versions
│   ├── c2-variables.tf                        # Input variables for VPC
│   ├── c3-vpc.tf                              # VPC, subnets, route tables, NAT gateways, etc.
│   ├── c4-outputs.tf                          # VPC outputs (IDs, subnet lists, etc.)
│   ├── terraform.tfvars                       # Environment-specific variable values
│   │
│   └── modules/
│       └── vpc/                               # Reusable VPC module
│           ├── datasources-and-locals.tf
│           ├── main.tf
│           ├── outputs.tf
│           └── variables.tf
│
│
├── 02_EKS_terraform-manifests_with_addons/    # Stage 2 - EKS + AddOns deployment
│   ├── c1_versions.tf                         # Terraform and AWS provider versions
│   ├── c2_variables.tf                        # EKS input variables (cluster name, region)
│   ├── c3_remote-state.tf                     # Remote backend (S3 + DynamoDB)
│   ├── c4_datasources_and_locals.tf           # Data lookups (VPC, subnets, etc.)
│   ├── c5_eks_tags.tf                         # Common tagging for EKS resources
│   ├── c6_eks_cluster_iamrole.tf              # IAM Role for EKS Control Plane
│   ├── c7_eks_cluster.tf                      # Main EKS cluster resource
│   ├── c8_eks_nodegroup_iamrole.tf            # IAM role for EKS node group
│   ├── c9_eks_nodegroup_private.tf            # Private worker node group
│   ├── c10_eks_outputs.tf                     # Cluster outputs (kubeconfig, ARNs, etc.)
│
│   # --- Pod Identity Agent ---
│   ├── c11-podidentityagent-eksaddon.tf       # Installs EKS Pod Identity Agent addon
│   ├── c12-helm-and-kubernetes-providers.tf   # Helm & Kubernetes providers for subsequent addons
│   ├── c13-podidentity-assumerole.tf          # Common IAM assume-role policy for Pod Identity
│
│   # --- AWS Load Balancer Controller (LBC) ---
│   ├── c14-01-lbc-iam-policy-datasources.tf
│   ├── c14-02-lbc-iam-policy-and-role.tf
│   ├── c14-03-lbc-eks-pod-identity-association.tf
│   ├── c14-04-lbc-helm-install.tf
│
│   # --- Amazon EBS CSI Driver ---
│   ├── c15-01-ebscsi-iam-policy-and-role.tf
│   ├── c15-02-ebscsi-eks-pod-identity-association.tf
│   ├── c15-03-ebscsi-eksaddon.tf
│
│   # --- Secrets Store CSI Driver + AWS Provider (ASCP) ---
│   ├── c16-01-secretstorecsi-helm-install.tf
│   ├── c16-02-secretstorecsi-ascp-helm-install.tf
│
│   ├── terraform.tfvars                       # Default variables for EKS deployment
│   │
│   └── env/                                   # Environment overrides
│       ├── dev.tfvars
│       ├── staging.tfvars
│       └── prod.tfvars
│
│
├── create-cluster.sh                          # Wrapper to apply both VPC + EKS stages
├── destroy-cluster.sh                         # Wrapper to destroy EKS first, then VPC
└── README.md                                  # Documentation for the entire workflow

```

## Execution Flow (In Order)

1. Stage-1 → VPC

    - Run automatically via create-cluster.sh
    - Provisions VPC, subnets, NATs, and outputs network IDs

2. Stage-2 → EKS Cluster + AddOns

    - Uses VPC outputs from remote state

    - Builds EKS Cluster, NodeGroups, IAM roles

    - Installs:

        - EKS Pod Identity Agent
        - AWS Load Balancer Controller
        - Amazon EBS CSI Driver
        - Secrets Store CSI Driver + ASCP
3. Post-Deploy

    - Update kubeconfig
    - Verify add-on pods under kube-system
    - Confirm IAM Pod Identity associations


# Step-03: Provision the EKS Cluster

Step-03-01: Create VPC

```bash
# Change Directory 
cd ../terraform-manifests

# Initialize Terraform
terraform init

# Validate syntax
terraform validate

# Preview the plan
terraform plan

# Apply configuration 
terraform apply -auto-approve
```
Step-03-02: Create EKS Cluster

```bash
# Change Directory 
cd .../EKS_terraform-manifests_with_addons

# Initialize Terraform
terraform init

# Validate syntax
terraform validate

# Preview the plan
terraform plan

# Apply configuration 
terraform apply -auto-approve
```

Step-03-03: Configure kubectl cli to access EKS cluster

```bash
# EKS kubeconfig
aws eks update-kubeconfig --name <cluster_name> --region <aws_region>
aws eks update-kubeconfig --name retail-dev-eksdemo1 --region us-east-1

# List Kubernetes Nodes
kubectl get nodes

# List Kubernetes Pods 
kubectl get pods -n kube-system
```
✅ Expected key pods:

```bash
NAME                                                       READY   STATUS    AGE
aws-load-balancer-controller-xxxxx                         1/1     Running   5m
ebs-csi-controller-xxxxx                                   1/1     Running   3m
csi-secrets-store-secrets-store-csi-driver-xxxxx           3/3     Running   2m
secrets-provider-aws-secrets-store-csi-driver-provider-aws 1/1     Running   2m
eks-pod-identity-agent-xxxxx                               1/1     Running   1m
```

# Step-04: Secrets Store CSI Driver, AWS Provider, and EKS Pod Identity

This step explains how Kubernetes workloads running on EKS can read secrets from AWS Secrets Manager without storing long-lived AWS credentials inside pods.

The goal is to use this flow:

```bash
Kubernetes Pod
  -> Kubernetes ServiceAccount
  -> EKS Pod Identity Association
  -> IAM Role
  -> IAM Policy
  -> AWS Secrets Manager Secret
```

## Why This Is Needed

Installing the Secrets Store CSI Driver and the AWS Secrets Provider only installs the Kubernetes components that know how to mount external secrets into pods.

Those add-ons do **not** automatically give application pods permission to read AWS Secrets Manager secrets.

For a pod to read a secret, it still needs AWS IAM permissions. In this project, those permissions are granted through **EKS Pod Identity**.

## Secrets Store CSI Driver

The Secrets Store CSI Driver is a Kubernetes CSI driver that allows pods to mount secrets from external secret stores as files inside the pod.

In simple terms:

```bash
Secrets Store CSI Driver = Kubernetes component that mounts external secrets into pods
```

It does not own the secret and it does not decide which AWS secret a pod can read. It only provides the Kubernetes mounting mechanism.

Terraform file:

```bash
Terraform/dev/EKS/EKS_terraform-manifests/c16-01-secretstorecsi-helm-install.tf
```

This file installs the driver using Helm:

```hcl
resource "helm_release" "secrets_store_csi_driver" {
  name       = "csi-secrets-store"
  repository = "https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts"
  chart      = "secrets-store-csi-driver"
  namespace  = "kube-system"
}
```

Important setting:

```hcl
set = [
  {
    name  = "syncSecret.enabled"
    value = "true"
  },
]
```

This allows mounted external secrets to also be synced into native Kubernetes `Secret` objects when a `SecretProviderClass` is configured to do so.

## AWS Secrets and Configuration Provider

The AWS Secrets and Configuration Provider is also called **ASCP**.

ASCP is the AWS-specific provider that allows the Secrets Store CSI Driver to read from:

- AWS Secrets Manager
- AWS Systems Manager Parameter Store

In simple terms:

```bash
AWS Secrets Provider = AWS plugin that knows how to retrieve AWS secrets
```

Terraform file:

```bash
Terraform/dev/EKS/EKS_terraform-manifests/c16-02-secretstorecsi-ascp-helm-install.tf
```

This file installs the AWS provider using Helm:

```hcl
resource "helm_release" "aws_secrets_provider" {
  name       = "secrets-provider-aws"
  repository = "https://aws.github.io/secrets-store-csi-driver-provider-aws"
  chart      = "secrets-store-csi-driver-provider-aws"
  namespace  = "kube-system"
}
```

Important setting:

```hcl
set = [
  {
    name  = "secrets-store-csi-driver.install"
    value = "false"
  }
]
```

This prevents the AWS provider chart from installing another copy of the CSI driver, because the CSI driver is already installed separately.

## EKS Pod Identity

EKS Pod Identity allows a Kubernetes service account to assume an AWS IAM role.

This avoids putting AWS access keys inside Kubernetes secrets, pods, or application code.

The trust policy used by Pod Identity is defined here:

```bash
Terraform/dev/EKS/EKS_terraform-manifests/c13-podidentity-assumerole.tf
```

The trusted AWS service is:

```hcl
principals {
  type        = "Service"
  identifiers = ["pods.eks.amazonaws.com"]
}
```

The allowed STS actions are:

```hcl
actions = [
  "sts:AssumeRole",
  "sts:TagSession"
]
```

This means EKS pods can assume IAM roles only when an EKS Pod Identity association exists.

## Catalog DB Secret Access

For the catalog database, this project uses a least-privilege IAM setup.

Terraform file:

```bash
Terraform/dev/EKS/EKS_terraform-manifests/c16-03-catalog-db-secret-pod-identity.tf
```

This file creates:

- IAM policy for reading only `catalog-db-secret*`
- IAM role for catalog database secret access
- IAM policy attachment
- EKS Pod Identity associations
- Terraform outputs for the policy, role, and association

## Catalog DB Secret Permission Chain

The permission chain for the MySQL pod looks like this:

```bash
catalog-mysql pod
  -> ServiceAccount: catalog-mysql-sa
  -> EKS Pod Identity Association
  -> IAM Role: retail-dev-catalog-db-secrets-role
  -> IAM Policy: retail-dev-catalog-db-secret-policy
  -> AWS Secrets Manager: catalog-db-secret*
```

The permission chain for the catalog application pod looks like this:

```bash
catalog application pod
  -> ServiceAccount: catalog
  -> EKS Pod Identity Association
  -> IAM Role: retail-dev-catalog-db-secrets-role
  -> IAM Policy: retail-dev-catalog-db-secret-policy
  -> AWS Secrets Manager: catalog-db-secret*
```

## Least Privilege

The IAM policy allows only these actions:

```bash
secretsmanager:GetSecretValue
secretsmanager:DescribeSecret
```

Only this secret name pattern is allowed:

```bash
catalog-db-secret*
```

The wildcard is intentional because AWS Secrets Manager ARNs often include a random suffix after the secret name.

Example allowed secret ARNs:

```bash
arn:aws:secretsmanager:us-east-1:<account-id>:secret:catalog-db-secret
arn:aws:secretsmanager:us-east-1:<account-id>:secret:catalog-db-secret-AbCdEf
```

This policy does not allow access to unrelated secrets such as:

```bash
checkout-secret
orders-db-secret
catalog-api-key
```

## Important Terraform Variables

The catalog DB secret Pod Identity file includes these variables:

```hcl
variable "catalog_db_secret_namespace" {
  default = "default"
}

variable "catalog_db_secret_service_accounts" {
  default = [
    "catalog-mysql-sa",
    "catalog"
  ]
}

variable "catalog_db_secret_name_prefix" {
  default = "catalog-db-secret"
}
```

If the application is deployed into the `micro-tier` namespace or any namesapce you give, update:

```hcl
catalog_db_secret_namespace = "micro-tier"
```

The namespace in Terraform must match the namespace where the Kubernetes service account exists.

## Kubernetes Requirement

The pod that needs the secret must use the same service account from the Pod Identity association.

Example:

```yaml
serviceAccountName: catalog-mysql-sa
```

or:

```yaml
serviceAccountName: catalog
```

If the pod uses a different service account, it will not receive the IAM permissions.

It is okay if the service account does not exist before Terraform creates the Pod Identity association. The service account can be created later, but the name and namespace must match.

## Apply Terraform

Run Terraform from the EKS manifest directory:

```bash
cd Terraform/dev/EKS/EKS_terraform-manifests

terraform init
terraform validate
terraform plan
terraform apply
```

## Verify The Add-ons

Check that the EKS Pod Identity Agent is installed:

```bash
aws eks list-addons \
  --cluster-name <eks-cluster-name> \
  --region us-east-1
```

Expected add-on:

```bash
eks-pod-identity-agent
```

Check the Secrets Store CSI Driver and AWS provider pods:

```bash
kubectl get pods -n kube-system
```

Expected pods should include:

```bash
csi-secrets-store-secrets-store-csi-driver-xxxxx
secrets-provider-aws-secrets-store-csi-driver-provider-aws-xxxxx
eks-pod-identity-agent-xxxxx
```

## Verify Pod Identity Association

List Pod Identity associations:

```bash
aws eks list-pod-identity-associations \
  --cluster-name <eks-cluster-name> \
  --region us-east-1
```

Expected association:

```bash
namespace: default
serviceAccount: catalog-mysql-sa
roleArn: arn:aws:iam::<account-id>:role/retail-dev-catalog-db-secrets-role

namespace: default
serviceAccount: catalog
roleArn: arn:aws:iam::<account-id>:role/retail-dev-catalog-db-secrets-role
```

## Create The Catalog DB Secret In AWS Secrets Manager

Create the AWS Secrets Manager secret that stores the database username and password.

The secret name must match the `objectName` used later in the `SecretProviderClass`.

For this project, the secret name is:

```bash
catalog-db-secret
```

Create the secret:

```bash
aws secretsmanager create-secret \
  --name catalog-db-secret \
  --region us-east-1 \
  --description "MySQL credentials for Catalog microservice" \
  --secret-string '{
    "MYSQL_USER": "username",
    "MYSQL_PASSWORD": "password"
  }'
```

Verify the secret exists:

```bash
aws secretsmanager describe-secret \
  --secret-id catalog-db-secret \
  --region us-east-1
```

Verify the secret value only when needed:

```bash
aws secretsmanager get-secret-value \
  --secret-id catalog-db-secret \
  --region us-east-1 \
  --query SecretString \
  --output text
```

The secret value should contain:

```json
{
  "MYSQL_USER": "username",
  "MYSQL_PASSWORD": "password"
}
```

## Create The SecretProviderClass

After the IAM role and Pod Identity associations are ready, create a Kubernetes `SecretProviderClass`.

Manifest file:

```bash
Kubernetes_Ingress/Kubernetes_Ingress_http/http_retail_store_k8s_manifests/01_catalog/02_catalog_secretproviderclass.yaml
```

The `SecretProviderClass` tells the Secrets Store CSI Driver:

- Which AWS secret to read
- Which keys to extract
- That the pod should authenticate using EKS Pod Identity

Current manifest:

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: catalog-db-secrets
spec:
  provider: aws
  parameters:
    usePodIdentity: "true"
    objects: |
      - objectName: "catalog-db-secret"
        objectType: "secretsmanager"
        jmesPath:
          - path: "MYSQL_USER"
            objectAlias: "MYSQL_USER"
          - path: "MYSQL_PASSWORD"
            objectAlias: "MYSQL_PASSWORD"
```

This configuration:

- Reads `catalog-db-secret` from AWS Secrets Manager.
- Extracts `MYSQL_USER`.
- Extracts `MYSQL_PASSWORD`.
- Mounts the values as files inside the pod.
- Uses EKS Pod Identity for AWS authentication.
- Does not create a native Kubernetes Secret.

The mounted files are:

```bash
/mnt/secrets-store/MYSQL_USER
/mnt/secrets-store/MYSQL_PASSWORD
```

## How The Secret Is Mounted Into MySQL

The catalog MySQL StatefulSet uses this service account:

```yaml
serviceAccountName: catalog-mysql-sa
```

It mounts the `SecretProviderClass` as a CSI volume:

```yaml
volumes:
  - name: aws-secrets
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: catalog-db-secrets
```

The volume is mounted into the MySQL container:

```yaml
volumeMounts:
  - name: aws-secrets
    mountPath: /mnt/secrets-store
    readOnly: true
```

The MySQL container reads the mounted files and exports them as environment variables before starting MySQL:

```bash
export MYSQL_USER="$(cat /mnt/secrets-store/MYSQL_USER)";
export MYSQL_PASSWORD="$(cat /mnt/secrets-store/MYSQL_PASSWORD)";
exec docker-entrypoint.sh mysqld
```

## How The Catalog App Uses The Same Secret

The catalog application also needs the same database username and password so it can connect to MySQL.

It uses this service account:

```yaml
serviceAccountName: catalog
```

It mounts the same `SecretProviderClass`:

```yaml
secretProviderClass: catalog-db-secrets
```

Then it maps the mounted file values to the environment variables expected by the catalog application:

```bash
export RETAIL_CATALOG_PERSISTENCE_USER="$(cat /mnt/secrets-store/MYSQL_USER)";
export RETAIL_CATALOG_PERSISTENCE_PASSWORD="$(cat /mnt/secrets-store/MYSQL_PASSWORD)";
exec /app/main
```

## Important Note About Synchronization

In this project, we are using the more secure file-mounted mode.

That means AWS Secrets Manager is **not synchronized into a native Kubernetes Secret**.

The flow is:

```bash
AWS Secrets Manager
  -> Secrets Store CSI Driver
  -> mounted files in the pod
  -> application reads files at startup
```

## Apply The Catalog Manifests

Apply the catalog manifests in this order:

```bash
cd Kubernetes_Ingress/Kubernetes_Ingress_http/http_retail_store_k8s_manifests/


## Verify The Secret Mount

Check the MySQL pod:

```bash
kubectl get pods
kubectl describe pod <catalog-mysql-pod-name>
```

Look for the CSI volume:

```bash
secrets-store.csi.k8s.io
catalog-db-secrets
```

Verify the mounted files from inside the pod:

```bash
kubectl exec -it <catalog-mysql-pod-name> -- ls /mnt/secrets-store
```

Expected files:

```bash
MYSQL_USER
MYSQL_PASSWORD
```

If the pod cannot mount the secret, check:

- The AWS secret name is `catalog-db-secret`.
- The `SecretProviderClass` name is `catalog-db-secrets`.
- The pod service account is associated with the IAM role through EKS Pod Identity.
- The IAM policy allows `secretsmanager:GetSecretValue` for `catalog-db-secret*`.
- The Secrets Store CSI Driver and AWS provider pods are running in `kube-system`.



# Step 7: Install & Configure ArgoCD

We will be deploying our agrocd application on a micro-tier namespace.

To do that, we will create a micro-tier namespace on EKS

```bash
kubectl create namespace micro-tier
```

# Step 8: CI - Github Action to AWS ECR

<img width="1296" height="707" alt="Image" src="https://github.com/user-attachments/assets/a9a3abf9-f864-43b3-96f1-a1cdfa80a331" />

Step-08-01: Create ECR Repository

```bash
# Create ECR repository for UI microservice
aws ecr create-repository \
  --repository-name ecommerce-store/ui \
  --region us-east-1

# Expected output:
# {
#     "repository": {
#         "repositoryArn": "arn:aws:ecr:us-east-1:123456789012:repository/ecommerce-store/ui",
#         "repositoryName": "ecommerce-store/ui",
#         "repositoryUri": "123456789012.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/ui"
#     }
# }
```

```bash
# Create ECR repository for orders microservice
aws ecr create-repository \
  --repository-name ecommerce-store/orders \
  --region us-east-1
```
```bash
# Create ECR repository for checkout microservice
aws ecr create-repository \
  --repository-name ecommerce-store/checkout \
  --region us-east-1
```

```bash
# Create ECR repository for cart microservice
aws ecr create-repository \
  --repository-name ecommerce-store/cart \
  --region us-east-1
```

```bash
# Create ECR repository for catalog microservice
aws ecr create-repository \
  --repository-name ecommerce-store/catalog \
  --region us-east-1
```

Step-08-02: Create GitHub OIDC IAM Role

```bash
# Set your configuration
AWS_REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
GITHUB_REPO="Ahmedlekan/ecommerce_store"  
ROLE_NAME="github-actions-oidc-role-ui3"

# Verify variables are set correctly
echo "AWS Region: $AWS_REGION"
echo "Account ID: $ACCOUNT_ID"
echo "GitHub Repo: $GITHUB_REPO"
echo "IAM Role Name: $ROLE_NAME"
```

Step-08-03: Generate Trust Policy

```bash
# Generate trust-policy.json with automatic variable substitution
cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_REPO}:*"
        }
      }
    }
  ]
}
EOF

# Verify the generated file
echo "Trust policy created. Contents:"
cat trust-policy.json
```

***What this does***: Allows GitHub Actions from your repository to assume this IAM role using OIDC tokens (no AWS keys needed!)

Step-08-04: Create IAM Role

```bash
# Verify the trust policy before creating role
cat trust-policy.json | jq '.'

# Create the IAM role
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://trust-policy.json

# Expected output:
# {
#     "Role": {
#         "RoleName": "github-actions-oidc-role-ui3",
#         "Arn": "arn:aws:iam::123456789012:role/github-actions-oidc-role-ui3",
#         ...
#     }
# }
```
Copy the Role ARN - you'll need!

Step-08-05: Attach ECR Permissions

```bash
# Attach AWS managed policy for ECR push/pull access
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

# Verify policy is attached
aws iam list-attached-role-policies --role-name $ROLE_NAME
```
What this grants:

    - Push images to ECR
    - Pull images from ECR
    - Manage ECR repositories
    -Get ECR authentication tokens

Step-08-06: Create the OIDC Provider in Your AWS Account

```bash
# List OIDC Providers
aws iam list-open-id-connect-providers

# Create OIDC Provider
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com 

# List OIDC Providers
aws iam list-open-id-connect-providers

# Expected Output
# {                                                                                               
#     "OpenIDConnectProviderList": [
#         {
#             "Arn": "arn:aws:iam::123456789:oidc-provider/token.actions.githubusercontent.com"
#         }
#     ]
# }
```

Step-08-07: Configure GitHub Actions CI Workflow

<img width="1833" height="811" alt="Image" src="https://github.com/user-attachments/assets/35b5aea8-5447-42c9-9285-bb176b2102d8" />


At this stage, we are only creating **Continuous Integration (CI)**.

CI is responsible for proving that the application code is healthy before it is merged or released. It does **not** deploy the application, push Docker images, or connect to AWS.

The CI workflow file is located at:

```bash
.github/workflows/ci.yml
```

## What This CI Workflow Does

The application has five microservices:

| Microservice | Runtime | CI Checks |
|-------------|---------|-----------|
| catalog | Go | Build and test |
| cart | Java/Maven | Build, test, and lint |
| checkout | Node.js/NestJS/Yarn | Build, test, and lint |
| orders | Java/Maven | Build, test, and lint |
| ui | Java/Maven | Build, test, and lint |

Each microservice has its own GitHub Actions job. This is important because one service can fail without hiding the status of the others.

For example:

```bash
catalog   -> build/test
cart      -> build/test/lint
checkout  -> build/test/lint
orders    -> build/test/lint
ui        -> build/test/lint
```

## Why Each Service Has Its Own CI Job

Using separate jobs gives us:

- Faster feedback because jobs run in parallel.
- Clear failure reporting per microservice.
- Better production readiness because every service has its own quality gate.
- Easier troubleshooting because a failed job points directly to the affected service.

## When The Workflow Runs

The CI workflow runs automatically when:

1. A pull request is opened or updated.
2. Code is pushed to the `main` branch.

```yaml
on:
  pull_request:
  push:
    branches:
      - main
```

This means every pull request is checked before merge, and the `main` branch is checked after new code lands.

## CI Workflow Process

The process looks like this:

```bash
Developer creates a branch
Developer pushes code to GitHub
Developer opens a pull request
GitHub Actions starts the CI workflow
Each microservice runs its own CI job
The pull request should only be merged after CI passes
```

## Service CI Breakdown

### catalog

The `catalog` service is written in Go.

The CI job:

1. Checks out the repository.
2. Installs Go.
3. Installs Node.js because Nx is used as the command runner.
4. Installs root workspace dependencies.
5. Runs the catalog build.
6. Runs the catalog test target.

Main commands:

```bash
npm ci
npx nx build catalog
npx nx test catalog
```

### cart

The `cart` service is a Java/Maven service.

The CI job:

1. Checks out the repository.
2. Installs Java 21.
3. Installs Node.js because Nx is used as the command runner.
4. Installs root workspace dependencies.
5. Makes the Maven wrapper executable on Linux.
6. Builds the service.
7. Runs unit tests.
8. Runs checkstyle linting.

Main commands:

```bash
npm ci
chmod +x src/cart/mvnw
npx nx build cart
npx nx test cart
npx nx lint cart
```

### checkout

The `checkout` service is a Node.js/NestJS service.

The CI job:

1. Checks out the repository.
2. Installs Node.js.
3. Enables Corepack so Yarn is available.
4. Installs dependencies from `yarn.lock`.
5. Builds the service.
6. Runs tests.
7. Runs ESLint.

Main commands:

```bash
corepack enable
yarn install --frozen-lockfile
yarn build
yarn test
yarn lint
```

### orders

The `orders` service is a Java/Maven service.

The CI job:

1. Checks out the repository.
2. Installs Java 21.
3. Installs Node.js because Nx is used as the command runner.
4. Installs root workspace dependencies.
5. Makes the Maven wrapper executable on Linux.
6. Builds the service.
7. Runs unit tests.
8. Runs checkstyle linting.

Main commands:

```bash
npm ci
chmod +x src/orders/mvnw
npx nx build orders
npx nx test orders
npx nx lint orders
```

### ui

The `ui` service is a Java/Maven Spring Boot service.

The CI job:

1. Checks out the repository.
2. Installs Java 21.
3. Installs Node.js because Nx is used as the command runner.
4. Installs root workspace dependencies.
5. Makes the Maven wrapper executable on Linux.
6. Builds the service.
7. Runs unit tests.
8. Runs checkstyle linting.

Main commands:

```bash
npm ci
chmod +x src/ui/mvnw
npx nx build ui
npx nx test ui
npx nx lint ui
```

## How To Test The CI Workflow

Create a branch:

```bash
git checkout -b test-ci
```

Add and commit the workflow:

```bash
git add .github/workflows/ci.yml Readme.md
git commit -m "Add microservice CI workflow"
```

Push the branch:

```bash
git push origin test-ci
```

Open GitHub and click:

```bash
Compare & pull request
```

After creating the pull request, go to the **Actions** tab or the pull request checks section.

You should see these jobs:

```bash
catalog - build and test
cart - build, test, and lint
checkout - build, test, and lint
orders - build, test, and lint
ui - build, test, and lint
```

If all five jobs pass, the CI workflow is working correctly.

## Recommended Branch Protection

After the CI workflow is stable, configure branch protection for `main`.

In GitHub:

```bash
Settings -> Branches -> Branch protection rules
```

Recommended settings:

- Require a pull request before merging.
- Require status checks to pass before merging.
- Select the five CI jobs as required checks.
- Do not allow direct pushes to `main`.

This makes CI a real quality gate instead of only a notification.

## Important Production Note

This workflow is only CI.

It does not:

- Build Docker images.
- Push images to AWS ECR.
- Deploy to Kubernetes.
- Deploy to production.

Those actions belong in a separate CD workflow. The next step is to create a separate workflow that builds Docker images for each microservice and pushes them to AWS ECR after CI passes.

# Step-08-08: Build And Push Docker Images To AWS ECR

<img width="1837" height="831" alt="Image" src="https://github.com/user-attachments/assets/9137830b-a3ee-4a3c-b573-ceaf7dd47c0f" />

After the CI workflow is working, the next step is to package each microservice into a Docker image and push those images to AWS ECR.

This is the first Continuous Delivery (CD) step, but it is **not deployment**.

This workflow only:

- Authenticates GitHub Actions to AWS using OIDC.
- Logs in to Amazon ECR.
- Builds Docker images for the five microservices.
- Tags each image with the Git commit SHA.
- Pushes the images to ECR.

It does not:

- Deploy to EKS.
- Update Kubernetes manifests.
- Run Helm.
- Run ArgoCD.
- Change production.

The workflow file is located at:

```bash
.github/workflows/build-and-push-ecr.yml
```

## Why This Is Separate From CI

CI answers this question:

```bash
Is the code good enough to merge?
```

The ECR image workflow answers this question:

```bash
Can this tested code be packaged into Docker images and stored in ECR?
```

Deployment answers a different question, which we will handle later:

```bash
Should this image version be released to an environment?
```

Keeping these stages separate makes the pipeline easier to control and safer for production.

## When The ECR Workflow Runs

The workflow runs in two ways:

1. Automatically after the `CI` workflow succeeds on the `main` branch.
2. Manually from the GitHub Actions tab using `workflow_dispatch`.

```yaml
on:
  workflow_run:
    workflows:
      - CI
    types:
      - completed
    branches:
      - main

  workflow_dispatch:
```

The automatic flow is:

```bash
Pull request passes CI
Pull request is merged to main
CI runs again on main
CI succeeds
Build and Push Images to ECR workflow starts
Docker images are built and pushed to ECR
```

## AWS Authentication

The workflow uses GitHub OIDC instead of long-lived AWS access keys.

The role used by the workflow is:

```bash
arn:aws:iam::123456789:role/github-actions-oidc-role-ui3
```

The workflow needs these permissions:

```yaml
permissions:
  contents: read
  id-token: write
```

What this means:

- `contents: read` allows GitHub Actions to checkout the repository.
- `id-token: write` allows GitHub Actions to request a short-lived OIDC token.
- AWS validates that token and allows the workflow to assume the IAM role.
- No AWS access keys are stored in GitHub.

## ECR Repositories

This workflow expects these ECR repositories to already exist:

```bash
ecommerce-store/catalog
ecommerce-store/cart
ecommerce-store/checkout
ecommerce-store/orders
ecommerce-store/ui
```

The workflow checks that each repository exists before building the image:

```bash
aws ecr describe-repositories --repository-names "<repository-name>"
```

If one repository is missing, that service job will fail. Create the missing repository in ECR, then rerun the workflow.

## Image Tagging Strategy

Each image is tagged with the first seven characters of the Git commit SHA.

Example:

```bash
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/catalog:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/cart:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/checkout:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/orders:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/ui:a1b2c3d
```

This is better than only using `latest` because it gives traceability. Later, when we deploy, we can choose the exact tested image tag to release.

## Microservice Build Matrix

The workflow uses a matrix so we do not repeat the same Docker build and push logic five times.

```yaml
strategy:
  matrix:
    include:
      - service: catalog
        context: Application Code/src/catalog
        dockerfile: Application Code/src/catalog/Dockerfile
        repository: ecommerce-store/catalog
```

Each service defines:

- `service`: the microservice name.
- `context`: the Docker build context.
- `dockerfile`: the Dockerfile location.
- `repository`: the target ECR repository.

## Services Published To ECR

| Microservice | Dockerfile | ECR Repository |
|-------------|------------|----------------|
| catalog | `Application Code/src/catalog/Dockerfile` | `ecommerce-store/catalog` |
| cart | `Application Code/src/cart/Dockerfile` | `ecommerce-store/cart` |
| checkout | `Application Code/src/checkout/Dockerfile` | `ecommerce-store/checkout` |
| orders | `Application Code/src/orders/Dockerfile` | `ecommerce-store/orders` |
| ui | `Application Code/src/ui/Dockerfile` | `ecommerce-store/ui` |

## How To Test The ECR Workflow

After committing and pushing the workflow, open GitHub, test it from the main branch if the workflow file is already merged there:

```bash
Actions -> Build and Push Images to ECR -> Run workflow
```

Select the branch and run it manually.

Expected result:

```bash
build and push catalog
build and push cart
build and push checkout
build and push orders
build and push ui
```

Each job should finish by printing the pushed image URI.

You can also verify from AWS CLI:

```bash
aws ecr describe-images \
  --repository-name ecommerce-store/catalog \
  --region us-east-1
```

Repeat for the other repositories:

```bash
ecommerce-store/cart
ecommerce-store/checkout
ecommerce-store/orders
ecommerce-store/ui
```

## Next Step After ECR Push

After this workflow is confirmed working, the next step is deployment planning.

At that point, we will decide whether to deploy with:

- Raw Kubernetes manifests.
- Helm charts.
- ArgoCD GitOps.

The production deployment workflow should use the exact image tags created by this ECR workflow.


