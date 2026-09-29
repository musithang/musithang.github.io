// Draws ```mermaid blocks in the browser. The mermaid library is large, so it is a dynamic
// import that only starts when a diagram is about to scroll into view. A diagram that is never
// reached costs nothing, and the readable source stays visible until (and unless) it is drawn.

const blocks = Array.from(document.querySelectorAll<HTMLElement>('pre.mermaid'));

if (blocks.length > 0) {
  for (const el of blocks) el.dataset.source = el.textContent ?? '';
  start();
}

function start() {
  let mermaidPromise: Promise<typeof import('mermaid').default> | undefined;
  const loadMermaid = () => (mermaidPromise ??= import('mermaid').then((m) => m.default));
  let counter = 0;
  let configuredFor = '';

  // Custom properties hold light-dark() expressions; resolve them via a real property.
  const probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.append(probe);
  const color = (name: string) => {
    probe.style.color = `var(${name})`;
    return getComputedStyle(probe).color;
  };

  const isDark = () => {
    const scheme = getComputedStyle(document.documentElement).colorScheme;
    return scheme === 'dark' || (scheme.includes('dark') && matchMedia('(prefers-color-scheme: dark)').matches);
  };

  /** Applies the blog palette. Cheap to skip when the theme has not changed since the last call. */
  function configure(mermaid: Awaited<ReturnType<typeof loadMermaid>>) {
    const key = String(isDark());
    if (key === configuredFor) return;
    configuredFor = key;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      // Natural size, never squeezed to the column: wide diagrams scroll instead of turning tiny.
      flowchart: { useMaxWidth: false },
      sequence: { useMaxWidth: false },
      gantt: { useMaxWidth: false },
      state: { useMaxWidth: false },
      class: { useMaxWidth: false },
      er: { useMaxWidth: false },
      journey: { useMaxWidth: false },
      fontFamily: getComputedStyle(document.body).getPropertyValue('--font-serif') || 'serif',
      themeVariables: {
        darkMode: isDark(),
        background: color('--bg'),
        primaryColor: color('--surface'),
        primaryTextColor: color('--text'),
        primaryBorderColor: color('--accent'),
        lineColor: color('--muted'),
        secondaryColor: color('--surface'),
        tertiaryColor: color('--bg'),
        edgeLabelBackground: color('--bg'),
        noteBkgColor: color('--surface'),
        noteTextColor: color('--text'),
        noteBorderColor: color('--border'),
        actorBkg: color('--surface'),
        actorBorder: color('--accent'),
        actorTextColor: color('--text'),
        signalColor: color('--muted'),
        signalTextColor: color('--text'),
      },
    });
  }

  async function draw(el: HTMLElement) {
    const mermaid = await loadMermaid();
    configure(mermaid);
    try {
      const { svg } = await mermaid.render(`mermaid-${counter++}`, el.dataset.source ?? '');
      el.innerHTML = svg;
      el.dataset.rendered = '';
      // A wide diagram scrolls sideways, so it must be reachable and named for keyboard users.
      el.tabIndex = 0;
      el.setAttribute('role', 'group');
      el.setAttribute('aria-label', 'Diagram');
    } catch (error) {
      console.error('mermaid: could not render diagram', error);
      el.textContent = el.dataset.source ?? '';
      delete el.dataset.rendered;
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
    }
  }

  // Mermaid keeps shared state while rendering, so draw one diagram at a time.
  let chain: Promise<void> = Promise.resolve();
  const queue = (el: HTMLElement) => (chain = chain.then(() => draw(el)));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        void queue(entry.target as HTMLElement);
      }
    },
    { rootMargin: '200px 0px' },
  );
  for (const el of blocks) observer.observe(el);

  // Diagrams nobody scrolled to would print as source, so draw the rest once things are quiet.
  setTimeout(() => {
    for (const el of blocks) {
      if (el.dataset.rendered === undefined) {
        observer.unobserve(el);
        void queue(el);
      }
    }
  }, 8000);

  const redraw = () => {
    configuredFor = '';
    for (const el of blocks) if (el.dataset.rendered !== undefined) void queue(el);
  };
  document.addEventListener('themechange', redraw);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw);
}
