# Hero of Bitcoin - Official Website

Public React/Vite frontend for [heroofbitcoin.xyz](https://heroofbitcoin.xyz).

This repo now includes:

- the live homepage and product page
- the public `Instant Download` BTC/LN product entry point
- the direct `Stackchain Magazine` bundle checkout entry point
- the public success/download page
- the rest of the Hero of Bitcoin marketing site

## Check the current release

Use Git and the deployment workflows to identify the deployed revision; old stable
tags are historical snapshots. Check both repositories with `git status --short --branch`,
then inspect the latest Pages run and backend health:

```bash
gh run list --repo HeroOfBitcoin/www --workflow deploy.yml --limit 1
curl -fsS https://hero-of-bitcoin-digital.fly.dev/healthz
```

## Repo Visibility

This repo is public because the current deployment model uses GitHub Pages.

- Do not change repo visibility without explicit approval
- Do not put secrets in this repo
- Payment and storage secrets belong in the backend/Fly environment only

## Quick Start

### 1. Install

```bash
npm ci
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

- `Instant Download` = site-owned Bitcoin + Lightning checkout for the game with its launcher and English PDF guide
- `Digital Edition` = boxed physical microSD bundle sold externally
- `Collector's Edition` = physical cartridge sold externally
- `Hero Handheld` = physical product sold externally
- `Stackchain Magazine` = site-owned magazine + digital game bundle with selected shipping included in one Bitcoin/Lightning invoice
- `Graded Copy` = site-owned CGC 9.9 collector copy with the digital game included; selected shipping is included in the Bitcoin/Lightning invoice

Do not merge `Instant Download` and `Digital Edition` back into one product concept.

Instant Download, Collector's Edition, Digital Edition, Graded Copy and
Stackchain Magazine display the included desktop digital game, regardless of
how access is supplied. Their product cards show OS icons, architecture
requirements and digital game languages separately from the physical edition
language. Hero Handheld shows its own pre-installed game information; desktop
launcher platforms and language selection do not describe handheld support.

The digital game includes Windows (x86-64), macOS (Apple Silicon) and Linux
(x86-64) applications. The launcher selects the game language, configures a
controller and starts the included game offline. Game languages are English,
Dutch and Finnish. The English PDF guide is included, as is an extra English ROM
in the ZIP. Physical game editions remain English; the nine website interface
languages do not imply nine languages in the customer download.

`GameDownloadInfo` and `GamePlatforms` present these facts on the homepage,
shop and eligible download confirmations. The standalone `/digital/` page uses
the same translation catalog and pixel-art SVGs under `public/assets/platforms/`.
Both variants display architecture requirements beside the OS names.

Buyers with a claim code can enter it in the "Discount or claim code" field on
`/digital/`. Product inclusion notices do not prescribe how the digital game
is supplied. The existing backend validates and redeems codes; the website
does not issue codes or change payment or fulfillment rules.

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

Localized URLs work with `?lang=de`, `?lang=es`, `?lang=fr`, or `?lang=ko`.

## High-Signal Files

- `src/App.tsx`
- `src/components/GameManual.tsx`
- `src/components/Products.tsx`
- `src/SuccessPage.tsx`
- `src/i18n/translations.ts`
- `src/i18n/fr.ts`
- `src/i18n/ko.ts`
- `src/lib/api.ts`
- `vite.config.ts`
- `.github/workflows/deploy.yml`

## Features

- Multi-language support (`en`, `es`, `it`, `ja`, `de`, `ko`, `fr`, `nl`, `fi`)
- Live products page with 6 product offerings
- Hosted BTC/LN checkout entry points for direct site-owned products
- Public success/download page
- Contact form protected by a local proof-of-work challenge
- RSS feed for products at `/products.xml`
- Direct linking to specific products via hash URLs
- Structured data and SEO support
- No analytics or advertising cookies in the frontend

## Privacy

The frontend uses:

- self-hosted fonts
- no analytics or tracking pixels
- no advertising cookies set by the site
- local browser state for language preference

Checkout and contact forms send the information needed to process the request.
Playing a trailer loads YouTube; checkout and retailer links open external services.

## Product and Content Updates

When working on products or product copy:

1. Update translations in `src/i18n/translations.ts`
2. Update the relevant layout in `src/components/Products.tsx`
3. Update any surrounding homepage placement in `src/App.tsx` or `src/components/GameManual.tsx`
4. Run `npm run verify`
5. Check `public/products.xml` if the build regenerated it


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

## Copyright

©2022-2026 Hero of Bitcoin. All rights reserved.

## Test environments

Run checkout tests locally with the backend’s mock payment provider. Do not ship
test pages in the production build. Any explicitly authorized, temporary public
test surface must be removed as part of the same test run.

## Checkout and download behavior

The homepage and `/digital/` share `src/checkout.ts`. The backend sets prices,
shipping, stock and claim eligibility. The frontend blocks duplicate submissions
and restores the controls after a browser-back navigation.

The confirmation page fetches fresh download credentials when the buyer presses
Download. A failed request leaves the buyer on the confirmation page with a retry
message. Download limits and access revocation remain enforced by the backend.
Shipping fields use browser validation before submission. Browser storage is optional;
the language can always be selected through the URL.

`npm run verify` runs the build, catalog checks and source tests. Exercise browser
checkout flows against the backend's local mock provider, including payment return,
download, failures, shipping and browser-back recovery. Real Lightning payment
acceptance is a separate, deliberate live purchase.
