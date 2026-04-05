# Hero of Bitcoin Website - Agent Guide

## Fresh Session First Steps

Start a new chat from the current repo state, not from memory:

1. Check repo cleanliness:
   - `git -C /Users/mars/code/hob/www status --short --branch`
   - `git -C /Users/mars/code/hob/digital-hosted status --short --branch`
2. Confirm the stable tags:
   - `git show --no-patch stable-www-2026-04-03`
   - `git -C /Users/mars/code/hob/digital-hosted show --no-patch stable-digital-hosted-2026-04-03`
3. Verify the latest Pages deploy:
   - `gh run list --repo HeroOfBitcoin/www --workflow deploy.yml --limit 1`
4. Verify backend health:
   - `curl -s https://hero-of-bitcoin-digital.fly.dev/healthz`
5. Read the current follow-up list:
   - `/Users/mars/code/hob/www/TODO.md`

## Purpose

- This repo is the public React/Vite frontend for `https://heroofbitcoin.xyz`
- It now includes the public digital download product, hosted checkout entry point, success page, and the rest of the marketing site
- The sibling backend repo lives at `/Users/mars/code/hob/digital-hosted`

## Current Live State

As of `2026-04-05`:

- Public homepage and product page are live
- `Instant Download` is a live public product, not just a hidden test flow
- `success.html` is live
- `checkout-test.html` still exists as a lower-risk testing surface
- Latest known stable frontend tag: `stable-www-2026-04-03`
- GitHub Pages deploys from pushes to `main`
- The GitHub Actions Pages workflow is expected to run without Node 20 deprecation warnings
- The Pages artifact is packaged manually and uploaded with `actions/upload-artifact@v6`

## Repo Visibility Rule

This repo must stay public for the current GitHub Pages setup.

- Do not change repo visibility without explicit user approval
- Do not treat public frontend code as a place to store secrets
- Keep payment secrets and storage credentials in the backend/Fly environment only

## Local Commands

Run these from `/Users/mars/code/hob/www`:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Notes:

- Local dev default: `http://localhost:5173`
- `npm run build` also regenerates `public/products.xml`
- Production deploys on push to `main`

## Product Architecture to Preserve

- `Instant Download` = site-owned Bitcoin + Lightning checkout for the ROM + PDF bundle
- `Digital Edition` = boxed physical microSD bundle sold externally
- `Collector's Edition` = physical cartridge edition sold externally
- `Hero Handheld` and `Stackchain Magazine` remain external physical products

Do not collapse `Instant Download` and `Digital Edition` back into one ambiguous product.

## Publishing Rules

- Assume homepage and product-copy edits are production changes
- If the user wants experimentation without shipping the homepage immediately, prefer local work or `checkout-test.html`
- Hidden/test-page changes are lower-risk than homepage and product-listing changes, but still validate them before pushing
- Ask before changing repo visibility, domain, or deployment model

## High-Signal Files

- `/Users/mars/code/hob/www/src/App.tsx`
- `/Users/mars/code/hob/www/src/components/GameManual.tsx`
- `/Users/mars/code/hob/www/src/components/Products.tsx`
- `/Users/mars/code/hob/www/src/SuccessPage.tsx`
- `/Users/mars/code/hob/www/src/TestCheckoutPage.tsx`
- `/Users/mars/code/hob/www/src/i18n/translations.ts`
- `/Users/mars/code/hob/www/src/lib/api.ts`
- `/Users/mars/code/hob/www/vite.config.ts`
- `/Users/mars/code/hob/www/.github/workflows/deploy.yml`

## Deploy and Validation Commands

Build locally:

```bash
npm run build
```

Check the latest Pages run:

```bash
gh run list --repo HeroOfBitcoin/www --workflow deploy.yml --limit 1
```

If a future run shows a Node 20 deprecation warning again, treat that as a workflow regression.

Watch a specific run:

```bash
gh run watch RUN_ID --repo HeroOfBitcoin/www --exit-status
```

Spot-check the live site:

```bash
curl -sk https://heroofbitcoin.xyz/
curl -sk https://heroofbitcoin.xyz/success.html
```

## After-Holiday Follow-Ups

- Run a live end-to-end purchase test from the public product page while monitoring backend logs
- Decide whether the success page should show email confirmation or a masked email
- Revisit Lightning QR presentation and Coinsnap hosted-checkout UX
- Research compatibility-safe ROM watermarking or fingerprinting
- Continue copy and image polish only if the user explicitly wants more refinement
