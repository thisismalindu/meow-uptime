# `package.json` — Node project manifest

This JSON file names the project, defines commands, and lists direct runtime dependencies. JSON requires double quotes and does not allow comments or trailing commas.

## Complete source

```json
{
  "name": "meow-uptime",
  "version": "0.1.0",
  "description": "A tiny uptime monitor for learning monitoring and reliability",
  "main": "server.js",
  "scripts": {
    "start": "node --env-file=.env server.js",
    "test": "node --test"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.112.3",
    "express": "^4.21.2"
  }
}
```

## Line-by-line walkthrough

- **Line 1:** Open the top-level JSON object.
- **Line 2:** Give npm the lowercase package name.
- **Line 3:** Use semantic version `major.minor.patch`: this is early version 0.1.0.
- **Line 4:** Provide a human-readable package description.
- **Line 5:** Declare the conventional package entry file. The actual `npm start` command is controlled separately below.
- **Line 6:** Open the named command shortcuts.
- **Line 7:** `npm start` launches Node, asks Node to load variables from `.env`, and executes `server.js`. `--env-file` needs a sufficiently recent Node version.
- **Line 8:** `npm test` invokes Node's built-in test discovery/runner.
- **Line 9:** Close the scripts object. The comma says more top-level properties follow.
- **Line 10:** Open runtime dependency declarations.
- **Line 11:** Require the Supabase JavaScript client. The caret allows compatible releases from 2.112.3 up to, but not including, 3.0.0 when resolving a fresh lock.
- **Line 12:** Require Express 4. The caret allows 4.21.2 and later compatible 4.x releases.
- **Lines 13–14:** Close the dependency and top-level objects.

Exact installed versions come from the chosen lockfile, not merely these ranges. No `devDependencies` exist because the tests use Node's standard library.

