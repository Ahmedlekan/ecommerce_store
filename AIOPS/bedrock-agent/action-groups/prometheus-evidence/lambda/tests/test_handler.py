"""Tests for Lambda request validation, summarization, and response formatting."""

import json
import os
import unittest
from unittest.mock import patch

os.environ.setdefault(
    "AMP_QUERY_ENDPOINT",
    "https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-test/api/v1/query_range",
)

from prometheus_evidence.handler import lambda_handler


def _response_body(response):
    """Extract the JSON body from a Bedrock Agent action-group response."""

    body = response["response"]["responseBody"]["application/json"]["body"]
    return json.loads(body)


class HandlerTests(unittest.TestCase):
    """Validate evidence-only behavior for the Lambda handler."""

    def test_returns_summarized_metric_evidence(self):
        amp_payload = {
            "status": "success",
            "data": {
                "result": [
                    {
                        "metric": {"pod": "checkout-abc123"},
                        "values": [
                            [1800000000, "0.10"],
                            [1800000060, "0.30"],
                            [1800000120, "0.20"],
                        ],
                    }
                ]
            },
        }

        with patch(
            "prometheus_evidence.handler.query_amp_range",
            return_value=amp_payload,
        ) as query_mock:
            response = lambda_handler(
                {
                    "messageVersion": "1.0",
                    "actionGroup": "prometheus-evidence",
                    "apiPath": "/metrics/evidence",
                    "httpMethod": "POST",
                    "requestBody": {
                        "content": {
                            "application/json": {
                                "body": json.dumps(
                                    {
                                        "metric_name": "pod_cpu_utilization",
                                        "namespace": "micro-tier",
                                        "hours_back": 1,
                                    }
                                )
                            }
                        }
                    },
                },
                None,
            )

        body = _response_body(response)

        self.assertEqual(response["response"]["httpMethod"], "POST")
        self.assertEqual(body["status"], "ok")
        self.assertEqual(body["source"], "amp")
        self.assertEqual(body["metric"], "pod_cpu_utilization")
        self.assertEqual(body["observed_at"].endswith("Z"), True)
        self.assertEqual(body["data"][0]["resource"], "checkout-abc123")
        self.assertEqual(body["data"][0]["current"], 0.2)
        self.assertEqual(body["data"][0]["average"], 0.2)
        self.assertEqual(body["data"][0]["maximum"], 0.3)
        self.assertEqual(body["data"][0]["observed_at"], "2027-01-15T08:02:00Z")
        query_mock.assert_called_once()

    def test_rejects_service_filter_in_version_one(self):
        with patch("prometheus_evidence.handler.query_amp_range") as query_mock:
            response = lambda_handler(
                {
                    "metric_name": "pod_restarts",
                    "namespace": "micro-tier",
                    "service": "checkout",
                    "hours_back": 1,
                },
                None,
            )

        body = _response_body(response)

        self.assertEqual(body["status"], "error")
        self.assertEqual(body["error"]["code"], "UNSUPPORTED_PARAMETER")
        query_mock.assert_not_called()

    def test_rejects_hours_back_outside_bounds(self):
        response = lambda_handler(
            {
                "metric_name": "pod_restarts",
                "namespace": "micro-tier",
                "hours_back": 72,
            },
            None,
        )

        body = _response_body(response)

        self.assertEqual(body["status"], "error")
        self.assertEqual(body["error"]["code"], "PARAMETER_OUT_OF_RANGE")


if __name__ == "__main__":
    unittest.main()
