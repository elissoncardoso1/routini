// Service Worker para PWA
const CACHE_NAME = 'routini-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index-B_AN0Jja.js',
  '/assets/index-D2CgPU_D.css',
  '/assets/react-vendor-DeomjPLV.js',
  '/assets/utils-vendor-BfJFlMXP.js',
  '/assets/ui-vendor-DBpOLB1z.js',
  '/assets/calendar-vendor-VSl4A5Hz.js',
  '/favicon.svg'
];

// Instalar service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }
        
        // Se não estiver no cache, buscar da rede
        return fetch(event.request);
      }
    )
  );
});

// Atualizar cache quando nova versão
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 