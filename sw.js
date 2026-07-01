const CACHE_NAME = 'keuangan-offline-v1';
// Daftarkan aset apa saja yang mau disimpan agar bisa dibuka offline
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://unpkg.com/dexie/dist/dexie.js'
];

// 1. Install Service Worker dan simpan aset ke dalam Cache Browser
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Aktifkan Service Worker dan hapus cache lama jika ada update
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Ambil aset dari cache jika offline, jika online ambil dari internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});