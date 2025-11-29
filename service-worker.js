const CACHE_NAME = "linkos-cache-v2";
const URLS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './logos/logo.png',
  './logos/game.png',
  './logos/LOGO1.png',
  './logos/calculator.png',
  './logos/wikipedia.png',
  './wallpapers/wallpaper1.png',
  './wallpapers/wallpaper2.png',
  './wallpapers/wallpaper3.png',
  './wallpapers/wallpaper4.png',
  './wallpapers/wallpaper5.png',
  './wallpapers/wallpaper6.png',
  './wallpapers/wallpaper7.png'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }).catch(() => {
      // If both cache and network fail, show offline page
      // You could return a custom offline page here
      console.log('Fetch failed; returning offline page');
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});