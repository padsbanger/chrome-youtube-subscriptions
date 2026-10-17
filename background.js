"use strict";
(() => {
    const DEFAULT_SETTINGS = {
        hideShorts: true,
        subscriptionVideosOnly: true,
        gridColumns: 4,
        dimWatched: true
    };
    chrome.runtime.onInstalled.addListener(async () => {
        const saved = await chrome.storage.sync.get([
            ...Object.keys(DEFAULT_SETTINGS),
            "fourAcrossSubscriptions"
        ]);
        const missing = Object.fromEntries(Object.entries(DEFAULT_SETTINGS).filter(([key]) => saved[key] === undefined));
        if (typeof saved.gridColumns !== "number" && typeof saved.fourAcrossSubscriptions === "boolean") {
            missing.gridColumns = saved.fourAcrossSubscriptions ? 4 : 0;
        }
        await chrome.storage.sync.set(missing);
        await chrome.storage.sync.remove(["fourAcrossSubscriptions"]);
    });
})();
