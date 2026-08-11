// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './src/main.jsx'
      }
    }
  },
  server: {
    port: 8002,
    strictPort: true
  }
});
