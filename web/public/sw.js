/* tiny service worker – no build step required */
const VERSION = 'nv-1';
const APP_SHELL = [
  '/', '/index.html', '/offline.html',
  '/manifest.webmanifest'
  // Vite will expand hashed assets automatically; shell falls back to network for them
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function networkFirst(req) {
  return fetch(req).then(res => {
    const copy = res.clone();
    caches.open(VERSION).then(c => c.put(req, copy));
    return res;
  }).catch(() => caches.match(req));
}

function cacheFirst(req) {
  return caches.match(req).then(hit => hit || fetch(req));
}

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // only handle same-origin GET
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // HTML -> Network first, fall back to offline shell
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Static assets -> Cache first
  if (/\.(css|js|png|jpg|jpeg|webp|svg|woff2?)$/i.test(url.pathname)) {
    e.respondWith(cacheFirst(request));
    return;
  }

  // Everything else -> Network first
  e.respondWith(networkFirst(request));
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
