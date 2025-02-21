import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import mdx from '@mdx-js/rollup';

// https://vite.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    mdx()
  ],
  resolve: {
    alias: {
      '@docs': '/src/docs', // Make sure this alias is used for imports
    },
  },
})
