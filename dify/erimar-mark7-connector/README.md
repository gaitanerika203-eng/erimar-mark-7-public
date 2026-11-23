# ERIMAR MARK 7 — Dify Connector

**Public connector, private engine.** This Dify-native tool connects to an independently hosted and authorized HTTPS API using per-installation credentials. Its only active operation is plan-only `POST /api/plan` with `goal` and `kind`. No deployment, payment, Git write or background job is enabled.

The implementation does NOT include SOMAX proprietary internals, ERIMAR STYLE/VITRINA private data or API tokens.

## Install
Use the Dify plugin CLI: `dify-plugin plugin package ./dify/erimar-mark7-connector` from repository root. Install the generated `.difypkg` in a test Dify workspace, configure the HTTPS API base URL and bearer token using Dify tool credentials, then test `plan_project`.

## Requirements and limitations
- Python 3.12 / dify_plugin >=0.9.0; CLI and runtime packaging not yet confirmed in CI.
- An **independently deployed, bearer-authenticated HTTPS backend** is required to use the tool. The MARK 7 public planning demo does NOT implement bearer authorization and is **not** a private production backend.
- Configure network-level egress filtering (DNS rebinding protections) when handling untrusted endpoint settings.
- Marketplace submission requires a separate review and acceptance of Dify terms; not yet submitted or approved.
