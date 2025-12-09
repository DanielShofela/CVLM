// Bump cache name when icons or app shell change so clients get fresh assets
const CACHE_NAME = 'cvlm-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // cache key icon files to ensure updates are pulled on install
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon-32x32.png'
];

// Installation du service worker
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache setup failed:', err))
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie: Network First, fallback to Cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip API calls (let them fail naturally if offline)
  if (event.request.url.includes('api') || 
      event.request.url.includes('supabase') || 
      event.request.url.includes('googleapis')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response(
          JSON.stringify({ error: 'Offline - API unavailable' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        ))
    );
    return;
  }

  // Network first strategy for app shell
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if network fails
        return caches.match(event.request)
          .then(response => {
            return response || new Response(
              'Offline - Page not available',
              { status: 503, statusText: 'Service Unavailable' }
            );
          });
      })
  );
});

// Handle message from client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
