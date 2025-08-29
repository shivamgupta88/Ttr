# 🤖 Gemini AI Integration Guide for Real Estate Data Generation

This guide shows you exactly how to use Gemini AI (gemma3-1b) to generate real estate site data that perfectly matches your MongoDB schema.

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Set your Gemini API key
export GEMINI_API_KEY="your-gemini-api-key-here"

# Or add to .env file
echo "GEMINI_API_KEY=your-gemini-api-key-here" >> .env
```

### 2. Test Single Generation

```bash
# Test the system with mock data
node scripts/gemini-integration.js test
```

### 3. Generate Real Data

```bash
# Generate 2 sites per location/property combination
node scripts/gemini-integration.js batch 2 my-real-estate-sites.json
```

## 📝 Perfect Prompt Format for gemma3-1b

Here's the exact prompt structure optimized for your model:

### Single Location Prompt:
```text
Generate 1 comprehensive real estate website data entries for Residential Apartments in Mumbai, Mumbai City, Maharashtra, India.

REQUIREMENTS:
- Create unique, SEO-optimized content for each entry
- Include location-specific details and local knowledge
- Generate realistic FAQs with helpful answers
- Use proper Indian real estate terminology
- Ensure all data is factual and useful for potential buyers/renters

LOCATION CONTEXT:
- City: Mumbai
- District: Mumbai City
- State: Maharashtra
- Region: Western India
- Country: India
- PIN Code: 400001
- Property Type: Residential Apartments

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
        "city": "Mumbai",
        "district": "Mumbai City",
        "state": "Maharashtra",
        "region": "Western India",
        "country": "India",
        "pinCode": "400001"
      },
      "propertyType": "Residential Apartments",
      "shortDescription": "150-character compelling description for search results",
      "description": "Detailed 500-word description covering location benefits, amenities, connectivity, investment potential, and local attractions. Include specific area names and landmarks.",
      "localities": [
        ["Popular Area 1", "Popular Area 2", "Popular Area 3", "Popular Area 4", "Popular Area 5"]
      ],
      "quickLinks": [
        [
          "Buy Residential Apartments in Mumbai",
          "Rent Residential Apartments in Mumbai",
          "New Projects in Mumbai",
          "Property Dealers in Mumbai City",
          "Real Estate in Mumbai",
          "Investment Opportunities Mumbai"
        ]
      ],
      "sublocalities": [
        ["Sub-locality 1", "Sub-locality 2", "Sub-locality 3", "Sub-locality 4"]
      ],
      "keywords": [
        "residential apartments mumbai",
        "real estate mumbai",
        "property mumbai",
        "residential apartments for sale mumbai",
        "residential apartments maharashtra",
        "buy property mumbai",
        "mumbai city real estate",
        "investment mumbai"
      ],
      "faq": [
        {
          "question": "What are the best areas for Residential Apartments in Mumbai?",
          "answer": "Detailed answer covering top localities, their unique features, connectivity, and amenities available in each area."
        },
        {
          "question": "What is the average price range for Residential Apartments in Mumbai?",
          "answer": "Current market rates, factors affecting pricing, and investment trends in the Mumbai real estate market."
        },
        {
          "question": "What amenities are available with Residential Apartments in Mumbai?",
          "answer": "Common amenities, luxury features, and community facilities typically offered in Mumbai properties."
        },
        {
          "question": "How is the connectivity from Residential Apartments locations in Mumbai?",
          "answer": "Transportation options, major highways, metro connectivity, and proximity to airports/railway stations."
        }
      ],
      "footer": {
        "title": "Mumbai Residential Apartments - Reeltor.com",
        "description": "Your trusted partner for Residential Apartments in Mumbai, Maharashtra. Find, buy, sell, and invest in premium properties with confidence."
      }
    }
  ]
}

SPECIFIC INSTRUCTIONS:
1. Generate realistic coordinates near Mumbai (±0.1 degree variation)
2. Use actual area names and landmarks from Mumbai
3. Include current market insights and local knowledge
4. Make each slug unique and SEO-friendly
5. Ensure meta titles are under 60 characters
6. Keep short descriptions under 150 characters
7. Make descriptions detailed and informative (400-600 words)
8. Generate 4-6 relevant FAQs per entry
9. Use proper Indian real estate terminology
10. Include investment potential and growth prospects

