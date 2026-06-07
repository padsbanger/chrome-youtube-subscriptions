# YouTube Subscriptions Fixer

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
npm run package
```

After rebuilding, reload the unpacked extension from the browser extensions page.

## Chrome Web Store

Run `npm run package` to create `dist/youtube-subscriptions-fixer-0.1.0.zip` for upload. Store listing copy is drafted in `STORE_LISTING.md`, and privacy policy text is drafted in `PRIVACY.md`.

Dashboard image assets are in `store-assets/`:

- `small-promo.png` for the required small promotional tile
- `screenshot-popup.png` for an initial listing screenshot
