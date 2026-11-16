/*
 * GUGUBOO MASTER 2.6 – service worker (Samo 15. 11. 2026: appka sa dá pridať na plochu a otvorí sa aj bez signálu).
 * Rozsah LEN tento priečinok (nikdy koreň domény – V1 na guguboo.com ostáva nedotknutá).
 * Stránky (HTML): najprv sieť, bez siete posledná uložená verzia. Súbory s ?v=: z pamäte, inak zo siete.
 * Žiadne údaje používateľky sa tu neukladajú – len súbory appky. Cudzie adresy (počasie) sa nechávajú prehliadaču.
 */
const CACHE = "guguboo-m-app-2.8";

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(["app.html", "manifest.webmanifest", "icon-192.png"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith("guguboo-m-app-") && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL("./", self.registration.scope).pathname)) return;
  const isPage = request.mode === "navigate" || request.destination === "document";
  // Bez ?v= (stránky, obrázky, súbory bez verzie): najprv sieť, aby sa nikdy nezasekla stará verzia.
  if (isPage || !url.searchParams.has("v")) {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      if (response.ok) caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(hit => hit || (isPage ? caches.match("app.html") : Response.error()))));
    return;
  }
  event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  })));
});
