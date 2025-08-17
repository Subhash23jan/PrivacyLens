# Terms & Conditions Red-Flag Summariser

🔍 **AI-powered Chrome extension** that detects and analyzes privacy risks in terms & conditions documents.

## Features

- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI to analyze terms & conditions
- 🔍 **Automatic Detection**: Detects terms links on any webpage
- ⚡ **Quick Hover Analysis**: Hover over terms links for instant risk assessment
- 🚨 **Risk Scoring**: Color-coded risk levels (High/Medium/Low)
- 📊 **Detailed Reports**: Shows specific privacy concerns and data theft risks
- 🎨 **Modern UI**: Clean, intuitive interface with emoji indicators

## Installation

### Prerequisites

Before installing the extension, you need to:

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in and create a new API key
   - Copy the key (starts with `AIza...`)

2. **Configure Environment Variables**:
   - See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions
   - The extension uses Chrome storage to securely store your API key

### Method 1: Load Unpacked Extension

1. **Download the extension files** to your computer
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"** and select the extension folder
5. **Configure your API key** (see Environment Setup guide)
6. **Pin the extension** to your toolbar for easy access

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon.

## How to Use

### 1. **Automatic Detection**
- The extension automatically detects terms & conditions links on any webpage
- Look for the 🔍 icon next to detected links

### 2. **Hover Analysis**
- **Hover over any terms link** to see instant risk analysis
- Get quick overview of privacy concerns without leaving the page

### 3. **Detailed Analysis**
- **Click on terms links** for comprehensive analysis
- View detailed risk breakdown with specific concerns

### 4. **Popup Analysis**
- **Click the extension icon** in your toolbar
- Click "Analyze Current Page" to analyze the current webpage

## Risk Levels

- 🚨 **HIGH (70-100)**: Serious privacy/data theft risks
- ⚠️ **MEDIUM (30-69)**: Concerning privacy practices  
- ✅ **LOW (0-29)**: Standard or minor concerns

## What It Detects

### Privacy Concerns
- Data collection practices
- Data sharing with third parties
- Data security measures
- Privacy rights limitations
- Surveillance and tracking
- Data retention policies

### Legal Red Flags
- Mandatory arbitration clauses
- Class action waivers
- Automatic renewals
- Hidden fees
- Limited liability clauses
- Intellectual property issues

## Technical Details

### Architecture
- **Manifest V3**: Modern Chrome extension architecture
- **Service Worker**: Background processing for AI analysis
- **Content Scripts**: Page detection and popup display
- **Modular Design**: Clean, maintainable code structure

### AI Integration
- **Google Gemini API**: Advanced AI analysis
- **Content Filtering**: Focuses on relevant sections
- **Risk Scoring**: Intelligent risk assessment
- **Privacy Focus**: Specialized in privacy and data theft detection

### Files Structure
```
├── manifest.json          # Extension configuration
├── config.js              # Configuration and constants
├── background.js          # Service worker (AI processing)
├── ai-service.js          # AI service module
├── content-analyzer.js    # Content analysis module
├── content.js             # Content script (link detection)
├── content.css            # Content script styles
├── popup.html             # Extension popup UI
├── popup.css              # Popup styles
├── popup.js               # Popup functionality
└── README.md              # This file
```

## Privacy & Security

- 🔒 **No Data Collection**: The extension doesn't collect or store your data
- 🛡️ **Local Processing**: Analysis happens locally in your browser
- 🔐 **Secure API**: Uses Google's secure Gemini API
- 📝 **Transparent**: Open source code for transparency

## Troubleshooting

### Common Issues

**"Analysis Failed" Error**
- Refresh the page and try again
- Check your internet connection
- Make sure the page is fully loaded

**No Terms Links Detected**
- The page might not have terms links
- Try a different website
- Check if the page is fully loaded

**Extension Not Working**
- Reload the extension in `chrome://extensions/`
- Check browser console for errors
- Make sure you're not on a restricted page

### Debug Mode
1. Open browser console (F12)
2. Look for "Terms & Conditions Red-Flag Summariser" logs
3. Check for any error messages

## Development

### Setup Development Environment
1. Clone the repository
2. Load as unpacked extension in Chrome
3. Make changes to files
4. Reload extension to test changes

### Key Files to Modify
- `config.js`: Configuration and keywords
- `ai-service.js`: AI analysis logic
- `content.js`: Link detection logic
- `popup.html/css/js`: User interface

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at browser console for error messages
3. Try reloading the extension
4. Contact support with specific error details

## License

This project is open source and available under the MIT License.

---

**Made with ❤️ for better privacy protection**