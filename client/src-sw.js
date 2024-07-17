const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate, NetworkOnly } = require('workbox-strategies');
const { registerRoute, setDefaultHandler } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching');

// this method will precache the self._WB_MANIFEST array containing a list of URLs
precacheAndRoute(self.__WB_MANIFEST);

// page cache strategy
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// precache important URLs
warmStrategyCache({
  urls: ['/index.html', '/', '/offline.html'],
  strategy: pageCache,
});

// asset cache strategy for CSS, JS, and images
const assetCache = new StaleWhileRevalidate({
    // name of the cache storage
    cacheName: 'asset-cache',
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        new ExpirationPlugin({
            // cache for 30 days
            maxAgeSeconds: 30 * 24 * 60 * 60,
            // limit entries for performance
            maxEntries: 60,
        }),
    ],
});

// setup page & asset cache
registerRoute(({ request }) => request.mode === 'navigate', pageCache);
registerRoute(({ request }) => 
    request.destination === 'style' || request.destination === 'script' || request.destination === 'image', assetCache
);

// implement offline functionality
setDefaultHandler(new NetworkOnly());
offlineFallback({
    pageFallback: '/offline.html',
    imageFallback: '/images/offline.png',
});

// precache offline resources
precacheAndRoute([
    { url: '/offline.html', revision: '1' },
    { url: '/images/offline.png', revision: '1' },
])