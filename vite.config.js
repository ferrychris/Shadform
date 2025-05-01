import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Handle client-side routing in development
    historyApiFallback: true,
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate a _redirects file for Netlify or similar hosting services
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'appwrite': ['appwrite'],
        },
      },
    },
  },
});
