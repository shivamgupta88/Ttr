#!/usr/bin/env node

/**
 * Complete Pipeline: Ollama Gemma3 → Database → Static Sites
 * This script generates data using Ollama Gemma3, stores it in MongoDB, then builds static HTML sites
 */

const OllamaGemmaIntegration = require('./ollama-gemma-integration');
const SampleDataGenerator = require('./sample-data-generator');
const mongoose = require('mongoose');
const Site = require('../src/models/Site');
const TextToReelsContent = require('../src/models/TextToReelsContent');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class OllamaToStaticPipeline {
  constructor(config = {}) {
    this.ollama = new OllamaGemmaIntegration({
      model: config.model || 'gemma:2b',
      ollamaUrl: config.ollamaUrl || 'http://localhost:11434',
      temperature: config.temperature || 0.7
    });
    
    this.sampleGenerator = new SampleDataGenerator();
    this.outputDir = config.outputDir || path.join(__dirname, '..', 'generated-sites');
    this.databaseUrl = config.databaseUrl || process.env.DATABASE_URL || 'mongodb://localhost:27017/ttr';
    this.useRealAI = config.useRealAI || false; // Set to true to use actual Ollama, false for sample data
  }

  /**
   * Connect to MongoDB database
   */
  async connectDatabase() {
    try {
      await mongoose.connect(this.databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Connected to MongoDB');
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      return false;
    }
  }

  /**
   * Generate TextToReels content using Ollama Gemma3
   */
  async generateTextToReelsContent(count = 50) {
    console.log(`\n🎬 Generating ${count} TextToReels content entries...`);
    
    if (this.useRealAI) {
      // Test Ollama connection first
      const connected = await this.ollama.testConnection();
      if (!connected) {
        console.log('⚠️  Ollama not available, using sample data instead');
        this.useRealAI = false;
      }
    }

    let contentEntries = [];

    if (this.useRealAI) {
      console.log('🤖 Using Ollama Gemma3 for content generation...');
      
      // Generate popular content combinations
      const results = await this.ollama.generatePopularContent(
        Math.ceil(count / 8), // Divide by number of popular combinations
        null // Don't save to file, we'll save to database
      );
      
      contentEntries = results.content;
    } else {
      console.log('📝 Using sample data generation...');
      
      // Generate sample TextToReels content
      contentEntries = await this.generateSampleTextToReelsData(count);
    }

    console.log(`✅ Generated ${contentEntries.length} TextToReels content entries`);
    return contentEntries;
  }

  /**
   * Generate sample TextToReels data (fallback when Ollama is not available)
   */
  async generateSampleTextToReelsData(count) {
    const contentTypes = ['love_quotes', 'motivational_quotes', 'funny_memes', 'success_quotes'];
    const languages = ['hindi', 'english', 'hinglish'];
    const themes = ['dark_theme', 'light_theme', 'gradient_theme', 'minimalist_theme'];
    const platforms = ['instagram_post', 'twitter_post', 'facebook_post', 'linkedin_post'];
    const audiences = ['students', 'professionals', 'young_adults', 'teenagers'];

    const entries = [];
    
    for (let i = 0; i < count; i++) {
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      const language = languages[Math.floor(Math.random() * languages.length)];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const audience = audiences[Math.floor(Math.random() * audiences.length)];
      
      const entry = {
        contentId: `ttr_${contentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        slug: `${contentType}-${language}-${theme}-${platform}-${i + 1}`,
        contentType,
        language,
        theme,
        platform,
        audience,
        metaTitle: [
          `${contentType.replace('_', ' ')} for ${audience} | ${language} ${platform}`,
          `Best ${contentType.replace('_', ' ')} in ${language} | Premium Content`,
          `Trending ${contentType.replace('_', ' ')} for ${platform} | ${theme}`
        ],
        shortDescription: `Discover amazing ${contentType.replace('_', ' ')} perfect for ${audience}. Premium ${language} content designed for ${platform} with ${theme} styling.`,
        description: `Get the best ${contentType.replace('_', ' ')} content specifically crafted for ${audience} on ${platform}. Our collection features premium ${language} content with beautiful ${theme} design that guarantees engagement. Perfect for social media creators, influencers, and anyone looking to make an impact with meaningful content. Each piece is carefully curated to resonate with your target audience and boost your social media presence.`,
        contentText: {
          primary: this.generateSampleContentText(contentType, language),
          variations: [
            this.generateSampleContentText(contentType, language),
            this.generateSampleContentText(contentType, language)
          ],
          hashtags: this.generateHashtags(contentType, language, platform),
          callToAction: "Share if you can relate! ❤️"
        },
        designSpecs: {
          colorScheme: this.getThemeColors(theme),
          fontStyle: this.getThemeFont(theme),
          layout: "centered",
          elements: ["background", "text", "decorations"]
        },
        seoData: {
          keywords: [
            `${contentType} ${language}`,
            `${platform} content`,
            `${audience} quotes`,
            `${theme} design`,
            `social media content`,
            `${language} ${contentType}`
          ],
          canonicalUrl: `https://texttoreels.in/content/${contentType}-${language}-${theme}-${platform}-${i + 1}`,
          ogImage: `https://texttoreels.in/og/${contentType}-${language}-${theme}.jpg`
        },
        usageStats: {
          difficulty: Math.random() > 0.5 ? 'easy' : 'medium',
          estimatedEngagement: Math.random() > 0.5 ? 'high' : 'medium',
          bestTimeToPost: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)],
          platformOptimization: `Optimized for ${platform} with ${theme} styling`
        },
        relatedContent: [`${contentType}_related_1`, `${contentType}_related_2`],
        creatorTips: [
          `Use ${theme} theme for better engagement with ${audience}`,
          `Post during ${['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)]} for maximum reach`,
          `Combine with trending hashtags for viral potential`
        ]
      };
      
      entries.push(entry);
    }
    
    return entries;
  }

  generateSampleContentText(contentType, language) {
    const templates = {
      love_quotes: {
        hindi: "प्यार में डूबे रहना, यही तो जिंदगी का असल मज़ा है ❤️",
        english: "Love is not just a feeling, it's a beautiful journey ❤️",
        hinglish: "Pyaar ka feeling hi alag hai yaar, kya baat hai! 💕"
      },
      motivational_quotes: {
        hindi: "सफलता का कोई शॉर्टकट नहीं, मेहनत करो और कामयाब बनो 💪",
        english: "Success is not final, failure is not fatal, courage continues ⚡",
        hinglish: "Mehnat ka phal meetha hota hai, bas consistent rehna hai 🔥"
      },
      funny_memes: {
        hindi: "जब Monday आता है तो लगता है Weekend सिर्फ सपना था 😅",
        english: "When you realize it's Monday again and weekend was just a myth 😂",
        hinglish: "Monday blues hitting different when you realize weekend khatam 😆"
      }
    };
    
    return templates[contentType]?.[language] || "Amazing content awaits you! ✨";
  }

  generateHashtags(contentType, language, platform) {
    const base = ['#TextToReels', '#SocialMedia', '#Content'];
    const specific = {
      love_quotes: ['#LoveQuotes', '#Romance', '#Love'],
      motivational_quotes: ['#Motivation', '#Success', '#Inspiration'],
      funny_memes: ['#Funny', '#Memes', '#Comedy']
    };
    
    return [...base, ...(specific[contentType] || []), `#${language}`, `#${platform}`];
  }

  getThemeColors(theme) {
    const colors = {
      dark_theme: ['#1a1a1a', '#ffffff', '#333333'],
      light_theme: ['#ffffff', '#000000', '#f0f0f0'],
      gradient_theme: ['#667eea', '#764ba2', '#ffffff'],
      minimalist_theme: ['#fafafa', '#2d3748', '#e2e8f0']
    };
    
    return colors[theme] || colors.dark_theme;
  }

  getThemeFont(theme) {
    const fonts = {
      dark_theme: 'Bold Sans Serif',
      light_theme: 'Clean Sans Serif',
      gradient_theme: 'Modern Sans Serif',
      minimalist_theme: 'Minimalist Sans Serif'
    };
    
    return fonts[theme] || fonts.dark_theme;
  }

  /**
   * Generate Real Estate site data using Ollama Gemma3
   */
  async generateRealEstateSites(count = 20) {
    console.log(`\n🏠 Generating ${count} Real Estate site entries...`);
    
    // For now, use sample data generator since we need to adapt Ollama for real estate content
    // In a real implementation, you'd create prompts similar to the TextToReels format
    const sites = this.sampleGenerator.generateBulkData(count);
    
    console.log(`✅ Generated ${sites.length} Real Estate site entries`);
    return sites;
  }

  /**
   * Save TextToReels content to MongoDB
   */
  async saveTextToReelsContent(contentEntries) {
    console.log(`\n💾 Saving ${contentEntries.length} TextToReels entries to database...`);
    
    let saved = 0;
    let errors = 0;

    for (const entry of contentEntries) {
      try {
        const content = new TextToReelsContent(entry);
        await content.save();
        saved++;
      } catch (error) {
        console.error(`❌ Error saving ${entry.slug}:`, error.message);
        errors++;
      }
    }

    console.log(`✅ Saved ${saved} TextToReels entries (${errors} errors)`);
    return { saved, errors };
  }

  /**
   * Save Real Estate sites to MongoDB
   */
  async saveSites(sites) {
    console.log(`\n💾 Saving ${sites.length} site entries to database...`);
    
    let saved = 0;
    let errors = 0;

    for (const siteData of sites) {
      try {
        const site = new Site(siteData);
        await site.save();
        saved++;
      } catch (error) {
        console.error(`❌ Error saving ${siteData.slug}:`, error.message);
        errors++;
      }
    }

    console.log(`✅ Saved ${saved} site entries (${errors} errors)`);
    return { saved, errors };
  }

  /**
   * Generate static HTML sites from database
   */
  async generateStaticSites() {
    console.log(`\n🌐 Generating static HTML sites...`);
    
    try {
      // Create output directory
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(path.join(this.outputDir, 'content'), { recursive: true });
      await fs.mkdir(path.join(this.outputDir, 'sites'), { recursive: true });

      // Generate TextToReels content pages
      await this.generateTextToReelsPages();
      
      // Generate Real Estate site pages
      await this.generateRealEstatePages();
      
      // Generate index and navigation
      await this.generateIndexPages();
      
      console.log(`✅ Static sites generated in: ${this.outputDir}`);
      return true;
    } catch (error) {
      console.error('❌ Error generating static sites:', error.message);
      return false;
    }
  }

  /**
   * Generate TextToReels content pages
   */
  async generateTextToReelsPages() {
    const contents = await TextToReelsContent.find({ isActive: true }).limit(100);
    console.log(`📄 Generating ${contents.length} TextToReels pages...`);
    
    for (const content of contents) {
      const html = this.generateTextToReelsHTML(content);
      const filePath = path.join(this.outputDir, 'content', `${content.slug}.html`);
      await fs.writeFile(filePath, html, 'utf8');
    }
  }

  /**
   * Generate Real Estate site pages
   */
  async generateRealEstatePages() {
    const sites = await Site.find({ isActive: true }).limit(100);
    console.log(`🏠 Generating ${sites.length} Real Estate pages...`);
    
    for (const site of sites) {
      const html = this.generateRealEstateHTML(site);
      const filePath = path.join(this.outputDir, 'sites', `${site.slug}.html`);
      await fs.writeFile(filePath, html, 'utf8');
    }
  }

  /**
   * Generate TextToReels HTML page
   */
  generateTextToReelsHTML(content) {
    const primaryTitle = Array.isArray(content.metaTitle) ? content.metaTitle[0] : content.metaTitle;
    
    return `<!DOCTYPE html>
<html lang="${content.language === 'hindi' ? 'hi' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${primaryTitle}</title>
    <meta name="description" content="${content.shortDescription}">
    <meta name="keywords" content="${content.seoData.keywords.join(', ')}">
    <link rel="canonical" href="${content.seoData.canonicalUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${primaryTitle}">
    <meta property="og:description" content="${content.shortDescription}">
    <meta property="og:url" content="${content.seoData.canonicalUrl}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="TextToReels.in">
    ${content.seoData.ogImage ? `<meta property="og:image" content="${content.seoData.ogImage}">` : ''}
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            color: #1a202c;
            background: ${this.getThemeBackground(content.theme)};
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        
        .header {
            background: ${this.getThemeGradient(content.theme)};
            color: white;
            padding: 3rem 0;
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 900;
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        
        .content-card {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .primary-content {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 2rem;
            line-height: 1.4;
        }
        
        .variations {
            display: grid;
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .variation {
            background: #f7fafc;
            padding: 1.5rem;
            border-radius: 12px;
            font-style: italic;
            color: #4a5568;
        }
        
        .hashtags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
            margin: 2rem 0;
        }
        
        .hashtag {
            background: ${this.getThemeGradient(content.theme)};
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .cta {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin: 1rem 0;
            font-weight: 600;
            transition: transform 0.3s ease;
        }
        
        .cta:hover { transform: scale(1.05); }
        
        .meta-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .meta-item {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            text-align: center;
        }
        
        .meta-label {
            font-weight: 600;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .footer {
            background: #1a202c;
            color: #e2e8f0;
            padding: 2rem 0;
            text-align: center;
            margin-top: 3rem;
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .header { padding: 2rem 0; }
            .content-card { padding: 2rem; }
            .primary-content { font-size: 1.2rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${primaryTitle}</h1>
            <p>${content.shortDescription}</p>
        </div>
    </div>
    
    <div class="container">
        <div class="content-card">
            <div class="primary-content">
                "${content.contentText.primary}"
            </div>
            
            ${content.contentText.variations && content.contentText.variations.length > 0 ? `
            <div class="variations">
                ${content.contentText.variations.map(variation => `
                    <div class="variation">"${variation}"</div>
                `).join('')}
            </div>
            ` : ''}
            
            ${content.contentText.hashtags && content.contentText.hashtags.length > 0 ? `
            <div class="hashtags">
                ${content.contentText.hashtags.map(hashtag => `
                    <span class="hashtag">${hashtag}</span>
                `).join('')}
            </div>
            ` : ''}
            
            ${content.contentText.callToAction ? `
            <div class="cta">${content.contentText.callToAction}</div>
            ` : ''}
        </div>
        
        <div class="meta-info">
            <div class="meta-item">
                <div class="meta-label">Content Type</div>
                <div>${content.categoryDisplay}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Platform</div>
                <div>${content.platformDisplay}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Audience</div>
                <div>${content.audience.replace('_', ' ')}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Theme</div>
                <div>${content.theme.replace('_', ' ')}</div>
            </div>
        </div>
        
        ${content.creatorTips && content.creatorTips.length > 0 ? `
        <div class="content-card">
            <h2>Creator Tips</h2>
            <ul style="text-align: left; margin-top: 1rem;">
                ${content.creatorTips.map(tip => `<li style="margin: 0.5rem 0;">${tip}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <div class="container">
            <p>&copy; 2024 TextToReels.in - Premium AI-powered content generation</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate Real Estate HTML page (reuse from smart-batch-generator.js)
   */
  generateRealEstateHTML(site) {
    const primaryTitle = Array.isArray(site.metaTitle) ? site.metaTitle[0] : site.metaTitle;
    const locationString = `${site.location.city}, ${site.location.district}, ${site.location.state}`;
    
    // This is a simplified version - you can use the full HTML from smart-batch-generator.js
    return `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${primaryTitle} | Real Estate in ${locationString}</title>
    <meta name="description" content="${site.shortDescription}">
    <meta name="keywords" content="${site.keywords.join(', ')}">
    <link rel="canonical" href="https://reeltor.com/${site.slug}">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a202c; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 0; text-align: center; margin-bottom: 3rem; }
        .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; line-height: 1.2; }
        .card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); margin-bottom: 2rem; }
        .localities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin: 1rem 0; }
        .locality-item { background: #edf2f7; padding: 0.5rem 1rem; border-radius: 20px; text-align: center; font-size: 0.9rem; color: #4a5568; }
        .faq-item { background: white; margin: 1rem 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .faq-question { background: #f7fafc; padding: 1rem; font-weight: 600; color: #2d3748; }
        .faq-answer { padding: 1rem; color: #4a5568; border-top: 1px solid #e2e8f0; }
        .footer { background: #1a202c; color: #e2e8f0; padding: 2rem 0; text-align: center; margin-top: 3rem; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="container">
            <h1>${primaryTitle}</h1>
            <p>${site.shortDescription}</p>
            <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; margin-top: 1rem;">
                📍 ${locationString} - ${site.location.pinCode}
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="card">
            <h2>About ${site.propertyType} in ${site.location.city}</h2>
            <p>${site.description}</p>
        </div>
        
        ${site.localities && site.localities.length > 0 ? `
        <div class="card">
            <h2>Popular Localities</h2>
            <div class="localities-grid">
                ${site.localities.flat().map(locality => `<div class="locality-item">${locality}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${site.faq && site.faq.length > 0 ? `
        <div class="card">
            <h2>Frequently Asked Questions</h2>
            ${site.faq.map(item => `
                <div class="faq-item">
                    <div class="faq-question">${item.question}</div>
                    <div class="faq-answer">${item.answer}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <div class="container">
            <p>&copy; 2024 ${site.footer?.title || 'Reeltor.com'} - ${site.footer?.description || 'Your trusted real estate partner'}</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate index and navigation pages
   */
  async generateIndexPages() {
    console.log('📋 Generating index pages...');
    
    // Generate main index
    const mainIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Static Sites - Ollama Gemma3 Pipeline</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; margin-bottom: 3rem; }
        .header h1 { color: #1a202c; font-size: 2.5rem; margin-bottom: 1rem; }
        .section { background: white; padding: 2rem; margin: 2rem 0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .section h2 { color: #667eea; margin-bottom: 1rem; }
        .links { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .link { display: block; padding: 1rem; background: #f7fafc; border-radius: 8px; text-decoration: none; color: #4a5568; transition: background 0.3s ease; }
        .link:hover { background: #edf2f7; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Generated Static Sites</h1>
            <p>Content generated using Ollama Gemma3 pipeline</p>
            <p>Generated on: ${new Date().toISOString()}</p>
        </div>
        
        <div class="section">
            <h2>🎬 TextToReels Content</h2>
            <p>AI-generated content for social media platforms</p>
            <div class="links">
                <a href="./content/" class="link">Browse All Content →</a>
            </div>
        </div>
        
        <div class="section">
            <h2>🏠 Real Estate Sites</h2>
            <p>Property listings and real estate information</p>
            <div class="links">
                <a href="./sites/" class="link">Browse All Sites →</a>
            </div>
        </div>
        
        <div class="section">
            <h2>📊 Generation Stats</h2>
            <p>Pipeline completed successfully!</p>
        </div>
    </div>
</body>
</html>`;
    
    await fs.writeFile(path.join(this.outputDir, 'index.html'), mainIndexHTML, 'utf8');
  }

  /**
   * Helper methods for theme styling
   */
  getThemeBackground(theme) {
    const backgrounds = {
      dark_theme: '#1a1a1a',
      light_theme: '#ffffff',
      gradient_theme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minimalist_theme: '#fafafa'
    };
    return backgrounds[theme] || backgrounds.light_theme;
  }

  getThemeGradient(theme) {
    const gradients = {
      dark_theme: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      light_theme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradient_theme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minimalist_theme: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)'
    };
    return gradients[theme] || gradients.gradient_theme;
  }

  /**
   * Run the complete pipeline
   */
  async runPipeline(options = {}) {
    const {
      textToReelsCount = 50,
      realEstateCount = 20,
      useRealAI = false,
      skipDatabase = false,
      skipStaticGeneration = false
    } = options;

    this.useRealAI = useRealAI;

    console.log('🚀 Starting Ollama Gemma3 → Database → Static Sites Pipeline');
    console.log(`Configuration:
    - TextToReels Content: ${textToReelsCount}
    - Real Estate Sites: ${realEstateCount}
    - Use Real AI: ${useRealAI}
    - Skip Database: ${skipDatabase}
    - Skip Static Generation: ${skipStaticGeneration}
    `);

    const startTime = Date.now();

    try {
      // Step 1: Connect to database (if not skipping)
      if (!skipDatabase) {
        const connected = await this.connectDatabase();
        if (!connected) {
          console.log('⚠️  Database connection failed, continuing with file output only');
        }
      }

      // Step 2: Generate TextToReels content
      const textToReelsContent = await this.generateTextToReelsContent(textToReelsCount);
      
      // Step 3: Generate Real Estate sites
      const realEstateSites = await this.generateRealEstateSites(realEstateCount);

      // Step 4: Save to database (if not skipping)
      if (!skipDatabase && mongoose.connection.readyState === 1) {
        await this.saveTextToReelsContent(textToReelsContent);
        await this.saveSites(realEstateSites);
      }

      // Step 5: Generate static sites (if not skipping)
      if (!skipStaticGeneration) {
        await this.generateStaticSites();
      }

      const totalTime = (Date.now() - startTime) / 1000;

      console.log(`\n✅ Pipeline completed successfully!`);
      console.log(`⏱️  Total time: ${totalTime.toFixed(1)}s`);
      console.log(`📊 Generated:`);
      console.log(`   - ${textToReelsContent.length} TextToReels content entries`);
      console.log(`   - ${realEstateSites.length} Real Estate sites`);
      console.log(`📁 Static sites: ${this.outputDir}`);
      
      if (!skipDatabase && mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('✅ Database disconnected');
      }

      return {
        success: true,
        textToReelsContent: textToReelsContent.length,
        realEstateSites: realEstateSites.length,
        outputDir: this.outputDir,
        totalTime
      };

    } catch (error) {
      console.error('❌ Pipeline failed:', error.message);
      
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  
  const pipeline = new OllamaToStaticPipeline({
    model: 'gemma:2b', // Change to your preferred model
    useRealAI: args.includes('--real-ai'),
    outputDir: path.join(__dirname, '..', 'generated-static-sites')
  });

  switch (command) {
    case 'run':
      const textToReelsCount = parseInt(args[1]) || 50;
      const realEstateCount = parseInt(args[2]) || 20;
      
      pipeline.runPipeline({
        textToReelsCount,
        realEstateCount,
        useRealAI: args.includes('--real-ai'),
        skipDatabase: args.includes('--skip-db'),
        skipStaticGeneration: args.includes('--skip-static')
      }).then(result => {
        if (result.success) {
          console.log('\n🎉 Check your generated static sites!');
          process.exit(0);
        } else {
          process.exit(1);
        }
      }).catch(console.error);
      break;

    case 'test':
      // Test Ollama connection
      pipeline.ollama.testConnection();
      break;

    default:
      console.log(`
🚀 Ollama Gemma3 → Database → Static Sites Pipeline

Usage:
  node ollama-to-static-pipeline.js run [textToReelsCount] [realEstateCount] [options]
  node ollama-to-static-pipeline.js test

Examples:
  node ollama-to-static-pipeline.js run 100 50                    # Generate 100 content + 50 sites
  node ollama-to-static-pipeline.js run 50 20 --real-ai          # Use actual Ollama Gemma3
  node ollama-to-static-pipeline.js run 25 10 --skip-db          # Skip database, generate files only
  node ollama-to-static-pipeline.js run 100 50 --skip-static     # Generate data only, no static files

Options:
  --real-ai       Use actual Ollama Gemma3 (requires Ollama running)
  --skip-db       Skip database operations (generate JSON files instead)
  --skip-static   Skip static site generation (database only)

Requirements:
  - MongoDB running (unless using --skip-db)
  - Ollama with Gemma model (if using --real-ai)

The pipeline will:
1. 🤖 Generate content using Ollama Gemma3 or sample data
2. 💾 Store data in MongoDB database
3. 🌐 Generate beautiful static HTML sites
4. 📊 Provide complete generation statistics
      `);
  }
}

module.exports = OllamaToStaticPipeline;