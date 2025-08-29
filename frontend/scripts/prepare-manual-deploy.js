#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function createDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function prepareManualDeploy() {
  console.log('📦 Preparing files for manual deployment...');
  
  const sourceDir = path.join(__dirname, '..', 'demo-static');
  const deployDir = path.join(__dirname, '..', 'manual-deploy');
  
  // Create deploy directory
  await createDirectory(deployDir);
  
  // Copy all files
  await copyDirectory(sourceDir, deployDir);
  
  // Create additional required files for AWS
  await createAWSFiles(deployDir);
  
  console.log('✅ Manual deployment package ready!');
  console.log(`📁 Location: ${deployDir}`);
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Go to AWS S3 Console');
  console.log('2. Create bucket (e.g., texttoreels-static)');
  console.log('3. Drag & drop the entire manual-deploy folder contents');
  console.log('4. Make files public');
  console.log('5. Enable static website hosting');
  console.log('');
  console.log('🌐 Your site will be live at:');
  console.log('http://your-bucket-name.s3-website-us-east-1.amazonaws.com');
}

async function copyDirectory(src, dest) {
  await createDirectory(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function createAWSFiles(deployDir) {
  // Create 404.html
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - TextToReels.in</title>
    <style>
        body { font-family: Inter, sans-serif; text-align: center; padding: 4rem 2rem; background: #f7fafc; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #667eea; font-size: 3rem; margin-bottom: 1rem; }
        p { color: #718096; font-size: 1.2rem; margin-bottom: 2rem; }
        .cta { background: #667eea; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <a href="/" class="cta">Go Home</a>
    </div>
</body>
</html>`;
  
  await fs.writeFile(path.join(deployDir, '404.html'), notFoundHtml, 'utf8');
  
  // Create robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://texttoreels.in/sitemap.xml`;
  
  await fs.writeFile(path.join(deployDir, 'robots.txt'), robotsTxt, 'utf8');
  
  // Create deployment instructions
  const instructions = `# Manual Deployment Instructions

## AWS S3 Setup:

1. Sign up for AWS (free tier): https://aws.amazon.com
2. Go to S3 Console: https://s3.console.aws.amazon.com
3. Click "Create bucket"
4. Bucket name: texttoreels-static (or your domain)
5. Region: us-east-1
6. Uncheck "Block all public access"
7. Click "Create bucket"

## Upload Files:

1. Open your S3 bucket
2. Drag and drop ALL files from this folder
3. Wait for upload to complete
4. Select all uploaded files
5. Click "Actions" → "Make public"
6. Confirm making files public

## Enable Website Hosting:

1. Go to bucket "Properties" tab
2. Scroll to "Static website hosting"
3. Click "Edit"
4. Select "Enable"
5. Index document: index.html
6. Error document: 404.html
7. Click "Save changes"

## Your Website URL:
http://texttoreels-static.s3-website-us-east-1.amazonaws.com

## Custom Domain (Optional):
- Use CloudFront for HTTPS
- Point your domain to the S3 website URL

## Costs:
- Storage: ~$0.50/month for 20GB
- Requests: ~$0.01/month for normal traffic
- Total: ~$1-5/month

Generated on: ${new Date().toISOString()}
`;
  
  await fs.writeFile(path.join(deployDir, 'DEPLOYMENT_INSTRUCTIONS.md'), instructions, 'utf8');
  
  console.log('📋 Created deployment instructions');
  console.log('🤖 Created 404.html page');
  console.log('🔍 Created robots.txt');
}

// Main execution
if (require.main === module) {
  prepareManualDeploy().catch(error => {
    console.error('❌ Error preparing manual deploy:', error);
    process.exit(1);
  });
}

module.exports = { prepareManualDeploy };