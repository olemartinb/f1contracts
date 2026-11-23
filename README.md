# F1 Contracts

A fan site that shows when every Formula 1 driver's contract ends.

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

Bump `updated` whenever you change the data. At the end of a season, move `currentSeason` and `nextSeason` forward and update the year in the `<title>` and meta tags in `index.html`.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check, build, pre-render HTML, write robots.txt/sitemap.xml
npm run preview  # build and serve with Wrangler, like production
```

The build pre-renders the page into `dist/index.html` so search engines get the full content. It also adds JSON-LD (`WebPage`, `ItemList` and `FAQPage`).

## Deploying to Cloudflare

The site is static and is deployed as a Cloudflare Worker with static assets (`wrangler.jsonc`).

**Automatic deploys (recommended):** In the Cloudflare dashboard go to Workers & Pages → Create → Import a repository, and pick this repo. Use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build variables:
  - `SITE_URL` (optional): defaults to `https://www.f1-contracts.com`; used for the canonical URL, `og:url` and `sitemap.xml`
  - `CF_BEACON_TOKEN`: your Cloudflare Web Analytics token (see below)

Every push to `main` then deploys.

**Manual deploy:** `npx wrangler login` and then `npm run deploy`.

### Analytics

Go to Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site, enter your domain, and copy the token from the snippet (the value of `"token"`). Set it as the `CF_BEACON_TOKEN` build variable. If the site uses a custom domain on a zone already in Cloudflare, you can choose automatic setup instead and skip the token.

## Ads (Google AdSense)

Ads are off until you add your IDs to [`src/config.ts`](src/config.ts):

1. In AdSense, add the site `f1-contracts.com` and copy your publisher ID (`ca-pub-…`) into `adsense.client`. The build then adds the AdSense script and writes `/ads.txt`, which AdSense checks during site approval.
2. Create three responsive display ad units (Ads → By ad unit → Display ads) and paste their slot IDs into `afterGrid`, `afterMarket` and `afterFaq`. Empty slots are skipped. You can also skip the units and turn on Auto ads instead.
3. Turn on a consent message for EEA and UK visitors: AdSense → Privacy & messaging → European regulations. Google requires this for visitors from Norway and the EU, and the AdSense script shows it automatically.

The privacy page at `/privacy` describes the ads once `adsense.client` is set.
