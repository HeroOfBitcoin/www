import React, { useState } from 'react';
import PixelCard from './ui/PixelCard';
import { Coins, MapPin, Sword, Glasses, TrendingUp, Mic2, Landmark, Hash, Ghost, LucideIcon, ImageOff } from 'lucide-react';
import { Character } from '../types';

const characters: Character[] = [
  { 
    name: 'Samson', 
    role: 'Veteran Advocate', 
    description: 'A veteran in the space and fervent advocate for Bitcoin technology.', 
    color: 'green',
    imageSrc: '/assets/characters/samson.png',
    icon: Glasses
  },
  { 
    name: 'Michael', 
    role: 'Inflation Hedge', 
    description: 'Vocal advocate of Bitcoin as a digital asset and inflation hedge.', 
    color: 'green',
    imageSrc: '/assets/characters/michael.png',
    icon: TrendingUp
  },
  { 
    name: 'Max and Stacey', 
    role: 'Financial News', 
    description: 'Renowned for a financial news show covering topics related to global finance.', 
    color: 'green',
    imageSrc: '/assets/characters/max_stacey.png',
    icon: Mic2
  },
  { 
    name: 'Nayib', 
    role: 'The President', 
    description: 'Made a historic impact on Bitcoin establishing it as legal tender in El Salvador.', 
    color: 'green',
    imageSrc: '/assets/characters/nayib.png',
    icon: Landmark
  },
  { 
    name: 'Adam', 
    role: 'OG Cyberpunk', 
    description: 'Known for his pioneering work on cryptographic systems.', 
    color: 'green',
    imageSrc: '/assets/characters/adam.png',
    icon: Hash
  },
  { 
    name: 'Faketoshi', 
    role: 'Impersonator', 
    description: 'Clown or impersonator? Whatever the correct term is, he is not Satoshi.', 
    color: 'green',
    imageSrc: '/assets/characters/faketoshi.png',
    icon: Ghost
  },
];

const CharacterPortrait: React.FC<{ char: Character }> = ({ char }) => {
    const [imgError, setImgError] = useState(false);
    const Icon = char.icon || ImageOff;
  
    return (
      <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-[#e0f8cf] border-2 border-black flex items-center justify-center pixel-shadow-sm overflow-hidden relative group">
          {!imgError && char.imageSrc ? (
              <img 
                  src={char.imageSrc} 
                  alt={char.name} 
                  className="w-full h-full object-cover rendering-pixelated"
                  onError={() => setImgError(true)}
              />
          ) : (
              <div className="flex flex-col items-center justify-center text-[#306850] opacity-80">
                  <Icon size={24} strokeWidth={2.5} />
              </div>
          )}
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_2px] pointer-events-none"></div>
      </div>
    );
};

