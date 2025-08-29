#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:6000';
const OUTPUT_DIR = path.join(__dirname, '..', 'netlify-deploy');
const MAX_PAGES = 10000; // Netlify-friendly limit

// Priority themes for initial deployment
const PRIORITY_THEMES = [
  'love_quotes',
  'motivational_quotes',
  'good_morning',
  'birthday_wishes',
  'friendship_quotes',
  'hindi_shayari'
];

const PRIORITY_LANGUAGES = ['hindi', 'english'];
const PRIORITY_PLATFORMS = ['instagram_reel', 'youtube_shorts', 'whatsapp_status'];

async function createDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function generatePageHTML(pageData) {
  const { content, seo, dimensions } = pageData;
  
  return `<!DOCTYPE html>
<html lang="${dimensions.language === 'hindi' ? 'hi' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.metaTitle}</title>
    <meta name="description" content="${seo.metaDescription}">
    <meta name="keywords" content="${seo.keywords.join(', ')}">
    <link rel="canonical" href="https://texttoreels.in/content/${pageData.slug}/">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.metaTitle}">
    <meta property="og:description" content="${seo.metaDescription}">
    <meta property="og:url" content="https://texttoreels.in/content/${pageData.slug}/">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="TextToReels.in">
    
    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a202c; background: #f7fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 0; text-align: center; margin-bottom: 3rem; }
        .header h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
        .content { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); margin-bottom: 2rem; }
        .features { list-style: none; margin: 2rem 0; }
        .features li { padding: 0.75rem 0; padding-left: 2rem; position: relative; color: #4a5568; }
        .features li:before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
        .example { background: #f7fafc; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea; margin: 1rem 0; font-style: italic; color: #4a5568; }
        .footer { background: #1a202c; color: #e2e8f0; padding: 2rem 0; text-align: center; margin-top: 3rem; }
        .cta { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; display: inline-block; margin: 2rem 0; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${content.heading}</h1>
            <p>${content.description}</p>
        </div>
    </div>
    <div class="container">
        <div class="content">
            <h2>Key Features</h2>
            <ul class="features">
                ${content.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <h2>Content Examples</h2>
            <div class="examples">
                ${content.examples.map(example => `<div class="example">"${example}"</div>`).join('')}
            </div>
            <div style="text-align: center;">
                <a href="/explore/" class="cta">${content.callToAction}</a>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="container">
            <p>&copy; 2024 TextToReels.in - Premium AI-powered content generation</p>
        </div>
    </div>
</body>
</html>`;
}

async function fetchPriorityPages() {
  console.log('🎯 Fetching priority pages for Netlify deployment...');
  
  const allPages = [];
  
  for (const theme of PRIORITY_THEMES) {
    for (const language of PRIORITY_LANGUAGES) {
      for (const platform of PRIORITY_PLATFORMS) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/pages`, {
            params: {
              theme,
              language,
              platform,
              limit: Math.floor(MAX_PAGES / (PRIORITY_THEMES.length * PRIORITY_LANGUAGES.length * PRIORITY_PLATFORMS.length))
            }
          });
          
          if (response.data.success && response.data.data.pages) {
            allPages.push(...response.data.data.pages);
            console.log(`✅ ${theme} + ${language} + ${platform}: ${response.data.data.pages.length} pages`);
          }
        } catch (error) {
          console.error(`❌ Error fetching ${theme} + ${language} + ${platform}:`, error.message);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
  
  // Remove duplicates and limit to MAX_PAGES
  const uniquePages = allPages.filter((page, index, self) => 
    index === self.findIndex(p => p.slug === page.slug)
  );
  
  return uniquePages.slice(0, MAX_PAGES);
}

async function generateSelectiveStaticSites() {
  console.log('🚀 Starting selective static site generation for Netlify...');
  console.log(`Max pages: ${MAX_PAGES}`);
  
  // Create output directory
  await createDirectory(OUTPUT_DIR);
  await createDirectory(path.join(OUTPUT_DIR, 'content'));
  
  // Fetch priority pages
  const pages = await fetchPriorityPages();
  console.log(`📄 Selected ${pages.length} priority pages`);
  
  if (pages.length === 0) {
    console.log('❌ No pages found. Exiting.');
    return;
  }
  
  let successful = 0;
  let failed = 0;
  
  // Generate HTML for each page
  for (const [index, page] of pages.entries()) {
    try {
      const html = await generatePageHTML(page);
      const filePath = path.join(OUTPUT_DIR, 'content', `${page.slug}.html`);
      
      await fs.writeFile(filePath, html, 'utf8');
      successful++;
      
      if ((index + 1) % 100 === 0) {
        console.log(`📈 Progress: ${index + 1}/${pages.length} pages generated`);
      }
    } catch (error) {
      console.error(`❌ Error generating ${page.slug}:`, error.message);
      failed++;
    }
  }
  
  // Generate Netlify-specific files
  await generateNetlifyConfig(pages);
  await generateNetlifyRedirects(pages);
  
  console.log('✅ Selective static site generation complete!');
  console.log(`📊 Stats: ${successful} successful, ${failed} failed`);
  console.log(`📁 Files generated in: ${OUTPUT_DIR}`);
  console.log(`🌐 Ready for Netlify deployment!`);
}

async function generateNetlifyConfig(pages) {
  const netlifyToml = `[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/content/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[redirects]]
  from = "/api/*"
  to = "https://api.texttoreels.in/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'netlify.toml'), netlifyToml, 'utf8');
  console.log('📝 Generated netlify.toml');
}

async function generateNetlifyRedirects(pages) {
  const redirects = pages.map(page => 
    `/content/${page.slug} /content/${page.slug}.html 200`
  ).join('\n');
  
  await fs.writeFile(path.join(OUTPUT_DIR, '_redirects'), redirects, 'utf8');
  console.log('🔀 Generated _redirects file');
}

// Main execution
if (require.main === module) {
  generateSelectiveStaticSites().catch(error => {
    console.error('❌ Selective generation failed:', error);
    process.exit(1);
  });
}

module.exports = { generateSelectiveStaticSites };