import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { SITE } from '../config';

const WIDTH = 1200;
const HEIGHT = 630;

// Same palette as the dark theme (src/styles/tokens.css).
const BG = '#0f1318';
const TEXT = '#e6e2d6';
const MUTED = '#a39e91';
const ACCENT = '#f5a524';

const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));

let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    fontFile('@fontsource/source-serif-4', 'source-serif-4-latin-700-normal.woff'),
    fontFile('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
    fontFile('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-700-normal.woff'),
  ]).then(([serif, mono, monoBold]) => [
    { name: 'Serif', data: serif, weight: 700 as const, style: 'normal' as const },
    { name: 'Mono', data: mono, weight: 500 as const, style: 'normal' as const },
    { name: 'Mono', data: monoBold, weight: 700 as const, style: 'normal' as const },
  ]));

const dataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// Scope-style graticule with a faint waveform, drawn once behind the text.
const backdrop = dataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <g stroke="${TEXT}" stroke-opacity="0.05" stroke-width="1">
    ${Array.from({ length: Math.floor(WIDTH / 40) + 1 }, (_, i) => `<path d="M${i * 40} 0V${HEIGHT}"/>`).join('')}
    ${Array.from({ length: Math.floor(HEIGHT / 40) + 1 }, (_, i) => `<path d="M0 ${i * 40}H${WIDTH}"/>`).join('')}
  </g>
  <path d="M0 470H620l50-150 70 270 70-200 45 80H${WIDTH}" fill="none" stroke="${ACCENT}" stroke-opacity="0.18" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`);

const logo = dataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 20" width="64" height="40">
  <path d="M1 14h5l3-10 4 16 3-12 2 6h13" fill="none" stroke="${ACCENT}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

export type CardInput = {
  title: string;
  /** Small line above the title, e.g. "2026-09-29 · devlog". */
  eyebrow: string;
  tags?: string[];
};

type El = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
  type,
  props: { style, children, ...extra },
});

/** Renders a 1200x630 PNG social card. */
export async function renderCard({ title, eyebrow, tags = [] }: CardInput): Promise<Buffer> {
  const size = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;
  const tagLine = tags.slice(0, 4).map((t) => `#${t}`).join('  ');

  const tree = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: WIDTH,
      height: HEIGHT,
      padding: '64px 72px',
      background: BG,
      color: TEXT,
      position: 'relative',
    },
    [
      el('img', { position: 'absolute', top: 0, left: 0 }, undefined, { src: backdrop, width: WIDTH, height: HEIGHT }),
      el('div', { display: 'flex', fontFamily: 'Mono', fontWeight: 500, fontSize: 26, letterSpacing: 3, color: MUTED, textTransform: 'uppercase' }, eyebrow),
      el('div', { display: 'flex', fontFamily: 'Serif', fontWeight: 700, fontSize: size, lineHeight: 1.12, letterSpacing: -1, lineClamp: 4 }, title),
      el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        el('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
          el('img', {}, undefined, { src: logo, width: 64, height: 40 }),
          el('div', { display: 'flex', fontFamily: 'Mono', fontWeight: 700, fontSize: 32 }, SITE.title),
        ]),
        el('div', { display: 'flex', fontFamily: 'Mono', fontWeight: 500, fontSize: 24, color: MUTED }, tagLine),
      ]),
    ],
  );

  const svg = await satori(tree as never, { width: WIDTH, height: HEIGHT, fonts: await loadFonts() });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
