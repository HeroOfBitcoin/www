import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This ensures assets load correctly on GitHub Pages
  // If using a custom domain (manual.heroofbitcoin.xyz), this stays '/'
  // If using username.github.io/repo, change to '/repo-name/'
  base: '/', 
})
