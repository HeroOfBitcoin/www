# Website and product links

The six product cards live in `src/components/Products.tsx`. Their copy is in the
nine website language catalogs under `src/i18n/`; the product feed summaries are
in `src/data/products.ts`. Update the matching structured data in `index.html`
when product facts change. The public digital page is `/digital/`.

| Product | Website anchor | Purchase |
| --- | --- | --- |
| Instant Download | `#instant-download` | Site-owned Bitcoin/Lightning checkout |
| Collector's Edition | `#collectors-edition` | Copiaro |
| Digital Edition | `#digital-edition` | Copiaro; physical box with microSD |
| Hero Handheld | `#hero-handheld` | Copiaro; preconfigured R36S |
| Stackchain Magazine | `#stackchain-magazine` | Site-owned Bitcoin/Lightning checkout |
| Graded Copy | `#graded-copy` | Site-owned Bitcoin/Lightning checkout |

The desktop digital game accompanies all listed products except Hero Handheld.
It supports Windows x86-64, macOS Apple Silicon and Linux x86-64, with English,
Dutch and Finnish game languages. Physical game editions are English. The
handheld's existing software is separate from desktop launcher support.

Product inclusion text does not prescribe QR, claim-code or microSD fulfillment.
Stock, prices, discounts, shipping and claim eligibility come from the backend.
The website does not issue codes or calculate payment totals.

Copiaro links are declared in `Products.tsx`, `GameManual.tsx` and `App.tsx`;
partner links are in `Partners.tsx`. Keep outbound retailer links distinct from
site-owned checkout. `?lang=en`, `es`, `it`, `ja`, `de`, `ko`, `fr`, `nl` or `fi`
selects the website language, independently of the game's three release languages.

See [README.md](README.md) for build, privacy, testing and deployment behavior.
