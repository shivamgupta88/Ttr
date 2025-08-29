const fs = require('fs').promises;
const path = require('path');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

class SEOEngine {
  constructor() {
    this.sitemapIndex = [];
    this.robotsTxt = '';
    this.structuredDataTemplates = {};
    this.maxUrlsPerSitemap = 50000; // Google's limit
  }
  
  /**
   * Generate comprehensive SEO assets for all pages
   */
  async generateAllSEOAssets(pages) {
    console.log('🔍 Generating comprehensive SEO assets...');
    
    try {
      // Generate multiple sitemaps (split for large volumes)
      const sitemaps = await this.generateSitemaps(pages);
      
      // Generate sitemap index
      const sitemapIndex = await this.generateSitemapIndex(sitemaps);
      
      // Generate robots.txt
      const robotsTxt = await this.generateRobotsTxt();
      
      // Generate structured data for each page type
      const structuredData = await this.generateStructuredData(pages);
      
      // Generate meta tag templates
      const metaTemplates = await this.generateMetaTemplates();
      
      console.log(`✅ SEO assets generated: ${sitemaps.length} sitemaps, robots.txt, structured data`);
      
      return {
        sitemaps,
        sitemapIndex,
        robotsTxt,
        structuredData,
        metaTemplates
      };
      
    } catch (error) {
      console.error('❌ SEO generation failed:', error);
      throw error;
    }
  }
  
  /**
   * Generate multiple sitemaps for large page counts
   */
  async generateSitemaps(pages) {
    const sitemaps = [];
    const totalPages = pages.length;
    const sitemapCount = Math.ceil(totalPages / this.maxUrlsPerSitemap);
    
    console.log(`📄 Creating ${sitemapCount} sitemaps for ${totalPages.toLocaleString()} pages...`);
    
    for (let i = 0; i < sitemapCount; i++) {
      const start = i * this.maxUrlsPerSitemap;
      const end = Math.min(start + this.maxUrlsPerSitemap, totalPages);
      const pagesBatch = pages.slice(start, end);
      
      const sitemapData = await this.generateSingleSitemap(pagesBatch, i + 1);
      const filename = `sitemap-${i + 1}.xml`;
      
      // Save sitemap file
      await this.saveSitemap(filename, sitemapData);
      
      sitemaps.push({
        filename,
        url: `https://texttoreels.in/${filename}`,
        pageCount: pagesBatch.length,
        data: sitemapData
      });
      
      if (i % 10 === 0) {
        console.log(`📝 Generated sitemap ${i + 1}/${sitemapCount}`);
      }
    }
    
    return sitemaps;
  }
  
