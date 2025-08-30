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

IMPORTANT SCORING GUIDELINES:
- 0-20: Very low risk (standard privacy practices)
- 21-40: Low risk (minor concerns, common practices)
- 41-60: Medium risk (some concerning practices)
- 61-80: High risk (serious privacy issues)
- 81-100: Very high risk (major red flags, avoid)

Be conservative with scoring. Most websites should score 20-50. Only give 70+ for serious privacy violations.

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
    
    // Normalize the risk score to be more realistic
    let normalizedScore = analysis.riskScore || 50;
    
    // Apply normalization to make scores more conservative
    if (normalizedScore > 80) {
      normalizedScore = Math.min(normalizedScore, 85); // Cap very high scores
    } else if (normalizedScore > 60) {
      normalizedScore = Math.min(normalizedScore, 75); // Moderate high scores
    } else if (normalizedScore < 20) {
      normalizedScore = Math.max(normalizedScore, 10); // Ensure minimum visibility
    }
    
    console.log('AI Service: Original score:', analysis.riskScore, 'Normalized score:', normalizedScore);
    
    return {
      url: url,
      riskScore: Math.round(normalizedScore),
      redFlags: {
        HIGH: analysis.redFlags?.HIGH || [],
        MEDIUM: analysis.redFlags?.MEDIUM || [],
        LOW: analysis.redFlags?.LOW || []
      }
    };
  }

  // Answer user questions about the terms and conditions
  async answerQuestion(question, context) {
    try {
      console.log('AI Service: Answering question:', question);
      
      const prompt = this.createQuestionPrompt(question, context);
      const response = await this.callGeminiAPI(prompt);
      
      console.log('AI Service: Question answered');
      return response;
      
    } catch (error) {
      console.error('AI Service: Question answering failed', error);
      throw new Error(`Question answering failed: ${error.message}`);
    }
  }

  // Create prompt for question answering
  createQuestionPrompt(question, context) {
    return `Provide Answer like a human in 2-3 sentences. Be specific and use exact details from the content. If terms mention something, quote the relevant part directly. If not mentioned, clearly say: "The terms do not specify...". The final answer should sound natural.

WEBSITE ANALYSIS SUMMARY:
${context.summary}

FULL WEBSITE CONTENT (Filtered for relevance):
${context.fullContent}

USER QUESTION: ${question}

ANSWER:`;
  }
} 