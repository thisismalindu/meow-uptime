# `server.js` — process entry point

This tiny file turns the assembled application into a running network server and starts background monitoring.

## Complete source

```js
const { app } = require("./app");
const { startMonitor } = require("./monitor");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
  startMonitor();
});
```

## Line-by-line walkthrough

- **Line 1:** Import the configured Express app from `app.js`.
- **Line 2:** Import the monitor's startup function.
- **Line 4:** Use the deployment-provided port when present, or number 3000 as a fallback. Environment variable values are strings, which Node's `listen` accepts as a port-like value here.
- **Line 6:** Ask Express/Node to listen for HTTP connections. The callback runs after listening begins.
- **Line 7:** Log the port so an operator can see startup succeeded.
- **Line 8:** Start the immediate monitor pass and recurring interval only after the server is listening.

## Why is it separate?

Tests import `app.js` without automatically opening a permanent port or starting a never-ending interval. Only running this entry point creates those process-level side effects.

