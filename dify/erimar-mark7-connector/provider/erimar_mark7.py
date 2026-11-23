from typing import Any
from dify_plugin import ToolProvider
from tools.http_client import checked_url

class ErimarMark7Provider(ToolProvider):
    def _validate_credentials(self, credentials: dict[str, Any]) -> None:
        checked_url(credentials.get("api_base_url", ""))
        token = credentials.get("api_token", "")
        if not isinstance(token, str) or not token.strip() or len(token) > 4096:
            raise ValueError("An API token is required")
