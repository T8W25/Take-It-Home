import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Force Vite to use port 5173
    strictPort: true, // Prevent it from switching ports
  },
  css: {
    devSourcemap: false, // Disable CSS source maps to avoid Bootstrap errors
  },
});
