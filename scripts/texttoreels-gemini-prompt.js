/**
 * Gemini AI Prompt Template for TextToReels.in Content Generation
 * Designed for gemma3-1b model - generates content for social media reel templates
 */

class TextToReelsPromptGenerator {
  /**
   * Generate a structured prompt for TextToReels content
   * @param {Object} config - Configuration for the prompt
   * @returns {Object} - Structured prompt and expected format
   */
  static generatePrompt(config = {}) {
    const {
      contentType = "love_quotes",
      language = "hindi",
      theme = "dark_theme",
      platform = "twitter_post",
      audience = "students",
      count = 1
    } = config;

    const prompt = `Generate ${count} unique content entries for TextToReels.in - a platform that creates viral social media content templates.

CONTENT SPECIFICATIONS:
- Content Type: ${contentType}
- Language: ${language}
- Visual Theme: ${theme}
- Platform: ${platform}
- Target Audience: ${audience}

TEXTTOREELS.IN CONTEXT:
TextToReels.in is a premium AI-powered content generation platform that helps users create viral social media content. The platform specializes in:
- Quote templates and text overlays
- Social media post generators
- Reel and story templates  
- Multi-language content creation
- Trending content formats
- Platform-specific optimizations

OUTPUT FORMAT (JSON):
Generate an array of objects with this EXACT structure:

{
  "content_entries": [
    {
      "contentId": "unique-uuid-v4",
      "isActive": true,
      "slug": "seo-friendly-url-slug",
      "contentType": "${contentType}",
      "language": "${language}",
      "theme": "${theme}",
      "platform": "${platform}",
      "audience": "${audience}",
      "metaTitle": [
        "Primary SEO title focusing on content type and platform",
        "Alternative title variation emphasizing benefits",
        "Third variation highlighting audience appeal"
      ],
      "shortDescription": "Compelling 150-character description for search results and social shares",
      "description": "Detailed 400-500 word description explaining the content, its appeal, usage scenarios, and benefits for the target audience. Include specific use cases and engagement potential.",
      "contentText": {
        "primary": "Main content text/quote in ${language}",
        "variations": [
          "Alternative version 1",
          "Alternative version 2", 
          "Alternative version 3"
        ],
        "hashtags": ["#relevanthashtag1", "#trending2", "#audience3"],
        "callToAction": "Engaging CTA text"
      },
      "designSpecs": {
        "colorScheme": ["#primarycolor", "#secondarycolor", "#accentcolor"],
        "fontStyle": "recommended font style",
        "layout": "layout description",
        "elements": ["design element 1", "element 2", "element 3"]
      },
      "seoData": {
        "keywords": [
          "primary keyword",
          "secondary keyword", 
          "long-tail keyword 1",
          "long-tail keyword 2",
          "trending keyword"
        ],
        "canonicalUrl": "https://texttoreels.in/content/${contentType}-${language}-${theme}-${platform}-{unique-id}",
        "ogImage": "description of ideal og:image for this content"
      },
      "usageStats": {
        "difficulty": "easy|medium|hard",
        "estimatedEngagement": "high|medium|low",
        "bestTimeToPost": "morning|afternoon|evening|night",
        "platformOptimization": "optimization tips for ${platform}"
      },
      "relatedContent": [
        "Related content type 1",
        "Related content type 2",
        "Related content type 3"
      ],
      "creatorTips": [
        "Tip 1 for maximizing engagement",
        "Tip 2 for customization",
        "Tip 3 for viral potential"
      ]
    }
  ]
}

CONTENT GUIDELINES:
1. Make content highly engaging and shareable
2. Include emotional triggers relevant to ${audience}
3. Optimize for ${platform} best practices
4. Use trending ${language} phrases and expressions
5. Ensure ${theme} visual appeal
6. Include call-to-action that drives engagement
7. Add relevant hashtags for discoverability
8. Consider viral potential and shareability
9. Make content relatable to ${audience}
10. Include personalization options

SPECIFIC INSTRUCTIONS FOR ${contentType.toUpperCase()}:
- Create authentic, emotionally resonant content
- Use appropriate cultural references for ${language}
- Include modern slang and trending expressions
- Make content Instagram/Twitter/TikTok friendly
- Ensure content works well with ${theme} visuals
- Add engagement hooks and conversation starters
- Include variations for different moods/contexts
- Make content screenshot-worthy and shareable

PLATFORM OPTIMIZATION FOR ${platform.toUpperCase()}:
- Follow ${platform} character limits and best practices
- Include platform-specific engagement tactics
- Optimize hashtag strategy for ${platform}
- Consider ${platform} algorithm preferences
- Add platform-appropriate call-to-actions
- Include timing recommendations for ${platform}

TARGET AUDIENCE INSIGHTS FOR ${audience.toUpperCase()}:
- Use language and references that resonate with ${audience}
- Address common pain points and interests of ${audience}
- Include motivational or inspirational elements
- Make content relatable to ${audience} lifestyle
- Add emotional appeal relevant to ${audience} age group

RESPONSE FORMAT:
Return ONLY the JSON object with the "content_entries" array. No additional text or explanation.`;

    return {
      prompt,
      expectedFormat: {
        content_entries: [
          {
            contentId: "string (UUID)",
            isActive: "boolean",
            slug: "string (URL-friendly)",
            contentType: "string",
            language: "string",
            theme: "string", 
            platform: "string",
            audience: "string",
            metaTitle: ["string", "string", "string"],
            shortDescription: "string (150 chars max)",
            description: "string (400-500 words)",
            contentText: {
              primary: "string",
              variations: ["string", "string", "string"],
              hashtags: ["string", "string", "string"],
              callToAction: "string"
            },
            designSpecs: {
              colorScheme: ["string", "string", "string"],
              fontStyle: "string",
              layout: "string", 
              elements: ["string", "string", "string"]
            },
            seoData: {
              keywords: ["string", "string", "..."],
              canonicalUrl: "string",
              ogImage: "string"
            },
            usageStats: {
              difficulty: "string",
              estimatedEngagement: "string", 
              bestTimeToPost: "string",
              platformOptimization: "string"
            },
            relatedContent: ["string", "string", "string"],
            creatorTips: ["string", "string", "string"]
          }
        ]
      }
    };
  }

