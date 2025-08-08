// Terms & Conditions Red-Flag Summariser - Constants

// API Configuration
export const API_CONFIG = {
GEMINI_API_KEY: 'AIzaSyCkaN0eD-j4s5aU9aqU1iPIPW3A9YxF6Y4',
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  MAX_CONTENT_LENGTH: 3000, // Reduced for token optimization
  MAX_RESPONSE_TOKENS: 1024, // Reduced for concise responses
  TIMEOUT_MS: 10000
};

// Terms Detection Keywords
export const TERMS_KEYWORDS = [
  'terms of service',
  'terms and conditions',
  'terms of use',
  'user agreement',
  'privacy policy',
  'service agreement',
  'legal notice',
  'conditions of use',
  'terms',
  'conditions',
  'policy',
  'agreement',
  'disclaimer',
  'legal',
  'terms & conditions',
  'terms & privacy'
];

// Privacy & Data Theft Detection Keywords
export const PRIVACY_KEYWORDS = [
  // Data Collection
  'personal data',
  'personal information',
  'user data',
  'customer data',
  'collect data',
  'data collection',
  'information collection',
  'user information',
  'customer information',
  'personal details',
  'contact information',
  'email address',
  'phone number',
  'address',
  'location data',
  'browsing history',
  'cookies',
  'tracking',
  'analytics',
  'third party',
  'third-party',
  
  // Data Sharing
  'share data',
  'data sharing',
  'sell data',
  'data sale',
  'transfer data',
  'data transfer',
  'disclose',
  'disclosure',
  'third party access',
  'partner access',
  'affiliate',
  'subsidiary',
  'parent company',
  'related companies',
  
  // Data Storage
  'data retention',
  'retain data',
  'store data',
  'data storage',
  'keep data',
  'hold data',
  'data backup',
  'data archive',
  
  // Data Security
  'data security',
  'data protection',
  'encryption',
  'secure data',
  'data breach',
  'security breach',
  'unauthorized access',
  'data loss',
  'data theft',
  'hacking',
  'cyber attack',
  
  // Privacy Rights
  'privacy rights',
  'data rights',
  'opt out',
  'opt-out',
  'unsubscribe',
  'delete data',
  'data deletion',
  'right to be forgotten',
  'data portability',
  'access data',
  'correct data',
  'data correction',
  
  // Surveillance & Monitoring
  'monitor',
  'monitoring',
  'surveillance',
  'track',
  'tracking',
  'spy',
  'spying',
  'observe',
  'observation',
  'record',
  'recording',
  'log',
  'logging',
  'audit trail',
  'activity log'
];

// Red Flag Detection Keywords
export const RED_FLAG_KEYWORDS = [
  // Arbitration & Legal
  'arbitration',
  'mandatory arbitration',
  'binding arbitration',
  'class action waiver',
  'class action',
  'collective action',
  'jury trial waiver',
  'legal action',
  'dispute resolution',
  'governing law',
  'jurisdiction',
  
  // Automatic Renewals
  'automatic renewal',
  'auto-renew',
  'auto renewal',
  'renewal',
  'subscription',
  'recurring payment',
  'continuous service',
  'ongoing service',
  
  // Hidden Fees
  'hidden fees',
  'additional charges',
  'extra fees',
  'service fees',
  'processing fees',
  'convenience fees',
  'administrative fees',
  'maintenance fees',
  'upgrade fees',
  'downgrade fees',
  'cancellation fees',
  'termination fees',
  
  // Rights Limitations
  'limited liability',
  'liability limitation',
  'disclaimer of warranty',
  'warranty disclaimer',
  'no warranty',
  'as is',
  'as-is',
  'user responsibility',
  'user liability',
  'company not responsible',
  'not liable',
  'exclusion of liability',
  
  // Termination
  'termination',
  'cancel',
  'cancellation',
  'suspend',
  'suspension',
  'revoke',
  'revocation',
  'ban',
  'block',
  'restrict',
  'restriction',
  
  // Intellectual Property
  'intellectual property',
  'copyright',
  'trademark',
  'patent',
  'trade secret',
  'proprietary',
  'ownership',
  'license',
  'licensing',
  'user content',
  'content ownership',
  'user generated content',
  
  // Data Misuse
  'use data',
  'utilize data',
  'process data',
  'analyze data',
  'data analysis',
  'data mining',
  'machine learning',
  'artificial intelligence',
  'AI',
  'algorithm',
  'profiling',
  'targeted advertising',
  'behavioral advertising',
  'personalized ads',
  'marketing',
  'promotional',
  'commercial use',
  'business purpose'
];

// Content Filtering Patterns
export const CONTENT_FILTERS = {
  // Remove these HTML elements completely
  REMOVE_TAGS: [
    'script', 'style', 'nav', 'header', 'footer', 'aside', 'sidebar',
    'menu', 'ad', 'advertisement', 'banner', 'popup', 'modal',
    'overlay', 'cookie-notice', 'newsletter', 'social', 'share',
    'comment', 'rating', 'review', 'related', 'recommendation'
  ],
  
  // Remove these CSS classes
  REMOVE_CLASSES: [
    'nav', 'header', 'footer', 'sidebar', 'menu', 'ad', 'banner',
    'popup', 'modal', 'overlay', 'cookie', 'newsletter', 'social',
    'share', 'comment', 'rating', 'review', 'related', 'recommend'
  ],
  
  // Keep only these sections (if found)
  KEEP_SECTIONS: [
    'privacy', 'data', 'information', 'collection', 'sharing',
    'storage', 'security', 'rights', 'terms', 'conditions',
    'agreement', 'policy', 'legal', 'liability', 'arbitration',
    'termination', 'cancellation', 'fees', 'charges', 'renewal'
  ]
};

// Risk Scoring
export const RISK_SCORING = {
  HIGH_THRESHOLD: 70,
  MEDIUM_THRESHOLD: 30,
  HIGH_WEIGHT: 3,
  MEDIUM_WEIGHT: 2,
  LOW_WEIGHT: 1
};

// UI Configuration
export const UI_CONFIG = {
  POPUP_WIDTH: 350,
  POPUP_HEIGHT: 500,
  HOVER_DELAY: 500,
  MAX_FLAGS_DISPLAY: 3,
  ANIMATION_DURATION: 300
};

// Error Messages
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'Gemini API key not configured. Please check the extension configuration.',
  FETCH_FAILED: 'Failed to fetch page content. The page might be restricted or unavailable.',
  NO_CONTENT: 'No readable content found on this page. It might be an image or restricted page.',
  TIMEOUT: 'Analysis is taking too long. Please visit the page directly for better results.',
  CORS_ERROR: 'Cannot access this page due to security restrictions. Try visiting the page directly.',
  INVALID_URL: 'Invalid URL format',
  AI_ERROR: 'AI analysis service error. Please try again in a moment.'
}; 