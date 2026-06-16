// TCCOS Service Worker — handles push notifications
// This file must be in /public and served at the root

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

// ── Push event — show notification ──────────────────────────
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}

  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100, 50, 100],
    tag: data.tag || 'tccos-alert',          // replaces stacked same-type alerts
    renotify: true,
    data: {
      url: data.url || '/dashboard',
      poiId: data.poiId || null,
      type: data.type || 'alert',
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    requireInteraction: data.requireInteraction || false,
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'TCCOS Alert', options)
  )
})

// ── Notification click ───────────────────────────────────────
self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  if (event.action === 'dismiss') return

  const targetUrl = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Focus existing window if open
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl)
        }
      })
  )
})
