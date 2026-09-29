// Click-to-enlarge for article images that are shown smaller than their real size.
// Uses a native <dialog>, so Esc, focus trapping and focus return come for free.

const images = [...document.querySelectorAll<HTMLImageElement>('article .prose img')];
let dialog: HTMLDialogElement | undefined;

function ensureDialog(): HTMLDialogElement {
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Enlarged image');
  dialog.innerHTML = `
    <form method="dialog"><button class="lightbox-close mono-label" aria-label="Close">Close ✕</button></form>
    <img alt="" />
    <p class="lightbox-caption"></p>`;
  // A click on the backdrop (the dialog itself, outside its content) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog?.close();
  });
  document.body.append(dialog);
  return dialog;
}

function open(source: HTMLImageElement) {
  const d = ensureDialog();
  const big = d.querySelector('img')!;
  big.src = source.currentSrc || source.src;
  big.alt = source.alt;
  const caption = source.closest('figure')?.querySelector('figcaption')?.textContent ?? source.alt;
  d.querySelector('.lightbox-caption')!.textContent = caption;
  d.showModal();
}

function enhance(img: HTMLImageElement) {
  if (img.closest('a, button') || img.naturalWidth <= img.clientWidth + 24) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'zoom';
  button.setAttribute('aria-label', `Enlarge image${img.alt ? `: ${img.alt}` : ''}`);
  img.replaceWith(button);
  button.append(img);
  button.addEventListener('click', () => open(img));
}

for (const img of images) {
  if (img.complete) enhance(img);
  else img.addEventListener('load', () => enhance(img), { once: true });
}
