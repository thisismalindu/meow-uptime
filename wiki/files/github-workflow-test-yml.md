# `.github/workflows/test.yml` — continuous integration

GitHub Actions reads YAML workflow files from this special directory. Indentation defines nesting, so spaces matter.

## Complete source

```yaml
name: Test

on:
  push:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: 22

      - run: npm ci
      - run: npm test
```

## Line-by-line walkthrough

- **Line 1:** Give the workflow the display name “Test.”
- **Lines 3–4:** Trigger it for pushes to any branch because no branch filter is specified.
- **Line 6:** Begin the map of jobs that can run.
- **Line 7:** Define one job with the internal ID `test`.
- **Line 8:** Give the job a fresh GitHub-hosted Ubuntu environment.
- **Line 10:** Begin the ordered list of steps.
- **Line 11:** Use GitHub's checkout action to place repository files in the runner. `@v7` selects that major action version.
- **Line 13:** Use the Node setup action.
- **Lines 14–15:** Configure it to install/use Node 22, matching Docker and dependency engine requirements.
- **Line 17:** Install exact dependencies from `package-lock.json`. `npm ci` also checks that it agrees with `package.json`.
- **Line 18:** Run the `test` script from `package.json`.

There is no deployment job, database service, environment secret, pull-request trigger, caching configuration, linting, or coverage step. CI presently proves only that the current automated tests pass after a clean npm install.

