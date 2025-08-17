// Environment Variables Loader for PrivacyLens
// This file handles loading configuration from environment variables

class EnvLoader {
  constructor() {
    this.config = {};
    this.initialized = false;
  }

  // Initialize the environment loader
  async initialize() {
    if (!this.initialized) {
      await this.loadEnvironmentVariables();
      this.initialized = true;
    }
    return this.config;
  }

  // Load environment variables from .env file or use defaults
  async loadEnvironmentVariables() {
    // For browser extensions, we'll use a different approach
    // since .env files aren't directly accessible
    // This will be populated from the extension's storage or config
    
    this.config = {
      // Gemini AI API Configuration
      GEMINI_API_KEY: await this.getEnvVar('GEMINI_API_KEY', ''),
      GEMINI_MODEL: await this.getEnvVar('GEMINI_MODEL', 'gemini-1.5-flash'),
      GEMINI_URL: await this.getEnvVar('GEMINI_URL', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'),
      
      // API Settings
      MAX_CONTENT_LENGTH: parseInt(await this.getEnvVar('MAX_CONTENT_LENGTH', '3000')),
      MAX_RESPONSE_TOKENS: parseInt(await this.getEnvVar('MAX_RESPONSE_TOKENS', '1024')),
      TIMEOUT_MS: parseInt(await this.getEnvVar('TIMEOUT_MS', '10000')),
      
      // UI Settings
      POPUP_WIDTH: parseInt(await this.getEnvVar('POPUP_WIDTH', '350')),
      POPUP_HEIGHT: parseInt(await this.getEnvVar('POPUP_HEIGHT', '500')),
      HOVER_DELAY: parseInt(await this.getEnvVar('HOVER_DELAY', '500')),
      MAX_FLAGS_DISPLAY: parseInt(await this.getEnvVar('MAX_FLAGS_DISPLAY', '3')),
      ANIMATION_DURATION: parseInt(await this.getEnvVar('ANIMATION_DURATION', '300')),
      
      // Risk Scoring
      HIGH_THRESHOLD: parseInt(await this.getEnvVar('HIGH_THRESHOLD', '70')),
      MEDIUM_THRESHOLD: parseInt(await this.getEnvVar('MEDIUM_THRESHOLD', '30')),
      HIGH_WEIGHT: parseInt(await this.getEnvVar('HIGH_WEIGHT', '3')),
      MEDIUM_WEIGHT: parseInt(await this.getEnvVar('MEDIUM_WEIGHT', '2')),
      LOW_WEIGHT: parseInt(await this.getEnvVar('LOW_WEIGHT', '1'))
    };
  }

  // Get environment variable with fallback
  async getEnvVar(key, defaultValue = '') {
    // In a browser extension context, we'll check chrome.storage
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await new Promise((resolve) => {
          chrome.storage.sync.get(['privacyLensConfig'], (result) => {
            resolve(result.privacyLensConfig || {});
          });
        });
        return result[key] || defaultValue;
      }
    } catch (error) {
      console.warn('Failed to load from chrome.storage:', error);
    }
    return defaultValue;
  }

  // Get configuration object
  getConfig() {
    return this.config;
  }

  // Get specific configuration value
  get(key) {
    return this.config[key];
  }

  // Check if API key is configured
  isApiKeyConfigured() {
    return this.config.GEMINI_API_KEY && this.config.GEMINI_API_KEY !== '';
  }

  // Validate configuration
  validate() {
    const errors = [];
    
    if (!this.isApiKeyConfigured()) {
      errors.push('GEMINI_API_KEY is not configured');
    }
    
    if (this.config.MAX_CONTENT_LENGTH <= 0) {
      errors.push('MAX_CONTENT_LENGTH must be greater than 0');
    }
    
    if (this.config.TIMEOUT_MS <= 0) {
      errors.push('TIMEOUT_MS must be greater than 0');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnvLoader;
} else if (typeof window !== 'undefined') {
  // Browser context (not service worker)
  window.EnvLoader = EnvLoader;
} else if (typeof self !== 'undefined') {
  // Service worker context
  self.EnvLoader = EnvLoader;
}
