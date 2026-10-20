// Keep each GitHub Pages repository's cache separate on the shared origin.
const CACHE_PREFIX = `skillsync-shell:${self.registration.scope}:`;
const CACHE = `${CACHE_PREFIX}20261020-2`;
const FILES = [
  './', './index.html', './style.css?v=20261020-2',
  './site.js?v=20261020-2', './manifest.webmanifest', './icon.svg', './favicon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache =>
    cache.addAll(FILES.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' })))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  const isNavigation = request.mode === 'navigate';
  const isStatic = ['document', 'style', 'script', 'image', 'font', 'manifest'].includes(request.destination);
  if (request.method !== 'GET' || url.origin !== scope.origin ||
      !url.pathname.startsWith(scope.pathname) || (!isNavigation && !isStatic)) return;

  // Fetch the latest page/assets first. Use this scope's cache only when offline.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response.ok && response.type !== 'opaque') {
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (isNavigation) {
        const index = await cache.match(new URL('./index.html', self.registration.scope));
        if (index) return index;
      }
      return Response.error();
    }
  })());
});
