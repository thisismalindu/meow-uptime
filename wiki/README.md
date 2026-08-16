# Meow Uptime: complete beginner's guide

This folder explains the whole repository as if you are new to Node.js, web development, databases, testing, containers, and deployment.

Nothing in `docs/` is required for the application to run. These Markdown files are a learning companion for the real files one directory above.

## Recommended reading order

1. [The big picture](01-big-picture.md) — what the application does and how its pieces communicate.
2. [Getting started](02-getting-started.md) — tools, installation, configuration, and running locally.
3. [Web and JavaScript concepts](03-web-and-javascript-concepts.md) — the vocabulary used throughout the code.
4. [Data and monitoring logic](04-data-and-monitoring.md) — the database and the `UP`/`DOWN` state machine.
5. [Testing, Docker, CI, and deployment](05-testing-and-deployment.md) — how the project is checked and shipped.
6. [Security, limitations, and next steps](06-security-and-limitations.md) — what is intentionally simple and what production software would add.
7. [File reference](files/README.md) — every project-owned file, with its code and a plain-English walkthrough.

## Repository map

```text
meow-uptime/
├── app.js                     Backend application and API routes
├── monitor.js                 Background website checker
├── server.js                  Process entry point
├── public/                    Files sent to the browser
│   ├── index.html             Page structure
│   ├── style.css              Page appearance
│   └── app.js                 Browser behavior
├── test/app.test.js           Automated tests
├── supabase-setup.sql         Database table definition
├── package.json               Node project manifest
├── package-lock.json          npm's generated dependency snapshot
├── pnpm-lock.yaml             pnpm's generated dependency snapshot
├── Dockerfile                 Container build recipe
├── .dockerignore              Files excluded from a container build
├── .gitignore                 Files excluded from Git
├── .env.example               Safe configuration template
├── .env                       Local secrets; never copied into these docs
├── .github/workflows/test.yml Automated GitHub test job
├── README.md                  Public project introduction
└── docs/                      The guide you are reading
```

`node_modules/` is not application source. Package managers generate it from a lockfile. It contains thousands of dependency files maintained by other projects, so it is intentionally not reproduced here.

## One-sentence mental model

The browser asks Express for saved sites, Express reads them from Supabase, and a timer in the Node process periodically fetches each site and writes its latest health back to Supabase.

