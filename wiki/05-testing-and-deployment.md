# Testing, Docker, CI, and deployment

## Automated tests

Node's built-in test runner finds `test/app.test.js` when `node --test` runs. The suite currently checks:

- the real `/health` route using a temporary local port;
- the URL validation helper;
- the consecutive-failure state helper.

The temporary port is chosen by passing `0` to `listen`. The operating system selects a free port, which avoids collisions. A `finally` block always closes the test server so Node can exit cleanly.

These are useful small tests, but they do not cover Supabase queries, adding a site, monitor fetch behavior, browser rendering, or Docker startup.

## GitHub Actions continuous integration

On every Git push, `.github/workflows/test.yml` asks a fresh Ubuntu runner to:

1. Check out the repository.
2. Install Node 22.
3. Run `npm ci` for an exact lockfile install.
4. Run `npm test`.

This is **continuous integration (CI)**: automatically checking that committed changes work in a clean environment. The workflow does not deploy anything.

## Docker

A Docker image is a packaged filesystem plus startup instructions. A container is a running instance of that image.

The Dockerfile:

1. Starts from a small official Node 22 Linux image.
2. uses `/app` as its working directory.
3. copies package metadata first.
4. installs exact production dependencies with `npm ci --omit=dev`.
5. copies the application.
6. documents port 3000.
7. starts `node server.js`.

Package metadata is copied before source code so Docker can reuse the slower dependency-install layer when only application code changes.

Build and run:

```bash
docker build -t meow-uptime .
docker run --rm -p 3000:3000 --env-file .env meow-uptime
```

`-p 3000:3000` maps the computer's port 3000 to the container's port 3000. `--env-file .env` injects configuration at runtime; `.env` is excluded from the image.

## What a real deployment needs

A hosting platform would run either Node directly or this container. It must provide:

- the three environment variables;
- outbound network access to Supabase and monitored sites;
- an inbound port exposed through the platform's HTTPS proxy;
- a process restart policy;
- logs and basic monitoring.

The database is already external and persists across app restarts. The monitor timer is not external: it exists only while the Node process is alive.

## Scaling warning

If a platform starts three copies of this app, all three call `startMonitor()` and check every site. That produces duplicate checks and racing database writes. Before horizontal scaling, move the monitor into one dedicated worker, a scheduled job, or a queue system with ownership/locking.

## Health-check limitation

`/health` proves only that Express can respond. It does not prove Supabase is reachable or that the monitor is making progress. This is often called a **liveness** check. A production system may also have a deeper **readiness** check and monitor last-success timestamps.

