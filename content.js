// Content Script - Simple Terms & Conditions Detector

console.log('Content Script: Starting...');

// Configuration
const CONFIG = {
  TERMS_KEYWORDS: [
    'terms of service', 'terms and conditions', 'terms of use',
    'user agreement', 'privacy policy', 'service agreement',
    'legal notice', 'conditions of use', 'terms', 'conditions',
    'policy', 'agreement', 'disclaimer', 'legal',
    'terms & conditions', 'terms & privacy'
  ],
  HOVER_DELAY: 300
};

// Global variables
let currentPopup = null;

// Check if we should run on this page
function shouldRunOnPage() {
  const url = window.location.href;
  const restrictedSchemes = [
    'chrome://', 'chrome-extension://', 'moz-extension://',
    'edge://', 'about:', 'file://'
  ];
  
  return !restrictedSchemes.some(scheme => url.startsWith(scheme));
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

// Initialize content script
function initialize() {
  console.log('Content Script: Initializing on', window.location.href);
  
  if (!shouldRunOnPage()) {
    console.log('Content Script: Skipping restricted page');
    return;
  }
  
  // Find and setup terms links
  setupTermsLinks();
  
  // Watch for new links
  observeNewLinks();
  
  console.log('Content Script: Initialization complete');
}

// Setup terms links with hover functionality
function setupTermsLinks() {
  const links = document.querySelectorAll('a[href]');
  let foundCount = 0;
  
  links.forEach(link => {
    if (isTermsLink(link)) {
      setupLinkHover(link);
      foundCount++;
    }
  });
  
  console.log('Content Script: Found', foundCount, 'terms links');
}

// Check if a link is a terms link
function isTermsLink(link) {
  const href = link.href.toLowerCase();
  const text = link.textContent.toLowerCase();
  
  return CONFIG.TERMS_KEYWORDS.some(keyword => 
    href.includes(keyword) || text.includes(keyword)
  );
}

// Setup hover functionality for a link
function setupLinkHover(link) {
  let hoverTimeout = null;
  
  // Mouse enter
  link.addEventListener('mouseenter', () => {
    console.log('Content Script: Mouse enter on', link.href);
    
    // Clear existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    // Hide any existing popup when hovering on a new link
    if (currentPopup) {
      hidePopup();
    }
    
    // Set timeout for popup
    hoverTimeout = setTimeout(() => {
      showHoverPopup(link);
    }, CONFIG.HOVER_DELAY);
  });
  
  // Mouse leave - don't hide popup immediately
  link.addEventListener('mouseleave', () => {
    console.log('Content Script: Mouse leave on', link.href);
    
    // Clear timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    
    // Don't hide popup - let it stay visible
  });
  
  // Click handler - don't prevent default, just add analysis
  link.addEventListener('click', (e) => {
    console.log('Content Script: Link clicked', link.href);
    // Don't prevent default - let the link work normally
    // Just show analysis popup
    setTimeout(() => {
      showAnalysisPopup(link);
    }, 100);
  });
}

// Show hover popup
function showHoverPopup(link) {
  console.log('Content Script: Showing hover popup for', link.href);
  
  // Validate URL first
  if (!isValidUrl(link.href)) {
    console.log('Content Script: Invalid URL, skipping analysis');
    return;
  }
  
  const popup = createPopup(link);
  popup.innerHTML = `
    <div class="tc-popup-content">
      <div class="tc-popup-header">
        <span class="tc-popup-icon">🔍</span>
        <span class="tc-popup-title">Terms & Conditions Detected</span>
        <button class="tc-popup-close" id="hover-close-btn">✕</button>
      </div>
      <div class="tc-popup-body">
        <div class="tc-quick-info">
          <p><strong>Link:</strong> ${link.textContent.trim()}</p>
          <p><strong>URL:</strong> ${link.href}</p>
          <div class="tc-loading-indicator">
            <div class="tc-spinner"></div>
            <p>🤖 Analyzing privacy risks...</p>
          </div>
        </div>
        <div class="tc-popup-actions">
          <button class="tc-btn tc-btn-primary" id="hover-view-btn">
            📄 View Full Terms
          </button>
          <button class="tc-btn tc-btn-secondary" id="hover-close-btn-2">
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for hover popup buttons
  const closeBtn = popup.querySelector('#hover-close-btn');
  const closeBtn2 = popup.querySelector('#hover-close-btn-2');
  const viewBtn = popup.querySelector('#hover-view-btn');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => hidePopup());
  }
  if (closeBtn2) {
    closeBtn2.addEventListener('click', () => hidePopup());
  }
  if (viewBtn) {
    viewBtn.addEventListener('click', () => window.open(link.href, '_blank'));
  }
  
  document.body.appendChild(popup);
  currentPopup = popup;
  
  // Check if it's an external link
  const isExternal = !link.href.startsWith(window.location.origin);
  
  if (isExternal) {
    // For external links, try to analyze but show a note about limitations
    setTimeout(() => {
      if (currentPopup) {
        currentPopup.innerHTML = `
          <div class="tc-popup-content">
            <div class="tc-popup-header">
              <span class="tc-popup-icon">🔍</span>
              <span class="tc-popup-title">External Terms Link</span>
              <button class="tc-popup-close" id="external-close-btn">✕</button>
            </div>
            <div class="tc-popup-body">
              <div class="tc-quick-info">
                <p><strong>Link:</strong> ${link.textContent.trim()}</p>
                <p><strong>URL:</strong> ${link.href}</p>
                <div class="tc-loading-indicator">
                  <div class="tc-spinner"></div>
                  <p>🤖 Analyzing external page...</p>
                </div>
              </div>
              <div class="tc-popup-actions">
                <button class="tc-btn tc-btn-primary" id="external-view-btn">
                  📄 View Full Terms
                </button>
                <button class="tc-btn tc-btn-secondary" id="external-close-btn-2">
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners for external popup buttons
        const closeBtn = currentPopup.querySelector('#external-close-btn');
        const closeBtn2 = currentPopup.querySelector('#external-close-btn-2');
        const viewBtn = currentPopup.querySelector('#external-view-btn');
        
        if (closeBtn) {
          closeBtn.addEventListener('click', () => hidePopup());
        }
        if (closeBtn2) {
          closeBtn2.addEventListener('click', () => hidePopup());
        }
        if (viewBtn) {
          viewBtn.addEventListener('click', () => window.open(link.href, '_blank'));
        }
      }
    }, 500);
    
    // Try to analyze external link
    analyzeLink(link);
  } else {
    // For internal links, try to analyze
    analyzeLink(link);
  }
}

