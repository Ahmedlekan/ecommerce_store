# Prometheus Evidence Lambda

This Lambda is a read-only Bedrock Agent action-group tool for collecting
bounded infrastructure metric evidence from Amazon Managed Service for
Prometheus (AMP).

The function does not perform AI reasoning or remediation. It validates a fixed
metric key, queries AMP with repository-approved PromQL, summarizes each
returned series, and returns structured JSON evidence for the Bedrock Agent to
interpret.

## Environment Variables

- `AMP_QUERY_ENDPOINT`: AMP `/api/v1/query_range` endpoint.
- `AWS_REGION`: AWS region for SigV4 signing. The repository uses `us-east-1`.
- `DEFAULT_NAMESPACE`: defaults to `micro-tier`.
- `DEFAULT_HOURS_BACK`: defaults to `1`.
- `MAX_HOURS_BACK`: defaults to `24`.
- `DEFAULT_MAX_SERIES`: defaults to `20`.
- `MAX_SERIES`: defaults to `50`.
- `QUERY_STEP_SECONDS`: defaults to `60`.
- `AMP_REQUEST_TIMEOUT_SECONDS`: defaults to `5`.

## Supported Metrics

```text
pod_cpu_utilization
pod_memory_utilization
pod_restarts
deployment_replicas_available
deployment_replicas_unavailable
```

Version 1 intentionally does not accept arbitrary PromQL or service filters.
