import React, { useState } from 'react';
import { Glasses, TrendingUp, Mic2, Landmark, Hash, Ghost, ImageOff, Play, ShoppingCart, BookOpen } from 'lucide-react';
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
  {
    name: 'Saifedean',
    role: 'The Economist',
    description: 'Author of The Bitcoin Standard, advocating for sound money principles.',
    color: 'green',
    // IMAGE #7: Saifedean Ammous portrait - public/assets/characters/saifedean.png
    imageSrc: '/assets/characters/saifedean.png',
    icon: BookOpen
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
        HERO SECTION: COVER + TRAILER COMBINED
        =========================================================================
        Single cohesive yellow section with:
        - Logo and title at top
        - Embedded trailer video
        - Copiaro buy button at bottom
        - Official seal badge
        =========================================================================
      */}
      <div className="bg-yellow-400 border-4 border-black p-6 md:p-8 relative overflow-hidden pixel-shadow">
        {/*
          =========================================================================
          OFFICIAL SEAL
          =========================================================================
          Location: public/assets/images/seal.png
          =========================================================================
        */}
        <div className="absolute top-2 right-2 z-10">
          <img
            src="/assets/images/seal.png"
            alt="Official Bitcoin Seal of Quality"
            className="w-16 h-16 md:w-20 md:h-20 rotate-12 drop-shadow-md"
          />
        </div>

        {/* Logo */}
        <div className="text-center mb-4">
          {/*
            =========================================================================
            HERO OF BITCOIN LOGO WITH AVATAR
            =========================================================================
            Location: public/assets/images/HoB_Logo_Avatar.png
            =========================================================================
          */}
          <img
            src="/assets/images/HoB_Logo_Avatar.png"
            alt="Hero of Bitcoin"
            className="mx-auto w-28 md:w-32 h-auto"
          />
        </div>

        {/* Release Trailer - Embedded in cover */}
        <div className="border-4 border-black overflow-hidden bg-black">
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
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${YOUTUBE_TRAILER_ID}/hqdefault.jpg`;
                  }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* "Watch Trailer" Label */}
                <div className="absolute top-3 left-3 bg-yellow-400 px-2 py-1 border-2 border-black">
                  <span className="font-pixel text-[10px] text-black">WATCH TRAILER</span>
                </div>
              </div>
            ) : (
              /* YouTube Embed */
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
        </div>

        {/* Copiaro Buy Button - Integrated into cover */}
        <a
          href={LINK_COPIARO_STORE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-pixel py-3 px-6 border-2 border-black mt-4 hover:scale-[1.02] transition-all w-full"
        >
          <ShoppingCart size={18} />
          <span className="text-sm">BUY AT COPIARO</span>
        </a>
        <p className="text-center text-yellow-800 text-[10px] mt-2 font-mono">
          Our trusted partner for physical cartridges & merchandise
        </p>
      </div>

      {/* SECTION 2: STORY */}
      <div>
        <h2 className="font-pixel text-xl border-b-4 border-black mb-6 pb-2">The Story</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm font-sans leading-relaxed text-gray-900 text-justify">
                <p>
                <strong className="font-bold">Hero of Bitcoin</strong> the game is a story inspired by Bitcoin culture and is set in the beautiful Bitcoin-sovereign nation of El Salvador. You will be taken to iconic places such as Bitcoin Beach, the volcano and more, all the way to the bank's doorstep.
                </p>
                <p>
                The game follows the journey of a young man called <strong className="text-red-600">Hero</strong>, a new bitcoiner, who journeys to El Salvador wanting to help the Bitcoin fight on the frontlines. You will need to help President Bukele and other bitcoiners to ensure poocoiners, bears, bankers and more do not stand in the way of Bitcoin adoption.
                </p>
            </div>
            
            {/*
              =========================================================================
              GAME SCENES
              =========================================================================
              Location: public/assets/images/scenes/
              =========================================================================
            */}
            <div className="flex flex-col gap-3">
                {/* Art Gallery Scene */}
                <div className="border-4 border-black pixel-shadow overflow-hidden">
                    <img
                        src="/assets/images/scenes/gallery_color.png"
                        alt="Hero of Bitcoin Art Gallery"
                        className="w-full h-auto"
                    />
                </div>
                {/* Shiitake Coin Scene - poking fun at altcoins */}
                <div className="border-4 border-black pixel-shadow overflow-hidden">
                    <img
                        src="/assets/images/scenes/shiitake_color.jpg"
                        alt="Shiitake Coin - Go Down Tech"
                        className="w-full h-auto"
                    />
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
                <dl className="grid grid-cols-2 gap-y-3">
                    <dt className="text-gray-500">Pixelart</dt>
                    <dd className="font-bold">Hero of Bitcoin</dd>

                    <dt className="text-gray-500">Programming</dt>
                    <dd className="font-bold">Hero of Bitcoin</dd>

                    <dt className="text-gray-500">Music</dt>
                    <dd className="font-bold">Mr. V</dd>

                    <dt className="text-gray-500">Sound FX</dt>
                    <dd className="font-bold">Coffee 'Valen' - Bat</dd>

                    <dt className="text-gray-500">Community supporters</dt>
                    <dd className="font-bold">Geyser team & <span className="text-yellow-600">YOU</span></dd>
                </dl>
                <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                    <span className="block text-gray-500 mb-2">Sponsored by</span>
                    <a
                        href="https://base58.info"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-pixel text-[10px] hover:text-yellow-600 transition-colors"
                    >
                        Base58⛓️🔓
                    </a>
                </div>
            </div>
         </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="text-[10px] text-gray-400 font-mono leading-relaxed border-t border-gray-200 pt-6">
        <p className="mb-2">
          Please note that the 'Game Boy©' name is mentioned to demonstrate console compatibility.
          All trademarks are the property of their respective owners.
        </p>
        <p>
          This game can be played on Game Boy©, Game Boy Color©, Game Boy Advance©, Super Game Boy©
          and Analogue Pocket©. <strong className="text-gray-500">This game is not licensed by Nintendo©.</strong>
        </p>
      </div>

    </div>
  );
};

export default GameManual;
