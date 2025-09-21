#!/usr/bin/env node

/**
 * Netlify Auto-Setup Script for TextToReels.in
 * This script automatically configures everything needed for Netlify deployment
 */

const fs = require('fs');
const path = require('path');

class NetlifyAutoSetup {
    constructor() {
        this.deployDir = path.join(__dirname, '..', 'netlify-deploy');
        this.umamiWebsiteId = 'f8b9c123-d456-7890-e123-456789abcdef'; // Default Umami ID
        this.gaTrackingId = 'G-XXXXXXXXXX'; // Default GA4 ID
        this.clarityId = 'abcdefghij'; // Default Clarity ID
    }

    // Replace all analytics placeholders with real IDs
    replaceAnalyticsIDs() {
        console.log('🔧 Setting up analytics tracking...');

        const filesToUpdate = [
            'index.html',
            'contact.html',
            'privacy-policy.html',
            'terms-of-service.html',
            'api.html',
            '404.html',
            'about/index.html',
            'explore/index.html',
            'search/index.html'
        ];

        // Also update all content and platform pages
        const getAllHtmlFiles = (dir) => {
            const files = [];
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    files.push(...getAllHtmlFiles(fullPath));
                } else if (item.endsWith('.html')) {
                    files.push(fullPath.replace(this.deployDir + '/', ''));
                }
            }
            return files;
        };

        const allHtmlFiles = getAllHtmlFiles(this.deployDir);

        for (const file of allHtmlFiles) {
            const filePath = path.join(this.deployDir, file);

            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');

                // Replace analytics IDs
                content = content.replace(/UMAMI_WEBSITE_ID/g, this.umamiWebsiteId);
                content = content.replace(/GA_TRACKING_ID/g, this.gaTrackingId);
                content = content.replace(/CLARITY_ID/g, this.clarityId);

                fs.writeFileSync(filePath, content);
                console.log(`✅ Updated analytics in: ${file}`);
            }
        }
    }

    // Create a comprehensive sitemap with all pages
    generateCompleteSitemap() {
        console.log('🗺️ Generating complete sitemap...');

        const baseUrl = 'https://texttoreels.in';
        const currentDate = new Date().toISOString().split('T')[0];

        // Get all HTML files for sitemap
        const getAllUrls = (dir, baseDir = '') => {
            const urls = [];
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('_') && !item.startsWith('.')) {
                    urls.push(...getAllUrls(fullPath, path.join(baseDir, item)));
                } else if (item === 'index.html') {
                    const url = baseDir ? `${baseUrl}/${baseDir}/` : `${baseUrl}/`;
                    urls.push({
                        url,
                        lastmod: currentDate,
                        changefreq: baseDir.includes('content') ? 'weekly' : 'daily',
                        priority: baseDir ? '0.8' : '1.0'
                    });
                } else if (item.endsWith('.html') && !item.includes('404')) {
                    const url = `${baseUrl}/${baseDir ? baseDir + '/' : ''}${item}`;
                    urls.push({
                        url,
                        lastmod: currentDate,
                        changefreq: 'monthly',
                        priority: '0.7'
                    });
                }
            }
            return urls;
        };

        const urls = getAllUrls(this.deployDir);

        // Generate XML sitemap
        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        for (const urlData of urls) {
            sitemapXml += `
  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
  </url>`;
        }

        sitemapXml += `
</urlset>`;

        fs.writeFileSync(path.join(this.deployDir, 'sitemap.xml'), sitemapXml);
        console.log(`✅ Generated sitemap with ${urls.length} URLs`);
    }

    // Create optimized robots.txt
    generateRobotsTxt() {
        console.log('🤖 Generating optimized robots.txt...');

        const robotsTxt = `# Robots.txt for TextToReels.in - Optimized for SEO
# Updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Allow: /

# High-priority pages for crawling
Allow: /contact.html
Allow: /privacy-policy.html
Allow: /terms-of-service.html
Allow: /api.html
Allow: /explore/
Allow: /content-types/
Allow: /language/
Allow: /platform/
Allow: /content/

# Block technical files and directories
Disallow: /_next/
Disallow: /api/
Disallow: /*.json$
Disallow: /*.js$
Disallow: /*.css$

# Block query parameters and tracking URLs
Disallow: /*?*
Disallow: /*&*
Disallow: /*utm_*
Disallow: /*#*

# Block aggressive crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Crawl delay for performance
Crawl-delay: 1

# Sitemap location
Sitemap: https://texttoreels.in/sitemap.xml

# Host directive
Host: https://texttoreels.in`;

        fs.writeFileSync(path.join(this.deployDir, 'robots.txt'), robotsTxt);
        console.log('✅ Generated optimized robots.txt');
    }

    // Create performance-optimized netlify.toml
    generateNetlifyConfig() {
        console.log('⚙️ Generating optimized Netlify configuration...');

        const netlifyToml = `# Netlify Configuration for TextToReels.in
# Optimized for performance and SEO

[build]
  publish = "."
  command = "echo 'Static site deployment ready'"

# Security and performance headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
    Content-Security-Policy = "default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com; font-src fonts.googleapis.com fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' cloud.umami.is www.googletagmanager.com www.google-analytics.com www.clarity.ms; img-src 'self' data: www.google-analytics.com www.googletagmanager.com; connect-src 'self' cloud.umami.is www.google-analytics.com www.googletagmanager.com www.clarity.ms analytics.google.com; frame-src 'none';"

# Cache static assets (1 year)
[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.jpeg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.ico"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache HTML content (1 hour)
[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"

# Content pages caching
[[headers]]
  for = "/content/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"

# Redirects for SEO-friendly URLs
[[redirects]]
  from = "/privacy"
  to = "/privacy-policy.html"
  status = 301

[[redirects]]
  from = "/terms"
  to = "/terms-of-service.html"
  status = 301

[[redirects]]
  from = "/contact"
  to = "/contact.html"
  status = 301

[[redirects]]
  from = "/api"
  to = "/api.html"
  status = 301

[[redirects]]
  from = "/docs"
  to = "/api.html"
  status = 301

# Content directory handling
[[redirects]]
  from = "/content/:slug"
  to = "/content/:slug.html"
  status = 200
  conditions = {Path = "/content/:slug.html"}

# Fallback for SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Path = "!/**/*.html"}

# 404 handling
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404`;

        fs.writeFileSync(path.join(this.deployDir, 'netlify.toml'), netlifyToml);
        console.log('✅ Generated optimized Netlify configuration');
    }

    // Add structured data to all pages
    addStructuredData() {
        console.log('📊 Adding structured data for SEO...');

        const structuredData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": "https://texttoreels.in/#website",
                    "url": "https://texttoreels.in",
                    "name": "TextToReels.in",
                    "description": "AI-Powered Text to Video Generator - Create stunning social media content in seconds",
                    "publisher": {
                        "@id": "https://texttoreels.in/#organization"
                    },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": "https://texttoreels.in/search?q={search_term_string}"
                        },
                        "query-input": "required name=search_term_string"
                    }
                },
                {
                    "@type": "Organization",
                    "@id": "https://texttoreels.in/#organization",
                    "name": "TextToReels.in",
                    "url": "https://texttoreels.in",
                    "logo": {
                        "@type": "ImageObject",
                        "@id": "https://texttoreels.in/#logo",
                        "url": "https://texttoreels.in/logo.png",
                        "width": 512,
                        "height": 512
                    },
                    "sameAs": [
                        "https://twitter.com/texttoreels",
                        "https://instagram.com/texttoreels",
                        "https://youtube.com/texttoreels",
                        "https://facebook.com/texttoreels"
                    ]
                },
                {
                    "@type": "SoftwareApplication",
                    "name": "TextToReels.in AI Video Generator",
                    "applicationCategory": "MultimediaApplication",
                    "operatingSystem": "Web Browser",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "featureList": [
                        "AI-powered video generation",
                        "50+ language support",
                        "1M+ content templates",
                        "Instagram Reels creator",
                        "YouTube Shorts generator",
                        "Social media automation"
                    ]
                }
            ]
        };

        const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;

        // Add to main pages
        const mainPages = ['index.html', 'contact.html', 'api.html'];

        for (const page of mainPages) {
            const filePath = path.join(this.deployDir, page);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');

                // Add structured data before closing head tag
                if (!content.includes('application/ld+json')) {
                    content = content.replace('</head>', `    ${structuredDataScript}\n</head>`);
                    fs.writeFileSync(filePath, content);
                    console.log(`✅ Added structured data to: ${page}`);
                }
            }
        }
    }

    // Run all setup tasks
    async run() {
        console.log('🚀 Starting Netlify Auto-Setup for TextToReels.in...\n');

        try {
            this.replaceAnalyticsIDs();
            this.generateCompleteSitemap();
            this.generateRobotsTxt();
            this.generateNetlifyConfig();
            this.addStructuredData();

            console.log('\n✅ Auto-setup completed successfully!');
            console.log('\n📋 Summary:');
            console.log('   • Analytics tracking configured');
            console.log('   • Complete sitemap generated');
            console.log('   • SEO-optimized robots.txt created');
            console.log('   • Performance-optimized Netlify config');
            console.log('   • Structured data added for SEO');
            console.log('\n🚀 Ready for Netlify deployment!');
            console.log('   Repository: git@github.com:shivamgupta88/Ttr.git');
            console.log('   Deploy folder: netlify-deploy/');

        } catch (error) {
            console.error('❌ Error during setup:', error.message);
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const setup = new NetlifyAutoSetup();
    setup.run();
}

module.exports = NetlifyAutoSetup;