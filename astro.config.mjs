// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Published on GitHub Pages under the custom domain https://chanoma-kyoto.com
  site: 'https://chanoma-kyoto.com',
  // Emit about.html (not about/index.html) so the old /about.html link keeps working.
  build: { format: 'file' },

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});
