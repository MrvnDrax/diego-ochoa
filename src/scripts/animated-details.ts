/** Keep native details usable without JavaScript; enhance its height transition. */
export function animateDetails(details: HTMLDetailsElement): () => void {
  const summary = details.querySelector('summary');
  const answer = details.querySelector<HTMLElement>('[data-details-answer]');
  if (!summary || !answer || details.dataset.animatedDetails === 'true')
    return () => {};
  details.dataset.animatedDetails = 'true';
  let expanded = details.open;
  let animation: Animation | undefined;
  let fade: Animation | undefined;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const settle = () => {
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
    }
    fade?.cancel();
    animation = undefined;
    fade = undefined;
    details.open = expanded;
    details.dataset.expanded = String(expanded);
    details.style.removeProperty('height');
    details.style.removeProperty('overflow');
  };
  details.dataset.expanded = String(expanded);
  const toggle = (event: Event) => {
    event.preventDefault();
    const start = details.getBoundingClientRect().height;
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
    }
    fade?.cancel();
    if (!expanded)
      details.dispatchEvent(
        new CustomEvent('details:opening', { bubbles: true }),
      );
    expanded = !expanded;
    details.dataset.expanded = String(expanded);
    if (motion.matches || typeof details.animate !== 'function') {
      settle();
      return;
    }
    details.style.height = `${start}px`;
    details.style.overflow = 'hidden';
    details.open = true;
    const style = getComputedStyle(details);
    const borders =
      (parseFloat(style.borderTopWidth) || 0) +
      (parseFloat(style.borderBottomWidth) || 0);
    const end =
      summary.getBoundingClientRect().height +
      (expanded ? answer.getBoundingClientRect().height : 0) +
      borders;
    const current = details.animate(
      [{ height: `${start}px` }, { height: `${end}px` }],
      { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
    animation = current;
    if (expanded)
      fade = answer.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 320,
        easing: 'ease-out',
      });
    current.onfinish = () => {
      if (animation === current) settle();
    };
  };
  const stopMotion = () => {
    if (motion.matches) settle();
  };
  const resize = () => {
    if (animation) settle();
  };
  const syncNativeState = () => {
    if (!animation) {
      expanded = details.open;
      details.dataset.expanded = String(expanded);
    }
  };
  summary.addEventListener('click', toggle);
  details.addEventListener('toggle', syncNativeState);
  motion.addEventListener('change', stopMotion);
  window.addEventListener('resize', resize);
  return () => {
    settle();
    summary.removeEventListener('click', toggle);
    details.removeEventListener('toggle', syncNativeState);
    motion.removeEventListener('change', stopMotion);
    window.removeEventListener('resize', resize);
    delete details.dataset.animatedDetails;
    delete details.dataset.expanded;
  };
}
