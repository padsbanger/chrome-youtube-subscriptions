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

  chrome.runtime.onInstalled.addListener(async () => {
    const saved = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));
    const missing = Object.fromEntries(
      Object.entries(DEFAULT_SETTINGS).filter(([key]) => saved[key] === undefined)
    );

    if (Object.keys(missing).length > 0) {
      await chrome.storage.sync.set(missing);
    }
  });
})();
