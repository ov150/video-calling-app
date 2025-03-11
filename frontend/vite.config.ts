import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      // Include only what's needed for simple-peer
      include: ['buffer', 'process', 'stream']
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['simple-peer'],
  },
});