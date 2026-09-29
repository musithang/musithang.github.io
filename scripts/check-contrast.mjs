// Enforces WCAG AA contrast on the colour tokens in src/styles/tokens.css.
// Run: npm run check:contrast
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

// Collect `--name: light-dark(#a, #b);` tokens.
const tokens = {};
for (const m of css.matchAll(/--([\w-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi)) {
  tokens[m[1]] = { light: m[2], dark: m[3] };
}

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum ratio, note]
const PAIRS = [
  ['text', 'bg', 7, 'body text'],
  ['text', 'surface', 7, 'text on code/callout surface'],
  ['muted', 'bg', 4.5, 'meta text'],
  ['muted', 'surface', 4.5, 'meta text on surface'],
  ['accent', 'bg', 4.5, 'links and accents'],
  ['accent', 'surface', 4.5, 'links on surface'],
];

let failed = false;
console.log('pair                     theme  ratio  min   result');
for (const theme of ['light', 'dark']) {
  for (const [fg, bg, min, note] of PAIRS) {
    if (!tokens[fg] || !tokens[bg]) {
      console.error(`missing token: ${!tokens[fg] ? fg : bg}`);
      process.exit(2);
    }
    const r = ratio(tokens[fg][theme], tokens[bg][theme]);
    const ok = r >= min;
    failed ||= !ok;
    console.log(
      `${(fg + ' on ' + bg).padEnd(24)} ${theme.padEnd(5)}  ${r.toFixed(2).padStart(5)}  ${String(min).padEnd(4)}  ${ok ? 'ok' : 'FAIL'}  (${note})`,
    );
  }
}
process.exit(failed ? 1 : 0);
