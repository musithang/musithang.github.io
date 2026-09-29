// Search UI on top of Pagefind. Used by the modal (any page) and the /search/ page.
// The Pagefind index is built after `astro build`; in dev it is served from the last build.

interface PagefindDoc {
  url: string;
  excerpt: string;
  meta: { title?: string; date?: string };
  filters: { tag?: string[]; kind?: string[] };
}
interface PagefindResponse {
  results: { id: string; data(): Promise<PagefindDoc> }[];
}
interface Pagefind {
  init(): Promise<void>;
  filters(): Promise<Record<string, Record<string, number>>>;
  debouncedSearch(
    query: string | null,
    options?: { filters?: Record<string, string> },
    wait?: number,
  ): Promise<PagefindResponse | null>;
}

const PAGE_SIZE = 8;
const MAX_TAG_CHIPS = 10;

let pagefind: Promise<Pagefind | null> | undefined;
function loadPagefind(): Promise<Pagefind | null> {
  pagefind ??= (async () => {
    try {
      const path = '/pagefind/pagefind.js';
      const pf = (await import(/* @vite-ignore */ path)) as Pagefind;
      await pf.init();
      return pf;
    } catch {
      return null;
    }
  })();
  return pagefind;
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export interface SearchHandle {
  focus(): void;
  setQuery(query: string): void;
}

/** Builds the search UI inside `root`. `syncUrl` mirrors the query into `?q=` (search page only). */
export function mountSearch(
  root: HTMLElement,
  options: { syncUrl?: boolean; onEscape?: () => void } = {},
): SearchHandle {
  root.classList.add('search-ui');
  root.innerHTML = `
    <div class="search-field">
      <input type="text" class="search-input" placeholder="Search posts" autocomplete="off" spellcheck="false" enterkeyhint="search"
        aria-label="Search posts" />
    </div>
    <div class="search-filters" hidden></div>
    <p class="search-status mono-label" role="status" aria-live="polite"></p>
    <ul class="search-results" aria-label="Search results"></ul>
    <button type="button" class="search-more mono-label" hidden>Show more</button>`;

  const input = root.querySelector<HTMLInputElement>('.search-input')!;
  const filtersEl = root.querySelector<HTMLElement>('.search-filters')!;
  const statusEl = root.querySelector<HTMLElement>('.search-status')!;
  const list = root.querySelector<HTMLUListElement>('.search-results')!;
  const moreBtn = root.querySelector<HTMLButtonElement>('.search-more')!;

  let kind = '';
  let tag = '';
  let docs: PagefindDoc[] = [];
  let shown = 0;
  let chipsBuilt = false;
  let run = 0;

  const links = () => [...list.querySelectorAll<HTMLAnchorElement>('a')];

  // While typing, the first result is the one Enter opens: show that.
  const markFirst = () => {
    const first = list.firstElementChild;
    for (const li of list.children) li.classList.toggle('preselected', li === first && document.activeElement === input);
  };

  const renderMore = () => {
    const slice = docs.slice(shown, shown + PAGE_SIZE);
    for (const doc of slice) {
      const li = document.createElement('li');
      const tags = (doc.filters.tag ?? []).map((t) => `#${escapeHtml(t)}`).join(' ');
      const meta = [doc.meta.date?.slice(0, 10), doc.filters.kind?.[0], tags].filter(Boolean).join(' · ');
      li.innerHTML = `
        <a href="${escapeHtml(doc.url)}">
          <span class="search-title">${escapeHtml(doc.meta.title ?? doc.url)}</span>
          <span class="search-meta mono-label">${meta}</span>
          <span class="search-excerpt">${doc.excerpt}</span>
        </a>`;
      list.append(li);
    }
    shown += slice.length;
    moreBtn.hidden = shown >= docs.length;
    markFirst();
  };

  const buildChips = async (pf: Pagefind) => {
    if (chipsBuilt) return;
    chipsBuilt = true;
    const all = await pf.filters();
    const kinds = Object.keys(all.kind ?? {}).sort();
    const tags = Object.entries(all.tag ?? {})
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, MAX_TAG_CHIPS);
    if (kinds.length + tags.length === 0) return;
    const chip = (group: 'kind' | 'tag', value: string, label: string) =>
      `<button type="button" class="mono-label" data-group="${group}" data-value="${escapeHtml(value)}" aria-pressed="false">${escapeHtml(label)}</button>`;
    filtersEl.innerHTML =
      kinds.map((k) => chip('kind', k, k)).join('') + tags.map(([t, n]) => chip('tag', t, `#${t} ${n}`)).join('');
    filtersEl.hidden = false;
  };

  const search = async () => {
    const id = ++run;
    const query = input.value.trim();
    const pf = await loadPagefind();
    if (id !== run) return;
    if (!pf) {
      statusEl.textContent = 'Search index not found. Build the site first: npm run build.';
      return;
    }
    await buildChips(pf);

    list.replaceChildren();
    docs = [];
    shown = 0;

    if (!query && !kind && !tag) {
      statusEl.textContent = 'Type to search, or pick a kind or tag.';
      moreBtn.hidden = true;
      return;
    }

    const filters: Record<string, string> = {};
    if (kind) filters.kind = kind;
    if (tag) filters.tag = tag;
    const response = await pf.debouncedSearch(query || null, { filters }, query ? 120 : 0);
    if (!response || id !== run) return;

    docs = await Promise.all(response.results.slice(0, 50).map((r) => r.data()));
    if (id !== run) return;

    const total = response.results.length;
    statusEl.textContent =
      total === 0
        ? `No results${query ? ` for “${query}”` : ''}. Try fewer or different words.`
        : `${total} ${total === 1 ? 'result' : 'results'}${query ? ` for “${query}”` : ''}`;
    renderMore();
  };

  input.addEventListener('input', () => {
    if (options.syncUrl) {
      const url = new URL(location.href);
      if (input.value) url.searchParams.set('q', input.value);
      else url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }
    void search();
  });

  input.addEventListener('focus', markFirst);
  input.addEventListener('blur', markFirst);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      links()[0]?.focus();
    } else if (event.key === 'Escape' && options.onEscape) {
      event.preventDefault();
      options.onEscape();
    } else if (event.key === 'Enter') {
      const link = links()[0];
      if (link) {
        event.preventDefault();
        link.click();
      }
    }
  });

  // Arrow keys move real focus between results; typing anywhere returns to the field.
  list.addEventListener('keydown', (event) => {
    const all = links();
    const i = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      all[Math.min(i + 1, all.length - 1)].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (i === 0) input.focus();
      else all[i - 1].focus();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      input.focus();
    }
  });

  filtersEl.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-group]');
    if (!button) return;
    const group = button.dataset.group as 'kind' | 'tag';
    const value = button.dataset.value ?? '';
    const current = group === 'kind' ? kind : tag;
    const next = current === value ? '' : value;
    if (group === 'kind') kind = next;
    else tag = next;
    for (const b of filtersEl.querySelectorAll<HTMLButtonElement>('button')) {
      const selected = (b.dataset.group === 'kind' ? kind : tag) === b.dataset.value;
      b.setAttribute('aria-pressed', String(selected));
    }
    void search();
  });

  moreBtn.addEventListener('click', renderMore);

  // Warm up the index as soon as the UI exists, so the first keystroke is fast.
  void loadPagefind().then((pf) => pf && buildChips(pf)).then(() => search());

  return {
    focus: () => {
      input.focus();
      input.select();
    },
    setQuery: (query: string) => {
      input.value = query;
      void search();
    },
  };
}

let dialog: HTMLDialogElement | undefined;
let handle: SearchHandle | undefined;

/** Opens the search modal (or focuses the field when already on /search/). */
export function openSearch() {
  const inline = document.getElementById('search-page');
  if (inline) {
    inline.querySelector<HTMLInputElement>('.search-input')?.focus();
    return;
  }
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'search-dialog';
    dialog.setAttribute('aria-label', 'Search');
    const body = document.createElement('div');
    dialog.append(body);
    dialog.insertAdjacentHTML(
      'beforeend',
      `<p class="search-hints mono-label" aria-hidden="true"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></p>`,
    );
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog?.close();
    });
    document.body.append(dialog);
    handle = mountSearch(body, { onEscape: () => dialog?.close() });
  }
  if (!dialog.open) dialog.showModal();
  handle?.focus();
}
