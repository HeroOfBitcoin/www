import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { amsterdamPromoCopy, amsterdamPromoCountdown, AMSTERDAM_PROMO_CODE, AMSTERDAM_PROMO_END } from '../src/amsterdam-promo';
import { digitalTranslations, type DigitalTranslation } from '../src/i18n/digital-translations';
import { SUPPORTED_LANGUAGES } from '../src/i18n/locales';

test('Amsterdam ships a standalone alias for the shared digital checkout', async () => {
  const page = await readFile(new URL('../dist/amsterdam/index.html', import.meta.url), 'utf8');
  const entry = await readFile(new URL('../src/amsterdam.ts', import.meta.url), 'utf8');
  assert.match(page, /rel="canonical" href="https:\/\/heroofbitcoin\.xyz\/digital\/"/);
  assert.match(page, /name="robots" content="noindex,follow"/);
  assert.match(page, /name="referrer" content="no-referrer"/);
  assert.match(page, /src="\/assets\/amsterdam\/hero-amsterdam\.jpg"/);
  assert.match(page, /https:\/\/youtu\.be\/IBqAaWS--Bg/);
  assert.match(page, /data-game-languages="en,nl,fi,it"/);
  assert.match(entry, /import '\.\/digital'/);
  assert.match(page, /data-discount-code/);
  assert.equal([...page.matchAll(/\bdata-checkout(?=[\s>])/g)].length, 1);
  assert.doesNotMatch(page, /lugano-conference-redirect|Plan ₿ Forum/);
  await access(new URL('../dist/assets/amsterdam/hero-amsterdam.jpg', import.meta.url));

  const keys = [...page.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g)]
    .map((match) => match[1] as keyof DigitalTranslation);
  assert.deepEqual([...page.matchAll(/<option value="([^"]+)"/g)].map((match) => match[1]).sort(), [...SUPPORTED_LANGUAGES].sort());
  for (const language of SUPPORTED_LANGUAGES) {
    for (const key of keys) assert.ok(digitalTranslations[language][key]?.trim(), `${language}: ${key}`);
  }
});

test('Amsterdam has an inline promo and an exclusive cutoff at 17:00 Amsterdam time', async () => {
  const page = await readFile(new URL('../dist/amsterdam/index.html', import.meta.url), 'utf8');
  assert.match(page, /data-amsterdam-promo hidden/);
  assert.ok(page.indexOf('data-amsterdam-promo') < page.indexOf('data-btc-price'));
  assert.match(page, new RegExp(`data-promo-code>${AMSTERDAM_PROMO_CODE}<`));
  assert.match(page, /data-promo-countdown role="timer"/);
  assert.match(page, /data-promo-apply/);
  assert.equal(new Date(AMSTERDAM_PROMO_END).toISOString(), '2026-11-09T16:00:00.000Z');
  assert.equal(amsterdamPromoCountdown(AMSTERDAM_PROMO_END, 'en'), null);
  assert.equal(amsterdamPromoCountdown(AMSTERDAM_PROMO_END + 1, 'en'), null);
  assert.equal(amsterdamPromoCountdown(AMSTERDAM_PROMO_END - 1, 'en'), '00:00:01');
  assert.equal(amsterdamPromoCountdown(AMSTERDAM_PROMO_END - 90_061_000, 'en'), '1d 01:01:01');
  for (const language of SUPPORTED_LANGUAGES) {
    for (const text of Object.values(amsterdamPromoCopy[language])) assert.ok(text.trim(), language);
    assert.match(amsterdamPromoCountdown(AMSTERDAM_PROMO_END - 86_400_000, language) ?? '', /00:00:00$/);
  }
});
