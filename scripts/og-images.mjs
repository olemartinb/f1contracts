// Renders a 1200x630 social preview image per driver into public/og/drivers/<id>.jpg,
// plus one for the driver market page. Runs before the Vite build. Needs Playwright with
// Chromium; where that is missing the existing images are kept and the build continues.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'og');
const data = JSON.parse(await readFile(path.join(root, 'src', 'data', 'f1data.json'), 'utf8'));

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.log('og-images: Playwright not available, keeping existing images');
  process.exit(0);
}

const fontData = async (file) =>
  `data:font/ttf;base64,${(await readFile(path.join(root, 'scripts', 'og', file))).toString('base64')}`;
const condFont = await fontData('BarlowCondensed-BlackItalic.ttf');
const bodyFont = await fontData('Barlow-SemiBold.ttf');
const teams = Object.fromEntries(data.teams.map((t) => [t.id, t]));
const grid = data.drivers.filter((d) => d.status !== 'leaving');
const start = data.nextSeason;
const last = Math.max(...grid.map((d) => d.contractEnd));
const years = Array.from({ length: last - start + 1 }, (_, i) => start + i);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const css = `
@font-face { font-family: Cond; src: url(${condFont}); font-weight: 900; font-style: italic; }
@font-face { font-family: Body; src: url(${bodyFont}); font-weight: 600; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #26282C; color: #F4F4F0; font-family: Body, sans-serif; position: relative;
  background-image: repeating-linear-gradient(0deg, transparent 0 87px, rgba(255,255,255,.035) 87px 88px); }
.chk { position: absolute; inset: 0 0 auto 0; height: 14px; background: repeating-linear-gradient(90deg, #F4F4F0 0 28px, #111214 28px 56px); }
.brand { position: absolute; top: 46px; left: 64px; font: italic 900 34px/1 Cond; text-transform: uppercase; }
.brand span { color: #FFD400; padding: 0 3px; }
.cond { font-family: Cond; font-style: italic; font-weight: 900; text-transform: uppercase; }
.label { font: 600 20px/1 Body; letter-spacing: .16em; text-transform: uppercase; color: #A9ACB3; }
.meter { position: absolute; left: 64px; right: 64px; bottom: 58px; }
.cells { display: flex; gap: 8px; }
.cells i { flex: 1; height: 22px; transform: skewX(-20deg); background: rgba(244,244,240,.09); }
.years { display: flex; gap: 8px; margin-top: 10px; font: 600 20px/1 Body; color: #A9ACB3; }
.years span { flex: 1; }
`;

function meter(d, color) {
  const cells = years.map((y) =>
    y <= d.contractEnd
      ? d.status === 'unsigned' ? `border:3px dashed ${color};background:transparent` : `background:${color}`
      : d.optionYear && y <= d.optionYear ? `background:repeating-linear-gradient(-45deg,${color} 0 4px,transparent 4px 10px)` : '',
  );
  cells.push(d.optionBeyond ? `background:repeating-linear-gradient(-45deg,${color} 0 4px,transparent 4px 10px)` : '');
  return `<div class="meter"><div class="cells">${cells.map((s) => `<i style="${s}"></i>`).join('')}</div>
    <div class="years">${years.map((y) => `<span>${y}</span>`).join('')}<span>${last + 1}+</span></div></div>`;
}

function driverHtml(d) {
  const t = teams[d.team];
  const leaving = d.status === 'leaving';
  const label = leaving ? 'Leaving after' : d.status === 'unsigned' ? 'Not yet signed' : d.basis === 'reported' ? 'Reported until' : 'Signed until';
  const [first, ...rest] = d.name.split(' ');
  const surname = rest.join(' ') || first;
  const plus = d.optionYear || d.optionBeyond ? '<span style="color:#FFD400">+</span>' : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  <div class="chk"></div><div class="brand">F1<span>/</span>Contracts</div>
  <div style="position:absolute;left:64px;top:128px;width:12px;height:${leaving ? 300 : 248}px;background:${t.color}"></div>
  <div style="position:absolute;left:104px;top:126px;width:620px">
    <div class="label" style="color:${t.color};filter:brightness(1.25)">${esc(t.name)}${d.number ? ` · #${d.number}` : ''}</div>
    <div class="cond" style="font-size:64px;line-height:1;margin-top:16px;color:#A9ACB3">${rest.length ? esc(first) : ''}</div>
    <div class="cond fit" style="font-size:136px;line-height:.9;letter-spacing:-.01em;white-space:nowrap">${esc(surname)}</div>
    <div class="cond" style="font-size:56px;line-height:1;margin-top:10px;color:transparent;-webkit-text-stroke:2px #F4F4F0">Contract</div>
  </div>
  <div style="position:absolute;right:64px;top:150px;text-align:right">
    <div class="label">${label}</div>
    <div class="cond" style="font-size:190px;line-height:.9;margin-top:10px">${d.contractEnd}${plus}</div>
    ${d.optionYear ? `<div class="label" style="margin-top:10px;color:#F4F4F0">Option for ${d.optionYear}</div>` : ''}
  </div>
  ${leaving ? '' : meter(d, t.color)}
  </body></html>`;
}

function marketHtml() {
  const year = data.nextSeason + 1;
  const out = grid.filter((d) => d.contractEnd === data.nextSeason && !d.optionBeyond);
  const chips = out
    .map((d) => `<span style="display:inline-flex;align-items:center;gap:10px;border:3px solid #474A50;padding:7px 12px;margin:0 8px 10px 0;font:italic 900 26px/1 Cond;text-transform:uppercase"><i style="width:10px;height:26px;background:${teams[d.team].color}"></i>${esc(d.name.split(' ').slice(-1)[0])}</span>`)
    .join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  <div class="chk"></div><div class="brand">F1<span>/</span>Contracts</div>
  <div style="position:absolute;left:64px;top:120px;right:64px">
    <div class="cond" style="font-size:120px;line-height:.9">${year} driver market</div>
    <div class="cond" style="font-size:48px;line-height:1;margin-top:12px;color:transparent;-webkit-text-stroke:2px #F4F4F0">${out.length} drivers out of contract after ${data.nextSeason}</div>
    <div style="margin-top:30px">${chips}</div>
  </div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await mkdir(path.join(outDir, 'drivers'), { recursive: true });
let n = 0;
async function render(html, file) {
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const el of document.querySelectorAll('.fit')) {
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > el.parentElement.clientWidth && size > 60) el.style.fontSize = `${(size -= 4)}px`;
    }
  });
  await writeFile(file, await page.screenshot({ type: 'jpeg', quality: 86 }));
  n++;
}
for (const d of data.drivers) await render(driverHtml(d), path.join(outDir, 'drivers', `${d.id}.jpg`));
await render(marketHtml(), path.join(outDir, 'driver-market.jpg'));
await browser.close();
console.log(`og-images: rendered ${n} images into public/og`);
