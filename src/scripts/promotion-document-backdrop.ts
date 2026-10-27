/**
 * WebKit can clip fixed/top-layer backdrops to its toolbar viewport on iOS.
 * Paint the dimming layer in document coordinates instead. The native dialog
 * stays in the top layer, retaining focus trapping, Escape and modal semantics.
 * See https://bugs.webkit.org/show_bug.cgi?id=300965
 */
export function mountPromotionDocumentBackdrop(popup: HTMLDialogElement) {
  const backdrop = document.createElement('div');
  backdrop.className = 'ad-popup-document-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.hidden = !popup.open;
  document.body.append(backdrop);
  popup.dataset.documentBackdrop = 'true';

  // Observe the native state so automatic, manual and Escape dismissals all
  // update the layer before the next paint, without a permanent resize loop.
  const observer = new MutationObserver(() => {
    backdrop.hidden = !popup.open;
  });
  observer.observe(popup, { attributes: true, attributeFilter: ['open'] });

  return () => {
    observer.disconnect();
    backdrop.remove();
    delete popup.dataset.documentBackdrop;
  };
}

export function needsDocumentPromotionBackdrop(): boolean {
  return (
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}
