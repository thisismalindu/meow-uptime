# The big picture

## What problem does this application solve?

Meow Uptime stores a list of website URLs. Every 60 seconds it makes an HTTP request to each URL. It records whether the response was successful, how long it took, and whether repeated failures should be called an incident. A web page refreshes the displayed results every 10 seconds.

This is a **full-stack** application because it has all three common layers:

- A **frontend**: HTML, CSS, and browser JavaScript in `public/`.
- A **backend**: Node.js and Express in `app.js`, `monitor.js`, and `server.js`.
- A **database**: a PostgreSQL table hosted by Supabase and defined by `supabase-setup.sql`.

## Architecture

```text
                                      every 60 seconds
                                      ┌──────────────────┐
                                      │ monitored sites  │
                                      └────────▲─────────┘
                                               │ HTTP fetch
                                               │
┌─────────────┐  HTTP requests  ┌──────────────┴─────────────┐
│ Web browser ├────────────────►│ Node.js + Express process  │
│             │◄────────────────┤                            │
│ HTML/CSS/JS │ JSON + files    │ API routes + monitor timer │
└─────────────┘                 └──────────────┬─────────────┘
                                              │ database calls
                                              ▼
                                     ┌──────────────────┐
                                     │ Supabase `sites` │
                                     │ PostgreSQL table │
                                     └──────────────────┘
```

The browser never talks directly to Supabase. This matters because the Supabase secret key is powerful and must remain on the server.

## The two jobs in one Node process

When `server.js` starts, one operating-system process does two jobs:

1. Express listens for browser requests.
2. The monitor runs immediately and then once every 60 seconds.

This is easy to understand and deploy for a small learning project. At production scale, the web server and background worker are often separate processes. Separating them prevents every web-server replica from performing the same checks and lets each job scale independently.

## What happens when someone opens the page?

```text
1. Browser requests GET /
2. Express static middleware sends public/index.html
3. The HTML asks for /style.css and /app.js
4. Browser app.js requests GET /api/sites
5. Express queries Supabase
6. Express returns JSON
7. Browser turns the JSON into site cards
```

Express's static middleware maps browser paths to files. For example, `/style.css` maps to `public/style.css`; `public` does not appear in the URL.

## What happens when someone adds a site?

```text
form submission
    │
    ▼
browser POST /api/sites with { "url": "https://example.com" }
    │
    ▼
Express parses JSON and checks the URL prefix
    │
    ▼
Supabase inserts a new row with database defaults
    │
    ▼
Express returns { "ok": true }
    │
    ▼
browser reloads and redraws the site list
```

## What happens during a health check?

The monitor selects all site rows. For each row it:

1. Remembers the current time.
2. Fetches the site's URL, with an eight-second timeout when the runtime supports it.
3. Treats HTTP status codes from 200 through 299 as healthy because `Response.ok` uses that range.
4. Calculates latency by subtracting the start time from the finish time.
5. Updates the failure count and incident flag.
6. Saves the latest result in the same database row.

The loop uses `await` for each site, so checks are **sequential**. Ten slow sites can therefore take much longer than one slow site. Sequential code is simple and avoids launching an unlimited burst of requests, but a mature monitor would use controlled concurrency.

## The major boundaries

- `public/app.js` runs in a visitor's browser. It can use `document` and manipulate the page.
- Root `app.js` runs on the server. It can read environment variables and use the secret database client.
- `monitor.js` also runs on the server. It makes outbound requests to monitored websites.
- Supabase runs elsewhere. The app accesses it over the network.
- Docker packages the Node application; GitHub Actions tests it. Neither is part of normal request handling.

Two different files are named `app.js`. Their folders tell you which one is meant: root `app.js` is the backend; `public/app.js` is the frontend.

