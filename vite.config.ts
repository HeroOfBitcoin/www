import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

interface ConferenceConfig {
  digitalRedirectEnabled: boolean
  digitalRedirectTarget: string
}

export function conferenceRedirect(config: ConferenceConfig): Plugin {
  if (!/^\/(?!\/)/.test(config.digitalRedirectTarget)) {
    throw new Error('Conference redirect target must be a local absolute path')
  }
  return {
    name: 'digital-conference-redirect',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        if (!config.digitalRedirectEnabled || !context.filename.endsWith('/digital/index.html')) return html
        const settings = JSON.stringify(config).replace(/</g, '\\u003c')
        const script = `<script id="lugano-conference-redirect">
(() => {
  const config = ${settings};
  const current = new URL(window.location.href);
  if (!/^\\/digital(?:\\/(?:index\\.html)?)?$/.test(current.pathname) || current.searchParams.has('claim')) return;
  const target = new URL(config.digitalRedirectTarget, current.origin);
  target.search = current.search;
  target.hash = current.hash;
  window.location.replace(target.href);
})();
</script>`
        return html.replace('<head>', `<head>\n    ${script}`)
      },
    },
  }
}

const conferenceConfig: ConferenceConfig = JSON.parse(
  readFileSync(new URL('./config/conference.json', import.meta.url), 'utf8'),
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [conferenceRedirect(conferenceConfig), react()],
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
        digital: fileURLToPath(new URL('./digital/index.html', import.meta.url)),
        lugano: fileURLToPath(new URL('./lugano/index.html', import.meta.url)),
        slp: fileURLToPath(new URL('./slp/index.html', import.meta.url)),
      },
    },
  },
})
