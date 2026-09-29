// Expressive Code makes an overflowing code block a keyboard-focusable `role="region"` at runtime,
// but gives it no name. Unnamed duplicate regions fail landmark checks, so name each one.

function nameRegions() {
  const all = [...document.querySelectorAll<HTMLElement>('.expressive-code pre')];
  for (const pre of all) {
    if (pre.getAttribute('role') !== 'region' || pre.hasAttribute('aria-label')) continue;
    const title = pre.closest('figure')?.querySelector('.title')?.textContent?.trim();
    const language = pre.dataset.language;
    pre.setAttribute('aria-label', `Code block ${all.indexOf(pre) + 1}${title ? `: ${title}` : language ? ` (${language})` : ''}`);
  }
}

const article = document.querySelector('article');
if (article) {
  nameRegions();
  new MutationObserver(nameRegions).observe(article, {
    subtree: true,
    attributes: true,
    attributeFilter: ['role'],
  });
}