  /**
   * Generate single sitemap XML
   */
  async generateSingleSitemap(pages, sitemapNumber) {
    const urlSet = {
      '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
      urlset: {
        '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        '@_xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        url: pages.map(page => this.generateSitemapUrl(page))
      }
    };
    
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      indentBy: '  ',
      suppressEmptyNode: true
    });
    
    return builder.build(urlSet);
  }
  
  /**
   * Generate sitemap URL entry
   */
  generateSitemapUrl(page) {
    const baseUrl = 'https://texttoreels.in';
    const lastmod = page.updatedAt || page.createdAt || new Date();
    
    // Determine priority based on page characteristics
    const priority = this.calculatePagePriority(page);
    
    // Determine change frequency
    const changefreq = this.determineChangeFrequency(page);
    
    return {
      loc: `${baseUrl}${page.seo?.canonicalUrl || `/${page.slug}`}`,
      lastmod: lastmod.toISOString().split('T')[0],
      changefreq,
      priority: priority.toFixed(1),
      // Add image sitemap if applicable
      ...(page.seo?.ogImage && {
        'image:image': {
          'image:loc': page.seo.ogImage,
          'image:title': page.content?.title || 'Generated Reel'
        }
      })
    };
  }
  
  /**
   * Calculate page priority based on content characteristics
   */
  calculatePagePriority(page) {
    let priority = 0.5; // Base priority
    
    // Higher priority for popular themes
    const popularThemes = ['love_quotes', 'motivational_quotes', 'birthday_wishes'];
    if (popularThemes.includes(page.dimensions?.theme)) {
      priority += 0.2;
    }
    
    // Higher priority for English and Hindi content
    if (['english', 'hindi'].includes(page.dimensions?.language)) {
      priority += 0.1;
    }
    
    // Higher priority for Instagram and YouTube content
    if (['instagram_reel', 'youtube_shorts'].includes(page.dimensions?.platform)) {
      priority += 0.1;
    }
    
    // Adjust based on performance
    if (page.performance?.views > 1000) {
      priority += 0.1;
    }
    
    return Math.min(1.0, priority);
  }
  
  /**
   * Determine change frequency based on page type
   */
  determineChangeFrequency(page) {
    // Static content pages change less frequently
    if (page.dimensions?.theme?.includes('quote')) {
      return 'monthly';
    }
    
    // Trending content changes more frequently
    if (page.dimensions?.style?.includes('trending')) {
      return 'weekly';
    }
    
    return 'monthly';
  }
  
  /**
   * Generate sitemap index file
   */
  async generateSitemapIndex(sitemaps) {
    const sitemapIndex = {
      '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
      sitemapindex: {
        '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        sitemap: sitemaps.map(sitemap => ({
          loc: sitemap.url,
          lastmod: new Date().toISOString().split('T')[0]
        }))
      }
    };
    
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      indentBy: '  '
    });
    
    const indexXml = builder.build(sitemapIndex);
    
    // Save sitemap index
    await this.saveSitemap('sitemap-index.xml', indexXml);
    
    return indexXml;
  }
  
  /**
   * Generate robots.txt with optimized settings
   */
  async generateRobotsTxt() {
    const robotsTxt = `# Robots.txt for TextToReels.in
# Generated automatically for optimal SEO

User-agent: *
Allow: /

# Sitemaps
Sitemap: https://texttoreels.in/sitemap-index.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block access to admin and API endpoints
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

# Allow specific bots full access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block aggressive crawlers
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10

User-agent: DotBot
Disallow: /

# Additional sitemap references for different content types
Sitemap: https://texttoreels.in/sitemap-1.xml
Sitemap: https://texttoreels.in/sitemap-2.xml`;
    
    // Save robots.txt
    await fs.writeFile(path.join(__dirname, '../../public/robots.txt'), robotsTxt);
    
    return robotsTxt;
  }
  
  /**
   * Generate structured data for different page types
   */
  async generateStructuredData(pages) {
    const structuredDataTypes = {};
    
    // Group pages by type for structured data generation
    const pagesByType = this.groupPagesByType(pages);
    
    // Generate structured data for each type
    for (const [type, typePages] of Object.entries(pagesByType)) {
      structuredDataTypes[type] = this.generateStructuredDataForType(type, typePages);
    }
    
    return structuredDataTypes;
  }
  
  /**
   * Group pages by type for structured data
   */
  groupPagesByType(pages) {
    const groups = {};
    
    pages.forEach(page => {
      const type = `${page.dimensions?.theme}_${page.dimensions?.platform}`;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(page);
    });
    
    return groups;
  }
  
  /**
   * Generate structured data for specific page type
   */
  generateStructuredDataForType(type, pages) {
    const [theme, platform] = type.split('_');
    const samplePage = pages[0];
    
    // Base structured data
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': `${this.humanize(theme)} Reel Generator`,
      'description': `Create beautiful ${this.humanize(theme)} reels for ${this.humanize(platform)}`,
      'url': 'https://texttoreels.in',
      'applicationCategory': 'MultimediaApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'INR'
      },
      'author': {
        '@type': 'Organization',
        'name': 'TextToReels'
      }
    };
    
    // Add FAQ structured data for popular themes
    if (['love_quotes', 'motivational_quotes', 'birthday_wishes'].includes(theme)) {
      baseStructuredData['@graph'] = [
        baseStructuredData,
        {
          '@type': 'FAQPage',
          'mainEntity': this.generateFAQsForTheme(theme)
        }
      ];
    }
    
    return baseStructuredData;
  }
  
  /**
   * Generate FAQs for specific theme
   */
  generateFAQsForTheme(theme) {
    const faqMap = {
      love_quotes: [
        {
          question: 'How to create love quote reels?',
          answer: 'Use our love quote reel generator to create beautiful romantic content for Instagram and other platforms.'
        },
        {
          question: 'Are love quote reels free to create?',
          answer: 'Yes, you can create love quote reels for free with our generator.'
        }
      ],
      motivational_quotes: [
        {
          question: 'How to make motivational reels?',
          answer: 'Our motivational quote generator helps you create inspiring reels with professional templates.'
        },
        {
          question: 'What makes a good motivational reel?',
          answer: 'Good motivational reels have clear text, inspiring messages, and engaging visual design.'
        }
      ]
    };
    
    const faqs = faqMap[theme] || [];
    
    return faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }));
  }
  
  /**
   * Generate meta tag templates for different page types
   */
  async generateMetaTemplates() {
    const templates = {
      // Base template
      base: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1',
        robots: 'index, follow, max-snippet:-1, max-image-preview:large',
        googlebot: 'index, follow',
        'theme-color': '#1f2937'
      },
      
      // Social media templates
      openGraph: {
        'og:type': 'website',
        'og:site_name': 'TextToReels',
        'og:locale': 'en_IN'
      },
      
      twitter: {
        'twitter:card': 'summary_large_image',
        'twitter:site': '@texttoreels',
        'twitter:creator': '@texttoreels'
      },
      
      // Technical SEO
      technical: {
        'format-detection': 'telephone=no',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default'
      }
    };
    
    return templates;
  }
  
  /**
   * Save sitemap to file
   */
  async saveSitemap(filename, content) {
    const publicDir = path.join(__dirname, '../../public');
    
    // Ensure public directory exists
    try {
      await fs.mkdir(publicDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    const filePath = path.join(publicDir, filename);
    await fs.writeFile(filePath, content);
  }
  
  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbs(page) {
    const breadcrumbs = [
      { name: 'Home', url: 'https://texttoreels.in' }
    ];
    
    if (page.dimensions?.theme) {
      breadcrumbs.push({
        name: this.humanize(page.dimensions.theme),
        url: `https://texttoreels.in/category/${page.dimensions.theme}`
      });
    }
    
    if (page.dimensions?.language) {
      breadcrumbs.push({
        name: this.humanize(page.dimensions.language),
        url: `https://texttoreels.in/language/${page.dimensions.language}`
      });
    }
    
    breadcrumbs.push({
      name: page.content?.title || 'Generate Reel',
      url: `https://texttoreels.in/${page.slug}`
    });
    
    return {
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': breadcrumb.name,
        'item': breadcrumb.url
      }))
    };
  }
  
  /**
   * Optimize meta descriptions for better CTR
   */
  optimizeMetaDescription(description, theme, language) {
    // Ensure optimal length (150-160 characters)
    let optimized = description;
    
    // Add call-to-action if not present
    const ctas = ['Try now!', 'Create yours today!', 'Free generator!'];
    const hasCTA = ctas.some(cta => optimized.toLowerCase().includes(cta.toLowerCase()));
    
    if (!hasCTA && optimized.length < 140) {
      optimized += ' Try now!';
    }
    
    // Add emotional keywords
    const emotionalKeywords = ['beautiful', 'stunning', 'amazing', 'perfect'];
    const hasEmotional = emotionalKeywords.some(keyword => 
      optimized.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!hasEmotional && optimized.length < 130) {
      optimized = optimized.replace('reels', 'beautiful reels');
    }
    
    // Ensure it's within limits
    if (optimized.length > 160) {
      optimized = optimized.substring(0, 157) + '...';
    }
    
    return optimized;
  }
  
  /**
   * Convert snake_case to human readable
   */
  humanize(str) {
    return str.replace(/_/g, ' ')
             .replace(/\b\w/g, c => c.toUpperCase());
  }
  
  /**
   * Generate comprehensive SEO report
   */
  async generateSEOReport(pages) {
    const report = {
      totalPages: pages.length,
      sitemaps: Math.ceil(pages.length / this.maxUrlsPerSitemap),
      languages: new Set(pages.map(p => p.dimensions?.language)).size,
      themes: new Set(pages.map(p => p.dimensions?.theme)).size,
      avgTitleLength: pages.reduce((acc, p) => acc + (p.content?.title?.length || 0), 0) / pages.length,
      avgDescLength: pages.reduce((acc, p) => acc + (p.seo?.metaDescription?.length || 0), 0) / pages.length,
      pagesWithImages: pages.filter(p => p.seo?.ogImage).length,
      structuredDataTypes: new Set(pages.map(p => `${p.dimensions?.theme}_${p.dimensions?.platform}`)).size
    };
    
    console.log('📊 SEO Report:', report);
    return report;
  }
}

module.exports = SEOEngine;