// Show analysis popup
function showAnalysisPopup(link) {
  console.log('Content Script: Showing analysis popup for', link.href);
  
  // Validate URL first
  if (!isValidUrl(link.href)) {
    console.log('Content Script: Invalid URL, skipping analysis');
    return;
  }
  
  const popup = createPopup(link);
  popup.innerHTML = `
    <div class="tc-popup-content">
      <div class="tc-popup-header">
        <span class="tc-popup-icon">🔍</span>
        <span class="tc-popup-title">Analyzing Terms & Conditions</span>
        <button class="tc-popup-close" id="analysis-close-btn">✕</button>
      </div>
      <div class="tc-popup-body">
        <div class="tc-loading">
          <div class="tc-spinner"></div>
          <p>🤖 AI is analyzing privacy risks...</p>
          <p class="tc-loading-url">${link.href}</p>
        </div>
      </div>
    </div>
  `;
  
  // Add event listener for analysis popup close button
  const closeBtn = popup.querySelector('#analysis-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => hidePopup());
  }
  
  document.body.appendChild(popup);
  currentPopup = popup;
  
  // Start analysis
  analyzeLink(link);
}

// Extract and filter content from current page - Red Flag Focused
function extractCurrentPageContent() {
  try {
    console.log('Content Script: Extracting red flag focused content');
    
    // Get page HTML
    const html = document.documentElement.outerHTML;
    
    // Remove unwanted tags
    const removeTags = ['script', 'style', 'nav', 'header', 'footer', 'aside', 'sidebar', 'menu', 'ad', 'advertisement', 'banner', 'popup', 'modal', 'overlay', 'cookie-notice', 'newsletter', 'social', 'share', 'comment', 'rating', 'review', 'related', 'recommendation'];
    
    let content = html;
    removeTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis');
      content = content.replace(regex, '');
    });
    
    // Extract text content
    content = content.replace(/<[^>]*>/g, ' ');
    content = content.replace(/\s+/g, ' ').trim();
    
    // Red Flag Keywords - Focus on these to minimize tokens
    const redFlagKeywords = [
      // Legal Issues
      'arbitration', 'mandatory arbitration', 'binding arbitration', 'class action waiver',
      'class action', 'collective action', 'jury trial waiver', 'legal action',
      'dispute resolution', 'governing law', 'jurisdiction',
      
      // Automatic Renewals
      'automatic renewal', 'auto-renew', 'auto renewal', 'renewal', 'subscription',
      'recurring payment', 'continuous service', 'ongoing service',
      
      // Hidden Fees
      'hidden fees', 'additional charges', 'extra fees', 'service fees', 'processing fees',
      'convenience fees', 'administrative fees', 'maintenance fees', 'upgrade fees',
      'downgrade fees', 'cancellation fees', 'termination fees',
      
      // Rights Limitations
      'limited liability', 'liability limitation', 'disclaimer of warranty', 'warranty disclaimer',
      'no warranty', 'as is', 'as-is', 'user responsibility', 'user liability',
      'company not responsible', 'not liable', 'exclusion of liability',
      
      // Termination
      'termination', 'cancel', 'cancellation', 'suspend', 'suspension', 'revoke',
      'revocation', 'ban', 'block', 'restrict', 'restriction',
      
      // Data Misuse
      'use data', 'utilize data', 'process data', 'analyze data', 'data analysis',
      'data mining', 'machine learning', 'artificial intelligence', 'AI', 'algorithm',
      'profiling', 'targeted advertising', 'behavioral advertising', 'personalized ads',
      'marketing', 'promotional', 'commercial use', 'business purpose',
      
      // Data Collection & Sharing
      'personal data', 'personal information', 'user data', 'customer data',
      'collect data', 'data collection', 'share data', 'data sharing', 'sell data',
      'data sale', 'transfer data', 'data transfer', 'disclose', 'disclosure',
      'third party', 'third-party', 'affiliate', 'subsidiary', 'parent company',
      
      // Privacy Rights
      'privacy rights', 'data rights', 'opt out', 'opt-out', 'unsubscribe',
      'delete data', 'data deletion', 'right to be forgotten', 'data portability',
      'access data', 'correct data', 'data correction'
    ];
    
    const contentLower = content.toLowerCase();
    
    // Check for red flag keywords
    const redFlagPattern = new RegExp(redFlagKeywords.join('|'), 'gi');
    const redFlagMatches = contentLower.match(redFlagPattern);
    
    // If no red flags found, return minimal content
    if (!redFlagMatches || redFlagMatches.length === 0) {
      console.log('Content Script: No red flag keywords found, using minimal content');
      return content.substring(0, 400); // Very small fallback
    }
    
    // Extract sections around red flag keywords only
    const redFlagParts = [];
    const sectionSize = 100; // Smaller sections for focused red flag content
    
    let match;
    while ((match = redFlagPattern.exec(contentLower)) !== null) {
      const start = Math.max(0, match.index - sectionSize);
      const end = Math.min(content.length, match.index + sectionSize);
      const section = content.substring(start, end);
      
      // Only add if it contains actual red flag content
      const sectionLower = section.toLowerCase();
      if (sectionLower.includes('arbitration') || 
          sectionLower.includes('renewal') ||
          sectionLower.includes('fees') ||
          sectionLower.includes('liability') ||
          sectionLower.includes('termination') ||
          sectionLower.includes('data') ||
          sectionLower.includes('privacy') ||
          sectionLower.includes('share') ||
          sectionLower.includes('sell') ||
          sectionLower.includes('collect')) {
        
        // Check for duplicates
        const isDuplicate = redFlagParts.some(existing => 
          existing.toLowerCase().includes(match[0].toLowerCase()) ||
          section.toLowerCase().includes(existing.toLowerCase().split(' ').slice(0, 3).join(' '))
        );
        
        if (!isDuplicate) {
          redFlagParts.push(section);
        }
      }
      
      // Limit to prevent token overflow
      if (redFlagParts.length >= 8) break;
    }
    
    let result = redFlagParts.join(' ');
    if (result.length > 800) { // Much smaller limit for red flag focused content
      result = result.substring(0, 800);
    }
    
    console.log('Content Script: Red flag focused content extracted, length:', result.length);
    return result || content.substring(0, 400);
    
  } catch (error) {
    console.error('Content Script: Content extraction failed', error);
    return document.body.textContent.substring(0, 400);
  }
}

