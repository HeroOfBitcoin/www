# Hero of Bitcoin - Website & Product Links Guide

## Website Overview

The Hero of Bitcoin website (heroofbitcoin.xyz) serves as the official product page and digital instruction manual for the Hero of Bitcoin Game Boy game. It features:

- **Release trailer** with embedded YouTube video
- **Game story and controls** documentation
- **Character profiles** for NPCs
- **Four product offerings** with image galleries
- **Partners page** with retail partner information
- **Multi-language support** (English, Spanish, German) via URL parameter
- **RSS feed** for products at `/products.xml`
- **SEO optimization** for search engines and LLMs
- **Direct linking** to specific products

---

## Product Link Configuration

### Current Copiaro Links

| Product | Status | Copiaro URL |
|---------|--------|-------------|
| **Brand Page** | Live | `https://copiaro.com/en/hero-of-bitcoin` |
| **Collector's Edition** | Live | `https://copiaro.com/hero-of-bitcoin-the-game-boxed-gameboy-version-batch2-en` |
| **Digital Edition** | Live | `https://copiaro.com/en/hero-of-bitcoin-digital-version-v2` |
| **Hero Handheld** | Live | `https://copiaro.com/en/hero-of-bitcoin-handheld-version-v2` |
| **Stackchain Magazine** | Pending | Points to brand page |
| **Fan Merchandise** | Pending | Points to brand page |

### Where to Update Links

**File:** `src/components/Products.tsx`
```typescript
const LINK_BRAND_PAGE = 'https://copiaro.com/en/hero-of-bitcoin';
const LINK_PHYSICAL_CARTRIDGE = 'https://copiaro.com/hero-of-bitcoin-the-game-boxed-gameboy-version-batch2-en';
const LINK_MICROSD_CARTRIDGE = 'https://copiaro.com/en/hero-of-bitcoin-digital-version-v2';
const LINK_R36S_DEVICE = 'https://copiaro.com/en/hero-of-bitcoin-handheld-version-v2';
const LINK_STACKCHAIN_MAGAZINE = LINK_BRAND_PAGE; // TODO: Update when available
```

**File:** `src/App.tsx`
```typescript
const LINK_STORE_MAIN = 'https://copiaro.com/en/hero-of-bitcoin';
const LINK_FAN_SWAG = 'https://copiaro.com/en/hero-of-bitcoin'; // TODO: Update when available
```

---

## Product Details

### 1. Collector's Edition
- **Target:** Collectors, Game Boy enthusiasts
- **Contents:** Physical orange Game Boy cartridge, premium box, manual, sticker, protective box cover
- **Limitation:** ~450 units worldwide
- **Compatibility:** Game Boy, GBC, GBA, Analogue Pocket
- **Special:** ROM available on request
- **Direct Link:** `heroofbitcoin.xyz/#collectors-edition`
- **Copiaro:** `copiaro.com/hero-of-bitcoin-the-game-boxed-gameboy-version-batch2-en`

### 2. Digital Edition
- **Target:** Budget-conscious buyers, emulator users
- **Contents:** Decorative cartridge collectible, microSD with ROM, box, manual, sticker, protective box cover
- **Compatibility:** Raspberry Pi, MiSTer FPGA, RetroArch, any GB emulator
- **Direct Link:** `heroofbitcoin.xyz/#digital-edition`
- **Copiaro:** `copiaro.com/en/hero-of-bitcoin-digital-version-v2`

### 3. Hero Handheld
- **Target:** Casual gamers, gift buyers
- **Contents:** R36S handheld console with Hero of Bitcoin pre-installed, microSD, sticker
- **Features:** ArkOS, ready to play out of box
- **Note:** Supports other retro systems (copyright disclaimer included)
- **Direct Link:** `heroofbitcoin.xyz/#hero-handheld`
- **Copiaro:** `copiaro.com/en/hero-of-bitcoin-handheld-version-v2`

### 4. Stackchain Magazine
- **Target:** Collectors, Bitcoin enthusiasts
- **Contents:** Stackchain Magazine Round 5, fine art print (alt cover), premium protective toploader
- **Limitation:** 30 prints worldwide
- **Special:** Exclusive creator interview
- **Direct Link:** `heroofbitcoin.xyz/#stackchain-magazine`
- **Copiaro:** Pending

---

## Partners

### Copiaro
- **Website:** `https://copiaro.com`
- **Role:** Primary fulfillment partner, international shipping
- **Products:** All Hero of Bitcoin products

### Plebstyle
- **Website:** `https://plebstyle.com`
- **Role:** EU-focused partner, community-driven
- **Products:** Select Hero of Bitcoin merchandise

---

## Direct Links for Marketing

### Product Pages

| Purpose | URL |
|---------|-----|
| Homepage | `https://heroofbitcoin.xyz` |
| All Products | `https://heroofbitcoin.xyz/#products` |
| Partners | `https://heroofbitcoin.xyz/#partners` |
| Collector's Edition | `https://heroofbitcoin.xyz/#collectors-edition` |
| Digital Edition | `https://heroofbitcoin.xyz/#digital-edition` |
| Hero Handheld | `https://heroofbitcoin.xyz/#hero-handheld` |
| Stackchain Magazine | `https://heroofbitcoin.xyz/#stackchain-magazine` |
| Play Demo | `https://demo.heroofbitcoin.xyz` |
| RSS Feed | `https://heroofbitcoin.xyz/products.xml` |

### Localized Links

Add `?lang=` parameter for language-specific pages:

| Language | Products Page | Partners Page |
|----------|---------------|---------------|
| English | `heroofbitcoin.xyz/#products` | `heroofbitcoin.xyz/#partners` |
| German | `heroofbitcoin.xyz/?lang=de#products` | `heroofbitcoin.xyz/?lang=de#partners` |
| Spanish | `heroofbitcoin.xyz/?lang=es#products` | `heroofbitcoin.xyz/?lang=es#partners` |

---

## Social Media Links

- **Email:** HeroOfBitcoin@pm.me
- **Instagram:** instagram.com/heroofbitcoin
- **X (Twitter):** x.com/HeroOfBitcoin
- **YouTube:** youtube.com/@HeroOfBitcoin

---

## Action Items for Copiaro

1. ~~Create Digital Edition product page~~ Done
2. ~~Create Hero Handheld product page~~ Done
3. ~~Create Collector's Edition product page~~ Done
4. Create Stackchain Magazine product page
5. (Optional) Create merchandise category page for cups, shirts, caps
