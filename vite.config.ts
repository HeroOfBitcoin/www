import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['127.0.0.1.nip.io'],
  },
  // IMPORTANT: This ensures assets load correctly on GitHub Pages
  // Using custom domain (heroofbitcoin.xyz), this stays '/'
  // If using username.github.io/repo, change to '/repo-name/'
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        certificate: fileURLToPath(new URL('./c/index.html', import.meta.url)),
        success: fileURLToPath(new URL('./success.html', import.meta.url)),
        checkoutTest: fileURLToPath(new URL('./checkout-test.html', import.meta.url)),
        slp: fileURLToPath(new URL('./slp/index.html', import.meta.url)),
      },
    },
  },
})
