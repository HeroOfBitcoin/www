import React from 'react';
import PixelCard from './ui/PixelCard';
import { Package, Star, ShieldCheck, ShoppingCart } from 'lucide-react';

const PhysicalCartridge: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-pixel text-2xl md:text-3xl text-black mb-4 uppercase">Physical Release</h2>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Visual Placeholder for Cartridge/Box */}
        <div className="bg-gray-100 border-4 border-black aspect-square relative flex items-center justify-center pixel-shadow group">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6)] bg-[length:20px_20px] opacity-50"></div>
            <Package size={80} className="text-gray-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <div className="absolute bottom-4 left-0 right-0 text-center font-pixel text-xs text-gray-400">
                BOX ART PLACEHOLDER
            </div>
            
            {/* Sticker Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 border-2 border-black p-3 rounded-full pixel-shadow-sm rotate-12 z-10">
                <div className="text-center font-bold text-xs leading-none">
                    LTD<br/>EDITION
                </div>
            </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
            <h3 className="font-bold text-2xl font-sans">Collector's Edition Cartridge</h3>
            <p className="font-serif italic text-gray-600 border-l-4 border-yellow-400 pl-4">
                "A tangible piece of Bitcoin history, playable on original hardware."
            </p>
            
            <ul className="space-y-3 font-mono text-sm">
                <li className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600" size={20} />
                    <span>Premium Box & Manual</span>
                </li>
                <li className="flex items-center gap-3">
                    <Star className="text-yellow-600" size={20} />
                    <span>Transparent Orange Cartridge</span>
                </li>
                <li className="flex items-center gap-3">
                    <Package className="text-blue-600" size={20} />
                    <span>Includes Sticker Pack</span>
                </li>
            </ul>

            <button className="w-full bg-black text-white font-pixel py-4 px-6 border-2 border-black hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all pixel-shadow flex items-center justify-center gap-3">
                <ShoppingCart size={18} />
                <span>VISIT SHOP</span>
            </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mt-12">
        <h4 className="font-pixel text-sm mb-6 border-b-2 border-gray-200 pb-2">Gallery</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 border-2 border-black aspect-square flex items-center justify-center relative hover:bg-gray-200 transition-colors cursor-pointer">
                    <span className="font-pixel text-[10px] text-gray-400">IMG_0{i}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Compatibility Note */}
      <PixelCard variant="info" className="mt-8">
        <div className="text-xs font-mono">
            <strong className="block mb-2 uppercase">Compatibility Check</strong>
            This cartridge is compatible with Game Boy, Game Boy Color, Game Boy Advance, and Analogue Pocket systems. Region free.
        </div>
      </PixelCard>
    </div>
  );
};

export default PhysicalCartridge;
