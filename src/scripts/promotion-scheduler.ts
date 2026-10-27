/** Preserve the automatic promotion when the visitor is using another dialog. */
export function schedulePromotion(popup: HTMLDialogElement) {
  if (
    popup.dataset.frequency !== 'always' ||
    popup.dataset.preview === 'true'
  ) {
    return () => {};
  }

  let pending = true;
  let due = false;
  let timer: number | undefined;
  const stop = () => {
    pending = false;
    window.clearTimeout(timer);
    document.removeEventListener('site:ready', startTimer);
    document.removeEventListener('close', retry, true);
    popup.removeEventListener('admodule:open', stop);
  };
  const retry = () => {
    if (!pending || !due) return;
    if (!popup.isConnected || popup.open) {
      stop();
      return;
    }
    if (document.querySelector('dialog[open]')) return;
    popup.showModal();
    popup.dispatchEvent(
      new CustomEvent('admodule:open', {
        bubbles: true,
        detail: {
          id: popup.dataset.adId,
          placement: 'popup',
          source: 'deferred',
        },
      }),
    );
  };

  const delay = Number(popup.dataset.delay);
  const startTimer = () => {
    if (!pending || timer !== undefined) return;
    // The promotion delay begins after the page loader has disappeared.
    timer = window.setTimeout(
      () => {
        due = true;
        retry();
      },
      Number.isFinite(delay) ? Math.max(0, delay) : 8000,
    );
  };

  popup.addEventListener('admodule:open', stop);
  document.addEventListener('close', retry, true);
  if (document.documentElement.dataset.siteReady === 'true') {
    startTimer();
  } else {
    document.addEventListener('site:ready', startTimer, { once: true });
  }
  return stop;
}
