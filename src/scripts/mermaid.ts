// Draws ```mermaid blocks in the browser. The mermaid library is a large dynamic
// import, so it is only fetched on pages that actually contain a diagram.

const blocks = Array.from(document.querySelectorAll<HTMLElement>('pre.mermaid'));

if (blocks.length > 0) {
  for (const el of blocks) el.dataset.source = el.textContent ?? '';
  void init();
}

async function init() {
  const { default: mermaid } = await import('mermaid');
  let counter = 0;

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

  async function draw() {
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

    for (const el of blocks) {
      try {
        const { svg } = await mermaid.render(`mermaid-${counter++}`, el.dataset.source ?? '');
        el.innerHTML = svg;
        el.dataset.rendered = '';
      } catch (error) {
        console.error('mermaid: could not render diagram', error);
        el.textContent = el.dataset.source ?? '';
        delete el.dataset.rendered;
      }
    }
  }

  await draw();
  document.addEventListener('themechange', draw);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
}
