// Crawls dist/ and verifies that every internal link and #fragment resolves.
// Run after a build: npm run check:links
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(2);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
const ids = new Map(); // page url -> Set of ids
const urlOf = (file) => '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '');

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  ids.set(urlOf(file), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const resolves = (path) => {
  const clean = path.split('?')[0];
  if (ids.has(clean)) return true;
  return existsSync(join(DIST, clean)) && statSync(join(DIST, clean)).isFile();
};

let broken = 0;
let checked = 0;
for (const file of pages) {
  const from = urlOf(file);
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const raw = m[1];
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:)/.test(raw) || raw.startsWith('//')) continue;
    const [pathPart, hash] = raw.split('#');
    const target = pathPart === '' ? from : pathPart.startsWith('/') ? pathPart : posix.join(from, pathPart);
    checked++;
    if (!resolves(target)) {
      console.error(`BROKEN  ${from}  ->  ${raw}`);
      broken++;
    } else if (hash && ids.has(target) && !ids.get(target).has(hash)) {
      console.error(`NO ANCHOR  ${from}  ->  ${raw}`);
      broken++;
    }
  }
}
console.log(`${pages.length} pages, ${checked} internal links checked, ${broken} broken`);
process.exit(broken ? 1 : 0);
