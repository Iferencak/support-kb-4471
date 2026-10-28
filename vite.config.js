import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

const runbook = new URL('./src/lib/layouts/runbook.svelte', import.meta.url).pathname;

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'], layout: { runbook, _: runbook } })],
      adapter: adapter(), prerender: { handleHttpError: 'warn' },
    }),
  ],
});
