const CACHE_NAME = 'smolvlm-cache-v1';
const MODEL_CACHE = 'smolvlm-models-v1';
self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(['/']);
})
);
});
self.addEventListener('fetch', (event) => {
if (event.request.url.includes('huggingface.co')) {
event.respondWith(
caches.open(MODEL_CACHE).then((cache) => {
return cache.match(event.request).then((response) => {
const fetchPromise = fetch(event.request).then((networkResponse) => {
cache.put(event.request, networkResponse.clone());
return networkResponse;
});
return response || fetchPromise;
});
})
);
}
});