# Production-Ready DevSecOps Platform for a Microservices E-Commerce Application on AWS

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/fb237fac-583a-4329-9e2e-0ac4d3b6d5f5" />

## Project Summary

This project demonstrates how to design, build, secure, deploy, and monitor a cloud-native microservices e-commerce application using modern DevSecOps practices.

The platform uses AWS as the cloud provider, Amazon EKS for Kubernetes orchestration, Terraform for infrastructure provisioning, Docker for containerization, Helm for application packaging, ArgoCD for GitOps-based deployment, and GitHub Actions for CI/CD automation.

It also includes production-focused capabilities such as secure secret management, IAM least privilege, automated image delivery to Amazon ECR, Kubernetes autoscaling, observability with Prometheus and Grafana, distributed tracing with OpenTelemetry and AWS X-Ray, and centralized monitoring through Amazon CloudWatch.

## Table Of Contents

- [1. Project Overview](#1-project-overview)
- [2. Architecture Summary](#2-architecture-summary)
- [3. Technology Stack](#3-technology-stack)
- [4. Repository Structure](#4-repository-structure)
- [5. Prerequisites](#5-prerequisites)
- [6. Local Development Setup](#6-local-development-setup)
- [7. Instrumentation](#7-instrumentation)
- [8. Terraform For StatefulSet Deployment](#8-infrastructure-provisioning-with-terraform-for-statefulset-deployment)
- [9. Secrets Management](#9-secrets-management)
- [10. Kubernetes StatefulSet Deployment](#10-kubernetes-deployment-using-statefulset_k8manifest)
- [11. Terraform For AWS Dataplane](#11-infrastructure-provisioning-with-terraform-for-aws-infrastructure-deployment)
- [12. AWS Dataplane Manifests](#12-deploy-aws-dataplane-manifests)
- [13. Helm](#13-helm)
- [14. Karpenter Installation](#14-karpenter-installation)
- [15. Karpenter On-Demand Testing](#15-karpenter-on-demand-instances---autoscaling---testing)
- [16. Karpenter Spot Testing](#16-karpenter-spot-instances---autoscaling---testing)
- [17. Karpenter Spot Interruption Handling](#17-karpenter-spot-interruption-handling)
- [18. Horizontal Pod Autoscaler](#18-horizontal-pod-autoscaler)
- [19. Install & Configure ArgoCD](#19-install--configure-argocd)
- [20. GitHub Actions To AWS ECR](#20-ci---github-action-to-aws-ecr)
- [21. Build And Push Docker Images To AWS ECR](#21-build-and-push-docker-images-to-aws-ecr)
- [22. Continuous Delivery / Deployment](#22-continuous-delivery--deployment)
- [23. Observability](#23-observability)

## 1. Project Overview

This project provides an end-to-end DevSecOps implementation for deploying a microservices-based e-commerce application on AWS. It covers the full lifecycle of a production cloud-native platform, from infrastructure provisioning and container image builds to Kubernetes deployment, GitOps delivery, security controls, and observability.

The purpose of this project is to show how multiple modern DevOps and security practices work together in a real deployment workflow. Instead of treating infrastructure, application delivery, secrets, monitoring, and CI/CD as separate topics, this project connects them into one complete production-style architecture.

It solves common production problems such as manual infrastructure setup, inconsistent
deployments, insecure secret handling, lack of deployment traceability, weak CI/CD quality gates, limited application visibility, and difficulty scaling Kubernetes workloads. By using tools like Terraform, EKS, GitHub Actions, ArgoCD, AWS Secrets Manager, Prometheus, Grafana, CloudWatch, and OpenTelemetry, the project demonstrates a repeatable and secure way to run microservices in AWS.


## 2. Architecture Summary

This project uses a cloud-native microservices architecture deployed on Amazon EKS. The application is split into independent services, each packaged as a Docker image, stored in Amazon ECR, and deployed to Kubernetes using GitOps practices.

At a high level, Terraform provisions the AWS foundation, including networking, EKS, IAM roles, Kubernetes add-ons, and supporting AWS data services. GitHub Actions validates the application code, builds Docker images, and pushes versioned images to Amazon ECR. ArgoCD then watches the Git repository and applies the desired Kubernetes manifests or Helm charts to the EKS cluster.

The application includes the following microservices:

| Microservice | Purpose |
|---|---|
| ui | Frontend/user-facing application |
| catalog | Product catalog service |
| cart | Shopping cart service |
| checkout | Checkout workflow service |
| orders | Order management service |


The architecture uses the following AWS services:

| AWS Service | Purpose |
|---|---|
| Amazon EKS | Runs the Kubernetes workloads |
| Amazon ECR | Stores Docker images |
| Amazon VPC | Provides private networking |
| IAM | Controls access between AWS, GitHub Actions, and Kubernetes workloads |
| AWS Secrets Manager | Stores application and database secrets |
| Amazon RDS | Provides relational databases for services that require persistence |
| Amazon DynamoDB | Provides NoSQL storage for cart-related data |
| Amazon ElastiCache/Redis | Provides caching/session-style storage |
| Amazon SQS | Provides asynchronous messaging for order workflows |
| Amazon CloudWatch | Collects logs and AWS-level monitoring data |
| AWS X-Ray | Supports distributed tracing |
| AWS Load Balancer Controller | Provisions AWS load balancers from Kubernetes Ingress resources |

The Kubernetes and GitOps flow works like this:

```text
Developer pushes code
        |
        v
GitHub Actions runs CI checks
        |
        v
Docker images are built and pushed to Amazon ECR
        |
        v
Kubernetes manifests or Helm values are updated with the new image tag
        |
        v
ArgoCD detects the Git change
        |
        v
ArgoCD syncs the desired state to Amazon EKS
        |
        v
Application runs on Kubernetes
```

Add the architecture diagram here:

## 3. Technology Stack

This project uses a modern DevSecOps technology stack designed for building, securing, deploying, and operating microservices in a production-style AWS environment.

| Category | Technology | Purpose |
|---|---|---|
| Cloud Platform | AWS | Provides the cloud infrastructure for networking, compute, storage, databases, security, and monitoring. |
| Infrastructure as Code | Terraform | Provisions and manages AWS infrastructure such as VPC, EKS, IAM roles, add-ons, and supporting cloud resources. |
| Containerization | Docker | Packages each microservice into a portable container image that can run consistently across environments. |
| Container Registry | Amazon ECR | Stores versioned Docker images built by the CI/CD pipeline. |
| Orchestration | Amazon EKS / Kubernetes | Runs, schedules, scales, and manages containerized microservices. |
| Package Management | Helm | Packages Kubernetes manifests into reusable, configurable deployment charts. |
| GitOps Deployment | ArgoCD | Continuously syncs the desired application state from Git to the EKS cluster. |
| CI/CD Automation | GitHub Actions | Runs build, test, lint, security, image build, and delivery workflows. |
| Identity and Access Management | AWS IAM | Controls permissions for AWS resources, GitHub Actions, and Kubernetes workloads. |
| CI/CD Authentication | GitHub OIDC | Allows GitHub Actions to assume AWS IAM roles securely without long-lived AWS access keys. |
| Secrets Management | AWS Secrets Manager | Stores sensitive values such as database usernames, passwords, and application secrets. |
| Kubernetes Secret Integration | Secrets Store CSI Driver | Mounts secrets from AWS Secrets Manager into Kubernetes pods. |
| Code Quality and Security | SonarQube | Performs static code analysis, code quality checks, and security scanning. |
| Metrics Monitoring | Prometheus | Collects Kubernetes and application metrics for monitoring and alerting. |
| Visualization | Grafana | Provides dashboards for infrastructure, Kubernetes, and application observability. |
| Distributed Tracing | OpenTelemetry | Collects traces and telemetry data across microservices. |
| AWS Tracing | AWS X-Ray | Provides distributed tracing visibility for requests across AWS and application components. |
| Logging and Monitoring | Amazon CloudWatch | Collects AWS service logs, metrics, and operational events. |

## 4. Repository Structure

The repository is organized to separate application code, infrastructure code, Kubernetes deployment manifests, Helm charts, CI/CD workflows, and supporting documentation. This makes the project easier to maintain, review, and deploy in a production-style workflow.

```text
ecommerce_store/
|
|-- Application Code/
|   |-- src/
|       |-- catalog/
|       |-- cart/
|       |-- checkout/
|       |-- orders/
|       |-- ui/
|
|-- AWS/Terraform/
|   |-- shared/
|   |   |-- backend/
|   |   |-- vpc/
|   |
|   |-- eks-statefulset_and_addons/
|   |
|   |-- eks-aws-dataplane/
|       |-- cluster-and-addons/
|       |-- app-dataplane/
|
|-- AWS/Kubernetes_manifest/
|   |-- aws_dataplane_k8manifest/
|   |-- statefulset_k8manifest/
|   |-- aws_dataplane_verification_pod/
|   |-- ingress/
|   |-- HPA/
|   |-- PDB/
|
|-- AWS/Helm_ecommerce_store/
|   |-- ecommercestore_apps/
|   |   |-- values-cart.yaml
|   |   |-- values-catalog.yaml
|   |   |-- values-checkout.yaml
|   |   |-- values-orders.yaml
|   |   |-- values-ui.yaml
|   |
|   |-- ecommerstore_charts/
|       |-- catalog_chart/
|       |-- ui_chart/
|
|-- AWS/Observability/
|   |-- OpenTelemetry_terraform/
|   |-- OpenTelemetry_AMP_AMG/
|   |-- OpenTelemetry_logs/
|   |-- Opentelemetry_Traces/
|   |-- Grafana_dashboards/
|
|-- AWS/AIOPS/
|   |-- Schemas/
|   |-- Terraform/
|   |-- bedrock-agent/
|
|-- AWS/docs/
|   |-- EKS_POD_TROUBLESHOOTING_RUNBOOK.md
|
|-- AZURE/
|   |-- Terraform/
|   |-- Kubernetes_manifest/
|   |-- Observability/
|   |-- GitHub_Actions/
|
|-- .github/
|   |-- workflows/
|       |-- ci.yml
|       |-- build-and-push-ecr.yml
|
|-- Readme.md
|-- .gitignore
```

### Folder Breakdown

| Path | Purpose |
|---|---|
| Application Code/ | Contains the source code for all application microservices. Each service has its own codebase, Dockerfile, dependencies, and build/test process. |
| Application Code/src/catalog/ | Product catalog service. |
| Application Code/src/cart/ | Shopping cart service. |
| Application Code/src/checkout/ | Checkout workflow service. |
| Application Code/src/orders/ | Order management service. |
| Application Code/src/ui/ | User-facing frontend or UI service. |
| AWS/Terraform/ | Contains Infrastructure as Code used to provision AWS resources such as VPC, EKS, IAM roles, add-ons, databases, queues, and other supporting services. |
| AWS/Kubernetes_manifest/ | Contains raw Kubernetes manifests for deploying workloads, services, ingress, service accounts, secrets integration, and verification pods. |
| AWS/Helm_ecommerce_store/ | Contains Helm charts and values files used to package and deploy the application in a reusable and environment-specific way. |
| AWS/Observability/ | Contains OpenTelemetry, ADOT, AMP, AMG, log, trace, and Grafana dashboard configuration. |
| AWS/AIOPS/ | Contains experimental/future AIOps contracts, Terraform, and Bedrock-related evidence collection components. |
| AWS/docs/ | Stores AWS-specific runbooks and operational documentation. |
| AZURE/ | Contains the Azure-specific project structure for future AKS, Azure Kubernetes manifests, Azure observability, and Azure workflow templates. |
| .github/workflows/ | Contains GitHub Actions workflows for CI checks, Docker image builds, Amazon ECR publishing, and future deployment automation. |
| Readme.md | Main project documentation and operational guide. |

This structure supports a clean production workflow where application development, infrastructure provisioning, Kubernetes deployment, and CI/CD automation are managed independently but work together as one complete DevSecOps platform.


## 5. Prerequisites

Before deploying this project, make sure the required accounts, permissions, CLI tools, and development runtimes are available. These prerequisites are needed to provision AWS infrastructure, build application services, deploy workloads to Kubernetes, and run the CI/CD pipeline.

### Required Accounts

| Requirement | Purpose |
|---|---|
| AWS Account | Required to create cloud resources such as VPC, EKS, ECR, IAM, RDS, DynamoDB, ElastiCache, SQS, CloudWatch, and Secrets Manager. |
| GitHub Account | Required to host the repository, run GitHub Actions workflows, configure branch protection, and use OIDC authentication with AWS. |
| Domain Name | Optional, but recommended if exposing the application through a production-style custom domain. |
| TLS Certificate | Optional, but recommended for HTTPS. Certificates can be managed through AWS Certificate Manager. |

### Required AWS Permissions

The AWS identity used for setup must have permissions to create and manage the following resources:

| AWS Area | Example Resources |
|---|---|
| Networking | VPC, subnets, route tables, NAT gateways, internet gateways, security groups |
| Kubernetes | Amazon EKS cluster, node groups, EKS add-ons |
| IAM | IAM roles, IAM policies, OIDC provider, Pod Identity associations |
| Container Registry | Amazon ECR repositories and image permissions |
| Databases and Data Services | RDS, DynamoDB, ElastiCache/Redis, SQS |
| Secrets | AWS Secrets Manager |
| Observability | CloudWatch, X-Ray, logs, metrics, alarms |
| Load Balancing | Application Load Balancer, Target Groups, AWS Load Balancer Controller permissions |

For production usage, use least-privilege IAM policies instead of broad administrator access.

### Required CLI Tools

Install and configure the following tools on your workstation or deployment environment:

| Tool | Purpose |
|---|---|
| Git | Clones the repository and manages source control. |
| AWS CLI | Authenticates to AWS and manages AWS resources from the command line. |
| Terraform | Provisions AWS infrastructure using Infrastructure as Code. |
| kubectl | Connects to and manages the Amazon EKS Kubernetes cluster. |
| Helm | Installs and manages Kubernetes applications and charts. |
| Docker | Builds and tests container images locally. |

### Required Application Runtimes

The project contains multiple microservices, so different runtimes may be required depending on which service you are building or testing.

| Runtime | Purpose |
|---|---|
| Node.js | Required for JavaScript/TypeScript services and workspace tooling. |
| npm | Installs Node.js dependencies and runs Node-based scripts. |
| Yarn | Required for services that use Yarn-based dependency management. |
| Java JDK | Required for Java-based microservices. Java 21 is recommended if used by the project. |
| Maven | Builds and tests Java services. The Maven wrapper can be used where available. |
| Go | Builds and tests Go-based services such as the catalog service. |

### Recommended Tool Versions

Use versions that match the project configuration where possible.

| Tool | Recommended Version |
|---|---|
| Terraform | >= 1.5 |
| AWS CLI | v2 |
| kubectl | Same minor version as the EKS cluster or within one supported minor version |
| Helm | v3 |
| Docker | Latest stable version |
| Node.js | 20.x, depending on service requirements |
| Java | 21 |
| Go | Version defined by the service go.mod file |

### AWS CLI Configuration

Before running Terraform or AWS commands, authenticate to AWS:

aws configure

Verify access:

aws sts get-caller-identity

Expected result:

{
  "UserId": "EXAMPLE",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/example-user"
}

### Kubernetes Access Requirement

After the EKS cluster is created, configure kubectl access:

aws eks update-kubeconfig \
  --name <cluster-name> \
  --region <aws-region>

Verify access:

kubectl get nodes

### GitHub Actions Requirement

For CI/CD, the repository must have:

| Requirement | Purpose |
|---|---|
| GitHub Actions enabled | Runs CI, build, scan, and delivery workflows. |
| GitHub OIDC provider configured in AWS | Allows GitHub Actions to authenticate to AWS without long-lived access keys. |
| IAM role for GitHub Actions | Grants controlled access to ECR and other required AWS services. |
| Branch protection rules | Ensures code is tested before merging to main. |

These prerequisites ensure the project can be deployed, tested, secured, and operated in a production-style AWS environment.


## 6. Local Development Setup

This section explains how to run, test, and build the application locally before deploying it to AWS or Kubernetes. For local development, Docker Compose is the recommended approach because it allows the microservices and their supporting dependencies to run together in a repeatable environment.

### Clone The Repository

```bash
  git clone https://github.com/ahmedlekan/ecommerce_store.git
  cd ecommerce_store
```

### Install Required Tools

Make sure the following tools are installed locally:

| Tool | Purpose |
|---|---|
| Git | Clone and manage the repository |
| Docker | Build and run containers |
| Docker Compose | Run multiple services locally |
| Node.js / npm / Yarn | Build and test Node.js services |
| Java / Maven | Build and test Java services |
| Go | Build and test Go services |

### Docker Compose Files

This project includes Docker Compose files for running services locally:

```text
  Application Code/src/docker-compose.yaml
  Application Code/src/app/docker-compose.yml
  Application Code/src/app/compose.override.yaml
  Application Code/src/catalog/docker-compose.yml
  Application Code/src/cart/docker-compose.yml
  Application Code/src/checkout/docker-compose.yml
  Application Code/src/orders/docker-compose.yml
  Application Code/src/ui/docker-compose.yml
```

The main Compose file should be used to start the local application stack.

### Start The Application Locally

From the application source directory:

```bash
  cd "Application Code/src"
  docker compose up -d
```

This starts the configured local services in detached mode.

Check running containers:

```bash
  docker compose ps
```

View logs:

```bash
  docker compose logs -f
```

Stop the stack:

```bash
  docker compose down
```

### Rebuild Containers

If application code or Dockerfiles change, rebuild the images:

```bash
  docker compose up -d --build
```

To rebuild without using cache:

```bash
  docker compose build --no-cache
  docker compose up -d
```

### Run Individual Services

If needed, run a single service instead of the full stack:

```bash
  docker compose up -d catalog
  docker compose up -d cart
  docker compose up -d checkout
  docker compose up -d orders
  docker compose up -d ui
```

### Run Tests Locally

Run tests from each service directory using its native tooling:

```bash
  go test ./...
  ./mvnw test
  npm test
```

### Build Docker Images Locally

Docker Compose can build the service images locally:

```bash
  docker compose build

  # To build a specific service:
  docker compose build catalog
  docker compose build cart
  docker compose build checkout
  docker compose build orders
  docker compose build ui
```

### Recommended Local Development Flow

- Clone repository
- Install required tools
- Start services with Docker Compose
- Check container health and logs
- Run unit tests locally
- Rebuild images after code changes
- Push code to GitHub
- Let GitHub Actions run CI

Using Docker Compose makes the local workflow closer to production because every service runs as a container, similar to how the application later runs on Kubernetes.


## 7. Instrumentation

This project instruments each microservice so application behavior can be observed through traces, metrics, and logs.

Instrumentation is implemented at the application level and exported to the observability stack for debugging latency, errors, traffic, and service dependencies.

### OpenTelemetry Setup

OpenTelemetry is used for distributed tracing across the ecommerce microservices.

The services are configured to emit traces so requests can be followed across the main user journey:

```text
UI
  -> Checkout
  -> Orders
  -> PostgreSQL

UI
  -> Cart

UI
  -> Catalog
  -> MySQL
```

Traces are collected by the AWS Distro for OpenTelemetry collector and exported to AWS X-Ray.

This allows debugging questions such as:

```text
Which service is slow?
Is the delay in Checkout, Orders, or the database?
Did a downstream dependency fail?
Which span caused the request to exceed the expected latency?
```

### Application Tracing

Distributed tracing is used to inspect request flow between services.

The project uses tracing to distinguish between:

```text
Application latency
Database latency
Network or downstream dependency latency
HTTP 5xx failures
```

Example trace interpretation:

```text
UI span slow
Checkout span slow
Orders span slow
PostgreSQL span fast
```

This means the bottleneck is likely inside the Orders application logic, not PostgreSQL.

```text
Orders span slow
SQL span slow
```

This means the database query path is likely the bottleneck.

### Metrics

Each service exposes Prometheus-compatible metrics.

Service endpoints:

```text
UI       /actuator/prometheus
Orders   /actuator/prometheus
Cart     /actuator/prometheus
Checkout /metrics
Catalog  /metrics
```

Metrics are scraped by Prometheus/ADOT and visualized in Grafana.

The project includes infrastructure metrics such as:

```text
Pod CPU
Pod memory
Node health
Network traffic
HPA scaling
JVM memory and GC
Database connection pool usage
```

The project also includes custom application and business metrics.

UI:

```text
ui_requests_total
ui_errors_total
ui_request_duration_seconds
```

Checkout:

```text
checkout_requests_total
checkout_success_total
checkout_errors_total
checkout_submit_duration_seconds
```

Orders:

```text
orders_requests_total
orders_success_total
orders_errors_total
orders_created_total
orders_create_duration_seconds
```

Cart:

```text
cart_requests_total
cart_items_added_total
cart_items_removed_total
cart_duration_seconds
```

Catalog:

```text
catalog_requests_total
catalog_search_total
catalog_duration_seconds
```

These metrics support SRE-style monitoring:

```text
Request rate
Error rate
p95/p99 latency
Checkout success rate
Orders created
Cart activity
Catalog search activity
```

### Logging Format

Application logs are collected from Kubernetes workloads and sent to CloudWatch.

Logs are used with metrics and traces to debug failures. The intended workflow is:

```text
Metric alert fires
  -> inspect Grafana dashboard
  -> inspect trace in X-Ray
  -> inspect related service logs in CloudWatch
```

Logs are especially useful for:

```text
Application exceptions
Failed downstream calls
Startup failures
Configuration errors
Pod-level troubleshooting
```


## 8. Infrastructure Provisioning With Terraform For StatefulSet Deployment

This project uses Terraform to provision the AWS infrastructure required to run the StatefulSet-based Kubernetes deployment on Amazon EKS.

In this deployment mode, the application databases and supporting stateful services run inside Kubernetes as StatefulSets or Deployments. Terraform does not create application dataplane services such as RDS, DynamoDB, ElastiCache, or SQS for this path.

Terraform is responsible for:

- Creating the Terraform backend resources
- Creating the shared VPC networking layer
- Creating the EKS cluster
- Creating EKS managed node groups
- Installing and configuring required EKS add-ons
- Creating IAM roles and Pod Identity associations for Kubernetes workloads
- Enabling EBS-backed persistent storage for StatefulSets
- Enabling Secrets Manager access through the Secrets Store CSI Driver


### Terraform Directory Layout

```text
AWS/Terraform/
  shared/
    backend/
      s3-backend-bucket.tf

    vpc/
      terraform-manifests/
        c1-versions.tf
        c2-variables.tf
        c3-vpc.tf
        c4-outputs.tf
        terraform.tfvars

      vpc-module/
        main.tf
        outputs.tf
        variables.tf

  eks-statefulset_and_addons/
    c1_versions.tf
    c2_variables.tf
    c3_remote-state.tf
    c4_datasources_and_locals.tf
    c5_eks_tags.tf
    c6_eks_cluster_iamrole.tf
    c7_eks_cluster.tf
    c8_eks_nodegroup_iamrole.tf
    c9_eks_nodegroup_private.tf
    c10_eks_outputs.tf

    c11-podidentityagent-eksaddon.tf
    c12-helm-and-kubernetes-providers.tf
    c13-podidentity-assumerole.tf

    c14-01-lbc-iam-policy-datasources.tf
    c14-02-lbc-iam-policy-and-role.tf
    c14-03-lbc-eks-pod-identity-association.tf
    c14-04-lbc-helm-install.tf

    c15-01-ebscsi-iam-policy-and-role.tf
    c15-02-ebscsi-eks-pod-identity-association.tf
    c15-03-ebscsi-eksaddon.tf

    c16-01-secretstorecsi-helm-install.tf
    c16-02-secretstorecsi-ascp-helm-install.tf
    c16-03-catalog-db-secret-pod-identity.tf
    c16-04-orders-db-secret-pod-identity.tf

    terraform.tfvars
    env/
      dev.tfvars
      staging.tfvars
      prod.tfvars
```

### What Terraform Provisions For StatefulSet Deployment

| Area | Resources |
|---|---|
| Backend State | S3 bucket for Terraform state |
| Networking | VPC, public subnets, private subnets, route tables, internet gateway, NAT gateways |
| Kubernetes | EKS cluster, managed node groups, cluster IAM roles, node IAM roles |
| EKS Add-ons | Pod Identity Agent, AWS Load Balancer Controller, EBS CSI Driver, Secrets Store CSI Driver, AWS Secrets Provider |
| IAM | IAM roles, IAM policies, Pod Identity associations |
| Storage | EBS CSI integration for Kubernetes PersistentVolumes |
| Secrets Access | IAM permissions for workloads to read required AWS Secrets Manager secrets |

This StatefulSet path does not provision:

- Amazon RDS
- Amazon DynamoDB
- Amazon ElastiCache
- Amazon SQS

Those belong to the AWS dataplane deployment path, not the StatefulSet deployment path.


### Apply Order

Terraform should be applied in this order:

```text
1. AWS/Terraform/shared/backend
2. AWS/Terraform/shared/vpc/terraform-manifests
3. AWS/Terraform/eks-statefulset_and_addons
4. AWS/Kubernetes_manifest/00_namespace_micro-tier.yaml
5. AWS/Kubernetes_manifest/statefulset_k8manifest/
```

### Backend Provisioning

Create the backend resources first:

```bash
cd AWS/Terraform/shared/backend

terraform init
terraform validate
terraform plan
terraform apply
```

The backend stores Terraform state remotely so the infrastructure state is not kept only on your local machine.


### VPC Provisioning

The VPC must be created before EKS because the EKS cluster and node groups need private subnets.

cd AWS/Terraform/shared/vpc/terraform-manifests

```bash
terraform init
terraform validate
terraform plan
terraform apply
```

The VPC stage creates and exports outputs such as:

- vpc_id
- private_subnet_ids
- public_subnet_ids

The EKS StatefulSet Terraform root reads these outputs through Terraform remote state.

### EKS StatefulSet Cluster Provisioning

After the VPC is available, create the EKS cluster and required add-ons:

```bash
cd AWS/Terraform/eks-statefulset_and_addons

terraform init
terraform validate
terraform plan -var-file="env/dev.tfvars"
terraform apply -var-file="env/dev.tfvars"
```

This stage creates:

- EKS control plane
- EKS managed node group
- EKS cluster IAM role
- EKS node group IAM role
- Required subnet tags for load balancers
- Pod Identity Agent
- AWS Load Balancer Controller
- EBS CSI Driver
- Secrets Store CSI Driver
- AWS Secrets Provider for Secrets Store CSI
- IAM roles and Pod Identity associations for stateful workload secrets


### Configure kubectl Access

After the EKS cluster is created, update your local kubeconfig:

```bash
aws eks update-kubeconfig \
  --name <cluster-name> \
  --region <aws-region>
```

Verify access:

```bash
kubectl get nodes
```

### Required EKS Add-ons

| Add-on | Purpose |
|---|---|
| EKS Pod Identity Agent | Allows Kubernetes service accounts to assume IAM roles securely |
| AWS Load Balancer Controller | Creates AWS load balancers from Kubernetes Ingress and Service resources |
| EBS CSI Driver | Allows StatefulSets to use EBS-backed PersistentVolumes |
| Secrets Store CSI Driver | Mounts external secrets into Kubernetes pods |
| AWS Secrets Provider | Connects Secrets Store CSI Driver to AWS Secrets Manager |

Verify add-ons:

```bash
kubectl get pods -n kube-system

# Expected components include:
aws-load-balancer-controller
ebs-csi-controller
csi-secrets-store
secrets-provider-aws
eks-pod-identity-agent
```

### Why EBS CSI Is Required

The StatefulSet deployment runs stateful services inside Kubernetes, such as:

- MySQL for catalog
- PostgreSQL for orders
- RabbitMQ for orders messaging
- Redis for checkout, if deployed with persistence

These workloads need persistent storage. The EBS CSI Driver allows Kubernetes PersistentVolumeClaims to dynamically create Amazon EBS volumes.

Typical flow:

StatefulSet Pod
-> PersistentVolumeClaim
-> StorageClass
-> EBS CSI Driver
-> Amazon EBS volume

### Secrets Used By The StatefulSet Path

The StatefulSet deployment uses AWS Secrets Manager for credentials that should not be stored directly in Kubernetes manifests.

Common secrets:

```text
dev-catalog-db-secret
dev-orders-db-secret
dev-orders-rabbitmq-secret
```

## 9. Secrets Management

This project manages application secrets with AWS Secrets Manager and exposes them to Kubernetes workloads through the Secrets Store CSI Driver. This keeps sensitive values out of source code, Docker images, and plain Kubernetes manifests.

For this project, AWS Secrets Manager is used for the catalog and orders service database credentials.

### Secrets Architecture

AWS Secrets Manager
        |
        v
AWS Secrets and Configuration Provider
        |
        v
Secrets Store CSI Driver
        |
        v
Kubernetes Pod volume mount
        |
        v
Application container

Pod authentication is handled through EKS Pod Identity:

Pod
  -> ServiceAccount
  -> EKS Pod Identity Association
  -> IAM Role
  -> AWS Secrets Manager

### AWS Secrets Manager

AWS Secrets Manager is the source of truth for sensitive values such as database usernames and passwords.

Example secrets:

```text
dev-catalog-db-secret
# staging-catalog-db-secret
# prod-catalog-db-secret

dev-orders-db-secret
# staging-orders-db-secret
# prod-orders-db-secret
```

### Create Secrets In AWS Secrets Manager

Create the AWS Secrets Manager secret that stores the database username and password.

The secret name must match the `objectName` used later in the `SecretProviderClass`.

For this project, the secret name is:

***For the catalog-db***

```text
dev-catalog-db-secret
```

Create the secret:

```bash
aws secretsmanager create-secret \
  --name dev-catalog-db-secret \
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

***For the orders-db-secret***

```bash
aws secretsmanager create-secret \
    --name dev-orders-db-secret \
    --region us-east-1 \
    --description "Postgresql credentials for Orders microservice" \
    --secret-string '{
      "RETAIL_ORDERS_PERSISTENCE_USERNAME": "username",
      "RETAIL_ORDERS_PERSISTENCE_PASSWORD": "Password"
    }' 
```

Verify the secret exists:

```bash
aws secretsmanager describe-secret \
  --secret-id dev-orders-db-secret \
  --region us-east-1
```

Verify the secret value only when needed:

```bash
aws secretsmanager get-secret-value \
  --secret-id dev-orders-db-secret \
  --region us-east-1 \
  --query SecretString \
  --output text
```

The secret value should contain:

```json
{
  "RETAIL_ORDERS_PERSISTENCE_USERNAME": "username",
  "RETAIL_ORDERS_PERSISTENCE_PASSWORD": "password"
}
```

<!-- This is for when you are using the statefulset kubernetes manifest -->
<!-- For the aws data plane, you wont need this because we will be using aws sqs -->

***For the orders-rabbitmg-secret***
```bash
aws secretsmanager create-secret \
  --name orders-rabbitmq-secret \
  --region us-east-1 \
  --description "RabbitMQ credentials for order microservice" \
  --secret-string '{
    "RETAIL_ORDERS_MESSAGING_RABBITMQ_USERNAME": "username",
    "RETAIL_ORDERS_MESSAGING_RABBITMQ_PASSWORD": "Password"
  }' 
```

Verify the secret exists:

```bash
aws secretsmanager describe-secret \
  --secret-id orders-rabbitmq-secret \
  --region us-east-1
```

Verify the secret value only when needed:

```bash
aws secretsmanager get-secret-value \
  --secret-id orders-rabbitmq-secret \
  --region us-east-1 \
  --query SecretString \
  --output text
```

The secret value should contain:

```json
{
  "RETAIL_ORDERS_MESSAGING_RABBITMQ_USERNAME": "username",
  "RETAIL_ORDERS_MESSAGING_RABBITMQ_PASSWORD": "password"
}
```

### The SecretProviderClass

The `SecretProviderClass` tells the Secrets Store CSI Driver:

- Which AWS secret to read
- Which keys to extract
- That the pod should authenticate using EKS Pod Identity

Example:

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: dev-catalog-db-secrets
  namespace: micro-tier  # the namespace you use
spec:
  provider: aws
  parameters:
    usePodIdentity: "true"
    objects: |
      - objectName: "dev-catalog-db-secret"
        objectType: "secretsmanager"
        jmesPath:
          - path: "MYSQL_USER"
            objectAlias: "MYSQL_USER"
          - path: "MYSQL_PASSWORD"
            objectAlias: "MYSQL_PASSWORD"
```

This configuration:

- Reads `dev-catalog-db-secret` from AWS Secrets Manager.
- Extracts `MYSQL_USER`.
- Extracts `MYSQL_PASSWORD`.
- Mounts the values as files inside the pod.
- Uses EKS Pod Identity for AWS authentication.
- Does not create a native Kubernetes Secret.

It is the same process for the orders SecretProviderClass.


### Secrets Store CSI Driver

The Secrets Store CSI Driver allows Kubernetes pods to mount secrets from AWS Secrets Manager as files inside the container.

Example mounted catalog files:

```text
/mnt/secrets-store/MYSQL_USER
/mnt/secrets-store/MYSQL_PASSWORD
```

Example mounted orders files:

```text
/mnt/secrets-store/RETAIL_ORDERS_PERSISTENCE_USERNAME
/mnt/secrets-store/RETAIL_ORDERS_PERSISTENCE_PASSWORD
```

This avoids storing secret values directly in Kubernetes Secret objects unless secret syncing is explicitly enabled.

### EKS Pod Identity

EKS Pod Identity allows Kubernetes workloads to access AWS services without static AWS credentials.

Each workload uses a Kubernetes ServiceAccount. That service account is mapped to an IAM role through an EKS Pod Identity Association.

Example mapping:

catalog pod:
-> ServiceAccount: catalog
-> IAM Role: dev-catalog-db-secrets-role
-> Secret: dev-catalog-db-secret

orders pod:
-> ServiceAccount: orders
-> IAM Role: dev-orders-db-secrets-role
-> Secret: dev-orders-db-secret

### IAM Least Privilege

Each service should only have permission to read the secret it needs.

Required IAM actions:

```text
secretsmanager:GetSecretValue
secretsmanager:DescribeSecret
```

Catalog should only access:

```text
dev-catalog-db-secret
```

Orders should only access:

```text
orders-db-secret
```

This prevents one service from reading another service’s database credentials.


### ServiceAccount Mapping

The pod must use the same ServiceAccount that is configured in the EKS Pod Identity Association.

Example:

spec:
serviceAccountName: catalog

spec:
serviceAccountName: orders

If the pod uses a different service account, the secret mount will fail because the pod will not have permission to read from AWS Secrets Manager.

### Mounting Secrets Into Pods

The workload must reference the correct SecretProviderClass as a CSI volume.

Example:

```yaml
volumes:
  - name: aws-secrets
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: dev-catalog-db-secrets

# Mount the volume into the container:

volumeMounts:
  - name: aws-secrets
    mountPath: /mnt/secrets-store
    readOnly: true
```

The application can then read the secret values from files inside:

```text
/mnt/secrets-store
```

## 10. Kubernetes Deployment using statefulset_k8manifest

This project deploys the microservices application to Amazon EKS using Kubernetes manifests. The Kubernetes layer defines how each service runs, how services communicate, how configuration is injected, how secrets are mounted, and how external traffic reaches the application.

The deployment should be applied in a controlled order so that namespaces, service accounts, configuration, secrets, workloads, services, and ingress resources are created correctly.

### Kubernetes Resources Used

| Resource | Purpose |
|---|---|
| Namespace | Separates application resources from system and other environment workloads. |
| ServiceAccount | Provides workload identity and maps pods to IAM permissions through EKS Pod Identity. |
| ConfigMap | Stores non-sensitive application configuration. |
| SecretProviderClass | Defines which AWS Secrets Manager secrets are mounted into pods. |
| Deployment | Runs stateless application services such as UI, cart, checkout, and API workloads. |
| StatefulSet | Runs stateful workloads that require stable identity or persistent storage. |
| Service | Provides stable internal networking for pods. |
| Ingress | Exposes selected services externally through the AWS Load Balancer Controller. |


### Namespace Creation

Create a dedicated namespace for the application:

```bash
cd/Kubernetes_manifest

kubectl apply -f 00_namespace_micro-tier.yaml

#Verify the namespace:

kubectl get namespace micro-tier
```

### Apply The Micro-service Kubernetes Manifests

Apply the micro-service manifests in this order:

```bash
cd Kubernetes_manifests/

kubectl apply -f statefulset_k8manifest/ -n micro-tier

# Verify your pods are running
kubectl get pods -n micro-tier
```

### Ingress Creation

Create an ingress for the application:

```bash
cd/Kubernetes_manifest

kubectl apply -f ingress/ -n micro-tier

#Verify the ingress:

kubectl get ingress -n micro-tier
```

### Verify The Secret Mount

Check the MySQL pod:

```bash
kubectl get pods
kubectl describe pod <catalog-mysql-pod-name>
```

Look for the CSI volume:

```text
secrets-store.csi.k8s.io
catalog-db-secrets
```

Verify the mounted files from inside the pod:

```bash
kubectl exec -it <catalog-mysql-pod-name> -- ls /mnt/secrets-store
```

Expected files:

```text
MYSQL_USER
MYSQL_PASSWORD
```

If the pod cannot mount the secret, check:

- The AWS secret name is `catalog-db-secret`.
- The `SecretProviderClass` name is `catalog-db-secrets`.
- The pod service account is associated with the IAM role through EKS Pod Identity.
- The IAM policy allows `secretsmanager:GetSecretValue` for `catalog-db-secret*`.
- The Secrets Store CSI Driver and AWS provider pods are running in `kube-system`.

***Do the same for the order secret and rabbitmq***

### Connect to MySQL Database and Verify

```bash
# Connect to MySQL Database using MySQL Client Pod
kubectl run mysql-client --rm -it \
--image=mysql:8.0 \
--restart=Never \
-- mysql -h catalog-mysql -u mydbadmin -p'password'
```

### Run SQL Commands

```sql
SHOW DATABASES;
USE catalogdb;
SHOW TABLES;
SELECT * FROM products;
SELECT * FROM tags;
SELECT * FROM product_tags;
EXIT;
```

### Connect to Postgress Database and Verify

```bash
kubectl run postgres-client --rm -it \
  --image=postgres:16 \
  --restart=Never \
  -- env PGPASSWORD='Password' psql -h orders-postgresql -U username -d orders
```
```sql
# Show tables
\dt
\d orders
\d order_items
```

Access the application through the ingress URL.


## 11. Infrastructure Provisioning With Terraform For AWS Infrastructure Deployment

This project uses Terraform to provision the AWS infrastructure required to run the microservices platform on Amazon EKS with AWS-managed backend services.

In this deployment mode, Kubernetes runs the application workloads, while AWS provides the supporting dataplane services such as databases, cache, queues, IAM permissions, and infrastructure integrations.

Terraform is responsible for creating:

- The shared networking layer
- The EKS cluster
- EKS managed node groups
- Kubernetes platform add-ons
- IAM roles and Pod Identity associations
- AWS-managed application dataplane resources
- Security groups and private networking for application services

This deployment mode is different from the StatefulSet deployment mode. In the StatefulSet path, databases and queues run inside Kubernetes. In the AWS infrastructure deployment path, those services are moved to AWS managed services.


### Terraform Directory Layout

```text
AWS/Terraform/
shared/
  backend/
    s3-backend-bucket.tf

  vpc/
    terraform-manifests/
    vpc-module/

eks-aws-dataplane/
  cluster-and-addons/
  app-dataplane/
```

### What Each Folder Does

| Folder | Purpose |
|---|---|
| AWS/Terraform/shared/backend | Creates the S3 bucket used for Terraform remote state |
| AWS/Terraform/shared/vpc | Creates the shared VPC, public subnets, private subnets, route tables, internet gateway, and NAT gateways |
| AWS/Terraform/eks-aws-dataplane/cluster-and-addons | Creates the EKS cluster, managed node groups, IAM roles, and required EKS add-ons |
| AWS/Terraform/eks-aws-dataplane/app-dataplane | Creates AWS-managed resources used by the application services |


### What Terraform Provisions

| Area | Resources |
|---|---|
| Backend State | S3 bucket for Terraform state |
| Networking | VPC, public subnets, private subnets, route tables, internet gateway, NAT gateways |
| Kubernetes Platform | EKS cluster, managed node groups, cluster IAM role, node IAM role |
| EKS Add-ons | Pod Identity Agent, AWS Load Balancer Controller, Secrets Store CSI Driver, AWS Secrets Provider |
| IAM | IAM roles, IAM policies, Pod Identity associations |
| Catalog Dataplane | Amazon RDS MySQL, Secrets Manager credentials, security group, DB subnet group |
| Cart Dataplane | Amazon DynamoDB table and IAM permissions |
| Checkout Dataplane | Amazon ElastiCache Redis cluster, subnet group, security group |
| Orders Dataplane | Amazon RDS PostgreSQL, Amazon SQS, Secrets Manager credentials, IAM permissions |
| Secrets Access | IAM permissions for workloads to read required AWS Secrets Manager secrets |


### Apply Order

The AWS infrastructure deployment should be applied in this order:

```text
1. AWS/Terraform/shared/backend
2. AWS/Terraform/shared/vpc/terraform-manifests
3. AWS/Terraform/eks-aws-dataplane/cluster-and-addons
4. AWS/Terraform/eks-aws-dataplane/app-dataplane
5. AWS/Kubernetes_manifest/00_namespace_micro-tier.yaml
6. AWS/Kubernetes_manifest/aws_dataplane_k8manifest/
```

### VPC Provisioning

Create the shared VPC before creating EKS or application dataplane resources:

```bash
cd AWS/Terraform/shared/vpc/terraform-manifests

terraform init
terraform validate
terraform plan
terraform apply
```

The VPC layer creates:

- VPC
- Public subnets
- Private subnets
- Internet gateway
- NAT gateways
- Route tables
- Subnet associations
- Outputs required by EKS and application dataplane resources

Common outputs include:

- vpc_id
- public_subnet_ids
- private_subnet_ids

### EKS Cluster And Add-ons

After the VPC is available, provision the EKS cluster and required platform add-ons:

```bash
cd AWS/Terraform/eks-aws-dataplane/cluster-and-addons

terraform init
terraform validate
terraform plan -var-file="env/dev.tfvars"
terraform apply -var-file="env/dev.tfvars"
```

This stage creates:

- EKS control plane
- EKS managed private node group
- EKS cluster IAM role
- EKS node group IAM role
- Subnet tags required by AWS Load Balancer Controller
- EKS Pod Identity Agent
- AWS Load Balancer Controller
- Secrets Store CSI Driver
- AWS Secrets Provider

After the cluster is created, configure kubectl:

```bash
aws eks update-kubeconfig \
--name <cluster-name> \
--region <aws-region>
```

Verify:

```bash
kubectl get nodes -n micro-tier
kubectl get pods -n kube-system
```

### Provision AWS Application Dataplane

```bash
cd AWS/Terraform/eks-aws-dataplane/app-dataplane

terraform init
terraform validate
terraform plan
terraform apply
```

This creates the AWS-managed resources consumed by the app:

| Service | Terraform Provisions |
|---|---|
| catalog | RDS MySQL, DB subnet group, security group, Secrets Manager credentials, IAM role, Pod Identity |
| carts | DynamoDB table, IAM role, Pod Identity |
| checkout | ElastiCache Redis, subnet group, security group |
| orders | RDS PostgreSQL, SQS queue, Secrets Manager credentials, IAM role, Pod Identity |

### Confirm Terraform Outputs

After applying the app dataplane stack, confirm the generated endpoints and identity resources.

Examples:

```bash
terraform output
```

Look for values such as:

- catalog RDS endpoint
- checkout Redis endpoint
- orders PostgreSQL endpoint
- orders SQS queue name or URL
- Pod Identity association ARNs
- IAM role ARNs

Use these values to confirm that the Kubernetes ConfigMaps match the actual AWS resource endpoints.

### Create Namespace

```bash
kubectl apply -f AWS/Kubernetes_manifest/00_namespace_micro-tier.yaml

kubectl get namespace micro-tier
```

## 12. Deploy AWS Dataplane Manifests

```bash
kubectl apply -f AWS/Kubernetes_manifest/aws_dataplane_k8manifest/ -n micro-tier

# Deploy ingress after services exist:

kubectl apply -f AWS/Kubernetes_manifest/ingress/ -n micro-tier
```

Verify workloads:

```bash
kubectl get pods -n micro-tier
kubectl get svc -n micro-tier
kubectl get ingress -n micro-tier
kubectl get events -n micro-tier --sort-by=.lastTimestamp
```

### Validate Pod Identity

Each AWS-integrated pod must use the correct Kubernetes service account.

```bash
kubectl get pod <pod-name> -n micro-tier -o jsonpath="{.spec.serviceAccountName}"
```

Expected examples:

- catalog -> catalog
- carts   -> carts
- orders  -> orders

If the service account does not match the Terraform Pod Identity association, AWS access will fail.

### Validate Secrets Mounts

Catalog and orders use AWS Secrets Manager through Secrets Store CSI.

Check the SecretProviderClass resources:

```bash
kubectl get secretproviderclass -n micro-tier

# Describe a pod:

kubectl describe pod <pod-name> -n micro-tier
```

Look for:

```text
secrets-store.csi.k8s.io
```

Check mounted files:

```bash
kubectl exec -it <pod-name> -n micro-tier -- ls /mnt/secrets-store
```

```text
# Expected catalog files:

MYSQL_USER
MYSQL_PASSWORD

# Expected orders files:

RETAIL_ORDERS_PERSISTENCE_USERNAME
RETAIL_ORDERS_PERSISTENCE_PASSWORD
```

### Validate Catalog To RDS MySQL

Apply the catalog MySQL verification pod:

```bash
kubectl apply -f AWS/Kubernetes_manifest/aws_dataplane_verification_pod/01_catalog_mysql_client_pod.yaml -n micro-tier
```

Connect to the pod:

```bash
kubectl exec -it catalog-mysql-client -n micro-tier -- sh
```

Inside the pod:

```bash
echo "$MYSQL_ENDPOINT"
echo "$MYSQL_DB"
```

```bash
mysql -h "${MYSQL_ENDPOINT%%:*}" \
-P "${MYSQL_ENDPOINT##*:}" \
-u "$(cat /mnt/secrets-store/MYSQL_USER)" \
-p"$(cat /mnt/secrets-store/MYSQL_PASSWORD)" \
"$MYSQL_DB"
```

Verify schema:

```sql
SHOW TABLES;
SELECT * FROM products LIMIT 10;
EXIT;
```

### Validate Carts To DynamoDB

Apply the DynamoDB verification pod:

```bash
kubectl apply -f AWS/Kubernetes_manifest/aws_dataplane_verification_pod/02_cart_dynamodb_awscli_pod.yaml -n micro-tier
```

Connect:

```bash
kubectl exec -it carts-dynamodb-client -n micro-tier -- sh
```

Validate identity and table access:

```bash
aws sts get-caller-identity

aws dynamodb describe-table \
--table-name Items \
--region $AWS_REGION

aws dynamodb scan \
--table-name Items \
--region $AWS_REGION
```

### Validate Checkout To ElastiCache Redis

Apply the Redis verification pod:

```bash
kubectl apply -f AWS/Kubernetes_manifest/
aws_dataplane_verification_pod/03_checkout_elasticache_redis_client_pod.yaml -n micro-tier
```

Connect:

```bash
kubectl exec -it checkout-redis-client -n micro-tier -- bash
```

Inside the pod:

```bash
echo "$REDIS_URL"

REDIS_HOST=$(echo $REDIS_URL | sed -E 's#redis://([^:]+):([0-9]+)#\1#')
REDIS_PORT=$(echo $REDIS_URL | sed -E 's#redis://([^:]+):([0-9]+)#\2#')

redis-cli -h $REDIS_HOST -p $REDIS_PORT PING
```

Expected response:

```text
PONG
```

### Validate Orders To RDS PostgreSQL

Apply the PostgreSQL verification pod:

```bash
kubectl apply -f AWS/Kubernetes_manifest/aws_dataplane_verification_pod/04_orders_postgresql_client_pod.yaml -n micro-tier
```

Connect:

```bash
kubectl exec -it orders-postgresql-client -n micro-tier -- bash
```

Inside the pod:

```bash
export PGUSER="$(cat /mnt/secrets-store/RETAIL_ORDERS_PERSISTENCE_USERNAME)"
export PGPASSWORD="$(cat /mnt/secrets-store/RETAIL_ORDERS_PERSISTENCE_PASSWORD)"

psql -h $(echo $PG_ENDPOINT | cut -d: -f1) \
-p 5432 \
-U $PGUSER \
-d $PGDATABASE

# Verify:

\l
\dt
SELECT COUNT(*) FROM orders;
\q
```

### Validate Orders To SQS

Apply the SQS verification pod:

```bash
kubectl apply -f AWS/Kubernetes_manifest/aws_dataplane_verification_pod/05_orders_sqs_awscli_pod.yaml -n micro-tier
```

Connect:

```bash
kubectl exec -it orders-sqs-client -n micro-tier -- bash
```

Inside the pod:

```bash
aws sts get-caller-identity
echo $AWS_REGION
echo $SQS_QUEUE_NAME

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
QUEUE_URL="https://sqs.${AWS_REGION}.amazonaws.com/${ACCOUNT_ID}/${SQS_QUEUE_NAME}"

aws sqs get-queue-attributes \
--queue-url $QUEUE_URL \
--attribute-names All \
--region $AWS_REGION

aws sqs receive-message \
--queue-url $QUEUE_URL \
--max-number-of-messages 5 \
--wait-time-seconds 5 \
--region $AWS_REGION
```

### Cleanup Verification Pods

```bash
kubectl delete -f AWS/Kubernetes_manifest/aws_dataplane_verification_pod/ -n micro-tier
```

### Troubleshooting Checklist

If a pod cannot access AWS resources, check:

- The pod is running in namespace micro-tier
- The pod uses the expected service account
- Terraform created the matching EKS Pod Identity association
- IAM policy allows the required AWS actions
- The AWS resource endpoint in the ConfigMap is correct
- The AWS resource security group allows traffic from the EKS node or cluster security group
- Secrets Store CSI Driver is running in kube-system
- AWS Secrets Provider is running in kube-system
- The expected secret exists in AWS Secrets Manager

Useful commands:

```bash
kubectl describe pod <pod-name> -n micro-tier
kubectl logs <pod-name> -n micro-tier
kubectl get events -n micro-tier --sort-by=.lastTimestamp
kubectl get configmap -n micro-tier
```


## 13. Helm

  - Chart structure
  - Values files
  - Environment-specific values
  - Install/upgrade commands
  - Rollback commands


## 14. Karpenter Installation

<img width="1644" height="957" alt="Image" src="https://github.com/user-attachments/assets/dcebbe99-feb3-4bd0-b4eb-3b09685c9488" />

This section explains how to install and configure Karpenter on Amazon EKS.

Karpenter is a Kubernetes node autoscaler built for AWS. It watches for pending pods and automatically provisions the right EC2 instances based on workload requirements such as CPU, memory, architecture, capacity type, instance family, and availability zone.

In this project, Karpenter is used to improve cluster autoscaling, reduce unused capacity, support Spot instances, and remove the need to manually manage multiple Auto Scaling Groups for different workload types.

### What Karpenter Does

Karpenter provides the following capabilities:

| Capability | Description |
|---|---|
| Fast node provisioning | Creates EC2 nodes quickly when pods cannot be scheduled. |
| Right-sized compute | Selects instance types based on pod resource requests and scheduling rules. |
| Cost optimization | Uses consolidation to remove underutilized nodes. |
| Spot support | Can provision Spot instances for cost savings. |
| Flexible scheduling | Supports workload placement rules using NodePools. |
| AWS-native integration | Uses EC2, IAM, SQS, EventBridge, and EKS access entries. |

### Karpenter Architecture

The Karpenter flow works like this:

```text
Pending Kubernetes Pod
      |
      v
Karpenter Controller
      |
      v
NodePool
      |
      v
EC2NodeClass
      |
      v
AWS EC2 Instance
      |
      v
New Kubernetes Node joins EKS
      |
      v
Pending Pod gets scheduled
```

The main resources are:

| Resource | Purpose |
|---|---|
| Karpenter Controller | Runs inside the EKS cluster and watches for unscheduled pods. |
| NodePool | Defines what type of nodes Karpenter can create. |
| EC2NodeClass | Defines AWS-specific node settings such as AMI, IAM role, subnets, security groups, and EBS volume settings. |
| NodeClaim | Represents an individual node request created by Karpenter. |
| SQS Queue | Receives interruption events for Spot and EC2 lifecycle events. |
| EventBridge Rules | Forward AWS interruption events to the SQS queue. |

### Project File Structure

```text
17_01_Karpenter_Install/
|
|-- Terraform-shared/vpc/terraform-manifests/
|   |-- c1-versions.tf
|   |-- c2-variables.tf
|   |-- c3-vpc.tf
|   |-- c4-outputs.tf
|   |-- terraform.tfvars
|
|-- AWS/Terraform/eks-statefulset_and_addons/
|   |-- c1_versions.tf
|   |-- c2_variables.tf
|   |-- c3_remote-state.tf
|   |-- c4_datasources_and_locals.tf
|   |-- c5_eks_tags.tf
|   |-- c6_eks_cluster_iamrole.tf
|   |-- c7_eks_cluster.tf
|   |-- c8_eks_nodegroup_iamrole.tf
|   |-- c9_eks_nodegroup_private.tf
|   |-- c10_eks_outputs.tf
|   |-- c11-podidentityagent-eksaddon.tf
|   |-- c14-xx-lbc-*.tf
|   |-- c15-xx-ebscsi-*.tf
|   |-- c16-xx-secretstorecsi-*.tf
|   |-- c17-xx-externaldns-*.tf
|   |-- terraform.tfvars
|
|-- AWS/Karpenter/KARPENTER_terraform-manifests/
|   |-- c1_versions.tf
|   |-- c2_variables.tf
|   |-- c3_01_vpc_remote_state.tf
|   |-- c3_02_eks_remote_state.tf
|   |-- c4_datasources_and_locals.tf
|   |-- c5_helm_and_kubernetes_providers.tf
|   |-- c6_01_karpenter_controller_iam_role.tf
|   |-- c6_02_karpenter_controller_iam_policy.tf
|   |-- c6_03_karpenter_pod_identity_association.tf
|   |-- c6_04_karpenter_node_iam_role.tf
|   |-- c6_05_karpenter_access_entry.tf
|   |-- c6_06_karpenter_helm_install.tf
|   |-- c6_07_karpenter_sqs_queue.tf
|   |-- c6_08_karpenter_eventbridge_rules.tf
|   |-- terraform.tfvars
|
|-- AWS/Karpenter/KAPERNTER_k8_manifests/
|   |-- 01_ec2nodeclass.yaml
|   |-- 02_nodepool_ondemand.yaml
|   |-- 03_nodepool_spot.yaml
|
|-- create-cluster-with-karpenter.sh
|-- destroy-cluster-with-karpenter.sh
|-- README.md
```

### Deployment Order

Karpenter depends on the VPC and EKS cluster, so the infrastructure must be deployed in the correct order.

```text
1. Deploy VPC
2. Deploy EKS cluster and add-ons
3. Deploy Karpenter infrastructure
4. Configure kubectl access
5. Verify Karpenter controller
6. Apply EC2NodeClass and NodePools
7. Test node provisioning
```

### Step 1: Deploy The VPC

```bash
cd Terraform-shared/vpc/terraform-manifests/

terraform init
terraform validate
terraform plan
terraform apply
```

The VPC layer creates the networking foundation used by EKS and Karpenter.

It provides:

```text
VPC
Public subnets
Private subnets
Route tables
NAT gateways
Internet gateway
Subnet outputs
```

### Step 2: Deploy EKS Cluster And Add-ons

```bash
cd AWS/Terraform/eks-statefulset_and_addons/

terraform init
terraform validate
terraform plan
terraform apply
```

This layer creates the EKS cluster and required add-ons.

It includes:

```text
EKS cluster
Managed node group
EKS Pod Identity Agent
AWS Load Balancer Controller
EBS CSI Driver
Secrets Store CSI Driver
ExternalDNS
Subnet tags required by EKS and Karpenter
```

After the cluster is created, configure local access:

```bash
aws eks update-kubeconfig \
--name retail-dev-eksdemo1 \
--region us-east-1
```

Verify the cluster:

```bash
kubectl get nodes
kubectl get pods -n kube-system
```

### Step 3: Deploy Karpenter Infrastructure

```bash
cd AWS/Karpenter/KARPENTER_terraform-manifests/

terraform init
terraform validate
terraform plan
terraform apply
```

This layer installs and configures the AWS resources required by Karpenter.

It creates:

```text
Karpenter controller IAM role
Karpenter controller IAM policy
EKS Pod Identity association
Karpenter node IAM role
EKS access entry for Karpenter nodes
Karpenter Helm release
SQS interruption queue
EventBridge rules for interruption events
```

### Step 4: Verify Karpenter Controller

Check that the Karpenter pods are running:

```bash
kubectl get pods -n kube-system -l app.kubernetes.io/name=karpenter
```

Check the Helm release:

```bash
helm list -n kube-system
helm status karpenter -n kube-system
```

Check Karpenter logs:

```bash
kubectl logs -n kube-system -l app.kubernetes.io/name=karpenter -f
```

A healthy Karpenter startup usually shows messages such as:

```text
Starting Controller
Starting workers
successfully acquired lease
```

If multiple Karpenter replicas are running, only one pod becomes the active leader. The other pod waits as standby.

### Step 5: Apply Karpenter Configuration

After the controller is running, apply the Karpenter Kubernetes resources.

```bash
cd ../KAPERNTER_k8_manifests

kubectl apply -f 01_ec2nodeclass.yaml
kubectl apply -f 02_nodepool_ondemand.yaml
kubectl apply -f 03_nodepool_spot.yaml
```

Verify:

```bash
kubectl get ec2nodeclass
kubectl get nodepool
kubectl describe ec2nodeclass default-ec2nodeclass
kubectl describe nodepool ondemand-nodepool
kubectl describe nodepool spot-nodepool
```

### EC2NodeClass

The `EC2NodeClass` defines the AWS-specific settings Karpenter uses when launching EC2 worker nodes.

It controls:

```text
AMI family
AMI selection
Node IAM role
Subnet selection
Security group selection
EBS volume configuration
Instance metadata options
Node discovery tags
```

Example:

```yaml
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
name: default-ec2nodeclass
spec:
amiFamily: AL2023

amiSelectorTerms:
  - alias: al2023@latest

role: "arn:aws:iam::180789647333:role/retail-dev-karpenter-node-role"

subnetSelectorTerms:
  - tags:
      kubernetes.io/cluster/retail-dev-eksdemo1: owned
      kubernetes.io/role/internal-elb: "1"

securityGroupSelectorTerms:
  - tags:
      kubernetes.io/cluster/retail-dev-eksdemo1: owned

tags:
  karpenter.sh/discovery: retail-dev-eksdemo1

blockDeviceMappings:
  - deviceName: /dev/xvda
    ebs:
      volumeSize: 20Gi
      volumeType: gp3
      encrypted: true
      deleteOnTermination: true

metadataOptions:
  httpTokens: required
  httpPutResponseHopLimit: 2
```

### Important Subnet Selection Note

Karpenter should launch worker nodes in private subnets for a production-style cluster.

The cluster tag may exist on both public and private subnets:

```text
kubernetes.io/cluster/retail-dev-eksdemo1 = owned
```

If Karpenter only uses that tag, it may discover both public and private subnets.

To force Karpenter to use only private subnets, add this filter:

```text
kubernetes.io/role/internal-elb = 1
```

This ensures Karpenter launches worker nodes only in private subnets.

Recommended private subnet selector:

```yaml
subnetSelectorTerms:
- tags:
    kubernetes.io/cluster/retail-dev-eksdemo1: owned
    kubernetes.io/role/internal-elb: "1"
```

### On-Demand NodePool

The On-Demand NodePool defines stable compute capacity for regular workloads.

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
name: ondemand-nodepool
spec:
template:
  spec:
    nodeClassRef:
      group: karpenter.k8s.aws
      kind: EC2NodeClass
      name: default-ec2nodeclass

    requirements:
      - key: kubernetes.io/arch
        operator: In
        values: ["amd64"]

      - key: kubernetes.io/os
        operator: In
        values: ["linux"]

      - key: karpenter.k8s.aws/instance-family
        operator: In
        values: ["t3", "t3a"]

      - key: karpenter.k8s.aws/instance-size
        operator: In
        values: ["micro", "small", "medium"]

      - key: topology.kubernetes.io/zone
        operator: In
        values: ["us-east-1a", "us-east-1b", "us-east-1c"]

limits:
  cpu: "50"

disruption:
  consolidationPolicy: WhenEmptyOrUnderutilized
  consolidateAfter: 30s
```
Use On-Demand capacity for workloads that need more predictable availability.


### Spot NodePool

The Spot NodePool allows Karpenter to provision Spot instances for cost savings.

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
name: spot-nodepool
spec:
template:
  spec:
    nodeClassRef:
      group: karpenter.k8s.aws
      kind: EC2NodeClass
      name: default-ec2nodeclass

    requirements:
      - key: kubernetes.io/arch
        operator: In
        values: ["amd64"]

      - key: kubernetes.io/os
        operator: In
        values: ["linux"]

      - key: karpenter.sh/capacity-type
        operator: In
        values: ["spot"]

      - key: karpenter.k8s.aws/instance-family
        operator: In
        values: ["t3", "t3a", "t2", "c5a", "c6a"]

      - key: karpenter.k8s.aws/instance-size
        operator: In
        values: ["micro", "small", "medium", "large"]

      - key: topology.kubernetes.io/zone
        operator: In
        values: ["us-east-1a", "us-east-1b", "us-east-1c"]

limits:
  cpu: "50"

disruption:
  consolidationPolicy: WhenEmptyOrUnderutilized
  consolidateAfter: 30s
```

Spot capacity is useful for fault-tolerant workloads, batch jobs, background workers, and non-critical services.

For critical production workloads, prefer On-Demand or use pod scheduling rules to control which workloads can run on Spot nodes.


*** Karpenter vs Traditional Cluster Autoscaler ***

| Feature | Karpenter | Cluster Autoscaler |
|----------|------------|-------------------|
| Provisioning Speed | 30–60 seconds | 2–5 minutes |
| Instance Selection | Intelligent, considers multiple types | Limited to predefined node groups |
| Consolidation | Automatic, configurable | Manual or slow |
| Cost Optimization | Built-in, proactive | Reactive |


*** Troubleshooting Tips ***

***Issue: Pods Stuck in Pending***

Possible Causes:

- NodePool not applied or misconfigured
- EC2NodeClass missing or incorrect
- Insufficient CPU limits in NodePool (limits.cpu)
- No matching instance types available in the region

***Solution:***

```bash
# Check NodePool status
kubectl get nodepool

# Check Karpenter controller logs
kubectl logs -n karpenter -l app.kubernetes.io/name=karpenter -f
```

*** Issue: Nodes Not Being Removed After Scale Down ***

Possible Causes:

- ***consolidationPolicy*** not set to ***WhenEmptyOrUnderutilized***
- ***consolidateAfter*** duration too long
- Pods with PodDisruptionBudget blocking eviction

### Useful Verification Commands

Check Karpenter pods:

```bash
kubectl get pods -n kube-system -l app.kubernetes.io/name=karpenter
```

Check NodePools:

```bash
kubectl get nodepool
kubectl describe nodepool ondemand-nodepool
kubectl describe nodepool spot-nodepool
```

Check EC2NodeClass:

```bash
kubectl get ec2nodeclass
kubectl describe ec2nodeclass default-ec2nodeclass
```

Check NodeClaims:

```bash
kubectl get nodeclaims -o wide
kubectl describe nodeclaim <nodeclaim-name>
```

Check Karpenter-managed nodes:

```bash
kubectl get nodes -l karpenter.sh/nodepool
```

Watch Karpenter logs:

```bash
kubectl logs -n kube-system -l app.kubernetes.io/name=karpenter -f
```

Check controller version:

```bash
kubectl get deployment -n kube-system karpenter \
-o jsonpath='{.spec.template.spec.containers[0].image}'
```

Check metrics:

```bash
kubectl top pods -n kube-system -l app.kubernetes.io/name=karpenter
```

### Upgrading Karpenter

Karpenter is installed through Terraform using the Helm provider.

To upgrade:

```bash
cd 03_KARPENTER_terraform-manifests
```

Update the Helm chart version in:

```text
c6_06_karpenter_helm_install.tf
```

Then run:

```bash
terraform plan
terraform apply
```

Verify the upgrade:

```bash
kubectl get pods -n kube-system -l app.kubernetes.io/name=karpenter
helm list -n kube-system | grep karpenter
```

Before upgrading, review the Karpenter upgrade notes for breaking changes.

NodePools and EC2NodeClass resources are not usually replaced by a Helm upgrade, but their API versions or supported fields may change between major Karpenter versions.

### Updating NodePool Configuration

To update the On-Demand or Spot NodePool:

```bash
cd KAPERNTER_k8_manifests
```

Edit the required file:

```text
02_nodepool_ondemand.yaml
03_nodepool_spot.yaml
```

Apply the change:

```bash
kubectl apply -f 02_nodepool_ondemand.yaml
kubectl apply -f 03_nodepool_spot.yaml
```

Verify:

```bash
kubectl describe nodepool ondemand-nodepool
kubectl describe nodepool spot-nodepool
```

Existing nodes are not always replaced immediately. New nodes will use the updated NodePool configuration.

To force workloads onto new nodes, cordon and drain old nodes carefully, or allow Karpenter consolidation to replace underutilized nodes over time.


### Cleanup

Destroy resources in reverse order.

First, delete the Karpenter NodePools:

```bash
kubectl delete nodepools --all
```

Wait for Karpenter NodeClaims to be removed:

```bash
kubectl wait --for=delete nodeclaims --all --timeout=300s
```

Verify that Karpenter-managed nodes are gone:

```bash
kubectl get nodes -l karpenter.sh/nodepool
```

Destroy Karpenter infrastructure:

```bash
cd 03_KARPENTER_terraform-manifests
terraform destroy
```

Destroy EKS:

```bash
cd ../02_EKS_terraform-manifests_with_addons
terraform destroy
```

Destroy VPC:

```bash
cd ../01_VPC_terraform-manifests
terraform destroy
```


## 15. Karpenter On-Demand Instances - Autoscaling - Testing

In this section, we will demonstrate Karpenter's autoscaling capabilities using on-demand instances.

We'll deploy a simple test application that triggers Karpenter to provision new nodes based on pod resource requirements, and then observe how Karpenter automatically consolidates and removes nodes when they're no longer needed.

What You'll Learn

- How Karpenter provisions on-demand nodes based on pod requirements

- Observing node scaling up (from 5 to 10 replicas)

- Observing node scaling down (from 10 to 2 replicas)

- Understanding Karpenter's consolidation behavior

- Verifying NodeClaims and Node lifecycle

Prerequisites

- Karpenter controller installed and running

- On-demand NodePool configured and applied

- EC2NodeClass configured

***File Structure***

Karpenter
├── Karpenter_k8_manifests
└── Karpenter_terraform_manifests
└── create-cluster-with-carpenetr.sh
└── destroy-cluster-with-carpenetr.sh
└── On-demand_autoscaling_test.yaml

***Manifest Overview***

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: karpenter-autoscale-demo-ondemand
labels:
  demo: karpenter-ondemand
spec:
replicas: 5 
selector:
  matchLabels:
    app: autoscale-demo
template:
  metadata:
    labels:
      app: autoscale-demo
  spec:
    # Force pods to on-demand nodes
    nodeSelector:
      karpenter.sh/capacity-type: on-demand
    
    containers:
      - name: pause
        image: public.ecr.aws/eks-distro/kubernetes/pause:3.9
        resources:
          requests:
            cpu: "500m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"
```

***Key Configuration:***

- 5 replicas - Cost-effective starting point (5 pods × 500m CPU = 2.5 vCPUs needed)

- nodeSelector - Ensures pods land only on on-demand nodes

- Resource requests - 500m CPU + 256Mi memory per pod

Deploy the Application

```bash
# Change to the project directory
cd Karpenter

# Deploy the autoscaling test deployment
kubectl apply -f On-demand_autoscaling_test.yaml

# Output
deployment.apps/karpenter-autoscale-demo-ondemand created
```

***Observe Pods in Pending State***

Initially, pods will be in Pending state while Karpenter provisions new nodes:

```bash
# Check pod status
kubectl get pods

# Output
NAME                                                 READY   STATUS    RESTARTS   AGE
karpenter-autoscale-demo-ondemand-6bd55b7cdd-76xch   0/1     Pending   0          13s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-bs5mr   0/1     Pending   0          13s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-btkzz   0/1     Pending   0          13s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-mcwkj   0/1     Pending   0          13s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-vxmnl   0/1     Pending   0          14s
```

***Watch Karpenter Create NodeClaims***

Karpenter will create NodeClaims to provision the required nodes:

```bash
# Check NodeClaims
kubectl get nodeclaims
```
<!-- Output -->

<img width="1268" height="107" alt="Image" src="https://github.com/user-attachments/assets/daa781fc-2224-4181-b03c-268c409d3530" />


*** What's Happening: ***

- Karpenter calculated: 5 pods × 500m CPU = 2.5 vCPUs needed

- Provisioned 2× t3.small (2 vCPU each = 4 vCPUs total)

- Chose smallest instance types to fit workload efficiently

***Watch Nodes Become Ready***

```bash
# Check nodes (initial state - NotReady)
kubectl get nodes

# Output
NAME                          STATUS     ROLES    AGE   VERSION
ip-10-0-10-57.ec2.internal    Ready      <none>   38m   v1.34.1-eks-c39b1d0
ip-10-0-11-119.ec2.internal   NotReady   <none>   10s   v1.34.1-eks-c39b1d0
ip-10-0-11-72.ec2.internal    Ready      <none>   38m   v1.34.1-eks-c39b1d0
ip-10-0-12-232.ec2.internal   Ready      <none>   38m   v1.34.1-eks-c39b1d0
ip-10-0-12-93.ec2.internal    NotReady   <none>   5s    v1.34.1-eks-c39b1d0
```

After ~20-30 seconds, the new nodes become Ready and the pods get scheduled:

```bash
# Check nodes again
kubectl get nodes

# Output
NAME                          STATUS   ROLES    AGE   VERSION
ip-10-0-10-57.ec2.internal    Ready    <none>   38m   v1.34.1-eks-c39b1d0
ip-10-0-11-119.ec2.internal   Ready    <none>   23s   v1.34.1-eks-c39b1d0
ip-10-0-11-72.ec2.internal    Ready    <none>   38m   v1.34.1-eks-c39b1d0
ip-10-0-12-232.ec2.internal   Ready    <none>   38m   v1.34.1-eks-c39b1d0
ip-10-0-12-93.ec2.internal    Ready    <none>   18s   v1.34.1-eks-c39b1d0
```

***Verify Pods Running***

```bash
# Check pod status
kubectl get pods
```
<img width="1505" height="192" alt="Image" src="https://github.com/user-attachments/assets/9d11a2e4-a962-4e5e-8e6a-d6cb9a754949" />


***Scale Up to 10 Replicas***

Now let's scale up to 10 replicas and observe Karpenter provision additional nodes:

```bash
# Scale deployment to 10 replicas
kubectl scale deploy/karpenter-autoscale-demo-ondemand --replicas=10

# Output
deployment.apps/karpenter-autoscale-demo-ondemand scaled
```

*** Observe New Pods in Pending State ***

```bash
# Check pods
kubectl get pods
```

<img width="1180" height="307" alt="Image" src="https://github.com/user-attachments/assets/425e70ed-13d9-4e26-a3b6-65afb9685b99" />

*** Watch Karpenter Create Additional NodeClaims ***

```bash
# Check NodeClaims
kubectl get nodeclaims

# Output
NAME                      TYPE        CAPACITY    ZONE         NODE                          READY     AGE
ondemand-nodepool-fqzc8   t3.small    on-demand   us-east-1b   ip-10-0-11-119.ec2.internal   True      116s
ondemand-nodepool-w4dlq   t3a.small   on-demand   us-east-1c   ip-10-0-12-93.ec2.internal    True      116s
ondemand-nodepool-wpw4p   t3.small    on-demand   us-east-1b                                 Unknown   17s
ondemand-nodepool-zqzd2   t3a.small   on-demand   us-east-1b                                 Unknown   17s
```

***What's Happening:***

- 5 additional pods × 500m CPU = 2.5 vCPUs needed
- Karpenter provisioned 2 more t3.small nodes
- Total: 4 nodes to handle 10 pods (5 vCPUs total requirement)

***Verify All Nodes Ready***

```bash
# Check nodes
kubectl get nodes

ip-10-0-10-148.ec2.internal   Ready    <none>   36m   v1.34.8-eks-3385e9b
ip-10-0-10-29.ec2.internal    Ready    <none>   11m   v1.34.8-eks-3385e9b
ip-10-0-11-114.ec2.internal   Ready    <none>   36m   v1.34.8-eks-3385e9b
ip-10-0-11-158.ec2.internal   Ready    <none>   13s   v1.34.8-eks-3385e9b
ip-10-0-12-106.ec2.internal   Ready    <none>   36m   v1.34.8-eks-3385e9b
ip-10-0-12-61.ec2.internal    Ready    <none>   11m   v1.34.8-eks-3385e9b
ip-10-0-12-88.ec2.internal    Ready    <none>   17s   v1.34.8-eks-3385e9b
```

Verify All Pods Running

```bash
# Check pods
kubectl get pods

NAME                                                 READY   STATUS    RESTARTS   AGE
karpenter-autoscale-demo-ondemand-6bd55b7cdd-4hmt4   1/1     Running   0          2m11s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-646hm   1/1     Running   0          13m
karpenter-autoscale-demo-ondemand-6bd55b7cdd-72mb6   1/1     Running   0          2m11s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-84zk2   1/1     Running   0          2m11s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-86cnl   1/1     Running   0          2m11s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-d9zk5   1/1     Running   0          2m11s
karpenter-autoscale-demo-ondemand-6bd55b7cdd-jf59q   1/1     Running   0          13m
karpenter-autoscale-demo-ondemand-6bd55b7cdd-jspnp   1/1     Running   0          13m
karpenter-autoscale-demo-ondemand-6bd55b7cdd-r2b2b   1/1     Running   0          13m
karpenter-autoscale-demo-ondemand-6bd55b7cdd-zcdrh   1/1     Running   0          13m
```

*** Scale Down to 2 Replicas and Observe Consolidation ***

Now let's scale down to 2 replicas and watch Karpenter consolidate and terminate underutilized nodes:

```bash
# Scale down to 2 replicas
kubectl scale deploy/karpenter-autoscale-demo-ondemand --replicas=2

# Output
deployment.apps/karpenter-autoscale-demo-ondemand scaled
```

***Observe Pod Termination***

```bash
# Check pods
kubectl get pods

# Output
NAME                                                 READY   STATUS    RESTARTS   AGE
karpenter-autoscale-demo-ondemand-6bd55b7cdd-646hm   1/1     Running   0          13m
karpenter-autoscale-demo-ondemand-6bd55b7cdd-r2b2b   1/1     Running   0          13m
```
***Note:*** Only 2 pods remain running. The other 8 pods have been terminated.

***Watch Karpenter Consolidate Nodes***

Karpenter's consolidation policy (WhenEmptyOrUnderutilized) kicks in after 30 seconds (as configured in the NodePool):

```bash
# Check NodeClaims immediately after scaling down
kubectl get nodeclaims

# Output (nodes still present, but being evaluated)
NAME                      TYPE        CAPACITY    ZONE         NODE                          READY   AGE
ondemand-nodepool-fqzc8   t3.small    on-demand   us-east-1b   ip-10-0-11-119.ec2.internal   True    3m6s
ondemand-nodepool-qw9cb   t3a.small   on-demand   us-east-1a                                 Unknown 25s
ondemand-nodepool-w4dlq   t3a.small   on-demand   us-east-1c   ip-10-0-12-93.ec2.internal    True    3m6s
ondemand-nodepool-wpw4p   t3.small    on-demand   us-east-1b   ip-10-0-11-90.ec2.internal    True    87s
ondemand-nodepool-zqzd2   t3a.small   on-demand   us-east-1b   ip-10-0-11-70.ec2.internal    True    87s
```

***What's Happening:***

- Karpenter detects underutilized nodes
- After 30s (consolidateAfter: 30s), it begins draining and terminating nodes
- A new, smaller node may be created to consolidate remaining workload


***Observe Node Draining***

```bash
# Check nodes - some will show NotReady status during draining
kubectl get nodes

ip-10-0-10-148.ec2.internal   Ready      <none>   39m     v1.34.8-eks-3385e9b
ip-10-0-10-29.ec2.internal    NotReady   <none>   13m     v1.34.8-eks-3385e9b
ip-10-0-11-114.ec2.internal   Ready      <none>   39m     v1.34.8-eks-3385e9b
ip-10-0-11-158.ec2.internal   Ready      <none>   2m59s   v1.34.8-eks-3385e9b
ip-10-0-12-106.ec2.internal   Ready      <none>   39m     v1.34.8-eks-3385e9b
ip-10-0-12-61.ec2.internal    Ready      <none>   13m     v1.34.8-eks-3385e9b
ip-10-0-12-88.ec2.internal    Ready      <none>   3m3s    v1.34.8-eks-3385e9b
```

***Note:*** ip-10-0-10-29.ec2.internal is in NotReady state as it's being drained.

***Final State - Consolidated NodeClaims***

After a few minutes, only the necessary nodes remain:

```bash
# Check final NodeClaims state
kubectl get nodeclaims

# Output
NAME                      TYPE        CAPACITY    ZONE         NODE                          READY   AGE
ondemand-nodepool-nkrp5   t3a.small   on-demand   us-east-1b   ip-10-0-11-158.ec2.internal   True    4m38s
```

***Result:***

- Karpenter consolidated workload to a single t3a.small node
- 2 pods × 500m CPU = 1 vCPU (fits easily on one t3a.small with 2 vCPUs)
- All other nodes terminated automatically

*** Clean Up and Observe Final Consolidation ***

Let's delete the deployment entirely and watch Karpenter clean up all provisioned nodes:

```bash
# Delete the deployment
kubectl delete -f kube-manifests-On-demand/

# Output
deployment.apps "karpenter-autoscale-demo-ondemand" deleted
```

***Watch Nodes Get Drained***

```bash
# Check nodes immediately after deletion
kubectl get nodes

# Output
NAME                          STATUS     ROLES    AGE     VERSION
ip-10-0-10-148.ec2.internal   Ready      <none>   43m     v1.34.8-eks-3385e9b
ip-10-0-11-114.ec2.internal   Ready      <none>   43m     v1.34.8-eks-3385e9b
ip-10-0-11-158.ec2.internal   NotReady   <none>   6m58s   v1.34.8-eks-3385e9b
ip-10-0-12-106.ec2.internal   Ready      <none>   43m     v1.34.8-eks-3385e9b

```

***Watch NodeClaims Get Removed***

```bash
# Check NodeClaims
kubectl get nodeclaims

# Output
NAME                      TYPE        CAPACITY    ZONE         NODE                          READY   AGE
ondemand-nodepool-nkrp5   t3a.small   on-demand   us-east-1b   ip-10-0-11-158.ec2.internal   True    6m57s
```
After ~30 seconds (consolidation wait time):

```bash
# Check NodeClaims again
kubectl get nodeclaims

# Output
No resources found
```

***Verify All Karpenter-Managed Nodes Removed***

```bash
# Check final node state
kubectl get nodes

# Output (only original EKS managed nodes remain)
NAME                          STATUS   ROLES    AGE    VERSION
ip-10-0-10-148.ec2.internal   Ready    <none>   3h8m   v1.34.8-eks-3385e9b
ip-10-0-11-114.ec2.internal   Ready    <none>   3h8m   v1.34.8-eks-3385e9b
ip-10-0-12-106.ec2.internal   Ready    <none>   3h8m   v1.34.8-eks-3385e9b
```

***Result:***

- All Karpenter-managed nodes terminated

- Only original EKS managed node group nodes remain

- Cluster back to baseline state

*** Key Observations and Learning Points ***

What We Demonstrated

- Autoscaling Up:

- Karpenter provisions nodes within 30-60 seconds based on pod requirements
- Intelligently selects smallest instance types (t3.small, t3a.small)
- Creates NodeClaims → Launches EC2 instances → Nodes become Ready

- Autoscaling Down:

- Karpenter waits 30 seconds (consolidateAfter: 30s) before consolidating
- Drains underutilized nodes gracefully
- Terminates unnecessary nodes to save costs


## 16. Karpenter Spot Instances - Autoscaling - Testing

In this section, we will demonstrate Karpenter with Spot instances - AWS EC2 instances available at up to 90% discount compared to On-Demand pricing.

Unlike the previous On-Demand demo where we explored scaling mechanics in detail, this demo focuses on what makes Spot instances unique and how to verify you're actually getting Spot capacity.

*** What You'll Learn ***

- Understanding Spot instances and their cost benefits

- How to configure workloads to run on Spot nodes

- Verifying that Karpenter provisions actual Spot instances

- Observing Karpenter's instance diversity strategy for Spot

- When to use Spot vs On-Demand capacity

*** Spot Instances - Key Concepts***

What are Spot Instances?

- Spare AWS compute capacity available at steep discounts
- 50-90% cheaper than On-Demand instances (typically 70% savings)
- Can be interrupted by AWS with 2-minute warning when capacity is needed elsewhere
- AWS reclaims Spot instances when On-Demand demand increases

***Cost Comparison Example:***

| Instance Type | On-Demand Price | Spot Price | Savings |
|--------------|----------------|------------|----------|
| t3.medium | $0.0416/hour | ~$0.0125/hour | 70% |
| c5a.large | $0.077/hour | ~$0.023/hour | 70% |
| t3a.small | $0.0188/hour | ~$0.0056/hour | 70% |

***Best Use Cases for Spot:***

- Stateless web applications (can handle pod restarts)

- Batch processing jobs (fault-tolerant workloads)

- CI/CD pipelines (temporary workloads)

- Development/test environments

- Microservices with multiple replicas

❌ Avoid for: Databases, stateful apps, single-replica critical services

***Spot Interruption Behavior:***

- AWS sends a 2-minute termination notice before reclaiming capacity

- Karpenter/Kubernetes drains the node gracefully

- Pods are rescheduled to other available nodes

- (We'll cover interruption handling in detail in next section)

***Prerequisites***

- Karpenter controller installed and running

- Spot NodePool configured and applied

- EC2NodeClass configured

### Review Spot NodePool Configuration

Before deploying our test application, let's review the Spot NodePool we created earlier:

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
name: spot-nodepool
spec:
template:
  spec:
    nodeClassRef:
      group: karpenter.k8s.aws
      kind: EC2NodeClass
      name: default-ec2nodeclass

    taints: []
    startupTaints: []

    requirements:
      - key: kubernetes.io/arch
        operator: In
        values: ["amd64"]

      - key: kubernetes.io/os
        operator: In
        values: ["linux"]

      # Spot capacity (50-90% cheaper than on-demand)
      # Note: Spot instances can be interrupted with 2-minute notice
      # Best for fault-tolerant, stateless workloads        
      - key: karpenter.sh/capacity-type
        operator: In
        values: ["spot"]

      # Multiple instance families for better spot availability
      - key: karpenter.k8s.aws/instance-family
        operator: In
        values: ["t3", "t3a", "t2", "c5a", "c6a"]

      # Allow micro to large - flexibility helps find available spot capacity
      - key: karpenter.k8s.aws/instance-size
        operator: In
        values: ["micro", "small", "medium", "large"]

      # Must match the AZs where your EKS cluster has subnets configured
      # Karpenter can only launch nodes in AZs with configured VPC subnets
      - key: topology.kubernetes.io/zone
        operator: In
        values: ["us-east-1a", "us-east-1b", "us-east-1c"]

limits:
  cpu: "50"

disruption:
  consolidationPolicy: WhenEmptyOrUnderutilized
  consolidateAfter: 30s

  # Add budgets to control disruption rate
  budgets:
    - nodes: "100%"  # Allow all nodes to be disrupted if needed
      reasons:
        - "Drifted"
        - "Underutilized"
        - "Empty"    
```

***Key Spot-Specific Configurations:***

- Capacity-type: spot - Tells Karpenter to use only Spot instances
- Multiple instance families - t3, t3a, t2, c5a, c6a increases Spot availability
- Flexible instance sizes - micro to large gives more Spot options

Why Multiple Instance Types? Spot capacity varies by instance type and availability zone. By allowing multiple types, Karpenter can find available Spot capacity more easily, reducing the risk of "insufficient capacity" errors.

### Review Spot Autoscaling Test Manifest

***Manifest Overviee***

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: karpenter-autoscale-demo-spot
labels:
  demo: karpenter-spot
spec:
replicas: 5  # 5 pods = ~2.5 vCPUs needed
selector:
  matchLabels:
    app: autoscale-demo-spot
template:
  metadata:
    labels:
      app: autoscale-demo-spot
  spec:
    # THIS IS CRITICAL - Forces pods to run ONLY on Spot nodes
    nodeSelector:
      karpenter.sh/capacity-type: spot
    
    containers:
      - name: pause
        image: public.ecr.aws/eks-distro/kubernetes/pause:3.9
        resources:
          requests:
            cpu: "500m"      # 0.5 vCPU per pod
            memory: "256Mi"  # 256MB per pod
          limits:
            cpu: "500m"
            memory: "256Mi"
```

*** Key Configuration:***

- nodeSelector: spot - Ensures pods only schedule on Spot nodes (won't fallback to On-Demand)
- 5 replicas - 5 pods × 500m CPU = 2.5 vCPUs required

What Karpenter Will Do: With 2.5 vCPUs required, Karpenter will likely provision:

- 2× t3.small instances (2 vCPU each = 4 vCPUs total) OR
- 2× t3a.small (cheaper AMD-based alternative) OR
- Mix of instance types based on Spot availability

### Deploy Application and Verify Spot Nodes

Deploy the Spot Application

```bash
# Change to the project directory
cd Karpenter

# Deploy the Spot autoscaling test deployment
kubectl apply -f kube-manifests-Spot/Spot_autoscaling_test.yaml

# Output
deployment.apps/karpenter-autoscale-demo-spot created
```

*** Observe Pods in Pending State***

Initially, pods will be Pending while Karpenter provisions Spot nodes:

```bash
# Check pod status
kubectl get pods

# Output
NAME                                             READY   STATUS    RESTARTS   AGE
karpenter-autoscale-demo-spot-7c8d9f6b5d-2xqhl   0/1     Pending   0          8s
karpenter-autoscale-demo-spot-7c8d9f6b5d-4vnpr   0/1     Pending   0          8s
karpenter-autoscale-demo-spot-7c8d9f6b5d-7kmwx   0/1     Pending   0          8s
karpenter-autoscale-demo-spot-7c8d9f6b5d-n8qzc   0/1     Pending   0          8s
karpenter-autoscale-demo-spot-7c8d9f6b5d-xhj2m   0/1     Pending   0          8s
```

*** Watch Karpenter Create Spot NodeClaims***

```bash
# Watch NodeClaims being created
kubectl get nodeclaims -w

# Output
NAME                   TYPE       CAPACITY   ZONE         NODE   READY     AGE
spot-nodepool-abc123   t3.small   spot       us-east-1a          Unknown   15s
spot-nodepool-xyz789   t3a.small  spot       us-east-1b          Unknown   15s
```

Important: Notice the *** CAPACITY *** column shows spot - this confirms Karpenter is creating Spot instances!

*** Watch Nodes Become Ready ***

```bash
# Check nodes (wait ~30-60 seconds)
kubectl get nodes

# Initial state - NotReady
NAME                          STATUS     ROLES    AGE   VERSION
ip-10-0-10-57.ec2.internal    Ready      <none>   45m   v1.34.1-eks-c39b1d0
ip-10-0-11-72.ec2.internal    Ready      <none>   45m   v1.34.1-eks-c39b1d0
ip-10-0-12-145.ec2.internal   NotReady   <none>   12s   v1.34.1-eks-c39b1d0
ip-10-0-12-232.ec2.internal   Ready      <none>   45m   v1.34.1-eks-c39b1d0
ip-10-0-12-87.ec2.internal    NotReady   <none>   9s    v1.34.1-eks-c39b1d0
```

After ~30 seconds, nodes become Ready:

```bash
# Check nodes again
kubectl get nodes

# Output
NAME                          STATUS   ROLES    AGE   VERSION
ip-10-0-10-57.ec2.internal    Ready    <none>   45m   v1.34.1-eks-c39b1d0
ip-10-0-11-72.ec2.internal    Ready    <none>   45m   v1.34.1-eks-c39b1d0
ip-10-0-12-145.ec2.internal   Ready    <none>   35s   v1.34.1-eks-c39b1d0
ip-10-0-12-232.ec2.internal   Ready    <none>   45m   v1.34.1-eks-c39b1d0
ip-10-0-12-87.ec2.internal    Ready    <none>   32s   v1.34.1-eks-c39b1d0
```

### Verify Spot Instances (Critical Verification Step!)

This is the most important part - let's prove these are actually Spot instances!

*** Check Capacity Type Label ***

Every node provisioned by Karpenter gets labeled with its capacity type:

```bash
# Filter nodes by capacity-type=spot
kubectl get nodes --selector=karpenter.sh/capacity-type=spot

# Output
NAME                          STATUS   ROLES    AGE   VERSION
ip-10-0-12-145.ec2.internal   Ready    <none>   45s   v1.34.1-eks-c39b1d0
ip-10-0-12-87.ec2.internal    Ready    <none>   42s   v1.34.1-eks-c39b1d0
```

- Confirmed: These nodes have the karpenter.sh/capacity-type=spot label!

*** Check Node Labels for Instance Details ***

```bash
# Get detailed labels from one Spot node
kubectl get node ip-10-0-12-145.ec2.internal -o json | jq '.metadata.labels'

# Output (relevant labels)
{
"karpenter.sh/capacity-type": "spot",
"node.kubernetes.io/instance-type": "t3a.small",
"karpenter.k8s.aws/instance-family": "t3a",
"karpenter.k8s.aws/instance-size": "small",
"topology.kubernetes.io/zone": "us-east-1a"
}
```

What This Tells Us:

- capacity-type: spot - Confirmed Spot instance

- instance-type: t3a.small - AMD-based instance (typically cheaper)

- zone: us-east-1a - Availability zone placement

*** Verify Instance Diversity***

One key advantage of Spot with Karpenter is instance diversity - mixing different instance types improves availability:

```bash
# Check instance types of all Spot nodes
kubectl get nodes -l karpenter.sh/capacity-type=spot \
-o custom-columns=NAME:.metadata.name,INSTANCE-TYPE:.metadata.labels."node\.kubernetes\.io/instance-type"

# Output (example showing diversity)
NAME                          INSTANCE-TYPE
ip-10-0-12-145.ec2.internal   t3a.small
ip-10-0-12-87.ec2.internal    t3.small
```

Why Different Types?

t3a.small - AMD-based, slightly cheaper

t3.small - Intel-based, more available

Karpenter picks whatever Spot capacity is available at the best price

*** Verify Pods Running on Spot Nodes ***

Now let's confirm our application pods are actually running on the Spot nodes:

```bash
# Check pod placement with node names
kubectl get pods -o wide

# Output
NAME                                             READY   STATUS    RESTARTS   NODE
karpenter-autoscale-demo-spot-7c8d9f6b5d-2xqhl   1/1     Running   0          ip-10-0-12-145.ec2.internal
karpenter-autoscale-demo-spot-7c8d9f6b5d-4vnpr   1/1     Running   0          ip-10-0-12-87.ec2.internal
karpenter-autoscale-demo-spot-7c8d9f6b5d-7kmwx   1/1     Running   0          ip-10-0-12-145.ec2.internal
karpenter-autoscale-demo-spot-7c8d9f6b5d-n8qzc   1/1     Running   0          ip-10-0-12-87.ec2.internal
karpenter-autoscale-demo-spot-7c8d9f6b5d-xhj2m   1/1     Running   0          ip-10-0-12-145.ec2.internal
```

Perfect! All 5 pods are running on the two Spot nodes we identified earlier.

***Verify Pod Distribution***
```bash
# Count pods per node
kubectl get pods -o wide | grep karpenter-autoscale-demo-spot | awk '{print $7}' | sort | uniq -c

# Output
    3 ip-10-0-12-145.ec2.internal
    2 ip-10-0-12-87.ec2.internal
```

Karpenter distributed pods across both Spot nodes for better availability.


*** Clean Up and Observe Node Removal ***

Let's delete the deployment and watch Karpenter automatically clean up the Spot nodes:

```bash
# Delete the deployment
kubectl delete -f kube-manifests-Spot/Spot_autoscaling_test.yaml

# Output
deployment.apps "karpenter-autoscale-demo-spot" deleted
```

*** Watch Pods Terminate***

```bash
# Check pods (should show Terminating)
kubectl get pods

# Output
NAME                                             READY   STATUS        RESTARTS   AGE
karpenter-autoscale-demo-spot-7c8d9f6b5d-2xqhl   1/1     Terminating   0          3m45s
karpenter-autoscale-demo-spot-7c8d9f6b5d-4vnpr   1/1     Terminating   0          3m45s
```

*** Watch Nodes Get Drained***

After the consolidateAfter: 30s wait period:

```bash
# Check nodes
kubectl get nodes

# Output (Spot nodes will show NotReady during drain)
NAME                          STATUS     ROLES    AGE     VERSION
ip-10-0-10-57.ec2.internal    Ready      <none>   50m     v1.34.1-eks-c39b1d0
ip-10-0-11-72.ec2.internal    Ready      <none>   50m     v1.34.1-eks-c39b1d0
ip-10-0-12-145.ec2.internal   NotReady   <none>   4m20s   v1.34.1-eks-c39b1d0
ip-10-0-12-232.ec2.internal   Ready      <none>   50m     v1.34.1-eks-c39b1d0
ip-10-0-12-87.ec2.internal    NotReady   <none>   4m17s   v1.34.1-eks-c39b1d0
```

*** Watch NodeClaims Get Removed***
```bash
# Check NodeClaims
kubectl get nodeclaims

# Output (initially still present)
NAME                   TYPE       CAPACITY   ZONE         NODE                          READY   AGE
spot-nodepool-abc123   t3.small   spot       us-east-1a   ip-10-0-12-145.ec2.internal   False   4m35s
spot-nodepool-xyz789   t3a.small  spot       us-east-1b   ip-10-0-12-87.ec2.internal    False   4m35s
```

After ~1-2 minutes:
```bash
# Check NodeClaims again
kubectl get nodeclaims

# Output
No resources found
```

*** Verify Final State***
```bash
# Check nodes - only original EKS managed nodes remain
kubectl get nodes

# Output
NAME                          STATUS   ROLES    AGE   VERSION
ip-10-0-10-57.ec2.internal    Ready    <none>   55m   v1.34.1-eks-c39b1d0
ip-10-0-11-72.ec2.internal    Ready    <none>   55m   v1.34.1-eks-c39b1d0
ip-10-0-12-232.ec2.internal   Ready    <none>   55m   v1.34.1-eks-c39b1d0
```

- Perfect cleanup! All Spot nodes removed, cluster back to baseline.

*** Instance Diversity***

***On-Demand NodePool:***
```yaml
instance-family: ["t3", "t3a"]  # Limited variety
```
***Spot NodePool:***
```yaml
instance-family: ["t3", "t3a", "t2", "c5a", "c6a"]  # Wide variety!
```

***Why More Variety for Spot?***

- Spot capacity fluctuates by instance type
- More options = better availability
- Reduces "InsufficientInstanceCapacity" errors

*** When to Use Each***

| Use Case | On-Demand | Spot | Why? |
|----------|-----------|------|------|
| Production databases | - | ❌ | Stateful, can't handle interruptions |
| Web application (3+ replicas) | ⚠️ | - | Fault-tolerant, cost-effective |
| Single-replica critical service | - | ❌ | No redundancy to handle interruptions |
| CI/CD pipelines | ⚠️ | - | Temporary jobs, cost matters |
| Batch processing | ⚠️ | - | Fault-tolerant, elastic workloads |
| Development/test | ⚠️ | - | Non-critical, maximize savings |

*** Spot Best Practices***

1. Always Use Multiple Replicas

```yaml
spec:
replicas: 3  # Minimum - survives 1-2 interruptions
```

2. Use Pod Disruption Budgets

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
name: app-pdb
spec:
minAvailable: 2  # Keep at least 2 pods running
selector:
  matchLabels:
    app: your-app
```

3. Use Diverse Instance Types

```yaml
# Good - wide variety
instance-family: ["t3", "t3a", "t2", "c5a", "c6a"]

# Bad - too restrictive
instance-family: ["t3"]  # May struggle to find capacity
```

4. Implement Health Checks

```yaml
livenessProbe:
httpGet:
  path: /health
  port: 8080
readinessProbe:
httpGet:
  path: /ready
  port: 8080
```

5. Handle Graceful Shutdown

```yaml
lifecycle:
preStop:
  exec:
    command: ["/bin/sh", "-c", "sleep 15"]  # Allow time for connections to drain
```

*** Troubleshooting***

Issue: Pods Stuck in Pending

Symptoms:

```bash
kubectl get pods
# All pods show "Pending" for > 2 minutes
```

Possible Causes:

 - No Spot capacity available in selected instance types/zones
 - Spot NodePool not applied correctly
 - nodeSelector typo

Solution:

```bash
# Check Karpenter logs for capacity errors
kubectl logs -n karpenter -l app.kubernetes.io/name=karpenter --tail=50

# Look for errors like:
# "InsufficientInstanceCapacity: no spot capacity available"

# Solution: Widen instance type selection in NodePool
```

***Issue: Nodes Using On-Demand Instead of Spot***

Symptoms:

```bash
kubectl get nodes -l karpenter.sh/capacity-type=spot
# Returns no nodes, but pods are running
```

Possible Causes:

- Spot NodePool not applied

- nodeSelector not specified in deployment

Solution:

```bash
# Verify NodePool exists
kubectl get nodepool spot-nodepool

# Verify deployment has nodeSelector
kubectl get deploy karpenter-autoscale-demo-spot -o yaml | grep -A2 nodeSelector
```

***Issue: Frequent "InsufficientInstanceCapacity" Errors***

Solution: Expand instance type diversity in your Spot NodePool:

```yaml
requirements:
- key: karpenter.k8s.aws/instance-family
  operator: In
  values: ["t3", "t3a", "t2", "c5", "c5a", "c6a", "c6i"]  # More options!

- key: karpenter.k8s.aws/instance-size
  operator: In
  values: ["micro", "small", "medium", "large", "xlarge"]  # Wider range
```


## 17. Karpenter Spot Interruption Handling

<img width="1672" height="941" alt="Image" src="https://github.com/user-attachments/assets/36a1fd19-e407-4935-a7c4-706b16995f87" />

This section explains how Karpenter handles Spot Instance interruptions in an Amazon EKS cluster.

Spot Instances can be interrupted by AWS when EC2 needs the capacity back. When this happens, AWS normally gives a two-minute interruption warning before the instance is terminated. Karpenter uses an interruption queue to receive these events and respond before the node is removed.

In this project, interruption handling is configured using:

```text
Amazon EventBridge
Amazon SQS
Karpenter Controller
Karpenter NodeClaims
Kubernetes Node Draining
```

### Why Interruption Handling Is Important

Spot Instances reduce compute cost, but they are not guaranteed to stay available. Without proper interruption handling, workloads running on Spot nodes may be terminated suddenly.

Karpenter interruption handling helps reduce the impact by:

| Benefit | Description |
|---|---|
| Graceful node shutdown | Karpenter detects interruption events and starts draining the affected node. |
| Pod rescheduling | Pods are evicted and rescheduled onto other available nodes. |
| Replacement capacity | Karpenter can create new nodes when replacement capacity is needed. |
| Lower downtime risk | Applications with multiple replicas can continue serving traffic during node replacement. |
| Better Spot reliability | Spot workloads become safer when interruption events are handled automatically. |

### Interruption Handling Architecture

The interruption flow works like this:

```text
AWS detects Spot interruption
      |
      v
Amazon EventBridge receives interruption event
      |
      v
EventBridge sends event to SQS queue
      |
      v
Karpenter polls the SQS interruption queue
      |
      v
Karpenter identifies the affected node
      |
      v
Karpenter cordons and drains the node
      |
      v
Pods are rescheduled
      |
      v
Karpenter provisions replacement capacity if needed
```

*** AWS Resources Used ***

| Resource | Purpose |
|---|---|
| EventBridge Rules | Capture Spot interruption, rebalance, scheduled change, and instance state-change events. |
| SQS Queue | Stores interruption events for the Karpenter controller to consume. |
| Karpenter Controller IAM Policy | Allows Karpenter to read and delete messages from the interruption queue. |
| Karpenter Controller | Watches the queue and reacts to interruption events. |
| NodePool | Defines the type of replacement capacity Karpenter can provision. |
| EC2NodeClass | Defines AWS-specific settings used when launching replacement nodes. |

*** Events Handled By Karpenter ***

Karpenter can respond to several AWS interruption-related events.

Common event types include:

```text
EC2 Spot Instance Interruption Warning

EC2 Instance Rebalance Recommendation

EC2 Instance State-change Notification

AWS Health Scheduled Change
```

These events are routed from EventBridge to the SQS queue that Karpenter watches.

*** Terraform Resources ***

In this project, the Karpenter interruption handling infrastructure is created in the Karpenter Terraform layer.

Relevant files:

```text
KARPENTER_terraform-manifests/
|
|-- c6_02_karpenter_controller_iam_policy.tf
|-- c6_06_karpenter_helm_install.tf
|-- c6_07_karpenter_sqs_queue.tf
|-- c6_08_karpenter_eventbridge_rules.tf
```

*** SQS Interruption Queue ***

The SQS queue receives interruption events from EventBridge.

```text
EventBridge -> SQS interruption queue -> Karpenter controller
```

Karpenter must be configured with the queue name so it knows where to poll for interruption events.

*** EventBridge Rules ***

EventBridge rules capture AWS interruption events and forward them to the SQS queue.

The rules should include events such as:

```text
Spot Instance interruption warnings

Instance rebalance recommendations

Instance state changes

AWS Health scheduled changes
```

*** Karpenter IAM Permission ***

The Karpenter controller IAM role must have permission to consume messages from the SQS queue.

Required SQS permissions usually include:

```text
sqs:GetQueueUrl

sqs:ReceiveMessage

sqs:DeleteMessage
```

Without these permissions, Karpenter may run, but it will not be able to process interruption messages.

*** Karpenter Helm Configuration ***

Karpenter must be installed with the interruption queue configured.

The Helm configuration should include the interruption queue name.

Example:

```text
settings.interruptionQueue = <karpenter-interruption-queue-name>
```

### How Karpenter Handles Interruptions

The Flow:

```text
1. AWS sends interruption warning → EventBridge → SQS Queue
2. Karpenter polls SQS (every 10 seconds), detects message
3. Karpenter cordons node (stops new pod scheduling)
4. Karpenter provisions replacement node (proactive!)
5. Karpenter drains node (respects PodDisruptionBudgets)
6. Kubernetes reschedules pods to new node
7. Old node terminates after pods are safe
```

*** Key Point:*** Karpenter starts provisioning the new node BEFORE draining the old one - this is why there's zero downtime!


### Prerequisites 

- Karpenter installed with interruption queue

- Spot NodePool deployed

- SQS queue connected to EventBridge

<!-- All files for the karpenter and the configuration are in the Karpenter folder -->

Quick verification:

```bash
# 1. Check Karpenter is running
kubectl get pods -n kube-system -l app.kubernetes.io/name=karpenter

# 2. Verify interruption queue configured
helm get values karpenter -n kube-system | grep interruptionQueue
# Expected: interruptionQueue: retail-dev-eksdemo1

# 3. Check SQS queue exists
aws sqs list-queues | grep -i retail-dev-eksdemo1
```

*** PodDisruptionBudget for catalog Example ***

A PodDisruptionBudget helps protect application availability during node draining.

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
name: catalog-pdb
namespace: micro-tier
spec:
minAvailable: 2
selector:
  matchLabels:
    app: catalog
```
This means Kubernetes should keep at least two `catalog` pods available during voluntary disruptions.


### Testing Interruption Handling

We'll deploy a simple app with 5 replicas and a PodDisruptionBudget to ensure availability during interruptions.

Key configuration in ***Spot_Interruption_Handling.yaml:***

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: spot-test-app
namespace: default
spec:
replicas: 5
selector:
  matchLabels:
    app: spot-test
template:
  metadata:
    labels:
      app: spot-test
  spec:
    nodeSelector:
      karpenter.sh/capacity-type: spot  # ← Force Spot nodes
    
    terminationGracePeriodSeconds: 30   # ← Allow graceful shutdown
    
    containers:
    - name: nginx
      image: nginx:alpine
      ports: 
        - containerPort: 80
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi

---
# PodDisruptionBudget - THE KEY TO ZERO DOWNTIME
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
name: spot-test-app-pdb
namespace: default
spec:
minAvailable: 3  # ← Keep at least 3 pods running during disruptions
selector:
  matchLabels:
    app: spot-test
```

Why PodDisruptionBudget (PDB) is critical:

- Without PDB: All 5 pods could be evicted immediately → service down!
- With PDB (minAvailable: 3): Max 2 pods evicted at a time → service stays up!

*** Deploy Test Application ***

```bash
# Deploy the test app
cd Karpenter
kubectl apply -f kube-manifests-Spot-Interruption-Handling/Spot_Interruption_Handling.yaml

# Output
deployment.apps/spot-test-app created
poddisruptionbudget.policy/spot-test-app-pdb created
```

Verify pods are running:

```bash
# Watch pods get scheduled (takes ~1-2 minutes)
kubectl get pods -l app=spot-test -o wide

# Expected: All 5 pods Running on a Spot node
NAME                             READY   STATUS    RESTARTS   AGE   IP            NODE                         NOMINATED NODE   READINESS GATES
spot-test-app-6fc8848f77-87zlf   1/1     Running   0          37m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-9lz8g   1/1     Running   0          37m   10.0.12.102   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-hfmkw   1/1     Running   0          37m   10.0.12.175   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-p999v   1/1     Running   0          37m   10.0.12.180   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-w8f82   1/1     Running   0          37m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-87zlf   1/1     Running   0          49m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
```
***Checkpoint:*** - 5 pods running on Spot node


*** Prepare Monitoring (Open 4 Terminals) ***

Before triggering the interruption, open 4 terminal windows to watch the magic:

***Terminal 1: Karpenter Logs (Filtered)***

```bash
kubectl logs -n kube-system -l app.kubernetes.io/name=karpenter -f | \
grep -E "interrupt|cordon|drain"
```

***Terminal 2: Node Status***

```bash
kubectl get nodes -l karpenter.sh/capacity-type=spot -w
```

***Terminal 3: Pod Status***

```bash
kubectl get pods -l app=spot-test -o wide -w
```

***Terminal 4: NodeClaims***

```bash
kubectl get nodeclaims -w
```

*** Simulate Spot Interruption ***

Open a 5th terminal and send the interruption message:

```bash
# Get the Spot instance ID
SPOT_INSTANCE_ID=$(kubectl get nodes -l karpenter.sh/capacity-type=spot -o json | \
jq -r '.items[0].spec.providerID' | cut -d'/' -f5)

echo "Target Instance: $SPOT_INSTANCE_ID"

# Get SQS queue URL
CLUSTER_NAME="retail-dev-eksdemo1"
QUEUE_URL=$(aws sqs get-queue-url --queue-name $CLUSTER_NAME --query QueueUrl --output text)

# Send interruption message
aws sqs send-message \
--queue-url "$QUEUE_URL" \
--message-body "{
  \"version\": \"0\",
  \"id\": \"test-interrupt-$(date +%s)\",
  \"detail-type\": \"EC2 Spot Instance Interruption Warning\",
  \"source\": \"aws.ec2\",
  \"account\": \"123456789012\",
  \"time\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"region\": \"us-east-1\",
  \"resources\": [
    \"arn:aws:ec2:us-east-1:123456789012:instance/$SPOT_INSTANCE_ID\"
  ],
  \"detail\": {
    \"instance-id\": \"$SPOT_INSTANCE_ID\",
    \"instance-action\": \"terminate\"
  }
}"

echo "- Interruption message sent!"
echo "🔍 Watch your 4 monitoring terminals..."
```

*** Watch the Magic Happen ✨ ***

Now watch your 4 terminals! Here's what you'll see:

***Terminal 1: Karpenter Logs***

<img width="1628" height="163" alt="Image" src="https://github.com/user-attachments/assets/98e61e0a-d9ca-4883-ae94-fd170803bca7" />

Key events:

- Message detected within 10-20 seconds

- Node cordoned (no new pods)

- Drain initiated


***Terminal 2: Node Status***

```bash
# T+0s: Original node running
ip-10-0-12-56.ec2.internal   Ready    <none>   36m   v1.34.8-eks-3385e9b

# T+40s: New replacement node appears!
ip-10-0-12-56.ec2.internal   Ready    <none>   49m   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b   ← NEW NODE!

ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   0s    v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   NotReady   <none>   10s   v1.34.8-eks-3385e9b
ip-10-0-12-56.ec2.internal    Ready      <none>   50m   v1.34.8-eks-3385e9b

# T+60s: New node ready
ip-10-0-11-126.ec2.internal   Ready      <none>   20s   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   20s   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   20s   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   21s   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   30s   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   32s   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   34s   v1.34.8-eks-3385e9b

# T+2m30s: Old node draining
ip-10-0-12-56.ec2.internal    NotReady   <none>   50m   v1.34.8-eks-3385e9b
ip-10-0-12-56.ec2.internal    NotReady   <none>   50m   v1.34.8-eks-3385e9b
ip-10-0-12-56.ec2.internal    NotReady   <none>   50m   v1.34.8-eks-3385e9b
ip-10-0-12-56.ec2.internal    NotReady   <none>   50m   v1.34.8-eks-3385e9b
ip-10-0-12-56.ec2.internal    NotReady   <none>   50m   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   61s   v1.34.8-eks-3385e9b
ip-10-0-12-56.ec2.internal    NotReady   <none>   51m   v1.34.8-eks-3385e9b

# T+3m: Old node deleted
ip-10-0-11-126.ec2.internal   Ready      <none>   4m45s       ← Only new node remains
ip-10-0-11-126.ec2.internal   Ready      <none>   9m51s   v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   14m     v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   20m     v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   25m     v1.34.8-eks-3385e9b
ip-10-0-11-126.ec2.internal   Ready      <none>   30m     v1.34.8-eks-3385e9b
```

Key observation: - New node ready BEFORE old node fully drained = zero downtime!


***Terminal 3: Pod Status***

```bash
# T+0s: All pods on old node
NAME                             READY   STATUS    RESTARTS   AGE   IP            NODE                         NOMINATED NODE   READINESS GATES
spot-test-app-6fc8848f77-87zlf   1/1     Running   0          37m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-9lz8g   1/1     Running   0          37m   10.0.12.102   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-hfmkw   1/1     Running   0          37m   10.0.12.175   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-p999v   1/1     Running   0          37m   10.0.12.180   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-w8f82   1/1     Running   0          37m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none>           <none>

# T+40s: First 2 pods evicted (PDB allows max 2 at a time)
spot-test-app-6fc8848f77-87zlf   1/1     Terminating   0          49m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-87zlf   1/1     Terminating   0          49m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-87zlf   0/1     Completed     0          49m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-9cwbs   0/1     Pending       0          0s    <none>        <none>                       <none>           <none>
spot-test-app-6fc8848f77-9cwbs   0/1     Pending       0          0s    <none>        <none>                       <none>           <none>
spot-test-app-6fc8848f77-87zlf   0/1     Completed     0          49m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-87zlf   0/1     Completed     0          49m   10.0.12.57    ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-w8f82   1/1     Running       0          49m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-w8f82   1/1     Terminating   0          49m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-w8f82   1/1     Terminating   0          49m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-hwxls   0/1     Pending       0          0s    <none>        <none>                       <none>           <none>
spot-test-app-6fc8848f77-hwxls   0/1     Pending       0          0s    <none>        <none>                       <none>           <none>
spot-test-app-6fc8848f77-w8f82   0/1     Completed     0          49m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-w8f82   0/1     Completed     0          49m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-w8f82   0/1     Completed     0          49m   10.0.12.181   ip-10-0-12-56.ec2.internal   <none> 

# T+60s: New pods scheduled to new node
spot-test-app-6fc8848f77-vfl6q   0/1     Pending             0          0s    <none>        ip-10-0-11-126.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-vfl6q   0/1     ContainerCreating   0          0s    <none>        ip-10-0-11-126.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-p999v   0/1     Completed           0          51m   10.0.12.180   ip-10-0-12-56.ec2.internal    <none>           <none>
spot-test-app-6fc8848f77-p999v   0/1     Completed           0          51m   10.0.12.180   ip-10-0-12-56.ec2.internal    <none>           <none>
spot-test-app-6fc8848f77-p999v   0/1     Completed           0          51m   10.0.12.180   ip-10-0-12-56.ec2.internal    <none>           <none>
spot-test-app-6fc8848f77-9cwbs   1/1     Running             0          84s   10.0.11.171   ip-10-0-11-126.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-vfl6q   1/1     Running             0          14s   10.0.11.31    ip-10-0-11-126.ec2.internal   <none>

# T+2m: Remaining 3 pods evicted and replaced
... (similar pattern)

# T+3m: All 5 pods running on new node -
spot-test-app-6fc8848f77-26vmh   1/1     Running             0          15s   10.0.11.58    ip-10-0-11-126.ec2.internal   <none>           <none>
spot-test-app-6fc8848f77-bbcd7   1/1     Running             0          17s   10.0.11.93    ip-10-0-11-126.ec2.internal   <none>           <none>
... (5 total on NEW node)
```

Key observation: - Always 3+ pods running (thanks to PDB) = zero downtime!

*** Terminal 4: NodeClaims ***

```bash
# Old NodeClaim
spot-nodepool-pl74j   t2.small   spot       us-east-1c   ip-10-0-12-56.ec2.internal   True    37m

# New NodeClaim appears
spot-nodepool-r7wxt   t2.small   spot       us-east-1b                                Unknown   4s
spot-nodepool-r7wxt   t2.small   spot       us-east-1b   ip-10-0-11-126.ec2.internal   Unknown   36s

# Old NodeClaim deleted
spot-nodepool-r7wxt   t2.small   spot       us-east-1b   ip-10-0-11-126.ec2.internal   True      57s ← Only new
```

***Verify Success***

After ~2-3 minutes, verify everything worked:

```bash
# Check all pods running
kubectl get pods -l app=spot-test -o wide

# Expected output:
# NAME                  READY   STATUS    RESTARTS   NODE
NAME                             READY   STATUS    RESTARTS   AGE     IP            NODE 
spot-test-app-6fc8848f77-26vmh   1/1     Running   0          3m5s    10.0.11.58    ip-10-0-11-126.ec2.internal
spot-test-app-6fc8848f77-9cwbs   1/1     Running   0          4m38s   10.0.11.171   ip-10-0-11-126.ec2.internal
spot-test-app-6fc8848f77-bbcd7   1/1     Running   0          3m5s    10.0.11.93    ip-10-0-11-126.ec2.internal
spot-test-app-6fc8848f77-hwxls   1/1     Running   0          4m38s   10.0.11.99    ip-10-0-11-126.ec2.internal
spot-test-app-6fc8848f77-vfl6q   1/1     Running   0          3m25s   10.0.11.31    ip-10-0-11-126.ec2.internal

```

***Success indicators:***

- All 5 pods Running

- RESTARTS: 0 (clean migration, no crashes)

- All on new node (different IP from original)

- Old node deleted

Timeline summary:

⚡ Detection: 10-20 seconds

⚡ New node provisioned: 30-40 seconds

⚡ Full migration: ~2-3 minutes

⚡ Downtime: ZERO (PDB kept 3 pods running throughout)


*** Why This Worked - The Secret Sauce***

***The PodDisruptionBudget (PDB) - The Hero***

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
spec:
minAvailable: 3  # ← This is what prevented downtime!
```

What PDB does:

Without PDB:

```text
T+20s: Karpenter drains node
     → All 5 pods evicted immediately
     → 0/5 pods running ← SERVICE DOWN! ❌
T+60s: New node ready, pods rescheduled
     → 5/5 pods running ← 40 seconds of downtime!
```

With PDB (minAvailable: 3):

```text
T+20s: Karpenter drains node
     → PDB blocks: "You can only evict 2 pods, must keep 3 running!"
     → 2 pods evicted, 3 stay running ← SERVICE UP! -
T+40s: New node ready
     → 2 replacement pods start
     → Now 5/5 pods running (3 old + 2 new)
T+60s: PDB allows evicting remaining 3 pods (replacements ready)
     → All 5 pods now on new node ← ZERO downtime! -
```

The formula:

```text
Karpenter + PodDisruptionBudget + Proactive Provisioning = Zero Downtime
```

*** Other Key Components***

1. terminationGracePeriodSeconds: 30

- Gives pods 30 seconds to shut down gracefully
- Nginx handles this automatically (stops accepting new connections, completes in-flight requests)
- Must be < 120s (the Spot interruption window)

2. Diverse instance types

- Karpenter can pick from multiple instance families
- If t3 Spot is unavailable, tries t3a, t2, c5a, etc.
- Increases chance of finding replacement capacity quickly


*** Clean Up ***

```bash
# Delete the test deployment
kubectl delete -f kube-manifests-Spot-Interruption-Handling/Spot_Interruption_Handling.yaml

# Output
deployment.apps "spot-test-app" deleted
poddisruptionbudget.policy "spot-test-app-pdb" deleted
```

Karpenter will automatically clean up the unused Spot node in ~30-60 seconds.

```bash
# Watch automatic cleanup
kubectl get nodes -l karpenter.sh/capacity-type=spot -w

# After ~30s, the node will be deleted (consolidation)
```

Verify complete cleanup:

```bash
kubectl get nodes -l karpenter.sh/capacity-type=spot
# Expected: No resources found

kubectl get nodeclaims
# Expected: No resources found (or only on-demand nodes)
```

*** Production Best Practices ***

Now that you've seen it work, here's how to use this in production:

1. Always Use PodDisruptionBudgets for any production deployment

2. Set Appropriate Grace Periods

| Workload Type | Recommended |
|---------------|-------------|
| Stateless API | 30s |
| WebSocket server | 60s |
| Batch job | 90s |

Never exceed 90s - you need buffer before AWS force-terminates at 120s!

3. Set terminationGracePeriodSeconds Appropriately

Your application needs time to shut down gracefully:

- Stop accepting new connections

- Complete in-flight requests

- Close database connections

- Flush logs/metrics

Most web servers (nginx, Apache) handle this automatically - they respond to SIGTERM by gracefully shutting down.

For custom applications, ensure your code handles termination signals properly.


4. Mix Spot and On-Demand for Critical Apps

Best practice for production:

```yaml
# 60% on Spot (cost savings)
apiVersion: apps/v1
kind: Deployment
metadata:
name: my-app-spot
spec:
replicas: 3
template:
  spec:
    nodeSelector:
      karpenter.sh/capacity-type: spot

---
# 40% on On-Demand (stability)
apiVersion: apps/v1
kind: Deployment
metadata:
name: my-app-ondemand
spec:
replicas: 2
template:
  spec:
    nodeSelector:
      karpenter.sh/capacity-type: on-demand
```

Result:

- 60% cost savings from Spot

- 40% guaranteed capacity from On-Demand

- Even if all Spot nodes interrupted simultaneously, 2 pods stay up!

5. Use Diverse Instance Types

```yaml
# In your Spot NodePool
requirements:
- key: karpenter.k8s.aws/instance-family
  operator: In
  values: ["t3", "t3a", "t2", "c5a", "c6a", "m5"]  # ← Multiple options
```
Why: If t3 Spot is unavailable, Karpenter tries t3a, then t2, etc. Increases replacement node availability.


## 18. Horizontal Pod Autoscaler

This section explains how Horizontal Pod Autoscaler is configured for the microservices application.

Horizontal Pod Autoscaler, also called HPA, automatically adjusts the number of pod replicas for a Kubernetes Deployment based on observed resource usage. In this project, HPA is used to scale the application services based on CPU and memory utilization.

HPA helps the application handle changing traffic without manually increasing or decreasing replica counts.

### Why HPA Is Needed

In production, traffic is not constant. Some services may receive more requests during peak periods and fewer requests during quiet periods.

Without HPA, replica counts must be changed manually.

With HPA, Kubernetes can automatically scale pods based on resource usage.

```text
More traffic
  |
  v
CPU or memory usage increases
  |
  v
HPA increases pod replicas
  |
  v
More pods serve traffic

When traffic reduces:

Less traffic
  |
  v
CPU or memory usage decreases
  |
  v
HPA waits for the stabilization window
  |
  v
HPA safely reduces pod replicas
```

### HPA Architecture

The HPA flow works like this:

Application Pods
        |
        v
Metrics Server collects CPU and memory metrics
        |
        v
HPA reads metrics from the Kubernetes metrics API
        |
        v
HPA compares current usage with target utilization
        |
        v
HPA updates Deployment replica count
        |
        v
Kubernetes creates or removes pods
        |
        v
Karpenter provisions nodes if more capacity is needed

HPA scales pods. Karpenter scales nodes.

HPA = pod autoscaling

Karpenter = node autoscaling

### Prerequisite: Metrics Server

HPA requires Metrics Server. Metrics Server collects CPU and memory usage from Kubernetes nodes and pods.

In this project, Metrics Server is installed as an EKS add-on using Terraform.

Terraform files:

```text
AWS/Terraform/eks-statefulset_and_addons/c18_eksaddon_metrics_server.tf
AWS/Terraform/eks-aws-dataplane/cluster-and-addons/c16_eksaddon_metrics_server.tf
```

Verify Metrics Server:

```bash
kubectl get pods -n kube-system | grep metrics

# Check node metrics:

kubectl top nodes

# Check pod metrics:

kubectl top pods -n micro-tier
```

If kubectl top does not work, HPA will not be able to calculate CPU or memory utilization.

### HPA Manifests

The HPA manifests are stored in a shared folder so both deployment paths can use them:

```text
AWS/Kubernetes_manifest/HPA/
```

Files:

```text
AWS/Kubernetes_manifest/HPA/01_catalog_hpa.yaml
AWS/Kubernetes_manifest/HPA/02_carts_hpa.yaml
AWS/Kubernetes_manifest/HPA/03_checkout_hpa.yaml
AWS/Kubernetes_manifest/HPA/04_orders_hpa.yaml
AWS/Kubernetes_manifest/HPA/05_ui_hpa.yaml
```

These HPA resources target the application Deployments:

| HPA | Target Deployment |
|---|---|
| catalog-hpa | catalog |
| carts-hpa | carts |
| checkout-hpa | checkout |
| orders-hpa | orders |
| ui-hpa | ui |

### Scaling Configuration

Each HPA uses the same production baseline:

| Setting | Value | Purpose |
|---|---:|---|
| minReplicas | 3 | Keeps at least three pods running for availability. |
| maxReplicas | 12 | Prevents unlimited scaling and controls cost. |
| CPU target | 70% | Scales up when CPU utilization is above 70%. |
| Memory target | 80% | Scales up when memory utilization is above 80%. |

Example:

```yaml
minReplicas: 3
maxReplicas: 12
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      type: Utilization
      averageUtilization: 70
- type: Resource
  resource:
    name: memory
    target:
      type: Utilization
      averageUtilization: 80
```

### Scale Target Reference

Each HPA points to a Deployment using scaleTargetRef.

Example for catalog:

```yaml
scaleTargetRef:
apiVersion: apps/v1
kind: Deployment
name: catalog
```

This means the HPA controls the replica count of the catalog Deployment.

### HPA Behavior

This project also configures explicit scale-up and scale-down behavior.

### Scale Up

```yaml
scaleUp:
stabilizationWindowSeconds: 0
policies:
  - type: Percent
    value: 100
    periodSeconds: 15
  - type: Pods
    value: 4
    periodSeconds: 15
selectPolicy: Max
```

This allows HPA to scale up quickly when demand increases.

The policy means HPA can add either:

100% more pods

or

up to 4 pods

whichever allows the larger increase.

### Scale Down

```yaml
scaleDown:
stabilizationWindowSeconds: 300
policies:
  - type: Percent
    value: 50
    periodSeconds: 15
  - type: Pods
    value: 1
    periodSeconds: 60
selectPolicy: Min
```

This makes scale-down more conservative.

The 300 second stabilization window means Kubernetes waits before reducing replicas. This helps avoid rapid scale up/down behavior during temporary traffic drops.

The policy means HPA reduces pods slowly, choosing the smaller reduction between:

50% of pods

or

1 pod

This is safer for production workloads.

### Relationship With Deployment Replicas

The application Deployments are configured with three replicas:

```yaml
replicas: 3
```

The HPA also has:

```yaml
minReplicas: 3
```

Once HPA is applied, HPA becomes responsible for managing the Deployment replica count.

The Deployment should still define a baseline replica count, but HPA will continuously reconcile the number of replicas between:

```yaml
minReplicas: 3
maxReplicas: 12
```

### Relationship With PDB

This project also uses PodDisruptionBudgets with:

```yaml
minAvailable: 2
```

The production baseline is:

```text
Deployment replicas: 3
HPA minReplicas: 3
PDB minAvailable: 2
```

This means:

At least 3 pods should normally run.

At least 2 pods must remain available during voluntary disruptions.

Only 1 pod can be voluntarily evicted at a time.

This works well with Karpenter consolidation, node drains, and rolling node replacement.

### Relationship With Karpenter

HPA and Karpenter solve different scaling problems.

| Component | Scales | Purpose |
|---|---|---|
| HPA | Pods | Adds/removes application replicas based on CPU/memory usage. |
| Karpenter | Nodes | Adds/removes EC2 worker nodes when pods need more capacity. |

Example flow:

Traffic increases
        |
        v
HPA increases replicas from 3 to 8
        |
        v
Some new pods cannot fit on existing nodes
        |
        v
Karpenter provisions new EC2 nodes
        |
        v
Pending pods are scheduled

### Apply HPA

Apply the application manifests first, then apply PDB and HPA.

```bash
kubectl apply -f AWS/Kubernetes_manifest/aws_dataplane_k8manifest/
kubectl apply -f AWS/Kubernetes_manifest/PDB/
kubectl apply -f AWS/Kubernetes_manifest/HPA/
```

For the statefulset deployment path:

```bash
kubectl apply -f AWS/Kubernetes_manifest/statefulset_k8manifest/
kubectl apply -f AWS/Kubernetes_manifest/PDB/
kubectl apply -f AWS/Kubernetes_manifest/HPA/
```

### Verify HPA

Check all HPA resources:

```bash
kubectl get hpa -n micro-tier
```

Expected output:

```text
catalog-hpa
carts-hpa
checkout-hpa
orders-hpa
ui-hpa

# Describe a specific HPA:

kubectl describe hpa catalog-hpa -n micro-tier

# Check current pod metrics:

kubectl top pods -n micro-tier

# Check Deployment replicas:

kubectl get deployments -n micro-tier
```

### Understanding HPA Output

Example:

```text
NAME           REFERENCE             TARGETS                        MINPODS   MAXPODS   REPLICAS
carts-hpa      Deployment/carts      cpu: 1%/70%, memory: 41%/80%   3         12        3
```

Meaning:

Current CPU usage is 1%, target is 70%.

Current memory usage is 41%, target is 80%.

Minimum pods is 3.

Maximum pods is 12.

Current replicas is 3.

If you see:

cpu: <unknown>/70%

memory: <unknown>/80%

it usually means HPA cannot get metrics for that Deployment.

Common causes:

Metrics Server is not working.

Pods are Pending.

Pods are in ContainerCreating.

Pods are CrashLoopBackOff.

Pods are not Ready.

The container has no resource requests.


### Verify topologySpreadConstraints with Donotschedule option for Availability Zones

```bash
# Veriy   POD TOPOLOGY DISTRIBUTION REPORT 
./check-topology.sh 
```

*** Sample Output: check-topology.sh ***

```text
Kalyans-Mac-mini:18_Autoscaling_HPA kalyanreddy$ ./check-topology.sh 
╔════════════════════════════════════════════════════════════════════════════╗
║              POD TOPOLOGY DISTRIBUTION REPORT                              ║
╚════════════════════════════════════════════════════════════════════════════╝

📍 NODES AND THEIR ZONES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NODE                                     ZONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ip-10-0-10-16.ec2.internal               us-east-1a
ip-10-0-10-189.ec2.internal              us-east-1a
ip-10-0-10-231.ec2.internal              us-east-1a
ip-10-0-10-232.ec2.internal              us-east-1a
ip-10-0-11-233.ec2.internal              us-east-1b
ip-10-0-11-243.ec2.internal              us-east-1b
ip-10-0-12-102.ec2.internal              us-east-1c
ip-10-0-12-191.ec2.internal              us-east-1c
ip-10-0-12-206.ec2.internal              us-east-1c

🚀 PODS DISTRIBUTION BY APPLICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP          POD                                      NODE                                     ZONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
carts        carts-6d78bdf8f8-dtnjn                   ip-10-0-11-243.ec2.internal              us-east-1b
carts        carts-6d78bdf8f8-lnhpx                   ip-10-0-12-102.ec2.internal              us-east-1c
carts        carts-6d78bdf8f8-r2882                   ip-10-0-10-232.ec2.internal              us-east-1a
catalog      catalog-77675cf55c-6lrlk                 ip-10-0-10-231.ec2.internal              us-east-1a
catalog      catalog-77675cf55c-kvnrw                 ip-10-0-12-102.ec2.internal              us-east-1c
catalog      catalog-77675cf55c-pfr4r                 ip-10-0-11-243.ec2.internal              us-east-1b
checkout     checkout-877577d8f-gwqsb                 ip-10-0-12-191.ec2.internal              us-east-1c
checkout     checkout-877577d8f-qfw6j                 ip-10-0-11-243.ec2.internal              us-east-1b
checkout     checkout-877577d8f-wknkm                 ip-10-0-10-232.ec2.internal              us-east-1a
orders       orders-655774cbfd-mkr9g                  ip-10-0-11-243.ec2.internal              us-east-1b
orders       orders-655774cbfd-sg4qx                  ip-10-0-10-16.ec2.internal               us-east-1a
orders       orders-655774cbfd-zhddz                  ip-10-0-12-191.ec2.internal              us-east-1c
ui           ui-6ddcbdc6fd-mccns                      ip-10-0-11-243.ec2.internal              us-east-1b
ui           ui-6ddcbdc6fd-nfnxk                      ip-10-0-12-191.ec2.internal              us-east-1c
ui           ui-6ddcbdc6fd-tgqw9                      ip-10-0-10-16.ec2.internal               us-east-1a

📊 ZONE DISTRIBUTION SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 carts:
us-east-1a:     1  pods -
us-east-1b:     1  pods -
us-east-1c:     1  pods -

📦 catalog:
us-east-1a:     1  pods -
us-east-1b:     1  pods -
us-east-1c:     1  pods -

📦 checkout:
us-east-1a:     1  pods -
us-east-1b:     1  pods -
us-east-1c:     1  pods -

📦 orders:
us-east-1a:     1  pods -
us-east-1b:     1  pods -
us-east-1c:     1  pods -

📦 ui:
us-east-1a:     1  pods -
us-east-1b:     1  pods -
us-east-1c:     1  pods -

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Topology spread analysis complete!

💡 INTERPRETATION GUIDE:
- = Pods present in this zone (good for HA)
⚠️  = No pods in this zone (may want to investigate)

Kalyans-Mac-mini:18_Autoscaling_HPA kalyanreddy$ 

```

### Troubleshooting

Check Metrics Server:

```bash
kubectl get pods -n kube-system | grep metrics
kubectl top nodes
kubectl top pods -n micro-tier

# Check HPA details:

kubectl describe hpa <hpa-name> -n micro-tier

# Check target Deployment:

kubectl get deployment <deployment-name> -n micro-tier
kubectl describe deployment <deployment-name> -n micro-tier

# Check pods:

kubectl get pods -n micro-tier
kubectl describe pod <pod-name> -n micro-tier

# Check events:

kubectl get events -n micro-tier --sort-by=.lastTimestamp
```

### Production Recommendations

| Area | Recommendation |
|---|---|
| Minimum replicas | Keep minReplicas at 3 for critical services. |
| Maximum replicas | Set maxReplicas based on cost and load testing. |
| CPU target | Start with 70% and tune after observing real traffic. |
| Memory target | Use memory scaling carefully for JVM services because memory may not drop quickly. |
| Resource requests | Always define CPU and memory requests. |
| PDB | Use PDBs with HPA so voluntary disruptions do not remove too many pods. |
| Karpenter | Use Karpenter so new pods can trigger node provisioning when the cluster is full. |
| Monitoring | Watch HPA events, pod metrics, and Deployment replica counts. |
| Load testing | Validate HPA behavior before relying on it in production. |



## 19. Install & Configure ArgoCD

<img width="1678" height="852" alt="Image" src="https://github.com/user-attachments/assets/43641203-b7b0-4965-92a2-fd4e0f3e069b" />

ArgoCD is used for GitOps-based deployment into the EKS cluster. Instead of manually applying every Kubernetes manifest with `kubectl apply`, ArgoCD watches this GitHub repository and keeps the cluster synchronized with the desired state stored in Git.

For this project, ArgoCD currently deploys the ecommerce microservices from the AWS dataplane Kubernetes manifest directory:

```text
AWS/Kubernetes_manifest/aws_dataplane_k8manifest
```

The application workloads are deployed into the Kubernetes namespace:

```text
micro-tier
```

The ArgoCD `Application` objects live in the ArgoCD namespace:

```text
argocd
```

This means ArgoCD itself runs in `argocd`, while the ecommerce microservices run in `micro-tier`.

### Why ArgoCD Is Used

ArgoCD gives the platform a production-style deployment model:

- Git is the source of truth for Kubernetes deployment state.

- Application changes are reviewed through pull requests before reaching `main`.

- ArgoCD detects changes after they are merged.

- ArgoCD applies the desired state to the EKS cluster.

- Drift can be detected and corrected automatically.

- Deleted resources can be pruned when they are removed from Git.

This makes deployments repeatable, auditable, and easier to roll back.

### GitOps Deployment Flow

```text
Developer updates application code or Kubernetes manifests
      |
      v
Feature branch is pushed to GitHub
      |
      v
Pull request is opened into main
      |
      v
GitHub Actions CI validates the microservices
      |
      v
Pull request is merged into main
      |
      v
CI runs again on main
      |
      v
Docker images are built and pushed to Amazon ECR
      |
      v
Kubernetes manifests reference the desired image version
      |
      v
ArgoCD detects the Git change
      |
      v
ArgoCD syncs the manifests into Amazon EKS
```

ArgoCD does not replace CI. CI validates, builds, and publishes the application images. ArgoCD deploys the desired Kubernetes state into the cluster.

### Install ArgoCD

Create the ArgoCD namespace:

```bash
kubectl create namespace argocd
```

Install ArgoCD:

```bash
kubectl apply -n argocd \
-f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Verify the ArgoCD pods:

```bash
kubectl get pods -n argocd
```

Expected result:

```text
argocd-application-controller    Running
argocd-applicationset-controller Running
argocd-dex-server                Running
argocd-notifications-controller  Running
argocd-redis                     Running
argocd-repo-server               Running
argocd-server                    Running
```

### Access the ArgoCD UI

Port-forward the ArgoCD server:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open the UI:

```text
https://localhost:8080
```

Get the initial admin password:

```bash
kubectl get secret argocd-initial-admin-secret \
-n argocd \
-o jsonpath="{.data.password}" | base64 -d
```

Login with:

```text
Username: admin
Password: <initial-admin-password>
```

This allows ArgoCD to create the namespace if it does not already exist, but creating it manually first makes the deployment flow explicit.

### ArgoCD Application Files

The ArgoCD application manifests are stored in:

```text
AWS/ArgoCd/
```

Current application files:

```text
AWS/ArgoCd/application-catalog.yaml
AWS/ArgoCd/application-cart.yaml
AWS/ArgoCd/application-checkout.yaml
AWS/ArgoCd/application-orders.yaml
AWS/ArgoCd/application-ui.yaml
```

Each file tells ArgoCD:

- Which GitHub repository to watch.

- Which branch to track.

- Which Kubernetes manifest folder to deploy.

- Which namespace to deploy into.

- Whether automated sync, pruning, and self-healing are enabled.

### Application Source Paths

| Microservice | ArgoCD Application File | Manifest Path |
|---|---|---|
| catalog | `AWS/ArgoCd/application-catalog.yaml` | `AWS/Kubernetes_manifest/aws_dataplane_k8manifest/01_catalog` |
| cart | `AWS/ArgoCd/application-cart.yaml` | `AWS/Kubernetes_manifest/aws_dataplane_k8manifest/02_cart` |
| checkout | `AWS/ArgoCd/application-checkout.yaml` | `AWS/Kubernetes_manifest/aws_dataplane_k8manifest/03_checkout` |
| orders | `AWS/ArgoCd/application-orders.yaml` | `AWS/Kubernetes_manifest/aws_dataplane_k8manifest/04_orders` |
| ui | `AWS/ArgoCd/application-ui.yaml` | `AWS/Kubernetes_manifest/aws_dataplane_k8manifest/05_ui` |

### Example UI Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
name: ui
namespace: argocd
spec:
project: default

source:
  repoURL: https://github.com/Ahmedlekan/ecommerce_store.git
  targetRevision: main
  path: AWS/Kubernetes_manifest/aws_dataplane_k8manifest/05_ui

destination:
  server: https://kubernetes.default.svc
  namespace: micro-tier

syncPolicy:
  automated:
    prune: true
    selfHeal: true
  syncOptions:
    - CreateNamespace=true
```

### Deploy the Applications

Apply all ArgoCD Application manifests:

```bash
kubectl apply -f AWS/ArgoCd/
```

Verify that ArgoCD created the applications:

```bash
kubectl get applications -n argocd
```

Verify the microservice workloads:

```bash
kubectl get pods -n micro-tier
kubectl get svc -n micro-tier
```

### Sync Policy

Each application uses automated sync:

```yaml
syncPolicy:
automated:
  prune: true
  selfHeal: true
```

`selfHeal: true` means ArgoCD will correct drift if a live Kubernetes resource is manually changed outside Git.

`prune: true` means ArgoCD will delete Kubernetes resources from the cluster when those resources are removed from Git.

This keeps the EKS cluster aligned with the Git repository.

### Current Deployment Mode

This project currently uses raw Kubernetes manifests with ArgoCD.

Current source:

```text
AWS/Kubernetes_manifest/aws_dataplane_k8manifest
```

The Helm charts still exist in the repository, but they are not the active deployment source for ArgoCD at this stage.

### Rollback Strategy

Because ArgoCD follows Git, rollback is done by reverting the Git change that introduced the bad deployment.

Typical rollback flow:

```bash
git revert <bad-commit-sha>
git push origin main
```

After the revert reaches `main`, ArgoCD detects the change and syncs the previous desired state back into the cluster.

For image-related rollback, update the Kubernetes manifest to reference a known-good image tag, merge the change into `main`, and let ArgoCD sync the cluster.

### Promotion Flow

The current project uses `main` as the deployment branch.

A future production setup can promote changes across environments like this:

```text
feature branch
  |
  v
dev
  |
  v
staging
  |
  v
prod
```

Each environment can have its own branch, manifest directory, or Helm values file. For now, the active GitOps source is the `main` branch and the AWS dataplane manifest directory.

## 20. CI - Github Action to AWS ECR

<img width="1296" height="707" alt="Image" src="https://github.com/user-attachments/assets/a9a3abf9-f864-43b3-96f1-a1cdfa80a331" />

### Create ECR Repository

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

### Create GitHub OIDC IAM Role

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

### Generate Trust Policy

```bash
# Generate AWS/trust-policy.json with automatic variable substitution
cat > AWS/trust-policy.json <<EOF
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
cat AWS/trust-policy.json
```

***What this does***: Allows GitHub Actions from your repository to assume this IAM role using OIDC tokens (no AWS keys needed!)

### Create IAM Role

```bash
# Verify the trust policy before creating role
cat AWS/trust-policy.json | jq '.'

# Create the IAM role
aws iam create-role \
--role-name $ROLE_NAME \
--assume-role-policy-document file://AWS/trust-policy.json

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

### Attach ECR Permissions

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

### Create the OIDC Provider in Your AWS Account

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


### Configure GitHub Actions CI Workflow

<img width="1833" height="811" alt="Image" src="https://github.com/user-attachments/assets/35b5aea8-5447-42c9-9285-bb176b2102d8" />


At this stage, we are only creating **Continuous Integration (CI)**.

CI is responsible for proving that the application code is healthy before it is merged or released. It does **not** deploy the application, push Docker images, or connect to AWS.

The CI workflow file is located at:

```text
.github/workflows/ci.yml
```

### What This CI Workflow Does

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

```text
catalog   -> build/test
cart      -> build/test/lint
checkout  -> build/test/lint
orders    -> build/test/lint
ui        -> build/test/lint
```

### Why Each Service Has Its Own CI Job

Using separate jobs gives us:

- Faster feedback because jobs run in parallel.
- Clear failure reporting per microservice.
- Better production readiness because every service has its own quality gate.
- Easier troubleshooting because a failed job points directly to the affected service.

### When The Workflow Runs

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

### CI Workflow Process

The process looks like this:

```text
Developer creates a branch
Developer pushes code to GitHub
Developer opens a pull request
GitHub Actions starts the CI workflow
Each microservice runs its own CI job
The pull request should only be merged after CI passes
```

### Service CI Breakdown

*** catalog ***

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

*** cart ***

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

*** checkout ***

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

*** orders ***

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

*** ui ***

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

### How To Test The CI Workflow

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

```text
Compare & pull request
```

After creating the pull request, go to the **Actions** tab or the pull request checks section.

You should see these jobs:

```text
catalog - build and test
cart - build, test, and lint
checkout - build, test, and lint
orders - build, test, and lint
ui - build, test, and lint
```

If all five jobs pass, the CI workflow is working correctly.

### Recommended Branch Protection

After the CI workflow is stable, configure branch protection for `main`.

In GitHub:

```text
Settings -> Branches -> Branch protection rules
```

Recommended settings:

- Require a pull request before merging.

- Require status checks to pass before merging.

- Select the five CI jobs as required checks.

- Do not allow direct pushes to `main`.

This makes CI a real quality gate instead of only a notification.

### Important Production Note

This workflow is only CI.

It does not:

- Build Docker images.

- Push images to AWS ECR.

- Deploy to Kubernetes.

- Deploy to production.

Those actions belong in a separate CD workflow. The next step is to create a separate workflow that builds Docker images for each microservice and pushes them to AWS ECR after CI passes.



## 21. Build And Push Docker Images To AWS ECR

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

```text
.github/workflows/build-and-push-ecr.yml
```

### Why This Is Separate From CI

CI answers this question:

```text
Is the code good enough to merge?
```

The ECR image workflow answers this question:

```text
Can this tested code be packaged into Docker images and stored in ECR?
```

Deployment answers a different question, which we will handle later:

```text
Should this image version be released to an environment?
```

Keeping these stages separate makes the pipeline easier to control and safer for production.

### When The ECR Workflow Runs

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

```text
Pull request passes CI
Pull request is merged to main
CI runs again on main
CI succeeds
Build and Push Images to ECR workflow starts
Docker images are built and pushed to ECR
```

### AWS Authentication

The workflow uses GitHub OIDC instead of long-lived AWS access keys.

The role used by the workflow is:

```text
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

### ECR Repositories

This workflow expects these ECR repositories to already exist:

```text
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

### Image Tagging Strategy

Each image is tagged with the first seven characters of the Git commit SHA.

Example:

```text
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/catalog:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/cart:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/checkout:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/orders:a1b2c3d
123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce-store/ui:a1b2c3d
```

This is better than only using `latest` because it gives traceability. Later, when we deploy, we can choose the exact tested image tag to release.

### Microservice Build Matrix

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

### Services Published To ECR

| Microservice | Dockerfile | ECR Repository |
|-------------|------------|----------------|
| catalog | `Application Code/src/catalog/Dockerfile` | `ecommerce-store/catalog` |
| cart | `Application Code/src/cart/Dockerfile` | `ecommerce-store/cart` |
| checkout | `Application Code/src/checkout/Dockerfile` | `ecommerce-store/checkout` |
| orders | `Application Code/src/orders/Dockerfile` | `ecommerce-store/orders` |
| ui | `Application Code/src/ui/Dockerfile` | `ecommerce-store/ui` |

### How To Test The ECR Workflow

After committing and pushing the workflow, open GitHub, test it from the main branch if the workflow file is already merged there:

```text
Actions -> Build and Push Images to ECR -> Run workflow
```

Select the branch and run it manually.

Expected result:

```text
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

```text
ecommerce-store/cart
ecommerce-store/checkout
ecommerce-store/orders
ecommerce-store/ui
```

### Next Step After ECR Push

After this workflow is confirmed working, the next step is deployment planning.

At that point, we will decide whether to deploy with:

- Raw Kubernetes manifests.
- Helm charts.
- ArgoCD GitOps.

The production deployment workflow should use the exact image tags created by this ECR workflow.


## 22. Continuous Delivery / Deployment

  - How image tags are promoted
 
  - How manifests or Helm values are updated
 
  - Deployment approval process
 
  - Environment promotion
 
  - Production release process



## 23. Observability

The observability stack provides visibility into infrastructure health, application behavior, service latency, errors, and distributed request flow.

This project uses:

```text
Prometheus

Grafana

CloudWatch

AWS X-Ray

OpenTelemetry

Dashboards

Alerts

Log aggregation
```

### Prometheus

<img width="1879" height="714" alt="Image" src="https://github.com/user-attachments/assets/7a03afa4-cf1c-42fa-8966-a71a2bcee02e" />


Prometheus-compatible metrics are exposed by each service and scraped from Kubernetes pods.

Prometheus is used to collect:

```text
Application metrics

Business metrics

Pod metrics

Node metrics

JVM metrics

Database/client metrics
```

Example PromQL queries:

Request rate:

```promql
sum(rate(checkout_requests_total[5m]))
```

Checkout error rate:

```promql
sum(rate(checkout_errors_total[5m]))
/
sum(rate(checkout_requests_total[5m]))
```

Checkout p95 latency:

```promql
histogram_quantile(
0.95,
sum(rate(checkout_submit_duration_seconds_bucket[5m])) by (le)
)
```

Orders created:

```promql
increase(orders_created_total[1h])
```

Cart items added:

```promql
sum(rate(cart_items_added_total[5m]))
```

Catalog request rate:

```promql
sum(rate(catalog_requests_total[5m])) by (operation)
```

### Grafana

Grafana is used to visualize service health and business behavior.

Dashboards should be organized around two views.

Infrastructure dashboard:

<img width="1910" height="868" alt="Image" src="https://github.com/user-attachments/assets/045cfc89-6d8c-47da-96ee-34a80dae7d5b" />

<img width="1919" height="881" alt="Image" src="https://github.com/user-attachments/assets/c93d2499-5915-47a6-ab26-828fb784f4d1" />

<img width="1919" height="822" alt="Image" src="https://github.com/user-attachments/assets/9a100e21-ddea-4372-92a4-783e6ab397a4" />

```text
Node CPU and memory

Pod CPU and memory

Pod restarts

Network traffic

HPA scaling

Cluster health
```

Application dashboard:

```text
Request rate by service

Error rate by service

p95/p99 latency

Checkout success rate

Orders created

Cart items added/removed

Catalog searches

Database connection pool usage

JVM heap and GC
```

The application dashboard should focus on SRE questions:


```text
Is traffic increasing?

Are errors increasing?

Which service is slow?

Is checkout succeeding?

Are orders being created?

Is the database saturated?
```

### CloudWatch

CloudWatch is used for log storage and operational troubleshooting.

Kubernetes and application logs are shipped to CloudWatch so service failures can be investigated after an alert or trace anomaly.

CloudWatch helps answer:

```text
Which pod logged the error?

What exception occurred?

Did the app fail during startup?

Did configuration or dependency access fail?
```

### AWS X-Ray

<img width="1277" height="619" alt="Image" src="https://github.com/user-attachments/assets/d4e093e1-1185-4eaf-966b-dcf847dd3117" />

<img width="1833" height="285" alt="Image" src="https://github.com/user-attachments/assets/c0f7d0b3-eea7-4e9e-b933-b874fb13c908" />

<img width="1831" height="433" alt="Image" src="https://github.com/user-attachments/assets/910e587a-1d0a-4b54-9082-fc408d9817a8" />

<img width="1833" height="464" alt="Image" src="https://github.com/user-attachments/assets/5e34b543-4c9a-4183-9db1-e3cfec71004b" />


AWS X-Ray is used for distributed trace analysis.

X-Ray helps identify latency and failure points across service calls.

Example debugging flow:

```text
Customer reports slow checkout

-> check Grafana p95 latency

-> open related X-Ray trace

-> inspect UI, Checkout, Orders, and database spans

-> identify slow service or dependency
```

X-Ray is especially useful for comparing:

```text

Application span duration

Database span duration

Downstream HTTP span duration

Error spans
```

### OpenTelemetry

<img width="1450" height="836" alt="Image" src="https://github.com/user-attachments/assets/58c5969b-6c97-4fd6-9553-80c936f93041" />

For the checkout service

OpenTelemetry provides the instrumentation and collection path for traces.

The ADOT collector receives telemetry from instrumented services and exports it to AWS observability backends such as X-Ray and CloudWatch.

The project uses OpenTelemetry to support:

```text
Distributed tracing

Service dependency visibility

Span-level latency analysis

Error correlation
```

### Dashboards

Recommended dashboard structure:

```text
Cluster Overview

Service RED Metrics

Checkout Journey

Orders and Database

Cart Activity

Catalog Activity

JVM and Runtime
```

RED metrics dashboard:

```text
Rate: requests per second

Errors: failed requests and 5xxs

Duration: p95 and p99 latency
```

Business dashboard:

```text
Checkout attempts

Checkout successes

Checkout failures

Orders created

Cart items added

Cart items removed

Catalog searches
```

### Alerts

Alerts should focus on symptoms first, then causes.

Recommended first alerts:

```text
Checkout error rate > 5%

Checkout p95 latency > 3s

Orders error rate > 5%

Orders p95 latency > 3s

No orders created for an unusual period

Pod restart spike

High CPU or memory usage

Database connection pool saturation
```

Example alert intent:

```text
Alert when customers are affected, not only when infrastructure is noisy.
```

### Log Aggregation

Logs are aggregated centrally so they can be searched during incidents.

The recommended troubleshooting flow is:

```text
Grafana alert

-> X-Ray trace

-> CloudWatch logs

-> Kubernetes pod status/events
```

This gives a complete view:

```text
Metrics show what changed.

Traces show where it happened.

Logs explain why it happened.
```


