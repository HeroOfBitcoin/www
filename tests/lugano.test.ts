import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { luganoTranslations } from '../src/i18n/lugano-translations';
import { SUPPORTED_LANGUAGES } from '../src/i18n/locales';

test('Lugano copy covers each site language and every event-specific element', async () => {
  const html = await readFile(new URL('../lugano/index.html', import.meta.url), 'utf8');
  const keys = [...html.matchAll(/data-lugano(?:-alt|-aria)?="([^"]+)"/g)].map((match) => match[1]);
  keys.push('eventDate');
  assert.deepEqual(Object.keys(luganoTranslations).sort(), [...SUPPORTED_LANGUAGES].sort());
  for (const language of SUPPORTED_LANGUAGES) {
    const copy = luganoTranslations[language];
    assert.deepEqual(Object.keys(copy).sort(), Object.keys(luganoTranslations.en).sort());
    for (const key of keys) assert.ok(copy[key as keyof typeof copy]?.trim(), `${language}: ${key}`);
    assert.ok(copy.eventDate.includes('2026'));
  }
});

test('Lugano keeps the print URL, approved game languages and official event links', async () => {
  const html = await readFile(new URL('../dist/lugano/index.html', import.meta.url), 'utf8');
  assert.match(html, /rel="canonical" href="https:\/\/heroofbitcoin\.xyz\/lugano\/"/);
  assert.match(html, /data-game-languages="en,nl,fi,it"/);
  assert.match(html, /https:\/\/demo\.heroofbitcoin\.xyz\/\?event=lugano/);
  assert.match(html, /href="\/#hero-handheld"/);
  assert.match(html, /href="\/#collectors-edition"/);
  assert.equal([...html.matchAll(/href="https:\/\/planb\.lugano\.ch\/planb-forum\/"/g)].length, 3);
  const logo = await readFile(new URL('../public/assets/lugano/planb-forum-2026.svg', import.meta.url), 'utf8');
  assert.match(logo, /viewBox="0 0 240 58"/);
  assert.doesNotMatch(logo, /<script|<foreignObject|href=|onload=/i);
});
