# Meow Uptime

Meow Uptime is a small uptime monitoring app I made while learning more
about monitoring, Docker, servers and reliability.

You can add website URLs and the server checks them every minute. The latest
status and response time are stored in Supabase and shown on a small dashboard.

## What it does

- adds HTTP or HTTPS URLs to a single Supabase table
- checks each saved URL every 60 seconds
- shows status, response time, last checked time, failures and incidents
- marks an incident after three consecutive failures

## How it works

The browser talks only to Express. Supabase credentials stay on the server.

```text
                    +-------------+
                    |   Browser   |
                    +------+------+
                           |
                           v
                    +-------------+
                    |   Express   |
                    +------+------+
                           |
                 +---------+---------+
                 |                   |
                 v                   v
           +-----------+      monitored sites
           | Supabase  |         via HTTP
           +-----------+
```

Create a Supabase project, open its SQL Editor, and run `supabase-setup.sql`.
Then set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and optionally `PORT`.
The service role key is server-side only and must not be committed.

## Running the project

```bash
npm install
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-server-side-key"
npm start
```

Open <http://localhost:3000>. Without Supabase variables, the health page and
tests still work, but site storage and monitoring are unavailable.

## Running tests

```bash
npm test
```

The tests use Node's built-in test runner and do not need Supabase credentials.

## Docker

```bash
docker build -t meow-uptime .
docker run --rm -p 3000:3000 \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SERVICE_ROLE_KEY="your-server-side-key" \
  meow-uptime
```

## Things I want to add

- store check history
- calculate uptime percentages
- proper incident history
- email or Discord alerts
- Prometheus metrics
- Grafana dashboard
- Nginx reverse proxy
- HTTPS
- deploy to DigitalOcean or Azure
- better tests
- CI/CD deployment
