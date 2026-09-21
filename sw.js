const CACHE_VERSION = "noah-protocol-v71";
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
  "./listen-desk.js",
  "./listen-lock.js",
  "./day-rail.js",
  "./candle-flicker.js",
  "./office-tidy.js",
  "./mood-marks.js",
  "./scroll-btn.js",
  "./overlay-i18n.js",
  "./wide-viewport.js",
  "./lang-sweep.js",
  "./date-line.js",
  "./onboard-pt.js",
  "./demo-off.js",
  "./settings-tidy.js",
  "./drop-cap.js",
  "./marks-log.js",
  "./porch.html",
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
  "./ark.svg"
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
  if (url.pathname.endsWith("version.json") || /ui63|office-year|share\.js|day-rail|candle-flicker|lang-sweep|listen-desk|overlay-i18n|settings-tidy|porch\.html/.test(url.pathname)) {
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
