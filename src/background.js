const api = typeof browser !== "undefined" ? browser : chrome;
const IS_FIREFOX = typeof browser !== "undefined";
const PROXY = { host: "127.0.0.1", port: 9050 };

async function checkTor() {
  return new Promise((resolve) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => { controller.abort(); resolve(false); }, 5000);

    fetch("https://check.torproject.org/api/ip", { signal: controller.signal })
      .then(r => r.json())
      .then(data => { clearTimeout(timeout); resolve(data.IsTor === true); })
      .catch(() => { clearTimeout(timeout); resolve(false); });
  });
}

function applyProxy() {
  const config = IS_FIREFOX
    ? { proxyType: "manual", socks: `${PROXY.host}:${PROXY.port}`, socksVersion: 5 }
    : { mode: "fixed_servers", rules: { singleProxy: { scheme: "socks5", host: PROXY.host, port: PROXY.port } } };
  api.proxy.settings.set({ value: config, scope: "regular" });
}

function clearProxy() {
  api.proxy.settings.clear({ scope: "regular" });
}

function sendMessage(msg) {
  api.runtime.sendMessage(msg).catch(() => {});
}

async function enable() {
  applyProxy();
  sendMessage({ type: "status", message: "checking" });
  const ok = await checkTor();
  if (!ok) {
    clearProxy();
    api.storage.local.set({ enabled: false });
    sendMessage({ type: "error", message: "tor_unreachable" });
    return;
  }
  api.storage.local.set({ enabled: true });
  sendMessage({ type: "status", message: "enabled" });
}

function disable() {
  clearProxy();
  api.storage.local.set({ enabled: false });
  sendMessage({ type: "status", message: "disabled" });
}

api.storage.local.get("enabled", ({ enabled }) => {
  if (enabled) enable();
});

// Firefox only — these APIs don't exist in Chrome MV3 service workers
if (IS_FIREFOX) {
  api.proxy.onError.addListener((error) => {
    clearProxy();
    api.storage.local.set({ enabled: false });
    sendMessage({ type: "error", message: error.message });
  });

  api.webRequest.onErrorOccurred.addListener(
    (details) => {
      const proxyErrors = [
        "NS_ERROR_PROXY_CONNECTION_REFUSED",
        "NS_ERROR_UNKNOWN_PROXY_HOST",
        "NS_ERROR_NET_TIMEOUT",
      ];
      if (proxyErrors.includes(details.error)) {
        api.storage.local.get("enabled", ({ enabled }) => {
          if (!enabled) return;
          clearProxy();
          api.storage.local.set({ enabled: false });
          sendMessage({ type: "error", message: details.error });
        });
      }
    },
    { urls: ["<all_urls>"] }
  );
}

api.runtime.onMessage.addListener((msg) => {
  if (msg === "enable")  enable();
  if (msg === "disable") disable();
});