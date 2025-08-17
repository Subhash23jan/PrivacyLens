// Popup Script - Handles UI interactions and analysis

class PopupManager {
  constructor() {
    this.currentUrl = null;
    this.currentAnalysis = null;
    this.initialize();
  }

  // Initialize popup
  initialize() {
    console.log('Popup: Initializing');
    
    // Get current tab URL
    this.getCurrentTabUrl();
    
    // Add event listeners
    this.addEventListeners();
    
    // Show welcome screen
    this.showScreen('welcome');
  }

  // Get current tab URL
  async getCurrentTabUrl() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentUrl = tab.url;
      console.log('Popup: Current URL', this.currentUrl);
    } catch (error) {
      console.error('Popup: Failed to get current URL', error);
    }
  }

  // Add event listeners
  addEventListeners() {
    // Analyze current page button
    const analyzeCurrentBtn = document.getElementById('analyze-current');
    if (analyzeCurrentBtn) {
      analyzeCurrentBtn.addEventListener('click', () => {
        this.analyzeCurrentPage();
      });
    }

    // View full terms button
    const viewFullBtn = document.getElementById('view-full');
    if (viewFullBtn) {
      viewFullBtn.addEventListener('click', () => {
        this.viewFullTerms();
      });
    }

    // Analyze again button
    const analyzeAgainBtn = document.getElementById('analyze-again');
    if (analyzeAgainBtn) {
      analyzeAgainBtn.addEventListener('click', () => {
        this.analyzeCurrentPage();
      });
    }

    // Retry analysis button
    const retryAnalysisBtn = document.getElementById('retry-analysis');
    if (retryAnalysisBtn) {
      retryAnalysisBtn.addEventListener('click', () => {
        this.analyzeCurrentPage();
      });
    }

    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.showSettings();
      });
    }

    // Close settings button
    const closeSettingsBtn = document.getElementById('close-settings');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => {
        this.hideSettings();
      });
    }

    // Save settings button
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        this.saveSettings();
      });
    }

    // Test API key button
    const testApiKeyBtn = document.getElementById('test-api-key');
    if (testApiKeyBtn) {
      testApiKeyBtn.addEventListener('click', () => {
        this.testApiKey();
      });
    }

    // Close modal when clicking outside
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideSettings();
        }
      });
    }
  }

  // Analyze current page
  async analyzeCurrentPage() {
    if (!this.currentUrl) {
      this.showError('No URL available');
      return;
    }

    console.log('Popup: Starting analysis for', this.currentUrl);
    
    // Show loading screen
    this.showLoadingScreen();
    
    try {
      // Request analysis from background script
      const response = await chrome.runtime.sendMessage({
        action: 'analyzePage',
        url: this.currentUrl
      });

      if (response && response.success) {
        this.currentAnalysis = response.data;
        this.showResults(response.data);
      } else {
        this.showError(response ? response.error : 'Analysis failed');
      }
      
    } catch (error) {
      console.error('Popup: Analysis failed', error);
      this.showError('Analysis failed. Please try again.');
    }
  }

  // Show loading screen
  showLoadingScreen() {
    this.showScreen('loading');
    
    // Update loading URL
    const loadingUrl = document.getElementById('loading-url');
    if (loadingUrl && this.currentUrl) {
      loadingUrl.textContent = this.currentUrl;
    }
  }

  // Show results screen
  showResults(analysis) {
    console.log('Popup: Showing results', analysis);
    
    // Update risk score
    this.updateRiskScore(analysis.riskScore);
    
    // Update red flags
    this.updateRedFlags(analysis.redFlags);
    
    // Show results screen
    this.showScreen('results');
  }

  // Update risk score display
  updateRiskScore(score) {
    const riskScoreElement = document.getElementById('risk-score');
    const riskNumber = riskScoreElement.querySelector('.risk-number');
    const riskLabel = riskScoreElement.querySelector('.risk-label');
    
    // Update score
    riskNumber.textContent = score;
    
    // Update risk level and styling
    const riskLevel = this.getRiskLevel(score);
    riskLabel.textContent = riskLevel + ' Risk';
    
    // Remove existing classes
    riskScoreElement.classList.remove('high', 'medium', 'low');
    
    // Add appropriate class
    riskScoreElement.classList.add(riskLevel.toLowerCase());
  }

  // Update red flags display
  updateRedFlags(redFlags) {
    // Update high risk flags
    this.updateFlagSection('high-flags', redFlags.HIGH || []);
    
    // Update medium risk flags
    this.updateFlagSection('medium-flags', redFlags.MEDIUM || []);
    
    // Update low risk flags
    this.updateFlagSection('low-flags', redFlags.LOW || []);
  }

  // Update a specific flag section
  updateFlagSection(sectionId, flags) {
    const section = document.getElementById(sectionId);
    const flagsList = section.querySelector('.flags-list');
    
    // Clear existing flags
    flagsList.innerHTML = '';
    
    // Add new flags
    flags.forEach(flag => {
      const flagItem = document.createElement('div');
      flagItem.className = 'flag-item';
      flagItem.innerHTML = `
        <div class="flag-title">${flag.flag}</div>
        <div class="flag-context">${flag.context}</div>
      `;
      flagsList.appendChild(flagItem);
    });
    
    // Hide section if no flags
    if (flags.length === 0) {
      section.style.display = 'none';
    } else {
      section.style.display = 'block';
    }
  }

  // Show error screen
  showError(message) {
    console.log('Popup: Showing error', message);
    
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
    
    this.showScreen('error');
  }

  // Show specific screen
  showScreen(screenName) {
    console.log('Popup: Showing screen', screenName);
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
      targetScreen.classList.add('active');
    }
  }

  // Get risk level from score
  getRiskLevel(score) {
    if (score >= 70) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  // View full terms
  viewFullTerms() {
    if (this.currentAnalysis && this.currentAnalysis.url) {
      chrome.tabs.create({ url: this.currentAnalysis.url });
    }
  }

  // Show settings modal
  showSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.style.display = 'block';
      this.loadCurrentSettings();
    }
  }

  // Hide settings modal
  hideSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Load current settings
  async loadCurrentSettings() {
    try {
      const result = await chrome.storage.sync.get(['privacyLensConfig']);
      const config = result.privacyLensConfig || {};
      
      const apiKeyInput = document.getElementById('api-key');
      if (apiKeyInput) {
        apiKeyInput.value = config.GEMINI_API_KEY || '';
      }
    } catch (error) {
      console.error('Popup: Failed to load settings', error);
    }
  }

  // Save settings
  async saveSettings() {
    const apiKeyInput = document.getElementById('api-key');
    const statusElement = document.getElementById('settings-status');
    
    if (!apiKeyInput) return;
    
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      this.showSettingsStatus('Please enter your Gemini API key', 'error');
      return;
    }
    
    try {
      // Save to Chrome storage
      await chrome.storage.sync.set({
        privacyLensConfig: {
          GEMINI_API_KEY: apiKey,
          GEMINI_MODEL: 'gemini-1.5-flash',
          GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
        }
      });
      
      this.showSettingsStatus('Settings saved successfully!', 'success');
      
      // Reload the extension to pick up new settings
      setTimeout(() => {
        chrome.runtime.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Popup: Failed to save settings', error);
      this.showSettingsStatus('Failed to save settings', 'error');
    }
  }

  // Test API key
  async testApiKey() {
    const apiKeyInput = document.getElementById('api-key');
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      this.showSettingsStatus('Please enter an API key to test', 'error');
      return;
    }
    
    this.showSettingsStatus('Testing API key...', 'info');
    
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
        this.showSettingsStatus('✅ API key is valid and working!', 'success');
      } else {
        const error = await response.json();
        this.showSettingsStatus(`❌ API test failed: ${error.error?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      this.showSettingsStatus(`❌ Network error: ${error.message}`, 'error');
    }
  }

  // Show settings status
  showSettingsStatus(message, type) {
    const statusElement = document.getElementById('settings-status');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `settings-status ${type}`;
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
}); 