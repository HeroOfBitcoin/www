
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

### 3. Adding Assets

Before building, ensure you have placed your images in the public folder. See the source files for detailed comments on each image location:

**Character Portraits** (`public/assets/characters/`):
- `samson.png` - Samson Mow portrait (80x80px or 160x160px)
- `michael.png` - Michael Saylor portrait
- `max_stacey.png` - Max & Stacey portrait
- `nayib.png` - Nayib Bukele portrait
- `adam.png` - Adam Back portrait
- `faketoshi.png` - Faketoshi portrait

**Screenshots** (`public/assets/screenshots/`):
- `town.png` - Town scene screenshot (160x144px or 320x288px)
- `collect.png` - Collect/gameplay screenshot

**Cover & Logo** (`public/assets/`):
- `cover-logo.png` - Main game logo (128x128px)

**Device** (`public/assets/device/`):
- `r36s-custom.png` - Custom R36S device photo (300x200px or 600x400px)

**Product Images** (`public/assets/product/`):
- `box-art.png` - Main product box art (400x400px or 800x800px)
- `gallery/gallery-01.png` - Gallery image 1
- `gallery/gallery-02.png` - Gallery image 2
- `gallery/gallery-03.png` - Gallery image 3

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
