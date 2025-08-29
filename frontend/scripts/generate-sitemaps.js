#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:6000';
const OUTPUT_DIR = path.join(__dirname, '..', 'public');
const SITE_URL = 'https://texttoreels.in';
const MAX_URLS_PER_SITEMAP = 50000; // Google's limit

async function createDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function fetchAllSlugs() {
  try {
    console.log('Fetching all page slugs for sitemap...');
    
    const allSlugs = [];
    const batchSize = 10000;
    let offset = 0;
    let hasMore = true;
    
    while (hasMore) {
      console.log(`Fetching batch at offset ${offset}...`);
      const response = await axios.get(`${BACKEND_URL}/api/pages?offset=${offset}&limit=${batchSize}&fields=slug`);
      
      if (response.data.success && response.data.data.pages && response.data.data.pages.length > 0) {
        const batchSlugs = response.data.data.pages.map(page => page.slug);
        allSlugs.push(...batchSlugs);
        
        console.log(`Added ${batchSlugs.length} slugs (total: ${allSlugs.length})`);
        
        if (batchSlugs.length < batchSize) {
          hasMore = false;
        } else {
          offset += batchSize;
        }
      } else {
        hasMore = false;
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Found ${allSlugs.length} total pages for sitemap`);
    return allSlugs;
  } catch (error) {
    console.error('Error fetching slugs:', error.message);
    return [];
  }
}

function generateSitemapXML(urls) {
  const urlsXML = urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/explore/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/search/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${urlsXML}
</urlset>`;
}

function generateSitemapIndexXML(sitemapFiles) {
  const sitemapsXML = sitemapFiles.map(filename => `
  <sitemap>
    <loc>${SITE_URL}/${filename}</loc>
  </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapsXML}
</sitemapindex>`;
}

async function generateSitemaps() {
  console.log('🗺️  Starting sitemap generation...');
  
  await createDirectory(OUTPUT_DIR);
  
  // Fetch all slugs
  const allSlugs = await fetchAllSlugs();
  
  if (allSlugs.length === 0) {
    console.log('❌ No slugs found. Exiting.');
    return;
  }
  
  // Convert slugs to full URLs
  const allUrls = allSlugs.map(slug => `${SITE_URL}/content/${slug}/`);
  
  // Split into multiple sitemaps if needed
  const sitemapFiles = [];
  const totalSitemaps = Math.ceil(allUrls.length / MAX_URLS_PER_SITEMAP);
  
  console.log(`📊 Generating ${totalSitemaps} sitemap files for ${allUrls.length} URLs...`);
  
  for (let i = 0; i < totalSitemaps; i++) {
    const start = i * MAX_URLS_PER_SITEMAP;
    const end = Math.min(start + MAX_URLS_PER_SITEMAP, allUrls.length);
    const sitemapUrls = allUrls.slice(start, end);
    
    const filename = totalSitemaps === 1 ? 'sitemap.xml' : `sitemap-${i + 1}.xml`;
    const sitemapXML = generateSitemapXML(sitemapUrls);
    
    const filePath = path.join(OUTPUT_DIR, filename);
    await fs.writeFile(filePath, sitemapXML, 'utf8');
    
    sitemapFiles.push(filename);
    console.log(`📄 Generated ${filename} with ${sitemapUrls.length} URLs`);
  }
  
  // Generate sitemap index if multiple sitemaps
  if (totalSitemaps > 1) {
    const sitemapIndexXML = generateSitemapIndexXML(sitemapFiles);
    const indexPath = path.join(OUTPUT_DIR, 'sitemap.xml');
    await fs.writeFile(indexPath, sitemapIndexXML, 'utf8');
    console.log('📋 Generated sitemap index: sitemap.xml');
  }
  
  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;
  
  const robotsPath = path.join(OUTPUT_DIR, 'robots.txt');
  await fs.writeFile(robotsPath, robotsTxt, 'utf8');
  console.log('🤖 Generated robots.txt');
  
  console.log('✅ Sitemap generation complete!');
  console.log(`📁 Files generated in: ${OUTPUT_DIR}`);
}

// Main execution
if (require.main === module) {
  generateSitemaps().catch(error => {
    console.error('❌ Error during sitemap generation:', error);
    process.exit(1);
  });
}

module.exports = { generateSitemaps };