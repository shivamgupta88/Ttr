#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

/**
 * Complete Deployment Package Generator
 * Creates a comprehensive deployment package with:
 * 1. Next.js static build (main site)
 * 2. All static content pages
 * 3. Proper routing configuration
 * 4. SEO files (sitemaps, robots.txt)
 */

const FRONTEND_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(FRONTEND_DIR, 'complete-deploy');
const PACKAGE_NAME = 'texttoreels-complete-deploy.zip';

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function copyDirectory(src, dest, options = {}) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (options.skipDirs && options.skipDirs.includes(entry.name)) {
        continue;
      }
      await copyDirectory(srcPath, destPath, options);
    } else {
      if (options.skipFiles && options.skipFiles.some(pattern => entry.name.includes(pattern))) {
        continue;
      }
      await copyFile(srcPath, destPath);
    }
  }
}

async function buildNextJsApp() {
  console.log('🏗️  Building Next.js application...');
  
  try {
    // Clean previous build
    const outDir = path.join(FRONTEND_DIR, 'out');
    try {
      await fs.rm(outDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore if directory doesn't exist
    }
    
    // Build the app
    process.chdir(FRONTEND_DIR);
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ Next.js build completed');
  } catch (error) {
    console.error('❌ Next.js build failed:', error.message);
    throw error;
  }
}

async function createCompleteDeployment() {
  console.log('📦 Creating complete deployment package...');
  
  // Clean output directory
  try {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  } catch (error) {
    // Ignore if directory doesn't exist
  }
  await ensureDir(OUTPUT_DIR);
  
  // 1. Copy Next.js build output
  console.log('📄 Copying Next.js build output...');
  const outDir = path.join(FRONTEND_DIR, 'out');
  await copyDirectory(outDir, OUTPUT_DIR);
  
  // 2. Create content directory structure
  const contentDir = path.join(OUTPUT_DIR, 'content');
  await ensureDir(contentDir);
  
  // 3. Copy static content files from demo-static
  console.log('📋 Copying static content from demo-static...');
  const demoStaticContentDir = path.join(FRONTEND_DIR, 'demo-static', 'content');
  try {
    await copyDirectory(demoStaticContentDir, contentDir);
    console.log('✅ Demo static content copied');
  } catch (error) {
    console.log('⚠️  Demo static content not found, skipping...');
  }
  
  // 4. Copy static content files from manual-deploy
  console.log('📋 Copying static content from manual-deploy...');
  const manualDeployContentDir = path.join(FRONTEND_DIR, 'manual-deploy', 'content');
  try {
    await copyDirectory(manualDeployContentDir, contentDir);
    console.log('✅ Manual deploy content copied');
  } catch (error) {
    console.log('⚠️  Manual deploy content not found, skipping...');
  }
  
  // 5. Copy additional static files
  console.log('📄 Copying additional static files...');
  
  // Copy robots.txt if exists
  try {
    const robotsSrc = path.join(FRONTEND_DIR, 'manual-deploy', 'robots.txt');
    const robotsDest = path.join(OUTPUT_DIR, 'robots.txt');
    await copyFile(robotsSrc, robotsDest);
    console.log('✅ robots.txt copied');
  } catch (error) {
    console.log('⚠️  robots.txt not found, creating default...');
    const defaultRobots = `User-agent: *
Allow: /

Sitemap: https://texttoreels.in/sitemap-index.xml
`;
    await fs.writeFile(path.join(OUTPUT_DIR, 'robots.txt'), defaultRobots);
  }
  
  // 6. Copy sitemaps from root public directory
  console.log('🗺️  Copying sitemaps...');
  const publicDir = path.join(FRONTEND_DIR, '..', 'public');
  try {
    const sitemapFiles = await fs.readdir(publicDir);
    for (const file of sitemapFiles) {
      if (file.includes('sitemap')) {
        await copyFile(
          path.join(publicDir, file),
          path.join(OUTPUT_DIR, file)
        );
      }
    }
    console.log('✅ Sitemaps copied');
  } catch (error) {
    console.log('⚠️  Sitemaps not found in public directory');
  }
  
  console.log('✅ Complete deployment package created');
}

async function updateNetlifyConfig() {
  console.log('⚙️  Creating optimized netlify.toml...');
  
  const netlifyConfig = `[build]
  publish = "."

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Cache-Control = "public, max-age=3600"

# Static content caching
[[headers]]
  for = "/content/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"

# Asset caching
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Content page routing - serve HTML files directly
[[redirects]]
  from = "/content/:slug"
  to = "/content/:slug.html"
  status = 200

# SPA fallback for Next.js routes
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
  
  await fs.writeFile(path.join(OUTPUT_DIR, 'netlify.toml'), netlifyConfig);
  console.log('✅ netlify.toml created');
}

async function generatePackageStats() {
  console.log('📊 Generating package statistics...');
  
  async function countFiles(dir) {
    let count = 0;
    let totalSize = 0;
    
    async function walkDir(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await walkDir(fullPath);
        } else {
          count++;
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        }
      }
    }
    
    await walkDir(dir);
    return { count, totalSize };
  }
  
  const stats = await countFiles(OUTPUT_DIR);
  
  // Count content files specifically
  let contentFiles = 0;
  try {
    const contentDir = path.join(OUTPUT_DIR, 'content');
    const contentStats = await countFiles(contentDir);
    contentFiles = contentStats.count;
  } catch (error) {
    // Content directory might not exist
  }
  
  const statsReport = `# Deployment Package Statistics

## Total Files: ${stats.count}
## Total Size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB
## Content Pages: ${contentFiles}

## Package Contents:
- ✅ Next.js static build (main site)
- ✅ Static content pages (/content/)
- ✅ Platform pages (/platform/)
- ✅ Language pages (/language/)
- ✅ Category pages (/content-types/)
- ✅ SEO files (robots.txt, sitemaps)
- ✅ Optimized netlify.toml

## Deployment Instructions:
1. Extract the deployment package
2. Drag and drop the entire folder to Netlify
3. All routes will work automatically

Generated: ${new Date().toISOString()}
`;
  
  await fs.writeFile(path.join(OUTPUT_DIR, 'DEPLOYMENT_INFO.md'), statsReport);
  
  console.log('📊 Package Statistics:');
  console.log(`   Total files: ${stats.count}`);
  console.log(`   Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Content pages: ${contentFiles}`);
}

async function createZipPackage() {
  console.log('🗜️  Creating ZIP package...');
  
  process.chdir(path.dirname(OUTPUT_DIR));
  const zipPath = path.join(FRONTEND_DIR, PACKAGE_NAME);
  
  // Remove existing zip
  try {
    await fs.unlink(zipPath);
  } catch (error) {
    // Ignore if file doesn't exist
  }
  
  // Create new zip
  execSync(`zip -r "${zipPath}" "${path.basename(OUTPUT_DIR)}" -x "*.DS_Store"`, {
    stdio: 'inherit'
  });
  
  const zipStats = await fs.stat(zipPath);
  console.log(`✅ ZIP package created: ${PACKAGE_NAME}`);
  console.log(`   Size: ${(zipStats.size / 1024 / 1024).toFixed(2)} MB`);
  
  return zipPath;
}

async function main() {
  const startTime = Date.now();
  
  console.log('🚀 Starting complete deployment package generation...\n');
  
  try {
    // Step 1: Build Next.js app
    await buildNextJsApp();
    
    // Step 2: Create complete deployment
    await createCompleteDeployment();
    
    // Step 3: Update Netlify config
    await updateNetlifyConfig();
    
    // Step 4: Generate stats
    await generatePackageStats();
    
    // Step 5: Create ZIP package
    const zipPath = await createZipPackage();
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log('\n🎉 Complete deployment package ready!');
    console.log(`📦 Package: ${PACKAGE_NAME}`);
    console.log(`📁 Extract folder: complete-deploy/`);
    console.log(`⏱️  Total time: ${totalTime}s`);
    console.log('\n🚀 Ready for drag-and-drop deployment to Netlify!');
    
  } catch (error) {
    console.error('\n❌ Package generation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };