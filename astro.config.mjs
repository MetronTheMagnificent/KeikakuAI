import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  site: 'https://keikakuai.com',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});
