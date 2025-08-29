/**
 * Gemini AI Prompt Template for Real Estate Site Data Generation
 * Designed for gemma3-1b model
 */

class GeminiPromptGenerator {
  /**
   * Generate a structured prompt for Gemini AI
   * @param {Object} config - Configuration for the prompt
   * @returns {Object} - Structured prompt and expected format
   */
  static generatePrompt(config = {}) {
    const {
      city = "Mumbai",
      state = "Maharashtra", 
      district = "Mumbai City",
      region = "Western India",
      country = "India",
      pinCode = "400001",
      propertyType = "Residential Apartments",
      language = "english",
      count = 1
    } = config;

    const prompt = `Generate ${count} comprehensive real estate website data entries for ${propertyType} in ${city}, ${district}, ${state}, ${country}.

REQUIREMENTS:
- Create unique, SEO-optimized content for each entry
- Include location-specific details and local knowledge
- Generate realistic FAQs with helpful answers
- Use proper Indian real estate terminology
- Ensure all data is factual and useful for potential buyers/renters

LOCATION CONTEXT:
- City: ${city}
- District: ${district}  
- State: ${state}
- Region: ${region}
- Country: ${country}
- PIN Code: ${pinCode}
- Property Type: ${propertyType}

OUTPUT FORMAT (JSON):
Generate an array of objects with this EXACT structure:

{
  "sites": [
    {
      "siteId": "unique-uuid-v4",
      "isActive": true,
      "slugId": "unique-slug-id",
      "slug": "seo-friendly-url-slug",
      "metaTitle": [
        "Primary SEO title (60 chars max)",
        "Alternative title variation 1", 
        "Alternative title variation 2"
      ],
      "location": {
        "lat": 19.0760,
        "lng": 72.8777,
        "city": "${city}",
        "district": "${district}",
        "state": "${state}",
        "region": "${region}",
        "country": "${country}",
        "pinCode": "${pinCode}"
      },
      "propertyType": "${propertyType}",
      "shortDescription": "150-character compelling description for search results",
      "description": "Detailed 500-word description covering location benefits, amenities, connectivity, investment potential, and local attractions. Include specific area names and landmarks.",
      "localities": [
        ["Popular Area 1", "Popular Area 2", "Popular Area 3", "Popular Area 4", "Popular Area 5"]
      ],
      "quickLinks": [
        [
          "Buy ${propertyType} in ${city}",
          "Rent ${propertyType} in ${city}",
          "New Projects in ${city}",
          "Property Dealers in ${district}",
          "Real Estate in ${city}",
          "Investment Opportunities ${city}"
        ]
      ],
      "sublocalities": [
        ["Sub-locality 1", "Sub-locality 2", "Sub-locality 3", "Sub-locality 4"]
      ],
      "keywords": [
        "${propertyType.toLowerCase()} ${city.toLowerCase()}",
        "real estate ${city.toLowerCase()}",
        "property ${city.toLowerCase()}",
        "${propertyType.toLowerCase()} for sale ${city.toLowerCase()}",
        "${propertyType.toLowerCase()} ${state.toLowerCase()}",
        "buy property ${city.toLowerCase()}",
        "${district.toLowerCase()} real estate",
        "investment ${city.toLowerCase()}"
      ],
      "faq": [
        {
          "question": "What are the best areas for ${propertyType} in ${city}?",
          "answer": "Detailed answer covering top localities, their unique features, connectivity, and amenities available in each area."
        },
        {
          "question": "What is the average price range for ${propertyType} in ${city}?",
          "answer": "Current market rates, factors affecting pricing, and investment trends in the ${city} real estate market."
        },
        {
          "question": "What amenities are available with ${propertyType} in ${city}?",
          "answer": "Common amenities, luxury features, and community facilities typically offered in ${city} properties."
        },
        {
          "question": "How is the connectivity from ${propertyType} locations in ${city}?",
          "answer": "Transportation options, major highways, metro connectivity, and proximity to airports/railway stations."
        }
      ],
      "footer": {
        "title": "${city} ${propertyType} - Reeltor.com",
        "description": "Your trusted partner for ${propertyType} in ${city}, ${state}. Find, buy, sell, and invest in premium properties with confidence."
      }
    }
  ]
}

SPECIFIC INSTRUCTIONS:
1. Generate realistic coordinates near ${city} (±0.1 degree variation)
2. Use actual area names and landmarks from ${city}
3. Include current market insights and local knowledge
4. Make each slug unique and SEO-friendly
5. Ensure meta titles are under 60 characters
6. Keep short descriptions under 150 characters
7. Make descriptions detailed and informative (400-600 words)
8. Generate 4-6 relevant FAQs per entry
9. Use proper Indian real estate terminology
10. Include investment potential and growth prospects

RESPONSE FORMAT:
Return ONLY the JSON object with the "sites" array. No additional text or explanation.`;

    return {
      prompt,
      expectedFormat: {
        sites: [
          {
            siteId: "string (UUID)",
            isActive: "boolean",
            slugId: "string", 
            slug: "string (URL-friendly)",
            metaTitle: ["string", "string", "string"],
            location: {
              lat: "number",
              lng: "number", 
              city: "string",
              district: "string",
              state: "string",
              region: "string",
              country: "string",
              pinCode: "string"
            },
            propertyType: "string",
            shortDescription: "string (150 chars max)",
            description: "string (400-600 words)",
            localities: [["string", "string", "..."]],
            quickLinks: [["string", "string", "..."]],
            sublocalities: [["string", "string", "..."]],
            keywords: ["string", "string", "..."],
            faq: [
              {
                question: "string",
                answer: "string"
              }
            ],
            footer: {
              title: "string",
              description: "string"
            }
          }
        ]
      }
    };
  }

