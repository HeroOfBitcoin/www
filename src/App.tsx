import React, { useState, useEffect, useRef } from 'react';
import GameManual from './components/GameManual';
import Products from './components/Products';
import Partners from './components/Partners';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useLanguage } from './i18n';
import { Tab } from './types';
import { Package, Menu, Play, ShoppingCart, Shirt, Mail, Instagram, Youtube, Handshake } from 'lucide-react';

/*
  =============================================================================
  COPIARO PRODUCT LINKS
  =============================================================================
  All product links point to the Copiaro store. Update these URLs when
  individual product pages become available.

  LINK_STORE_MAIN: Main Hero of Bitcoin brand page on Copiaro
  LINK_FAN_SWAG: Merchandise category (cups, shirts, caps)
  =============================================================================
*/
const LINK_STORE_MAIN = 'https://copiaro.com/en/hero-of-bitcoin';
const LINK_FAN_SWAG = 'https://copiaro.com/en/hero-of-bitcoin'; // TODO: Update to merchandise category when available

/*
  =============================================================================
  SOCIAL LINKS & CONTACT
  =============================================================================
*/
const CONTACT_EMAIL = 'HeroOfBitcoin@pm.me';
const LINK_INSTAGRAM = 'https://instagram.com/heroofbitcoin';
const LINK_X = 'https://x.com/HeroOfBitcoin';
const LINK_YOUTUBE = 'https://youtube.com/@HeroOfBitcoin';

