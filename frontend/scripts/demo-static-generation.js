#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:6000';
const OUTPUT_DIR = path.join(__dirname, '..', 'demo-static');
const DEMO_LIMIT = 100; // Generate 100 pages for demo

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
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.metaTitle}">
    <meta name="twitter:description" content="${seo.metaDescription}">
    
    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            color: #1a202c;
            background: #f7fafc;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem 1rem; 
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 0;
            text-align: center;
            margin-bottom: 3rem;
        }
        .header h1 {
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
        }
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 800px;
            margin: 0 auto;
        }
        .content {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
        }
        .features {
            list-style: none;
            margin: 2rem 0;
        }
        .features li {
            padding: 0.75rem 0;
            padding-left: 2rem;
            position: relative;
            color: #4a5568;
        }
        .features li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }
        .examples {
            margin: 2rem 0;
        }
        .example {
            background: #f7fafc;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin: 1rem 0;
            font-style: italic;
            color: #4a5568;
        }
        .footer {
            background: #1a202c;
            color: #e2e8f0;
            padding: 2rem 0;
            text-align: center;
            margin-top: 3rem;
        }
        .cta {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin: 2rem 0;
            font-weight: 600;
            transition: transform 0.2s ease;
        }
        .cta:hover {
            transform: translateY(-2px);
        }
        .meta-info {
            background: #edf2f7;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-size: 0.9rem;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        .tag {
            background: #667eea;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
        }
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
            <div class="meta-info">
                <strong>Platform:</strong> ${dimensions.platform.replace(/_/g, ' ')} | 
                <strong>Language:</strong> ${dimensions.language} | 
                <strong>Style:</strong> ${dimensions.style.replace(/_/g, ' ')} |
                <strong>Audience:</strong> ${dimensions.audience.replace(/_/g, ' ')}
            </div>
            
            <h2>Key Features</h2>
            <ul class="features">
                ${content.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            
            <h2>Content Examples</h2>
            <div class="examples">
                ${content.examples.map(example => `<div class="example">"${example}"</div>`).join('')}
            </div>
            
            <h2>SEO Tags</h2>
            <div class="tags">
                ${seo.keywords.map(keyword => `<span class="tag">${keyword}</span>`).join('')}
            </div>
            
            <div style="text-align: center;">
                <a href="/explore/" class="cta">${content.callToAction}</a>
            </div>
            
            <p style="margin-top: 2rem; color: #718096; text-align: center;">
                ${content.footerText}
            </p>
        </div>
    </div>
    
    <div class="footer">
        <div class="container">
            <p>&copy; 2024 TextToReels.in - Premium AI-powered content generation</p>
            <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.7;">
                Generated by TextToReels.in Static Site Generator
            </p>
        </div>
    </div>
    
    <!-- Analytics placeholder -->
    <script>
        console.log('Page loaded:', '${pageData.slug}');
        // Add your analytics tracking here
    </script>
</body>
</html>`;
}

async function generateDemoStaticSites() {
  console.log('🚀 Starting demo static site generation...');
  console.log(`Generating ${DEMO_LIMIT} demo pages...`);
  
  // Create output directory
  await createDirectory(OUTPUT_DIR);
  await createDirectory(path.join(OUTPUT_DIR, 'content'));
  
  try {
    // Fetch sample pages
    const response = await axios.get(`${BACKEND_URL}/api/pages?limit=${DEMO_LIMIT}`);
    
    if (!response.data.success || !response.data.data.pages) {
      throw new Error('Failed to fetch pages');
    }
    
    const pages = response.data.data.pages;
    console.log(`📄 Fetched ${pages.length} pages from API`);
    
    let successful = 0;
    let failed = 0;
    
    // Generate HTML for each page
    for (const [index, page] of pages.entries()) {
      try {
        const html = await generatePageHTML(page);
        const filePath = path.join(OUTPUT_DIR, 'content', `${page.slug}.html`);
        
        await fs.writeFile(filePath, html, 'utf8');
        successful++;
        
        if ((index + 1) % 10 === 0) {
          console.log(`📈 Progress: ${index + 1}/${pages.length} pages generated`);
        }
      } catch (error) {
        console.error(`❌ Error generating ${page.slug}:`, error.message);
        failed++;
      }
    }
    
    // Generate index.html
    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Static Site - TextToReels.in</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1 { color: #667eea; }
        .stats { background: #f7fafc; padding: 1rem; border-radius: 8px; margin: 2rem 0; }
        .page-list { list-style: none; padding: 0; }
        .page-list li { margin: 0.5rem 0; }
        .page-list a { color: #667eea; text-decoration: none; }
        .page-list a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>🚀 TextToReels.in Demo Static Site</h1>
    
    <div class="stats">
        <h3>Generation Statistics</h3>
        <p><strong>Total pages generated:</strong> ${successful}</p>
        <p><strong>Failed:</strong> ${failed}</p>
        <p><strong>Success rate:</strong> ${((successful / pages.length) * 100).toFixed(1)}%</p>
    </div>
    
    <h3>Sample Generated Pages</h3>
    <ul class="page-list">
        ${pages.slice(0, 20).map(page => 
          `<li><a href="/content/${page.slug}.html">${page.content.heading}</a></li>`
        ).join('')}
    </ul>
    
    <p><em>This is a demo of the static site generation system. In production, all 1M+ pages would be generated.</em></p>
</body>
</html>`;
    
    await fs.writeFile(path.join(OUTPUT_DIR, 'index.html'), indexHTML, 'utf8');
    
    console.log('✅ Demo static site generation complete!');
    console.log(`📊 Stats: ${successful} successful, ${failed} failed`);
    console.log(`📁 Files generated in: ${OUTPUT_DIR}`);
    console.log(`🌐 Open ${OUTPUT_DIR}/index.html to view the demo`);
    
  } catch (error) {
    console.error('❌ Error during demo generation:', error.message);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  generateDemoStaticSites().catch(error => {
    console.error('❌ Demo generation failed:', error);
    process.exit(1);
  });
}

module.exports = { generateDemoStaticSites };