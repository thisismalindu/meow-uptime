# `monitor.js` — background website checker

This server-side module checks stored URLs and persists their latest state. It contains one-site logic, all-sites orchestration, and the recurring timer.

## Complete source

```js
const { supabase, getFailureState } = require("./app");

async function saveCheck(site, update) {
  if (!supabase) {
    return;
  }

  const result = await supabase.from("sites").update(update).eq("id", site.id);
  if (result.error) {
    console.log(result.error.message);
  }
}

async function checkSite(site) {
  console.log(`checking ${site.url}`);
  const started = Date.now();
  let update;

  try {
    const options = typeof AbortSignal.timeout === "function"
      ? { signal: AbortSignal.timeout(8000) }
      : {};
    const response = await fetch(site.url, options);
    const healthy = response.ok;
    const state = getFailureState(site.failure_count, healthy);

    update = {
      status: healthy ? "UP" : "DOWN",
      status_code: response.status,
      latency_ms: Date.now() - started,
      last_checked: new Date().toISOString(),
      ...state
    };
  } catch (error) {
    const state = getFailureState(site.failure_count, false);
    update = {
      status: "DOWN",
      status_code: null,
      latency_ms: null,
      last_checked: new Date().toISOString(),
      ...state
    };
  }

  try {
    await saveCheck(site, update);
  } catch (error) {
    console.log(`Could not update ${site.url}: ${error.message}`);
  }

  if (update.status === "UP") {
    console.log(`UP ${update.status_code} ${update.latency_ms}ms`);
  } else {
    console.log(`DOWN ${site.url}`);
  }
  return update;
}

async function checkAllSites() {
  if (!supabase) {
    console.log("monitor skipped: Supabase is not configured");
    return;
  }

  const result = await supabase.from("sites").select("*");
  if (result.error) {
    console.log(result.error.message);
    return;
  }

  for (const site of result.data) {
    await checkSite(site);
  }
}

function startMonitor() {
  checkAllSites().catch((error) => console.log(error.message));
  return setInterval(() => {
    checkAllSites().catch((error) => console.log(error.message));
  }, 60000);
}

module.exports = { checkSite, checkAllSites, startMonitor };
```

## Line-by-line walkthrough

- **Line 1:** Import the already-created database client and pure state helper from backend `app.js`.
- **Line 3:** `saveCheck` accepts the original site row and an object of new column values.
- **Lines 4–6:** Quietly do nothing without a client. This supports configurations and tests where Supabase is absent.
- **Line 8:** Update `sites`, but only the row whose `id` equals this site's ID. The `.eq` filter is vital; without it, every row could be updated.
- **Lines 9–11:** Supabase may return an error instead of throwing it, so log that result explicitly.
- **Lines 14–17:** Begin a single check, log its URL, record milliseconds since the Unix epoch, and declare an `update` variable that both success and failure paths will fill.
- **Lines 19–22:** Feature-detect `AbortSignal.timeout`. On supported Node versions, create a signal that aborts after 8,000 ms; otherwise pass an empty options object. Node 22 supports this path.
- **Line 23:** Use Node's global `fetch` to make an outbound HTTP request. `await` pauses this function until headers arrive or an error is thrown.
- **Line 24:** `response.ok` is true for HTTP 200–299.
- **Line 25:** Calculate the new consecutive-failure state using the row's current count.
- **Lines 27–33:** Build the database update. The ternary operator picks `UP` or `DOWN`; status and latency come from the response; the date is stored as ISO text; `...state` spreads in `failure_count` and `incident`.
- **Line 34:** Catch network failures, timeouts, DNS errors, certificate errors, and other thrown fetch problems. The `error` variable is not used here.
- **Lines 35–42:** Count the attempt as unhealthy. Use `null` for status code and latency because there was no usable HTTP response. Still record when the attempt happened.
- **Lines 45–49:** Try to save the prepared object. A thrown database failure is caught and logged so one failed save does not reject `checkSite`.
- **Lines 51–55:** Write a concise success line with code/latency, or a down line with the URL.
- **Line 56:** Return the computed update. This is convenient for tests and callers, even though `checkAllSites` ignores the return value.
- **Line 59:** Define one pass over every stored site.
- **Lines 60–63:** Skip safely and explain why if Supabase is not configured.
- **Line 65:** Select every site and every column.
- **Lines 66–69:** Stop this pass if Supabase reports a read error.
- **Lines 71–73:** Loop through the rows and await each one. This is sequential: the next site starts only after the previous check and save finish.
- **Line 76:** Define monitor startup as a normal function because it schedules async work but does not itself need to be awaited.
- **Line 77:** Run one pass immediately. `.catch` prevents an unhandled rejected promise.
- **Lines 78–80:** Schedule another pass every 60,000 milliseconds. The returned interval handle could be used to cancel the timer with `clearInterval`.
- **Line 83:** Export all three functions for reuse and testing.

## Design tradeoffs

Keeping the timer beside the checking code is compact. It is not a durable job scheduler: restarts reset it, and multiple app replicas make duplicate checks. See [deployment](../05-testing-and-deployment.md).