RESPONSE FORMAT:
Return ONLY the JSON object with the "sites" array. No additional text or explanation.
```

## 🛠️ Implementation Options

### Option 1: Direct API Integration

```javascript
const GeminiIntegration = require('./scripts/gemini-integration');

const gemini = new GeminiIntegration({
  apiKey: 'your-api-key',
  model: 'gemma3-1b'
});

// Generate for single location
const sites = await gemini.generateSiteData(
  {
    city: "Mumbai",
    district: "Mumbai City",
    state: "Maharashtra",
    region: "Western India", 
    pinCode: "400001"
  },
  "Residential Apartments",
  3 // Generate 3 sites
);

console.log(`Generated ${sites.length} sites`);
```

### Option 2: Batch Processing

```javascript
const locations = [
  { city: "Mumbai", district: "Mumbai City", state: "Maharashtra", region: "Western India", pinCode: "400001" },
  { city: "Delhi", district: "New Delhi", state: "Delhi", region: "North India", pinCode: "110001" },
  { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", region: "South India", pinCode: "560001" }
];

const propertyTypes = [
  "Residential Apartments",
  "Villas", 
  "Commercial Spaces"
];

const results = await gemini.batchGenerate(locations, propertyTypes, {
  countPerBatch: 2,
  maxConcurrent: 3,
  outputFile: 'generated-sites.json'
});

console.log(`Generated ${results.totalGenerated} sites with ${results.successRate}% success rate`);
```

### Option 3: CLI Usage

```bash
# Test with mock data (no API key needed)
node scripts/gemini-integration.js test

# Generate real data (requires GEMINI_API_KEY)
node scripts/gemini-integration.js batch 3 output.json
```

## 📊 Expected Response Format

Gemini should return exactly this JSON structure:

```json
{
  "sites": [
    {
      "siteId": "b8c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
      "isActive": true,
      "slugId": "mumbai-apartments-bandra-2024",
      "slug": "mumbai-residential-apartments-bandra-premium",
      "metaTitle": [
        "Premium Apartments in Bandra Mumbai | Best Real Estate",
        "Bandra Residential Apartments - Buy, Rent | Reeltor.com",
        "Luxury Apartments Bandra Mumbai - Investment Opportunity"
      ],
      "location": {
        "lat": 19.0596,
        "lng": 72.8295,
        "city": "Mumbai",
        "district": "Mumbai City", 
        "state": "Maharashtra",
        "region": "Western India",
        "country": "India",
        "pinCode": "400050"
      },
      "propertyType": "Residential Apartments",
      "shortDescription": "Discover premium residential apartments in Bandra, Mumbai's most sought-after location with excellent connectivity and luxury amenities.",
      "description": "Experience luxury living in Bandra, Mumbai's most prestigious residential destination. Our exclusive collection of residential apartments offers world-class amenities, stunning city views, and unparalleled connectivity to business districts and entertainment hubs. Located in the heart of Western Mumbai, these properties provide easy access to Bandra-Worli Sea Link, international airports, and premium shopping destinations. Each apartment is designed with modern architecture, spacious layouts, and premium finishes. The locality boasts excellent schools, hospitals, restaurants, and recreational facilities. With Mumbai's expanding infrastructure and Bandra's consistent property appreciation, these apartments represent an ideal investment opportunity for discerning buyers seeking both luxury and growth potential.",
      "localities": [
        ["Bandra West", "Bandra East", "Khar", "Santacruz", "Andheri"]
      ],
      "quickLinks": [
        [
          "Buy Residential Apartments in Mumbai",
          "Rent Residential Apartments in Mumbai", 
          "New Projects in Bandra",
          "Property Dealers in Mumbai City",
          "Real Estate in Mumbai",
          "Investment Opportunities Mumbai"
        ]
      ],
      "sublocalities": [
        ["Pali Hill", "Hill Road", "Turner Road", "Carter Road"]
      ],
      "keywords": [
        "residential apartments mumbai",
        "bandra apartments mumbai",
        "luxury apartments bandra",
        "apartments for sale mumbai",
        "residential apartments maharashtra",
        "buy property mumbai",
        "mumbai city real estate",
        "investment mumbai"
      ],
      "faq": [
        {
          "question": "What makes Bandra the best location for residential apartments in Mumbai?",
          "answer": "Bandra offers the perfect blend of luxury living and strategic connectivity. It provides easy access to business districts via the Bandra-Worli Sea Link, proximity to both airports, excellent schools and hospitals, vibrant nightlife, and consistent property appreciation making it Mumbai's most desirable residential location."
        },
        {
          "question": "What is the price range for residential apartments in Bandra?",
          "answer": "Residential apartments in Bandra range from ₹3-5 crores for 2BHK units to ₹8-15 crores for premium 3-4BHK apartments, depending on exact location, amenities, and sea-facing views. Bandra West commands premium prices due to its proximity to the sea and upscale establishments."
        },
        {
          "question": "What amenities are available in Bandra residential apartments?",
          "answer": "Modern apartments in Bandra typically offer clubhouse facilities, swimming pools, gymnasium, landscaped gardens, 24/7 security, power backup, covered parking, children's play area, and concierge services. Many premium projects also feature rooftop amenities and sea-facing balconies."
        },
        {
          "question": "How is the connectivity from Bandra residential areas?",
          "answer": "Bandra offers exceptional connectivity with Bandra Railway Station (Western Line), multiple bus routes, the iconic Bandra-Worli Sea Link connecting to South Mumbai, easy access to both domestic and international airports, and proximity to major highways leading to Pune and other cities."
        }
      ],
      "footer": {
        "title": "Bandra Residential Apartments - Reeltor.com",
        "description": "Your trusted partner for premium residential apartments in Bandra, Mumbai. Find, buy, sell, and invest in luxury properties with confidence."
      }
    }
  ]
}
```

## 🔧 Customization Tips

### 1. Adjust for Different Cities
```javascript
// Generate prompt for different city
const prompt = GeminiPromptGenerator.generatePrompt({
  city: "Bangalore",
  district: "Bangalore Urban",
  state: "Karnataka", 
  region: "South India",
  pinCode: "560001",
  propertyType: "Villas",
  count: 2
});
```

### 2. Modify Content Style
Add these instructions to your prompt:
```text
CONTENT STYLE:
- Use formal, professional tone
- Include specific local landmarks and areas
- Mention transportation hubs (metro stations, airports)
- Include investment potential and ROI information
- Use Indian real estate terminology (crore, lakh, etc.)
```

### 3. SEO Optimization
```text
SEO REQUIREMENTS:
- Meta titles must be under 60 characters
- Short descriptions under 150 characters
- Include city + property type in keywords
- Generate location-specific content
- Include related search terms
```

## 📈 Production Workflow

### 1. Data Generation
```bash
# Generate data for all locations and property types
node scripts/gemini-integration.js batch 1 production-sites.json
```

### 2. Data Validation
```javascript
const { validateResponse } = require('./scripts/gemini-prompt-template');
const validation = validateResponse(generatedData);

if (!validation.valid) {
  console.error('Validation failed:', validation.error);
}
```

### 3. Database Import
```javascript
const Site = require('./src/models/Site');

// Import generated sites into MongoDB
for (const siteData of generatedSites) {
  const site = new Site(siteData);
  await site.save();
}
```

### 4. Static Site Generation
```bash
# Generate static HTML pages
node frontend/scripts/smart-batch-generator.js
```

## 🎯 Best Practices

1. **Start Small**: Test with 1-2 locations first
2. **Validate Responses**: Always check the response format
3. **Handle Errors**: Implement retry logic for API failures
4. **Monitor Usage**: Track API calls and costs
5. **Cache Results**: Save generated data to avoid regeneration
6. **Review Content**: Manually review generated content for accuracy

## 🚨 Common Issues & Solutions

### Issue: "Invalid response format"
**Solution**: Check if Gemini returned valid JSON. Add response cleaning:
```javascript
// Clean response before parsing
const cleanedResponse = response.replace(/```json\n?|\n?```/g, '');
const data = JSON.parse(cleanedResponse);
```

### Issue: "API rate limit exceeded"
**Solution**: Add delays and reduce concurrent requests:
```javascript
const results = await gemini.batchGenerate(locations, propertyTypes, {
  maxConcurrent: 1,  // Reduce concurrent requests
  delayBetweenBatches: 5000  // 5 second delay
});
```

### Issue: "Incomplete data generation"
**Solution**: Implement retry logic and save progress:
```javascript
const results = await gemini.batchGenerate(locations, propertyTypes, {
  saveProgress: true,  // Save progress during generation
  maxRetries: 3       // Retry failed requests
});
```

This setup will give you production-ready real estate site data that perfectly matches your MongoDB schema and generates beautiful, SEO-optimized static pages! 🏠✨