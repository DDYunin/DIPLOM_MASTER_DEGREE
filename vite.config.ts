import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api/us': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/us/, '/us')
      },
      '/api/course': {
        target: 'http://localhost:10001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/course/, '')
      },
      '/api/fs': {
        target: 'http://localhost:8087',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fs/, '/fs')
      }
    }
  }
})
