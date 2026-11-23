# ERIMAR MARK 7 — Dify Tool Connector (v0.1.1)

**Public connector, isolated planning API.** This native Dify tool sends `goal` and `kind` to a separately deployed, authorized HTTPS `POST /api/plan` endpoint. It returns a reference project plan. It **does not** invoke any proprietary SOMAX engine or run code, Git operations, deployment, or paid model requests.

## Hosted endpoint

- HTTPS origin: **https://erimar-mark7-dify-api.vercel.app**
- Health probe: https://erimar-mark7-dify-api.vercel.app/api/health (no secrets)
- Plan endpoint: `POST https://erimar-mark7-dify-api.vercel.app/api/plan` (bearer token required)
- Status: the backend is deployed, but **planning is disabled until per-installation credentials and distributed quotas are configured**. A health 200 does not mean the Dify connector is ready.

The standalone public backend source is in `server/mark7-plan-api/`. Its implementation is reference planning only; private ERIMAR LINK API, STYLE, VITRINA and SOMAX are not bundled.

## Install and test

1. Download the `.difypkg` from the successful [Dify package workflow](https://github.com/gaitanerika203-eng/erimar-mark-7-public/actions/workflows/dify-package-cloud.yml). The workflow produces the current packaged version from `main`.
2. In a test Dify workspace, install the package and configure its tool credentials:
   `api_base_url=https://erimar-mark7-dify-api.vercel.app`
   `api_token=<separately issued MARK7_DIFY_API_TOKEN for this installation>`
3. The API operator must first enable the gateway, store a separate random token in Vercel, configure shared Redis-backed per-tenant quotas, and redeploy. Do not paste these secrets into GitHub or this README.
4. Run `plan_project` with `goal="Create a demo ecommerce website"`, `kind="ecommerce"`. Successful responses contain `mode:"plan-only"` and `requires_human_approval:true`.

**Do not reuse** `ADMIN_SECRET_KEY`, `CLIENT_SECRET_KEY`, `JWT_SECRET`, `LINK_MESH_TOKEN` or an ERIMAR STYLE AI key. They authenticate different ERIMAR components.

## Verification and release

GitHub Actions runs connector checks and packages the official `.difypkg`. The standalone backend tests execute in the API's CI workflow. Full installation and authenticated end-to-end testing in a Dify workspace, provisioning of public users, and Marketplace submission remain to be completed. Creator Center or Dify Marketplace publication is **not automatic** when code is pushed to GitHub.

## Security

The plugin validates HTTPS-only origins and disables HTTP redirects, but Dify must enforce DNS/private-network egress controls to protect against DNS rebinding. Credentials are stored as Dify secret inputs. The backend enforces per-installation bearer authentication and distributed quotas when enabled. Do not use real personal information or sensitive prompts for testing.

## Policy

See `PRIVACY.md` and the [Dify Marketplace submission requirements](https://github.com/langgenius/dify-plugins/blob/main/docs/plugin-submission-requirements.md).
