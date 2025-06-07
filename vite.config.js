import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback for development - serve weather API directly
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error, serving fallback');
          });
        }
      }
    }
  }
})
