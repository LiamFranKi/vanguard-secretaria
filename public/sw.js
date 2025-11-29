// Service Worker para Push Notifications
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push recibido.');
  
  let notificationData = {
    title: 'SecretariaPro',
    body: 'Tienes una nueva notificación',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'secretaria-pro-notification',
    requireInteraction: false,
    data: {}
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || notificationData.tag,
        requireInteraction: data.requireInteraction || false,
        data: data.data || {},
        actions: data.actions || []
      };
    } catch (e) {
      console.error('[Service Worker] Error parseando datos:', e);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  const promiseChain = self.registration.showNotification(notificationData.title, {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    data: notificationData.data,
    actions: notificationData.actions,
    vibrate: [200, 100, 200],
    timestamp: Date.now()
  });

  event.waitUntil(promiseChain);
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notificación clickeada.');
  
  event.notification.close();

  const data = event.notification.data || {};
  let urlToOpen = '/app';

  // Si hay datos con URL, usarla
  if (data.url) {
    urlToOpen = data.url;
  } else if (data.relacionado_tipo && data.relacionado_id) {
    // Construir URL basada en el tipo de notificación
    switch (data.relacionado_tipo) {
      case 'task':
        urlToOpen = '/app?view=tasks';
        break;
      case 'event':
        urlToOpen = '/app?view=events';
        break;
      case 'document':
        urlToOpen = '/app?view=documents';
        break;
      default:
        urlToOpen = '/app';
    }
  }

  const promiseChain = clients.openWindow(urlToOpen);
  event.waitUntil(promiseChain);
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', function(event) {
  console.log('[Service Worker] Notificación cerrada.');
});

// Instalación del Service Worker
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Instalando...');
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activando...');
  event.waitUntil(self.clients.claim());
});

