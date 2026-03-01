import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Примеры алиасов для FSD слоев:
      '@app': fileURLToPath(new URL('./src_fsd/app', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src_fsd/pages', import.meta.url)),
      '@widgets': fileURLToPath(new URL('./src_fsd/widgets', import.meta.url)),
      '@features': fileURLToPath(new URL('./src_fsd/features', import.meta.url)),
      '@entities': fileURLToPath(new URL('./src_fsd/entities', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src_fsd/shared', import.meta.url))
    },
  },
})
