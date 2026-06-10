const api = typeof browser !== "undefined" ? browser : chrome;

const btn   = document.getElementById("toggle");
const label = document.getElementById("label");
const pulse = document.getElementById("pulse");
const err   = document.getElementById("error");

const ERROR_HINTS = {
  "tor_unreachable":                   "Tor unreachable — is Tor running on port 9050?",
  "NS_ERROR_PROXY_CONNECTION_REFUSED": "Connection refused — is Tor running?",
  "NS_ERROR_UNKNOWN_PROXY_HOST":       "Host not found — check the address.",
  "NS_ERROR_NET_TIMEOUT":              "Timed out — Tor may be unreachable.",
};

function setState(on) {
  btn.classList.toggle("on", on);
  btn.disabled = false;
  pulse.classList.toggle("active", on);
  label.textContent = on ? "ACTIVE" : "INACTIVE";
  label.classList.toggle("on", on);
  if (!on) clearError();
}

function setChecking() {
  btn.disabled = true;
  label.textContent = "CHECKING...";
  label.classList.remove("on");
  pulse.classList.remove("active");
  clearError();
}

function showError(msg) {
  err.textContent = ERROR_HINTS[msg] ?? `Error: ${msg}`;
  err.hidden = false;
}

function clearError() {
  err.hidden = true;
  err.textContent = "";
}

// sync initial state
api.storage.local.get("enabled", ({ enabled }) => setState(!!enabled));

btn.addEventListener("click", () => {
  api.storage.local.get("enabled", ({ enabled }) => {
    const next = !enabled;
    if (next) {
      setChecking();
    } else {
      setState(false);
    }
    api.runtime.sendMessage(next ? "enable" : "disable");
  });
});

api.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "status") {
    if (msg.message === "enabled")  setState(true);
    if (msg.message === "disabled") setState(false);
  }
  if (msg?.type === "error") {
    setState(false);
    showError(msg.message);
  }
});
document.querySelectorAll("a[data-url]").forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    api.tabs.create({ url: a.dataset.url }).then(() => window.close());
  });
});