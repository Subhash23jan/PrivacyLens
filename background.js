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
  
  if (request.action === 'askQuestion') {
    handleQuestionRequest(request.question, request.analysis, request.url, sendResponse);
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

// Handle question requests
async function handleQuestionRequest(question, analysis, url, sendResponse) {
  try {
    console.log('Background: Handling question request:', question);
    
    // Ensure services are initialized
    if (!contentAnalyzer) {
      await initializeServices();
    }
    
    // Fetch full webpage content
    console.log('Background: Fetching full webpage content for question');
    const fullContent = await fetchWebpageContent(url);
    
    // Filter content based on question keywords
    const filteredContent = filterContentForQuestion(fullContent, question);
    
    // Create enhanced context with full content
    const context = createQuestionContext(analysis, url, filteredContent);
    
    // Generate answer using AI with full content
    const answer = await contentAnalyzer.aiService.answerQuestion(question, context);
    
    console.log('Background: Question answered successfully with full content');
    sendResponse({ success: true, answer: answer });
    
  } catch (error) {
    console.error('Background: Question handling failed', error);
    sendResponse({ 
      success: false, 
      error: 'Failed to answer question: ' + error.message 
    });
  }
}

// Fetch full webpage content
async function fetchWebpageContent(url) {
  try {
    console.log('Background: Fetching webpage content from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log('Background: Webpage content fetched, length:', html.length);
    
    return html;
    
  } catch (error) {
    console.error('Background: Failed to fetch webpage content:', error);
    throw new Error(`Failed to fetch webpage content: ${error.message}`);
  }
}

// Filter content based on question keywords
function filterContentForQuestion(fullContent, question) {
  try {
    console.log('Background: Filtering content for question:', question);
    
    // Extract text content from HTML
    let textContent = fullContent.replace(/<[^>]*>/g, ' ');
    textContent = textContent.replace(/\s+/g, ' ').trim();
    
    // Extract question keywords
    const questionKeywords = extractQuestionKeywords(question);
    console.log('Background: Question keywords:', questionKeywords);
    
    // Split content into sentences and paragraphs
    const sentences = textContent.split(/[.!?]\s+/).filter(s => s.trim().length > 15);
    const paragraphs = textContent.split(/\n\s*\n/).filter(p => p.trim().length > 30);
    
    // Score content relevance
    const scoredContent = [];
    
    // Score sentences
    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase();
      let score = 0;
      
      questionKeywords.forEach(keyword => {
        if (sentenceLower.includes(keyword.toLowerCase())) {
          score += 2; // Higher weight for exact matches
        }
        // Also check for related terms
        if (sentenceLower.includes(keyword.toLowerCase().replace(' ', ''))) {
          score += 1;
        }
      });
      
      if (score > 0) {
        scoredContent.push({ text: sentence, score: score, type: 'sentence' });
      }
    });
    
    // Score paragraphs
    paragraphs.forEach(paragraph => {
      const paragraphLower = paragraph.toLowerCase();
      let score = 0;
      
      questionKeywords.forEach(keyword => {
        if (paragraphLower.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      if (score > 0) {
        scoredContent.push({ text: paragraph, score: score, type: 'paragraph' });
      }
    });
    
    // Sort by relevance score and take top content
    scoredContent.sort((a, b) => b.score - a.score);
    
    // Take top 8 most relevant pieces (mix of sentences and paragraphs)
    const topContent = scoredContent.slice(0, 8);
    
    // Format content with clear separators
    const filteredContent = topContent.map(item => {
      return `[${item.type.toUpperCase()}] ${item.text}`;
    }).join('\n\n');
    
    console.log('Background: Filtered content length:', filteredContent.length);
    console.log('Background: Found', topContent.length, 'relevant content pieces');
    
    return filteredContent;
    
  } catch (error) {
    console.error('Background: Failed to filter content:', error);
    return fullContent.substring(0, 2000); // Fallback to first 2000 chars
  }
}

// Extract keywords from question
function extractQuestionKeywords(question) {
  const questionLower = question.toLowerCase();
  
  // Define keyword categories with more specific terms
  const keywordCategories = {
    data: ['data', 'information', 'personal', 'privacy', 'user', 'customer', 'details'],
    images: ['image', 'photo', 'picture', 'media', 'file', 'upload', 'visual'],
    sharing: ['share', 'sell', 'transfer', 'disclose', 'third party', 'partner', 'distribute'],
    security: ['security', 'breach', 'hack', 'protect', 'encrypt', 'safe', 'secure'],
    deletion: ['delete', 'remove', 'erase', 'forget', 'right to be forgotten', 'eliminate'],
    collection: ['collect', 'gather', 'store', 'retain', 'keep', 'obtain', 'acquire'],
    usage: ['use', 'utilize', 'process', 'analyze', 'purpose', 'handle', 'manage'],
    rights: ['rights', 'control', 'access', 'modify', 'portability', 'ownership'],
    consent: ['consent', 'agree', 'permission', 'opt', 'choice', 'authorize'],
    liability: ['liability', 'responsible', 'damage', 'compensation', 'claim', 'fault'],
    time: ['time', 'duration', 'period', 'days', 'months', 'years', 'retention'],
    location: ['location', 'geographic', 'country', 'region', 'jurisdiction'],
    children: ['child', 'children', 'minor', 'underage', 'youth', 'teen'],
    payment: ['payment', 'billing', 'charge', 'fee', 'cost', 'price', 'subscription']
  };
  
  // Find relevant keywords from the question
  const relevantKeywords = [];
  
  // Extract action words from the question
  const actionWords = ['how', 'what', 'when', 'where', 'why', 'can', 'will', 'do', 'does', 'handle', 'manage', 'process'];
  actionWords.forEach(word => {
    if (questionLower.includes(word)) {
      relevantKeywords.push(word);
    }
  });
  
  // Extract category keywords
  Object.entries(keywordCategories).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (questionLower.includes(keyword)) {
        relevantKeywords.push(keyword);
        // Add 2-3 most related keywords from the same category
        const relatedKeywords = keywords.filter(k => k !== keyword).slice(0, 3);
        relatedKeywords.forEach(relatedKeyword => {
          if (!relevantKeywords.includes(relatedKeyword)) {
            relevantKeywords.push(relatedKeyword);
          }
        });
      }
    });
  });
  
  // Add common terms and conditions keywords
  const commonTerms = ['terms', 'conditions', 'policy', 'agreement', 'service', 'website', 'platform'];
  commonTerms.forEach(term => {
    if (questionLower.includes(term)) {
      relevantKeywords.push(term);
    }
  });
  
  // Remove duplicates and return
  return [...new Set(relevantKeywords)];
}

// Create enhanced context for question answering
function createQuestionContext(analysis, url, filteredContent) {
  const context = {
    url: url,
    riskScore: analysis.riskScore,
    redFlags: analysis.redFlags,
    fullContent: filteredContent,
    summary: `This website has a privacy risk score of ${analysis.riskScore}/100. `,
    highRisks: analysis.redFlags.HIGH.map(flag => `${flag.flag}: ${flag.context}`).join('. '),
    mediumRisks: analysis.redFlags.MEDIUM.map(flag => `${flag.flag}: ${flag.context}`).join('. '),
    lowRisks: analysis.redFlags.LOW.map(flag => `${flag.flag}: ${flag.context}`).join('. ')
  };
  
  context.summary += `High risk issues: ${context.highRisks}. `;
  context.summary += `Medium concerns: ${context.mediumRisks}. `;
  context.summary += `Minor notes: ${context.lowRisks}.`;
  
  return context;
} 