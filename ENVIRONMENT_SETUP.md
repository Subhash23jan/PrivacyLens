# Environment Setup Guide for PrivacyLens

This guide explains how to properly configure environment variables and secure your API keys for the PrivacyLens browser extension.

## 🔐 Security Overview

PrivacyLens uses environment variables to store sensitive configuration data like API keys. This ensures that:

- API keys are never hardcoded in the source code
- Sensitive data is not committed to version control
- Configuration can be easily changed without modifying code
- Different environments can have different configurations

## 📁 Files Overview

- `.env` - **NEVER COMMIT THIS FILE** - Contains your actual API keys and secrets
- `.env.example` - Template showing the required environment variables
- `env.template` - Alternative template file
- `env-loader.js` - Loads environment variables in the browser extension
- `setup-env.js` - Helper script for configuring environment variables

## 🚀 Quick Setup

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key (starts with `AIza...`)

### 2. Configure the Extension

#### Option A: Using the Extension Settings (Recommended)

1. Install the PrivacyLens extension
2. Click on the extension icon
3. Go to Settings/Configuration
4. Enter your Gemini API key
5. Save the configuration

#### Option B: Programmatic Configuration

Open the browser console and run:

```javascript
const setup = new EnvSetup();
setup.saveConfig({
  GEMINI_API_KEY: 'your_actual_api_key_here',
  GEMINI_MODEL: 'gemini-1.5-flash',
  MAX_CONTENT_LENGTH: 3000,
  TIMEOUT_MS: 10000
});
```

#### Option C: Using Chrome Storage API

```javascript
chrome.storage.sync.set({
  privacyLensConfig: {
    GEMINI_API_KEY: 'your_actual_api_key_here',
    GEMINI_MODEL: 'gemini-1.5-flash',
    MAX_CONTENT_LENGTH: 3000,
    TIMEOUT_MS: 10000
  }
});
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `GEMINI_API_KEY` | Your Gemini AI API key | (required) |
| `GEMINI_MODEL` | Gemini model to use | `gemini-1.5-flash` |
| `GEMINI_URL` | Gemini API endpoint | `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` |

### Optional Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `MAX_CONTENT_LENGTH` | Maximum content length to analyze | `3000` |
| `MAX_RESPONSE_TOKENS` | Maximum response tokens | `1024` |
| `TIMEOUT_MS` | API request timeout (ms) | `10000` |
| `POPUP_WIDTH` | Extension popup width | `350` |
| `POPUP_HEIGHT` | Extension popup height | `500` |
| `HOVER_DELAY` | Hover delay for UI elements | `500` |
| `MAX_FLAGS_DISPLAY` | Maximum flags to display | `3` |
| `ANIMATION_DURATION` | UI animation duration | `300` |
| `HIGH_THRESHOLD` | High risk threshold | `70` |
| `MEDIUM_THRESHOLD` | Medium risk threshold | `30` |
| `HIGH_WEIGHT` | High risk weight | `3` |
| `MEDIUM_WEIGHT` | Medium risk weight | `2` |
| `LOW_WEIGHT` | Low risk weight | `1` |

## 🛡️ Security Best Practices

### 1. Never Commit API Keys

- ✅ Use environment variables
- ✅ Store in Chrome sync storage
- ❌ Never hardcode in source files
- ❌ Never commit `.env` files

### 2. API Key Management

- Use different API keys for development and production
- Regularly rotate your API keys
- Monitor API usage to detect unauthorized access
- Set up API key restrictions in Google AI Studio

### 3. Storage Security

The extension uses Chrome's sync storage which:
- Encrypts data in transit and at rest
- Syncs across your Chrome devices
- Is isolated from other extensions
- Requires user permission

## 🔍 Testing Your Configuration

### Test API Key

```javascript
const setup = new EnvSetup();
setup.testApiKey('your_api_key_here').then(result => {
  if (result.isValid) {
    console.log('✅ API key is valid:', result.message);
  } else {
    console.error('❌ API key test failed:', result.error);
  }
});
```

### Validate Configuration

```javascript
const envLoader = new EnvLoader();
await envLoader.initialize();
const validation = envLoader.validate();

if (validation.isValid) {
  console.log('✅ Configuration is valid');
} else {
  console.error('❌ Configuration errors:', validation.errors);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Make sure you've set the `GEMINI_API_KEY` in the extension settings
   - Check that the API key starts with `AIza`

2. **"API test failed" error**
   - Verify your API key is correct
   - Check your internet connection
   - Ensure you have sufficient API quota

3. **Configuration not loading**
   - Try refreshing the extension
   - Check browser console for errors
   - Verify Chrome storage permissions

### Debug Mode

Enable debug logging:

```javascript
localStorage.setItem('privacyLensDebug', 'true');
```

## 📝 Example Configuration

Here's a complete example of all environment variables:

```javascript
{
  GEMINI_API_KEY: 'AIzaSyCkaN0eD-j4s5aU9aqU1iPIPW3A9YxF6Y4',
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  MAX_CONTENT_LENGTH: 3000,
  MAX_RESPONSE_TOKENS: 1024,
  TIMEOUT_MS: 10000,
  POPUP_WIDTH: 350,
  POPUP_HEIGHT: 500,
  HOVER_DELAY: 500,
  MAX_FLAGS_DISPLAY: 3,
  ANIMATION_DURATION: 300,
  HIGH_THRESHOLD: 70,
  MEDIUM_THRESHOLD: 30,
  HIGH_WEIGHT: 3,
  MEDIUM_WEIGHT: 2,
  LOW_WEIGHT: 1
}
```

## 🔄 Updates and Maintenance

- Regularly check for API key expiration
- Monitor API usage and costs
- Update environment variables when needed
- Test configuration after updates

## 📞 Support

If you encounter issues with environment setup:

1. Check the browser console for error messages
2. Verify your API key is valid
3. Test the configuration using the provided methods
4. Check the troubleshooting section above

For additional help, please refer to the main README.md file or create an issue in the project repository.
