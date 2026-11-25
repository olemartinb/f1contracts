// Cloudflare Worker that serves the pre-built site from worker/assets.generated.js.
import assets from './assets.generated.js';

const CANONICAL_HOST = 'www.f1-contracts.com';
const REDIRECT_HOSTS = new Set(['f1-contracts.com']);
const ROOT_FILES = new Set(['/ads.txt', '/robots.txt']);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const decoded = new Map();
const encoder = new TextEncoder();
function bytes(path) {
  let b = decoded.get(path);
  if (!b) {
    const asset = assets[path];
    b = asset.text !== undefined ? encoder.encode(asset.text) : Uint8Array.from(atob(asset.b64), (c) => c.charCodeAt(0));
    decoded.set(path, b);
  }
  return b;
}

function cacheControl(path) {
  if (path.startsWith('/assets/')) return 'public, max-age=31536000, immutable';
  if (path.endsWith('.html')) return 'public, max-age=0, must-revalidate';
  return 'public, max-age=86400';
}

function resolve(pathname) {
  if (pathname === '/') return '/index.html';
  if (assets[pathname]) return pathname;
  if (assets[`${pathname}/index.html`]) return `${pathname}/index.html`;
  return null;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Crawlers fetch these from the root domain; serve them directly instead of redirecting.
    if (REDIRECT_HOSTS.has(url.hostname) && !ROOT_FILES.has(url.pathname)) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    // English-only pages have no language versions; send /es/privacy etc. to the English page.
    const englishOnly = url.pathname.match(/^\/(es|pt|de|nl)(\/privacy)\/?$/);
    if (englishOnly) {
      url.pathname = englishOnly[2];
      return Response.redirect(url.toString(), 301);
    }

    // Clean URLs: /index.html -> /, /privacy/ and /privacy/index.html -> /privacy
    let pathname = decodeURIComponent(url.pathname);
    const clean = pathname.replace(/\/index\.html$/, '/').replace(/(.)\/$/, '$1');
    if (clean !== pathname) {
      url.pathname = clean;
      return Response.redirect(url.toString(), 301);
    }

    const path = resolve(pathname);
    if (!path) {
      return new Response('Page not found. Go to https://www.f1-contracts.com/', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS },
      });
    }

    const { type, etag } = assets[path];
    const headers = { 'Content-Type': type, 'Cache-Control': cacheControl(path), ETag: etag, ...SECURITY_HEADERS };
    if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
    return new Response(request.method === 'HEAD' ? null : bytes(path), { headers });
  },
};
