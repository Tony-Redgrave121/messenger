const AVATAR_CACHE = 'avatar-cache-v1';

self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            try {
                const allowedCaches = [AVATAR_CACHE];
                const cacheNames = await caches.keys();

                await Promise.all(
                    cacheNames
                        .filter(name => !allowedCaches.includes(name))
                        .map(name => caches.delete(name)),
                );
            } catch (error) {
                console.error(error);
            }
        })(),
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.url.includes('/avatar/')) {
        event.respondWith(
            (async () => {
                try {
                    const avatars = await caches.open(AVATAR_CACHE);
                    const cached = await avatars.match(request);
                    if (cached) return cached;

                    const response = await fetch(request);
                    if (response.ok) {
                        await avatars.put(request, response.clone());
                    }

                    return response;
                } catch (error) {
                    console.error(error);
                }
            })(),
        );
    }
});
