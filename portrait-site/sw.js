const CACHE_PREFIX = 'field-miner-mobile-v01-pwa-';
const CACHE_NAME = `${CACHE_PREFIX}v13-public-handoff-guide-guard-20260921`;
const BASE = '/field-miner-mobile-v01/';

const PRECACHE_URLS = [
  `${BASE}index.html`,
  `${BASE}field-entry-exit-trial.html`,
  `${BASE}field-entry-same-document-handoff-v02.css`,
  `${BASE}src/styles.css`,
  `${BASE}field-entry-runtime.js`,
  `${BASE}field-frame-fit.js`,
  `${BASE}field-first-use-narrative-layout-trial-v01.html`,
  `${BASE}field-first-use-narrative-layout-trial-v01.css`,
  `${BASE}field-first-use-source-han-cn-light-300-v01.woff2`,
  `${BASE}field-inner-cover-preview.html`,
  `${BASE}field-inner-content.js`,
  `${BASE}field-inner-slider.runtime.js`,
  `${BASE}field-inner-slider.css`,
  `${BASE}field-inner-scope-switch.js`,
  `${BASE}field-inner-scope-switch.css`,
  `${BASE}field-dialog-light-dismiss.js`,
  `${BASE}field-trial-bridge-dialog.js`,
  `${BASE}field-trial-bridge-geometry.js`,
  `${BASE}field-trial-bridge.css`,
  `${BASE}field-inner-current-field-sheet.js`,
  `${BASE}field-inner-current-field-sheet.css`,
  `${BASE}field-inner-phi-sheet.css`,
  `${BASE}field-inner-registry.runtime.js`,
  `${BASE}manifest.webmanifest`,
  `${BASE}icons/icon-192.png`,
  `${BASE}icons/icon-512.png`,
  `${BASE}assets/field-entry-webgl-poster-s0-v01-1x.png`,
  `${BASE}assets/field-entry-webgl-poster-s0-v01-2x.png`,
  `${BASE}assets/field-entry-flight-s16-rgba-v01-1x.png`,
  `${BASE}assets/field-entry-flight-s16-rgba-v01-2x.png`,
  `${BASE}assets/field-entry-flight-s16-rgba-v01-2p5x.png`,
  `${BASE}assets/field-inner-cover-aligned-rgba-v01.png`,
  `${BASE}assets/field-inner-d04-content-v02.svg`,
  `${BASE}assets/frame1-field-source.svg`,
  `${BASE}assets/frame1-field-body.svg`,
  `${BASE}assets/vendor/carbon/information-16.svg`,
  `${BASE}fonts/site-v2/ekto-source-han-sans.css`,
  `${BASE}fonts/site-v2/field-miner-compat.css`,
  `${BASE}fonts/site-v2/source-han-sans-cn-extra-light-250-site-v2.woff2`,
  `${BASE}fonts/site-v2/source-han-sans-cn-light-300-site-v2.woff2`,
  `${BASE}fonts/site-v2/source-han-sans-cn-normal-350-site-v2.woff2`,
  `${BASE}fonts/site-v2/source-han-sans-cn-medium-500-site-v2.woff2`,
  `${BASE}fonts/field-inner-global-v11/field-inner-fonts.css`,
  `${BASE}fonts/field-inner-global-v11/source-han-sans-cn-extra-light-200-field-global-v11.woff2`,
  `${BASE}fonts/field-inner-global-v11/source-han-sans-cn-light-300-field-global-v11.woff2`,
  `${BASE}fonts/field-inner-global-v11/source-han-sans-cn-normal-350-field-global-v11.woff2`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) {
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request, {
      ignoreSearch: event.request.mode === 'navigate',
    });
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') {
        const fallback = await caches.match(`${BASE}field-entry-exit-trial.html`);
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});
