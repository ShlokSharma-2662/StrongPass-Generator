# StrongPass Browser Extension

A lightweight browser extension for generating secure passwords instantly.

## Installation

### Chrome / Edge / Brave

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select this `browser-extension` directory.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file in this directory.

## Features

- **Instant Generation**: Generates passwords locally using `crypto.getRandomValues`.
- **Customizable**: Adjust length and character sets.
- **Dark Mode**: Matches the main application theme.
- **One-Click Copy**: Quickly copy to clipboard.
- **Offline**: Works completely offline.
