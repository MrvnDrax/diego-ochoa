function initializeLocationExplorer(root: HTMLElement): void {
  if (root.dataset.locationExplorerReady === 'true') {
    return;
  }

  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-location-tab]'),
  );

  const panelElement = root.querySelector<HTMLElement>('[data-location-panel]');

  const mapFrameElement = root.querySelector<HTMLIFrameElement>(
    '[data-location-map-frame]',
  );

  const loader = root.querySelector<HTMLElement>('[data-location-loader]');

  const titleElement = root.querySelector<HTMLElement>('[data-location-title]');

  const addressElement = root.querySelector<HTMLElement>(
    '[data-location-address]',
  );

  const primaryBadgeElement = root.querySelector<HTMLElement>(
    '[data-location-primary-badge]',
  );

  const whatsappLinkElement = root.querySelector<HTMLAnchorElement>(
    '[data-location-whatsapp-link]',
  );

  const mapLinkElement = root.querySelector<HTMLAnchorElement>(
    '[data-location-map-link]',
  );

  if (
    tabs.length === 0 ||
    panelElement === null ||
    mapFrameElement === null ||
    titleElement === null ||
    addressElement === null ||
    primaryBadgeElement === null ||
    whatsappLinkElement === null ||
    mapLinkElement === null
  ) {
    return;
  }

  /*
   * Estas referencias ya son definitivamente
   * no nulas. Así TypeScript conserva sus tipos
   * dentro de callbacks y eventos.
   */
  const panel: HTMLElement = panelElement;

  const mapFrame: HTMLIFrameElement = mapFrameElement;

  const title: HTMLElement = titleElement;

  const address: HTMLElement = addressElement;

  const primaryBadge: HTMLElement = primaryBadgeElement;

  const whatsappLink: HTMLAnchorElement = whatsappLinkElement;

  const mapLink: HTMLAnchorElement = mapLinkElement;

  const initialSelectedTab =
    tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabs[0];

  if (!initialSelectedTab) {
    return;
  }

  let selectedTab: HTMLButtonElement = initialSelectedTab;

  let mapLoadingTimeout: number | undefined;

  function setLoading(isLoading: boolean): void {
    panel.setAttribute('aria-busy', String(isLoading));

    if (loader) {
      loader.hidden = !isLoading;
    }
  }

  function finishMapLoading(): void {
    if (mapLoadingTimeout !== undefined) {
      window.clearTimeout(mapLoadingTimeout);
      mapLoadingTimeout = undefined;
    }

    setLoading(false);
  }

  mapFrame.addEventListener('load', finishMapLoading);

  root.dataset.locationExplorerReady = 'true';

  function selectLocation(nextTab: HTMLButtonElement): void {
    if (nextTab === selectedTab) {
      return;
    }

    const locationArea = nextTab.dataset.locationArea;

    const locationDisplayName = nextTab.dataset.locationDisplayName;

    const locationAddress = nextTab.dataset.locationAddressValue;

    const locationMapUrl = nextTab.dataset.locationMapUrl;

    const locationMapEmbedUrl = nextTab.dataset.locationMapEmbedUrl;

    const locationWhatsAppUrl = nextTab.dataset.locationWhatsappUrl;

    const locationPrimary = nextTab.dataset.locationPrimary;

    if (
      locationArea === undefined ||
      locationDisplayName === undefined ||
      locationAddress === undefined ||
      locationMapUrl === undefined ||
      locationMapEmbedUrl === undefined ||
      locationWhatsAppUrl === undefined
    ) {
      return;
    }

    selectedTab = nextTab;

    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;

      tab.setAttribute('aria-selected', String(isSelected));

      tab.tabIndex = isSelected ? 0 : -1;

      tab.classList.toggle('location-explorer__tab--active', isSelected);
    });

    panel.setAttribute('aria-labelledby', selectedTab.id);

    title.textContent = locationDisplayName;

    address.textContent = locationAddress;

    primaryBadge.hidden = locationPrimary !== 'true';

    whatsappLink.href = locationWhatsAppUrl;

    whatsappLink.setAttribute(
      'aria-label',
      `Consultar una gestión en ${locationArea} por WhatsApp (se abre en una pestaña nueva)`,
    );

    mapLink.href = locationMapUrl;

    mapLink.setAttribute(
      'aria-label',
      `Ver ${locationDisplayName} en Google Maps (se abre en una pestaña nueva)`,
    );

    if (mapFrame.getAttribute('src') !== locationMapEmbedUrl) {
      setLoading(true);
      mapFrame.src = locationMapEmbedUrl;

      if (mapLoadingTimeout !== undefined) {
        window.clearTimeout(mapLoadingTimeout);
      }

      mapLoadingTimeout = window.setTimeout(finishMapLoading, 8000);
    }

    mapFrame.title = `Mapa de ${locationDisplayName}`;
  }

  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => {
      selectLocation(tab);
    });

    tab.addEventListener('keydown', (event) => {
      let nextTabIndex: number | null = null;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          nextTabIndex = (tabIndex - 1 + tabs.length) % tabs.length;
          break;

        case 'ArrowRight':
        case 'ArrowDown':
          nextTabIndex = (tabIndex + 1) % tabs.length;
          break;

        case 'Home':
          nextTabIndex = 0;
          break;

        case 'End':
          nextTabIndex = tabs.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();

      const nextTab = tabs[nextTabIndex];

      if (!nextTab) {
        return;
      }

      selectLocation(nextTab);
      nextTab.focus();
    });
  });
}

export function initializeLocationExplorers(): void {
  const explorers = document.querySelectorAll<HTMLElement>(
    '[data-location-explorer]',
  );

  explorers.forEach((explorer) => {
    initializeLocationExplorer(explorer);
  });
}
