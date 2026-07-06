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
