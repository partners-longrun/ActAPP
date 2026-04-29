self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
});
self.addEventListener('fetch', (e) => {
  // 캐싱 로직은 향후 고도화 가능 (현재는 통신만 허용)
  e.respondWith(fetch(e.request));
});
