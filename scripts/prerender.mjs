// Post-build step: pre-renders the React app into dist/index.html and writes SEO files.
//
// Optional environment variables (set them in Cloudflare's build settings):
//   SITE_URL         Public URL of the site (default https://www.f1-contracts.com)
//                    Enables canonical URL, og:url, absolute og:image and sitemap.xml.
//   CF_BEACON_TOKEN  Cloudflare Web Analytics site token. Adds the analytics beacon.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const siteUrl = (process.env.SITE_URL?.trim() || 'https://www.f1-contracts.com').replace(/\/+$/, '');
const beaconToken = process.env.CF_BEACON_TOKEN?.trim() || undefined;

const { render, structuredData, meta } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

const head = [];
if (siteUrl) {
  head.push(`<link rel="canonical" href="${escapeAttr(siteUrl)}/" />`);
  head.push(`<meta property="og:url" content="${escapeAttr(siteUrl)}/" />`);
}
const ogImage = `${siteUrl ?? ''}/og.png`;
head.push(`<meta property="og:image" content="${escapeAttr(ogImage)}" />`);
head.push(`<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`);
head.push(`<meta property="article:modified_time" content="${meta.updated}" />`);
for (const block of structuredData(siteUrl)) {
  head.push(`<script type="application/ld+json">${jsonLd(block)}</script>`);
}
if (beaconToken) {
  head.push(
    `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${jsonLd({ token: beaconToken })}'></script>`,
  );
}

const templatePath = path.join(dist, 'index.html');
const template = await readFile(templatePath, 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-head-->')) {
  throw new Error('index.html is missing the <!--app-html--> or <!--seo-head--> placeholder');
}
const html = template
  .replace('<!--seo-head-->', head.join('\n    '))
  .replace('<!--app-html-->', render());
await writeFile(templatePath, html);

const robots = ['User-agent: *', 'Allow: /'];
if (siteUrl) {
  robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${meta.updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  );
}
await writeFile(path.join(dist, 'robots.txt'), robots.join('\n') + '\n');

await rm(ssrDir, { recursive: true, force: true });

console.log(
  `Pre-rendered dist/index.html (${(html.length / 1024).toFixed(1)} kB)` +
    (siteUrl ? `, sitemap for ${siteUrl}` : ', no SITE_URL set: skipped canonical + sitemap') +
    (beaconToken ? ', Cloudflare Web Analytics on' : ''),
);
