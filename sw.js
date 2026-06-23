self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});

// 백그라운드 푸시 알림 수신 이벤트
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  let title = '파트너스 활동 관리 앱';
  let body = '새로운 알림이 있습니다.';
  let icon = 'https://www.svgrepo.com/show/475656/google-color.svg';

  if (event.data) {
    try {
      const data = event.data.json();
      // FCM v1 JSON 구조 파싱
      if (data.notification) {
        title = data.notification.title || title;
        body = data.notification.body || body;
      } else if (data.data) {
        title = data.data.title || title;
        body = data.data.body || body;
      }
    } catch (e) {
      body = event.data.text() || body;
    }
  }

  const options = {
    body: body,
    icon: icon,
    badge: icon,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 알림 클릭 시 앱으로 이동
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked.');
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // 이미 열려있는 창이 있으면 포커스, 없으면 새 창 오픈
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if ((client.url === '/' || client.url.includes('index.html')) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
