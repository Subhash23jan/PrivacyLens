// Content Analyzer - Handles content extraction and filtering

class ContentAnalyzer {
  constructor() {
    this.aiService = new AIService();
  }

  // Extract and filter content from page
  extractContent(html) {
    try {
      console.log('Content Analyzer: Extracting content');
      
      // Remove unwanted tags
      let content = this.removeUnwantedTags(html);
      
      // Extract text content
      content = this.extractTextContent(content);
      
      // Filter by relevant sections more efficiently
      content = this.filterRelevantSectionsEfficient(content);
      
      // Clean and normalize
      content = this.cleanContent(content);
      
      console.log('Content Analyzer: Content extracted, length:', content.length);
      return content;
      
    } catch (error) {
      console.error('Content Analyzer: Extraction failed', error);
      throw new Error(`Content extraction failed: ${error.message}`);
    }
  }

  // Remove unwanted HTML tags
  removeUnwantedTags(html) {
    const removeTags = CONFIG.CONTENT_FILTERS.REMOVE_TAGS;
    
    let content = html;
    removeTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis');
      content = content.replace(regex, '');
    });
    
    return content;
  }

  // Extract text content from HTML
  extractTextContent(html) {
    // Remove all HTML tags
    let text = html.replace(/<[^>]*>/g, ' ');
    
    // Decode HTML entities
    text = this.decodeHtmlEntities(text);
    
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  // Filter content by red flag keywords only - Token optimized
  filterRelevantSectionsEfficient(content) {
    const contentLower = content.toLowerCase();
    
    // Red Flag Keywords - Focus only on these to minimize tokens
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
    
    // Check for red flag keywords only
    const redFlagPattern = new RegExp(redFlagKeywords.join('|'), 'gi');
    const redFlagMatches = contentLower.match(redFlagPattern);
    
    // If no red flags found, return minimal content
    if (!redFlagMatches || redFlagMatches.length === 0) {
      console.log('Content Analyzer: No red flag keywords found, using minimal content');
      return content.substring(0, 500);
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
      if (redFlagParts.length >= 6) break;
    }
    
    let result = redFlagParts.join(' ');
    if (result.length > 600) { // Much smaller limit for red flag focused content
      result = result.substring(0, 600);
    }
    
    console.log('Content Analyzer: Red flag focused content extracted, length:', result.length);
    return result || content.substring(0, 500);
  }
  
  // Calculate similarity between two strings
  similarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  // Clean and normalize content
  cleanContent(content) {
    // Remove extra whitespace
    content = content.replace(/\s+/g, ' ').trim();
    
    // Remove special characters but keep basic punctuation
    content = content.replace(/[^\w\s.,!?;:()\-'"]/g, ' ');
    
    // Normalize whitespace again
    content = content.replace(/\s+/g, ' ').trim();
    
    // Limit length
    if (content.length > CONFIG.API.MAX_CONTENT_LENGTH) {
      content = content.substring(0, CONFIG.API.MAX_CONTENT_LENGTH) + '...';
    }
    
    return content;
  }

  // Decode HTML entities
  decodeHtmlEntities(text) {
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™'
    };
    
    return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => {
      return entities[match] || match;
    });
  }

  // Analyze page content
  async analyzePage(url) {
    try {
      console.log('Content Analyzer: Starting page analysis for', url);
      
      // Fetch page content
      console.log('Content Analyzer: Fetching URL...');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log('Content Analyzer: Fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log('Content Analyzer: HTML fetched, length:', html.length);
      
      // Extract content
      const content = this.extractContent(html);
      
      if (!content || content.length < 100) {
        throw new Error('Insufficient content for analysis');
      }
      
      console.log('Content Analyzer: Content extracted, length:', content.length);
      
      // Analyze with AI
      const analysis = await this.aiService.analyzeContent(content, url);
      
      console.log('Content Analyzer: Analysis completed');
      return analysis;
      
    } catch (error) {
      console.error('Content Analyzer: Page analysis failed', error);
      console.error('Content Analyzer: Error details:', error.message);
      throw error;
    }
  }
} 