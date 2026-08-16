# `public/style.css` — page appearance

CSS selects HTML elements and assigns visual properties. This stylesheet intentionally keeps the interface simple and readable.

## Complete source

```css
body {
  background: white;
  color: #111;
  font-family: system-ui;
  margin: 0;
}

main {
  margin: 40px auto;
  max-width: 700px;
  padding: 0 20px;
}

h1 {
  margin-bottom: 4px;
}

form {
  border: 1px solid #ccc;
  margin: 30px 0;
  padding: 16px;
}

input {
  margin: 8px;
  max-width: 420px;
  padding: 8px;
  width: 60%;
}

button {
  padding: 8px 16px;
}

.site {
  border-top: 1px solid #ccc;
  padding: 16px 0;
}

.up {
  color: green;
  font-weight: bold;
}

.down,
.incident {
  color: #c00;
  font-weight: bold;
}

.unknown {
  color: #666;
}
```

## Line-by-line walkthrough

- **Lines 1–6:** Style the whole visible document: white background, nearly black text, the operating system's normal UI font, and no browser-default outer margin.
- **Lines 8–12:** Center `main` horizontally with `auto` side margins, give it 40 px vertical space, limit readable line width to 700 px, and preserve 20 px side padding on narrow screens.
- **Lines 14–16:** Pull the subtitle closer to the main heading by reducing the heading's bottom margin.
- **Lines 18–22:** Give the form a light 1 px border, 30 px vertical separation, and 16 px internal breathing room.
- **Lines 24–29:** Space and size the input. It uses 60% of its containing width but stops growing at 420 px.
- **Lines 31–33:** Make the button's clickable area larger with 8 px vertical and 16 px horizontal padding.
- **Lines 35–38:** Each generated `.site` article gets a separator line and vertical padding.
- **Lines 40–43:** Successful status text is green and bold.
- **Lines 45–49:** The comma combines selectors, so both down statuses and incidents are dark red and bold.
- **Lines 51–53:** Unknown status text is neutral gray.

CSS class names connect this file to `public/app.js`, which generates `up`, `down`, `unknown`, `site`, and `incident` classes.

