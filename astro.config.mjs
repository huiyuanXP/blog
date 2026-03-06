// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://huiyuanxp.com',
  output: 'static',
  adapter: cloudflare(),
});
