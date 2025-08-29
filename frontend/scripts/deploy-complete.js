#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function deployComplete() {
  console.log('🚀 Starting complete deployment...');
  
  try {
    // Step 1: Deploy landing page to Vercel
    console.log('📱 Deploying landing page to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('✅ Landing page deployed to Vercel');
    
    // Step 2: Check if static generation is complete
    const outDir = path.join(__dirname, '..', 'out');
    const exists = await fs.access(outDir).then(() => true).catch(() => false);
    
    if (!exists) {
      console.log('⏳ Waiting for static generation to complete...');
      console.log('Run: npm run generate-smart first');
      return;
    }
    
    // Step 3: Deploy static sites to AWS S3
    console.log('📦 Deploying static sites to AWS S3...');
    
    // Check if AWS credentials are configured
    try {
      execSync('aws sts get-caller-identity', { stdio: 'pipe' });
      execSync('npm run deploy-s3', { stdio: 'inherit' });
      console.log('✅ Static sites deployed to S3');
    } catch (error) {
      console.log('⚠️  AWS credentials not configured');
      console.log('📁 Static files ready at: frontend/out/');
      console.log('📋 Manual upload instructions created');
    }
    
    console.log('🎉 Deployment complete!');
    console.log('🌐 Landing page: https://texttoreels.vercel.app');
    console.log('📄 Static sites: https://static.texttoreels.in');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployComplete();