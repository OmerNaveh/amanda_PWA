const CACHE_NAME = "Amanda-cache_V1.0.0";
const urlsToCache = ["/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Take immediate control
  );
});
self.addEventListener("fetch", (event) => {
  if (
    event.request.url.match(
      /\.(jpg|jpeg|png|gif|bmp|webp|mp3|wav|svg|html|txt|json)$/i
    )
  ) {
    // respond with the cached version if available
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => console.log("Fetch request failed"))
        );
      })
    );
  }
});
