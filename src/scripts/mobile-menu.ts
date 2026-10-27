const rootSelector = '[data-mobile-menu-root]';

function initializeMobileMenus(): void {
  const roots = document.querySelectorAll<HTMLElement>(rootSelector);

  roots.forEach((root) => {
    if (root.dataset.mobileMenuInitialized === 'true') {
      return;
    }

    const trigger = root.querySelector<HTMLButtonElement>(
      '[data-mobile-menu-trigger]',
    );

    const dialog = root.querySelector<HTMLDialogElement>(
      '[data-mobile-menu-dialog]',
    );

    const closeButton = root.querySelector<HTMLButtonElement>(
      '[data-mobile-menu-close]',
    );

    if (!trigger || !dialog || !closeButton) {
      return;
    }

    /*
     * Después de la validación creamos referencias
     * definitivamente no nulas para los callbacks.
     */

    const menuTrigger: HTMLButtonElement = trigger;
    const menuDialog: HTMLDialogElement = dialog;
    const menuCloseButton: HTMLButtonElement = closeButton;

    function setMenuState(isOpen: boolean): void {
      menuTrigger.setAttribute('aria-expanded', String(isOpen));
      menuTrigger.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú principal' : 'Abrir menú principal',
      );
    }

    function closeMenu(): void {
      if (menuDialog.open) {
        menuDialog.close();
      }
    }

    function openMenu(): void {
      if (menuDialog.open || root.dataset.mobileMenuOpening === 'true') {
        return;
      }

      setMenuState(true);

      const openDialog = (): void => {
        menuDialog.showModal();
        window.requestAnimationFrame(() => {
          menuCloseButton.focus();
        });
        delete root.dataset.mobileMenuOpening;
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        openDialog();
        return;
      }

      root.dataset.mobileMenuOpening = 'true';
      window.setTimeout(openDialog, 180);
    }

    menuTrigger.addEventListener('click', () => {
      openMenu();
    });

    menuCloseButton.addEventListener('click', closeMenu);

    menuDialog.addEventListener('close', () => {
      setMenuState(false);
    });

    menuDialog.addEventListener('click', (event) => {
      if (event.target === menuDialog) {
        closeMenu();
      }
    });

    const links = menuDialog.querySelectorAll<HTMLAnchorElement>('a[href]');

    links.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    root.dataset.mobileMenuInitialized = 'true';
  });
}

initializeMobileMenus();

document.addEventListener('astro:page-load', initializeMobileMenus);

const desktopMedia = window.matchMedia('(min-width: 75rem)');

desktopMedia.addEventListener('change', (event) => {
  if (!event.matches) {
    return;
  }

  const openDialogs = document.querySelectorAll<HTMLDialogElement>(
    '[data-mobile-menu-dialog][open]',
  );

  openDialogs.forEach((dialog) => {
    dialog.close();
  });
});