const App: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GAME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(false);

  /*
    ===========================================================================
    SCANLINES EASTER EGG
    ===========================================================================
    Activation: Hold C + R + T simultaneously (desktop only)
    Effect: Toggles CRT-style scanline overlay across the entire website
    ===========================================================================
  */
  const pressedKeysRef = useRef(new Set<string>());
  const hasToggledRef = useRef(false);

  // Map tabs to URL hashes
  const tabToHash: Record<Tab, string> = {
    [Tab.GAME]: '',
    [Tab.PRODUCTS]: 'products',
    [Tab.PARTNERS]: 'partners',
  };

  const hashToTab: Record<string, Tab> = {
    '': Tab.GAME,
    'products': Tab.PRODUCTS,
    'partners': Tab.PARTNERS,
    'instant-download': Tab.PRODUCTS,
    'collectors-edition': Tab.PRODUCTS,
    'digital-edition': Tab.PRODUCTS,
    'hero-handheld': Tab.PRODUCTS,
    'stackchain-magazine': Tab.PRODUCTS,
  };

  // Handle hash navigation on page load and browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const tab = hashToTab[hash];
      if (tab !== undefined) {
        setActiveTab(tab);
        // Scroll to specific product element after a short delay
        if (hash && hash !== 'products' && hash !== 'partners') {
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    };

    // Set initial tab from URL
    handleHashChange();

    // Listen for browser navigation
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL when changing tabs
  const navigateToTab = (tab: Tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    const hash = tabToHash[tab];
    if (hash) {
      window.history.pushState(null, '', `#${hash}`);
    } else {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const navigateToProduct = (productHash: string) => {
    setActiveTab(Tab.PRODUCTS);
    setMobileMenuOpen(false);

    const nextHash = `#${productHash}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = productHash;
      return;
    }

    const element = document.getElementById(productHash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['c', 'r', 't'].includes(key)) {
        pressedKeysRef.current.add(key);
        // Check if all three keys are held and we haven't toggled yet
        if (
          pressedKeysRef.current.has('c') &&
          pressedKeysRef.current.has('r') &&
          pressedKeysRef.current.has('t') &&
          !hasToggledRef.current
        ) {
          setScanlinesActive(prev => !prev);
          hasToggledRef.current = true; // Prevent repeated toggles while holding
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['c', 'r', 't'].includes(key)) {
        pressedKeysRef.current.delete(key);
        // Reset toggle flag when any key is released
        hasToggledRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const NavButton = ({
    tab,
    icon: Icon,
    label,
    compactDesktop = false,
  }: {
    tab: Tab;
    icon: any;
    label: string;
    compactDesktop?: boolean;
  }) => (
    <button
      onClick={() => navigateToTab(tab)}
      className={`flex w-full shrink-0 items-center justify-center gap-2 border-2 border-black px-3 py-3 transition-all md:w-auto md:min-h-[44px] md:px-2.5 md:py-2 ${
        activeTab === tab
          ? 'bg-white text-black pixel-shadow-sm translate-x-[-2px] translate-y-[-2px] z-10'
          : 'bg-yellow-300 text-black hover:bg-[#ffe56b]'
      }`}
    >
      <Icon size={14} className={compactDesktop ? 'md:hidden' : undefined} />
      <span className="font-pixel text-[9px] leading-none tracking-[0.04em] whitespace-nowrap">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center py-4 md:py-8 px-2 md:px-0 relative">

      {/* Scanlines Overlay (Easter Egg - activated by holding C+R+T) */}
      {scanlinesActive && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Booklet Container */}
      <div className="w-full max-w-[1120px] bg-yellow-400 min-h-[90vh] pixel-shadow border-4 border-black relative flex flex-col md:flex-row overflow-hidden">

        {/* Grey 'Binding' Stripe on Left (Desktop Only) */}
        <div className="hidden md:block w-14 bg-neutral-300 border-r-4 border-black relative shrink-0 z-20">
           {/* Binding texture */}
           <div className="h-full w-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

           {/* Vertical Spine Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">
              <span className="font-pixel text-4xl text-neutral-400 font-bold tracking-[0.5em] opacity-60">BITCOIN</span>
           </div>
        </div>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col relative bg-yellow-400">

            {/* Header / Navigation */}
            <header className="border-b-4 border-black bg-yellow-400 p-4 sticky top-0 z-40 shadow-sm">
                <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(180px,190px)_minmax(0,1fr)] md:items-center">

                    {/* Brand / Logo Area */}
                    <div className="flex items-center justify-between w-full md:min-w-[180px] md:pr-4">
                        <button
                            onClick={() => navigateToTab(Tab.GAME)}
                            className="flex items-center shrink-0 transition-transform hover:scale-105 active:scale-95"
                        >
                            {/*
                              =========================================================================
                              HEADER LOGO
                              =========================================================================
                              Location: public/assets/images/HoB_Logo_only.png
                              Using mix-blend-mode: multiply to blend white background with yellow
                              =========================================================================
                            */}
                            <img
                                src="/assets/images/HoB_Logo_only.png"
                                alt="Hero of Bitcoin"
                                className="h-16 md:h-[60px] w-auto mix-blend-multiply"
                            />
                        </button>
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 border-2 border-black bg-white active:bg-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2 md:flex-row md:flex-nowrap md:justify-self-end md:items-center md:gap-1.5 w-full md:w-auto mt-4 md:mt-0`}>
                            <div className="md:shrink-0">
                                <LanguageSwitcher />
                            </div>
                            <NavButton tab={Tab.PRODUCTS} icon={Package} label={t.nav.products} compactDesktop />
                            <NavButton tab={Tab.PARTNERS} icon={Handshake} label={t.nav.partners} compactDesktop />
                            <a
                                href="https://demo.heroofbitcoin.xyz"
                                className="flex w-full shrink-0 items-center justify-center gap-2 border-2 border-black bg-red-500 px-3 py-3 text-white transition-all hover:bg-red-600 md:w-auto md:min-h-[44px] md:px-2.5 md:py-2"
                            >
                                <Play size={14} className="md:hidden" />
                                <span className="font-pixel text-[9px] leading-none tracking-[0.04em] whitespace-nowrap">{t.nav.playDemo}</span>
                            </a>
                            <a
                                href={LINK_STORE_MAIN}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full shrink-0 items-center justify-center gap-2 border-2 border-black bg-green-600 px-3 py-3 text-white transition-all hover:bg-green-700 md:w-auto md:min-h-[44px] md:px-2.5 md:py-2"
                            >
                                <ShoppingCart size={14} className="md:hidden" />
                                <span className="font-pixel text-[9px] leading-none tracking-[0.04em] whitespace-nowrap">{t.nav.physicalStore}</span>
                            </a>
                            <button
                                onClick={() => navigateToProduct('instant-download')}
                                className="flex w-full shrink-0 items-center justify-center gap-2 border-2 border-black bg-black px-3 py-3 text-white transition-all hover:bg-neutral-800 md:w-auto md:min-h-[44px] md:px-2.5 md:py-2"
                            >
                                <span className="flex items-center gap-1 text-xs leading-none" aria-hidden="true">
                                    <span className="font-sans font-bold text-[#F7931A]">₿</span>
                                    <span className="font-sans text-yellow-300">⚡</span>
                                </span>
                                <span className="font-pixel text-[9px] leading-none tracking-[0.04em] whitespace-nowrap">{t.nav.instantDownload}</span>
                            </button>
                    </nav>
                </div>
            </header>

            {/* Content Area - Styled like white paper pages inside the yellow cover */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8f9fa]">
                <div className="animate-fadeIn max-w-3xl mx-auto">
                    {activeTab === Tab.GAME && <GameManual />}
                    {activeTab === Tab.PRODUCTS && <Products />}
                    {activeTab === Tab.PARTNERS && <Partners />}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-yellow-400 border-t-4 border-black p-4 text-center shrink-0">
                {/* Fan Swag Link */}
                <a
                    href={LINK_FAN_SWAG}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 mb-3 text-xs font-bold border-2 border-black bg-white hover:bg-yellow-100 transition-colors"
                >
                    <Shirt size={14} />
                    <span>{t.footer.fanSwag}</span>
                </a>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3 mb-3">
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-yellow-100 transition-colors"
                        title="Email"
                    >
                        <Mail size={16} />
                    </a>
                    <a
                        href={LINK_INSTAGRAM}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-yellow-100 transition-colors"
                        title="Instagram"
                    >
                        <Instagram size={16} />
                    </a>
                    <a
                        href={LINK_X}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-yellow-100 transition-colors"
                        title="X (Twitter)"
                    >
                        {/* X logo - custom SVG since lucide doesn't have X/Twitter */}
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                    <a
                        href={LINK_YOUTUBE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-yellow-100 transition-colors"
                        title="YouTube"
                    >
                        <Youtube size={16} />
                    </a>
                </div>

                <p className="font-pixel text-[8px] md:text-[10px] text-yellow-900 uppercase tracking-wider">
                    {t.footer.copyright}
                </p>
                <p className="font-pixel text-[6px] md:text-[8px] text-yellow-800 mt-2 opacity-80">
                    {t.footer.privacy}
                </p>
            </footer>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-10">
         <div className="w-full h-full bg-neutral-900 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </div>
  );
};

export default App;
