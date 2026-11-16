// Written Expressa Background Service Worker
// Enables notifications even when user is NOT actively on the website.

const CACHE_NAME = 'we-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push notification listener (wakes up even when browser tab is closed)
self.addEventListener('push', (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = { title: 'Written Expressa', body: event.data.text() };
    }
  }

  const title = payload.title || 'Written Expressa Alert';
  const options = {
    body: payload.body || payload.message || 'New project announcement or discount available.',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    image: payload.image || undefined,
    vibrate: [200, 100, 200],
    tag: payload.id || 'we-broadcast',
    renotify: true,
    data: {
      url: payload.url || payload.actionUrl || '/',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'open_url', title: payload.actionText || 'Open Notice' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click listener: opens the destination URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // If no window is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Background sync / Broadcast check
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title || 'Written Expressa', {
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      ...options,
    });
  }
});
