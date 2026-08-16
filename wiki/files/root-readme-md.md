# `README.md` — public project introduction

The root README is user-facing documentation rather than executable code. GitHub renders it on the repository's front page. Its 191 lines already explain installation and use, so this page maps every section and explains why it exists instead of duplicating the entire document inside another document.

## Source outline

```markdown
# Meow Uptime

<img ... />

Meow Uptime is a small uptime monitoring app ...

## Features
...
## How it works
...
## Requirements
...
## Setup
...
## Run the application
...
## Status logic
...
## Health endpoint
...
## Tests
...
## Docker
...
## GitHub Actions
...
## Project structure
...
## TODO
...
```

The complete, authoritative prose is the root [`README.md`](../../README.md). The shortened ellipses above mean “existing prose/code examples,” not executable source that should be copied.

## Section-by-section walkthrough

- **Title and image:** Identify the project and provide a visual preview through a GitHub-hosted image URL. Raw `<img>` HTML is used so width and height can be controlled.
- **Opening paragraph:** States the learning purpose and core behavior before asking the reader to install anything.
- **Features:** Gives a scannable capability list: CRUD is currently add/read only, checks recur every 60 seconds, failures become incidents at three, and supporting infrastructure includes health, tests, CI, and Docker.
- **How it works:** Shows the browser → Express → Supabase/website boundary and explains why secrets remain on the server.
- **Requirements:** Lists Node, npm, Supabase, and optional Docker. One maintenance mismatch exists: it says Node 20.6+, while the locked Supabase release declares Node 22+. The Dockerfile and CI already use 22.
- **Setup:** Walks through clone/install, running the SQL, locating Supabase settings, and creating `.env`. The arrow text appears mojibaked (`â†’`) in the current file, likely due to a character-encoding mismatch; it was probably intended to display `→`.
- **Run the application:** Shows `npm start`, the local URL, and an example monitored URL.
- **Status logic:** Explains healthy, failure, incident-threshold, and recovery behavior in user-visible terms.
- **Health endpoint:** Documents `/health` and its JSON response.
- **Tests:** Shows the command and current coverage boundaries.
- **Docker:** Shows image build, environment injection, port publishing, and container execution.
- **GitHub Actions:** Explains that CI installs dependencies and tests but does not deploy.
- **Project structure:** Provides a tree of authored files. Its box-drawing characters are also mojibaked in the current local rendering (`â”...`), another encoding/display issue rather than architecture.
- **TODO:** Records possible growth areas such as check history, alerts, metrics, HTTPS, deployment, and broader tests. A TODO is intent, not implemented behavior.

## How this differs from `docs/`

The root README optimizes for a visitor who wants to understand and run the project quickly. This `docs/` folder teaches the underlying technology, architecture, code lines, tradeoffs, and production limitations at much greater depth.

