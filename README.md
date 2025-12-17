
# Hero of Bitcoin - Official Website

The official website for **Hero of Bitcoin** featuring a retro-styled digital instruction booklet and an unofficial quick-start companion guide for the **R36S** handheld device. Built with React, TypeScript, Tailwind CSS, and Vite.

**Live at:** [heroofbitcoin.xyz](https://heroofbitcoin.xyz)

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Local Development

Start the local development server:

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### 3. Build for Production

```bash
npm run build
```

This will:
1. Auto-generate the RSS feed (`public/products.xml`)
2. Run TypeScript compilation
3. Build with Vite

### 4. Generate RSS Feed Only

```bash
npm run generate:rss
```

---

## Features

- **Multi-language support** (EN, ES, DE) via URL parameter (`?lang=de`)
- **Products page** with 4 product offerings
- **Partners page** with retail partner information
- **RSS feed** for products (`/products.xml`)
- **Direct linking** to specific products via hash URLs
- **SEO optimization** with structured data for search engines and LLMs

---

## Adding/Updating Products

Products are defined in a single source of truth:

**File:** `src/data/products.ts`

When you add or modify products:
1. Update the `products` array in `src/data/products.ts`
2. Update translations in `src/i18n/translations.ts`
3. Update the ProductCard in `src/components/Products.tsx`
4. Run `npm run build` - RSS feed updates automatically

---

## URL Structure

### Direct Links

| Page | URL |
|------|-----|
| Homepage | `heroofbitcoin.xyz` |
| Products | `heroofbitcoin.xyz/#products` |
| Partners | `heroofbitcoin.xyz/#partners` |
| Collector's Edition | `heroofbitcoin.xyz/#collectors-edition` |
| Digital Edition | `heroofbitcoin.xyz/#digital-edition` |
| Hero Handheld | `heroofbitcoin.xyz/#hero-handheld` |
| Stackchain Magazine | `heroofbitcoin.xyz/#stackchain-magazine` |

### Localized Links

Add `?lang=` parameter for language-specific links:
- `heroofbitcoin.xyz/?lang=de#products` (German)
- `heroofbitcoin.xyz/?lang=es#partners` (Spanish)

---

## Adding Assets

Place images in the public folder. See source files for detailed comments:

**Character Portraits** (`public/assets/characters/`):
- `samson.png`, `michael.png`, `max_stacey.png`, `nayib.png`, `adam.png`, `faketoshi.png`

**Screenshots** (`public/assets/screenshots/`):
- `town.png`, `collect.png`

**Product Images** (`public/assets/product/`):
- `cartridge/1.webp, 2.webp, 3.webp` - Collector's Edition
- `microsd/1.webp, 2.png, 3.png` - Digital Edition
- `bundles/1.webp, 2.webp, 3.webp` - Hero Handheld
- `magazine/1.png, 2.png, 3.png` - Stackchain Magazine

**Partner Logos** (`public/assets/partners/`):
- `copiaro.jpeg`, `plebstyle.jpeg`

---

## Deployment

This project auto-deploys to GitHub Pages via GitHub Actions on every push to `main`.

**Domain:** heroofbitcoin.xyz

### Configuration

- `vite.config.ts` - Base path set to `/` for custom domain
- `public/CNAME` - Contains `heroofbitcoin.xyz`
- `.github/workflows/deploy.yml` - GitHub Actions workflow

---

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Fonts:** Press Start 2P (Headers), Inter (Body), Roboto Mono (Data)

## Copyright

©2022-2025 Hero of Bitcoin. All rights reserved.
