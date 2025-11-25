import React, { useState } from 'react';
import GameManual from './components/GameManual';
import DeviceGuide from './components/DeviceGuide';
import PhysicalCartridge from './components/PhysicalCartridge';
import { Tab } from './types';
import { Gamepad2, Smartphone, Disc, Menu, Play } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GAME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col items-center py-4 md:py-8 px-2 md:px-0">
      
      {/* Booklet Container */}
      <div className="w-full max-w-5xl bg-yellow-400 min-h-[90vh] pixel-shadow border-4 border-black relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Grey 'Binding' Stripe on Left (Desktop Only) */}
        <div className="hidden md:block w-12 bg-neutral-300 border-r-4 border-black relative shrink-0 z-20">
           {/* Binding texture */}
           <div className="h-full w-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
           
           {/* Vertical Spine Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">
              <span className="font-pixel text-4xl text-neutral-400 font-bold tracking-[0.5em] opacity-60">MANUAL</span>
           </div>
        </div>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col relative bg-yellow-400">
            
            {/* Header / Navigation */}
            <header className="border-b-4 border-black bg-yellow-400 p-4 sticky top-0 z-40 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Brand / Logo Area */}
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600 border-2 border-black rounded-full flex items-center justify-center text-white font-bold text-xs pixel-shadow-sm">
                                HB
                            </div>
                            <h1 className="font-pixel text-sm md:text-base text-black tracking-tighter leading-none">
                                HERO OF<br/>BITCOIN
                            </h1>
                        </div>
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
                        <NavButton tab={Tab.GAME} icon={Gamepad2} label="MANUAL" />
                        <NavButton tab={Tab.DEVICE} icon={Smartphone} label="DEVICE" />
                        <NavButton tab={Tab.CARTRIDGE} icon={Disc} label="CARTRIDGE" />
                        <a 
                            href="https://demo.heroofbitcoin.xyz"
                            className="flex items-center gap-2 px-4 py-3 md:py-2 text-sm font-bold border-2 border-black transition-all w-full md:w-auto bg-red-500 text-white hover:bg-red-600"
                        >
                            <Play size={18} />
                            <span className="font-pixel text-xs tracking-wide">PLAY DEMO</span>
                        </a>
                    </nav>
                </div>
            </header>

            {/* Content Area - Styled like white paper pages inside the yellow cover */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8f9fa]">
                <div className="animate-fadeIn max-w-3xl mx-auto">
                    {activeTab === Tab.GAME && <GameManual />}
                    {activeTab === Tab.DEVICE && <DeviceGuide />}
                    {activeTab === Tab.CARTRIDGE && <PhysicalCartridge />}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-yellow-400 border-t-4 border-black p-4 text-center shrink-0">
                <p className="font-pixel text-[8px] md:text-[10px] text-yellow-900 uppercase tracking-wider">
                    ©2022-2025 Hero of Bitcoin • manual.heroofbitcoin.xyz
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
