const CACHE_VERSION = "noah-protocol-v39";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./readings.js",
  "./drive-config.js",
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
  "./fonts/grenze-gotisch-400.woff2",
  "./ark.svg",
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
  if (url.pathname.endsWith("/version.json") || url.pathname.endsWith("version.json")) {
    evt.respondWith(fetch(evt.request, { cache: "no-store" }));
    return;
  }
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

self.addEventListener("message", (evt) => {
  const data = evt.data || {};
  if (data.type !== "notify") return;
  evt.waitUntil(
    self.registration.showNotification(data.title || "Ark", {
      body: data.body || "",
      tag: "ark-" + (data.pane || "bell"),
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      data: { pane: data.pane },
    }),
  );
});

self.addEventListener("notificationclick", (evt) => {
  evt.notification.close();
  const pane = evt.notification.data && evt.notification.data.pane;
  const url = new URL("./index.html", self.registration.scope);
  if (pane) url.searchParams.set("pane", pane);
  evt.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (let i = 0; i < list.length; i++) {
          const client = list[i];
          client.postMessage({ type: "open-pane", pane: pane });
          if (client.focus) return client.focus();
        }
        return self.clients.openWindow(url.href);
      }),
  );
});
