"use strict";
(() => {
    const DEFAULT_SETTINGS = {
        hideShorts: true,
        subscriptionVideosOnly: true,
        fourAcrossSubscriptions: true,
        dimWatched: true
    };
    const inputs = [...document.querySelectorAll("[data-setting]")];
    const openSubscriptionsButton = document.querySelector("#openSubscriptions");
    init();
    async function init() {
        const settings = {
            ...DEFAULT_SETTINGS,
            ...(await chrome.storage.sync.get(DEFAULT_SETTINGS))
        };
        inputs.forEach((input) => {
            const key = input.dataset.setting;
            if (!key || !isSettingKey(key))
                return;
            input.checked = settings[key];
            input.addEventListener("change", async () => {
                await chrome.storage.sync.set({ [key]: input.checked });
            });
        });
        openSubscriptionsButton?.addEventListener("click", async () => {
            await chrome.tabs.create({ url: "https://www.youtube.com/feed/subscriptions" });
            window.close();
        });
    }
    function isSettingKey(key) {
        return key in DEFAULT_SETTINGS;
    }
})();