// Analyze link content
async function analyzeLink(link) {
  try {
    console.log('Content Script: Starting analysis for', link.href);
    
    // Set 5-second timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timeout - taking too long')), 5000);
    });
    
    // Check if it's the current page or external
    const isCurrentPage = link.href === window.location.href || link.href === window.location.href + '#';
    
    let analysisPromise;
    
    if (isCurrentPage) {
      // Analyze current page content
      const content = extractCurrentPageContent();
      
      analysisPromise = chrome.runtime.sendMessage({
        action: 'analyzeContent',
        content: content,
        url: window.location.href,
        context: 'current-page'
      });
    } else {
      // For external links, try to analyze the URL
      analysisPromise = chrome.runtime.sendMessage({
        action: 'analyzePage',
        url: link.href
      });
    }
    
    // Race between analysis and timeout
    const response = await Promise.race([analysisPromise, timeoutPromise]);
    
    console.log('Content Script: Analysis response:', response);
    
    if (response && response.success) {
      updatePopupWithResults(link, response.data);
    } else {
      const errorMsg = response ? response.error : 'Analysis failed';
      console.error('Content Script: Analysis failed:', errorMsg);
      showErrorPopup(link, errorMsg);
    }
    
  } catch (error) {
    console.error('Content Script: Analysis failed', error);
    
    // Handle timeout
    if (error.message.includes('timeout')) {
      showErrorPopup(link, 'Analysis timed out. The page may be too large or the server is slow.');
      return;
    }
    
    // Check if it's a CORS error
    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      showErrorPopup(link, 'Cannot analyze external website due to security restrictions. Try clicking the link to view the terms directly.');
    } else {
      showErrorPopup(link, 'Analysis failed: ' + error.message);
    }
  }
}

