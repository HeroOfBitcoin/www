import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveLanguage, rememberLanguage } from '../src/i18n/locales';

test('language priority is URL, saved preference, supported browser language, then English', (t) => {
  let search = '?lang=fi';
  let saved: string | null = 'nl';
  let blocked = false;
  let languages = ['sv-SE', 'de-DE'];
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  t.after(() => {
    for (const [key, descriptor] of [['window', originalWindow], ['navigator', originalNavigator]] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    location: { get search() { return search; } },
    get localStorage() {
      if (blocked) throw new Error('Storage blocked');
      return { getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; } };
    },
  } });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { get languages() { return languages; } } });
  assert.equal(resolveLanguage(), 'fi');
  search = '?lang=unknown';
  assert.equal(resolveLanguage(), 'nl');
  saved = null;
  assert.equal(resolveLanguage(), 'de');
  blocked = true;
  assert.equal(resolveLanguage(), 'de');
  assert.doesNotThrow(() => rememberLanguage('fi'));
  languages = ['sv-SE'];
  assert.equal(resolveLanguage(), 'en');
  blocked = false;
  rememberLanguage('fi');
  assert.equal(saved, 'fi');
});
