import React, { useState, useEffect } from 'react';
import GameManual from './components/GameManual';
import Products from './components/Products';
import { Tab } from './types';
import { Package, Menu, Play, ShoppingCart, Shirt, Mail, Instagram, Youtube } from 'lucide-react';

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
const LINK_STORE_MAIN = 'https://copiaro.com/brand/hob';
const LINK_FAN_SWAG = 'https://copiaro.com/brand/hob'; // TODO: Update to merchandise category when available

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
  useEffect(() => {
    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['c', 'r', 't'].includes(key)) {
        pressedKeys.add(key);
        // Check if all three keys are held
        if (pressedKeys.has('c') && pressedKeys.has('r') && pressedKeys.has('t')) {
          setScanlinesActive(prev => !prev);
          pressedKeys.clear(); // Reset after activation
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['c', 'r', 't'].includes(key)) {
        pressedKeys.delete(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-3 md:py-2 text-sm font-bold border-2 border-black transition-all w-full md:w-auto ${
        activeTab === tab
          ? 'bg-white text-black pixel-shadow-sm translate-x-[-2px] translate-y-[-2px] z-10'
          : 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400'
      }`}
    >
      <Icon size={18} />
      <span className="font-pixel text-xs tracking-wide">{label}</span>
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
      <div className="w-full max-w-5xl bg-yellow-400 min-h-[90vh] pixel-shadow border-4 border-black relative flex flex-col md:flex-row overflow-hidden">

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
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Brand / Logo Area */}
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <button
                            onClick={() => { setActiveTab(Tab.GAME); setMobileMenuOpen(false); }}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            {/*
                              =========================================================================
                              HEADER LOGO - Text-based for clean integration with yellow header
                              =========================================================================
                            */}
                            <div className="w-8 h-8 bg-red-600 border-2 border-black rounded-full flex items-center justify-center text-white font-bold text-xs pixel-shadow-sm">
                                HB
                            </div>
                            <h1 className="font-pixel text-sm md:text-base text-black tracking-tighter leading-none text-left">
                                HERO OF<br/>BITCOIN
                            </h1>
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
                    <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto mt-4 md:mt-0`}>
                        {/* Single PRODUCTS tab for all products (cartridge, microSD, R36S) */}
                        <NavButton tab={Tab.PRODUCTS} icon={Package} label="PRODUCTS" />
                        <a
                            href="https://demo.heroofbitcoin.xyz"
                            className="flex items-center gap-2 px-4 py-3 md:py-2 text-sm font-bold border-2 border-black transition-all w-full md:w-auto bg-red-500 text-white hover:bg-red-600"
                        >
                            <Play size={18} />
                            <span className="font-pixel text-xs tracking-wide">PLAY DEMO</span>
                        </a>
                        {/* Prominent BUY Button - Links to main Copiaro store page */}
                        <a
                            href={LINK_STORE_MAIN}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-3 md:py-2 text-sm font-bold border-2 border-black transition-all w-full md:w-auto bg-green-500 text-white hover:bg-green-600 hover:scale-105 animate-pulse hover:animate-none"
                        >
                            <ShoppingCart size={18} />
                            <span className="font-pixel text-xs tracking-wide">BUY NOW</span>
                        </a>
                    </nav>
                </div>
            </header>

            {/* Content Area - Styled like white paper pages inside the yellow cover */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8f9fa]">
                <div className="animate-fadeIn max-w-3xl mx-auto">
                    {activeTab === Tab.GAME && <GameManual />}
                    {activeTab === Tab.PRODUCTS && <Products />}
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
                    <span>CUPS, SHIRTS & CAPS</span>
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
                    ©2022-2025 Hero of Bitcoin • heroofbitcoin.xyz
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
