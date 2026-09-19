const CACHE_VERSION = "noah-protocol-v64";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./i18n.js",
  "./time.js",
  "./curriculum.js",
  "./drafts.js",
  "./drive-journal.js",
  "./share.js",
  "./ui63.js",
  "./office-year.js",
  "./readings.js",
  "./quotes.js",
  "./lessons.js",
  "./scriptures.js",
  "./drive-config.js",
  "./films.json",
  "./manifest.json",
  "./manifest-pt.json",
  "./play.html",
  "./icons/shortcut-chant-96.png",
  "./icons/shortcut-chant-192.png",
  "./icons/favicon.svg",
  "./icons/favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./fonts/eb-garamond-400.woff2",
  "./fonts/eb-garamond-400-italic.woff2",
  "./fonts/eb-garamond-700.woff2",
  "./fonts/grenze-gotisch-400.woff2",
  "./ark.svg",
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(ASSETS_TO_CACHE.map((url) => cache.add(url).catch(function () {})))
    ).then(() => self.skipWaiting())
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
  if (url.pathname.endsWith("version.json") || url.pathname.indexOf("ui63.js") !== -1 || url.pathname.indexOf("office-year.js") !== -1) {
    evt.respondWith(fetch(evt.request, { cache: "no-store" }));
    return;
  }
  evt.respondWith(
    fetch(evt.request).then((resp) => {
      if (resp && resp.ok && evt.request.method === "GET") {
        const clone = resp.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(evt.request, clone));
      }
      return resp;
    }).catch(() =>
      caches.match(evt.request).then((cached) => {
        if (cached) return cached;
        if (evt.request.mode === "navigate") return caches.match("./index.html");
        return undefined;
      })
    )
  );
});
