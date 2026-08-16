# `.gitignore` — Git exclusions

Git uses this file to avoid showing generated, local, or secret files as source changes.

## Complete source

```gitignore
node_modules/
.env
npm-debug.log*
```

## Line-by-line walkthrough

- **Line 1:** Ignore the dependency installation folder. It can be recreated from package metadata and is large/platform-dependent.
- **Line 2:** Ignore local environment variables, especially the Supabase secret key.
- **Line 3:** Ignore any npm debug log whose name starts with `npm-debug.log`; `*` is a wildcard.

`.env.example` is not ignored because it contains placeholders and should be shared. Ignore rules do not remove a file that was already committed; accidental secret commits require key rotation and history remediation.

