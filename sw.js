/* BP Tracker service worker.
   Bump CACHE_NAME on every release so old assets are evicted on activate. */

const CACHE_NAME = 'bp-tracker-v4';

// Same-origin app shell. Cached with addAll: if any of these fail, install fails,
// which is what we want -- a half-cached shell is worse than no shell.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg'
];

// Third-party runtime deps. Fetched no-cors, so the responses are opaque:
// they can be cached and replayed, but their status is not readable.
// Best-effort -- a CDN hiccup must not fail the whole install.
const VENDOR = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await Promise.all(VENDOR.map(async (url) => {
      try {
        const res = await fetch(url, { mode: 'no-cors', cache: 'reload' });
        await cache.put(url, res);
      } catch (err) {
        console.warn('[sw] vendor precache skipped:', url, err);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  // Page loads: network first so a deployed update is picked up immediately,
  // falling back to the cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        const cached = await caches.match('./index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache first, then network, caching what comes back.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (err) {
      return Response.error();
    }
  })());
});
