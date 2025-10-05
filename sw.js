/* High-performance Service Worker: cache boosting without visual changes */
/* Versioned cache names */
const SW_VERSION = 'v1.0.0-perf-shield-1';
const STATIC_CACHE = `static-${SW_VERSION}`;
const ASSET_CACHE = `assets-${SW_VERSION}`;
const IMAGE_CACHE = `images-${SW_VERSION}`;

/* Core assets to precache (keep small and critical only) */
const CORE_ASSETS = [
  './',
  './index.html',
  './nav-hexagon-refined-animations.css',
  './metrics-boxes-new.css',
  './cert-smooth-animation.css',
  './wave-animation.css',
  './cswe-highlight.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(CORE_ASSETS.map(u => new Request(u, { cache: 'reload' })));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if available
      if (self.registration.navigationPreload) {
        try { await self.registration.navigationPreload.enable(); } catch (_) {}
      }
      // Clean old caches
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => {
        if (![STATIC_CACHE, ASSET_CACHE, IMAGE_CACHE].includes(key)) {
          return caches.delete(key);
        }
      }));
      await self.clients.claim();
    })()
  );
});

/** Network helpers **/
const timeoutFetch = (req, ms = 3000) => new Promise((resolve) => {
  let settled = false;
  const timer = setTimeout(async () => {
    if (settled) return; settled = true;
    // On timeout try cache as fallback
    const cache = await caches.match(req, { ignoreSearch: false });
    if (cache) return resolve(cache);
    // Fallback to network finally
    resolve(fetch(req));
  }, ms);
  fetch(req)
    .then((resp) => { if (!settled) { settled = true; clearTimeout(timer); resolve(resp); } })
    .catch(async () => {
      if (!settled) {
        settled = true; clearTimeout(timer);
        const cache = await caches.match(req, { ignoreSearch: false });
        if (cache) return resolve(cache);
        resolve(new Response('', { status: 504, statusText: 'Gateway Timeout' }));
      }
    });
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET
  if (req.method !== 'GET') return;

  // Bypass range and video streaming to avoid stutter
  const isRange = req.headers.has('range');
  const dest = req.destination;
  if (isRange || dest === 'video' || /\.(mp4|webm|ogg)$/i.test(url.pathname)) {
    return; // allow default network to handle streaming
  }

  // HTML navigation: Network-first with navigation preload and timeout fallback
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) return preload;
      } catch (_) {}
      return timeoutFetch(req, 3500);
    })());
    return;
  }

  // Styles and scripts: Stale-While-Revalidate
  if (dest === 'style' || dest === 'script' || /\.(css|js)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(ASSET_CACHE);
      const cached = await cache.match(req);
      const networkPromise = fetch(req).then((resp) => { if (resp && resp.ok) cache.put(req, resp.clone()); return resp; }).catch(() => undefined);
      return cached || networkPromise || fetch(req);
    })());
    return;
  }

  // Images: Cache-first with size guard (avoid caching huge files)
  if (dest === 'image' || /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const resp = await fetch(req, { cache: 'no-cache' });
        // Guard: skip caching very large images (> 2.5MB)
        const len = parseInt(resp.headers.get('content-length') || '0', 10);
        if (resp.ok && (!len || len < 2_500_000)) {
          cache.put(req, resp.clone());
        }
        return resp;
      } catch (e) {
        // Fallback to any cached match
        const fallback = await caches.match(req);
        if (fallback) return fallback;
        throw e;
      }
    })());
    return;
  }

  // Default: try cache, then network
  event.respondWith((async () => {
    const cached = await caches.match(req);
    return cached || fetch(req);
  })());
});
