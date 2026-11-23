from collections.abc import Generator
from typing import Any
from dify_plugin import Tool
from dify_plugin.entities.tool import ToolInvokeMessage
from tools.http_client import call_plan

class PlanProjectTool(Tool):
    def _invoke(self, tool_parameters: dict[str, Any]) -> Generator[ToolInvokeMessage, None, None]:
        credentials = self.runtime.credentials
        try:
            result = call_plan(credentials.get("api_base_url", ""), credentials.get("api_token", ""), tool_parameters.get("goal", ""), tool_parameters.get("kind", "web-app"))
        except ValueError as exc:
            yield self.create_text_message("MARK 7 planning unavailable: " + str(exc))
            return
        yield self.create_json_message(result)
