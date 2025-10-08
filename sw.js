/* High-performance Service Worker: runtime caching without visual changes */
/* Strategy:
   - HTML (navigate): Network-first with cache fallback for offline safety
   - CSS/JS/Fonts: Stale-While-Revalidate for fast loads + freshness
   - Images/Media: Cache-first to reduce network and speed up rendering
   - Others: Default to network with cache fallback where applicable
*/

const SW_VERSION = 'v1.0.0';
const RUNTIME_CACHE = `runtime-${SW_VERSION}`;

self.addEventListener('install', (event) => {
  // Activate immediately on install
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old runtime caches
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => {
        if (key.startsWith('runtime-') && key !== RUNTIME_CACHE) {
          return caches.delete(key);
        }
      }));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET
  if (req.method !== 'GET') return;

  // Bypass non-http(s)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Heuristic by destination
  const dest = req.destination;

  if (req.mode === 'navigate') {
    // HTML pages: Network-first with cache fallback
    event.respondWith(networkFirst(req));
    return;
  }

  if (dest === 'style' || dest === 'script' || dest === 'font') {
    // CSS/JS/Fonts: Stale-While-Revalidate
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  if (dest === 'image' || dest === 'video' || dest === 'audio') {
    // Media: Cache-first
    event.respondWith(cacheFirst(req));
    return;
  }

  // Default: try cache, then network
  event.respondWith(staleWhileRevalidate(req));
});

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(request);
    if (res && res.ok) {
      cache.put(request, res.clone());
    }
    return res;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Fallback to root if navigation request fails and no cache
    if (request.mode === 'navigate') {
      const fallback = await cache.match('/');
      if (fallback) return fallback;
    }
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  return cached || fetchPromise || fetch(request);
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    // If network fails and no cache, just throw
    throw err;
  }
}
