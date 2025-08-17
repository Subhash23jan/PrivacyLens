// Background Script - Handles analysis requests and AI processing

// Import modules
importScripts('env-loader.js', 'config.js', 'ai-service.js', 'content-analyzer.js');

// Initialize services
let contentAnalyzer = null;

// Initialize the content analyzer with environment variables
async function initializeServices() {
  try {
    console.log('Background: Initializing services...');
    contentAnalyzer = new ContentAnalyzer();
    await contentAnalyzer.aiService.initialize();
    console.log('Background: Services initialized successfully');
  } catch (error) {
    console.error('Background: Failed to initialize services:', error);
  }
}

// Initialize services when background script loads
initializeServices();

// Global AI analysis function
async function globalAnalyzeContent(content, url, context = 'page') {
  try {
    console.log(`Background: Global analysis for ${context}:`, url);
    
    // Ensure services are initialized
    if (!contentAnalyzer) {
      await initializeServices();
    }
    
    // Use the same AI service for all analysis
    const analysis = await contentAnalyzer.aiService.analyzeContent(content, url);
    
    console.log(`Background: Global analysis completed for ${context}`);
    return { success: true, data: analysis };
    
  } catch (error) {
    console.error(`Background: Global analysis failed for ${context}:`, error);
    return { 
      success: false, 
      error: CONFIG.ERRORS.AI_ERROR,
      details: error.message 
    };
  }
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message', request);
  
  if (request.action === 'analyzePage') {
    handlePageAnalysis(request.url, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'analyzeContent') {
    handleContentAnalysis(request.content, request.url, request.context, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (request.type === 'ANALYZE_PAGE') {
    handlePageAnalysis(request.url, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (request.type === 'ANALYZE_LINK') {
    handleLinkAnalysis(request.url, sendResponse);
    return true; // Keep message channel open for async response
  }
});

// Handle content analysis request (for filtered content)
async function handleContentAnalysis(content, url, context, sendResponse) {
  try {
    console.log('Background: Starting content analysis for', context, url);
    
    // Use global AI function
    const result = await globalAnalyzeContent(content, url, context);
    sendResponse(result);
    
  } catch (error) {
    console.error('Background: Content analysis failed', error);
    sendResponse({ 
      success: false, 
      error: CONFIG.ERRORS.AI_ERROR,
      details: error.message 
    });
  }
}

// Handle page analysis request
async function handlePageAnalysis(url, sendResponse) {
  try {
    console.log('Background: Starting page analysis for', url);
    
    // Validate URL
    if (!isValidUrl(url)) {
      throw new Error(CONFIG.ERRORS.INVALID_URL);
    }
    
    console.log('Background: URL is valid, starting analysis...');
    
    // Ensure services are initialized
    if (!contentAnalyzer) {
      await initializeServices();
    }
    
    // Analyze page content
    const analysis = await contentAnalyzer.analyzePage(url);
    
    console.log('Background: Analysis completed successfully', analysis);
    sendResponse({ success: true, data: analysis });
    
  } catch (error) {
    console.error('Background: Page analysis failed', error);
    console.error('Background: Error details:', error.message, error.stack);
    
    let errorMessage = CONFIG.ERRORS.AI_ERROR;
    
    if (error.message.includes('fetch') || error.message.includes('HTTP')) {
      errorMessage = CONFIG.ERRORS.FETCH_FAILED;
    } else if (error.message.includes('CORS')) {
      errorMessage = CONFIG.ERRORS.CORS_ERROR;
    } else if (error.message.includes('timeout')) {
      errorMessage = CONFIG.ERRORS.TIMEOUT;
    } else if (error.message.includes('network')) {
      errorMessage = CONFIG.ERRORS.NETWORK_ERROR;
    } else if (error.message.includes('insufficient')) {
      errorMessage = CONFIG.ERRORS.NO_CONTENT;
    }
    
    sendResponse({ 
      success: false, 
      error: errorMessage,
      details: error.message 
    });
  }
}

// Handle link analysis request (for hover popup)
async function handleLinkAnalysis(url, sendResponse) {
  try {
    console.log('Background: Starting link analysis for', url);
    
    // Validate URL
    if (!isValidUrl(url)) {
      throw new Error(CONFIG.ERRORS.INVALID_URL);
    }
    
    // Analyze page content
    const analysis = await contentAnalyzer.analyzePage(url);
    
    console.log('Background: Link analysis completed successfully');
    sendResponse({ success: true, data: analysis });
    
  } catch (error) {
    console.error('Background: Link analysis failed', error);
    
    let errorMessage = CONFIG.ERRORS.AI_ERROR;
    
    if (error.message.includes('fetch')) {
      errorMessage = CONFIG.ERRORS.FETCH_FAILED;
    } else if (error.message.includes('CORS')) {
      errorMessage = CONFIG.ERRORS.CORS_ERROR;
    } else if (error.message.includes('timeout')) {
      errorMessage = CONFIG.ERRORS.TIMEOUT;
    } else if (error.message.includes('network')) {
      errorMessage = CONFIG.ERRORS.NETWORK_ERROR;
    } else if (error.message.includes('insufficient')) {
      errorMessage = CONFIG.ERRORS.NO_CONTENT;
    }
    
    sendResponse({ 
      success: false, 
      error: errorMessage,
      details: error.message 
    });
  }
}

// Validate URL format
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Terms & Conditions Red-Flag Summariser installed');
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Terms & Conditions Red-Flag Summariser started');
}); 