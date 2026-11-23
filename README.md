# ERIMAR MARK 7 PUBLIC · v0.3.0

![ERIMAR MARK 7 logo](assets/mark7-icon.png)

**Public, portable, privacy-conscious planning assistant.** Commercial Matrix Gold identity. Separate from all private ERIMAR systems.

## Included
- Original ChatGPT/Codex public agent skill and icon, preserved from v0.2.1.
- Executable Node.js 22 planning API: `/healthz`, `/api/capabilities`, `/api/plan`, `/api/telemetry`.
- SOMAS → SOMAX → TROPIC → MCI → MCSIPIM → AttentiCI route representation, with **plan-only** semantics.
- SOMAX capability normalization/deduplication and allowlisted privacy-safe AttentiCI metrics.
- Ubuntu, Docker Compose, Vercel, Netlify, Render deployment adapters.
- Node built-in tests and `.env.example`; no provider keys or paid services.

## Test locally
```bash
npm test
npm start
curl http://localhost:3000/healthz
curl -H 'Content-Type: application/json' -d '{"goal":"Create a store", "capabilities":["architecture","testing"]}' http://localhost:3000/api/plan
```

## Usage limits
This is **not** a production multi-tenant SaaS, deployed hosting platform or Dify-native plugin. All provider deployments are unconfigured templates; no customer databases, live MCP workers, integrations with private ERIMAR STYLE/VITRINA systems, or persistent telemetry services are embedded. Events exist only in each running process and do not contain prompts, tokens, client identifiers, emails or IPs. Do not expose publicly to high traffic without rate limiting, authentication and observability safeguards.

Read [deployment guide](docs/DEPLOY.md) and [privacy policy](PRIVACY.md). All changes to production and external services require user authorization.

**Rights reserved unless a separate LICENSE grants permission.** Marketplace eligibility and distribution rights must be reviewed separately.

For a user-owned Dify HTTP/OpenAPI tool after deployment, start from [OpenAPI draft](docs/openapi.yaml), replace its placeholder server URL, and validate against the actual runtime. This is not a Dify-native Marketplace package.
