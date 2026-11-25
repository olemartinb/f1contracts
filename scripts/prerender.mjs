// Post-build step: pre-renders every page into dist/ and writes robots.txt, sitemap.xml and ads.txt.
//
// Optional environment variables:
//   SITE_URL         Public URL of the site (default https://www.f1-contracts.com)
//   CF_BEACON_TOKEN  Cloudflare Web Analytics token for manual setup. Not needed when the zone uses
//                    automatic setup, which is the case for f1-contracts.com.
// AdSense is configured in src/config.ts.
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const siteUrl = (process.env.SITE_URL?.trim() || 'https://www.f1-contracts.com').replace(/\/+$/, '');
const beaconToken = process.env.CF_BEACON_TOKEN?.trim() || undefined;

const { pages, adsense, feedItems, LANGS, htmlLang, missing } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

if (adsense.client && !/^ca-pub-\d{10,20}$/.test(adsense.client)) {
  throw new Error(`src/config.ts: adsense.client must look like "ca-pub-1234567890123456", got "${adsense.client}"`);
}

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-head-->')) {
  throw new Error('index.html is missing the <!--app-html--> or <!--seo-head--> placeholder');
}
// Strip the per-page tags from the template; each page gets its own below.
const base = template
  .replace(/<title>[\s\S]*?<\/title>\s*/, '')
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '')
  .replace(/<meta (property="og:(title|description|url|image)"|name="twitter:(title|description|image)")[^>]*\/>\s*/g, '');
const appScript = /\s*<script type="module"[^>]*><\/script>/g;

const shared = [];
// Preload the two fonts every page shows first (headline and body text).
const assetFiles = await readdir(path.join(dist, 'assets'));
for (const prefix of ['barlow-condensed-latin-900-italic', 'barlow-latin-400-normal']) {
  const file = assetFiles.find((f) => f.startsWith(prefix) && f.endsWith('.woff2'));
  if (file) shared.push(`<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`);
}
if (beaconToken) {
  shared.push(
    `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${jsonLd({ token: beaconToken })}'></script>`,
  );
}
if (adsense.client) {
  shared.push(
    `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(adsense.client)}" crossorigin="anonymous"></script>`,
  );
}

const all = pages(siteUrl);
const prefixed = (code, p) => (code === 'en' ? p : `/${code}${p === '/' ? '' : p}`);
const seen = new Set();
for (const page of all) {
  if (seen.has(page.url)) throw new Error(`Duplicate page path ${page.url}`);
  seen.add(page.url);
  const url = `${siteUrl}${page.url}`;
  const alternates = page.translated
    ? [
        ...LANGS.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${esc(siteUrl + prefixed(l.code, page.path))}" />`),
        `<link rel="alternate" hreflang="x-default" href="${esc(siteUrl + page.path)}" />`,
      ]
    : [];
  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    ...alternates,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:locale" content="${htmlLang(page.lang).replace('-', '_')}" />`,
    `<meta property="og:image" content="${esc(siteUrl)}${page.image ?? '/og.png'}" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${esc(siteUrl)}${page.image ?? '/og.png'}" />`,
    `<meta property="article:modified_time" content="${page.lastmod}" />`,
    ...page.jsonLd.map((block) => `<script type="application/ld+json">${jsonLd(block)}</script>`),
    ...shared,
  ];
  let out = base
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang(page.lang)}" data-lang="${page.lang}">`)
    .replace('<!--seo-head-->', head.join('\n    '))
    .replace('<!--app-html-->', page.html);
  if (!page.hydrate) out = out.replace(appScript, '');
  const file = page.url === '/' ? path.join(dist, 'index.html') : path.join(dist, page.url, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, out);
}

const gaps = missing();
if (gaps.length) console.warn(`Missing translations (English text used):\n  ${gaps.join('\n  ')}`);

// robots.txt and sitemap.xml
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
const urls = all
  .map((p) => `  <url>\n    <loc>${siteUrl}${p.url}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`)
  .join('\n');
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// RSS feed of contract changes
const items = feedItems(siteUrl)
  .map(
    (i) =>
      `    <item>\n      <title>${esc(i.title)}</title>\n      <link>${esc(i.link)}</link>\n      <guid isPermaLink="false">${esc(i.guid)}</guid>\n      <pubDate>${i.pubDate}</pubDate>\n      <description>${esc(i.description)}</description>\n    </item>`,
  )
  .join('\n');
await writeFile(
  path.join(dist, 'changes.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>F1 Contracts: latest contract changes</title>\n    <link>${siteUrl}/changes</link>\n    <atom:link href="${siteUrl}/changes.xml" rel="self" type="application/rss+xml" />\n    <description>New F1 driver signings, extensions, options and exits, with sources.</description>\n    <language>en</language>\n${items}\n  </channel>\n</rss>\n`,
);

// ads.txt (Google's certification authority ID is fixed)
if (adsense.client) {
  await writeFile(path.join(dist, 'ads.txt'), `google.com, ${adsense.client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
}

await rm(ssrDir, { recursive: true, force: true });

console.log(
  `Pre-rendered ${all.length} pages in ${LANGS.length} languages for ${siteUrl}` +
    (beaconToken ? ', Cloudflare Web Analytics token set' : '') +
    (adsense.client ? `, AdSense on (${adsense.client})` : ', AdSense off'),
);
