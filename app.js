const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
let supabase = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } catch (error) {
    console.log(`Supabase setup error: ${error.message}`);
  }
}

app.use(express.json());
app.use(express.static("public"));

function isValidUrl(url) {
  return typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"));
}

function getFailureState(failureCount, isHealthy) {
  if (isHealthy) {
    return { failure_count: 0, incident: false };
  }

  const failures = Number(failureCount || 0) + 1;
  return { failure_count: failures, incident: failures >= 3 };
}

app.get("/api/sites", async (request, response) => {
  if (!supabase) {
    return response.status(503).json({ error: "Supabase is not configured" });
  }

  try {
    const result = await supabase
      .from("sites")
      .select("*")
      .order("created_at", { ascending: false });

    if (result.error) {
      console.log(result.error.message);
      return response.status(500).json({ error: "Could not load sites" });
    }

    response.json(result.data);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ error: "Could not load sites" });
  }
});

app.post("/api/sites", async (request, response) => {
  const url = request.body && request.body.url;

  if (!isValidUrl(url)) {
    return response.status(400).json({ error: "URL must start with http:// or https://" });
  }

  if (!supabase) {
    return response.status(503).json({ error: "Supabase is not configured" });
  }

  try {
    const result = await supabase.from("sites").insert({ url });

    if (result.error) {
      console.log(result.error.message);
      return response.status(500).json({ error: "Could not save site" });
    }

    response.json({ ok: true });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ error: "Could not save site" });
  }
});

app.get("/health", (request, response) => {
  response.json({ status: "ok" });
});

module.exports = { app, supabase, isValidUrl, getFailureState };