// Update popup with analysis results
function updatePopupWithResults(link, analysis) {
  if (!currentPopup) return;
  
  console.log('Content Script: Updating popup with results');
  
  const riskLevel = getRiskLevel(analysis.riskScore || 0);
  const riskEmoji = getRiskEmoji(analysis.riskScore || 0);
  
  const highFlags = (analysis.redFlags?.HIGH || []).slice(0, 3);
  const mediumFlags = (analysis.redFlags?.MEDIUM || []).slice(0, 3);
  const lowFlags = (analysis.redFlags?.LOW || []).slice(0, 3);
  
  currentPopup.innerHTML = `
    <div class="tc-popup-content">
      <div class="tc-popup-header">
        <span class="tc-popup-icon">${riskEmoji}</span>
        <span class="tc-popup-title">Privacy Risk Analysis</span>
        <button class="tc-popup-close" id="close-btn">✕</button>
      </div>
      <div class="tc-popup-body">
        <div class="tc-risk-score">
          <div class="tc-risk-level ${riskLevel.toLowerCase()}">
            <span class="tc-risk-number">${analysis.riskScore || '--'}</span>
            <span class="tc-risk-label">${riskLevel} Risk</span>
          </div>
        </div>
        
        <div class="tc-flags-container">
          ${highFlags.length > 0 ? `
            <div class="tc-flags-section high">
              <h4>🚨 High Risk Issues</h4>
              <div class="tc-flags-list">
                ${highFlags.map(flag => `
                  <div class="tc-flag-item">
                    <div class="tc-flag-title">${flag.flag}</div>
                    <div class="tc-flag-context">${flag.context}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${mediumFlags.length > 0 ? `
            <div class="tc-flags-section medium">
              <h4>⚠️ Medium Concerns</h4>
              <div class="tc-flags-list">
                ${mediumFlags.map(flag => `
                  <div class="tc-flag-item">
                    <div class="tc-flag-title">${flag.flag}</div>
                    <div class="tc-flag-context">${flag.context}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${lowFlags.length > 0 ? `
            <div class="tc-flags-section low">
              <h4>ℹ️ Minor Notes</h4>
              <div class="tc-flags-list">
                ${lowFlags.map(flag => `
                  <div class="tc-flag-item">
                    <div class="tc-flag-title">${flag.flag}</div>
                    <div class="tc-flag-context">${flag.context}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="tc-popup-actions">
          <button class="tc-btn tc-btn-primary" id="view-btn">
            📄 View Full Terms
          </button>
          <button class="tc-btn tc-btn-secondary" id="close-btn-2">
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for buttons
  const closeBtn = currentPopup.querySelector('#close-btn');
  const closeBtn2 = currentPopup.querySelector('#close-btn-2');
  const viewBtn = currentPopup.querySelector('#view-btn');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => hidePopup());
  }
  if (closeBtn2) {
    closeBtn2.addEventListener('click', () => hidePopup());
  }
  if (viewBtn) {
    viewBtn.addEventListener('click', () => window.open(link.href, '_blank'));
  }
}

// Show error popup
function showErrorPopup(link, error) {
  if (!currentPopup) return;
  
  currentPopup.innerHTML = `
    <div class="tc-popup-content">
      <div class="tc-popup-header">
        <span class="tc-popup-icon">❌</span>
        <span class="tc-popup-title">Analysis Failed</span>
        <button class="tc-popup-close" id="error-close-btn">✕</button>
      </div>
      <div class="tc-popup-body">
        <div class="tc-error">
          <p>${error}</p>
          <p class="tc-error-tip">💡 Try refreshing the page and try again</p>
        </div>
        <div class="tc-popup-actions">
          <button class="tc-btn tc-btn-secondary" id="error-close-btn-2">
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for error popup buttons
  const closeBtn = currentPopup.querySelector('#error-close-btn');
  const closeBtn2 = currentPopup.querySelector('#error-close-btn-2');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => hidePopup());
  }
  if (closeBtn2) {
    closeBtn2.addEventListener('click', () => hidePopup());
  }
}

// Create popup element
function createPopup(link) {
  const popup = document.createElement('div');
  popup.className = 'tc-popup';
  
  // Position popup near the link
  const rect = link.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let left = rect.left;
  let top = rect.bottom + 10;
  
  // Adjust if popup would go off screen
  if (left + 350 > viewportWidth) {
    left = viewportWidth - 370;
  }
  
  if (top + 400 > viewportHeight) {
    top = rect.top - 410;
  }
  
  // Ensure popup stays within viewport
  left = Math.max(10, Math.min(left, viewportWidth - 360));
  top = Math.max(10, Math.min(top, viewportHeight - 410));
  
  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  popup.style.zIndex = '10000';
  
  // Add hover and click handlers to popup
  setupPopupHandlers(popup);
  
  return popup;
}

// Setup popup hover and click handlers
function setupPopupHandlers(popup) {
  let isHoveringPopup = false;
  
  // Mouse enter popup
  popup.addEventListener('mouseenter', () => {
    console.log('Content Script: Mouse enter popup');
    isHoveringPopup = true;
  });
  
  // Mouse leave popup
  popup.addEventListener('mouseleave', () => {
    console.log('Content Script: Mouse leave popup');
    isHoveringPopup = false;
    
    // Hide popup after a short delay if not hovering
    setTimeout(() => {
      if (!isHoveringPopup) {
        hidePopup();
      }
    }, 300);
  });
  
  // Click outside popup to close
  document.addEventListener('click', (e) => {
    if (currentPopup && !currentPopup.contains(e.target)) {
      console.log('Content Script: Click outside popup');
      hidePopup();
    }
  });
  
  // Escape key to close popup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentPopup) {
      console.log('Content Script: Escape key pressed');
      hidePopup();
    }
  });
}

// Hide current popup
function hidePopup() {
  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }
}

// Get risk level from score
function getRiskLevel(score) {
  if (score >= 70) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

// Get risk emoji from score
function getRiskEmoji(score) {
  if (score >= 70) return '🚨';
  if (score >= 30) return '⚠️';
  return '✅';
}

// Observe for new links
function observeNewLinks() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const links = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
            links.forEach(link => {
              if (isTermsLink(link)) {
                setupLinkHover(link);
              }
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
} 