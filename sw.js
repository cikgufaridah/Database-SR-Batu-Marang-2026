const CACHE="smmsrbm-v1";
const FILES=["./","./index.html","./style.css","./tambah-murid.html","./senarai-murid.html","./profil-murid.html","./edit-murid.html","./firebase.js","./manifest.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
