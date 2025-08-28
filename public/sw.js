// Naturverse service worker (baseline, cache-first for static assets only)
// Caution: minimal to avoid offline bugs.

const CACHE_NAME = "naturverse-static-v1";
const ASSETS = ["/", "/index.html", "/favicon-192x192.png", "/manifest.json"];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (evt) => {
  const { request } = evt;
  if (request.method !== "GET") return;
  if (request.url.includes("/api/")) return; // never cache API calls

  evt.respondWith(
    caches.match(request).then(
      (resp) => resp || fetch(request).catch(() => caches.match("/index.html"))
    )
  );
});
