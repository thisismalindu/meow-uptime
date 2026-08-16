# `public/app.js` — browser behavior

This file runs in every visitor's browser. It reads the form, talks to the backend API, escapes untrusted text, renders site cards, and polls for fresh data.

## Complete source

```js
const form = document.getElementById("site-form");
const message = document.getElementById("message");
const sites = document.getElementById("sites");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

async function loadSites() {
  const response = await fetch("/api/sites");
  if (!response.ok) {
    throw new Error("Could not load sites");
  }

  const siteList = await response.json();
  if (siteList.length === 0) {
    sites.textContent = "No sites yet.";
    return;
  }

  sites.innerHTML = siteList.map((site) => {
    const status = site.status || "UNKNOWN";
    const checked = site.last_checked
      ? new Date(site.last_checked).toLocaleString()
      : "-";
    const latency = site.latency_ms === null ? "-" : `${site.latency_ms} ms`;
    const incident = site.incident ? '<p class="incident">INCIDENT</p>' : "";

    return `<article class="site">
      <strong>${escapeHtml(site.url)}</strong>
      <p>Status: <span class="${status.toLowerCase()}">${status}</span></p>
      <p>Response: ${latency}</p>
      <p>Last checked: ${checked}</p>
      <p>Failures: ${site.failure_count}</p>
      ${incident}
    </article>`;
  }).join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  try {
    const response = await fetch("/api/sites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: form.url.value })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Could not save site");
    }

    form.reset();
    message.textContent = "Site added.";
    await loadSites();
  } catch (error) {
    message.textContent = error.message;
  }
});

loadSites().catch((error) => {
  message.textContent = error.message;
});

setInterval(() => loadSites().catch(() => {}), 10000);
```

## Line-by-line walkthrough

- **Lines 1–3:** Find the three HTML elements by ID and keep references. `const` prevents rebinding the variables; the elements themselves can still change.
- **Line 5:** Define a helper that makes arbitrary values safe for insertion as HTML text.
- **Lines 6–12:** Convert the value to a string, find any of five dangerous HTML characters with a regular expression, and replace each using the lookup object. This stops a stored URL from injecting tags or attributes into `innerHTML`.
- **Line 15:** Define the asynchronous list-loading operation.
- **Line 16:** Request the API using a relative path. The browser automatically uses the current host and defaults to GET.
- **Lines 17–19:** Treat non-2xx HTTP responses as errors. `fetch` does not throw merely because a server replied 500, so checking `ok` is necessary.
- **Line 21:** Parse the JSON response body into an array of site objects.
- **Lines 22–25:** If the array is empty, display plain text and stop before rendering cards.
- **Line 27:** Transform every site object into an HTML string with `map`, then eventually assign the combined result to the container.
- **Line 28:** Fall back to `UNKNOWN` if status is empty or missing.
- **Lines 29–31:** Convert a stored timestamp to the visitor's local date/time, or display a dash when never checked.
- **Line 32:** Show a dash only when latency is exactly `null`; otherwise append `ms`. A missing `undefined` value would display `undefined ms`, a small robustness gap.
- **Line 33:** Conditionally create a red incident paragraph or an empty string.
- **Lines 35–42:** Build one semantic `article`. The URL is escaped. The lowercase status becomes a CSS class such as `up`; other displayed fields currently rely on trusted server/database values. `${...}` is template-literal interpolation.
- **Line 43:** Join the array without commas and replace all existing contents of the sites section.
- **Line 46:** Register an asynchronous callback for form submission.
- **Line 47:** Stop the browser's default full-page form submission.
- **Line 48:** Clear any previous success/error message.
- **Lines 50–55:** POST JSON to the API. The content-type tells Express how to parse it; `JSON.stringify` turns the object into request text; `form.url.value` reads the named input.
- **Lines 57–60:** For a non-success response, parse the API's JSON and throw its error message, with a fallback.
- **Line 62:** Clear all form fields after success.
- **Line 63:** Show confirmation as plain text.
- **Line 64:** Immediately reload saved sites. The new site's state can still be `UNKNOWN` until a monitor pass.
- **Lines 65–67:** Catch network/API/parsing errors and display their message.
- **Lines 70–72:** Load once when the script starts and surface an initial-load failure.
- **Line 74:** Refresh every 10 seconds. Failures from later background refreshes are deliberately ignored with an empty catch callback, which can leave stale data visible.

## Security note

Escaping the URL is important because this file uses `innerHTML`. Building elements with `document.createElement` and assigning all user data through `textContent` is another safe approach and can reduce how much manual escaping is needed.

