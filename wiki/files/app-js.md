# `app.js` — backend application

This file assembles the Express application. It creates the database client, installs middleware, defines two helper functions, registers API routes, and exports pieces used by the server, monitor, and tests. It deliberately does **not** open a network port; `server.js` owns that side effect.

## Complete source

```js
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
let supabase = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY
    );
  } catch (error) {
    console.log(`Supabase setup error: ${error.message}`);
  }
}

app.use(express.json());
app.use(express.static("public"));

function isValidUrl(url) {
  return typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"));
}

function getFailureState(failureCount, isHealthy) {
  if (isHealthy) {
    return { failure_count: 0, incident: false };
  }

  const failures = Number(failureCount || 0) + 1;
  return { failure_count: failures, incident: failures >= 3 };
}

app.get("/api/sites", async (request, response) => {
  if (!supabase) {
    return response.status(503).json({ error: "Supabase is not configured" });
  }

  try {
    const result = await supabase
      .from("sites")
      .select("*")
      .order("created_at", { ascending: false });

    if (result.error) {
      console.log(result.error.message);
      return response.status(500).json({ error: "Could not load sites" });
    }

    response.json(result.data);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ error: "Could not load sites" });
  }
});

app.post("/api/sites", async (request, response) => {
  const url = request.body && request.body.url;

  if (!isValidUrl(url)) {
    return response.status(400).json({ error: "URL must start with http:// or https://" });
  }

  if (!supabase) {
    return response.status(503).json({ error: "Supabase is not configured" });
  }

  try {
    const result = await supabase.from("sites").insert({ url });

    if (result.error) {
      console.log(result.error.message);
      return response.status(500).json({ error: "Could not save site" });
    }

    response.json({ ok: true });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ error: "Could not save site" });
  }
});

app.get("/health", (request, response) => {
  response.json({ status: "ok" });
});

module.exports = { app, supabase, isValidUrl, getFailureState };
```

## Line-by-line walkthrough

- **Lines 1–2:** Load Express and extract Supabase's `createClient` function. Package imports have no `./` because they come from `node_modules`.
- **Line 4:** Calling `express()` creates the application object on which middleware and routes are registered.
- **Line 5:** Start with no database client. `let` is used because the value may be replaced; `null` explicitly means “not configured.”
- **Line 7:** Require both environment values. `&&` means both sides must be truthy.
- **Lines 8–14:** Try to construct a reusable Supabase client. The multiline call passes the project URL first and secret key second. If client construction throws, log its message and leave `supabase` as `null` so importing the app does not crash tests.
- **Line 18:** Install JSON body parsing. Without this, the POST route would not receive a parsed `request.body`.
- **Line 19:** Serve files from `public`. This is why `/` loads `public/index.html` and `/app.js` loads the browser script.
- **Lines 21–24:** Define URL validation. It first requires a string, then accepts only a lowercase `http://` or `https://` prefix. Parentheses group the two protocol alternatives. This is deliberately simple, not comprehensive URL or SSRF protection.
- **Line 26:** Define the failure-state calculation independently of database code.
- **Lines 27–29:** Any healthy check immediately resets consecutive failures and clears the incident.
- **Line 31:** Treat a missing/falsy count as zero, convert it to a number, then add one. This guards against numeric strings from data sources, although bad nonnumeric strings would become `NaN`.
- **Line 32:** Return property names matching database columns. `failures >= 3` evaluates to a boolean.
- **Line 35:** Register an asynchronous GET handler. `request` is unused but kept because Express passes it; `response` builds the reply.
- **Lines 36–38:** Fail early with HTTP 503 if configuration did not create a Supabase client. `return` prevents the handler continuing.
- **Lines 40–45:** Query every column from `sites` and sort newest rows first. `await` waits for the remote database response.
- **Lines 47–50:** Supabase query errors are returned in `result.error`. Log the detailed message, but send the browser a generic HTTP 500 response.
- **Line 52:** On success, serialize `result.data` as JSON. Express defaults this successful response to status 200.
- **Lines 53–56:** Catch errors that actually throw, such as some network/runtime failures, and return the same safe public error.
- **Line 59:** Register the site-creation POST endpoint.
- **Line 60:** Safely read `body.url`; the `&&` avoids accessing `.url` if no body exists.
- **Lines 62–64:** Reject invalid input with HTTP 400, meaning the client sent a bad request.
- **Lines 66–68:** Reject otherwise valid input with 503 if the database is unavailable through missing configuration.
- **Lines 70–71:** Insert an object whose `url` key maps to the table's `url` column. Other columns receive SQL defaults.
- **Lines 73–76:** Handle a Supabase-reported insert error with a logged detail and generic HTTP 500 reply.
- **Line 78:** Report success. The API returns no inserted row, only a confirmation object.
- **Lines 79–82:** Catch thrown failures around the insert.
- **Lines 85–87:** Define a health endpoint. It reports that the Express process answers; it does not query Supabase.
- **Line 88:** Export the app, the client value, and helpers. `server.js` uses `app`, `monitor.js` uses `supabase` and `getFailureState`, and tests use the app and helpers.

## Why split this from `server.js`?

Importing `app.js` does not call `listen`, so tests can choose a temporary port. This separation between “build the application” and “start the process” is a common testability pattern.
