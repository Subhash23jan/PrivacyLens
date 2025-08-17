// Environment Setup Script for PrivacyLens
// This script helps users configure their environment variables

class EnvSetup {
  constructor() {
    this.storageKey = 'privacyLensConfig';
  }

  // Initialize environment configuration
  async initialize() {
    console.log('Initializing PrivacyLens environment configuration...');
    
    // Check if configuration already exists
    const existingConfig = await this.getStoredConfig();
    
    if (!existingConfig || !existingConfig.GEMINI_API_KEY) {
      console.warn('No API key configured. Please set up your Gemini API key.');
      return this.showSetupInstructions();
    }
    
    console.log('Configuration found and valid.');
    return existingConfig;
  }

  // Get stored configuration from chrome.storage
  async getStoredConfig() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([this.storageKey], (result) => {
        resolve(result[this.storageKey] || {});
      });
    });
  }

  // Save configuration to chrome.storage
  async saveConfig(config) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [this.storageKey]: config }, () => {
        console.log('Configuration saved successfully.');
        resolve(true);
      });
    });
  }

  // Show setup instructions
  showSetupInstructions() {
    const instructions = `
    PrivacyLens Environment Setup
    
    To configure your API key and other settings:
    
    1. Get a Gemini API key from Google AI Studio:
       https://makersuite.google.com/app/apikey
    
    2. Open the extension popup and go to Settings
    
    3. Enter your API key in the configuration form
    
    4. Save the configuration
    
    Alternative: You can also set the API key programmatically:
    
    const setup = new EnvSetup();
    setup.saveConfig({
      GEMINI_API_KEY: 'your_api_key_here',
      GEMINI_MODEL: 'gemini-1.5-flash',
      MAX_CONTENT_LENGTH: 3000,
      TIMEOUT_MS: 10000
    });
    
    Note: Your API key is stored securely in Chrome's sync storage
    and is never sent to external servers except for API calls.
    `;
    
    console.log(instructions);
    return instructions;
  }

  // Validate API key format
  validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      return { isValid: false, error: 'API key must be a non-empty string' };
    }
    
    if (apiKey.length < 20) {
      return { isValid: false, error: 'API key appears to be too short' };
    }
    
    if (!apiKey.startsWith('AIza')) {
      return { isValid: false, error: 'API key should start with "AIza"' };
    }
    
    return { isValid: true };
  }

  // Test API key by making a simple request
  async testApiKey(apiKey) {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test message.'
            }]
          }]
        })
      });
      
      if (response.ok) {
        return { isValid: true, message: 'API key is valid and working' };
      } else {
        const error = await response.json();
        return { isValid: false, error: `API test failed: ${error.error?.message || 'Unknown error'}` };
      }
    } catch (error) {
      return { isValid: false, error: `Network error: ${error.message}` };
    }
  }

  // Get default configuration
  getDefaultConfig() {
    return {
      GEMINI_API_KEY: '',
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
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnvSetup;
} else if (typeof window !== 'undefined') {
  // Browser context (not service worker)
  window.EnvSetup = EnvSetup;
} else if (typeof self !== 'undefined') {
  // Service worker context
  self.EnvSetup = EnvSetup;
}

// Auto-initialize if this script is loaded directly in a browser context
if (typeof window !== 'undefined' && window.location) {
  const setup = new EnvSetup();
  setup.initialize();
}
