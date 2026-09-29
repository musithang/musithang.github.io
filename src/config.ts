export const SITE = {
  title: 'musithang',
  description:
    'Project logs and technical writing. Hobbyist, which means nobody pays me for any of this and nobody can make me stop.',
  author: 'Viktor Laszló',
  handle: 'musithang',
  lang: 'en',
  url: 'https://musithang.github.io',
  links: {
    github: 'https://github.com/musithang',
    sdrtop: 'https://github.com/musithang/sdrtop',
  },
  /** Posts older than this get a [STALE] banner unless `evergreen: true`. */
  staleAfterMonths: 18,
} as const;
