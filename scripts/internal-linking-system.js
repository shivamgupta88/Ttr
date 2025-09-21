const mongoose = require('mongoose');
const Page = require('../src/models/Page');

/**
 * Internal Linking System for SEO Optimization
 *
 * Creates strategic internal links between pages to improve:
 * 1. Google PageRank distribution
 * 2. Crawl discoverability
 * 3. User engagement and session duration
 * 4. Topic relevance and authority
 */

class InternalLinkingSystem {
  constructor(options = {}) {
    this.options = {
      linksPerPage: options.linksPerPage || 12, // 12 quick links per page
      maxLinkDistance: options.maxLinkDistance || 3, // Max hops between pages
      prioritizeRelated: options.prioritizeRelated !== false,
      includeHighTraffic: options.includeHighTraffic !== false,
      ...options
    };

    this.linkingStrategy = 'cluster_based'; // cluster_based, random, or topic_based
    this.pageGraph = new Map(); // Page interconnection graph
  }

  async initialize() {
    console.log('🔗 Initializing Internal Linking System...');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/texttoreels', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Database connected');
  }

  async generateLinkingStrategy() {
    console.log('🎯 Generating strategic internal linking...');

    // Get all pages
    const allPages = await Page.find({ status: 'generated', isActive: true })
      .select('slug dimensions.theme dimensions.language dimensions.platform seo.metaTitle')
      .lean();

    console.log(`📊 Found ${allPages.length.toLocaleString()} pages for linking`);

    // Create page clusters for better organization
    const clusters = this.createPageClusters(allPages);
    console.log(`🎨 Created ${Object.keys(clusters).length} content clusters`);

    // Generate links for each page
    const linkingMap = new Map();

    for (const page of allPages) {
      const links = await this.generateLinksForPage(page, allPages, clusters);
      linkingMap.set(page.slug, links);
    }

    console.log(`🔗 Generated internal links for ${linkingMap.size.toLocaleString()} pages`);
    return linkingMap;
  }

  createPageClusters(pages) {
    const clusters = {};

    // Group by theme-language combination for better relevance
    for (const page of pages) {
      const clusterKey = `${page.dimensions.theme}_${page.dimensions.language}`;

      if (!clusters[clusterKey]) {
        clusters[clusterKey] = {
          key: clusterKey,
          theme: page.dimensions.theme,
          language: page.dimensions.language,
          pages: [],
          priority: this.getClusterPriority(page.dimensions.theme, page.dimensions.language)
        };
      }

      clusters[clusterKey].pages.push(page);
    }

    // Sort pages within clusters by relevance
    for (const cluster of Object.values(clusters)) {
      cluster.pages.sort((a, b) => {
        // Prioritize Instagram Reels and WhatsApp Status (high traffic)
        const platformPriority = {
          'instagram_reels': 4,
          'whatsapp_status': 3,
          'youtube_shorts': 2,
          'facebook_stories': 1
        };

        return (platformPriority[b.dimensions.platform] || 0) - (platformPriority[a.dimensions.platform] || 0);
      });
    }

    return clusters;
  }

  getClusterPriority(theme, language) {
    // High-traffic combinations get higher priority
    const themePriority = {
      'love_and_romance': 10,
      'motivation_and_success': 9,
      'friendship': 8,
      'festival_wishes': 7,
      'birthday_special': 6
    };

    const languagePriority = {
      'hindi': 10,
      'english': 9,
      'punjabi': 8,
      'gujarati': 7,
      'marathi': 6
    };

    return (themePriority[theme] || 5) + (languagePriority[language] || 5);
  }

  async generateLinksForPage(currentPage, allPages, clusters) {
    const links = [];
    const currentCluster = `${currentPage.dimensions.theme}_${currentPage.dimensions.language}`;

    // Strategy 1: Same cluster links (40% of links) - highest relevance
    const sameClusterLinks = this.getSameClusterLinks(currentPage, clusters[currentCluster], 5);
    links.push(...sameClusterLinks);

    // Strategy 2: Related theme links (30% of links) - cross-theme discovery
    const relatedThemeLinks = this.getRelatedThemeLinks(currentPage, clusters, 3);
    links.push(...relatedThemeLinks);

    // Strategy 3: Same language, different theme (20% of links) - language consistency
    const sameLanguageLinks = this.getSameLanguageLinks(currentPage, clusters, 2);
    links.push(...sameLanguageLinks);

    // Strategy 4: High-traffic pages (10% of links) - authority boost
    const highTrafficLinks = this.getHighTrafficLinks(currentPage, clusters, 2);
    links.push(...highTrafficLinks);

    // Remove duplicates and current page
    const uniqueLinks = this.deduplicateLinks(links, currentPage.slug);

    return uniqueLinks.slice(0, this.options.linksPerPage);
  }

  getSameClusterLinks(currentPage, cluster, count) {
    if (!cluster || !cluster.pages) return [];

    return cluster.pages
      .filter(page => page.slug !== currentPage.slug)
      .slice(0, count)
      .map(page => ({
        slug: page.slug,
        title: this.cleanTitle(page.seo.metaTitle),
        theme: page.dimensions.theme,
        language: page.dimensions.language,
        platform: page.dimensions.platform,
        relevance: 'high', // Same cluster = high relevance
        linkType: 'same_cluster'
      }));
  }

  getRelatedThemeLinks(currentPage, clusters, count) {
    const relatedThemes = this.getRelatedThemes(currentPage.dimensions.theme);
    const links = [];

    for (const theme of relatedThemes) {
      const clusterKey = `${theme}_${currentPage.dimensions.language}`;
      const cluster = clusters[clusterKey];

      if (cluster && cluster.pages.length > 0) {
        const page = cluster.pages[0]; // Take the best page from related cluster
        links.push({
          slug: page.slug,
          title: this.cleanTitle(page.seo.metaTitle),
          theme: page.dimensions.theme,
          language: page.dimensions.language,
          platform: page.dimensions.platform,
          relevance: 'medium',
          linkType: 'related_theme'
        });
      }

      if (links.length >= count) break;
    }

    return links;
  }

  getRelatedThemes(currentTheme) {
    const themeRelations = {
      'love_and_romance': ['friendship', 'emotional_quotes', 'heart_touching_quotes', 'anniversary_wishes'],
      'motivation_and_success': ['inspirational_quotes', 'confidence_quotes', 'life_quotes', 'positive_quotes'],
      'friendship': ['love_and_romance', 'emotional_quotes', 'happy_quotes', 'loyalty_quotes'],
      'festival_wishes': ['birthday_special', 'anniversary_wishes', 'celebration_quotes', 'family_quotes'],
      'birthday_special': ['festival_wishes', 'celebration_quotes', 'happy_quotes', 'anniversary_wishes'],
      'good_morning': ['positive_quotes', 'motivational_quotes', 'life_quotes', 'inspirational_quotes'],
      'good_night': ['peaceful_quotes', 'calm_quotes', 'love_quotes', 'sweet_dreams']
    };

    return themeRelations[currentTheme] || ['love_and_romance', 'motivation_and_success', 'friendship'];
  }

  getSameLanguageLinks(currentPage, clusters, count) {
    const links = [];
    const currentLanguage = currentPage.dimensions.language;

    // Get different themes in same language
    const languageClusters = Object.values(clusters)
      .filter(cluster =>
        cluster.language === currentLanguage &&
        cluster.theme !== currentPage.dimensions.theme
      )
      .sort((a, b) => b.priority - a.priority);

    for (const cluster of languageClusters) {
      if (cluster.pages.length > 0) {
        const page = cluster.pages[0];
        links.push({
          slug: page.slug,
          title: this.cleanTitle(page.seo.metaTitle),
          theme: page.dimensions.theme,
          language: page.dimensions.language,
          platform: page.dimensions.platform,
          relevance: 'medium',
          linkType: 'same_language'
        });
      }

      if (links.length >= count) break;
    }

    return links;
  }

  getHighTrafficLinks(currentPage, clusters, count) {
    // Get high-priority clusters (high-traffic combinations)
    const highTrafficClusters = Object.values(clusters)
      .filter(cluster => cluster.priority >= 15) // High priority threshold
      .sort((a, b) => b.priority - a.priority);

    const links = [];

    for (const cluster of highTrafficClusters) {
      if (cluster.pages.length > 0) {
        const page = cluster.pages[0];

        // Don't link to same page or same cluster
        if (page.slug !== currentPage.slug &&
            cluster.key !== `${currentPage.dimensions.theme}_${currentPage.dimensions.language}`) {
          links.push({
            slug: page.slug,
            title: this.cleanTitle(page.seo.metaTitle),
            theme: page.dimensions.theme,
            language: page.dimensions.language,
            platform: page.dimensions.platform,
            relevance: 'high',
            linkType: 'high_traffic'
          });
        }
      }

      if (links.length >= count) break;
    }

    return links;
  }

  deduplicateLinks(links, currentSlug) {
    const seen = new Set([currentSlug]);
    return links.filter(link => {
      if (seen.has(link.slug)) {
        return false;
      }
      seen.add(link.slug);
      return true;
    });
  }

  cleanTitle(title) {
    return title
      .replace(' | TextToReels.in', '')
      .replace(' - Free AI Video Generator', '')
      .trim();
  }

  async saveLinkingData(linkingMap) {
    console.log('💾 Saving internal linking data...');

    const linkingData = {
      generated_at: new Date().toISOString(),
      total_pages: linkingMap.size,
      links_per_page: this.options.linksPerPage,
      strategy: this.linkingStrategy,
      links: Object.fromEntries(linkingMap)
    };

    // Save to file for use in static generation
    const fs = require('fs').promises;
    await fs.writeFile(
      './scripts/internal-links-data.json',
      JSON.stringify(linkingData, null, 2),
      'utf8'
    );

    console.log('✅ Internal linking data saved');
    return linkingData;
  }

  generateQuickLinksHTML(links, currentTheme) {
    if (!links || links.length === 0) return '';

    const themeIcon = this.getThemeIcon(currentTheme);
    const themeColor = this.getThemeColor(currentTheme);

    return `
    <!-- Quick Links Section for SEO -->
    <section class="quick-links-section" style="
      background: linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}08 100%);
      padding: 4rem 0;
      margin-top: 3rem;
      border-top: 1px solid ${themeColor}20;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <h3 style="
          text-align: center;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 2rem;
        ">
          ${themeIcon} Related Content & Quick Links
        </h3>

        <div class="quick-links-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        ">
          ${links.map(link => `
            <a href="/${link.slug}" class="quick-link-card" style="
              display: block;
              background: white;
              padding: 1.5rem;
              border-radius: 12px;
              text-decoration: none;
              color: #2d3748;
              border: 1px solid ${themeColor}20;
              transition: all 0.3s ease;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'; this.style.borderColor='${themeColor}50';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; this.style.borderColor='${themeColor}20';">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, ${themeColor} 0%, ${themeColor}80 100%);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 1.2rem;
                  flex-shrink: 0;
                ">${this.getThemeIcon(link.theme)}</div>
                <div style="flex: 1; min-width: 0;">
                  <h4 style="
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    line-height: 1.3;
                    color: #2d3748;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  ">${link.title}</h4>
                  <div style="
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-bottom: 0.5rem;
                  ">
                    <span style="
                      background: ${themeColor}15;
                      color: ${themeColor};
                      padding: 0.25rem 0.5rem;
                      border-radius: 6px;
                      font-size: 0.75rem;
                      font-weight: 500;
                    ">${this.formatLanguage(link.language)}</span>
                    <span style="
                      background: #edf2f7;
                      color: #4a5568;
                      padding: 0.25rem 0.5rem;
                      border-radius: 6px;
                      font-size: 0.75rem;
                      font-weight: 500;
                    ">${this.formatPlatform(link.platform)}</span>
                  </div>
                  <div style="
                    font-size: 0.8rem;
                    color: #718096;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                  ">
                    <span style="
                      width: 6px;
                      height: 6px;
                      background: ${link.relevance === 'high' ? '#48bb78' : '#ed8936'};
                      border-radius: 50%;
                    "></span>
                    ${link.relevance === 'high' ? 'Highly Related' : 'Related Content'}
                  </div>
                </div>
              </div>
            </a>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 2rem;">
          <a href="/explore" style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, ${themeColor} 0%, ${themeColor}80 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px ${themeColor}40';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            🔍 Explore More Content
          </a>
        </div>
      </div>
    </section>`;
  }

  getThemeIcon(theme) {
    const icons = {
      'love_and_romance': '❤️',
      'motivation_and_success': '🚀',
      'friendship': '👫',
      'festival_wishes': '🎉',
      'birthday_special': '🎂',
      'good_morning': '🌅',
      'good_night': '🌙',
      'inspirational_quotes': '⭐',
      'emotional_quotes': '💝',
      'happy_quotes': '😊',
      'life_quotes': '🌟',
      'positive_quotes': '✨'
    };
    return icons[theme] || '✨';
  }

  getThemeColor(theme) {
    const colors = {
      'love_and_romance': '#f093fb',
      'motivation_and_success': '#667eea',
      'friendship': '#4facfe',
      'festival_wishes': '#43e97b',
      'birthday_special': '#fa709a',
      'good_morning': '#ffecd2',
      'good_night': '#a8edea',
      'inspirational_quotes': '#667eea',
      'emotional_quotes': '#f093fb',
      'happy_quotes': '#fee140',
      'life_quotes': '#667eea',
      'positive_quotes': '#43e97b'
    };
    return colors[theme] || '#667eea';
  }

  formatLanguage(language) {
    return language.charAt(0).toUpperCase() + language.slice(1);
  }

  formatPlatform(platform) {
    return platform.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async cleanup() {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Main execution function
async function generateInternalLinks() {
  const linkingSystem = new InternalLinkingSystem();

  try {
    await linkingSystem.initialize();

    const linkingMap = await linkingSystem.generateLinkingStrategy();
    const linkingData = await linkingSystem.saveLinkingData(linkingMap);

    console.log('\n🎉 Internal Linking System Complete!');
    console.log(`🔗 Generated links for ${linkingData.total_pages.toLocaleString()} pages`);
    console.log(`📊 ${linkingData.links_per_page} links per page`);
    console.log(`💾 Data saved to internal-links-data.json`);

    return linkingData;

  } catch (error) {
    console.error('❌ Error generating internal links:', error);
    throw error;
  } finally {
    await linkingSystem.cleanup();
  }
}

module.exports = {
  InternalLinkingSystem,
  generateInternalLinks
};

// Run if called directly
if (require.main === module) {
  generateInternalLinks()
    .then(result => {
      console.log('✅ Success:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}