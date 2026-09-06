# Prometheus Evidence Contract

This contract defines the read-only evidence interface between the Bedrock Agent
action group and Amazon Managed Service for Prometheus (AMP).

The Lambda is an evidence collector only. It does not diagnose incidents, choose
root causes, recommend remediation, or make production changes. The Bedrock
Agent is responsible for interpreting the evidence returned by this contract.

## Repository Evidence

The first implementation is based on existing repository configuration:

- AMP workspace is created in `AWS/Observability/OpenTelemetry_terraform/c7_amp_prometheus_workspace.tf`.
- AWS region is `us-east-1` in `AWS/Observability/OpenTelemetry_terraform/terraform.tfvars`.
- ADOT remote-writes Prometheus metrics to AMP in
  `AWS/Observability/OpenTelemetry_AMP_AMG/01_adot_collector_prometheus_full_k8s_cluster.yaml`.
- ADOT runs in Kubernetes namespace `micro-tier`.
- Kube State Metrics and Prometheus Node Exporter are installed as EKS add-ons in
  `AWS/Observability/OpenTelemetry_terraform/c6_07_eks_addon_kube_state_metrics.tf`
  and `AWS/Observability/OpenTelemetry_terraform/c6_06_eks_addon_prometheus_node_exporter.tf`.

## Allowed Metric Keys

Version 1 allows only infrastructure evidence queries:

```text
pod_cpu_utilization
pod_memory_utilization
pod_restarts
deployment_replicas_available
deployment_replicas_unavailable
```

No arbitrary PromQL is accepted from callers.

## Request

```json
{
  "metric_name": "pod_cpu_utilization",
  "namespace": "micro-tier",
  "hours_back": 1,
  "max_series": 20
}
```

Fields:

- `metric_name`: required; must be one of the allowed metric keys.
- `namespace`: optional; defaults to `micro-tier`; version 1 only allows `micro-tier`.
- `hours_back`: optional; defaults to `1`; must be from `1` to `24`.
- `max_series`: optional; defaults to `20`; must be from `1` to `50`.

Version 1 intentionally does not support a `service` filter because actual AMP
label sets should be verified in the target workspace before service-specific
filtering is added.

## Successful Response

```json
{
  "status": "ok",
  "source": "amp",
  "metric": "pod_cpu_utilization",
  "namespace": "micro-tier",
  "window": "1h",
  "observed_at": "2026-08-11T12:00:00Z",
  "data": [
    {
      "resource": "checkout-abc123",
      "current": 0.42,
      "average": 0.37,
      "maximum": 0.81,
      "unit": "cores",
      "observed_at": "2026-08-11T11:59:30Z"
    }
  ],
  "metadata": {
    "series_count": 1,
    "truncated": false,
    "query_mode": "range"
  }
}
```

## Error Response

```json
{
  "status": "error",
  "source": "amp",
  "metric": "pod_cpu_utilization",
  "namespace": "micro-tier",
  "observed_at": "2026-08-11T12:00:00Z",
  "error": {
    "code": "INVALID_METRIC_NAME",
    "message": "metric_name must be one of the allowed query keys"
  }
}
```

## Security Boundaries

- Read-only AMP access.
- No arbitrary PromQL.
- No arbitrary AWS API execution.
- No shell execution.
- No Kubernetes API calls or Kubernetes modifications.
- No remediation.
- Bounded time window and bounded result count.
- No AWS credentials or signed request details in responses.
