"""Fixed PromQL allowlist for AMP infrastructure evidence queries.

The Lambda never accepts raw PromQL from callers. Each public metric key maps to
one repository-approved query template derived from the existing ADOT, kube-state
metrics, and container metrics collection path.
"""

from dataclasses import dataclass


ALLOWED_NAMESPACES = {"micro-tier"}


@dataclass(frozen=True)
class QueryDefinition:
    """Describes one allowed metric query and how to summarize its values."""

    promql_template: str
    unit: str
    resource_label: str


QUERY_ALLOWLIST: dict[str, QueryDefinition] = {
    "pod_cpu_utilization": QueryDefinition(
        promql_template=(
            'sum by (pod) (rate(container_cpu_usage_seconds_total'
            '{{namespace="{namespace}", pod!="", container!="POD", container!=""}}'
            "[{rate_window}]))"
        ),
        unit="cores",
        resource_label="pod",
    ),
    "pod_memory_utilization": QueryDefinition(
        promql_template=(
            'sum by (pod) (container_memory_working_set_bytes'
            '{{namespace="{namespace}", pod!="", container!="POD", container!=""}})'
        ),
        unit="bytes",
        resource_label="pod",
    ),
    "pod_restarts": QueryDefinition(
        promql_template=(
            'sum by (pod) (increase(kube_pod_container_status_restarts_total'
            '{{namespace="{namespace}"}}[{range_window}]))'
        ),
        unit="restarts",
        resource_label="pod",
    ),
    "deployment_replicas_available": QueryDefinition(
        promql_template=(
            'kube_deployment_status_replicas_available{{namespace="{namespace}"}}'
        ),
        unit="replicas",
        resource_label="deployment",
    ),
    "deployment_replicas_unavailable": QueryDefinition(
        promql_template=(
            'kube_deployment_status_replicas_unavailable{{namespace="{namespace}"}}'
        ),
        unit="replicas",
        resource_label="deployment",
    ),
}


def build_query(metric_name: str, namespace: str, hours_back: int) -> tuple[str, QueryDefinition]:
    """Build PromQL from a fixed key after validating namespace scope."""

    if metric_name not in QUERY_ALLOWLIST:
        raise ValueError("INVALID_METRIC_NAME")

    if namespace not in ALLOWED_NAMESPACES:
        raise ValueError("INVALID_NAMESPACE")

    definition = QUERY_ALLOWLIST[metric_name]
    range_window = f"{hours_back}h"
    rate_window = "5m"

    query = definition.promql_template.format(
        namespace=namespace,
        range_window=range_window,
        rate_window=rate_window,
    )

    return query, definition
