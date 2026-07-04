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
