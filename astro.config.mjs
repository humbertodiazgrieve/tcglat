import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://tcglat.com',
  output: 'static',
  build: {
    format: 'file'
  },
  integrations: [tailwind()]
});