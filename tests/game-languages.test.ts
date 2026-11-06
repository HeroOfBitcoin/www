import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { BETA_GAME_LANGUAGES, DIGITAL_GAME_LANGUAGES, gameLanguageName } from '../src/data/game-languages';

test('standalone pages render the same playable languages without JavaScript', async () => {
  for (const route of ['digital', 'lugano', 'amsterdam']) {
    const html = await readFile(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8');
    const list = html.match(/<ul class="game-language-list" role="list" aria-labelledby="game-languages-label">([\s\S]*?)<\/ul>/)?.[1];
    assert.ok(list, route);
    const languages = [...list.matchAll(/<li><img src="\/assets\/flags\/([^"]+)\.svg"[^>]+alt=""[^>]*><span lang="([^"]+)">([^<]+)<\/span>([\s\S]*?)<\/li>/g)];
    assert.deepEqual(languages.map((entry) => entry[2]), DIGITAL_GAME_LANGUAGES, route);
    for (const [index, language] of DIGITAL_GAME_LANGUAGES.entries()) {
      assert.equal(languages[index][1], language);
      assert.equal(languages[index][3], gameLanguageName(language));
      assert.equal(languages[index][4].includes('class="game-language-beta">Beta'), BETA_GAME_LANGUAGES.includes(language));
      await access(new URL(`../dist/assets/flags/${language}.svg`, import.meta.url));
    }
  }
});
