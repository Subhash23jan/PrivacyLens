// AI Service - Handles all Gemini API interactions

class AIService {
  constructor() {
    this.apiKey = null;
    this.apiUrl = null;
    this.initialized = false;
  }

  // Initialize the service with environment variables
  async initialize() {
    if (this.initialized) return;
    
    // Wait for environment variables to be loaded
    const envLoader = new EnvLoader();
    const envConfig = await envLoader.initialize();
    
    this.apiKey = envConfig.GEMINI_API_KEY || CONFIG.API.GEMINI_KEY;
    this.apiUrl = envConfig.GEMINI_URL || CONFIG.API.GEMINI_URL;
    
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error('Gemini API key not configured. Please set up your API key in the extension settings.');
    }
    
    this.initialized = true;
    console.log('AI Service: Initialized with API key');
  }

  // Analyze content for privacy and data theft risks
  async analyzeContent(content, url) {
    try {
      // Ensure service is initialized
      await this.initialize();
      
      console.log('AI Service: Starting analysis for', url);
      
      const prompt = this.createAnalysisPrompt(content);
      const response = await this.callGeminiAPI(prompt);
      
      console.log('AI Service: Analysis completed');
      return this.parseAnalysisResponse(response, url);
      
    } catch (error) {
      console.error('AI Service: Analysis failed', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  // Create the analysis prompt
  createAnalysisPrompt(content) {
    return `Analyze this terms and conditions for PRIVACY CONCERNS and DATA THEFT risks.

Content: ${content.substring(0, CONFIG.API.MAX_CONTENT_LENGTH)}

Return JSON only:
{
  "riskScore": number (0-100),
  "redFlags": {
    "HIGH": [{"flag": "Brief risk", "context": "Why risky"}],
    "MEDIUM": [{"flag": "Brief concern", "context": "Why concerning"}],
    "LOW": [{"flag": "Brief note", "context": "Why aware"}]
  }
}

Focus on: data collection, sharing, security, privacy rights, surveillance, retention, consent, breaches, user rights.

Rate: HIGH (70-100) = serious risks, MEDIUM (30-69) = concerning, LOW (0-29) = minor.

Use simple English. JSON only.`;
  }

  // Call Gemini API
  async callGeminiAPI(prompt) {
    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: CONFIG.API.MAX_RESPONSE_TOKENS
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    return data.candidates[0].content.parts[0].text;
  }

  // Parse AI response
  parseAnalysisResponse(responseText, url) {
    console.log('AI Service: Parsing response');
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      url: url,
      riskScore: analysis.riskScore || 50,
      redFlags: {
        HIGH: analysis.redFlags?.HIGH || [],
        MEDIUM: analysis.redFlags?.MEDIUM || [],
        LOW: analysis.redFlags?.LOW || []
      }
    };
  }
} 