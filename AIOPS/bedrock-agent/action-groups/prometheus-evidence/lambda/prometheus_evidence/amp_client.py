"""Small AMP query_range client with AWS SigV4 request signing.

The client only calls the configured AMP query endpoint. It does not expose
generic AWS API execution and it does not accept arbitrary endpoint targets from
the Bedrock Agent request.
"""

from __future__ import annotations

import json
import urllib.parse
import urllib.request


class AmpClientError(RuntimeError):
    """Raised when AMP returns an error or an unreadable response."""


def query_amp_range(
    *,
    endpoint: str,
    region: str,
    query: str,
    start: int,
    end: int,
    step: int,
    timeout_seconds: int,
) -> dict:
    """Execute one signed AMP query_range request and return decoded JSON."""

    # Import botocore lazily so pure validation/unit tests can run without AWS
    # SDK imports until the AMP client is exercised.
    import botocore.auth
    import botocore.awsrequest
    import botocore.session

    body = urllib.parse.urlencode(
        {
            "query": query,
            "start": str(start),
            "end": str(end),
            "step": str(step),
        }
    ).encode("utf-8")

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
    }

    aws_request = botocore.awsrequest.AWSRequest(
        method="POST",
        url=endpoint,
        data=body,
        headers=headers,
    )
    credentials = botocore.session.get_session().get_credentials()
    if credentials is None:
        raise AmpClientError("AWS credentials were not available")

    botocore.auth.SigV4Auth(credentials.get_frozen_credentials(), "aps", region).add_auth(
        aws_request
    )

    signed_headers = dict(aws_request.headers.items())
    request = urllib.request.Request(
        endpoint,
        data=body,
        headers=signed_headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=timeout_seconds) as response:
            payload = response.read().decode("utf-8")
    except TimeoutError as exc:
        raise AmpClientError("AMP query timed out") from exc
    except OSError as exc:
        raise AmpClientError("AMP query failed") from exc

    try:
        decoded = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise AmpClientError("AMP returned invalid JSON") from exc

    if decoded.get("status") != "success":
        error_message = decoded.get("error") or "AMP query did not succeed"
        raise AmpClientError(str(error_message))

    return decoded
