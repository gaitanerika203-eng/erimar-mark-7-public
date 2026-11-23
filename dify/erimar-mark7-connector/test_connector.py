import unittest
from unittest.mock import patch, MagicMock
from tools.http_client import checked_url, call_plan

class ConnectorTests(unittest.TestCase):
    def test_public_https(self):
        self.assertEqual(checked_url("https://api.sample.org"), "https://api.sample.org")
    def test_reject_http_and_private(self):
        for url in ["http://api.sample.org","https://localhost","https://127.0.0.1","https://10.0.0.2","https://api.internal","https://api.sample.org:8080","https://admin:pass@api.sample.org"]:
            with self.subTest(url=url), self.assertRaises(ValueError):
                checked_url(url)
    def test_goal_limit(self):
        with self.assertRaises(ValueError):
            call_plan("https://api.sample.org","secret","x"*501)
    @patch("tools.http_client.urllib.request.build_opener")
    def test_sends_bearer_to_configured_api(self, make_opener):
        response = MagicMock()
        response.status = 200
        response.read.return_value = b'{"state":"awaits-human-approval"}'
        make_opener.return_value.open.return_value.__enter__.return_value = response
        result = call_plan("https://api.sample.org","secret","Create store","ecommerce")
        req = make_opener.return_value.open.call_args.args[0]
        self.assertEqual(req.full_url, "https://api.sample.org/api/plan")
        self.assertEqual(req.get_header("Authorization"),"Bearer secret")
        self.assertEqual(result["state"],"awaits-human-approval")
if __name__ == "__main__":
    unittest.main()
