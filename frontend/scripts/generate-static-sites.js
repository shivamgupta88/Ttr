#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:6000';
const OUTPUT_DIR = path.join(__dirname, '..', 'out');
const BATCH_SIZE = 1000;
const MAX_CONCURRENT = 10;

// HTML template
const getHTMLTemplate = (pageData) => {
  const { content, seo, dimensions } = pageData;
  
  return `<!DOCTYPE html>
<html lang="${dimensions.language === 'hindi' ? 'hi' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.metaTitle}</title>
    <meta name="description" content="${seo.metaDescription}">
    <meta name="keywords" content="${seo.keywords.join(', ')}">
    <link rel="canonical" href="${seo.canonicalUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.metaTitle}">
    <meta property="og:description" content="${seo.metaDescription}">
    <meta property="og:url" content="${seo.canonicalUrl}">
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
                <a href="/" class="cta">Explore More Content</a>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <div class="container">
            <p>&copy; 2024 TextToReels.in - Premium AI-powered content generation</p>
        </div>
    </div>
    
    <!-- Analytics -->
    <script>
        // Add Google Analytics or other tracking here
    </script>
</body>
</html>`;
};

async function createDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function fetchPageData(slug) {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/pages/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error.message);
    return null;
  }
}

async function generateStaticPage(pageData) {
  const html = getHTMLTemplate(pageData);
  const filePath = path.join(OUTPUT_DIR, 'content', `${pageData.slug}.html`);
  
  await createDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, html, 'utf8');
  
  return filePath;
}

async function fetchAllSlugs() {
  try {
    console.log('Fetching all page slugs...');
    const response = await axios.get(`${BACKEND_URL}/api/pages?limit=1000000&fields=slug`);
    
    if (response.data.success) {
      const slugs = response.data.data.map(page => page.slug);
      console.log(`Found ${slugs.length} pages to generate`);
      return slugs;
    } else {
      throw new Error('Failed to fetch slugs');
    }
  } catch (error) {
    console.error('Error fetching slugs:', error.message);
    return [];
  }
}

async function processBatch(slugs, batchIndex) {
  console.log(`Processing batch ${batchIndex + 1} (${slugs.length} pages)...`);
  
  const promises = slugs.map(async (slug) => {
    try {
      const pageData = await fetchPageData(slug);
      if (pageData) {
        await generateStaticPage(pageData);
        return { success: true, slug };
      } else {
        return { success: false, slug, error: 'No data' };
      }
    } catch (error) {
      return { success: false, slug, error: error.message };
    }
  });
  
  const results = await Promise.all(promises);
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Batch ${batchIndex + 1} complete: ${successful} successful, ${failed} failed`);
  return results;
}

async function generateAllStaticSites() {
  console.log('🚀 Starting static site generation for all pages...');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  
  // Create output directory
  await createDirectory(OUTPUT_DIR);
  await createDirectory(path.join(OUTPUT_DIR, 'content'));
  
  // Fetch all slugs
  const allSlugs = await fetchAllSlugs();
  
  if (allSlugs.length === 0) {
    console.log('❌ No slugs found. Exiting.');
    return;
  }
  
  // Process in batches
  const totalBatches = Math.ceil(allSlugs.length / BATCH_SIZE);
  let totalSuccess = 0;
  let totalFailed = 0;
  
  console.log(`📊 Processing ${allSlugs.length} pages in ${totalBatches} batches of ${BATCH_SIZE}...`);
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, allSlugs.length);
    const batchSlugs = allSlugs.slice(start, end);
    
    const results = await processBatch(batchSlugs, i);
    
    const batchSuccess = results.filter(r => r.success).length;
    const batchFailed = results.filter(r => !r.success).length;
    
    totalSuccess += batchSuccess;
    totalFailed += batchFailed;
    
    // Progress update
    const progress = ((i + 1) / totalBatches * 100).toFixed(1);
    console.log(`📈 Progress: ${progress}% (${totalSuccess} generated, ${totalFailed} failed)`);
    
    // Small delay between batches to avoid overwhelming the server
    if (i < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('✅ Static site generation complete!');
  console.log(`📊 Final stats: ${totalSuccess} successful, ${totalFailed} failed`);
  console.log(`📁 Files generated in: ${OUTPUT_DIR}`);
}

// Main execution
if (require.main === module) {
  generateAllStaticSites().catch(error => {
    console.error('❌ Error during static site generation:', error);
    process.exit(1);
  });
}

module.exports = { generateAllStaticSites };