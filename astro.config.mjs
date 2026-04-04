import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://tcglat.com',
  output: 'hybrid',
  adapter: cloudflare(),
  integrations: [
    tailwind(), 
    react()
  ]
});