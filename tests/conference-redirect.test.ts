import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
import { conferenceRedirect } from '../vite.config';

const html = await readFile(new URL('../dist/digital/index.html', import.meta.url), 'utf8');
const config = JSON.parse(await readFile(new URL('../config/conference.json', import.meta.url), 'utf8'));
const hook = conferenceRedirect({ digitalRedirectEnabled: true, digitalRedirectTarget: '/lugano/' }).transformIndexHtml as { handler: (html: string, context: { filename: string }) => string };
const enabledHtml = config.digitalRedirectEnabled ? html : hook.handler(html, { filename: '/site/digital/index.html' });
const script = enabledHtml.match(/<script id="lugano-conference-redirect">([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'Enabled digital page must include the conference redirect');
assert.equal(html.includes('lugano-conference-redirect'), config.digitalRedirectEnabled, 'Built page must follow the central switch');
function redirect(href: string): string | null {
  let destination: string | null = null;
  vm.runInNewContext(script!, { URL, window: { location: { href, replace(value: string) { destination = value; } } } });
  return destination;
}

test('digital aliases redirect immediately and preserve language, source, query and fragment', () => {
  for (const path of ['/digital', '/digital/', '/digital/index.html']) {
    assert.equal(redirect(`https://heroofbitcoin.xyz${path}?lang=de&source=demo&next=https%3A%2F%2Fexample.com#main`),
      'https://heroofbitcoin.xyz/lugano/?lang=de&source=demo&next=https%3A%2F%2Fexample.com#main');
  }
});

test('claim redemption links and other routes stay on their existing page', () => {
  for (const path of ['/digital/?claim=TESTONLY&lang=it', '/digital/?claim=', '/lugano/', '/success.html', '/', '/digital-other/']) {
    assert.equal(redirect(`https://heroofbitcoin.xyz${path}`), null);
  }
});

test('redirect runs before checkout modules and is not injected into the Lugano page', async () => {
  assert.ok(enabledHtml.indexOf('lugano-conference-redirect') < enabledHtml.indexOf('type="module"'));
  const lugano = await readFile(new URL('../dist/lugano/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(lugano, /lugano-conference-redirect/);
});

test('central switch restores the original digital HTML without a redirect', () => {
  const plugin = conferenceRedirect({ digitalRedirectEnabled: false, digitalRedirectTarget: '/lugano/' });
  const hook = plugin.transformIndexHtml as { handler: (html: string, context: { filename: string }) => string };
  const original = '<html><head><title>Classic</title></head><body>Classic</body></html>';
  assert.equal(hook.handler(original, { filename: '/site/digital/index.html' }), original);
});

test('conference target rejects external and protocol-relative destinations', () => {
  for (const target of ['https://example.com/', '//example.com/']) {
    assert.throws(() => conferenceRedirect({ digitalRedirectEnabled: true, digitalRedirectTarget: target }), /local absolute path/);
  }
});
