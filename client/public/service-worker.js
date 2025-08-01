const AVATAR_CACHE = 'avatar-cache-v1';
const MAX_CACHE_AGE = 1000 * 60 * 60 * 24 * 7;

self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const allowedCaches = [AVATAR_CACHE];
            const cacheNames = await caches.keys();

            const now = Date.now();

            await Promise.all(
                cacheNames
                    .filter(name => !allowedCaches.includes(name))
                    .map(name => caches.delete(name)),
            );

            const avatars = await caches.open(AVATAR_CACHE);
            const requests = await avatars.keys();

            for (const request of requests) {
                const response = await avatars.match(request);
                const header = response?.headers.get('sw-cache-date');

                const time = header ? parseInt(header) : now;

                if (now - time > MAX_CACHE_AGE) {
                    await avatars.delete(request);
                }
            }
        })(),
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.url.includes('/avatar/')) {
        event.respondWith(
            (async () => {
                const avatars = await caches.open(AVATAR_CACHE);
                const cached = await avatars.match(request);
                if (cached) return cached;

                const response = await fetch(request);
                if (!response.ok) {
                    const clone = await response.clone();
                    const blob = await clone.blob();

                    const headers = new Headers(response.headers);
                    headers.set('sw-cache-date', Date.now().toString());

                    const newResponse = new Response(blob, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: headers,
                    });

                    await avatars.put(request, newResponse);
                }

                return response;
            })(),
        );
    }
});
