# Sendlio Email Hunter Extension

A Chrome extension built with React that automatically detects and saves email addresses from any webpage you visit.

## Features

- 🔍 **Automatic Email Detection**: Scans every page you visit for email addresses
- 💾 **Local Storage**: Saves all found emails to Chrome's local storage
- 📋 **Copy to Clipboard**: Easily copy any email address with one click
- 🎨 **Modern UI**: Beautiful React-based popup interface
- 📊 **Statistics**: View total pages scanned and emails found

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

For development with auto-rebuild:
```bash
npm run dev
```

## How It Works

1. The content script (`content.js`) automatically runs on every page you visit
2. It scans the page content for email addresses using regex
3. Found emails are saved to Chrome's local storage along with page URL and title
4. Open the extension popup to view all saved emails

## Project Structure

```
├── src/
│   ├── popup.jsx      # React popup component
│   ├── popup.css      # Popup styles
│   ├── popup.html     # Popup HTML template
│   ├── content.js     # Content script (runs on all pages)
│   └── background.js  # Background service worker
├── manifest.json      # Extension manifest
├── webpack.config.js  # Webpack configuration
└── package.json       # Dependencies
```

## Usage

1. Install and enable the extension
2. Visit any webpage - emails will be automatically detected
3. Click the extension icon to view all saved emails
4. Copy emails or delete entries as needed
