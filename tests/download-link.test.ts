import assert from 'node:assert/strict';
import test from 'node:test';
import { createPersonalDownloadLink } from '../src/lib/download-link';
import { SUPPORTED_LANGUAGES } from '../src/i18n/locales';

test('personal download links preserve the order and explicit language across devices, without temporary credentials', () => {
  for (const language of SUPPORTED_LANGUAGES) {
    const link = new URL(createPersonalDownloadLink(
      'https://heroofbitcoin.xyz/success.html?order_id=stale&token=temporary&tracking=extra#old',
      '00000000-0000-4000-8000-000000000001', language,
    ));
    assert.equal(link.origin, 'https://heroofbitcoin.xyz');
    assert.equal(link.pathname, '/success.html');
    assert.deepEqual([...link.searchParams.entries()], [
      ['order_id', '00000000-0000-4000-8000-000000000001'], ['lang', language],
    ]);
    assert.equal(link.hash, '');
  }
});

test('local review links remain local rather than sending example orders to production', () => {
  const link = createPersonalDownloadLink('http://127.0.0.1:8873/success.html', 'local-order', 'de');
  assert.equal(link, 'http://127.0.0.1:8873/success.html?order_id=local-order&lang=de');
});
