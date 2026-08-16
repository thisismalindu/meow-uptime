# `.dockerignore` — Docker build exclusions

Docker sends a **build context** to its builder. This file prevents unnecessary or sensitive local files from entering that context or being copied by `COPY . .`.

## Complete source

```gitignore
node_modules
.git
.env
npm-debug.log
```

## Line-by-line walkthrough

- **Line 1:** Exclude host-installed dependencies. The image installs Linux-compatible packages itself with `npm ci`.
- **Line 2:** Exclude Git's repository database, which the running application does not need.
- **Line 3:** Exclude local secrets. Runtime configuration should be injected with `--env-file` or the hosting platform's secret settings.
- **Line 4:** Exclude npm's error/debug log.

The file does not currently exclude `docs/`, tests, `pnpm-lock.yaml`, or `README.md`, so `COPY . .` includes them. A production image could narrow its copied files further, though correctness matters more than a tiny size difference here.

