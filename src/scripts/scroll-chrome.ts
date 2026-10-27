// Mobile/tablet chrome: hide after deliberate downward scroll, reveal promptly upward.
let disposeScrollChrome: (() => void) | undefined;

function initializeScrollChrome(): void {
  disposeScrollChrome?.();
  const header = document.querySelector<HTMLElement>('.site-header');
  const contact = document.querySelector<HTMLElement>('.mobile-contact-bar');
  if (!header || !contact) return;
  const page = document.documentElement;
  const mobile = window.matchMedia('(max-width: 74.999rem)');
  const visualViewport = window.visualViewport;
  let previousWidth = window.innerWidth;
  let previousY = Math.max(0, window.scrollY);
  let direction = 0;
  let travel = 0;
  let frame = 0;
  let viewportFrame = 0;
  let hidden = false;

  const syncVisualViewport = (): void => {
    viewportFrame = 0;
    const top = visualViewport?.offsetTop ?? 0;
    const height = visualViewport?.height ?? window.innerHeight;
    const left = visualViewport?.offsetLeft ?? 0;
    const width = visualViewport?.width ?? window.innerWidth;
    page.style.setProperty('--visual-viewport-width', `${width}px`);
    page.style.setProperty(
      '--visual-viewport-center-x',
      `${left + width / 2}px`,
    );
    page.style.setProperty('--visual-viewport-height', `${height}px`);
    page.style.setProperty('--visual-viewport-top', `${top}px`);
    page.style.setProperty('--visual-viewport-bottom-y', `${top + height}px`);
    page.style.setProperty(
      '--visual-viewport-center-y',
      `${top + height / 2}px`,
    );
  };
  const scheduleVisualViewportSync = (): void => {
    if (!viewportFrame)
      viewportFrame = window.requestAnimationFrame(syncVisualViewport);
  };

  const setHidden = (next: boolean): void => {
    hidden = next && mobile.matches;
    page.dataset.scrollChrome = hidden ? 'hidden' : 'shown';
    header.inert = hidden;
    contact.inert = hidden;
    if (hidden) {
      header.setAttribute('aria-hidden', 'true');
      contact.setAttribute('aria-hidden', 'true');
    } else {
      header.removeAttribute('aria-hidden');
      contact.removeAttribute('aria-hidden');
    }
  };
  const measureContact = (): void => {
    const height = contact.getBoundingClientRect().height;
    if (height > 0)
      page.style.setProperty('--mobile-contact-height', height + 'px');
  };
  const hasInteraction = (): boolean => {
    const active = document.activeElement;
    return (
      Boolean(document.querySelector('dialog[open]')) ||
      Boolean(
        active instanceof HTMLElement &&
        active.matches(':focus-visible') &&
        (header.contains(active) || contact.contains(active)),
      )
    );
  };
  const update = (): void => {
    frame = 0;
    const maxY = Math.max(0, page.scrollHeight - window.innerHeight);
    const y = Math.max(0, Math.min(window.scrollY, maxY));
    const delta = y - previousY;
    previousY = y;
    if (!mobile.matches || y < 80 || hasInteraction()) {
      travel = 0;
      direction = 0;
      setHidden(false);
      return;
    }
    if (Math.abs(delta) < 2) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) {
      travel = 0;
      direction = nextDirection;
    }
    travel += Math.abs(delta);
    if (direction > 0 && travel >= 32) setHidden(true);
    if (direction < 0 && travel >= 12) setHidden(false);
  };
  const onScroll = (): void => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  const reveal = (): void => {
    travel = 0;
    direction = 0;
    previousY = Math.max(0, window.scrollY);
    setHidden(false);
  };
  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Tab' || event.key === 'Escape') reveal();
  };
  const onResize = (): void => {
    measureContact();
    scheduleVisualViewportSync();
    const width = window.innerWidth;
    if (Math.abs(width - previousWidth) > 1) {
      previousWidth = width;
      reveal();
      return;
    }
    // Safari resizes the visual area as its URL bar collapses or expands.
    // Keep the reading chrome hidden through those height-only changes.
    previousY = Math.max(0, window.scrollY);
    travel = 0;
    direction = 0;
  };
  const onMediaChange = (): void => {
    previousWidth = window.innerWidth;
    measureContact();
    scheduleVisualViewportSync();
    reveal();
  };
  const observer = new MutationObserver(() => {
    if (document.querySelector('dialog[open]')) reveal();
  });
  document
    .querySelectorAll('dialog')
    .forEach((dialog) =>
      observer.observe(dialog, { attributes: true, attributeFilter: ['open'] }),
    );
  const resizeObserver = new ResizeObserver(measureContact);
  resizeObserver.observe(contact);
  setHidden(false);
  measureContact();
  syncVisualViewport();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  visualViewport?.addEventListener('resize', scheduleVisualViewportSync, {
    passive: true,
  });
  visualViewport?.addEventListener('scroll', scheduleVisualViewportSync, {
    passive: true,
  });
  mobile.addEventListener('change', onMediaChange);
  document.addEventListener('keydown', onKey);
  disposeScrollChrome = () => {
    window.cancelAnimationFrame(frame);
    window.cancelAnimationFrame(viewportFrame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    visualViewport?.removeEventListener('resize', scheduleVisualViewportSync);
    visualViewport?.removeEventListener('scroll', scheduleVisualViewportSync);
    mobile.removeEventListener('change', onMediaChange);
    document.removeEventListener('keydown', onKey);
    observer.disconnect();
    resizeObserver.disconnect();
    setHidden(false);
  };
}
initializeScrollChrome();
document.addEventListener('astro:page-load', initializeScrollChrome);
