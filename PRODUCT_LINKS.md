# Hero of Bitcoin - Website & Product Links Guide

## Website Overview

The Hero of Bitcoin website (heroofbitcoin.xyz) serves as the official product page and digital instruction manual for the Hero of Bitcoin Game Boy game. It features:

- **Release trailer** with embedded YouTube video
- **Game story and controls** documentation
- **Character profiles** for NPCs
- **Three product offerings** with image galleries
- **Multi-language support** (English, Spanish, German)
- **SEO optimization** for search engines and LLMs
- **Direct linking** to specific products

---

## Product Link Structure

Each product needs a dedicated URL on Copiaro. Update these constants in the codebase when individual product pages become available:

### Current Configuration
All products currently point to the brand page: `https://copiaro.com/brand/hob`

### Required Product Links

| Product | Current Link | Needed Link Format |
|---------|--------------|-------------------|
| **Collector's Edition** | `https://copiaro.com/brand/hob` | `https://copiaro.com/product/[collectors-edition-slug]` |
| **Digital Edition** | `https://copiaro.com/brand/hob` | `https://copiaro.com/product/[digital-edition-slug]` |
| **Hero Handheld** | `https://copiaro.com/brand/hob` | `https://copiaro.com/product/[hero-handheld-slug]` |
| **Fan Merchandise** | `https://copiaro.com/brand/hob` | `https://copiaro.com/category/[merchandise-slug]` |

### Where to Update Links

**File:** `src/components/Products.tsx` (lines 16-18)
```typescript
const LINK_PHYSICAL_CARTRIDGE = 'https://copiaro.com/brand/hob'; // Collector's Edition
const LINK_R36S_DEVICE = 'https://copiaro.com/brand/hob';        // Hero Handheld
const LINK_MICROSD_CARTRIDGE = 'https://copiaro.com/brand/hob';  // Digital Edition
```

**File:** `src/App.tsx` (lines 18-19)
```typescript
const LINK_STORE_MAIN = 'https://copiaro.com/brand/hob';  // Main store/brand page
const LINK_FAN_SWAG = 'https://copiaro.com/brand/hob';    // Merchandise category
```

---

## Product Details

### 1. Collector's Edition
- **Target:** Collectors, Game Boy enthusiasts
- **Contents:** Physical orange Game Boy cartridge, premium box, manual, sticker
- **Limitation:** ~450 units worldwide
- **Compatibility:** Game Boy, GBC, GBA, Analogue Pocket
- **Special:** ROM available on request
- **Direct Link:** `heroofbitcoin.xyz/#collectors-edition`

### 2. Digital Edition
- **Target:** Budget-conscious buyers, emulator users
- **Contents:** Decorative cartridge collectible, microSD with ROM, box, manual, sticker
- **Compatibility:** Raspberry Pi, MiSTer FPGA, RetroArch, any GB emulator
- **Direct Link:** `heroofbitcoin.xyz/#digital-edition`

### 3. Hero Handheld
- **Target:** Casual gamers, gift buyers
- **Contents:** R36S handheld console with Hero of Bitcoin pre-installed, microSD, sticker
- **Features:** ArkOS, ready to play out of box
- **Note:** Supports other retro systems (copyright disclaimer included)
- **Direct Link:** `heroofbitcoin.xyz/#hero-handheld`

---

## Direct Links for Marketing

Use these URLs in marketing materials:

| Purpose | URL |
|---------|-----|
| Homepage | `https://heroofbitcoin.xyz` |
| All Products | `https://heroofbitcoin.xyz/#products` |
| Collector's Edition | `https://heroofbitcoin.xyz/#collectors-edition` |
| Digital Edition | `https://heroofbitcoin.xyz/#digital-edition` |
| Hero Handheld | `https://heroofbitcoin.xyz/#hero-handheld` |
| Play Demo | `https://demo.heroofbitcoin.xyz` |

---

## Language Support

The website supports three languages with pixel-art flag buttons:
- **English** (default)
- **Spanish** (Español)
- **German** (Deutsch)

All product descriptions, UI text, and content are fully translated.

---

## Social Media Links

- **Email:** HeroOfBitcoin@pm.me
- **Instagram:** instagram.com/heroofbitcoin
- **X (Twitter):** x.com/HeroOfBitcoin
- **YouTube:** youtube.com/@HeroOfBitcoin

---

## Action Items for Copiaro

1. Create individual product pages for each of the 3 products
2. Provide the direct product URLs
3. Update the link constants in the codebase
4. (Optional) Create a merchandise category page for cups, shirts, caps
