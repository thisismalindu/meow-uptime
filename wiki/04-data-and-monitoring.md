# Data and monitoring logic

## The `sites` table

Supabase is a service built around PostgreSQL. A table is similar to a spreadsheet: each row is one monitored site and each column stores one property.

| Column | Type | Meaning |
|---|---|---|
| `id` | `bigint` | Unique, database-generated row identifier. |
| `url` | `text` | Website address to check. Required. |
| `status` | `text` | Latest `UNKNOWN`, `UP`, or `DOWN` label. |
| `status_code` | `integer` | Latest HTTP code, such as 200 or 503; null on network failure. |
| `latency_ms` | `integer` | Approximate request duration in milliseconds; null on network failure. |
| `last_checked` | `timestamptz` | Time of the latest attempt, stored with timezone awareness. |
| `failure_count` | `integer` | Number of consecutive unhealthy checks. |
| `incident` | `boolean` | Whether at least three consecutive checks have failed. |
| `created_at` | `timestamptz` | Time the row was inserted. |

Defaults let the frontend display a newly inserted row before its first check: `UNKNOWN`, zero failures, and no incident.

## The state transition rule

`getFailureState(previousCount, isHealthy)` is a small **pure function**: its output depends only on its arguments and it does not access the database. That makes it easy to test.

```text
Healthy result
    └── failure_count = 0, incident = false

Unhealthy result
    └── failure_count = previous count + 1
        ├── count 1 or 2: incident = false
        └── count 3+:     incident = true
```

An HTTP response outside 200–299 is unhealthy, even if a server did respond. A timeout, DNS error, refused connection, invalid certificate, or other thrown fetch error is also unhealthy.

## What “latency” means here

The app records elapsed wall-clock time around `fetch`. That includes connection setup and waiting for response headers. It is a useful simple signal, but not a laboratory-grade measurement and not necessarily the time required to download the entire response body.

## Why the app stores only the latest check

Each monitor run updates the existing site row. This keeps the schema and UI small. The tradeoff is that history is lost, so the app cannot calculate long-term uptime, draw charts, or reconstruct old incidents. A production design would usually add a `checks` table and perhaps an `incidents` table.

## Timing behavior

The server checks immediately at startup and schedules another whole pass every 60 seconds. The browser independently refreshes its view every 10 seconds. Browser refreshes do not cause checks; they only read the latest stored results.

The monitor checks rows one at a time. If three requests each hit the eight-second timeout, one pass can take around 24 seconds. Also, `setInterval` schedules based on time, not completion; with enough slow sites, passes could overlap. A more advanced implementation would run one controlled batch, wait a delay, and then start the next batch.

## Supabase query shapes

The client uses a fluent, chainable API:

```js
supabase.from("sites").select("*")
```

Read that as “from the `sites` table, select all columns.” Other chains add ordering, insertion, updating, and equality filters. Supabase returns an object containing `data` and `error` rather than always throwing, so the code checks `result.error` explicitly.

