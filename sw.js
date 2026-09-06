const CACHE_VERSION = "noah-protocol-v22";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./films.json",
  "./manifest.json",
  "./manifest-pt.json",
  "./icons/favicon.svg",
  "./icons/favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./fonts/eb-garamond-400.woff2",
  "./fonts/eb-garamond-400-italic.woff2",
  "./fonts/eb-garamond-700.woff2",
  "./fonts/unifrakturmaguntia-400.woff2",
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_VERSION ? caches.delete(k) : undefined)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evt) => {
  const url = new URL(evt.request.url);
  if (url.origin !== self.location.origin) return;
  evt.respondWith(
    fetch(evt.request)
      .then((resp) => {
        if (resp && resp.ok && evt.request.method === "GET") {
          const clone = resp.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(evt.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(evt.request).then((cached) => cached || caches.match("./index.html")))
  );
});
