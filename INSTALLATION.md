# Installation Guide

## Quick Start

### Step 1: Download the Extension
1. Download or clone this repository to your computer
2. Extract the files if you downloaded a ZIP file

### Step 2: Generate Icons (Optional)
If you want custom icons:
1. Open `generate_icons.html` in your browser
2. Click the download buttons to get PNG icons
3. Save the downloaded files as `icon16.png`, `icon48.png`, and `icon128.png` in the `images/` folder

### Step 3: Install in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the extension folder (the folder containing `manifest.json`)
6. The extension should now appear in your toolbar

### Step 4: Test the Extension
1. Visit any website (e.g., https://www.google.com)
2. Look for terms links (they should have a 🔍 icon)
3. Hover over terms links to see instant analysis
4. Click the extension icon to access the popup

## Troubleshooting

### Extension Not Loading
- Make sure all files are in the same folder
- Check that `manifest.json` is in the root folder
- Verify that "Developer mode" is enabled

### Icons Not Showing
- Generate icons using `generate_icons.html`
- Ensure icon files are named correctly: `icon16.png`, `icon48.png`, `icon128.png`
- Place icons in the `images/` folder

### Extension Not Working
- Refresh the page after installation
- Check the browser console (F12) for errors
- Make sure the extension is enabled in `chrome://extensions/`

## File Structure
```
terms_condition_reader/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script
├── content.css           # Styles
├── popup.html            # Popup interface
├── popup.js              # Popup functionality
├── images/               # Icons folder
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
├── README.md             # Documentation
├── INSTALLATION.md       # This file
└── generate_icons.html   # Icon generator
```

## Permissions Explained
- **activeTab**: Analyzes the current page
- **scripting**: Injects content scripts
- **tabs**: Communicates between popup and content scripts
- **storage**: Saves user settings
- **host_permissions**: Fetches content from terms pages

## Support
If you encounter issues:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all files are present and correctly named
4. Try refreshing the page and reinstalling the extension 