const GameManual: React.FC = () => {
  return (
    <div className="space-y-16">
      
      {/* SECTION 1: COVER (Yellow Style inside the white page flow for emphasis) */}
      <div className="bg-yellow-400 border-4 border-black p-8 text-center relative overflow-hidden pixel-shadow transform rotate-1">
        <div className="absolute top-2 right-2">
             <div className="w-16 h-16 bg-yellow-300 border-2 border-yellow-600 rounded-full flex items-center justify-center rotate-12">
                <div className="text-[6px] font-bold text-yellow-800 text-center leading-tight font-sans">
                    Official<br/>Seal
                </div>
             </div>
        </div>
        
        <div className="mx-auto w-32 h-32 bg-[#e0f8cf] border-4 border-black mb-4 flex items-center justify-center pixel-shadow">
             <Sword size={48} className="text-[#071821]" />
        </div>

        <h1 className="font-pixel text-3xl text-red-600 mb-2 drop-shadow-[2px_2px_0_black]">
          HERO OF<br/>BITCOIN
        </h1>
        <div className="font-bold text-xs tracking-widest uppercase">Instruction Booklet</div>
      </div>

      {/* SECTION 2: STORY */}
      <div>
        <h2 className="font-pixel text-xl border-b-4 border-black mb-6 pb-2">The Story</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm font-sans leading-relaxed text-gray-900 text-justify">
                <p>
                <strong className="font-bold">Hero of Bitcoin</strong> the game is a story inspired by Bitcoin culture and is set in the beautiful Bitcoin-sovereign nation of <strong className="bg-yellow-200 px-1 border border-black text-xs uppercase">El Salvador</strong>. You will be taken to iconic places such as Bitcoin Beach, the volcano and more, all the way to the bank's doorstep.
                </p>
                <p>
                The game follows the journey of a young man called <strong className="text-red-600">Hero</strong>, a new bitcoiner, who journeys to El Salvador wanting to help the Bitcoin fight on the frontlines.
                </p>
                <div className="bg-gray-100 p-4 border-l-4 border-black text-xs italic text-gray-700 mt-4 font-mono">
                "You will need to help President Bukele and other bitcoiners to ensure sh*tcoiners, bears, bankers and more do not stand in the way of Bitcoin adoption."
                </div>
            </div>
            
            {/* Screenshots */}
            <div className="flex flex-col gap-4">
                <div className="bg-[#e0f8cf] border-4 border-black aspect-video relative flex items-center justify-center pixel-shadow">
                    <MapPin className="text-[#306850]" size={48} />
                    <span className="absolute bottom-1 right-2 font-pixel text-[8px] text-[#071821]">SCENE: TOWN</span>
                </div>
                <div className="bg-[#e0f8cf] border-4 border-black aspect-video relative flex items-center justify-center pixel-shadow">
                    <Coins className="text-[#306850]" size={48} />
                    <span className="absolute bottom-1 right-2 font-pixel text-[8px] text-[#071821]">SCENE: COLLECT</span>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 3: CONTROLS */}
      <div>
         <h2 className="font-pixel text-xl border-b-4 border-black mb-6 pb-2">Controls</h2>
         <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
             {/* Game Boy Illustration */}
             <div className="w-48 h-72 bg-yellow-400 border-4 border-black rounded-lg relative pixel-shadow shadow-xl shrink-0">
                <div className="absolute top-4 left-4 right-4 h-32 bg-gray-700 rounded-t-lg border-2 border-black flex items-center justify-center">
                    <div className="w-32 h-24 bg-[#9bbc0f] border-2 border-black shadow-inner flex flex-col items-center justify-center">
                        <span className="font-pixel text-[6px] text-[#0f380f]">PAUSED</span>
                    </div>
                </div>
                {/* D-Pad */}
                <div className="absolute top-48 left-4 w-12 h-12">
                    <div className="w-4 h-12 bg-black absolute left-4 rounded-sm"></div>
                    <div className="w-12 h-4 bg-black absolute top-4 rounded-sm"></div>
                </div>
                {/* AB Buttons */}
                <div className="absolute top-52 right-4 flex gap-2 transform rotate-[-15deg]">
                    <div className="w-6 h-6 bg-red-600 rounded-full border-b-2 border-red-800"></div>
                    <div className="w-6 h-6 bg-red-600 rounded-full border-b-2 border-red-800"></div>
                </div>
                {/* Start/Select */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <div className="w-8 h-3 bg-black rounded-full transform rotate-12"></div>
                    <div className="w-8 h-3 bg-black rounded-full transform rotate-12"></div>
                </div>
             </div>
             
             {/* Key Map */}
             <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                {[
                    { btn: 'A Button', desc: 'Confirm, Jump, Talk', color: 'bg-red-500' },
                    { btn: 'B Button', desc: 'Run, Sword', color: 'bg-red-500' },
                    { btn: 'Start', desc: 'Pause', color: 'bg-black' },
                    { btn: 'Select', desc: 'Unused', color: 'bg-black' },
                    { btn: 'D-Pad', desc: 'Move, Climb, Enter', color: 'bg-black' }
                ].map((c) => (
                    <div key={c.btn} className="flex items-center gap-4 border-b border-gray-200 pb-2">
                        <span className={`px-2 py-1 text-white text-[10px] font-bold min-w-[60px] text-center rounded ${c.color}`}>{c.btn}</span>
                        <span className="font-mono text-xs uppercase text-gray-700">{c.desc}</span>
                    </div>
                ))}
             </div>
         </div>
      </div>

      {/* SECTION 4: CHARACTERS */}
      <div>
         <h2 className="font-pixel text-xl border-b-4 border-black mb-6 pb-2">Non Player Characters</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {characters.map((char) => (
                <div key={char.name} className="flex gap-4 p-4 border-2 border-transparent hover:border-black transition-colors bg-white">
                    <CharacterPortrait char={char} />
                    <div>
                        <h4 className="font-bold text-black font-sans text-base uppercase">{char.name}</h4>
                        <p className="text-xs text-gray-600 font-mono leading-tight mt-1">
                            {char.description}
                        </p>
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* SECTION 5: TIPS & CREDITS */}
      <div className="grid md:grid-cols-2 gap-12 pt-8 border-t-4 border-black">
         <div>
            <h3 className="font-pixel text-lg mb-4">Tips</h3>
            <ul className="space-y-6">
                <li className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold font-serif shrink-0">?</div>
                    <div className="text-sm">
                        <strong className="block font-bold mb-1">Collecting Bitcoin</strong>
                        There are 21 bitcoin hidden throughout the game. Can you find them all?
                    </div>
                </li>
                <li className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold font-serif shrink-0">!</div>
                    <div className="text-sm">
                        <strong className="block font-bold mb-1">Getting Stuck</strong>
                        Talk to every NPC. They often have clues about where to go next.
                    </div>
                </li>
            </ul>
         </div>
         
         <div>
            <h3 className="font-pixel text-lg mb-4">Credits</h3>
            <div className="bg-gray-100 p-6 font-mono text-xs border-2 border-black pixel-shadow-sm">
                <dl className="grid grid-cols-2 gap-y-2">
                    <dt className="text-gray-500">Pixelart</dt>
                    <dd className="font-bold">Hero of Bitcoin</dd>
                    
                    <dt className="text-gray-500">Music</dt>
                    <dd className="font-bold">Mr. V</dd>
                    
                    <dt className="text-gray-500">Sound FX</dt>
                    <dd className="font-bold">Coffee 'Valen'</dd>
                </dl>
                <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                    <span className="block text-gray-500 mb-2">Sponsored by</span>
                    <strong className="font-pixel text-[10px]">BASE58 School of Engineering</strong>
                </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default GameManual;
