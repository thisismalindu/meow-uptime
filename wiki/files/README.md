# File-by-file reference

Each page below reproduces the relevant source and explains it in plain language. Blank lines merely separate ideas, so they are not called out individually. Closely related lines are sometimes explained as a group when separating them would make the explanation harder to understand.

## Runtime source

- [`app.js`](app-js.md) — backend setup, validation, API routes, and health endpoint.
- [`monitor.js`](monitor-js.md) — fetches websites and saves check results.
- [`server.js`](server-js.md) — starts the process.
- [`public/index.html`](public-index-html.md) — browser page structure.
- [`public/app.js`](public-app-js.md) — browser interactivity and rendering.
- [`public/style.css`](public-style-css.md) — visual styling.

## Data and tests

- [`supabase-setup.sql`](supabase-setup-sql.md) — database schema.
- [`test/app.test.js`](test-app-test-js.md) — automated tests.

## Package, delivery, and repository files

- [`package.json`](package-json.md) — Node package manifest.
- [`package-lock.json`](package-lock-json.md) — npm-generated dependency lock.
- [`pnpm-lock.yaml`](pnpm-lock-yaml.md) — pnpm-generated dependency lock.
- [`Dockerfile`](dockerfile.md) — image recipe.
- [`.dockerignore`](dot-dockerignore.md) — Docker exclusions.
- [`.gitignore`](dot-gitignore.md) — Git exclusions.
- [`.env.example` and `.env`](environment-files.md) — runtime configuration and secrets.
- [`.github/workflows/test.yml`](github-workflow-test-yml.md) — CI workflow.
- [`README.md`](root-readme-md.md) — public project guide.

## Generated and external folders

`node_modules/` is generated dependency code, `.git/` is Git's internal database, and `docs/` is this explanatory material. They are not runtime source files to walk through recursively.
