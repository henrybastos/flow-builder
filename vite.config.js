import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from "path";

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
        exclude: ["@codemirror", "@codemirror/language-javascript"],
  },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib")
    }
  }
});
