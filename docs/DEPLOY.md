# Deployment guide (templates only)

- **Ubuntu**: install Node 22+, run `npm test && npm start`, configure firewall and TLS reverse proxy, avoid running as root.
- **Docker**: run `docker compose up --build` on a controlled host; service binds to `127.0.0.1:3000` and needs TLS proxy for public use. Docker CLI availability was not verified here.
- **Render**: import `render.yaml` and review available billing/plan settings. Automatic deployment is disabled.
- **Vercel**: use `api/index.mjs` with `vercel.json` as serverless adapter; telemetry remains ephemeral and non-global.
- **Netlify**: use `netlify/functions/mark7.mjs` and `public/index.html`; function metrics remain ephemeral and non-global.
- **Dify**: these files are NOT a native Dify Marketplace plugin yet. A proper SDK package, validated plugin manifest, tests, license compatibility and Marketplace approval are needed. Alternatively, connect an independently deployed HTTPS API as a Dify tool after authorization.

SOMAX is a request normalizer and deduplicator. SOMAS, TROPIC, MCI, MCSIPIM and AttentiCI names define planned stages; no real remote agent, worker queue, automatic CI/CD, payments, external AI model or connected database is shipped. The implementation is intentionally limited to plan-only actions.

Before public service: add per-user auth/tenant isolation, rate limiting, persistent encrypted state with retention, deployment rollback, monitoring and security review. Never log secrets or customer content.
