type ChromeStorageAreaName = "sync" | "local" | "managed" | "session";

interface ChromeStorageChange<T = unknown> {
  oldValue?: T;
  newValue?: T;
}

interface ChromeStorageArea {
  get<T extends Record<string, unknown>>(defaults: T): Promise<Partial<T>>;
  get(keys: string[]): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
}

interface ChromeStorageChangeEvent {
  addListener(
    callback: (
      changes: Record<string, ChromeStorageChange>,
      areaName: ChromeStorageAreaName
    ) => void
  ): void;
}

interface ChromeRuntimeInstalledEvent {
  addListener(callback: () => void | Promise<void>): void;
}

interface ChromeTabsApi {
  create(createProperties: { url: string }): Promise<unknown>;
}

declare const chrome: {
  runtime: {
    onInstalled: ChromeRuntimeInstalledEvent;
  };
  storage: {
    sync: ChromeStorageArea;
    onChanged: ChromeStorageChangeEvent;
  };
  tabs: ChromeTabsApi;
};
