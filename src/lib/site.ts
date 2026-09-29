import { SITE } from '../config';

/** Absolute URL on this site for a root-relative path. */
export const absoluteUrl = (path: string): string => new URL(path, SITE.url).href;

/** JSON for a <script type="application/ld+json">; `<` is escaped so the data can never close the tag. */
export const jsonLdString = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');
