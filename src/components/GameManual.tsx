import React, { useState } from 'react';
import { Coins, MapPin, Glasses, TrendingUp, Mic2, Landmark, Hash, Ghost, ImageOff, Play, ShoppingCart } from 'lucide-react';
import { Character } from '../types';

/**
 * =============================================================================
 * CHARACTER PORTRAIT IMAGES
 * =============================================================================
 * Place character portrait images in: public/assets/characters/
 * Recommended size: 80x80px or 160x160px (will be displayed at 64-80px)
 * Format: PNG with transparency preferred
 * Style: Pixel art to match game aesthetic
 * =============================================================================
 */
const characters: Character[] = [
  {
    name: 'Samson',
    role: 'Veteran Advocate',
    description: 'A veteran in the space and fervent advocate for Bitcoin technology.',
    color: 'green',
    // IMAGE #1: Samson Mow portrait - public/assets/characters/samson.png
    imageSrc: '/assets/characters/samson.png',
    icon: Glasses
  },
  {
    name: 'Michael',
    role: 'Inflation Hedge',
    description: 'Vocal advocate of Bitcoin as a digital asset and inflation hedge.',
    color: 'green',
    // IMAGE #2: Michael Saylor portrait - public/assets/characters/michael.png
    imageSrc: '/assets/characters/michael.png',
    icon: TrendingUp
  },
  {
    name: 'Max and Stacey',
    role: 'Financial News',
    description: 'Renowned for a financial news show covering topics related to global finance.',
    color: 'green',
    // IMAGE #3: Max Keiser & Stacey Herbert portrait - public/assets/characters/max_stacey.png
    imageSrc: '/assets/characters/max_stacey.png',
    icon: Mic2
  },
  {
    name: 'Nayib',
    role: 'The President',
    description: 'Made a historic impact on Bitcoin establishing it as legal tender in El Salvador.',
    color: 'green',
    // IMAGE #4: Nayib Bukele portrait - public/assets/characters/nayib.png
    imageSrc: '/assets/characters/nayib.png',
    icon: Landmark
  },
  {
    name: 'Adam',
    role: 'OG Cyberpunk',
    description: 'Known for his pioneering work on cryptographic systems.',
    color: 'green',
    // IMAGE #5: Adam Back portrait - public/assets/characters/adam.png
    imageSrc: '/assets/characters/adam.png',
    icon: Hash
  },
  {
    name: 'Faketoshi',
    role: 'Impersonator',
    description: 'Clown or impersonator? Whatever the correct term is, he is not Satoshi.',
    color: 'green',
    // IMAGE #6: Craig Wright (Faketoshi) portrait - public/assets/characters/faketoshi.png
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

/*
  =============================================================================
  COPIARO STORE LINK
  =============================================================================
  Update this URL when the direct product page becomes available.
  =============================================================================
*/
const LINK_COPIARO_STORE = 'https://copiaro.com/brand/hob';

/*
  =============================================================================
  YOUTUBE TRAILER
  =============================================================================
  Video ID: 5puiZFbMUN4
  Full URL: https://www.youtube.com/watch?v=5puiZFbMUN4
  =============================================================================
*/
const YOUTUBE_TRAILER_ID = '5puiZFbMUN4';

const GameManual: React.FC = () => {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="space-y-16">

      {/*
        =========================================================================
        HERO SECTION: COVER + RELEASE TRAILER COMBINED
        =========================================================================
        Prominent header with:
        - Hero of Bitcoin logo with avatar
        - Release trailer (click to play, no autoplay)
        - Copiaro buy overlay appears ONLY after watching trailer
        =========================================================================
      */}
      <div className="bg-yellow-400 border-4 border-black p-6 md:p-8 relative overflow-hidden pixel-shadow">
        {/* Official Seal */}
        <div className="absolute top-2 right-2 z-10">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-300 border-2 border-yellow-600 rounded-full flex items-center justify-center rotate-12">
            <div className="text-[5px] md:text-[6px] font-bold text-yellow-800 text-center leading-tight font-sans">
              Official<br/>Seal
            </div>
          </div>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-6">
          {/*
            =========================================================================
            HERO OF BITCOIN LOGO WITH AVATAR
            =========================================================================
            Location: public/assets/images/HoB_Logo_Avatar.png
            Description: Full logo with Hero character - used in cover/header
            =========================================================================
          */}
          <img
            src="/assets/images/HoB_Logo_Avatar.png"
            alt="Hero of Bitcoin"
            className="mx-auto w-48 md:w-64 h-auto mb-4 drop-shadow-lg"
          />
          <div className="font-bold text-xs tracking-widest uppercase text-yellow-900">Instruction Booklet</div>
        </div>

        {/* Release Trailer */}
        <div className="relative border-4 border-black overflow-hidden bg-black max-w-2xl mx-auto">
          {/* Video Container - 16:9 aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {!showTrailer ? (
              /* Thumbnail with Play Button */
              <div
                className="absolute inset-0 cursor-pointer group"
                onClick={() => setShowTrailer(true)}
              >
                {/* YouTube Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${YOUTUBE_TRAILER_ID}/maxresdefault.jpg`}
                  alt="Hero of Bitcoin - Release Trailer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to hqdefault if maxresdefault not available
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${YOUTUBE_TRAILER_ID}/hqdefault.jpg`;
                  }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                    <Play size={40} className="text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* "Watch Trailer" Text */}
                <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded">
                  <span className="font-pixel text-xs text-white">WATCH TRAILER</span>
                </div>
              </div>
            ) : (
              /* YouTube Embed - Only loads when user clicks */
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_TRAILER_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Hero of Bitcoin - Release Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/*
            =========================================================================
            COPIARO BUY OVERLAY
            =========================================================================
            Only visible AFTER user clicks to watch the trailer
            =========================================================================
          */}
          {showTrailer && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-8 pb-3 px-4 pointer-events-none">
              <a
                href={LINK_COPIARO_STORE}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-pixel py-3 px-6 border-2 border-white shadow-lg hover:scale-105 transition-all mx-auto max-w-xs"
              >
                <ShoppingCart size={18} />
                <span className="text-sm">BUY AT COPIARO</span>
              </a>
              <p className="text-center text-white/70 text-[10px] mt-2 font-mono">
                Our trusted partner for physical cartridges & merchandise
              </p>
            </div>
          )}
        </div>
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
                "You will need to help President Bukele and other bitcoiners to ensure poocoiners, bears, bankers and more do not stand in the way of Bitcoin adoption."
                </div>
            </div>
            
            {/*
              =========================================================================
              GAME SCREENSHOTS SECTION
              =========================================================================
              Location: public/assets/screenshots/
              Size: 160x144px (Game Boy resolution) or 320x288px (2x scaled)
              Format: PNG
              Aspect ratio: 10:9 (Game Boy aspect ratio)
              =========================================================================
            */}
            <div className="flex flex-col gap-4">
                {/*
                  IMAGE #8: SCREENSHOT - TOWN SCENE
                  Location: public/assets/screenshots/town.png
                  Description: Screenshot showing a town/village area in the game
                */}
                <div className="bg-[#e0f8cf] border-4 border-black aspect-video relative flex items-center justify-center pixel-shadow">
                    <MapPin className="text-[#306850]" size={48} />
                    <span className="absolute bottom-1 right-2 font-pixel text-[8px] text-[#071821]">SCENE: TOWN</span>
                </div>
                {/*
                  IMAGE #9: SCREENSHOT - COLLECT/GAMEPLAY SCENE
                  Location: public/assets/screenshots/collect.png
                  Description: Screenshot showing coin/bitcoin collection gameplay
                */}
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
             {/*
               =========================================================================
               GAME BOY IMAGE
               =========================================================================
               Location: public/assets/images/Game_Boy_HoB.jpg
               Description: Custom orange Game Boy with Hero of Bitcoin branding
               Shows button layout: D-Pad, A, B, Select, Start
               =========================================================================
             */}
             <div className="shrink-0">
                <img
                  src="/assets/images/Game_Boy_HoB.jpg"
                  alt="Hero of Bitcoin Game Boy Controls"
                  className="w-48 md:w-56 h-auto pixel-shadow border-4 border-black"
                />
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
