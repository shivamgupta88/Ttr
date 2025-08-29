/**
 * Gemini Configuration Example
 * Copy this to gemini-config.js and update with your settings
 */

module.exports = {
  // Gemini API Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here',
    model: 'gemma3-1b', // or your preferred model
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    maxRetries: 3,
    retryDelay: 2000, // milliseconds
    
    // Generation parameters
    temperature: 0.7,     // 0.0 to 1.0 (creativity level)
    maxTokens: 4000,      // Maximum tokens in response
    topP: 0.9,            // Nucleus sampling parameter
  },

  // Batch processing settings
  batch: {
    maxConcurrent: 3,     // How many API calls to make simultaneously
    countPerBatch: 1,     // How many sites to generate per API call
    delayBetweenBatches: 1000, // Milliseconds to wait between batches
    saveProgress: true,   // Save progress during batch processing
  },

  // Output settings
  output: {
    directory: './generated-sites',
    filename: 'gemini-sites-{timestamp}.json',
    includeMetadata: true,
    prettyPrint: true
  },

  // Content customization
  content: {
    language: 'english',          // or 'hindi', 'bilingual'
    includeLocalLandmarks: true,  // Include specific local landmarks
    includePricing: false,        // Include pricing information
    includeInvestmentAdvice: true, // Include investment guidance
    seoOptimized: true           // Generate SEO-optimized content
  },

  // Location and property filters
  filters: {
    // Only generate for these cities (leave empty for all)
    cities: [
      // 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'
    ],
    
    // Only generate for these property types (leave empty for all)
    propertyTypes: [
      // 'Residential Apartments', 'Villas', 'Commercial Spaces'
    ],
    
    // Exclude certain combinations
    exclude: [
      // { city: 'Mumbai', propertyType: 'Warehouse' }
    ]
  }
};

// Example environment variables (.env file)
/*
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reeltor
BACKEND_URL=http://localhost:6000
*/