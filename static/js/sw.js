/* SwasthyaAI Production Offline Service Worker */
const CACHE_NAME = 'swasthya-offline-v2.9.0';
const ASSETS_TO_CACHE = [
  '/',
  '/diagnostics/',
  '/dashboard/',
  '/static/css/main.css',
  '/static/css/components.css',
  '/static/js/three.min.js',
  '/static/js/local_i18n.js',
  '/static/js/offline_storage.js',
  '/static/js/local_nlp.js',
  '/static/js/local_bm25.js',
  '/static/js/local_graph.js',
  '/static/js/local_safety.js',
  '/static/js/local_map.js',
  '/static/js/local_vision.js',
  '/static/js/crypto_records.js',
  '/static/js/qr_share.js',
  '/static/js/sync_client.js',
  '/static/js/three_body_scanner.js',
  '/static/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching offline shell assets for v2.6.0');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Purging stale cache:', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Network-First with Offline Fallback Strategy:
  // Try network first to always ensure fresh updates on standard refresh (F5).
  // If online, update cache in background. If offline, instantly serve from cache.
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline Fallback: Serve from offline cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response(JSON.stringify({
            error: "Offline mode active. Request served from local client store.",
            offline: true
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
  );
});
