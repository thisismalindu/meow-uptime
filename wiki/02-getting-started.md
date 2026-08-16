# Getting started locally

## Tools you need

- **Node.js 22** is the safest choice for this exact dependency lock. Node runs server-side JavaScript and includes `fetch`, the test runner, and `.env` file support used here.
- **npm** installs packages and runs scripts. It comes with Node.
- **Supabase** provides the hosted PostgreSQL database.
- **Git** is useful for version control but is not required merely to run an already downloaded copy.
- **Docker** is optional.

The top-level README says Node 20.6 or newer, but the locked Supabase packages declare Node 22 or newer. Use Node 22 to satisfy both the dependencies and the Docker/CI configuration.

## Install dependencies

From the repository root:

```bash
npm install
```

npm reads `package.json`, uses `package-lock.json` to select exact versions, and creates `node_modules/`. Do not hand-edit `node_modules/`.

This repository also has `pnpm-lock.yaml`. That indicates pnpm was used at some point. For predictable results, choose one package manager per project. The scripts, Dockerfile, and CI currently use npm, so npm and `package-lock.json` are the authoritative path here.

## Create the database

1. Create a Supabase project.
2. Open its SQL Editor.
3. Paste in `supabase-setup.sql` and run it once.
4. Get the project URL and a server-side secret key.

The SQL creates the `sites` table. See [data and monitoring](04-data-and-monitoring.md) for every column.

## Configure environment variables

Copy `.env.example` to `.env`, then replace the sample values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-side-key
PORT=3000
```

An environment variable is a named setting supplied from outside the program. This keeps deployment-specific settings and secrets out of source code.

- `SUPABASE_URL` tells the client which Supabase project to contact.
- `SUPABASE_SECRET_KEY` authorizes server-side database access. Never put it in `public/` or commit it.
- `PORT` selects the TCP port. If absent, the code uses `3000`.

The local `.env` is ignored by both Git and Docker. The docs intentionally do not show its real values.

## Start the application

```bash
npm start
```

That script runs `node --env-file=.env server.js`. Node loads `.env`, then executes `server.js`. Open `http://localhost:3000`.

Useful URLs:

- `http://localhost:3000/` — the user interface.
- `http://localhost:3000/health` — a small server health check.
- `http://localhost:3000/api/sites` — raw JSON for saved sites.

Stop the server with `Ctrl+C` in the terminal.

## Run tests

```bash
npm test
```

Tests do not need Supabase. When the environment variables are absent, root `app.js` leaves its database client as `null`, while the pure helper functions and `/health` endpoint remain usable.

## Common beginner problems

- **`Supabase is not configured`**: `.env` is missing, has wrong names, or was not loaded.
- **Database query errors**: the SQL may not have been run, the URL/key may belong to another project, or the key may lack permission.
- **Port already in use**: choose another `PORT`, such as `PORT=3001`.
- **A site stays `UNKNOWN` briefly**: it starts with database defaults and changes after a monitor check completes.
- **A new site is not checked instantly**: adding it refreshes the list, but the checker runs on its own 60-second schedule.
- **Install warns about Node version**: use Node 22 because the locked Supabase packages require it.

