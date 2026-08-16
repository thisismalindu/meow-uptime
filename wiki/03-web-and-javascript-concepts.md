# Web and JavaScript concepts used here

## Client and server

The **client** is the browser. It displays the page and responds to clicks. The **server** is the Node process. It owns secrets, applies backend rules, accesses the database, and serves responses.

Frontend code is public by definition: a visitor can download it. Backend code normally stays on the server.

## HTTP requests and responses

HTTP is the language browsers and servers use to communicate. A request has a method and path:

- `GET /api/sites` asks to read sites.
- `POST /api/sites` asks to create a site.
- `GET /health` checks whether the web process answers.

A response includes a status code and usually a body. Examples used here are `200` for success, `400` for invalid input, `500` for an unexpected server/database failure, and `503` when the database is not configured.

## JSON

JSON is a text format for structured data. A browser sends this when adding a site:

```json
{ "url": "https://example.com" }
```

Express's `express.json()` middleware converts that request text into the JavaScript object available as `request.body`.

## Modules and `require`

The project uses Node's **CommonJS** module system.

```js
const express = require("express");
module.exports = { app };
```

`require` imports something another file or package exported. `module.exports` chooses what the current file exposes. Modules keep responsibilities separated and make helper functions testable.

## Functions, callbacks, and arrow functions

A function groups reusable behavior. Express routes receive callback functions. Express later calls them with a request and response:

```js
app.get("/health", (request, response) => {
  response.json({ status: "ok" });
});
```

The `=>` syntax creates an arrow function. It is just a compact JavaScript function syntax.

## Promises, `async`, and `await`

Network and database operations take time. JavaScript represents a future result with a **Promise**. An `async` function may use `await` to pause that function until the promise settles without freezing the entire Node process or browser.

`try/catch` handles failures from awaited work. `finally` runs cleanup whether work succeeds or fails.

## The DOM

The Document Object Model, or DOM, is the browser's JavaScript representation of HTML. `document.getElementById("sites")` finds one page element. Assigning its `textContent` or `innerHTML` changes what the user sees.

`textContent` treats content as text. `innerHTML` interprets tags. Because the site list uses `innerHTML`, user-controlled URLs are passed through `escapeHtml` first to prevent them from becoming executable HTML.

## Middleware

Express middleware processes requests before a final route handler:

- `express.json()` parses JSON request bodies.
- `express.static("public")` serves browser assets.

Order matters: middleware is registered from top to bottom.

## Environment variables

`process.env` is a Node-provided object containing settings for the running process. It is not available in ordinary browser JavaScript. Reading secrets from `process.env` keeps them out of the public bundle.

## Timers

`setInterval(callback, milliseconds)` repeatedly schedules a callback. The frontend polls for display updates every 10,000 ms. The server monitor checks sites every 60,000 ms.

Timers are process-local and not durable. Restarting the process restarts their schedule, and multiple server replicas would each create their own timer.

