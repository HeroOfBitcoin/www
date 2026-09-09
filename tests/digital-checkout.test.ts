import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DigitalCheckoutController,
  submitDigitalCheckoutOnEnter,
  type DigitalCheckoutDependencies,
  type DigitalCheckoutInput,
} from '../src/digital-checkout';
import type { Language } from '../src/i18n/locales';

const languages: Language[] = ['en', 'es', 'it', 'ja', 'de', 'ko', 'fr', 'nl', 'fi'];
const copy = {
  creating: 'creating',
  invalidDiscount: 'invalid discount',
  unavailable: 'unavailable',
};

function input(language: Language = 'en', couponCode = ''): DigitalCheckoutInput {
  return { language, couponCode, copy };
}

function response(status: number, payload: unknown, rejectJson = false) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: rejectJson
      ? async () => { throw new SyntaxError('invalid JSON'); }
      : async () => payload,
  };
}

function harness(fetcher: DigitalCheckoutDependencies['fetcher']) {
  const busy: boolean[] = [];
  const statuses: Array<{ message: string; isError: boolean }> = [];
  const navigations: string[] = [];
  const controller = new DigitalCheckoutController({
    apiBaseUrl: 'https://checkout.example',
    fetcher,
    navigate: (url) => navigations.push(url),
    setBusy: (isBusy) => busy.push(isBusy),
    setStatus: (message, isError = false) => statuses.push({ message, isError }),
  });
  return { controller, busy, statuses, navigations };
}

test('runtime checkout sends every supported language and only a non-empty trimmed coupon', async () => {
  for (const language of languages) {
    let body: Record<string, unknown> | null = null;
    const state = harness(async (_url, init) => {
      body = JSON.parse(String(init.body));
      return response(201, { checkout_url: 'https://checkout.example/pay' });
    });

    assert.equal(await state.controller.start(input(language, '  SAVE21  ')), true);
    assert.deepEqual(body, {
      product_id: 'instant-download',
      lang: language,
      coupon_code: 'SAVE21',
    });
    assert.equal('email' in (body ?? {}), false);
    assert.deepEqual(state.navigations, ['https://checkout.example/pay']);
  }

  let blankBody: Record<string, unknown> | null = null;
  const blank = harness(async (_url, init) => {
    blankBody = JSON.parse(String(init.body));
    return response(201, { checkout_url: 'https://checkout.example/pay' });
  });
  assert.equal(await blank.controller.start(input('en', '   ')), true);
  assert.deepEqual(blankBody, { product_id: 'instant-download', lang: 'en' });
});

test('runtime checkout keyboard handler submits only on Enter', () => {
  let prevented = 0;
  let submitted = 0;
  const event = (key: string) => ({
    key,
    preventDefault: () => { prevented += 1; },
  });

  assert.equal(submitDigitalCheckoutOnEnter(event('Tab'), () => { submitted += 1; }), false);
  assert.equal(submitDigitalCheckoutOnEnter(event('Enter'), () => { submitted += 1; }), true);
  assert.equal(prevented, 1);
  assert.equal(submitted, 1);
});

test('runtime checkout blocks duplicate starts while a request is pending', async () => {
  let requests = 0;
  let resolveRequest: ((value: ReturnType<typeof response>) => void) | undefined;
  const pending = new Promise<ReturnType<typeof response>>((resolve) => {
    resolveRequest = resolve;
  });
  const state = harness(async () => {
    requests += 1;
    return pending;
  });

  const first = state.controller.start(input());
  const second = state.controller.start(input());
  assert.equal(await second, false);
  assert.equal(requests, 1);
  resolveRequest?.(response(201, { checkout_url: 'https://checkout.example/pay' }));
  assert.equal(await first, true);
  assert.deepEqual(state.busy, [true]);
});

test('runtime checkout localizes coupon errors and permits a retry', async () => {
  let requests = 0;
  const state = harness(async () => {
    requests += 1;
    return requests === 1
      ? response(400, { error: 'Coupon code is not valid' })
      : response(201, { checkout_url: 'https://checkout.example/pay' });
  });

  assert.equal(await state.controller.start(input('de', 'bad-code')), false);
  assert.deepEqual(state.statuses.at(-1), { message: 'invalid discount', isError: true });
  assert.deepEqual(state.busy, [true, false]);
  assert.equal(await state.controller.start(input('de', 'good-code')), true);
  assert.equal(requests, 2);
});

test('runtime checkout handles provider, network, and malformed responses without navigation', async () => {
  const cases: Array<[string, DigitalCheckoutDependencies['fetcher']]> = [
    ['provider', async () => response(502, { error: 'upstream unavailable' })],
    ['network', async () => { throw new TypeError('network failed'); }],
    ['json', async () => response(201, null, true)],
  ];

  for (const [name, fetcher] of cases) {
    const state = harness(fetcher);
    assert.equal(await state.controller.start(input()), false, name);
    assert.deepEqual(state.statuses.at(-1), { message: 'unavailable', isError: true }, name);
    assert.deepEqual(state.busy, [true, false], name);
    assert.deepEqual(state.navigations, [], name);
  }
});

test('runtime checkout reset invalidates a stale request restored from browser cache', async () => {
  let resolveRequest: ((value: ReturnType<typeof response>) => void) | undefined;
  const pending = new Promise<ReturnType<typeof response>>((resolve) => {
    resolveRequest = resolve;
  });
  const state = harness(async () => pending);

  const stale = state.controller.start(input('en', 'SAVE21'));
  state.controller.reset();
  resolveRequest?.(response(201, { checkout_url: 'https://checkout.example/pay' }));

  assert.equal(await stale, false);
  assert.deepEqual(state.navigations, []);
  assert.deepEqual(state.busy, [true, false]);
  assert.deepEqual(state.statuses.at(-1), { message: '', isError: false });
});
