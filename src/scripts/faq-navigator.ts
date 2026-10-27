function initializeFaqNavigator(root: HTMLElement): void {
  if (root.dataset.faqReady === 'true') {
    return;
  }

  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-faq-tab]'),
  );

  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[data-faq-panel]'),
  );

  const illustrations = Array.from(
    root.querySelectorAll<HTMLElement>('[data-faq-illustration]'),
  );

  const loader = root.querySelector<HTMLElement>('[data-faq-loader]');

  if (tabs.length === 0 || panels.length === 0) {
    return;
  }

  root.dataset.faqReady = 'true';

  let isChangingCategory = false;

  function setLoading(isLoading: boolean): void {
    root.setAttribute('aria-busy', String(isLoading));

    if (loader) {
      loader.hidden = !isLoading;
    }
  }

  function waitForLoader(): Promise<void> {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      window.setTimeout(resolve, 180);
    });
  }

  function getControlledPanel(tab: HTMLButtonElement): HTMLElement | null {
    const panelId = tab.getAttribute('aria-controls');

    if (!panelId) {
      return null;
    }

    return panels.find((panel) => panel.id === panelId) ?? null;
  }

  function getQuestions(panel: HTMLElement): HTMLElement[] {
    return Array.from(
      panel.querySelectorAll<HTMLElement>('[data-faq-question]'),
    );
  }

  function getCurrentIndex(panel: HTMLElement): number {
    const currentIndex = Number(panel.dataset.faqCurrentIndex ?? '0');

    return Number.isFinite(currentIndex) ? currentIndex : 0;
  }

  function showQuestion(panel: HTMLElement, requestedIndex: number): void {
    const questions = getQuestions(panel);

    if (questions.length === 0) {
      panel.dataset.faqCurrentIndex = '0';

      return;
    }

    const normalizedIndex =
      ((requestedIndex % questions.length) + questions.length) %
      questions.length;

    panel.dataset.faqCurrentIndex = String(normalizedIndex);

    questions.forEach((question, questionIndex) => {
      question.hidden = questionIndex !== normalizedIndex;
    });

    const activeQuestion = questions[normalizedIndex];

    const currentCounter =
      activeQuestion?.querySelector<HTMLElement>('[data-faq-current]');

    const totalCounter =
      activeQuestion?.querySelector<HTMLElement>('[data-faq-total]');

    const progress = panel.querySelector<HTMLElement>('[data-faq-progress]');

    const currentQuestion = normalizedIndex + 1;

    if (currentCounter) {
      currentCounter.textContent = String(currentQuestion).padStart(2, '0');
    }

    if (totalCounter) {
      totalCounter.textContent = String(questions.length).padStart(2, '0');
    }

    if (progress) {
      const progressPercentage =
        questions.length > 1
          ? (normalizedIndex / (questions.length - 1)) * 100
          : 100;

      progress.style.setProperty(
        '--faq-progress-position',
        `${progressPercentage}%`,
      );

      progress.setAttribute('aria-valuenow', String(currentQuestion));

      progress.setAttribute('aria-valuemax', String(questions.length));

      const progressSteps = progress.querySelectorAll<HTMLElement>(
        '[data-faq-progress-step]',
      );

      progressSteps.forEach((step, index) => {
        step.dataset.active = String(index <= normalizedIndex);
        step.dataset.current = String(index === normalizedIndex);
      });
    }
  }

  function waitForProgressTransition(progress: HTMLElement): Promise<void> {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let hasFinished = false;

      const finish = (): void => {
        if (hasFinished) {
          return;
        }

        hasFinished = true;

        progress.removeEventListener('transitionend', handleTransitionEnd);

        window.clearTimeout(fallbackTimeout);

        resolve();
      };

      const handleTransitionEnd = (event: TransitionEvent): void => {
        if (
          event.target === progress &&
          event.propertyName === 'background-size'
        ) {
          finish();
        }
      };

      const fallbackTimeout = window.setTimeout(finish, 550);

      progress.addEventListener('transitionend', handleTransitionEnd);
    });
  }

  async function resetPanelWithAnimation(panel: HTMLElement): Promise<void> {
    const questions = getQuestions(panel);

    const currentIndex = getCurrentIndex(panel);

    if (questions.length === 0 || currentIndex === 0) {
      showQuestion(panel, 0);
      return;
    }

    const progress = panel.querySelector<HTMLElement>('[data-faq-progress]');

    if (!progress) {
      showQuestion(panel, 0);
      return;
    }

    const transitionPromise = waitForProgressTransition(progress);

    /*
     * El número y el contenido cambian
     * inmediatamente a la pregunta uno.
     * La barra conserva su transición.
     */
    showQuestion(panel, 0);

    await transitionPromise;
  }

  panels.forEach((panel) => {
    showQuestion(panel, 0);
  });

  let selectedTab =
    tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabs[0];

  if (!selectedTab) {
    return;
  }

  function updateTabState(): void {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;

      tab.setAttribute('aria-selected', String(isSelected));

      tab.tabIndex = isSelected ? 0 : -1;

      tab.classList.toggle('faq-navigator__tab--active', isSelected);
    });

    panels.forEach((panel) => {
      const isSelected = panel.id === selectedTab.getAttribute('aria-controls');

      panel.hidden = !isSelected;
    });

    const selectedCategory = selectedTab.dataset.faqCategory;

    illustrations.forEach((illustration) => {
      illustration.hidden =
        illustration.dataset.faqCategory !== selectedCategory;
    });
  }

  async function selectTab(nextTab: HTMLButtonElement): Promise<void> {
    if (nextTab === selectedTab || isChangingCategory) {
      return;
    }

    isChangingCategory = true;
    root.dataset.faqTransitioning = 'true';
    setLoading(true);

    try {
      const previousPanel = getControlledPanel(selectedTab);

      await Promise.all([
        previousPanel
          ? resetPanelWithAnimation(previousPanel)
          : Promise.resolve(),
        waitForLoader(),
      ]);

      selectedTab = nextTab;
      updateTabState();

      const nextPanel = getControlledPanel(selectedTab);

      if (nextPanel) {
        showQuestion(nextPanel, 0);
      }
    } finally {
      setLoading(false);
      delete root.dataset.faqTransitioning;
      isChangingCategory = false;
    }
  }

  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => {
      void selectTab(tab);
    });

    tab.addEventListener('keydown', async (event) => {
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

      await selectTab(nextTab);

      nextTab.focus();
    });
  });

  panels.forEach((panel) => {
    const previousButton = panel.querySelector<HTMLButtonElement>(
      '[data-faq-previous]',
    );

    const nextButton =
      panel.querySelector<HTMLButtonElement>('[data-faq-next]');

    previousButton?.addEventListener('click', () => {
      if (isChangingCategory) {
        return;
      }

      showQuestion(panel, getCurrentIndex(panel) - 1);
    });

    nextButton?.addEventListener('click', () => {
      if (isChangingCategory) {
        return;
      }

      showQuestion(panel, getCurrentIndex(panel) + 1);
    });
  });

  updateTabState();

  const initialPanel = getControlledPanel(selectedTab);

  if (initialPanel) {
    showQuestion(initialPanel, 0);
  }
}

export function initializeFaqNavigators(): void {
  const navigators = document.querySelectorAll<HTMLElement>(
    '[data-faq-navigator]',
  );

  navigators.forEach((navigator) => {
    initializeFaqNavigator(navigator);
  });
}
