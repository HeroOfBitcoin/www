/*
  =============================================================================
  PRODUCTS DATA
  =============================================================================
  Single source of truth for all product information.
  Used by both the Products component and RSS feed generator.
  =============================================================================
*/

export interface Product {
  id: string;
  title: string;
  description: string;
  pubDate: string; // ISO date string
  availability?: 'limited' | 'available';
  limitedQuantity?: number;
}

export const products: Product[] = [
  {
    id: 'collectors-edition',
    title: "Collector's Edition - Physical Game Boy Cartridge",
    description: 'Limited to ~450 units. A tangible piece of Bitcoin history, playable on original hardware. Includes premium box, manual, orange Game Boy cartridge, sticker, and protective box cover. Compatible with Game Boy, GBC, GBA, and Analogue Pocket.',
    pubDate: '2024-01-01',
    availability: 'limited',
    limitedQuantity: 450,
  },
  {
    id: 'digital-edition',
    title: 'Digital Edition - microSD Cartridge',
    description: 'Play anywhere. The perfect collectible for emulator enthusiasts. No Game Boy required. Includes premium box, manual, microSD with game ROM, decorative cartridge collectible, sticker, and protective box cover. Play on Raspberry Pi, MiSTer FPGA, RetroArch, or any Game Boy emulator.',
    pubDate: '2024-01-01',
    availability: 'available',
  },
  {
    id: 'hero-handheld',
    title: 'Hero Handheld - R36S Console Bundle',
    description: 'Ready to play. Hero of Bitcoin pre-installed. Power on and play instantly. Includes ArkOS pre-installed, microSD card, and sticker. Also supports GB, GBC, GBA, NES, SNES, Genesis, PS1, and more.',
    pubDate: '2024-01-01',
    availability: 'available',
  },
  {
    id: 'stackchain-magazine',
    title: 'Stackchain Magazine - Limited Edition Print',
    description: 'Limited to 30 prints. Exclusive interview with the creator, plus fine art print with alternative Hero of Bitcoin cover. Includes Stackchain Magazine Round 5, fine art print, and premium protective toploader.',
    pubDate: '2024-12-17',
    availability: 'limited',
    limitedQuantity: 30,
  },
];

export const SITE_URL = 'https://heroofbitcoin.xyz';
