# Hero of Bitcoin - Official Website

Public React/Vite frontend for [heroofbitcoin.xyz](https://heroofbitcoin.xyz).

This repo now includes:

- the live homepage and product page
- the public `Instant Download` BTC/LN product entry point
- the direct `Stackchain Magazine` bundle checkout entry point
- the public success/download page
- the optional `checkout-test.html` test surface
- the rest of the Hero of Bitcoin marketing site

## Current Stable Snapshot

As of `2026-07-15`:

- Stable frontend tag: `stable-www-2026-04-03`
- Stable backend tag: `stable-digital-hosted-2026-04-03`
- Latest known successful Pages deploy should be checked with:
  - `gh run list --repo HeroOfBitcoin/www --workflow deploy.yml --limit 1`
- Public site: [heroofbitcoin.xyz](https://heroofbitcoin.xyz)
- Success page: [heroofbitcoin.xyz/success.html](https://heroofbitcoin.xyz/success.html)
- Test checkout page: [heroofbitcoin.xyz/checkout-test.html](https://heroofbitcoin.xyz/checkout-test.html)

## Fresh Session Checklist

When starting after a break, use the repo state and live checks instead of old chat context:

1. Check both repos are clean:
   - `git status --short --branch`
   - `git -C ../digital-hosted status --short --branch`
2. Confirm the stable tags:
   - `git show --no-patch stable-www-2026-04-03`
   - `git -C ../digital-hosted show --no-patch stable-digital-hosted-2026-04-03`
3. Verify backend health:
   - `curl -s https://hero-of-bitcoin-digital.fly.dev/healthz`
4. Check the latest Pages workflow run:
   - `gh run list --repo HeroOfBitcoin/www --workflow deploy.yml --limit 1`
5. Read the current follow-up list:
   - `TODO.md`

## Repo Visibility

This repo is public because the current deployment model uses GitHub Pages.

- Do not change repo visibility without explicit approval
- Do not put secrets in this repo
- Payment and storage secrets belong in the backend/Fly environment only

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Local Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the site locally.

### 3. Build for Production

```bash
npm run build
```

This build:

1. verifies locale keys, arrays, and placeholders
2. regenerates `public/products.xml`
3. runs TypeScript compilation
4. builds the Vite app

### 4. Preview the Production Build

```bash
npm run preview
```

## Product Architecture

The site now distinguishes clearly between:

- `Instant Download` = site-owned Bitcoin + Lightning checkout for the ROM + PDF bundle
- `Digital Edition` = boxed physical microSD bundle sold externally
- `Collector's Edition` = physical cartridge sold externally
- `Hero Handheld` = physical product sold externally
- `Stackchain Magazine` = site-owned magazine + digital game bundle with selected shipping included in one Bitcoin/Lightning invoice
- `Graded Copy` = site-owned CGC 9.9 collector copy + digital game bundle with selected shipping included in one Bitcoin/Lightning invoice

Do not merge `Instant Download` and `Digital Edition` back into one product concept.

Website translations do not change the game ROM language. The game itself is currently available in English only; a new launcher is in development.

## Key Pages and URLs

| Page | URL |
|------|-----|
| Homepage | `https://heroofbitcoin.xyz/` |
| Products section | `https://heroofbitcoin.xyz/#products` |
| Partners section | `https://heroofbitcoin.xyz/#partners` |
| Instant Download | `https://heroofbitcoin.xyz/#instant-download` |
| Collector's Edition | `https://heroofbitcoin.xyz/#collectors-edition` |
| Digital Edition | `https://heroofbitcoin.xyz/#digital-edition` |
| Stackchain Magazine | `https://heroofbitcoin.xyz/#stackchain-magazine` |
| Graded Copy | `https://heroofbitcoin.xyz/#graded-copy` |
| Success page | `https://heroofbitcoin.xyz/success.html` |
| Test checkout page | `https://heroofbitcoin.xyz/checkout-test.html` |

Localized URLs work with `?lang=de`, `?lang=es`, `?lang=fr`, or `?lang=ko`.

## High-Signal Files

- `src/App.tsx`
- `src/components/GameManual.tsx`
- `src/components/Products.tsx`
- `src/SuccessPage.tsx`
- `src/TestCheckoutPage.tsx`
- `src/i18n/translations.ts`
- `src/i18n/fr.ts`
- `src/i18n/ko.ts`
- `src/lib/api.ts`
- `vite.config.ts`
- `.github/workflows/deploy.yml`

## Features

- Multi-language support (`en`, `es`, `fr`, `de`, `ko`)
- Live products page with 6 product offerings
- Hosted BTC/LN checkout entry points for direct site-owned products
- Public success/download page
- Contact form protected by a local proof-of-work challenge
- RSS feed for products at `/products.xml`
- Direct linking to specific products via hash URLs
- Structured data and SEO support
- Privacy-first frontend with no analytics or tracking

## Privacy

This website collects zero analytics data:

- self-hosted fonts
- no analytics or tracking pixels
- no marketing cookies
- only local browser state for language preference

## Product and Content Updates

When working on products or product copy:

1. Update translations in `src/i18n/translations.ts`
2. Update the relevant layout in `src/components/Products.tsx`
3. Update any surrounding homepage placement in `src/App.tsx` or `src/components/GameManual.tsx`
4. Run `npm run build`
5. Check `public/products.xml` if the build regenerated it

If the user wants lower-risk experimentation, prefer local work or `checkout-test.html` over immediate homepage changes.

## Assets

Place images in `public/assets/`.

Current important folders:

- `public/assets/images/`
- `public/assets/product/cartridge/`
- `public/assets/product/microsd/`
- `public/assets/product/r36s/`
- `public/assets/product/magazine/`
- `public/assets/partners/`

## Deployment

This repo deploys to GitHub Pages on every push to `main`.

Important details:

- Custom domain: `heroofbitcoin.xyz`
- Workflow: `.github/workflows/deploy.yml`
- The workflow now uses native Node 24 actions and uploads the Pages artifact via `actions/upload-artifact@v6`
- A healthy run should not emit Node 20 deprecation warnings

Useful commands:

```bash
gh run list --repo HeroOfBitcoin/www --workflow deploy.yml --limit 1
gh run watch RUN_ID --repo HeroOfBitcoin/www --exit-status
```

## Related Repo

The private backend repo lives at:

- `../digital-hosted`

It powers:

- hosted checkout creation
- Coinsnap webhook handling
- order status lookups
- private ZIP delivery via Fly + Tigris

## Current Follow-Ups

See:

- `TODO.md`

## Copyright

©2022-2026 Hero of Bitcoin. All rights reserved.
