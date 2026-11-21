/* Service worker của bản web: giữ bản trang gần nhất để mở được khi mất mạng.
   Trang chính lấy từ mạng trước (để luôn có bản mới), mất mạng mới dùng bản đã lưu. Dữ liệu (Firebase, thời tiết) không lưu ở đây. */
const KHO = 'lua-gao-v1';
const TAI_SAN = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(KHO).then(c => c.addAll(TAI_SAN)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== KHO).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // chỉ xử lý file của chính trang
  e.respondWith(fetch(e.request).then(r => { const b = r.clone(); caches.open(KHO).then(c => c.put(e.request, b)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
