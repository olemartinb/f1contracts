/** Returns black or white, whichever reads better on the given hex background. */
export function readableText(hex: string): string {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Contrast vs white = 1.05 / (L + 0.05); vs black = (L + 0.05) / 0.05
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05 ? '#FFFFFF' : '#0A0A0C';
}
