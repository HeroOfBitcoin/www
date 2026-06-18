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
    id: 'instant-download',
    title: 'Instant Download - ROM + PDF Bundle',
    description: 'Pay with Bitcoin or Lightning and unlock a private ZIP download containing the Game Boy ROM and PDF manual. No email required. Works on Raspberry Pi, MiSTer FPGA, RetroArch, or any compatible Game Boy emulator.',
    pubDate: '2024-01-01',
    availability: 'available',
  },
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
    title: 'Digital Edition - Boxed microSD Bundle',
    description: 'Physical boxed edition for emulator players. Includes premium box, manual, microSD with the game ROM, decorative cartridge collectible, sticker, and protective box cover.',
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
    title: 'Stackchain Magazine - Limited Edition Bundle',
    description: 'Limited to 30 prints. Includes Stackchain Magazine Round 5, fine art print with alternative Hero of Bitcoin cover, premium protective toploader, and Hero of Bitcoin digital game download.',
    pubDate: '2024-12-17',
    availability: 'limited',
    limitedQuantity: 30,
  },
];

export const SITE_URL = 'https://heroofbitcoin.xyz';
