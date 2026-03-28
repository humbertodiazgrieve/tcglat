import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://tcglat.com',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  server: {
    port: 4322
  },
  build: {
    format: 'file'
  },
  integrations: [
    tailwind(), 
    react()
  ]
});