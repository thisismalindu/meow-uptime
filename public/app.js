const form = document.getElementById("site-form");
const message = document.getElementById("message");
const sites = document.getElementById("sites");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "Site saving will be added soon.";
});

sites.textContent = "Connect the app to Supabase to monitor sites.";
