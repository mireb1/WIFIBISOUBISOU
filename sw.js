// Service Worker pour WiFi Bisou Bisou
// Version 1.0.0 - Optimisé pour GitHub Pages

const CACHE_NAME = 'wifi-bisou-bisou-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/router-management.html',
  '/support.html',
  '/styles.css',
  '/script.js',
  '/config.js',
  '/demo.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Installation du service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de récupération des ressources
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retourner la ressource du cache si elle existe
        if (response) {
          return response;
        }

        // Sinon, faire une requête réseau
        return fetch(event.request).then(function(response) {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cloner la réponse pour la mettre en cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(function() {
        // En cas d'erreur, retourner une page d'erreur personnalisée
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Écouter les messages du client
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification de mise à jour
self.addEventListener('updatefound', function() {
  console.log('Mise à jour disponible');
});

// Gestion des notifications push (pour les futures fonctionnalités)
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      },
      actions: [
        {
          action: 'explore',
          title: 'Ouvrir l\'application',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icons/xmark.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    // Ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Fermer la notification
    event.notification.close();
  } else {
    // Clic sur la notification principale
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise(function(resolve) {
    // Synchroniser les données hors ligne
    console.log('Synchronisation en arrière-plan');
    resolve();
  });
}

console.log('Service Worker WiFi Bisou Bisou installé et prêt!');
