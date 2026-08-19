"""Helpers for Bedrock Agent action-group response envelopes."""

from __future__ import annotations

import json
from typing import Any


def action_group_response(event: dict[str, Any], body: dict[str, Any], status_code: int = 200) -> dict[str, Any]:
    """Wrap evidence JSON in the Bedrock Agent action-group response format."""

    return {
        "messageVersion": event.get("messageVersion", "1.0"),
        "response": {
            "actionGroup": event.get("actionGroup", "prometheus-evidence"),
            "apiPath": event.get("apiPath", "/metrics/evidence"),
            "httpMethod": event.get("httpMethod", "POST"),
            "httpStatusCode": status_code,
            "responseBody": {
                "application/json": {
                    "body": json.dumps(body, separators=(",", ":")),
                }
            },
        },
    }
