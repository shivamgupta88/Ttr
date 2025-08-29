#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:6000';
const OUTPUT_DIR = path.join(__dirname, '..', 'out');
const BATCH_SIZE = 500;
const MAX_WORKERS = Math.min(os.cpus().length, 8);
const PROGRESS_INTERVAL = 1000; // Update progress every 1000 pages

// Worker thread code
if (!isMainThread) {
  const { pages, outputDir, backendUrl } = workerData;
  
  async function generatePageHTML(siteData) {
    // Extract data from the new MongoDB schema structure
    const {
      siteId,
      slug,
      metaTitle,
      location,
      propertyType,
      shortDescription,
      description,
      localities,
      quickLinks,
      sublocalities,
      keywords,
      faq,
      footer: footerData
    } = siteData;
    
    const locationString = `${location.city}, ${location.district}, ${location.state}`;
    const fullTitle = Array.isArray(metaTitle) ? metaTitle[0] : metaTitle;
    
    return `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullTitle} | Real Estate in ${locationString}</title>
    <meta name="description" content="${shortDescription}">
    <meta name="keywords" content="${keywords.join(', ')}, ${locationString}, ${propertyType}">
    <link rel="canonical" href="https://reeltor.com/${slug}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${fullTitle}">
    <meta property="og:description" content="${shortDescription}">
    <meta property="og:url" content="https://reeltor.com/${slug}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Reeltor.com">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${fullTitle}">
    <meta name="twitter:description" content="${shortDescription}">
    
    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico">
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Reeltor.com",
      "description": "${shortDescription}",
      "url": "https://reeltor.com/${slug}",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${location.city}",
        "addressRegion": "${location.state}",
        "addressCountry": "${location.country}",
        "postalCode": "${location.pinCode}"
      }
    }
    </script>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            color: #1a202c;
            background: #f8fafc;
        }
        
        /* Navigation Styles */
        .navbar {
            background: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 1rem 0;
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 1.8rem;
            font-weight: 900;
            color: #667eea;
            text-decoration: none;
        }
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        .nav-links a {
            text-decoration: none;
            color: #4a5568;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .nav-links a:hover {
            color: #667eea;
        }
        
        /* Main Content Styles */
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem 1rem; 
        }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
            margin-bottom: 3rem;
        }
        .hero h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 900;
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 800px;
            margin: 0 auto 2rem;
        }
        .location-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            margin-top: 1rem;
        }
        
        /* Content Cards */
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        .card h2 {
            color: #2d3748;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        /* Lists */
        .localities-grid, .sublocalities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            margin: 1rem 0;
        }
        .locality-item, .sublocality-item {
            background: #edf2f7;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            text-align: center;
            font-size: 0.9rem;
            color: #4a5568;
        }
        
        /* Quick Links */
        .quick-links {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 1rem 0;
        }
        .quick-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.3s ease;
        }
        .quick-link:hover {
            transform: scale(1.05);
        }
        
        /* FAQ Section */
        .faq-section {
            margin: 2rem 0;
        }
        .faq-item {
            background: white;
            margin: 1rem 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .faq-question {
            background: #f7fafc;
            padding: 1rem;
            font-weight: 600;
            color: #2d3748;
            cursor: pointer;
            position: relative;
        }
        .faq-question:after {
            content: '+';
            position: absolute;
            right: 1rem;
            font-size: 1.2rem;
        }
        .faq-answer {
            padding: 1rem;
            color: #4a5568;
            border-top: 1px solid #e2e8f0;
        }
        
        /* Footer Styles */
        .footer {
            background: #1a202c;
            color: #e2e8f0;
            padding: 3rem 0 2rem;
            margin-top: 4rem;
        }
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        .footer-section h3 {
            margin-bottom: 1rem;
            color: white;
        }
        .footer-links {
            list-style: none;
        }
        .footer-links li {
            margin: 0.5rem 0;
        }
        .footer-links a {
            color: #a0aec0;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .footer-links a:hover {
            color: #667eea;
        }
        .footer-bottom {
            text-align: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #2d3748;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            .container {
                padding: 1rem;
            }
            .content-grid {
                grid-template-columns: 1fr;
            }
            .hero {
                padding: 2rem 0;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">Reeltor.com</a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/properties">Properties</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="hero">
        <div class="container">
            <h1>${fullTitle}</h1>
            <p>${shortDescription}</p>
            <div class="location-badge">
                📍 ${locationString} - ${location.pinCode}
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="container">
        <div class="content-grid">
            <!-- Description Card -->
            <div class="card">
                <h2>About ${propertyType} in ${location.city}</h2>
                <p>${description}</p>
            </div>
            
            <!-- Localities Card -->
            ${localities && localities.length > 0 ? `
            <div class="card">
                <h2>Popular Localities</h2>
                <div class="localities-grid">
                    ${localities.flat().map(locality => `<div class="locality-item">${locality}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Sublocalities Card -->
            ${sublocalities && sublocalities.length > 0 ? `
            <div class="card">
                <h2>Sub-localities</h2>
                <div class="sublocalities-grid">
                    ${sublocalities.flat().map(sublocality => `<div class="sublocality-item">${sublocality}</div>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        
        <!-- Quick Links -->
        ${quickLinks && quickLinks.length > 0 ? `
        <div class="card">
            <h2>Quick Links</h2>
            <div class="quick-links">
                ${quickLinks.flat().map(link => `<a href="#" class="quick-link">${link}</a>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <!-- FAQ Section -->
        ${faq && faq.length > 0 ? `
        <div class="card">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-section">
                ${faq.map(item => `
                    <div class="faq-item">
                        <div class="faq-question">${item.question}</div>
                        <div class="faq-answer">${item.answer}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </div>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>${footerData?.title || 'Reeltor.com'}</h3>
                <p>${footerData?.description || 'Your trusted real estate partner in India'}</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/properties">Properties</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Location</h3>
                <p>${locationString}</p>
                <p>PIN: ${location.pinCode}</p>
                <p>${location.country}</p>
            </div>
            <div class="footer-section">
                <h3>Contact Info</h3>
                <p>📧 info@reeltor.com</p>
                <p>📞 +91 98765 43210</p>
                <p>🌐 www.reeltor.com</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Reeltor.com - All Rights Reserved | Real Estate Portal</p>
        </div>
    </footer>

    <!-- Analytics & Interactivity -->
    <script>
        // FAQ Toggle Functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = answer.style.display === 'block';
                
                // Close all other FAQs
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.style.display = 'none';
                });
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.style.background = '#f7fafc';
                    q.querySelector('::after') && (q.style.setProperty('--content', '"+'));
                });
                
                // Toggle current FAQ
                if (!isOpen) {
                    answer.style.display = 'block';
                    question.style.background = '#edf2f7';
                }
            });
        });
        
        // Page Analytics
        console.log('Page loaded:', '${siteId}');
        
        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;
  }
  
  async function createDirectory(dir) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  
  async function processPages() {
    let successful = 0;
    let failed = 0;
    
    for (const page of pages) {
      try {
        const html = await generatePageHTML(page);
        const filePath = path.join(outputDir, 'content', `${page.slug}.html`);
        
        await createDirectory(path.dirname(filePath));
        await fs.writeFile(filePath, html, 'utf8');
        
        successful++;
      } catch (error) {
        console.error(`Error processing ${page.slug}:`, error.message);
        failed++;
      }
    }
    
    parentPort.postMessage({ successful, failed });
  }
  
  processPages();
  return;
}

// Main thread code
async function createDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function fetchBatchData(offset, limit) {
  try {
    // Use the new SiteDataService to fetch from MongoDB
    const response = await axios.get(`${BACKEND_URL}/api/sites/batch?skip=${offset}&limit=${limit}`);
    return response.data.success && response.data.data ? response.data.data : [];
  } catch (error) {
    console.error(`Error fetching batch at offset ${offset}:`, error.message);
    return [];
  }
}

async function getTotalPageCount() {
  try {
    // Get count from sites endpoint using the new schema
    const response = await axios.get(`${BACKEND_URL}/api/sites/count`);
    
    if (response.data.success && response.data.count) {
      return response.data.count;
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting total site count:', error.message);
    return 0;
  }
}

async function generateWithWorkers() {
  console.log('🚀 Starting smart batch static site generation...');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Max workers: ${MAX_WORKERS}`);
  
  // Create output directory
  await createDirectory(OUTPUT_DIR);
  await createDirectory(path.join(OUTPUT_DIR, 'content'));
  
  // Get total page count
  const totalPages = await getTotalPageCount();
  console.log(`📊 Total pages to generate: ${totalPages}`);
  
  if (totalPages === 0) {
    console.log('❌ No pages found. Exiting.');
    return;
  }
  
  let totalSuccessful = 0;
  let totalFailed = 0;
  let processedPages = 0;
  
  const totalBatches = Math.ceil(totalPages / BATCH_SIZE);
  console.log(`📦 Processing in ${totalBatches} batches of ${BATCH_SIZE} pages each`);
  
  const startTime = Date.now();
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex += MAX_WORKERS) {
    const batchPromises = [];
    
    // Create up to MAX_WORKERS batches to process in parallel
    for (let i = 0; i < MAX_WORKERS && (batchIndex + i) < totalBatches; i++) {
      const currentBatch = batchIndex + i;
      const offset = currentBatch * BATCH_SIZE;
      const limit = Math.min(BATCH_SIZE, totalPages - offset);
      
      if (limit <= 0) break;
      
      // Fetch batch data
      const batchData = await fetchBatchData(offset, limit);
      
      if (batchData.length === 0) {
        console.log(`⚠️  No data for batch ${currentBatch + 1}`);
        continue;
      }
      
      // Create worker
      const workerPromise = new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: {
            pages: batchData,
            outputDir: OUTPUT_DIR,
            backendUrl: BACKEND_URL
          }
        });
        
        worker.on('message', (result) => {
          resolve(result);
        });
        
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
      
      batchPromises.push(workerPromise);
    }
    
    // Wait for all workers in this group to complete
    const results = await Promise.allSettled(batchPromises);
    
    // Process results
    for (const result of results) {
      if (result.status === 'fulfilled') {
        totalSuccessful += result.value.successful;
        totalFailed += result.value.failed;
        processedPages += result.value.successful + result.value.failed;
      } else {
        console.error('Worker failed:', result.reason.message);
      }
    }
    
    // Progress update
    const progress = (processedPages / totalPages * 100).toFixed(1);
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = processedPages / elapsed;
    const eta = (totalPages - processedPages) / rate;
    
    console.log(`📈 Progress: ${progress}% (${processedPages}/${totalPages}) | Rate: ${rate.toFixed(0)} pages/sec | ETA: ${eta.toFixed(0)}s`);
  }
  
  const totalTime = (Date.now() - startTime) / 1000;
  const averageRate = totalSuccessful / totalTime;
  
  console.log('✅ Smart batch generation complete!');
  console.log(`📊 Final stats:`);
  console.log(`   - Total processed: ${processedPages}`);
  console.log(`   - Successful: ${totalSuccessful}`);
  console.log(`   - Failed: ${totalFailed}`);
  console.log(`   - Total time: ${totalTime.toFixed(0)}s`);
  console.log(`   - Average rate: ${averageRate.toFixed(0)} pages/sec`);
  console.log(`📁 Files generated in: ${OUTPUT_DIR}`);
}

// Main execution
if (require.main === module) {
  generateWithWorkers().catch(error => {
    console.error('❌ Error during smart batch generation:', error);
    process.exit(1);
  });
}

module.exports = { generateWithWorkers };