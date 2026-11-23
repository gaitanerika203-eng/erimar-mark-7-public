"""Public HTTPS-only wrapper; no proprietary SOMAX engine is included."""
import ipaddress
import json
import urllib.error
import urllib.parse
import urllib.request

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        raise ValueError("Redirects are disabled")

def checked_url(url: str) -> str:
    if not isinstance(url, str) or len(url) > 512:
        raise ValueError("Invalid API base URL")
    p = urllib.parse.urlsplit(url.strip())
    host = (p.hostname or "").lower().rstrip(".")
    if p.scheme != "https" or not host or p.username or p.password or p.query or p.fragment or p.path not in ("", "/"):
        raise ValueError("A bare HTTPS API URL is required")
    try:
        port = p.port
    except ValueError as exc:
        raise ValueError("Invalid port") from exc
    if port not in (None, 443):
        raise ValueError("Only port 443 is supported")
    if host in ("localhost", "localhost.localdomain") or host.endswith((".local", ".internal", ".localhost", ".test", ".example", ".invalid")):
        raise ValueError("Private hosts forbidden")
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        pass
    else:
        if not ip.is_global:
            raise ValueError("Only public IP addresses supported")
    # The hosting provider MUST enforce private-address egress restrictions against DNS rebinding.
    return "https://" + host + (":443" if port == 443 else "")

def call_plan(base: str, token: str, goal: str, kind: str = "web-app") -> dict:
    base = checked_url(base)
    if not isinstance(token, str) or not token.strip() or len(token) > 4096:
        raise ValueError("API token is not configured")
    if not isinstance(goal, str) or not 1 <= len(goal.strip()) <= 500:
        raise ValueError("Goal must have 1-500 characters")
    body = json.dumps({"goal": goal.strip(), "kind": (kind or "web-app")[:40]}, ensure_ascii=False).encode()
    request = urllib.request.Request(base + "/api/plan", data=body, method="POST", headers={"Authorization": "Bearer " + token, "Content-Type": "application/json", "Accept": "application/json"})
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=12) as response:
            if response.status != 200:
                raise ValueError("Unexpected API response")
            data = response.read(65537)
            if len(data) > 65536:
                raise ValueError("Response too large")
            result = json.loads(data)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise ValueError("API unavailable or authorization failed") from exc
    if not isinstance(result, dict):
        raise ValueError("Invalid API response")
    return result
