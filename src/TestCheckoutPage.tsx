import React, { useState } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';

import PixelCard from './components/ui/PixelCard';
import { getApiBaseUrl } from './lib/api';

interface CreateCheckoutResponse {
  order_id?: string;
  checkout_url?: string;
  error?: string;
}

const TEST_PRICE_LABEL = '12.21 USD';

async function createTestCheckout(apiBaseUrl: string, email: string): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/api/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim() || undefined,
      lang: 'en',
    }),
  });

  const payload = (await response.json().catch(() => null)) as CreateCheckoutResponse | null;

  if (!response.ok || typeof payload?.checkout_url !== 'string') {
    throw new Error(payload?.error ?? 'Could not create checkout');
  }

  return payload.checkout_url;
}

const TestCheckoutPage: React.FC = () => {
  const apiBaseUrl = getApiBaseUrl();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const checkoutUrl = await createTestCheckout(apiBaseUrl, email);
      window.location.assign(checkoutUrl);
    } catch (checkoutError) {
      setIsLoading(false);
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not create checkout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-4 md:py-8 px-2 md:px-0 relative">
      <div className="w-full max-w-4xl bg-yellow-400 min-h-[80vh] pixel-shadow border-4 border-black relative overflow-hidden">
        <header className="border-b-4 border-black bg-yellow-400 p-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <img
                src="/assets/images/HoB_Logo_only.png"
                alt="Hero of Bitcoin"
                className="h-12 md:h-14 w-auto mix-blend-multiply"
              />
              <div className="hidden md:block">
                <p className="font-pixel text-[10px] uppercase">Hidden Checkout Test</p>
                <p className="text-xs font-mono text-yellow-900">Unlisted page for full-flow validation</p>
              </div>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
            >
              <ArrowRight size={14} className="rotate-180" />
              <span>HOME</span>
            </a>
          </div>
        </header>

        <main className="p-4 md:p-8 bg-[#f8f9fa] min-h-[calc(80vh-92px)]">
          <div className="max-w-3xl mx-auto space-y-6">
            <PixelCard title="Digital Test Checkout" variant="info">
              <div className="space-y-4">
                <p className="font-mono text-sm text-gray-700">
                  This unlisted page is only for end-to-end testing. It creates a live Coinsnap checkout and sends you back to the Hero of Bitcoin success page after payment.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="border-2 border-black bg-white p-3">
                    <p className="font-pixel text-[10px] uppercase mb-2">Test Bundle</p>
                    <p className="font-mono text-sm text-gray-700">Dummy ZIP only. No real ROM assets are delivered from this path.</p>
                  </div>
                  <div className="border-2 border-black bg-white p-3">
                    <p className="font-pixel text-[10px] uppercase mb-2">Current Test Price</p>
                    <p className="font-mono text-xl text-gray-900">{TEST_PRICE_LABEL}</p>
                  </div>
                </div>

                <div className="border-2 border-black bg-amber-50 p-3">
                  <label className="block mb-2">
                    <span className="block text-[10px] font-pixel uppercase text-gray-700 mb-2">Optional Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-0"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </label>
                  <p className="text-[10px] font-mono text-gray-600">
                    Leave this blank if you want the fastest possible test flow.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white font-pixel py-3 px-4 border-2 border-black hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow-sm flex items-center justify-center gap-2 text-sm disabled:cursor-wait disabled:hover:scale-100 disabled:bg-green-600"
                >
                  <ShoppingCart size={16} />
                  <span>{isLoading ? 'Creating live checkout...' : 'START LIVE TEST CHECKOUT'}</span>
                </button>

                {error && (
                  <p className="text-[11px] font-mono text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                    {error}
                  </p>
                )}
              </div>
            </PixelCard>
          </div>
        </main>
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-10">
        <div className="w-full h-full bg-neutral-900 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </div>
  );
};

export default TestCheckoutPage;
