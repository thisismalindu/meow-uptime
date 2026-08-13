# Meow Uptime

Meow Uptime is a small uptime monitoring app I made while learning more about monitoring, Docker, testing, servers, and reliability.

You can add HTTP or HTTPS websites to the app. Meow Uptime checks them every 60 seconds and shows their latest status, response time, failure count, and incident state.

## Features

- Add websites to monitor
- Check each site every 60 seconds
- Show `UP` or `DOWN` status
- Measure response time
- Track consecutive failures
- Mark an incident after 3 consecutive failures
- Clear the incident when the site recovers
- Basic `/health` endpoint
- A few automated tests
- GitHub Actions test workflow
- Docker support

## How it works

```text
Browser
   |
   v
Express server
   |
   +------> Supabase
   |
   +------> Monitored websites
```

The browser only communicates with the Express server.

Supabase credentials stay on the server and are never sent to the browser.

## Requirements

- Node.js 20.6 or newer
- npm
- A Supabase project

Docker is optional.

## Setup

### 1. Clone the project

```bash
git clone https://github.com/thisismalindu/meow-uptime.git
cd meow-uptime
```

Install the dependencies:

```bash
npm install
```

### 2. Set up Supabase

Create a new project in Supabase.

Open the **SQL Editor** in your Supabase project.

Copy the contents of:

```text
supabase-setup.sql
```

into the SQL Editor and run it.

This creates the `sites` table used by Meow Uptime.

### 3. Get the Supabase values

You need two values from Supabase:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
```

For the project URL, open the **Connect** dialog in your Supabase project and copy the Project URL.

It should look similar to:

```text
https://abcdefgh.supabase.co
```

For the secret key, open:

**Settings → API Keys**

Copy a **Secret key** beginning with:

```text
sb_secret_
```

Do not use this key in frontend JavaScript and do not commit it to GitHub.

### 4. Create `.env`

In the root of the project, create a file called:

```text
.env
```

Add:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_key_here
PORT=3000
```

`.env` is ignored by Git.

The repository contains `.env.example` showing the required variables without real credentials.

## Run the application

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

Enter a URL such as:

```text
https://example.com
```

and click **Add**.

The monitor checks saved websites every 60 seconds.

## Status logic

When a site responds successfully:

```text
Status: UP
Failures: 0
Incident: No
```

When a check fails, the failure count increases.

After 3 consecutive failures:

```text
Status: DOWN
Failures: 3
Incident: Yes
```

When the site becomes available again, the failure count and incident state are reset.

## Health endpoint

The app has a basic health endpoint:

```text
http://localhost:3000/health
```

It returns:

```json
{
  "status": "ok"
}
```

## Tests

Run:

```bash
npm test
```

The project uses Node.js's built-in test runner.

The tests currently cover a few basic things such as:

- the `/health` endpoint
- URL validation
- incident/failure logic

The tests do not need Supabase credentials.

## Docker

Build the image:

```bash
docker build -t meow-uptime .
```

Run it using the same `.env` file:

```bash
docker run --rm -p 3000:3000 --env-file .env meow-uptime
```

Then open:

```text
http://localhost:3000
```

## GitHub Actions

A small GitHub Actions workflow runs the tests when code is pushed.

The workflow currently only does:

```text
install dependencies
        |
        v
     npm test
```

Deployment is not automated yet.

## Project structure

```text
meow-uptime/
├── app.js
├── server.js
├── monitor.js
├── package.json
├── supabase-setup.sql
├── Dockerfile
├── .env.example
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── test/
│   └── app.test.js
└── .github/
    └── workflows/
        └── test.yml
```

## TODO

- Store check history
- Calculate uptime percentages
- Keep proper incident history
- Email or Discord alerts
- Prometheus metrics
- Grafana dashboards
- Nginx reverse proxy
- HTTPS
- Deploy to DigitalOcean or Azure
- More tests
- Automated deployment
