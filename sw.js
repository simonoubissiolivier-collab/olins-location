// OLINS Locations Cameroun - Service Worker

const CACHE_NAME = 'olins-v1';
const STATIC_ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'auth.js',
  'listings.js',
  'utils.js',
  'firebase-config.js',
  'aide-contact.html',
  'comment-ca-marche.html',
  'confidentialite.html',
  'mentions-legales.html',
  'dashboard.html',
  'manifest.json'
];

// Installation du service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Service Worker: Cache en cours...');
      return cache.addAll(STATIC_ASSETS);
    }).catch(function(error) {
      console.error('Erreur cache:', error);
    })
  );
});

// Activation du service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          console.log('Service Worker: Suppression de l\'ancien cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(function() {
        // Si la ressource n'est pas trouvée, rediriger vers index.html
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
