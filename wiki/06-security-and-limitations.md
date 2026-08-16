# Security, limitations, and next steps

This is intentionally a learning-sized application. Understanding its boundaries is part of understanding the architecture.

## What it already does well

- The Supabase secret stays in server-side environment variables.
- `.env` is excluded from Git and Docker build context.
- The browser escapes stored URLs before inserting them through `innerHTML`.
- The server returns generic database error messages to clients while logging details server-side.
- Site checks normally time out after eight seconds on the supported Node runtime.

## Important limitations

### No authentication or authorization

Anyone who can reach the app can view and add URLs. There is no user identity, ownership, or admin role. A public deployment should add authentication and authorization plus database policies appropriate to the chosen key.

### Server-side request forgery risk

The server fetches user-submitted URLs. Checking only `http://` or `https://` does not prevent addresses such as internal services, localhost, cloud metadata endpoints, redirects into private networks, or unusual encoded hosts. This class of problem is called **SSRF**. A public monitor needs DNS/IP validation, private-range blocking, redirect checks, allowed ports, size limits, and usually an outbound network policy.

### Minimal URL validation

`startsWith` accepts some strings that begin correctly but are not useful URLs. A stronger validator would use `new URL`, require an allowed protocol and hostname, normalize values, and define duplicate behavior.

### No database access policy in the SQL

The setup SQL creates a table but does not enable/configure Row Level Security. Because this backend uses a powerful server secret, the key must remain private. Production SQL should deliberately define roles, grants, and RLS policies rather than relying on defaults.

### One process owns web requests and scheduled work

This is simple but creates duplicate monitor jobs when scaled to multiple replicas. Deploy the monitor separately or introduce distributed scheduling before scaling.

### Latest state only

Updates overwrite prior checks. Add append-only check history for uptime percentages, charts, audits, and reliable incident history.

### Limited observability and resilience

Logs are plain console lines. There are no structured logs, metrics, alerts, retry policy, concurrency limit, graceful shutdown handler, or proof that the monitor is current.

### Browser error handling is deliberately quiet

The 10-second refresh ignores failures, so stale data can remain visible without warning. Show a “last refreshed” value and a visible connection error in a more robust UI.

### Dependency management is split

Both npm and pnpm lockfiles exist, and they do not resolve every package to identical versions. Choose one package manager and remove the other lockfile in a deliberate maintenance change. The current Docker and CI path uses npm.

## Sensible learning roadmap

1. Add tests for POST `/api/sites` and `checkSite` using dependency injection or mocks.
2. Parse URLs with the standard `URL` class and reject duplicates.
3. Add delete/edit operations and corresponding UI controls.
4. Add `checks` and `incidents` tables.
5. Add authentication and explicit database security policies.
6. Protect outbound checks against SSRF.
7. Separate the monitor worker from the API server.
8. Add controlled concurrency, structured logs, metrics, and alerts.
9. Add a deployment workflow only after the target environment and secret storage are chosen.

