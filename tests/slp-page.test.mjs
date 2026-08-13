import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('podcast landing page is private-by-link and built as a dedicated entry', async () => {
  const [source, viteConfig, translationSource] = await Promise.all([
    read('slp/index.html'),
    read('vite.config.ts'),
    read('src/i18n/podcast-translations.ts'),
  ]);

  assert.match(source, /name="robots" content="noindex,nofollow"/);
  assert.match(source, /For Stephan Livera Podcast listeners/);
  assert.match(source, /data-language-picker/);
  assert.match(source, /data-page-description/);
  assert.match(source, /data-checkout/);
  assert.match(source, /aria-live="polite"/);
  assert.match(viteConfig, /slp\/index\.html/);
  for (const language of ['en', 'es', 'fr', 'de', 'ko']) {
    assert.match(source, new RegExp(`<option value="${language}">`));
    assert.match(translationSource, new RegExp(`\\n  ${language}:`));
  }
  await access(new URL('dist/slp/index.html', root));
});

test('podcast landing page is not linked from public discovery surfaces', async () => {
  const publicSurfaces = await Promise.all([
    read('index.html'),
    read('src/App.tsx'),
    read('src/components/Products.tsx'),
    read('src/data/products.ts'),
    read('public/products.xml'),
  ]);

  for (const surface of publicSurfaces) {
    assert.doesNotMatch(surface, /(?:href=["']|https:\/\/heroofbitcoin\.xyz)\/slp\//);
  }
});

test('podcast checkout uses the server-owned instant-download contract', async () => {
  const script = await read('src/podcast.ts');

  assert.match(script, /\/api\/products\/prices/);
  assert.match(script, /\/api\/create-checkout/);
  assert.match(script, /product_id: 'instant-download'/);
  assert.match(script, /lang: currentLanguage/);
  assert.match(script, /window\.location\.assign/);
  assert.doesNotMatch(script, /lang: 'en'/);
  assert.doesNotMatch(script, /email:/);
});

test('podcast language state follows URL, saved preference, and browser locale', async () => {
  const [script, stylesheet] = await Promise.all([
    read('src/podcast.ts'),
    read('src/styles/podcast.css'),
  ]);

  assert.match(script, /searchParams\.get\('lang'\)/);
  assert.match(script, /localStorage\.getItem\('hob-language'\)/);
  assert.match(script, /navigator\.languages/);
  assert.match(script, /searchParams\.set\('lang', language\)/);
  assert.match(script, /document\.documentElement\.lang = language/);
  assert.match(script, /document\.title = copy\.pageTitle/);
  assert.match(stylesheet, /HoB Korean Sans/);
  assert.match(stylesheet, /data-language='ko'/);
});
