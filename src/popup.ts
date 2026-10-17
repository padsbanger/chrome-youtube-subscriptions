(() => {
  type Settings = {
    hideShorts: boolean;
    subscriptionVideosOnly: boolean;
    gridColumns: number;
    dimWatched: boolean;
  };

  const DEFAULT_SETTINGS: Settings = {
    hideShorts: true,
    subscriptionVideosOnly: true,
    gridColumns: 4,
    dimWatched: true
  };

  const VALID_GRID_COLUMNS = [0, 3, 4, 5, 6];

  function isValidGridColumns(value: unknown): value is number {
    return typeof value === "number" && VALID_GRID_COLUMNS.includes(value);
  }

  function readBoolean(saved: Record<string, unknown>, key: string, fallback: boolean): boolean {
    return typeof saved[key] === "boolean" ? saved[key] : fallback;
  }

  function readGridColumns(saved: Record<string, unknown>): number {
    if (isValidGridColumns(saved.gridColumns)) return saved.gridColumns;
    if (saved.fourAcrossSubscriptions === true) return 4;
    if (saved.fourAcrossSubscriptions === false) return 0;
    return DEFAULT_SETTINGS.gridColumns;
  }

  const controls = [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-setting]")];
  const openSubscriptionsButton = document.querySelector<HTMLButtonElement>("#openSubscriptions");

  init();

  async function init(): Promise<void> {
    const saved = await chrome.storage.sync.get([
      ...Object.keys(DEFAULT_SETTINGS),
      "fourAcrossSubscriptions"
    ]);

    const settings = {
      hideShorts: readBoolean(saved, "hideShorts", DEFAULT_SETTINGS.hideShorts),
      subscriptionVideosOnly: readBoolean(saved, "subscriptionVideosOnly", DEFAULT_SETTINGS.subscriptionVideosOnly),
      gridColumns: readGridColumns(saved),
      dimWatched: readBoolean(saved, "dimWatched", DEFAULT_SETTINGS.dimWatched)
    };

    controls.forEach((control) => {
      const key = control.dataset.setting;
      if (!key) return;

      if (control instanceof HTMLSelectElement) {
        if (key !== "gridColumns") return;

        control.value = String(settings.gridColumns);

        control.addEventListener("change", async () => {
          const value = Number(control.value);
          if (!VALID_GRID_COLUMNS.includes(value)) return;
          await chrome.storage.sync.set({ gridColumns: value });
        });
        return;
      }

      if (!isBooleanSettingKey(key)) return;

      control.checked = settings[key];

      control.addEventListener("change", async () => {
        await chrome.storage.sync.set({ [key]: control.checked });
      });
    });

    openSubscriptionsButton?.addEventListener("click", async () => {
      await chrome.tabs.create({ url: "https://www.youtube.com/feed/subscriptions" });
      window.close();
    });
  }

  function isBooleanSettingKey(key: string): key is "hideShorts" | "subscriptionVideosOnly" | "dimWatched" {
    return key === "hideShorts" || key === "subscriptionVideosOnly" || key === "dimWatched";
  }
})();
