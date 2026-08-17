const { supabase, getFailureState } = require("./app");

async function checkSite(site) {
  console.log(`checking ${site.url}`);
  const started = Date.now();
  const response = await fetch(site.url)
  const healthy = response?.ok === true;
  const updates = {
    status: healthy ? "UP" : "DOWN",
    status_code: response?.status ?? null,
    latency_ms: response ? Date.now() - started : null,
    last_checked: new Date().toISOString(),
    ...getFailureState(site.failure_count, healthy)
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from("sites")
        .update(updates)
        .eq("id", site.id);

      if (error) console.log(error.message);
    } catch (error) {
      console.log(`Could not update ${site.url}: ${error.message}`);
    }
  }

  console.log(healthy ? `UP ${updates.status_code} ${updates.latency_ms}ms` : `DOWN ${site.url}`);
  return updates;
}

async function checkAllSites() {
  if (!supabase) {
    console.log("monitor skipped: Supabase is not configured");
    return;
  }

  const { data, error } = await supabase.from("sites").select("*");
  if (error) return console.log(error.message);

  await Promise.all(data.map(checkSite));
}

function runMonitor() {
  checkAllSites().catch((error) => console.log(error.message));
}

function startMonitor() {
  runMonitor();
  return setInterval(runMonitor, 60000);
}

module.exports = { checkSite, checkAllSites, startMonitor };