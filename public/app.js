const form = document.getElementById("site-form");
const message = document.getElementById("message");
const sites = document.getElementById("sites");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

async function loadSites() {
  const response = await fetch("/api/sites");
  if (!response.ok) {
    throw new Error("Could not load sites");
  }

  const siteList = await response.json();
  if (siteList.length === 0) {
    sites.textContent = "No sites yet.";
    return;
  }

  sites.innerHTML = siteList.map((site) => {
    const status = site.status || "UNKNOWN";
    const checked = site.last_checked
      ? new Date(site.last_checked).toLocaleString()
      : "-";
    const latency = site.latency_ms === null ? "-" : `${site.latency_ms} ms`;
    const incident = site.incident ? '<p class="incident">INCIDENT</p>' : "";

    return `<article class="site">
      <strong>${escapeHtml(site.url)}</strong>
      <p>Status: <span class="${status.toLowerCase()}">${status}</span></p>
      <p>Response: ${latency}</p>
      <p>Last checked: ${checked}</p>
      <p>Failures: ${site.failure_count}</p>
      ${incident}
    </article>`;
  }).join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  try {
    const response = await fetch("/api/sites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: form.url.value })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Could not save site");
    }

    form.reset();
    message.textContent = "Site added.";
    await loadSites();
  } catch (error) {
    message.textContent = error.message;
  }
});

loadSites().catch((error) => {
  message.textContent = error.message;
});

setInterval(() => loadSites().catch(() => {}), 10000);
