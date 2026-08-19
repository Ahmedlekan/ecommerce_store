"""AWS Lambda handler for read-only Prometheus/AMP evidence collection.

The handler validates bounded input, maps metric keys to fixed PromQL, queries
AMP, summarizes returned time series, and emits compact evidence JSON. It does
not perform diagnosis, remediation, shell execution, or Kubernetes operations.
"""

from __future__ import annotations

import json
import os
import time
from datetime import datetime, timezone
from typing import Any

from prometheus_evidence.amp_client import AmpClientError, query_amp_range
from prometheus_evidence.bedrock_response import action_group_response
from prometheus_evidence.queries import ALLOWED_NAMESPACES, build_query


DEFAULT_NAMESPACE = os.getenv("DEFAULT_NAMESPACE", "micro-tier")
DEFAULT_HOURS_BACK = int(os.getenv("DEFAULT_HOURS_BACK", "1"))
MAX_HOURS_BACK = int(os.getenv("MAX_HOURS_BACK", "24"))
DEFAULT_MAX_SERIES = int(os.getenv("DEFAULT_MAX_SERIES", "20"))
MAX_SERIES = int(os.getenv("MAX_SERIES", "50"))
QUERY_STEP_SECONDS = int(os.getenv("QUERY_STEP_SECONDS", "60"))
AMP_REQUEST_TIMEOUT_SECONDS = int(os.getenv("AMP_REQUEST_TIMEOUT_SECONDS", "5"))


