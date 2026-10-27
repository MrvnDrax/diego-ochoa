import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { site as siteData } from './src/data/site';

const excludedFromSitemap = new Set([
  '/404/',
  '/aviso-de-privacidad/',
]);

export default defineConfig({
  site: siteData.url,
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !excludedFromSitemap.has(new URL(page).pathname),
    }),
  ],
});
