#!/usr/bin/env npx tsx
/*
  =============================================================================
  RSS FEED GENERATOR
  =============================================================================
  Generates products.xml from the shared products data.
  Run: npx tsx scripts/generate-rss.ts
  Or:  npm run generate:rss
  =============================================================================
*/

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { products, SITE_URL } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toUTCString();
};

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const generateRss = (): string => {
  const now = new Date().toUTCString();

  const items = products
    .map((product) => `
    <item>
      <title>${escapeXml(product.title)}</title>
      <link>${SITE_URL}/#${product.id}</link>
      <guid isPermaLink="true">${SITE_URL}/#${product.id}</guid>
      <description>${escapeXml(product.description)}</description>
      <pubDate>${formatDate(product.pubDate)}</pubDate>
    </item>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hero of Bitcoin - Products</title>
    <link>${SITE_URL}/#products</link>
    <description>Official Hero of Bitcoin merchandise and collectibles. Game Boy cartridges, handheld consoles, and limited edition prints.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/products.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
};

// Generate and write the RSS feed
const rssContent = generateRss();
const outputPath = path.join(__dirname, '..', 'public', 'products.xml');

fs.writeFileSync(outputPath, rssContent, 'utf-8');
console.log(`✓ RSS feed generated: ${outputPath}`);
console.log(`  ${products.length} products included`);