  /**
   * Generate batch prompts for multiple content combinations
   */
  static generateBatchPrompts(contentTypes, languages, themes, platforms, audiences, countPerBatch = 3) {
    const prompts = [];
    
    contentTypes.forEach(contentType => {
      languages.forEach(language => {
        themes.forEach(theme => {
          platforms.forEach(platform => {
            audiences.forEach(audience => {
              const promptData = this.generatePrompt({
                contentType,
                language,
                theme,
                platform,
                audience,
                count: countPerBatch
              });
              
              prompts.push({
                id: `${contentType}_${language}_${theme}_${platform}_${audience}_${Date.now()}`,
                contentType,
                language,
                theme,
                platform,
                audience,
                prompt: promptData.prompt,
                expectedCount: countPerBatch
              });
            });
          });
        });
      });
    });
    
    return prompts;
  }

  /**
   * Validate Gemini response format for TextToReels
   */
  static validateResponse(response) {
    try {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      if (!data.content_entries || !Array.isArray(data.content_entries)) {
        throw new Error('Response must contain content_entries array');
      }
      
      const requiredFields = [
        'contentId', 'slug', 'contentType', 'language', 'theme', 'platform', 
        'audience', 'metaTitle', 'shortDescription', 'description', 'contentText', 
        'designSpecs', 'seoData', 'usageStats'
      ];
      
      data.content_entries.forEach((entry, index) => {
        requiredFields.forEach(field => {
          if (!entry[field]) {
            throw new Error(`Entry ${index}: Missing required field '${field}'`);
          }
        });
        
        // Validate nested structures
        if (!entry.contentText.primary) {
          throw new Error(`Entry ${index}: Missing primary content text`);
        }
        
        if (!Array.isArray(entry.metaTitle) || entry.metaTitle.length === 0) {
          throw new Error(`Entry ${index}: metaTitle must be non-empty array`);
        }
        
        if (!Array.isArray(entry.seoData.keywords) || entry.seoData.keywords.length === 0) {
          throw new Error(`Entry ${index}: keywords must be non-empty array`);
        }
      });
      
      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// TextToReels.in content categories and options
const CONTENT_TYPES = [
  "love_quotes",
  "motivational_quotes", 
  "funny_memes",
  "success_quotes",
  "life_lessons",
  "friendship_quotes",
  "inspirational_stories",
  "trending_thoughts",
  "relationship_advice",
  "self_care_tips"
];

const LANGUAGES = [
  "hindi",
  "english", 
  "hinglish", // Mix of Hindi and English
  "punjabi",
  "gujarati"
];

const THEMES = [
  "dark_theme",
  "light_theme",
  "gradient_theme",
  "minimalist_theme", 
  "colorful_theme",
  "neon_theme"
];

const PLATFORMS = [
  "instagram_post",
  "instagram_story", 
  "twitter_post",
  "facebook_post",
  "linkedin_post",
  "tiktok_video",
  "youtube_shorts"
];

const AUDIENCES = [
  "students",
  "professionals",
  "entrepreneurs", 
  "teenagers",
  "young_adults",
  "fitness_enthusiasts",
  "travelers",
  "booklovers"
];

// Export for use in other files
module.exports = {
  TextToReelsPromptGenerator,
  CONTENT_TYPES,
  LANGUAGES,
  THEMES,
  PLATFORMS,
  AUDIENCES
};

// CLI usage example
if (require.main === module) {
  console.log('🎬 TextToReels.in Gemini Prompt Generator\n');
  
  // Generate single prompt
  const singlePrompt = TextToReelsPromptGenerator.generatePrompt({
    contentType: "love_quotes",
    language: "hindi",
    theme: "dark_theme",
    platform: "twitter_post",
    audience: "students",
    count: 2
  });
  
  console.log('📝 Sample Prompt for TextToReels:');
  console.log('='.repeat(60));
  console.log(singlePrompt.prompt);
  console.log('='.repeat(60));
  
  console.log('\n📊 Expected Response Format:');
  console.log(JSON.stringify(singlePrompt.expectedFormat, null, 2));
  
  console.log('\n🚀 Usage Examples:');
  console.log('1. Single content prompt:');
  console.log('   const prompt = TextToReelsPromptGenerator.generatePrompt({ contentType: "motivational_quotes", language: "hindi" });');
  
  console.log('\n2. Batch prompts:');
  console.log('   const prompts = TextToReelsPromptGenerator.generateBatchPrompts(["love_quotes"], ["hindi"], ["dark_theme"], ["instagram_post"], ["students"]);');
  
  console.log('\n3. Validate response:');
  console.log('   const validation = TextToReelsPromptGenerator.validateResponse(geminiResponse);');
}