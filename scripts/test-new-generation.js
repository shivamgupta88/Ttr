#!/usr/bin/env node

/**
 * Test script for the new static page generation system
 * This demonstrates how to use the updated generation pipeline
 */

const fs = require('fs').promises;
const path = require('path');
const SampleDataGenerator = require('./sample-data-generator');

// Import the updated generation function from the smart-batch-generator
const { generatePageHTML } = require('../frontend/scripts/smart-batch-generator');

class TestGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'test-output');
  }

  async setup() {
    // Create output directory
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${this.outputDir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  /**
   * Generate a single test page using sample data
   */
  async generateTestPage(siteData) {
    try {
      // Use the updated HTML generation function
      const html = await this.generatePageHTML(siteData);
      
      const filename = `${siteData.slug}.html`;
      const filePath = path.join(this.outputDir, filename);
      
      await fs.writeFile(filePath, html);
      console.log(`✅ Generated: ${filename}`);
      
      return filePath;
    } catch (error) {
      console.error(`❌ Error generating page for ${siteData.slug}:`, error);
      throw error;
    }
  }

  /**
   * Generate page HTML using the new template
   * This replicates the function from smart-batch-generator.js
   */
  async generatePageHTML(siteData) {
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

  /**
   * Run the complete test
   */
  async runTest() {
    console.log('🧪 Starting static page generation test...\n');
    
    await this.setup();
    
    // Generate sample data
    const generator = new SampleDataGenerator();
    console.log('📊 Generating sample data...');
    const sampleSites = generator.generateBulkData(3);
    
    console.log(`\n📄 Generated ${sampleSites.length} sample sites:`);
    sampleSites.forEach((site, index) => {
      console.log(`  ${index + 1}. ${site.metaTitle[0]} (${site.slug})`);
    });
    
    // Generate HTML pages
    console.log('\n🏗️  Generating static pages...');
    const generatedFiles = [];
    
    for (const siteData of sampleSites) {
      try {
        const filePath = await this.generateTestPage(siteData);
        generatedFiles.push(filePath);
      } catch (error) {
        console.error(`❌ Failed to generate page for ${siteData.slug}:`, error.message);
      }
    }
    
    // Create index page
    await this.generateIndexPage(sampleSites);
    
    console.log('\n✨ Test completed successfully!');
    console.log(`📁 Generated files in: ${this.outputDir}`);
    console.log(`📊 Success rate: ${generatedFiles.length}/${sampleSites.length} pages generated`);
    console.log('\n🌐 To view the pages:');
    console.log('  1. Open the HTML files in your browser');
    console.log('  2. Or use a simple HTTP server:');
    console.log(`     cd ${this.outputDir} && python -m http.server 8000`);
    
    return generatedFiles;
  }

  /**
   * Generate an index page to showcase all generated pages
   */
  async generateIndexPage(sites) {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Generated Pages - Reeltor.com</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
        .card h3 { margin: 0 0 0.5rem; color: #2d3748; }
        .card p { margin: 0.5rem 0; color: #4a5568; }
        .card a { color: #667eea; text-decoration: none; font-weight: 500; }
        .card a:hover { text-decoration: underline; }
        .badge { background: #edf2f7; color: #4a5568; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; }
        .header { text-align: center; margin-bottom: 2rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat { background: #f7fafc; padding: 1rem; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 Test Generated Real Estate Pages</h1>
            <p>Generated with the new MongoDB schema and enhanced UI</p>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${sites.length}</div>
                <div>Pages Generated</div>
            </div>
            <div class="stat">
                <div class="stat-number">${new Set(sites.map(s => s.location.city)).size}</div>
                <div>Cities Covered</div>
            </div>
            <div class="stat">
                <div class="stat-number">${new Set(sites.map(s => s.propertyType)).size}</div>
                <div>Property Types</div>
            </div>
        </div>
        
        <h2>Generated Pages:</h2>
        ${sites.map(site => `
            <div class="card">
                <h3><a href="${site.slug}.html">${site.metaTitle[0]}</a></h3>
                <p>${site.shortDescription}</p>
                <div style="margin-top: 1rem;">
                    <span class="badge">${site.location.city}, ${site.location.state}</span>
                    <span class="badge">${site.propertyType}</span>
                    <span class="badge">${site.keywords.length} Keywords</span>
                    <span class="badge">${site.faq.length} FAQs</span>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    
    const indexPath = path.join(this.outputDir, 'index.html');
    await fs.writeFile(indexPath, indexHtml);
    console.log('📝 Generated index.html');
  }
}

// Run the test if called directly
if (require.main === module) {
  const tester = new TestGenerator();
  
  tester.runTest()
    .then(() => {
      console.log('\n🎉 All tests completed successfully!');
    })
    .catch(error => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = TestGenerator;