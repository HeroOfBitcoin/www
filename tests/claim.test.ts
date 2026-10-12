import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { DIGITAL_GAME_LANGUAGES } from '../src/data/game-languages';
import { claimTranslations } from '../src/i18n/claim-translations';
import { SUPPORTED_LANGUAGES } from '../src/i18n/locales';

test('each shipped game language has a real flag asset', async () => {
  for (const language of DIGITAL_GAME_LANGUAGES) {
    assert.match(await readFile(new URL(`../public/assets/flags/${language}.svg`,import.meta.url),'utf8'), /<svg\b/);
  }
});
test('claim support states are translated in every interface language', () => {
  const keys=Object.keys(claimTranslations.en);
  for(const language of SUPPORTED_LANGUAGES){
    assert.deepEqual(Object.keys(claimTranslations[language]),keys);
    for(const value of Object.values(claimTranslations[language]))assert.ok(value.trim().length>0);
  }
});
