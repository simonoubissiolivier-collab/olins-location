// Service Worker pour OLINS Locations Cameroun
const CACHE_NAME = 'olins-cache-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/app.js',
  '/pages/comment-ca-marche.html',
  '/pages/aide-contact.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});