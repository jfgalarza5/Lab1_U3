const CACHE_NAME = "notas-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-144x144.png",
  "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
  "https://code.getmdl.io/1.3.0/material.min.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
];

// Instalar Service Worker y cachear App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

// Activar y limpiar cachés viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

// Interceptar requests - Estrategia Cache First
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
