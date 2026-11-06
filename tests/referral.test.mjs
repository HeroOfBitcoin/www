import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const routes = ['index.html', 'digital/index.html', 'lugano/index.html',
  'amsterdam/index.html', 'success.html', 'c/index.html'];
const languages = ['en', 'es', 'it', 'ja', 'de', 'ko', 'fr', 'nl', 'fi'];

test('public website pages have one always-visible referral with local artwork', async () => {
  for (const route of routes) {
    const page = await readFile(new URL('../dist/' + route, import.meta.url), 'utf8');
    const notices = [...page.matchAll(/<aside class="hob-referral"[\s\S]*?<\/aside>/g)];
    assert.equal(notices.length, 1, route);
    const notice = notices[0][0];
    assert.match(notice, /href="https:\/\/app\.bullbitcoin\.com\/registration\/unfiat" target="_blank" rel="sponsored noopener noreferrer" referrerpolicy="no-referrer"/);
    assert.match(notice, /src="\/assets\/referral\/bull-bitcoin\.png"/);
    assert.match(notice, /src="\/assets\/referral\/bullbitcoin-qr\.png"/);
    assert.match(notice, /<circle[^>]*fill="#f7931a"/);
    assert.equal([...notice.matchAll(/href="https:\/\/www\.bullbitcoin\.com\/rates"/g)].length, languages.length);
    for (const lang of languages) {
      assert.equal([...notice.matchAll(new RegExp(`data-referral-copy="${lang}"`, 'g'))].length, 2, route + ': ' + lang);
    }
    assert.doesNotMatch(notice, /<details|<summary|<script|<iframe|<img[^>]*src="https?:|0[.,]5\s*%/);
  }
  const redirect = await readFile(new URL('../dist/slp/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(redirect, /data-hob-referral/);
  for (const asset of ['bull-bitcoin.png', 'bullbitcoin-qr.png']) {
    await access(new URL('../dist/assets/referral/' + asset, import.meta.url));
  }
});
