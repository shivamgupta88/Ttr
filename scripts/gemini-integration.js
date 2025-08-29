#!/usr/bin/env node

/**
 * Gemini AI Integration for Real Estate Data Generation
 * Works with gemma3-1b model
 */

const { GeminiPromptGenerator, SAMPLE_LOCATIONS, PROPERTY_TYPES } = require('./gemini-prompt-template');
const fs = require('fs').promises;
const path = require('path');

class GeminiIntegration {
  constructor(apiConfig = {}) {
    this.apiKey = apiConfig.apiKey || process.env.GEMINI_API_KEY;
    this.model = apiConfig.model || 'gemma3-1b';
    this.baseURL = apiConfig.baseURL || 'https://generativelanguage.googleapis.com/v1beta';
    this.maxRetries = apiConfig.maxRetries || 3;
    this.retryDelay = apiConfig.retryDelay || 2000;
  }

  /**
   * Call Gemini API with retry logic
   */
  async callGeminiAPI(prompt, options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 4000,
      topP = 0.9
    } = options;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🤖 Calling Gemini API (attempt ${attempt}/${this.maxRetries})...`);

        // For demonstration - replace with actual Gemini API call
        const response = await this.makeGeminiRequest({
          prompt,
          temperature,
          maxTokens,
          topP
        });

        return response;
      } catch (error) {
        console.error(`❌ API call failed (attempt ${attempt}):`, error.message);
        
        if (attempt === this.maxRetries) {
          throw new Error(`Gemini API failed after ${this.maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retry
        await this.delay(this.retryDelay * attempt);
      }
    }
  }

  /**
   * Make actual Gemini API request
   * Replace this with your actual API integration
   */
  async makeGeminiRequest(params) {
    // REPLACE THIS SECTION WITH YOUR ACTUAL GEMINI API INTEGRATION
    // This is a placeholder that shows the expected structure
    
    const { prompt, temperature, maxTokens, topP } = params;
    
    // Example using fetch (replace with your preferred HTTP client)
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: temperature,
        topP: topP,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json"
      }
    };

    try {
      // Simulated response for testing - REPLACE WITH REAL API CALL
      if (process.env.NODE_ENV === 'test' || !this.apiKey) {
        console.log('⚠️  Using simulated response (set GEMINI_API_KEY for real API)');
        return this.generateMockResponse(prompt);
      }

      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract the generated content
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No content generated from Gemini API');
      }

      return generatedText;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * Generate mock response for testing
   */
  generateMockResponse(prompt) {
    // Extract parameters from prompt
    const cityMatch = prompt.match(/City: ([^\\n]+)/);
    const stateMatch = prompt.match(/State: ([^\\n]+)/);
    const propertyTypeMatch = prompt.match(/Property Type: ([^\\n]+)/);
    
    const city = cityMatch ? cityMatch[1] : 'Mumbai';
    const state = stateMatch ? stateMatch[1] : 'Maharashtra';
    const propertyType = propertyTypeMatch ? propertyTypeMatch[1] : 'Residential Apartments';

    return JSON.stringify({
      sites: [
        {
          siteId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isActive: true,
          slugId: `mock-slug-${Date.now()}`,
          slug: `${city.toLowerCase().replace(/\\s+/g, '-')}-${propertyType.toLowerCase().replace(/\\s+/g, '-')}-mock`,
          metaTitle: [
            `Premium ${propertyType} in ${city} | Best Real Estate Deals`,
            `${city} ${propertyType} - Buy, Sell, Rent | Reeltor.com`,
            `Top ${propertyType} Properties in ${city}, ${state}`
          ],
          location: {
            lat: 19.0760 + (Math.random() - 0.5) * 0.1,
            lng: 72.8777 + (Math.random() - 0.5) * 0.1,
            city: city,
            district: `${city} District`,
            state: state,
            region: "Western India",
            country: "India",
            pinCode: "400001"
          },
          propertyType: propertyType,
          shortDescription: `Find premium ${propertyType} in ${city}, ${state}. Explore properties with excellent connectivity and modern amenities.`,
          description: `Discover exceptional ${propertyType} opportunities in ${city}, one of ${state}'s most promising real estate markets. Our curated selection offers modern amenities, strategic locations, and excellent connectivity. Whether you're looking for residential comfort or commercial success, ${city} provides the perfect backdrop for your investment. With proximity to business districts, educational institutions, and healthcare facilities, these properties represent the ideal blend of convenience and luxury.`,
          localities: [
            ["Central Area", "Business District", "IT Hub", "Commercial Zone", "Residential Belt"]
          ],
          quickLinks: [
            [
              `Buy ${propertyType} in ${city}`,
              `Rent ${propertyType} in ${city}`,
              `New Projects in ${city}`,
              `Property Dealers in ${city}`,
              `Real Estate in ${city}`,
              `Investment Opportunities ${city}`
            ]
          ],
          sublocalities: [
            ["Phase 1", "Phase 2", "Sector A", "Sector B"]
          ],
          keywords: [
            `${propertyType.toLowerCase()} ${city.toLowerCase()}`,
            `real estate ${city.toLowerCase()}`,
            `property ${city.toLowerCase()}`,
            `${propertyType.toLowerCase()} for sale ${city.toLowerCase()}`,
            `investment ${city.toLowerCase()}`
          ],
          faq: [
            {
              question: `What are the best areas for ${propertyType} in ${city}?`,
              answer: `The best areas for ${propertyType} in ${city} include prime locations with good connectivity, infrastructure, and amenities. Popular choices include the central business district, IT corridors, and well-planned residential areas with excellent transport links.`
            },
            {
              question: `What is the average price range for ${propertyType} in ${city}?`,
              answer: `Property prices in ${city} vary based on location, size, and amenities. Prime locations command premium prices, while emerging areas offer good value for investment. Contact our experts for current market rates and best deals.`
            },
            {
              question: `How is the connectivity from ${propertyType} locations in ${city}?`,
              answer: `${city} offers excellent connectivity through metro, bus networks, and major highways. Most ${propertyType} locations are well-connected to business districts, airports, and railway stations, making daily commutes convenient.`
            }
          ],
          footer: {
            title: `${city} ${propertyType} - Reeltor.com`,
            description: `Your trusted partner for ${propertyType} in ${city}, ${state}. Find, buy, sell, and invest in premium properties with confidence.`
          }
        }
      ]
    });
  }

  /**
   * Generate data for single location and property type
   */
  async generateSiteData(location, propertyType, count = 1) {
    console.log(`\\n🏗️  Generating ${count} entries for ${propertyType} in ${location.city}...`);
    
    const promptData = GeminiPromptGenerator.generatePrompt({
      ...location,
      propertyType,
      count
    });

    try {
      const response = await this.callGeminiAPI(promptData.prompt);
      const validation = GeminiPromptGenerator.validateResponse(response);
      
      if (!validation.valid) {
        throw new Error(`Invalid response format: ${validation.error}`);
      }
      
      console.log(`✅ Generated ${validation.data.sites.length} entries successfully`);
      return validation.data.sites;
    } catch (error) {
      console.error(`❌ Failed to generate data for ${location.city} ${propertyType}:`, error.message);
      throw error;
    }
  }

  /**
   * Batch generate data for multiple locations and property types
   */
  async batchGenerate(locations, propertyTypes, options = {}) {
    const {
      countPerBatch = 1,
      maxConcurrent = 3,
      outputFile = null,
      saveProgress = true
    } = options;

    console.log(`\\n🚀 Starting batch generation...`);
    console.log(`📊 Locations: ${locations.length}`);
    console.log(`🏠 Property Types: ${propertyTypes.length}`);
    console.log(`📝 Total batches: ${locations.length * propertyTypes.length}`);
    console.log(`⚡ Concurrent requests: ${maxConcurrent}`);

    const allSites = [];
    const errors = [];
    let completed = 0;
    const total = locations.length * propertyTypes.length;

    // Create all tasks
    const tasks = [];
    locations.forEach(location => {
      propertyTypes.forEach(propertyType => {
        tasks.push({ location, propertyType });
      });
    });

    // Process in batches of maxConcurrent
    for (let i = 0; i < tasks.length; i += maxConcurrent) {
      const batch = tasks.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async ({ location, propertyType }) => {
        try {
          const sites = await this.generateSiteData(location, propertyType, countPerBatch);
          completed++;
          console.log(`📈 Progress: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
          return sites;
        } catch (error) {
          errors.push({
            location: location.city,
            propertyType,
            error: error.message
          });
          completed++;
          return [];
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(sites => {
        allSites.push(...sites);
      });

      // Save progress if enabled
      if (saveProgress && outputFile && allSites.length > 0) {
        await this.saveProgress(allSites, `${outputFile}.progress`);
      }

      // Small delay between batches to avoid rate limiting
      if (i + maxConcurrent < tasks.length) {
        await this.delay(1000);
      }
    }

    const results = {
      totalGenerated: allSites.length,
      totalRequests: total,
      successRate: Math.round((total - errors.length) / total * 100),
      errors,
      sites: allSites
    };

    // Save final results
    if (outputFile) {
      await this.saveResults(results, outputFile);
    }

    console.log(`\\n✨ Batch generation completed!`);
    console.log(`📊 Total sites generated: ${allSites.length}`);
    console.log(`📈 Success rate: ${results.successRate}%`);
    if (errors.length > 0) {
      console.log(`⚠️  Errors encountered: ${errors.length}`);
    }

    return results;
  }

  /**
   * Save results to file
   */
  async saveResults(results, filename) {
    try {
      const outputPath = path.resolve(filename);
      await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
      console.log(`💾 Results saved to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Failed to save results:', error.message);
    }
  }

  /**
   * Save progress during batch processing
   */
  async saveProgress(sites, filename) {
    try {
      const progressData = {
        timestamp: new Date().toISOString(),
        count: sites.length,
        sites
      };
      await fs.writeFile(filename, JSON.stringify(progressData, null, 2));
    } catch (error) {
      console.error('⚠️  Failed to save progress:', error.message);
    }
  }

  /**
   * Utility function for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const integration = new GeminiIntegration();

  switch (command) {
    case 'test':
      // Test single generation
      integration.generateSiteData(
        SAMPLE_LOCATIONS[0], 
        PROPERTY_TYPES[0], 
        2
      ).then(sites => {
        console.log('\\n📋 Generated Sites:');
        sites.forEach((site, i) => {
          console.log(`${i + 1}. ${site.metaTitle[0]} (${site.slug})`);
        });
      }).catch(console.error);
      break;

    case 'batch':
      // Batch generation
      const count = parseInt(args[1]) || 1;
      const outputFile = args[2] || 'gemini-generated-sites.json';
      
      integration.batchGenerate(
        SAMPLE_LOCATIONS.slice(0, 2), // First 2 locations for testing
        PROPERTY_TYPES.slice(0, 3),   // First 3 property types
        {
          countPerBatch: count,
          maxConcurrent: 2,
          outputFile
        }
      ).catch(console.error);
      break;

    default:
      console.log(`
🤖 Gemini Integration for Real Estate Data Generation

Usage:
  node gemini-integration.js test                    # Test single generation
  node gemini-integration.js batch [count] [output]  # Batch generation

Examples:
  node gemini-integration.js test
  node gemini-integration.js batch 2 my-sites.json

Environment Variables:
  GEMINI_API_KEY=your-api-key-here
      `);
  }
}

module.exports = GeminiIntegration;