import { gsap } from 'gsap';

type MotionKind = 'text' | 'card' | 'media' | 'action';
type MotionTarget = { element: HTMLElement; kind: MotionKind; order: number };

const selectors: Record<MotionKind, string> = {
  card: [
    'main article',
    'main details[data-faq-question]',
    'main .home-questions__list > details',
    'main .consultation__content li',
    'main .contact-page__steps li',
    'main .services-page__other li',
    'main .professional-credentials__grid > *',
    'main .featured-services__grid > *',
    'main .not-found-card',
    'footer .site-footer__main > *',
    'footer .site-footer__legal > *',
  ].join(', '),
  media: [
    'main figure',
    'main .home-hero__portrait',
    'main .doctor-story__image',
    'main .patient-care-section__image',
    'main .professional-profile-page__image',
    'main .doctor-profile-hero__media',
    'main .faq-navigator__card',
    'main .insurance-marquee',
  ].join(', '),
  action: [
    'main .button',
    'main .home-hero__actions',
    'main .consultation__booking',
    'main .doctor-story__copy > a',
    'main .section-header__actions',
  ].join(', '),
  text: 'main h1, main h2, main h3, main p',
};

const excludedArea = [
  'dialog',
  '[hidden]',
  'details:not([open])',
  '.insurance-marquee__desktop',
  '.insurance-marquee__grid',
  '.faq-navigator__visual',
  '.location-explorer__map',
  '[data-ad-popup]',
  '[data-ad-rail]',
].join(', ');

let observer: IntersectionObserver | undefined;
let activeElements: HTMLElement[] = [];

function clearMotion() {
  observer?.disconnect();
  observer = undefined;
  if (activeElements.length) {
    gsap.killTweensOf(activeElements);
    gsap.set(activeElements, {
      clearProps: 'opacity,visibility,transform,willChange',
    });
  }
  activeElements = [];
}

function collectTargets(): MotionTarget[] {
  const selected = new Map<HTMLElement, MotionKind>();

  // Animate each card or visual as a unit, without animating its text twice.
  (['card', 'media', 'action', 'text'] as const).forEach((kind) => {
    document
      .querySelectorAll<HTMLElement>(selectors[kind])
      .forEach((element) => {
        if (
        (kind !== 'card' || !element.matches('details')) &&
          element.closest(excludedArea)
        )
          return;
        if (
          Array.from(selected.keys()).some((parent) => parent.contains(element))
        )
          return;
        if (!element.getClientRects().length) return;
        selected.set(element, kind);
      });
  });

  const siblingCounts = new Map<Element, number>();
  return Array.from(selected, ([element, kind]) => {
    const parent = element.parentElement ?? document.body;
    const order = siblingCounts.get(parent) ?? 0;
    siblingCounts.set(parent, order + 1);
    return { element, kind, order };
  });
}

function initializeMotion() {
  clearMotion();
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  )
    return;

  const targets = collectTargets();
  const targetByElement = new Map(
    targets.map((target) => [target.element, target]),
  );
  const compact = window.matchMedia('(max-width: 640px)').matches;
  activeElements = targets.map(({ element }) => element);

  // The hidden state only exists after JS starts; content is available without it.
  gsap.set(activeElements, { autoAlpha: 0 });
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        const target = targetByElement.get(element);
        if (!target) continue;
        observer?.unobserve(element);

        const distance = compact ? 10 : 20;
        const from =
          target.kind === 'card'
            ? { x: target.order % 2 ? distance : -distance, y: 7, scale: 0.99 }
            : target.kind === 'media'
              ? { y: distance, scale: 0.985 }
              : { y: target.kind === 'action' ? 9 : 13 };
        const stagger = Math.min(target.order, 3) * (compact ? 0.04 : 0.07);

        gsap.fromTo(
          element,
          { autoAlpha: 0, ...from },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: compact ? 0.48 : target.kind === 'media' ? 0.74 : 0.62,
            delay: stagger,
            ease:
              target.kind === 'card'
                ? 'back.out(1.15)'
                : target.kind === 'action'
                  ? 'power3.out'
                  : 'power2.out',
            onStart: () => {
              element.style.willChange = 'transform, opacity';
            },
            clearProps: 'opacity,visibility,transform,willChange',
          },
        );
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
  );
  targets.forEach(({ element }) => observer?.observe(element));
}

initializeMotion();
document.addEventListener('astro:page-load', initializeMotion);
document.addEventListener('astro:before-swap', clearMotion);
window
  .matchMedia('(prefers-reduced-motion: reduce)')
  .addEventListener('change', initializeMotion);
