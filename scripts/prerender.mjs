// Post-build step: pre-renders the React app into dist/index.html and dist/privacy/index.html,
// and writes robots.txt, sitemap.xml and ads.txt.
//
// Optional environment variables (set them in Cloudflare's build settings):
//   SITE_URL         Public URL of the site (default https://www.f1-contracts.com)
//   CF_BEACON_TOKEN  Cloudflare Web Analytics site token. Adds the analytics beacon.
// AdSense is configured in src/config.ts.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const siteUrl = (process.env.SITE_URL?.trim() || 'https://www.f1-contracts.com').replace(/\/+$/, '');
const beaconToken = process.env.CF_BEACON_TOKEN?.trim() || undefined;

const { render, renderPrivacy, structuredData, meta, adsense } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

if (adsense.client && !/^ca-pub-\d{10,20}$/.test(adsense.client)) {
  throw new Error(`src/config.ts: adsense.client must look like "ca-pub-1234567890123456", got "${adsense.client}"`);
}

// Tags shared by every page.
const shared = [];
if (beaconToken) {
  shared.push(
    `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${jsonLd({ token: beaconToken })}'></script>`,
  );
}
if (adsense.client) {
  shared.push(
    `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${escapeAttr(adsense.client)}" crossorigin="anonymous"></script>`,
  );
}

const templatePath = path.join(dist, 'index.html');
const template = await readFile(templatePath, 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-head-->')) {
  throw new Error('index.html is missing the <!--app-html--> or <!--seo-head--> placeholder');
}

// Home page
const head = [
  `<link rel="canonical" href="${escapeAttr(siteUrl)}/" />`,
  `<meta property="og:url" content="${escapeAttr(siteUrl)}/" />`,
  `<meta property="og:image" content="${escapeAttr(siteUrl)}/og.png" />`,
  `<meta name="twitter:image" content="${escapeAttr(siteUrl)}/og.png" />`,
  `<meta property="article:modified_time" content="${meta.updated}" />`,
  ...structuredData(siteUrl).map((block) => `<script type="application/ld+json">${jsonLd(block)}</script>`),
  ...shared,
];
const html = template.replace('<!--seo-head-->', head.join('\n    ')).replace('<!--app-html-->', render());
await writeFile(templatePath, html);

// Privacy page: static HTML, no app script.
const privacy = template
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Privacy | F1 Contracts</title>')
  .replace(/<meta\s+name="description"[\s\S]*?\/>/, '<meta name="description" content="How F1 Contracts handles analytics, ads and cookies." />')
  .replace(/\s*<meta (property="og:|name="twitter:)[^>]*\/>/g, '')
  .replace(/\s*<script type="module"[^>]*><\/script>/g, '')
  .replace('<!--seo-head-->', [`<link rel="canonical" href="${escapeAttr(siteUrl)}/privacy" />`, ...shared].join('\n    '))
  .replace('<!--app-html-->', renderPrivacy());
await mkdir(path.join(dist, 'privacy'), { recursive: true });
await writeFile(path.join(dist, 'privacy', 'index.html'), privacy);

// robots.txt and sitemap.xml
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
const url = (loc, priority) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${meta.updated}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${url(`${siteUrl}/`, '1.0')}\n${url(`${siteUrl}/privacy`, '0.2')}\n</urlset>\n`,
);

// ads.txt (Google's certification authority ID is fixed)
if (adsense.client) {
  await writeFile(path.join(dist, 'ads.txt'), `google.com, ${adsense.client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
}

await rm(ssrDir, { recursive: true, force: true });

console.log(
  `Pre-rendered / (${(html.length / 1024).toFixed(1)} kB) and /privacy for ${siteUrl}` +
    (beaconToken ? ', Cloudflare Web Analytics on' : '') +
    (adsense.client ? `, AdSense on (${adsense.client})` : ', AdSense off'),
);
