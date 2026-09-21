# Hero of Bitcoin Website - Agent Guide

## Fresh Session First Steps

Start a new chat from the current repo state, not from memory:

1. Check repo cleanliness:
   - `git status --short --branch`
   - `git -C ../digital-hosted status --short --branch`
2. Compare current commits with the latest deployment workflow SHAs; stable tags are historical snapshots.
3. Verify the latest Pages deploy:
   - `gh run list --repo HeroOfBitcoin/www --workflow deploy.yml --limit 1`
4. Verify backend health:
   - `curl -s https://hero-of-bitcoin-digital.fly.dev/healthz`
5. Read the current follow-up list:
   - `.state/todo_local.md` (ignored private state)

## Purpose

- This repo is the public React/Vite frontend for `https://heroofbitcoin.xyz`
- It now includes the public digital download product, hosted checkout entry point, success page, and the rest of the marketing site
- The sibling backend repo lives at `../digital-hosted`.

## Current Live State

Production architecture:

- Public homepage and product page are live
- `Instant Download` is a live public product, not just a hidden test flow
- `success.html` is live
- GitHub Pages deploys from pushes to `main`
- The GitHub Actions Pages workflow is expected to run without Node 20 deprecation warnings
- The Pages artifact is packaged manually and uploaded with `actions/upload-artifact@v6`

## Repo Visibility Rule

This repo must stay public for the current GitHub Pages setup.

- Do not change repo visibility without explicit user approval
- Do not treat public frontend code as a place to store secrets
- Keep payment secrets and storage credentials in the backend/Fly environment only

## Local Commands

Run these from this repository root:

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

- `Instant Download` = site-owned Bitcoin + Lightning checkout for the Windows/macOS/Linux game bundle and English PDF guide
- `Digital Edition` = boxed physical microSD bundle sold externally
- `Collector's Edition` = physical cartridge edition sold externally
- `Hero Handheld` remains an external physical product; desktop launcher compatibility does not apply
- `Stackchain Magazine` and `Graded Copy` use site-owned checkout with server-calculated shipping

Do not collapse `Instant Download` and `Digital Edition` back into one ambiguous product.

## Publishing Rules

- Run experiments and checkout tests locally. Do not include test pages in production builds.
- Any explicitly authorized temporary public test surface must be removed during the same test run.

- Assume homepage and product-copy edits are production changes
- Ask before changing repo visibility, domain, or deployment model

## High-Signal Files

- `src/App.tsx`
- `src/components/GameManual.tsx`
- `src/components/Products.tsx`
- `src/SuccessPage.tsx`
- `src/i18n/translations.ts`
- `src/lib/api.ts`
- `vite.config.ts`
- `.github/workflows/deploy.yml`

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

## Private work state

Keep internal plans and follow-ups in ignored `.state/todo_local.md`. Public docs
should describe durable product behavior and reproducible commands.
