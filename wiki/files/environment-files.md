# `.env.example` and `.env` — runtime configuration

The example file safely documents required variable names. The real `.env` holds machine-specific values and may contain a privileged secret.

## Complete `.env.example` source

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-side-key
PORT=3000
```

## Line-by-line walkthrough

- **Line 1:** Placeholder for the Supabase project base URL used by `createClient`.
- **Line 2:** Placeholder for a server-only credential. Never expose its real value in `public/`, logs, Git, screenshots, or documentation.
- **Line 3:** Default local HTTP port.

## The real `.env`

The repository has a local three-line `.env` with the same configuration role. Its values are intentionally **not reproduced** here because documentation is likely to be committed. Treat every real secret as sensitive even if the repository is private.

`npm start` loads this file through Node's `--env-file=.env` option. Docker's default command does not, so `docker run` uses `--env-file .env` to inject the values.

Environment files generally use `NAME=value`, one assignment per line. They are configuration, not JavaScript, and values are exposed through Node's `process.env.NAME`.

