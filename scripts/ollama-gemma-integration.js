#!/usr/bin/env node

/**
 * Ollama Gemma Integration for TextToReels.in Content Generation
 * Works with local Gemma models running on Ollama
 */

const { TextToReelsPromptGenerator, CONTENT_TYPES, LANGUAGES, THEMES, PLATFORMS, AUDIENCES } = require('./texttoreels-gemini-prompt');
const fs = require('fs').promises;
const path = require('path');

class OllamaGemmaIntegration {
  constructor(config = {}) {
    this.ollamaUrl = config.ollamaUrl || 'http://localhost:11434';
    this.model = config.model || 'gemma:2b'; // or gemma:7b, gemma2, etc.
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.temperature = config.temperature || 0.7;
    this.numPredict = config.numPredict || 4000; // Max tokens to generate
  }

  /**
   * Call Ollama API with the local Gemma model
   */
  async callOllamaAPI(prompt, options = {}) {
    const {
      temperature = this.temperature,
      numPredict = this.numPredict,
      stream = false
    } = options;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🤖 Calling Ollama Gemma (attempt ${attempt}/${this.maxRetries})...`);

        const response = await this.makeOllamaRequest({
          model: this.model,
          prompt,
          stream,
          options: {
            temperature,
            num_predict: numPredict,
            stop: ['<|im_end|>', '\n\nHuman:', '\n\nAssistant:']
          }
        });

        return response;
      } catch (error) {
        console.error(`❌ Ollama API call failed (attempt ${attempt}):`, error.message);
        
        if (attempt === this.maxRetries) {
          throw new Error(`Ollama API failed after ${this.maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retry
        await this.delay(this.retryDelay * attempt);
      }
    }
  }

  /**
   * Make actual Ollama API request
   */
  async makeOllamaRequest(requestBody) {
    try {
      const fetch = (await import('node-fetch')).default;
      
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('No response from Ollama API');
      }

      return data.response;
    } catch (error) {
      // If fetch fails, try with node's built-in https
      if (error.code === 'MODULE_NOT_FOUND') {
        return await this.makeOllamaRequestWithHttps(requestBody);
      }
      throw error;
    }
  }

  /**
   * Fallback method using Node.js built-in https
   */
  async makeOllamaRequestWithHttps(requestBody) {
    const https = require('https');
    const http = require('http');
    const url = require('url');
    
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(`${this.ollamaUrl}/api/generate`);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.response) {
              resolve(parsed.response);
            } else {
              reject(new Error('No response from Ollama'));
            }
          } catch (error) {
            reject(new Error('Invalid JSON response from Ollama'));
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(requestBody));
      req.end();
    });
  }

  /**
   * Generate content data for single configuration
   */
  async generateContentData(config, count = 1) {
    const { contentType, language, theme, platform, audience } = config;
    
    console.log(`\n🎬 Generating ${count} ${contentType} entries for ${language} ${audience} on ${platform}...`);
    
    const promptData = TextToReelsPromptGenerator.generatePrompt({
      ...config,
      count
    });

    try {
      const response = await this.callOllamaAPI(promptData.prompt);
      
      // Clean and parse response
      const cleanedResponse = this.cleanResponse(response);
      const validation = TextToReelsPromptGenerator.validateResponse(cleanedResponse);
      
      if (!validation.valid) {
        console.error('❌ Invalid response format:', validation.error);
        console.log('Raw response:', response);
        throw new Error(`Invalid response format: ${validation.error}`);
      }
      
      console.log(`✅ Generated ${validation.data.content_entries.length} entries successfully`);
      return validation.data.content_entries;
    } catch (error) {
      console.error(`❌ Failed to generate content:`, error.message);
      throw error;
    }
  }

  /**
   * Clean response to ensure valid JSON
   */
  cleanResponse(response) {
    // Remove any markdown code blocks
    let cleaned = response.replace(/```json\n?|\n?```/g, '');
    
    // Remove any text before the JSON starts
    const jsonStart = cleaned.indexOf('{');
    if (jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    
    // Remove any text after the JSON ends
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonEnd > 0) {
      cleaned = cleaned.substring(0, jsonEnd + 1);
    }
    
    try {
      JSON.parse(cleaned);
      return cleaned;
    } catch (error) {
      // Try to fix common JSON issues
      cleaned = cleaned
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to keys
        .replace(/:\s*'([^']*)'/g, ': "$1"'); // Replace single quotes with double quotes
      
      return cleaned;
    }
  }

  /**
   * Batch generate content for multiple configurations
   */
  async batchGenerate(configurations, options = {}) {
    const {
      countPerConfig = 3,
      saveProgress = true,
      outputFile = null,
      delay = 500 // Delay between requests (local API can handle more frequent calls)
    } = options;

    console.log(`\n🚀 Starting batch generation...`);
    console.log(`📊 Configurations: ${configurations.length}`);
    console.log(`📝 Content per config: ${countPerConfig}`);
    console.log(`📄 Total expected: ${configurations.length * countPerConfig}`);

    const allContent = [];
    const errors = [];
    let completed = 0;
    const total = configurations.length;

    for (const config of configurations) {
      try {
        const content = await this.generateContentData(config, countPerConfig);
        allContent.push(...content);
        completed++;
        
        console.log(`📈 Progress: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
        
        // Save progress if enabled
        if (saveProgress && outputFile && allContent.length > 0) {
          await this.saveProgress(allContent, `${outputFile}.progress`);
        }
        
        // Small delay to be nice to the local API
        if (completed < total) {
          await this.delay(delay);
        }
      } catch (error) {
        errors.push({
          config,
          error: error.message
        });
        completed++;
        console.error(`❌ Failed config: ${config.contentType}_${config.language}_${config.theme}`);
      }
    }

    const results = {
      totalGenerated: allContent.length,
      totalConfigurations: total,
      successRate: Math.round((total - errors.length) / total * 100),
      errors,
      content: allContent
    };

    // Save final results
    if (outputFile) {
      await this.saveResults(results, outputFile);
    }

    console.log(`\n✨ Batch generation completed!`);
    console.log(`📊 Total content generated: ${allContent.length}`);
    console.log(`📈 Success rate: ${results.successRate}%`);
    if (errors.length > 0) {
      console.log(`⚠️  Errors encountered: ${errors.length}`);
    }

    return results;
  }

  /**
   * Generate popular content combinations
   */
  async generatePopularContent(count = 5, outputFile = 'popular-content.json') {
    const popularCombinations = [
      { contentType: 'love_quotes', language: 'hindi', theme: 'dark_theme', platform: 'instagram_post', audience: 'students' },
      { contentType: 'love_quotes', language: 'hinglish', theme: 'gradient_theme', platform: 'twitter_post', audience: 'young_adults' },
      { contentType: 'motivational_quotes', language: 'english', theme: 'minimalist_theme', platform: 'instagram_story', audience: 'professionals' },
      { contentType: 'motivational_quotes', language: 'hinglish', theme: 'neon_theme', platform: 'twitter_post', audience: 'entrepreneurs' },
      { contentType: 'funny_memes', language: 'hinglish', theme: 'colorful_theme', platform: 'tiktok_video', audience: 'teenagers' },
      { contentType: 'success_quotes', language: 'english', theme: 'dark_theme', platform: 'linkedin_post', audience: 'professionals' },
      { contentType: 'friendship_quotes', language: 'hindi', theme: 'light_theme', platform: 'facebook_post', audience: 'students' },
      { contentType: 'life_lessons', language: 'hinglish', theme: 'gradient_theme', platform: 'instagram_post', audience: 'young_adults' }
    ];

    return await this.batchGenerate(popularCombinations, {
      countPerConfig: count,
      outputFile
    });
  }

  /**
   * Test connection to Ollama
   */
  async testConnection() {
    try {
      console.log('🔍 Testing Ollama connection...');
      
      const testPrompt = 'Hello! Please respond with "Connected successfully" in JSON format: {"status": "Connected successfully"}';
      const response = await this.callOllamaAPI(testPrompt, { numPredict: 100 });
      
      console.log('✅ Ollama connection successful!');
      console.log('📝 Response:', response);
      return true;
    } catch (error) {
      console.error('❌ Ollama connection failed:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure Ollama is running: `ollama serve`');
      console.log('2. Check if your model is available: `ollama list`');
      console.log('3. Pull the model if needed: `ollama pull gemma:2b`');
      console.log('4. Verify the URL and port (default: http://localhost:11434)');
      return false;
    }
  }

  /**
   * List available models
   */
  async listModels() {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(`${this.ollamaUrl}/api/tags`);
      const data = await response.json();
      
      console.log('📋 Available Ollama models:');
      data.models.forEach(model => {
        console.log(`  • ${model.name} (${model.size})`);
      });
      
      return data.models;
    } catch (error) {
      console.error('❌ Failed to list models:', error.message);
      return [];
    }
  }

  // Utility functions
  async saveResults(results, filename) {
    try {
      const outputPath = path.resolve(filename);
      await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
      console.log(`💾 Results saved to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Failed to save results:', error.message);
    }
  }

  async saveProgress(content, filename) {
    try {
      const progressData = {
        timestamp: new Date().toISOString(),
        count: content.length,
        content
      };
      await fs.writeFile(filename, JSON.stringify(progressData, null, 2));
    } catch (error) {
      console.error('⚠️  Failed to save progress:', error.message);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const ollama = new OllamaGemmaIntegration({
    model: 'gemma:2b', // Change this to your model
    ollamaUrl: 'http://localhost:11434',
    temperature: 0.7
  });

  switch (command) {
    case 'test':
      ollama.testConnection();
      break;

    case 'models':
      ollama.listModels();
      break;

    case 'single':
      // Generate single content type
      const config = {
        contentType: args[1] || 'love_quotes',
        language: args[2] || 'hindi',
        theme: args[3] || 'dark_theme',
        platform: args[4] || 'twitter_post',
        audience: args[5] || 'students'
      };
      const count = parseInt(args[6]) || 3;
      
      ollama.generateContentData(config, count)
        .then(content => {
          console.log('\n📋 Generated Content:');
          content.forEach((item, i) => {
            console.log(`${i + 1}. ${item.metaTitle[0]}`);
            console.log(`   Primary: ${item.contentText.primary}`);
            console.log(`   Slug: ${item.slug}\n`);
          });
        })
        .catch(console.error);
      break;

    case 'popular':
      // Generate popular content combinations
      const popCount = parseInt(args[1]) || 3;
      const outputFile = args[2] || 'popular-texttoreels-content.json';
      
      ollama.generatePopularContent(popCount, outputFile)
        .catch(console.error);
      break;

    case 'batch':
      // Custom batch generation
      const customConfigs = [
        { contentType: 'love_quotes', language: 'hindi', theme: 'dark_theme', platform: 'twitter_post', audience: 'students' },
        { contentType: 'motivational_quotes', language: 'hinglish', theme: 'gradient_theme', platform: 'instagram_post', audience: 'professionals' }
      ];
      
      ollama.batchGenerate(customConfigs, {
        countPerConfig: parseInt(args[1]) || 2,
        outputFile: args[2] || 'batch-content.json'
      }).catch(console.error);
      break;

    default:
      console.log(`
🎬 Ollama Gemma Integration for TextToReels.in

Usage:
  node ollama-gemma-integration.js test                           # Test connection
  node ollama-gemma-integration.js models                        # List available models
  node ollama-gemma-integration.js single [type] [lang] [theme] [platform] [audience] [count]
  node ollama-gemma-integration.js popular [count] [output.json] # Generate popular combinations
  node ollama-gemma-integration.js batch [count] [output.json]   # Custom batch

Examples:
  node ollama-gemma-integration.js test
  node ollama-gemma-integration.js single love_quotes hindi dark_theme twitter_post students 5
  node ollama-gemma-integration.js popular 3 my-content.json

Setup:
  1. Make sure Ollama is running: ollama serve
  2. Pull Gemma model: ollama pull gemma:2b
  3. Run the script!

Available Options:
  Content Types: ${CONTENT_TYPES.join(', ')}
  Languages: ${LANGUAGES.join(', ')}
  Themes: ${THEMES.join(', ')}
  Platforms: ${PLATFORMS.join(', ')}
  Audiences: ${AUDIENCES.join(', ')}
      `);
  }
}

module.exports = OllamaGemmaIntegration;