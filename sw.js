self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache the HTML - always get the newest site
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache-first for icons / background / manifest
  e.respondWith(caches.open('grit-v1').then(async (cache) => {
    const hit = await cache.match(e.request);
    if (hit) return hit;
    try { const res = await fetch(e.request); if (res.ok) cache.put(e.request, res.clone()); return res; }
    catch (err) { return hit || fetch(e.request); }
  }));
});
