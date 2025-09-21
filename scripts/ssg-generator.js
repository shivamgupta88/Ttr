const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Page = require('../src/models/Page');
const { InternalLinkingSystem } = require('./internal-linking-system');

class StaticSiteGenerator {
  constructor(options = {}) {
    this.outputDir = options.outputDir || './generated-static-sites';
    this.templatePath = options.templatePath || './frontend/static-template.html';
    this.batchSize = options.batchSize || 100;
    this.maxPages = options.maxPages || 10000; // Netlify free limit consideration
    this.template = null;
    this.linkingSystem = new InternalLinkingSystem();
    this.internalLinks = null;
  }

  async initialize() {
    console.log('🚀 Initializing Static Site Generator...');

    // Load template
    try {
      this.template = await fs.readFile(this.templatePath, 'utf8');
      console.log('✅ Template loaded successfully');
    } catch (error) {
      throw new Error(`Failed to load template: ${error.message}`);
    }

    // Create output directories
    await this.createDirectories();

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/texttoreels', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Database connected');

    // Generate internal linking data
    console.log('🔗 Generating internal linking system...');
    const linkingMap = await this.linkingSystem.generateLinkingStrategy();
    this.internalLinks = linkingMap;
    console.log('✅ Internal linking system ready');
  }

  async createDirectories() {
    const dirs = [
      this.outputDir,
      path.join(this.outputDir, 'content-types'),
      path.join(this.outputDir, 'language'),
      path.join(this.outputDir, 'platform'),
      path.join(this.outputDir, 'themes'),
      path.join(this.outputDir, 'static'),
      path.join(this.outputDir, 'assets')
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }
    }
  }

  async generatePages(options = {}) {
    const {
      limit = this.maxPages,
      prioritizeHighTraffic = true,
      themes = null,
      languages = null
    } = options;

    console.log(`📊 Starting page generation (limit: ${limit.toLocaleString()})`);

    // Build query for high-traffic content
    let query = { status: 'generated', isActive: true };

    if (themes) query['dimensions.theme'] = { $in: themes };
    if (languages) query['dimensions.language'] = { $in: languages };

    // Get total count
    const totalPages = await Page.countDocuments(query);
    console.log(`📈 Found ${totalPages.toLocaleString()} pages matching criteria`);

    // Prioritize high-traffic combinations
    let sortCriteria = {};
    if (prioritizeHighTraffic) {
      // Prioritize Hindi + Love/Motivation content, then English content
      sortCriteria = {
        'dimensions.language': 1, // Hindi first
        'dimensions.theme': 1,    // Love/motivation themes first
        createdAt: -1
      };
    } else {
      sortCriteria = { createdAt: -1 };
    }

    let processedCount = 0;
    let generatedCount = 0;
    const errors = [];

    // Process in batches
    for (let skip = 0; skip < Math.min(totalPages, limit); skip += this.batchSize) {
      console.log(`\n📝 Processing batch ${Math.floor(skip/this.batchSize) + 1}/${Math.ceil(Math.min(totalPages, limit)/this.batchSize)}`);

      const pages = await Page.find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(this.batchSize)
        .select('-__v')
        .lean();

      for (const page of pages) {
        try {
          await this.generateSinglePage(page);
          generatedCount++;
          processedCount++;

          if (processedCount % 50 === 0) {
            console.log(`   📊 Progress: ${processedCount}/${Math.min(totalPages, limit)} (${((processedCount/Math.min(totalPages, limit))*100).toFixed(1)}%)`);
          }

          if (generatedCount >= limit) {
            console.log(`🎯 Reached limit of ${limit} pages`);
            break;
          }
        } catch (error) {
          errors.push({ slug: page.slug, error: error.message });
          console.error(`❌ Error generating ${page.slug}: ${error.message}`);
        }
      }

      if (generatedCount >= limit) break;
    }

    console.log(`\n🎉 Page generation complete!`);
    console.log(`✅ Generated: ${generatedCount.toLocaleString()} pages`);
    console.log(`❌ Errors: ${errors.length}`);

    return { generatedCount, errors };
  }

  async generateSinglePage(pageData) {
    // Prepare content variables
    const variables = this.prepareTemplateVariables(pageData);

    // Replace template placeholders
    let htmlContent = this.template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value);
    }

    // Determine file path based on content structure
    const filePath = this.getFilePath(pageData);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, htmlContent, 'utf8');
  }

  prepareTemplateVariables(pageData) {
    const { content, seo, dimensions } = pageData;

    // Generate related content cards (mock for now)
    const contentCards = this.generateContentCards(dimensions);

    // Format main content
    const mainContent = this.formatMainContent(content, dimensions);

    // Generate quick links section
    const quickLinksSection = this.generateQuickLinksSection(pageData);

    return {
      TITLE: content.title.replace(' | TextToReels.in', ''),
      DESCRIPTION: content.description,
      KEYWORDS: seo.keywords.join(', '),
      URL: seo.canonicalUrl,
      CONTENT_TITLE: content.heading,
      MAIN_CONTENT: mainContent,
      CONTENT_CARDS: contentCards,
      QUICK_LINKS_SECTION: quickLinksSection,
      CATEGORY: this.formatCategory(dimensions.theme),
      LANGUAGE: this.formatLanguage(dimensions.language),
      PLATFORM: this.formatPlatform(dimensions.platform)
    };
  }

  formatMainContent(content, dimensions) {
    let mainContent = `<p>${content.description}</p>`;

    // Add introduction if available
    if (content.introduction) {
      mainContent += `<p>${content.introduction}</p>`;
    }

    // Add features if available
    if (content.features && content.features.length > 0) {
      mainContent += `<h4>Key Features:</h4><ul>`;
      content.features.forEach(feature => {
        mainContent += `<li>${feature}</li>`;
      });
      mainContent += `</ul>`;
    }

    // Add examples with special formatting for Hindi content
    if (content.examples && content.examples.length > 0) {
      mainContent += `<h4>Examples:</h4>`;
      content.examples.forEach(example => {
        if (dimensions.language === 'hindi') {
          mainContent += `<div class="hindi-text">"${example}"</div>`;
        } else {
          mainContent += `<blockquote style="border-left: 4px solid #667eea; padding-left: 1rem; margin: 1rem 0; font-style: italic;">${example}</blockquote>`;
        }
      });
    }

    // Add call to action
    if (content.callToAction) {
      mainContent += `<p style="text-align: center; margin: 2rem 0;"><strong>${content.callToAction}</strong></p>`;
    }

    return mainContent;
  }

  generateContentCards(dimensions) {
    // Generate 3 related content cards
    const relatedThemes = this.getRelatedThemes(dimensions.theme);
    const cards = [];

    for (let i = 0; i < 3; i++) {
      const theme = relatedThemes[i] || dimensions.theme;
      cards.push(`
        <div class="content-card fade-in fade-in-delay-${i + 1}">
          <h3>${this.getCardIcon(theme)} ${this.formatThemeName(theme)}</h3>
          <p>${this.getThemeDescription(theme, dimensions.language, dimensions.platform)}</p>
          <div class="content-meta">
            <div class="content-tag">${this.formatCategory(theme)}</div>
            <span>${this.formatLanguage(dimensions.language)} • ${this.formatPlatform(dimensions.platform)}</span>
          </div>
        </div>
      `);
    }

    return cards.join('\n');
  }

  getRelatedThemes(currentTheme) {
    const themeGroups = {
      love_and_romance: ['friendship', 'emotional_quotes', 'heart_touching_quotes'],
      motivation_and_success: ['inspirational_quotes', 'confidence_quotes', 'life_quotes'],
      friendship: ['love_and_romance', 'emotional_quotes', 'happy_quotes'],
      festival_wishes: ['birthday_special', 'anniversary_wishes', 'celebration']
    };

    return themeGroups[currentTheme] || ['motivation_and_success', 'love_and_romance', 'friendship'];
  }

  getCardIcon(theme) {
    const icons = {
      love_and_romance: '❤️', friendship: '👫', motivation_and_success: '🚀',
      birthday_special: '🎂', festival_wishes: '🎉', emotional_quotes: '💝',
      inspirational_quotes: '⭐', heart_touching_quotes: '💖'
    };
    return icons[theme] || '✨';
  }

  formatThemeName(theme) {
    return theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getThemeDescription(theme, language, platform) {
    const descriptions = {
      love_and_romance: `Beautiful romantic content in ${this.formatLanguage(language)} perfect for expressing love through ${this.formatPlatform(platform)}.`,
      friendship: `Heartwarming friendship quotes and messages to celebrate the bond of true friendship.`,
      motivation_and_success: `Powerful motivational content to inspire success and personal growth.`,
      birthday_special: `Special birthday wishes and quotes to make celebrations memorable.`,
      festival_wishes: `Festive greetings and wishes for all special occasions and celebrations.`
    };
    return descriptions[theme] || `Engaging ${this.formatLanguage(language)} content for ${this.formatPlatform(platform)}.`;
  }

  getFilePath(pageData) {
    const { slug, dimensions } = pageData;

    // Create organized directory structure
    const category = dimensions.theme.replace(/_/g, '-');
    const language = dimensions.language;

    return path.join(
      this.outputDir,
      'content-types',
      category,
      language,
      `${slug}.html`
    );
  }

  formatCategory(theme) {
    return theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatLanguage(language) {
    return language.charAt(0).toUpperCase() + language.slice(1);
  }

  formatPlatform(platform) {
    return platform.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  generateQuickLinksSection(pageData) {
    // Get internal links for this page
    const links = this.internalLinks.get(pageData.slug);

    if (!links || links.length === 0) {
      return '<!-- No quick links available -->';
    }

    // Use the linking system to generate HTML
    return this.linkingSystem.generateQuickLinksHTML(links, pageData.dimensions.theme);
  }

  async generateSitemap() {
    console.log('🗺️ Generating sitemap...');

    const sitemapPath = path.join(this.outputDir, 'sitemap.xml');
    const baseUrl = 'https://texttoreels.in';

    // Get all generated pages
    const pages = await Page.find({ status: 'generated', isActive: true })
      .select('slug updatedAt')
      .lean();

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

    for (const page of pages) {
      sitemapContent += `  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${page.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    sitemapContent += '</urlset>';

    await fs.writeFile(sitemapPath, sitemapContent, 'utf8');
    console.log(`✅ Sitemap generated with ${pages.length} URLs`);
  }

  async generateRobotsTxt() {
    console.log('🤖 Generating robots.txt...');

    const robotsContent = `User-agent: *
Allow: /

Sitemap: https://texttoreels.in/sitemap.xml

# TextToReels.in - AI Video Generator
# Allow crawling of all content for better SEO
`;

    await fs.writeFile(path.join(this.outputDir, 'robots.txt'), robotsContent, 'utf8');
    console.log('✅ robots.txt generated');
  }

  async generateNetlifyConfig() {
    console.log('⚙️ Generating Netlify configuration...');

    const netlifyConfig = `# Netlify configuration for TextToReels.in
# Optimized for SEO and performance

# Redirects and headers
[[redirects]]
  from = "/old-path/*"
  to = "/new-path/:splat"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=1800"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

# Build settings
[build]
  publish = "${this.outputDir}"
  command = "echo 'Static site ready for deployment'"

# Environment
[build.environment]
  NODE_VERSION = "18"
`;

    await fs.writeFile(path.join(this.outputDir, 'netlify.toml'), netlifyConfig, 'utf8');
    console.log('✅ Netlify configuration generated');
  }

  async cleanup() {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('✅ Database disconnected');
    }
  }

  async getStats() {
    const totalPages = await Page.countDocuments({ status: 'generated', isActive: true });
    const byLanguage = await Page.aggregate([
      { $match: { status: 'generated', isActive: true } },
      { $group: { _id: '$dimensions.language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byTheme = await Page.aggregate([
      { $match: { status: 'generated', isActive: true } },
      { $group: { _id: '$dimensions.theme', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return { totalPages, byLanguage, byTheme };
  }
}

// Main execution function
async function generateStaticSite(options = {}) {
  const generator = new StaticSiteGenerator(options);

  try {
    await generator.initialize();

    // Get database stats
    const stats = await generator.getStats();
    console.log('\n📊 Database Stats:');
    console.log(`   Total Pages: ${stats.totalPages.toLocaleString()}`);
    console.log(`   Top Languages:`, stats.byLanguage.slice(0, 5));
    console.log(`   Top Themes:`, stats.byTheme.slice(0, 5));

    // Generate pages
    const result = await generator.generatePages(options);

    // Generate supporting files
    await generator.generateSitemap();
    await generator.generateRobotsTxt();
    await generator.generateNetlifyConfig();

    console.log('\n🎉 Static Site Generation Complete!');
    console.log(`📁 Output Directory: ${generator.outputDir}`);
    console.log(`🌐 Ready for deployment to Netlify`);

    return result;

  } catch (error) {
    console.error('❌ Error generating static site:', error);
    throw error;
  } finally {
    await generator.cleanup();
  }
}

module.exports = {
  StaticSiteGenerator,
  generateStaticSite
};

// Run if called directly
if (require.main === module) {
  const options = {
    limit: parseInt(process.argv[2]) || 10000,
    prioritizeHighTraffic: true,
    // Limit to high-traffic languages for Netlify free plan
    languages: ['hindi', 'english', 'punjabi'],
    themes: ['love_and_romance', 'motivation_and_success', 'friendship', 'festival_wishes']
  };

  generateStaticSite(options)
    .then(result => {
      console.log('✅ Success:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}