class ValidationError(ValueError):
    """Validation error with a stable machine-readable code."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


def lambda_handler(event: dict[str, Any], _context: Any) -> dict[str, Any]:
    """Bedrock Agent Lambda entrypoint."""

    observed_at = _utc_now()

    try:
        request = _extract_request(event)
        _reject_unsupported_parameters(request)
        metric_name = _required_string(request, "metric_name")
        namespace = _optional_string(request, "namespace", DEFAULT_NAMESPACE)
        hours_back = _bounded_int(request, "hours_back", DEFAULT_HOURS_BACK, 1, MAX_HOURS_BACK)
        max_series = _bounded_int(request, "max_series", DEFAULT_MAX_SERIES, 1, MAX_SERIES)

        query, definition = build_query(metric_name, namespace, hours_back)
        end = int(time.time())
        start = end - (hours_back * 3600)

        amp_payload = query_amp_range(
            endpoint=_amp_query_endpoint(),
            region=os.getenv("AWS_REGION", "us-east-1"),
            query=query,
            start=start,
            end=end,
            step=QUERY_STEP_SECONDS,
            timeout_seconds=AMP_REQUEST_TIMEOUT_SECONDS,
        )

        evidence = _build_success_response(
            amp_payload=amp_payload,
            metric_name=metric_name,
            namespace=namespace,
            hours_back=hours_back,
            max_series=max_series,
            resource_label=definition.resource_label,
            unit=definition.unit,
            observed_at=observed_at,
        )
        return action_group_response(event, evidence, 200)

    except ValidationError as exc:
        return action_group_response(
            event,
            _error_response(
                code=exc.code,
                message=exc.message,
                observed_at=observed_at,
                request=_safe_request(event),
            ),
            200,
        )
    except ValueError as exc:
        code = str(exc)
        messages = {
            "INVALID_METRIC_NAME": "metric_name must be one of the allowed query keys",
            "INVALID_NAMESPACE": f"namespace must be one of {sorted(ALLOWED_NAMESPACES)}",
        }
        return action_group_response(
            event,
            _error_response(
                code=code,
                message=messages.get(code, "request validation failed"),
                observed_at=observed_at,
                request=_safe_request(event),
            ),
            200,
        )
    except AmpClientError as exc:
        return action_group_response(
            event,
            _error_response(
                code="AMP_QUERY_FAILED",
                message=str(exc),
                observed_at=observed_at,
                request=_safe_request(event),
            ),
            200,
        )


def _extract_request(event: dict[str, Any]) -> dict[str, Any]:
    """Extract JSON body from Bedrock action-group events or direct test events."""

    if "requestBody" not in event:
        return event

    content = event.get("requestBody", {}).get("content", {})
    json_body = content.get("application/json", {})
    body = json_body.get("body", {})

    if isinstance(body, dict):
        return body
    if isinstance(body, str):
        try:
            decoded = json.loads(body)
        except json.JSONDecodeError as exc:
            raise ValidationError("INVALID_JSON", "request body must be valid JSON") from exc
        if isinstance(decoded, dict):
            return decoded

    raise ValidationError("INVALID_REQUEST_BODY", "request body must be a JSON object")


def _required_string(request: dict[str, Any], field: str) -> str:
    """Read a required non-empty string field."""

    value = request.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValidationError("MISSING_METRIC_NAME", "metric_name is required")
    return value.strip()


def _reject_unsupported_parameters(request: dict[str, Any]) -> None:
    """Reject fields intentionally not supported until AMP labels are verified."""

    if "service" in request:
        raise ValidationError(
            "UNSUPPORTED_PARAMETER",
            "service filtering is not supported until actual AMP labels are verified",
        )


def _optional_string(request: dict[str, Any], field: str, default: str) -> str:
    """Read an optional string field with a safe default."""

    value = request.get(field, default)
    if not isinstance(value, str) or not value.strip():
        raise ValidationError("INVALID_NAMESPACE", "namespace must be a non-empty string")
    return value.strip()


def _bounded_int(
    request: dict[str, Any],
    field: str,
    default: int,
    minimum: int,
    maximum: int,
) -> int:
    """Read an integer field and enforce operational bounds."""

    value = request.get(field, default)
    if isinstance(value, bool):
        raise ValidationError("INVALID_PARAMETER", f"{field} must be an integer")
    try:
        parsed = int(value)
    except (TypeError, ValueError) as exc:
        raise ValidationError("INVALID_PARAMETER", f"{field} must be an integer") from exc

    if parsed < minimum or parsed > maximum:
        raise ValidationError(
            "PARAMETER_OUT_OF_RANGE",
            f"{field} must be between {minimum} and {maximum}",
        )
    return parsed


def _amp_query_endpoint() -> str:
    """Return the configured AMP query_range endpoint."""

    endpoint = os.getenv("AMP_QUERY_ENDPOINT")
    if not endpoint:
        raise ValidationError("CONFIGURATION_ERROR", "AMP_QUERY_ENDPOINT is not configured")
    return endpoint


def _build_success_response(
    *,
    amp_payload: dict[str, Any],
    metric_name: str,
    namespace: str,
    hours_back: int,
    max_series: int,
    resource_label: str,
    unit: str,
    observed_at: str,
) -> dict[str, Any]:
    """Summarize AMP matrix results into compact evidence entries."""

    results = amp_payload.get("data", {}).get("result", [])
    if not isinstance(results, list):
        raise AmpClientError("AMP response did not contain a result list")

    truncated = len(results) > max_series
    summaries = [
        _summarize_series(series, resource_label, unit)
        for series in results[:max_series]
    ]

    return {
        "status": "ok",
        "source": "amp",
        "metric": metric_name,
        "namespace": namespace,
        "window": f"{hours_back}h",
        "observed_at": observed_at,
        "data": summaries,
        "metadata": {
            "series_count": len(summaries),
            "truncated": truncated,
            "query_mode": "range",
        },
    }


def _summarize_series(series: dict[str, Any], resource_label: str, unit: str) -> dict[str, Any]:
    """Calculate current, average, and maximum values for one AMP series."""

    metric = series.get("metric", {})
    resource = metric.get(resource_label) or metric.get("pod") or metric.get("deployment") or "unknown"
    values = series.get("values", [])

    numeric_values: list[tuple[float, float]] = []
    for sample in values:
        if not isinstance(sample, list) or len(sample) != 2:
            continue
        try:
            numeric_values.append((float(sample[0]), float(sample[1])))
        except (TypeError, ValueError):
            continue

    if not numeric_values:
        return {
            "resource": resource,
            "current": None,
            "average": None,
            "maximum": None,
            "unit": unit,
            "observed_at": None,
        }

    latest_timestamp, latest_value = numeric_values[-1]
    values_only = [value for _, value in numeric_values]

    return {
        "resource": resource,
        "current": round(latest_value, 6),
        "average": round(sum(values_only) / len(values_only), 6),
        "maximum": round(max(values_only), 6),
        "unit": unit,
        "observed_at": _epoch_to_utc(latest_timestamp),
    }


def _error_response(
    *,
    code: str,
    message: str,
    observed_at: str,
    request: dict[str, Any],
) -> dict[str, Any]:
    """Return structured errors without credentials or signed request details."""

    return {
        "status": "error",
        "source": "amp",
        "metric": request.get("metric_name"),
        "namespace": request.get("namespace", DEFAULT_NAMESPACE),
        "observed_at": observed_at,
        "error": {
            "code": code,
            "message": message,
        },
    }


def _safe_request(event: dict[str, Any]) -> dict[str, Any]:
    """Best-effort request extraction for error responses."""

    try:
        return _extract_request(event)
    except ValidationError:
        return {}


def _utc_now() -> str:
    """Current UTC timestamp formatted for JSON evidence."""

    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _epoch_to_utc(value: float) -> str:
    """Convert a Prometheus epoch timestamp into an ISO-8601 UTC timestamp."""

    return datetime.fromtimestamp(value, timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
