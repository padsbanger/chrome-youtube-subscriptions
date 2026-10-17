"use strict";
(() => {
    const DEFAULT_SETTINGS = {
        hideShorts: true,
        subscriptionVideosOnly: true,
        gridColumns: 4,
        dimWatched: true
    };
    const VALID_GRID_COLUMNS = [0, 3, 4, 5, 6];
    function isValidGridColumns(value) {
        return typeof value === "number" && VALID_GRID_COLUMNS.includes(value);
    }
    function readBoolean(saved, key, fallback) {
        return typeof saved[key] === "boolean" ? saved[key] : fallback;
    }
    function readGridColumns(saved) {
        if (isValidGridColumns(saved.gridColumns))
            return saved.gridColumns;
        if (saved.fourAcrossSubscriptions === true)
            return 4;
        if (saved.fourAcrossSubscriptions === false)
            return 0;
        return DEFAULT_SETTINGS.gridColumns;
    }
    let settings = { ...DEFAULT_SETTINGS };
    init();
    async function init() {
        const saved = await chrome.storage.sync.get([
            ...Object.keys(DEFAULT_SETTINGS),
            "fourAcrossSubscriptions"
        ]);
        settings = {
            hideShorts: readBoolean(saved, "hideShorts", DEFAULT_SETTINGS.hideShorts),
            subscriptionVideosOnly: readBoolean(saved, "subscriptionVideosOnly", DEFAULT_SETTINGS.subscriptionVideosOnly),
            gridColumns: readGridColumns(saved),
            dimWatched: readBoolean(saved, "dimWatched", DEFAULT_SETTINGS.dimWatched)
        };
        applySettings();
        whenDocumentElementReady(watchPageChanges);
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName !== "sync")
                return;
            for (const [key, change] of Object.entries(changes)) {
                if (key === "gridColumns") {
                    if (isValidGridColumns(change.newValue)) {
                        settings.gridColumns = change.newValue;
                    }
                    continue;
                }
                if (!isBooleanSettingKey(key) || typeof change.newValue !== "boolean")
                    continue;
                settings[key] = change.newValue;
            }
            applySettings();
            hideSubscriptionSections();
            markWatchedVideos();
        });
    }
    function whenDocumentElementReady(callback) {
        if (document.documentElement) {
            callback();
            return;
        }
        const timer = window.setInterval(() => {
            if (!document.documentElement)
                return;
            window.clearInterval(timer);
            callback();
        }, 10);
    }
    function watchPageChanges() {
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
    function applySettings() {
        const root = document.documentElement;
        if (!root)
            return;
        root.classList.toggle("ysf-hide-shorts", settings.hideShorts);
        root.classList.toggle("ysf-subscription-videos-only", settings.subscriptionVideosOnly);
        root.classList.toggle("ysf-dim-watched", settings.dimWatched);
        if (settings.gridColumns === 0) {
            root.removeAttribute("data-ysf-grid-columns");
        }
        else {
            root.dataset.ysfGridColumns = String(settings.gridColumns);
        }
    }
    function hideSubscriptionSections() {
        if (!settings.subscriptionVideosOnly || !isSubscriptionsPage()) {
            document.querySelectorAll(".ysf-hidden-subscription-section").forEach((node) => {
                node.classList.remove("ysf-hidden-subscription-section");
            });
            return;
        }
        document
            .querySelectorAll("ytd-browse[page-subtype='subscriptions'] ytd-rich-section-renderer, ytd-browse[page-subtype='subscriptions'] ytd-item-section-renderer")
            .forEach((section) => {
            if (isRegularVideoSection(section))
                return;
            section.classList.add("ysf-hidden-subscription-section");
        });
    }
    function isSubscriptionsPage() {
        return location.pathname === "/feed/subscriptions";
    }
    function isRegularVideoSection(section) {
        return (section.matches("ytd-item-section-renderer") &&
            Boolean(section.querySelector("ytd-video-renderer, ytd-grid-video-renderer")));
    }
    function markWatchedVideos() {
        if (!settings.dimWatched) {
            document.querySelectorAll(".ysf-watched").forEach((node) => {
                node.classList.remove("ysf-watched");
            });
            return;
        }
        const watchedMarkers = document.querySelectorAll("ytd-thumbnail-overlay-resume-playback-renderer, ytd-thumbnail-overlay-playback-status-renderer[overlay-style='WATCHED']");
        watchedMarkers.forEach((marker) => {
            const video = marker.closest("ytd-rich-item-renderer") ||
                marker.closest("ytd-grid-video-renderer") ||
                marker.closest("ytd-video-renderer");
            if (video) {
                video.classList.add("ysf-watched");
            }
        });
    }
    function isBooleanSettingKey(key) {
        return key === "hideShorts" || key === "subscriptionVideosOnly" || key === "dimWatched";
    }
})();
