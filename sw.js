const CACHE_NAME = 'kasambabezi-fm-v1';
const STATIC_CACHE = 'kasambabezi-static-v1';
const DYNAMIC_CACHE = 'kasambabezi-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for fonts and CDNs)
  if (url.origin !== location.origin && 
      !url.hostname.includes('fonts.googleapis.com') && 
      !url.hostname.includes('fonts.gstatic.com') && 
      !url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          // For HTML files, always try network first (stale-while-revalidate)
          if (request.destination === 'document') {
            fetchAndCache(request);
            return cachedResponse;
          }
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetchAndCache(request);
      })
      .catch(() => {
        // Offline fallback
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
        
        // Return offline page for other requests if needed
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      // Clone the response since it can only be consumed once
      const responseToCache = response.clone();
      
      // Cache the response
      const cacheName = request.destination === 'document' ? DYNAMIC_CACHE : STATIC_CACHE;
      
      caches.open(cacheName)
        .then(cache => {
          cache.put(request, responseToCache);
        })
        .catch(error => {
          console.error('Service Worker: Failed to cache response', error);
        });
      
      return response;
    })
    .catch(error => {
      console.error('Service Worker: Fetch failed', error);
      throw error;
    });
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'song-request') {
    event.waitUntil(syncSongRequests());
  }
});

// Sync song requests when back online
function syncSongRequests() {
  return self.registration.sync.register('song-request')
    .then(() => {
      console.log('Service Worker: Background sync registered');
    })
    .catch(error => {
      console.error('Service Worker: Background sync failed', error);
    });
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from Kasambabezi FM',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Kasambabezi FM', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync for content updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateContent());
  }
});

// Update content in background
function updateContent() {
  return fetch('/')
    .then(response => {
      if (response.ok) {
        return caches.open(DYNAMIC_CACHE)
          .then(cache => {
            return cache.put('/', response);
          });
      }
    })
    .catch(error => {
      console.error('Service Worker: Content update failed', error);
    });
}
