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
      '/api/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/api')
      },
      '/api/course': {
        target: 'http://localhost:10001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/course/, '')
      },
      '/api/files': {
        target: 'http://localhost:8087',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/files/, '')
      }
    }
  }
})
