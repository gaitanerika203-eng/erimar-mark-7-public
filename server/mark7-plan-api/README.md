# ERIMAR MARK 7 — isolated Dify HTTPS planning API
This directory contains an **open planning gateway**, not the private SOMAX engine, ERIMAR STYLE, ERIMAR LINK API, or any proprietary automation runtime.

## Request
`POST /api/plan` with `Authorization: Bearer <tenant-api-token>` and `Content-Type: application/json`.
Body: `{"goal":"Create a retail store","kind":"ecommerce"}`.
Response: JSON with `mode:"plan-only"`, route, recommendations and `requires_human_approval:true`.
Public `GET /api/health` returns only health metadata.

## Security / deployment
- Deploy as a **separate Vercel project** with Root Directory `server/mark7-plan-api`; Node 22.
- Start with `MARK7_DIFY_ENABLED=false`. Set `MARK7_DIFY_API_TOKEN` (32+ random characters) in the cloud secret manager. Do **not** reuse `ADMIN_SECRET_KEY`, `JWT_SECRET`, `LINK_MESH_TOKEN`, `CLIENT_SECRET_KEY` or a STYLE AI model key.
- To allow multiple installations, set `MARK7_DIFY_TOKENS_JSON` to secret records with unique tenant IDs and unique tokens. This is manual provisioning, **not** a public self-service signup or full tenant administration platform.
- Set `MARK7_REDIS_REST_URL`, `MARK7_REDIS_REST_TOKEN` for atomic, per-tenant distributed rate limits (default 20/min, max 60/min). **Without Redis, requests fail closed with 503.** Use separate scoped credentials. Rate limits and hosting may have cost implications.
- Set `MARK7_DIFY_ENABLED=true` only after environment variables and a test tenant are ready, then redeploy and verify 401 without token / 200 with token.
- HTTPS only; no cross-origin browser access; no redirects or external execution from the planner.
- No plaintext secrets in the repository or Dify Marketplace submission. Never paste a token into a GitHub issue or chat.
- Do not publish or share a universal test token. Rotate compromised tokens.
- Before broad public distribution, add signup, tenant lifecycle controls, request logging without prompts and abuse monitoring.

## Verify
`npm test` from this directory. For test workspace, set Dify provider `api_base_url` to **this dedicated API HTTPS origin** and `api_token` to the token provisioned for that workspace.

The public connector's `plan_project` tool remains limited to project planning; any private engine capabilities require a separately authorized integration.
