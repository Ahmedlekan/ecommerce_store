# Production-Ready DevSecOps Platform for a Microservices E-Commerce Application

<img width="1536" height="1024" alt="AWS Architecture Diagram" src="https://github.com/user-attachments/assets/fb237fac-583a-4329-9e2e-0ac4d3b6d5f5" />

This repository contains a production-style DevSecOps implementation for a
microservices-based e-commerce application.

The application source code is shared so the same microservices can be deployed
to multiple cloud platforms. The AWS implementation is already available, and
the Microsoft Azure implementation is currently being prepared using the same
application codebase.

## Cloud Implementations

### AWS Implementation

The AWS project files are located in:

```text
AWS/
```

The AWS folder contains the full step-by-step project implementation for the
AWS platform, including infrastructure provisioning, Kubernetes deployment,
CI/CD, GitOps delivery, observability, autoscaling, and AIOps-related work.

The application was deployed on Amazon EKS using two deployment approaches.

#### 1. StatefulSet-Based Deployment

In this deployment mode, the application and its supporting stateful services
run inside Kubernetes.

Examples of in-cluster dependencies include:

```text
MySQL
Redis
PostgreSQL
RabbitMQ
DynamoDB-style local service components where applicable
```

This approach is useful for learning Kubernetes-native stateful workloads and
understanding how application dependencies can run inside the cluster.

#### 2. AWS Dataplane Deployment

In this deployment mode, the application workloads run on Amazon EKS, but the
backend services are provided by AWS-managed services.

The AWS dataplane includes:

```text
Amazon RDS
Amazon DynamoDB
Amazon ElastiCache Redis
Amazon SQS
AWS Secrets Manager
IAM / EKS Pod Identity
```

This approach is closer to a production cloud-native architecture because the
application uses managed AWS services for persistence, caching, messaging,
secrets management, and workload identity instead of running every dependency
inside Kubernetes.

### Microsoft Azure Implementation

The Azure project files are located in:

```text
AZURE/
```

The Azure implementation is still in progress. It will reuse the same shared
application source code from:

```text
Application Code/
```

The planned Azure implementation will include Azure-native infrastructure and
services such as:

```text
Azure Kubernetes Service
Azure Container Registry
Azure Virtual Network
Azure Monitor
Azure Managed Grafana
```

## Shared Application Code

The application source code remains at the repository root:

```text
Application Code/
```

This avoids duplicating the microservices for each cloud provider.

Cloud-specific infrastructure, Kubernetes manifests, observability
configuration, and deployment workflows are separated into provider-specific
folders:

```text
AWS/
AZURE/
```

This structure keeps the repository organized while allowing the project to
support both AWS and Azure deployments.
