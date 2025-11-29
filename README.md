
# Hero of Bitcoin - Instruction Booklet & Device Guide

A retro-styled digital instruction booklet for **Hero of Bitcoin** and an unofficial quick-start companion for the **R36S** handheld device. Built with React, TypeScript, Tailwind CSS, and Vite.

## 🚀 Quick Start

### 1. Installation

If you haven't run the setup script yet, install dependencies manually:

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

Before building, ensure you have placed your character images in the public folder. The app expects:

*   `public/assets/characters/samson.png`
*   `public/assets/characters/michael.png`
*   `public/assets/characters/max_stacey.png`
*   `public/assets/characters/nayib.png`
*   `public/assets/characters/adam.png`
*   `public/assets/characters/faketoshi.png`

---

## 🌐 Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages easily. There are two parts to this: configuring the app and setting up the deployment pipeline.

### Step 1: Configuration (`vite.config.ts`)

Open `vite.config.ts` and ensure the `base` property is set correctly:

*   **For Custom Domain (e.g., `manual.heroofbitcoin.xyz`):**
    ```ts
    base: '/',
    ```
*   **For default GitHub URL (e.g., `username.github.io/repo-name`):**
    ```ts
    base: '/repo-name/',
    ```

### Step 2: Custom Domain Setup (CNAME)

If you are using `manual.heroofbitcoin.xyz`:

1.  Create a file named `CNAME` (no file extension) inside the `public/` folder.
2.  Paste your domain name inside it:
    ```text
    manual.heroofbitcoin.xyz
    ```
3.  *Note:* When Vite builds the project, this file will be copied to the root of the output, telling GitHub to use your domain.

### Step 3: Setup GitHub Actions (Automated Deployment)

The best way to deploy is using GitHub Actions. This will automatically rebuild and publish your site every time you push to `main`.

1.  Create a directory path in your project: `.github/workflows/`
2.  Create a file named `deploy.yml` inside it.
3.  Paste the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4: Push to GitHub

1.  Initialize Git (if not done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    git branch -M main
    git push -u origin main
    ```

### Step 5: Enable Pages in Repository Settings

1.  Go to your GitHub Repository.
2.  Click **Settings** > **Pages** (in the sidebar).
3.  Under **Build and deployment** > **Source**, select **GitHub Actions**.
4.  Once the Action finishes running (check the "Actions" tab), your site will be live!

---

## 🛠️ Tech Stack

*   **Framework:** React 18
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Fonts:** Press Start 2P (Headers), Inter (Body), Roboto Mono (Data)

## © Copyright

©2022-2025 Hero of Bitcoin. All rights reserved.
