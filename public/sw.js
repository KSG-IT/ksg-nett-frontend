// Service worker for push notifications. No caching and no fetch handler.
// The payload is Declarative Web Push JSON (push/triggers.py in the backend).
// The worker cannot call the API: the login token is in localStorage.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event =>
  event.waitUntil(self.clients.claim())
)

self.addEventListener('push', event => {
  let notification = {}
  try {
    notification = event.data.json().notification || {}
  } catch (e) {}
  // userVisibleOnly: every push must show a notification
  event.waitUntil(
    self.registration.showNotification(notification.title || 'KSG-nett', {
      body: notification.body || '',
      tag: notification.tag,
      lang: notification.lang,
      icon: '/logo192.png',
      data: { url: notification.navigate || '/' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data.url
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(windows => {
        const open = windows.find(
          win => new URL(win.url).origin === self.location.origin
        )
        if (!open) return self.clients.openWindow(url)
        // navigate() fails on a window the worker does not control yet
        return open
          .focus()
          .then(() => open.navigate(url))
          .catch(() => self.clients.openWindow(url))
      })
  )
})
