# `public/index.html` — page structure

HTML describes the content and semantic structure sent to the browser. Express serves this file automatically for `/`.

## Complete source

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Meow Uptime</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <main>
      <h1>Meow Uptime</h1>
      <p>A tiny uptime monitor. Status refreshes every 10 seconds.</p>

      <form id="site-form">
        <label for="url">Website URL</label>
        <input id="url" name="url" type="url" placeholder="https://example.com" required>
        <button type="submit">Add</button>
      </form>

      <p id="message"></p>
      <h2>Monitored sites</h2>
      <section id="sites">No sites yet.</section>
    </main>
    <script src="/app.js"></script>
  </body>
</html>
```

## Line-by-line walkthrough

- **Line 1:** Declare modern HTML5 so the browser uses standards mode.
- **Line 2:** Open the document and state that its language is English, helping accessibility tools and search engines.
- **Line 3:** Start metadata that is not displayed as page content.
- **Line 4:** Use UTF-8 so text characters are decoded consistently.
- **Line 5:** Make layout width match a mobile device and start at normal zoom.
- **Line 6:** Set the browser tab title.
- **Line 7:** Ask the browser for `/style.css`. Express maps that URL to `public/style.css`.
- **Line 8:** Close the metadata section.
- **Lines 9–10:** Open visible page content and a semantic `main` region.
- **Line 11:** Add the top-level page heading.
- **Line 12:** Explain the browser's display-refresh interval; this is different from the server's 60-second check interval.
- **Line 14:** Open a form and give it the ID used by browser JavaScript.
- **Line 15:** Add an accessible label associated with the input whose ID is `url`.
- **Line 16:** Add the URL field. `name="url"` also exposes it as `form.url`; `type="url"` gives browser validation; the placeholder is a hint; `required` prevents empty submission.
- **Line 17:** Add a submit button, which triggers the form's submit event.
- **Line 18:** Close the form.
- **Line 20:** Reserve an initially empty paragraph for success and error messages.
- **Line 21:** Add a second-level heading for the results.
- **Line 22:** Reserve the site-list container and show fallback text before JavaScript loads data.
- **Line 23:** Close the main content region.
- **Line 24:** Load browser `public/app.js`. It is placed after the HTML elements so its initial lookups can find them.
- **Lines 25–26:** Close the body and document.

