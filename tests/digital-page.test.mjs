import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('digital landing page is canonical, indexable, and built as a dedicated entry', async () => {
  const [source, viteConfig, translationSource] = await Promise.all([
    read('digital/index.html'),
    read('vite.config.ts'),
    read('src/i18n/digital-translations.ts'),
  ]);

  assert.match(source, /name="robots" content="index,follow,max-image-preview:large,max-video-preview:-1"/);
  assert.match(source, /rel="canonical" href="https:\/\/heroofbitcoin\.xyz\/digital\/"/);
  assert.match(source, /property="og:url" content="https:\/\/heroofbitcoin\.xyz\/digital\/"/);
  assert.match(source, /data-social-title/);
  assert.match(source, /data-social-description/);
  assert.match(source, /Game Boy-Compatible Bitcoin Game/);
  assert.match(source, />Explore El Salvador\.<\/span>/);
  assert.match(source, />Find all 21 bitcoin\.<\/span>/);
  assert.match(source, /data-language-picker/);
  assert.match(source, /data-page-description/);
  assert.match(source, /data-checkout/);
  assert.match(source, /data-btc-price/);
  assert.match(source, /data-reference-usd/);
  assert.match(source, /data-reference-eur/);
  assert.match(source, /src="\/assets\/images\/hob-logo-official\.png"/);
  assert.match(source, /href="https:\/\/youtu\.be\/IBqAaWS--Bg"/);
  assert.match(source, /src="\/assets\/images\/digital-volcano-hero\.jpg"/);
  assert.match(source, /property="og:image" content="https:\/\/heroofbitcoin\.xyz\/assets\/images\/digital-volcano-hero\.jpg"/);
  assert.match(source, /class="offer__trailer"/);
  assert.match(source, /class="pixel-trailer-button"/);
  assert.match(source, /data-i18n="watchTrailer"/);
  assert.match(source, /target="_blank"[\s\S]*rel="noopener noreferrer"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /src="\/src\/digital\.ts"/);
  assert.ok(source.indexOf('class="offer__trailer"') < source.indexOf('class="offer__buy"'));
  assert.equal(source.match(/<section\b/g)?.length, 1);
  assert.doesNotMatch(source, /Stephan Livera|class="(?:story|manifesto|making|world|bundle|final-cta)/);
  assert.match(viteConfig, /digital\/index\.html/);
  assert.match(viteConfig, /slp\/index\.html/);

  const structuredDataMatch = source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(structuredDataMatch, 'structured data must be present');
  const structuredData = JSON.parse(structuredDataMatch[1]);
  const product = structuredData['@graph'].find((entry) => entry['@type'] === 'Product');
  const game = structuredData['@graph'].find((entry) => entry['@type'] === 'VideoGame');
  assert.equal(product.url, 'https://heroofbitcoin.xyz/digital/');
  assert.equal(product.offers.price, '12.21');
  assert.equal(product.offers.priceCurrency, 'USD');
  assert.equal(game.inLanguage, 'en');
  assert.match(game.description, /21 bitcoin hidden throughout the game/);
  assert.doesNotMatch(source, /"@type": "VideoObject"/);

  const retiredCopy = [
    'weird side',
    'lado más raro',
    'lato più strano',
    '奇妙な一面',
    'schräge Seite',
    '기묘한 면',
    'côté étrange',
    'vreemde kant',
    'outoon puoleen',
    'Built to play',
  ];
  for (const phrase of retiredCopy) {
    assert.doesNotMatch(`${source}\n${translationSource}`, new RegExp(phrase));
  }

  for (const language of ['en', 'es', 'it', 'ja', 'de', 'ko', 'fr', 'nl', 'fi']) {
    assert.match(source, new RegExp(`<option value="${language}">`));
    assert.match(translationSource, new RegExp(`\\n  ${language}:`));
  }

  await access(new URL('dist/digital/index.html', root));
  await access(new URL('dist/slp/index.html', root));
  await access(new URL('public/assets/images/hob-logo-official.png', root));
  await access(new URL('public/assets/images/digital-volcano-hero.jpg', root));
});

test('legacy podcast URL redirects to the digital canonical and preserves language', async () => {
  const source = await read('slp/index.html');

  assert.match(source, /name="robots" content="noindex,follow"/);
  assert.match(source, /http-equiv="refresh" content="0;url=\/digital\/"/);
  assert.match(source, /rel="canonical" href="https:\/\/heroofbitcoin\.xyz\/digital\/"/);
  assert.match(source, /searchParams\.get\('lang'\)/);
  assert.match(source, /searchParams\.set\('lang', language\)/);
  assert.match(source, /location\.replace\(target\)/);
});

test('crawler discovery surfaces point to the canonical page without adding site navigation', async () => {
  const [robots, sitemap, llms, homepage, productsFeed, app, productsComponent] = await Promise.all([
    read('public/robots.txt'),
    read('public/sitemap.xml'),
    read('public/llms.txt'),
    read('index.html'),
    read('public/products.xml'),
    read('src/App.tsx'),
    read('src/components/Products.tsx'),
  ]);

  assert.match(robots, /User-agent: OAI-SearchBot[\s\S]*Allow: \//);
  assert.match(robots, /User-agent: Claude-SearchBot[\s\S]*Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/heroofbitcoin\.xyz\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/heroofbitcoin\.xyz\/digital\/<\/loc>/);
  assert.match(llms, /\[Hero of Bitcoin Digital\]\(https:\/\/heroofbitcoin\.xyz\/digital\/\)/);
  assert.match(llms, /\[Digital release trailer\]\(https:\/\/youtu\.be\/IBqAaWS--Bg\)/);
  assert.match(llms, /Game Boy-compatible adventure set in El Salvador/);
  assert.match(llms, /The game is in English/);
  assert.match(homepage, /"url": "https:\/\/heroofbitcoin\.xyz\/digital\/"/);
  assert.match(productsFeed, /<link>https:\/\/heroofbitcoin\.xyz\/digital\/<\/link>/);

  for (const humanNavigationSource of [app, productsComponent]) {
    assert.doesNotMatch(humanNavigationSource, /href=["']\/digital\//);
  }
  for (const surface of [homepage, productsFeed, app, productsComponent]) {
    assert.doesNotMatch(surface, /https:\/\/heroofbitcoin\.xyz\/slp\//);
  }

  await access(new URL('dist/robots.txt', root));
  await access(new URL('dist/sitemap.xml', root));
  await access(new URL('dist/llms.txt', root));
});

test('digital checkout uses the server-owned instant-download contract', async () => {
  const script = await read('src/digital.ts');

  assert.match(script, /\/api\/products\/prices/);
  assert.match(script, /\/api\/create-checkout/);
  assert.match(script, /product_id: 'instant-download'/);
  assert.match(script, /lang: currentLanguage/);
  assert.match(script, /window\.location\.assign/);
  assert.doesNotMatch(script, /lang: 'en'/);
  assert.doesNotMatch(script, /email:/);
});

test('digital pricing presents BTC first with a guarded fast preview and server reconciliation', async () => {
  const [source, script] = await Promise.all([
    read('digital/index.html'),
    read('src/digital.ts'),
  ]);

  assert.ok(source.indexOf('data-btc-price') < source.indexOf('data-reference-usd'));
  assert.match(source, /data-price-usd="12\.21"/);
  assert.match(source, /rel="preconnect" href="https:\/\/hero-of-bitcoin-digital\.fly\.dev" crossorigin/);
  assert.match(script, /product\.btc \? `\$\{product\.btc\} BTC` : '— BTC'/);
  assert.match(script, /product\.reference_usd/);
  assert.match(script, /product\.reference_eur/);
  assert.match(script, /formatFiat\(referenceUsd, 'USD'\)/);
  assert.match(script, /formatFiat\(referenceEur, 'EUR'\)/);
  assert.match(script, /fastRateDelayMs = 180/);
  assert.match(script, /https:\/\/mempool\.space\/api\/v1\/prices/);
  assert.match(script, /credentials: 'omit'/);
  assert.match(script, /referrerPolicy: 'no-referrer'/);
  assert.match(script, /if \(!currentProductPrice\?\.btc\)/);
  assert.match(script, /hasServerBtcPrice/);
});

test('digital language state follows URL, saved preference, and browser locale', async () => {
  const [script, stylesheet] = await Promise.all([
    read('src/digital.ts'),
    read('src/styles/digital.css'),
  ]);

  assert.match(script, /searchParams\.get\('lang'\)/);
  assert.match(script, /localStorage\.getItem\('hob-language'\)/);
  assert.match(script, /navigator\.languages/);
  assert.match(script, /searchParams\.set\('lang', language\)/);
  assert.match(script, /document\.documentElement\.lang = language/);
  assert.match(script, /document\.title = copy\.pageTitle/);
  assert.match(script, /data-social-description/);
  assert.match(script, /data-social-title/);
  assert.match(stylesheet, /HoB Korean Sans/);
  assert.match(stylesheet, /data-language='ko'/);
  assert.match(stylesheet, /pixel-trailer-button/);
});
