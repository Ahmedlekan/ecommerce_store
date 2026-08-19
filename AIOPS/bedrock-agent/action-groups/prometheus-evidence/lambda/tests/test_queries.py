"""Tests for fixed PromQL query construction and allowlist enforcement."""

import unittest

from prometheus_evidence.queries import QUERY_ALLOWLIST, build_query


class QueryTests(unittest.TestCase):
    """Validate that only approved infrastructure metric keys build PromQL."""

    def test_allowlist_contains_only_initial_infrastructure_metrics(self):
        self.assertEqual(
            set(QUERY_ALLOWLIST),
            {
                "pod_cpu_utilization",
                "pod_memory_utilization",
                "pod_restarts",
                "deployment_replicas_available",
                "deployment_replicas_unavailable",
            },
        )

    def test_builds_cpu_query_for_micro_tier(self):
        query, definition = build_query("pod_cpu_utilization", "micro-tier", 1)

        self.assertIn('container_cpu_usage_seconds_total{namespace="micro-tier"', query)
        self.assertIn("[5m]", query)
        self.assertEqual(definition.unit, "cores")
        self.assertEqual(definition.resource_label, "pod")

    def test_rejects_arbitrary_promql(self):
        with self.assertRaisesRegex(ValueError, "INVALID_METRIC_NAME"):
            build_query("sum(rate(any_metric[5m]))", "micro-tier", 1)

    def test_rejects_unapproved_namespace(self):
        with self.assertRaisesRegex(ValueError, "INVALID_NAMESPACE"):
            build_query("pod_restarts", "default", 1)


if __name__ == "__main__":
    unittest.main()