  /**
   * Generate batch prompts for multiple locations/property types
   */
  static generateBatchPrompts(locations, propertyTypes, countPerBatch = 5) {
    const prompts = [];
    
    locations.forEach(location => {
      propertyTypes.forEach(propertyType => {
        const promptData = this.generatePrompt({
          ...location,
          propertyType,
          count: countPerBatch
        });
        
        prompts.push({
          id: `${location.city}_${propertyType}_${Date.now()}`,
          location: location.city,
          propertyType,
          prompt: promptData.prompt,
          expectedCount: countPerBatch
        });
      });
    });
    
    return prompts;
  }

  /**
   * Validate Gemini response format
   */
  static validateResponse(response) {
    try {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      if (!data.sites || !Array.isArray(data.sites)) {
        throw new Error('Response must contain sites array');
      }
      
      const requiredFields = [
        'siteId', 'slug', 'metaTitle', 'location', 'propertyType',
        'shortDescription', 'description', 'keywords', 'faq', 'footer'
      ];
      
      data.sites.forEach((site, index) => {
        requiredFields.forEach(field => {
          if (!site[field]) {
            throw new Error(`Site ${index}: Missing required field '${field}'`);
          }
        });
        
        // Validate nested structures
        if (!site.location.city || !site.location.state) {
          throw new Error(`Site ${index}: Invalid location data`);
        }
        
        if (!Array.isArray(site.metaTitle) || site.metaTitle.length === 0) {
          throw new Error(`Site ${index}: metaTitle must be non-empty array`);
        }
        
        if (!Array.isArray(site.faq) || site.faq.length === 0) {
          throw new Error(`Site ${index}: FAQ must be non-empty array`);
        }
      });
      
      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Sample usage and test data
const SAMPLE_LOCATIONS = [
  {
    city: "Mumbai",
    district: "Mumbai City", 
    state: "Maharashtra",
    region: "Western India",
    pinCode: "400001"
  },
  {
    city: "Delhi",
    district: "New Delhi",
    state: "Delhi", 
    region: "North India",
    pinCode: "110001"
  },
  {
    city: "Bangalore",
    district: "Bangalore Urban",
    state: "Karnataka",
    region: "South India", 
    pinCode: "560001"
  },
  {
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    region: "South India",
    pinCode: "500001"
  },
  {
    city: "Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    region: "South India",
    pinCode: "600001"
  }
];

const PROPERTY_TYPES = [
  "Residential Apartments",
  "Independent Houses", 
  "Villas",
  "Commercial Spaces",
  "Office Spaces",
  "Plots",
  "Warehouse",
  "Retail Shops"
];

// Export for use in other files
module.exports = {
  GeminiPromptGenerator,
  SAMPLE_LOCATIONS,
  PROPERTY_TYPES
};

// CLI usage example
if (require.main === module) {
  console.log('🤖 Gemini Prompt Generator for Real Estate Data\n');
  
  // Generate single prompt
  const singlePrompt = GeminiPromptGenerator.generatePrompt({
    city: "Mumbai",
    state: "Maharashtra",
    propertyType: "Residential Apartments",
    count: 3
  });
  
  console.log('📝 Sample Prompt:');
  console.log('='.repeat(50));
  console.log(singlePrompt.prompt);
  console.log('='.repeat(50));
  
  console.log('\n📊 Expected Response Format:');
  console.log(JSON.stringify(singlePrompt.expectedFormat, null, 2));
  
  console.log('\n🚀 Usage Examples:');
  console.log('1. Single location prompt:');
  console.log('   const prompt = GeminiPromptGenerator.generatePrompt({ city: "Mumbai", propertyType: "Villas" });');
  
  console.log('\n2. Batch prompts:');
  console.log('   const prompts = GeminiPromptGenerator.generateBatchPrompts(SAMPLE_LOCATIONS, PROPERTY_TYPES);');
  
  console.log('\n3. Validate response:');
  console.log('   const validation = GeminiPromptGenerator.validateResponse(geminiResponse);');
}