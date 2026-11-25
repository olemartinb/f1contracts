// Team colours are used as-is for bars and stripes. When a team colour is used for text on the dark
// background, some (Ferrari red, Williams blue) are too dark to read, so lighten them just enough.

const SURFACE = [0x2f, 0x32, 0x37]; // tar2, the lighter of the two dark backgrounds

const lum = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const hex = (rgb: number[]) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

const cache = new Map<string, string>();

/** The team colour, mixed with white until it reaches 3:1 contrast on the dark background (enough for the large, bold numbers it is used for). */
export function textColor(color: string): string {
  const hit = cache.get(color);
  if (hit) return hit;
  const base = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
  let out = base;
  for (let mix = 0; mix <= 1 && contrast(out, SURFACE) < 3; mix += 0.05) {
    out = base.map((v) => v + (255 - v) * mix);
  }
  const result = out === base ? color : hex(out);
  cache.set(color, result);
  return result;
}
