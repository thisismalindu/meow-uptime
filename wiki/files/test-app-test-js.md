# `test/app.test.js` — automated tests

The tests use only Node's built-in modules. They check observable behavior and pure helpers without needing real Supabase credentials.

## Complete source

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { app, isValidUrl, getFailureState } = require("../app");

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

test("GET /health returns ok", async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  } finally {
    await closeServer(server);
  }
});

test("URL validation accepts HTTP URLs only", () => {
  assert.equal(isValidUrl("https://example.com"), true);
  assert.equal(isValidUrl("http://localhost:3000"), true);
  assert.equal(isValidUrl("hello"), false);
});

test("three failures create an incident and health resets it", () => {
  assert.deepEqual(getFailureState(1, false), {
    failure_count: 2,
    incident: false
  });
  assert.deepEqual(getFailureState(2, false), {
    failure_count: 3,
    incident: true
  });
  assert.deepEqual(getFailureState(3, true), {
    failure_count: 0,
    incident: false
  });
});
```

## Line-by-line walkthrough

- **Line 1:** Import the function that declares tests from Node's built-in test runner.
- **Line 2:** Import strict assertions. An assertion fails a test when actual behavior differs from expected behavior.
- **Line 3:** Import the Express app and two exported helpers from the parent directory. `../` means “go up one folder.”
- **Lines 5–7:** Wrap callback-based `server.close` in a Promise so tests can `await` complete shutdown.
- **Line 9:** Declare an asynchronous test and give it a human-readable name.
- **Line 10:** Start the app on port `0`, which asks the operating system for any free temporary port. This does not run `server.js`, so the monitor does not start.
- **Line 12:** Begin a `try` block so cleanup can be guaranteed.
- **Line 13:** Ask the running server which port the OS assigned.
- **Line 14:** Make a real local HTTP request to `/health`.
- **Line 15:** Verify the HTTP status is exactly 200.
- **Line 16:** Parse and deeply compare the response object. `deepEqual` compares object contents, not just identity.
- **Lines 17–19:** `finally` always closes the server, even when an assertion fails, preventing a hanging test process.
- **Line 22:** Declare a synchronous URL-validator test.
- **Lines 23–25:** Check that HTTPS and HTTP examples pass while a string without either accepted prefix fails.
- **Line 28:** Declare the state-transition test.
- **Lines 29–32:** Starting at one failure, another failure produces count two without an incident.
- **Lines 33–36:** Starting at two failures, another reaches the incident threshold of three.
- **Lines 37–40:** A healthy check resets both the count and incident, even after three failures.

## What is not tested yet?

There are no tests for database error paths, the POST route, the monitor's HTTP fetch/timeout behavior, browser DOM rendering, or container startup. Those would require controlled fakes/mocks or integration-test infrastructure.

