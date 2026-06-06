# YouTube Subscriptions Focus

A small Chrome/Brave extension for reducing YouTube subscription-page clutter while keeping the normal Home view intact.

## Features

- Hides Shorts shelves, sidebar entries, and Shorts video tiles
- Removes inserted subscription sections like Newest and Most relevant
- Displays subscription videos in a four-column grid
- Optionally dims watched videos
- Stores settings with Chrome sync storage

## Install locally

1. Open `chrome://extensions` in Chrome or `brave://extensions` in Brave.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select this project folder.

The extension popup lets you toggle each behavior on or off.

## Development

The extension logic is written in TypeScript under `src/`. The compiled JavaScript files stay at the project root because `manifest.json` loads them directly.

```sh
npm install
npm run build
npm run check
```

After rebuilding, reload the unpacked extension from the browser extensions page.
