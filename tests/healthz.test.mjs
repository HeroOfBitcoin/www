import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function readHealth(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
}

test('source and production build expose the same stable health descriptor', async () => {
  const expected = {
    ok: true,
    service: 'hero-of-bitcoin-www',
    schema_version: 1,
  };

  assert.deepEqual(await readHealth('../public/healthz.json'), expected);
  assert.deepEqual(await readHealth('../dist/healthz.json'), expected);
});
