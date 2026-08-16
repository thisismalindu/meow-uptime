# `Dockerfile` — container image recipe

A Dockerfile is a sequence of image-building instructions. Each major instruction creates a cacheable layer.

## Complete source

```dockerfile
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

## Line-by-line walkthrough

- **Line 1:** Begin with the official slim Node 22 Linux image. It already contains Node and npm while omitting many extra OS tools.
- **Line 3:** Create/select `/app` inside the image. Later relative commands run there.
- **Line 5:** Copy files matching `package*.json`—normally `package.json` and `package-lock.json`—into the working directory. Copying metadata first improves build caching.
- **Line 6:** Install exactly the locked packages. `--omit=dev` excludes development-only dependencies, though this project currently declares none.
- **Line 8:** Copy the rest of the allowed build context. `.dockerignore` removes secrets, Git history, host dependencies, and npm debug logs first.
- **Line 10:** Document that the application expects port 3000. This does not publish the port by itself.
- **Line 11:** Define the default container command in JSON/exec form, which avoids an extra shell. It runs `server.js` directly rather than `npm start`, so the deployment must inject environment variables itself.

Using Node 22 also satisfies the locked Supabase packages' declared engine requirement.

