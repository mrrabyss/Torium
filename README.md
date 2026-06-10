<div align="center">

<img src="src/icons/icon-96.png" alt="Torium Logo" width="120" height="120" />

# Torium

**Lightweight Firefox extension for enabling/disabling Tor proxy connection.**

[![License: GPL](https://img.shields.io/badge/License-GPL-purple.svg)](LICENSE)
[![Firefox Add-on](https://img.shields.io/badge/Firefox-Add--on-orange?logo=firefox)](../../releases/latest)
[![GitHub Release](https://img.shields.io/github/v/release/mrrabyss/Torium)](../../releases/latest)

[Installation](#installation) · [Usage](#usage) · [Prerequisites](#prerequisites) · [Contributing](#contributing)

</div>

---

## Overview

Torium is a lightweight Firefox extension that gives you one-click control over your Tor proxy connection. No need to dig through browser settings or reconfigure your system manually — simply click the icon in your toolbar to route your traffic through Tor or revert to your normal connection instantly.

---

## Prerequisites

Before installing the extension, make sure the following are set up on your system:

**1. Tor**

Tor must be installed and running locally. It exposes a SOCKS5 proxy on `127.0.0.1:9050` by default.

- **Windows:** Download the [Tor Expert Bundle](https://www.torproject.org/download/tor/) and run `tor.exe`
- **macOS:** `brew install tor && brew services start tor`
- **Linux:** `sudo apt install tor && sudo systemctl start tor`

Verify Tor is running before using the extension.

**2. Torium Extension**

Install the extension from the [Releases](#installation) section below.

---

## Installation

1. Go to the [**Releases**](../../releases/latest) page of this repository.
2. Download the latest `.xpi` file.
3. Open Firefox and navigate to `about:addons`.
4. Click the gear icon and select **Install Add-on From File…**
5. Select the downloaded `.xpi` file and confirm the installation.

The Torium icon will appear in your Firefox toolbar once installed.

---

## Usage

| Action | Result |
|--------|--------|
| Click the toolbar icon | Toggle Tor proxy on or off |
| Green indicator | Tor proxy is **active** — traffic is routed through Tor |
| Grey indicator | Tor proxy is **inactive** — using your normal connection |

When Tor is enabled, Firefox will route all browser traffic through `127.0.0.1:9050` (SOCKS5). Disabling it restores your default network settings.

---

## How It Works

Torium uses the Firefox `proxy` API to programmatically apply or remove SOCKS5 proxy settings. All configuration is handled locally within the extension — no data is sent to any external server.

- **Proxy:** `127.0.0.1:9050` (SOCKS5)
- **DNS over proxy:** Enabled by default to prevent DNS leaks
- **Scope:** Applies to all Firefox traffic while active

---

## Permissions

The extension requests the following permissions:

- `proxy` — Required to configure Firefox's proxy settings
- `storage` — Saves your toggle state across browser sessions
- `notifications` *(optional)* — Displays a brief confirmation when the proxy is toggled

---

## Troubleshooting

**Tor proxy is enabled but pages aren't loading**
Make sure the Tor service is actually running on your machine. Run `curl --socks5 127.0.0.1:9050 https://check.torproject.org` in your terminal to verify connectivity.

**The extension icon is missing from the toolbar**
Go to `about:addons`, confirm Torium is enabled, then right-click your Firefox toolbar and select **Customize Toolbar** to pin the icon.

**I see a "proxy server refusing connections" error**
Tor may not be listening on port 9050. Check your `torrc` configuration or restart the Tor service.

**I see an error "unable to connect to tor" but torrc is running**
Check if you've allowed the extension to run in private windows

---

## Contributing

Contributions, bug reports, and feature requests are welcome. Please open an issue or submit a pull request.

---

## License

Licensed under [GPL v3](LICENSE).

---

<div align="center">
  <sub>Built for privacy. Use responsibly.</sub>
</div>
