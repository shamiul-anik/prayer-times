# PWA Implementation Guide

This document outlines the Progressive Web App (PWA) implementation used in this project. It serves as a guide for adding similar PWA functionality to other projects.

## Overview

The PWA implementation consists of four main components:

1.  **Manifest**: `public/manifest.json` describes the app (name, icons, theme).
2.  **Service Worker**: `public/sw.js` handles caching, offline support, and background tasks.
3.  **Registration Logic**: `public/pwa.js` registers the service worker and handles install prompts/notifications.
4.  **HTML Integration**: `public/index.html` links the manifest and scripts.

## 1. Web App Manifest (`public/manifest.json`)

The manifest file tells the browser about your web application and how it should behave when installed on the user's desktop or mobile device.

**Key Properties used:**

- `name` & `short_name`: App display names.
- `description`: Used by app stores and install prompts.
- `start_url`: `/` (Ensures app opens at root).
- `display`: `standalone` (Removes browser UI).
- `theme_color` & `background_color`: Matches app design.
- `icons`: Array of icons (including `maskable` for Android 13+).
- `shortcuts`: Quick actions on homescreen context menu.

**Example Snippet:**

```json
{
  "name": "Prayer Times",
  "start_url": "/",
  "display": "standalone",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 2. Service Worker (`public/sw.js`)

The service worker acts as a network proxy. This project uses a custom implementation without build tools.

**Features:**

- **Pre-caching**: Caches core assets (`index.html`, `style.css`, etc.) during the `install` phase.
- **Cache Strategy**:
  - **Network-First**: For `/api/` requests (tries network, falls back to cache).
  - **Cache-First**: For static assets (images, scripts, CSS).
- **Clean Up**: Removes old caches during `activate` phase.
- **Background Sync**: Listens for 'sync' events to retry failed requests.
- **Push Notifications**: Handles `showNotification` for local alerts.

## 3. PWA Logic (`public/pwa.js`)

This script manages the PWA lifecycle from the "main thread" (the page itself).

**Key Responsibilities:**

- **Registration**: Registers `sw.js` on load.
- **Install Prompt**:
  - Captures `beforeinstallprompt` event.
  - Prevents default browser banner.
  - Shows a custom "Install App" UI (`createInstallBanner`).
- **Updates**: Checks for service worker updates independently every hour.
- **Permissions**: Requests Notification permission.
- **Bridge**: Exposes `window.pwaInstance` so other scripts (like `script.js`) can trigger notifications via the service worker.

## 4. HTML Integration (`public/index.html`)

Add the following to the `<head>` of your entry HTML file:

```html
<!-- PWA Meta Tags -->
<meta name="theme-color" content="#2d3561" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>

<!-- Manifest Link -->
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

<!-- Scripts -->
<script src="script.js"></script>
<script src="pwa.js"></script>
```

## 5. Icon Generation

To avoid manually creating dozens of icon sizes, this project uses a script: `generate-icons.js`.

- **Tool**: Node.js script using `canvas` library.
- **Usage**: `node generate-icons.js`
- **Output**: Generates all required sizes (72x72 up to 512x512) and maskable variants in `public/icons/`.

## Checklist for New Projects

To add PWA features to a new project:

1.  [ ] Copy `public/manifest.json` and customize metadata.
2.  [ ] Copy `public/sw.js` and update `STATIC_ASSETS` list.
3.  [ ] Copy `public/pwa.js` (logic is mostly generic).
4.  [ ] Add meta tags and script links to `index.html`.
5.  [ ] Ensure your server serves `sw.js` from the root (or `start_url` path) to handle scope correctly.
6.  [ ] Generate icons using the provided script or a tool like [RealFaviconGenerator](https://realfavicongenerator.net/).
