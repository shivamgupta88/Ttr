const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Fix Quick Links in all static HTML pages to point to actual existing pages
 */

// Available pages that actually exist
const REAL_PAGES = {
  'birthday-wishes': '/content-types/birthday-wishes/',
  'love-quotes': '/content-types/love-quotes/',
  'motivational-quotes': '/content-types/motivational-quotes/',
  'friendship-quotes': '/content-types/friendship-quotes/',
  'hindi-shayari': '/content-types/hindi-shayari/',
  'good-morning': '/content-types/good-morning/',
  'instagram-reels': '/platform/instagram-reels/',
  'youtube-shorts': '/platform/youtube-shorts/',
  'whatsapp-status': '/platform/whatsapp-status/',
  'facebook-stories': '/platform/facebook-stories/',
  'hindi': '/language/hindi/',
  'english': '/language/english/',
  'punjabi': '/language/punjabi/',
  'bengali': '/language/bengali/',
  'tamil': '/language/tamil/',
  'urdu': '/language/urdu/'
};

// Generate new Quick Links HTML with real URLs
function generateValidQuickLinks() {
  const links = [
    {
      emoji: '💕',
      title: 'Love Quotes & Romantic Shayari',
      subtitle: 'Express your feelings beautifully',
      url: '/content-types/love-quotes/',
      tag: 'Popular'
    },
    {
      emoji: '🔥',
      title: 'Motivational Quotes & Success Tips',
      subtitle: 'Inspire yourself and others',
      url: '/content-types/motivational-quotes/',
      tag: 'Trending'
    },
    {
      emoji: '🎂',
      title: 'Birthday Wishes & Celebrations',
      subtitle: 'Perfect wishes for special days',
      url: '/content-types/birthday-wishes/',
      tag: 'Featured'
    },
    {
      emoji: '👫',
      title: 'Friendship Quotes & Bonds',
      subtitle: 'Celebrate true friendship',
      url: '/content-types/friendship-quotes/',
      tag: 'Popular'
    },
    {
      emoji: '📜',
      title: 'Hindi Shayari & Poetry',
      subtitle: 'Beautiful Hindi expressions',
      url: '/content-types/hindi-shayari/',
      tag: 'Cultural'
    },
    {
      emoji: '🌅',
      title: 'Good Morning Messages',
      subtitle: 'Start your day with positivity',
      url: '/content-types/good-morning/',
      tag: 'Daily'
    },
    {
      emoji: '📱',
      title: 'Instagram Reels Creator',
      subtitle: 'Viral content for Instagram',
      url: '/platform/instagram-reels/',
      tag: 'Platform'
    },
    {
      emoji: '🎬',
      title: 'YouTube Shorts Generator',
      subtitle: 'Quick videos for YouTube',
      url: '/platform/youtube-shorts/',
      tag: 'Platform'
    },
    {
      emoji: '💬',
      title: 'WhatsApp Status Videos',
      subtitle: 'Perfect for status updates',
      url: '/platform/whatsapp-status/',
      tag: 'Platform'
    },
    {
      emoji: '🇮🇳',
      title: 'Hindi Content Templates',
      subtitle: 'Content in Hindi language',
      url: '/language/hindi/',
      tag: 'Language'
    },
    {
      emoji: '🌍',
      title: 'English Content Library',
      subtitle: 'Global English content',
      url: '/language/english/',
      tag: 'Language'
    },
    {
      emoji: '🎵',
      title: 'Punjabi Video Content',
      subtitle: 'Punjabi culture & music',
      url: '/language/punjabi/',
      tag: 'Language'
    }
  ];

  let html = `
    <!-- Quick Links Section -->
    <section style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 4rem 0; margin-top: 3rem;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <h2 style="text-align: center; font-size: 2rem; font-weight: 800; color: #2d3748; margin-bottom: 0.5rem;">
          ❤️ Related Content & <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Quick Links</span>
        </h2>
        <p style="text-align: center; color: #718096; margin-bottom: 3rem; font-size: 1.1rem;">
          Discover more amazing content templates and create viral videos instantly
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">`;

  links.forEach(link => {
    html += `
          <a href="${link.url}" style="background: white; padding: 1.5rem; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); transition: all 0.3s ease; display: block;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)';">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <span style="font-size: 2.5rem;">${link.emoji}</span>
              <div style="flex: 1;">
                <h3 style="color: #2d3748; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">${link.title}</h3>
                <p style="color: #718096; font-size: 0.9rem; margin: 0;">${link.subtitle}</p>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="background: ${getTagColor(link.tag)}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500;">${link.tag}</span>
              <span style="color: #667eea; font-weight: 600; font-size: 0.9rem;">Create Now →</span>
            </div>
          </a>`;
  });

  html += `
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <a href="/explore" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2.5rem; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 1.1rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            🚀 Explore All Templates
          </a>
        </div>
      </div>
    </section>`;

  return html;
}

function getTagColor(tag) {
  const colors = {
    'Popular': '#e53e3e',
    'Trending': '#dd6b20',
    'Featured': '#38a169',
    'Cultural': '#805ad5',
    'Daily': '#3182ce',
    'Platform': '#d69e2e',
    'Language': '#319795'
  };
  return colors[tag] || '#667eea';
}

async function fixAllQuickLinks() {
  console.log('🔧 Fixing Quick Links in all static pages...');

  const newQuickLinksHTML = generateValidQuickLinks();

  // Find all HTML files at root level (not in subdirectories)
  const htmlFiles = glob.sync('/Users/shivam/Development/ttr/*.html');

  let fixedCount = 0;

  for (const filePath of htmlFiles) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');

      // Skip if no Quick Links section found
      if (!content.includes('Quick Links')) {
        continue;
      }

      // Replace the Quick Links section
      const quickLinksRegex = /<!-- Quick Links Section -->[\s\S]*?<\/section>/;

      if (quickLinksRegex.test(content)) {
        content = content.replace(quickLinksRegex, newQuickLinksHTML.trim());
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
        console.log(`✅ Fixed: ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }

  console.log(`🎉 Fixed Quick Links in ${fixedCount} files`);
  console.log('📋 Now all Quick Links point to existing pages:');
  Object.entries(REAL_PAGES).forEach(([key, url]) => {
    console.log(`   ${url}`);
  });
}

// Run the fix
fixAllQuickLinks().catch(console.error);