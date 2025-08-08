// Terms & Conditions Red-Flag Summariser - Configuration

const CONFIG = {
  // API Settings
  API: {
    GEMINI_KEY: 'AIzaSyCkaN0eD-j4s5aU9aqU1iPIPW3A9YxF6Y4',
    GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    MAX_CONTENT_LENGTH: 800, // Much smaller for red flag focused content
    MAX_RESPONSE_TOKENS: 600, // Reduced for concise responses
    TIMEOUT_MS: 8000
  },

  // UI Settings
  UI: {
    POPUP_WIDTH: 350,
    POPUP_HEIGHT: 450,
    HOVER_DELAY: 200,
    MAX_FLAGS_DISPLAY: 3,
    ANIMATION_DURATION: 300
  },

  // Risk Scoring
  RISK: {
    HIGH_THRESHOLD: 70,
    MEDIUM_THRESHOLD: 30,
    HIGH_WEIGHT: 3,
    MEDIUM_WEIGHT: 2,
    LOW_WEIGHT: 1
  },

  // Terms Detection Keywords
  TERMS_KEYWORDS: [
    'terms of service', 'terms and conditions', 'terms of use',
    'user agreement', 'privacy policy', 'service agreement',
    'legal notice', 'conditions of use', 'terms', 'conditions',
    'policy', 'agreement', 'disclaimer', 'legal',
    'terms & conditions', 'terms & privacy'
  ],

  // Privacy & Data Theft Keywords
  PRIVACY_KEYWORDS: [
    // Data Collection
    'personal data', 'personal information', 'user data', 'customer data',
    'collect data', 'data collection', 'information collection', 'user information',
    'customer information', 'personal details', 'contact information', 'email address',
    'phone number', 'address', 'location data', 'browsing history', 'cookies',
    'tracking', 'analytics', 'third party', 'third-party',
    
    // Data Sharing
    'share data', 'data sharing', 'sell data', 'data sale', 'transfer data',
    'data transfer', 'disclose', 'disclosure', 'third party access', 'partner access',
    'affiliate', 'subsidiary', 'parent company', 'related companies',
    
    // Data Storage
    'data retention', 'retain data', 'store data', 'data storage', 'keep data',
    'hold data', 'data backup', 'data archive',
    
    // Data Security
    'data security', 'data protection', 'encryption', 'secure data', 'data breach',
    'security breach', 'unauthorized access', 'data loss', 'data theft', 'hacking',
    'cyber attack',
    
    // Privacy Rights
    'privacy rights', 'data rights', 'opt out', 'opt-out', 'unsubscribe',
    'delete data', 'data deletion', 'right to be forgotten', 'data portability',
    'access data', 'correct data', 'data correction',
    
    // Surveillance
    'monitor', 'monitoring', 'surveillance', 'track', 'tracking', 'spy', 'spying',
    'observe', 'observation', 'record', 'recording', 'log', 'logging',
    'audit trail', 'activity log'
  ],

  // Red Flag Keywords
  RED_FLAG_KEYWORDS: [
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
    
    // Intellectual Property
    'intellectual property', 'copyright', 'trademark', 'patent', 'trade secret',
    'proprietary', 'ownership', 'license', 'licensing', 'user content',
    'content ownership', 'user generated content',
    
    // Data Misuse
    'use data', 'utilize data', 'process data', 'analyze data', 'data analysis',
    'data mining', 'machine learning', 'artificial intelligence', 'AI', 'algorithm',
    'profiling', 'targeted advertising', 'behavioral advertising', 'personalized ads',
    'marketing', 'promotional', 'commercial use', 'business purpose'
  ],

  // Content Filtering
  CONTENT_FILTERS: {
    REMOVE_TAGS: [
      'script', 'style', 'nav', 'header', 'footer', 'aside', 'sidebar',
      'menu', 'ad', 'advertisement', 'banner', 'popup', 'modal',
      'overlay', 'cookie-notice', 'newsletter', 'social', 'share',
      'comment', 'rating', 'review', 'related', 'recommendation'
    ],
    KEEP_SECTIONS: [
      'privacy', 'data', 'information', 'collection', 'sharing',
      'storage', 'security', 'rights', 'terms', 'conditions',
      'agreement', 'policy', 'legal', 'liability', 'arbitration',
      'termination', 'cancellation', 'fees', 'charges', 'renewal'
    ]
  },

  // Error Messages
  ERRORS: {
    API_KEY_MISSING: 'API key not configured',
    FETCH_FAILED: 'Failed to fetch page content',
    NO_CONTENT: 'No readable content found',
    TIMEOUT: 'Analysis timeout',
    CORS_ERROR: 'Cannot access page due to security restrictions',
    INVALID_URL: 'Invalid URL format',
    AI_ERROR: 'AI service error',
    NETWORK_ERROR: 'Network connection error'
  }
}; 