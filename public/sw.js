const CACHE_NAME = 'yobbytech-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Don't intercept non-GET requests, images, or bot requests
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('.png') || 
    event.request.url.includes('.jpg') ||
    event.request.url.includes('?fbclid')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return new Response(
          JSON.stringify({ error: 'You are offline.' }),
          { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'application/json' } }
        );
      });
    })
  );
});
