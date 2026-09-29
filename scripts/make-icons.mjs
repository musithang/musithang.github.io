// Regenerates the raster icons in public/ from public/favicon.svg.
// Run: node scripts/make-icons.mjs   (outputs are committed, so this is only needed after a logo change)
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
const out = (name, data) => writeFile(new URL(`../public/${name}`, import.meta.url), data);

await out('apple-touch-icon.png', await png(180));
await out('icon-192.png', await png(192));
await out('icon-512.png', await png(512));

// favicon.ico: a single 32x32 PNG wrapped in an ICO container.
const ico32 = await png(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(ico32.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await out('favicon.ico', Buffer.concat([header, ico32]));
console.log('wrote apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico');
