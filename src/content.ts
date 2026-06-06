(() => {
  type Settings = {
    hideShorts: boolean;
    subscriptionVideosOnly: boolean;
    fourAcrossSubscriptions: boolean;
    dimWatched: boolean;
  };

  const DEFAULT_SETTINGS: Settings = {
    hideShorts: true,
    subscriptionVideosOnly: true,
    fourAcrossSubscriptions: true,
    dimWatched: true
  };

  let settings: Settings = { ...DEFAULT_SETTINGS };

  init();

  async function init(): Promise<void> {
    settings = {
      ...DEFAULT_SETTINGS,
      ...(await chrome.storage.sync.get(DEFAULT_SETTINGS))
    };

    applySettings();
    whenDocumentElementReady(watchPageChanges);

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "sync") return;

      for (const [key, change] of Object.entries(changes)) {
        if (!isSettingKey(key) || typeof change.newValue !== "boolean") continue;

        settings[key] = change.newValue;
      }

      applySettings();
      hideSubscriptionSections();
      markWatchedVideos();
    });
  }

  function whenDocumentElementReady(callback: () => void): void {
    if (document.documentElement) {
      callback();
      return;
    }

    const timer = window.setInterval(() => {
      if (!document.documentElement) return;

      window.clearInterval(timer);
      callback();
    }, 10);
  }

  function watchPageChanges(): void {
    hideSubscriptionSections();
    markWatchedVideos();

    document.addEventListener("yt-navigate-finish", () => {
      applySettings();
      hideSubscriptionSections();
      markWatchedVideos();
    });

    const observer = new MutationObserver(() => {
      hideSubscriptionSections();
      markWatchedVideos();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function applySettings(): void {
    const root = document.documentElement;
    if (!root) return;

    root.classList.toggle("ysf-hide-shorts", settings.hideShorts);
    root.classList.toggle("ysf-subscription-videos-only", settings.subscriptionVideosOnly);
    root.classList.toggle("ysf-four-across-subscriptions", settings.fourAcrossSubscriptions);
    root.classList.toggle("ysf-dim-watched", settings.dimWatched);
  }

  function hideSubscriptionSections(): void {
    if (!settings.subscriptionVideosOnly || !isSubscriptionsPage()) {
      document.querySelectorAll(".ysf-hidden-subscription-section").forEach((node) => {
        node.classList.remove("ysf-hidden-subscription-section");
      });
      return;
    }

    document
      .querySelectorAll(
        "ytd-browse[page-subtype='subscriptions'] ytd-rich-section-renderer, ytd-browse[page-subtype='subscriptions'] ytd-item-section-renderer"
      )
      .forEach((section) => {
        if (isRegularVideoSection(section)) return;

        section.classList.add("ysf-hidden-subscription-section");
      });
  }

  function isSubscriptionsPage(): boolean {
    return location.pathname === "/feed/subscriptions";
  }

  function isRegularVideoSection(section: Element): boolean {
    return (
      section.matches("ytd-item-section-renderer") &&
      Boolean(section.querySelector("ytd-video-renderer, ytd-grid-video-renderer"))
    );
  }

  function markWatchedVideos(): void {
    if (!settings.dimWatched) {
      document.querySelectorAll(".ysf-watched").forEach((node) => {
        node.classList.remove("ysf-watched");
      });
      return;
    }

    const watchedMarkers = document.querySelectorAll(
      "ytd-thumbnail-overlay-resume-playback-renderer, ytd-thumbnail-overlay-playback-status-renderer[overlay-style='WATCHED']"
    );

    watchedMarkers.forEach((marker) => {
      const video =
        marker.closest("ytd-rich-item-renderer") ||
        marker.closest("ytd-grid-video-renderer") ||
        marker.closest("ytd-video-renderer");

      if (video) {
        video.classList.add("ysf-watched");
      }
    });
  }

  function isSettingKey(key: string): key is keyof Settings {
    return key in DEFAULT_SETTINGS;
  }
})();
