import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      // Default format for imported images
      defaultDirectives: (url) => {
        // Apply WebP conversion and sizing for catalog images
        if (url.pathname.includes('/items/')) {
          return new URLSearchParams({
            format: 'webp',
            quality: '80',
            w: '128;256', // 128px for thumbnails, 256px for detail view
          })
        }
        return new URLSearchParams()
      }
    })
  ],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/utils/**', 'src/engine/**'],
      exclude: ['**/*.test.js', '**/*.spec.js']
    }
  }
})
