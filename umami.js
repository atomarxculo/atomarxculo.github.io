const UMAMI_HOST = 'https://cloud.umami.is'

export default {
    async fetch(request, env, ctx) {
        const { pathname, search } = new URL(request.url)
        if (pathname.endsWith('.js')) {
            let response = await caches.default.match(request)
            if (!response) {
                response = await fetch(`${UMAMI_HOST}/script.js`, request)
                ctx.waitUntil(caches.default.put(request, response.clone()))
            }
            return response
        }
        const req = new Request(request)
        req.headers.delete("cookie")
        req.headers.append('x-client-ip', req.headers.get('cf-connecting-ip'))
        return fetch(`${UMAMI_HOST}${pathname}${search}`, req)
    },
};