# F1 Contracts

A fan site that shows when every Formula 1 driver's contract ends.

## How it works

- **Data:** every contract is one entry in `src/data/f1data.json`, with its end year, any option, whether the length is official or reported, a note and a source link. Contract news goes in `src/data/changes.json`.
- **Build:** `npm run build` renders a share image per driver, pre-renders every page (home, 24 drivers, 11 teams, market, grid, per-year and changes pages) to static HTML in five languages, and packs the result into a Cloudflare Worker. Only the home page loads JavaScript, for the interactive grid.
- **Hosting:** the Worker (`worker/index.js`) serves the files with cache and security headers and redirects `f1-contracts.com` to `www`.
- **Updates:** a Claude Code scheduled task runs every morning. It checks for contract news, updates the data and translations, opens and merges a pull request when the build passes, and deploys `main`.

## Updating contracts

All data lives in [`src/data/f1data.json`](src/data/f1data.json). For each driver:

| Field | Meaning |
| --- | --- |
| `contractEnd` | Last season covered by the current deal |
| `optionYear` | An extra season available through an option (drawn as a striped bar) |
| `optionBeyond` | `true` when the deal has an open-ended option after `contractEnd` |
| `basis` | `official`: the end year was confirmed by the team or driver. `reported`: from media reports |
| `status` | `signed`, `unsigned` (team confirmed but no contract yet) or `leaving` (not on next season's grid) |
| `rookie` | `true` for a driver's first season |
| `source` | Link shown next to the note. Always add one. |
| `updated` | Date the entry was last changed or re-checked (`YYYY-MM-DD`). Shown as "Updated …" on the site. |

Bump `updated` whenever you change the data, and add a dated entry to [`src/data/changes.json`](src/data/changes.json) (newest first is not required; the site sorts them). Each entry has a `date` (`YYYY-MM-DD`, or `YYYY-MM` if only the month is known), a `driver` or `team` id, the `text` and a `source`. Changes show on the home page, on `/changes` and on the driver and team pages.

Every driver and team gets its own pre-rendered page (`/drivers/<id>`, `/teams/<id>`), plus `/drivers`, `/teams` and `/changes`, all listed in `sitemap.xml`. There is also a `/driver-market` page for the next season's market, a `/grid` page with the confirmed line-up, `/out-of-contract/<year>` pages for later years, and an RSS feed of changes at `/changes.xml`.

`npm run build` renders a social preview image for each driver and the market page into `public/og/` (`scripts/og-images.mjs`, using Playwright and the Barlow fonts in `scripts/og/`). Where Playwright isn't installed, the committed images are kept. At the end of a season, move `currentSeason` and `nextSeason` forward and update the year in the `<title>` and meta tags in `index.html`.

## Languages

The site is published in English (`/`), Spanish (`/es`), Portuguese (`/pt`), German (`/de`) and Dutch (`/nl`). Every page links its other language versions with `hreflang` tags.

- Interface text and sentence templates: `src/i18n/en.ts` (the template) and `es.ts`, `pt.ts`, `de.ts`, `nl.ts`. TypeScript fails the build if a language is missing a key.
- Driver notes and change texts: `src/i18n/content/<lang>.json`. Notes are keyed by driver id; changes by `date|driver-or-team`, for example `2026-11-18|valtteri-bottas`. When you change a note or add a change in English, add the translations too. The build lists anything missing and falls back to English for it.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check, build, pre-render HTML, write robots.txt/sitemap.xml
npm run preview  # build and serve with Wrangler, like production
```

The build pre-renders the page into `dist/index.html` so search engines get the full content. It also adds JSON-LD (`WebPage`, `ItemList` and `FAQPage`).

## Deploying to Cloudflare

The site is deployed as the Cloudflare Worker `f1contracts` (`wrangler.jsonc`). `npm run build` pre-renders the pages and packs every file in `dist/` into `worker/assets.generated.js`. `worker/index.js` serves those files, sets cache and security headers, and redirects `f1-contracts.com` to `www.f1-contracts.com`. Packing the files into the Worker means a deploy needs only an API token, with no separate asset upload.

**Automatic deploys (optional):** In the Cloudflare dashboard, open the `f1contracts` Worker → Settings → Builds → Connect, and pick this repo. Use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build variable `SITE_URL` (optional): defaults to `https://www.f1-contracts.com`; used for the canonical URL, `og:url` and `sitemap.xml`

Every push to `main` then deploys.

**Manual deploy:** `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN`) and then `npm run deploy`.

### Analytics

Cloudflare Web Analytics runs in automatic mode on the `f1-contracts.com` zone: Cloudflare adds the beacon to pages it serves, so no token is needed in the build. To use a manual token instead (for example on a domain outside Cloudflare), set the `CF_BEACON_TOKEN` build variable.

## Ads (Google AdSense)

Ads are off until you add your IDs to [`src/config.ts`](src/config.ts):

1. In AdSense, add the site `f1-contracts.com` and copy your publisher ID (`ca-pub-…`) into `adsense.client`. The build then adds the AdSense script and writes `/ads.txt`, which AdSense checks during site approval.
2. Create three responsive display ad units (Ads → By ad unit → Display ads) and paste their slot IDs into `afterGrid`, `afterMarket` and `afterFaq`. Empty slots are skipped. You can also skip the units and turn on Auto ads instead.
3. Turn on a consent message for EEA and UK visitors: AdSense → Privacy & messaging → European regulations. Google requires this for visitors from Norway and the EU, and the AdSense script shows it automatically.

The privacy page at `/privacy` describes the ads once `adsense.client` is set.

## License

Code and data are released under the [MIT License](LICENSE). The Barlow fonts in `src/fonts/` and `scripts/og/` are under the SIL Open Font License. Contract notes link to their original sources, which belong to their publishers.
