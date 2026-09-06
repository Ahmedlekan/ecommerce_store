# Application RED Grafana Dashboard

This folder stores Grafana dashboard definitions for application-level monitoring.
The first dashboard is focused on the checkout flow because its Prometheus metric
names are explicitly defined in the repository.

## Files

`application-red-dashboard.json` is a Grafana dashboard JSON file for checkout
RED metrics: request rate, error rate, success rate, and latency percentiles.

`README.md` explains what the dashboard uses, how to import it, and what should
be validated before expanding it.

## Metric Sources

The checkout metric names come from:

```text
Application Code/src/checkout/src/checkout/metrics/CheckoutMetricsService.ts
```

Confirmed checkout metrics:

```text
checkout_requests_total
checkout_success_total
checkout_errors_total
checkout_submit_duration_seconds_bucket
```

The application pods are scraped by the ADOT Prometheus receiver configured in:

```text
AWS/Observability/OpenTelemetry_AMP_AMG/01_adot_collector_prometheus_full_k8s_cluster.yaml
```

That collector remote-writes metrics to Amazon Managed Service for Prometheus.
Amazon Managed Grafana can then query AMP through its Prometheus data source.

## Included Panels

The dashboard currently includes:

```text
Checkout Request Rate
Checkout Error Rate
Checkout Error Ratio
Checkout Success Ratio
Checkout Success Rate
Checkout Submit Latency: p50, p95, p99
Checkout P95 Latency By Status
```

## Import Steps

In Amazon Managed Grafana:

1. Open Dashboards.
2. Select New.
3. Select Import.
4. Upload `application-red-dashboard.json`.
5. Select the Prometheus data source that points to AMP.
6. Import the dashboard.

## Validation Queries

Before expanding this dashboard to other services, validate that AMP has the
expected label names. Start with these queries in Grafana Explore:

```promql
checkout_requests_total
```

```promql
checkout_submit_duration_seconds_bucket
```

```promql
sum(rate(checkout_requests_total{kubernetes_namespace="micro-tier"}[$__rate_interval]))
```

If the namespace label is different in AMP, update the dashboard queries before
using it as the standard application dashboard.

## Next Additions

After the actual AMP labels are verified, extend the dashboard with:

```text
orders.requests_total-style metrics exported by Micrometer
orders.create.duration histogram metrics exported by Micrometer
ui.requests and ui.request.duration metrics exported by Micrometer
cart.requests and cart.duration metrics exported by Micrometer
catalog_requests_total and catalog_duration_seconds metrics
```

Do not assume Java/Micrometer metric names are identical to the source names.
Micrometer's Prometheus registry commonly exports dotted names with underscores
and suffixes such as `_total`, `_seconds_bucket`, `_seconds_count`, and
`_seconds_sum`.
