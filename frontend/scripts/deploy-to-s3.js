#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');

// AWS Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'texttoreels.in';
const STATIC_DIR = path.join(__dirname, '..', 'out');
const CLOUDFRONT_DISTRIBUTION_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID;

async function uploadFile(filePath, s3Key) {
  try {
    const fileContent = await fs.readFile(filePath);
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: contentType === 'text/html' ? 'max-age=3600' : 'max-age=31536000',
      ACL: 'public-read'
    };
    
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error(`Error uploading ${s3Key}:`, error.message);
    throw error;
  }
}

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, baseDir);
      files.push(...subFiles);
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        filePath: fullPath,
        s3Key: relativePath.replace(/\\/g, '/')
      });
    }
  }
  
  return files;
}

async function deployToS3() {
  console.log('🚀 Starting deployment to S3...');
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Static directory: ${STATIC_DIR}`);
  
  try {
    // Check if bucket exists
    await s3.headBucket({ Bucket: BUCKET_NAME }).promise();
    console.log('✅ S3 bucket found');
  } catch (error) {
    if (error.statusCode === 404) {
      console.log('📦 Creating S3 bucket...');
      await s3.createBucket({ Bucket: BUCKET_NAME }).promise();
      
      // Configure bucket for static website hosting
      await s3.putBucketWebsite({
        Bucket: BUCKET_NAME,
        WebsiteConfiguration: {
          IndexDocument: { Suffix: 'index.html' },
          ErrorDocument: { Key: 'error.html' }
        }
      }).promise();
      
      console.log('✅ S3 bucket created and configured');
    } else {
      throw error;
    }
  }
  
  // Get all files to upload
  const files = await getAllFiles(STATIC_DIR);
  console.log(`📄 Found ${files.length} files to upload`);
  
  let uploaded = 0;
  let failed = 0;
  const startTime = Date.now();
  
  // Upload files in batches
  const BATCH_SIZE = 10;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    
    const uploadPromises = batch.map(async (file) => {
      try {
        await uploadFile(file.filePath, file.s3Key);
        uploaded++;
        return true;
      } catch (error) {
        failed++;
        return false;
      }
    });
    
    await Promise.all(uploadPromises);
    
    // Progress update
    const progress = ((i + BATCH_SIZE) / files.length * 100).toFixed(1);
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = uploaded / elapsed;
    
    console.log(`📈 Progress: ${progress}% (${uploaded}/${files.length}) | Rate: ${rate.toFixed(1)} files/sec`);
  }
  
  const totalTime = (Date.now() - startTime) / 1000;
  
  console.log('✅ Deployment complete!');
  console.log(`📊 Stats: ${uploaded} uploaded, ${failed} failed`);
  console.log(`⏱️  Total time: ${totalTime.toFixed(0)}s`);
  console.log(`🌐 Website URL: http://${BUCKET_NAME}.s3-website-${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`);
  
  // Invalidate CloudFront cache if configured
  if (CLOUDFRONT_DISTRIBUTION_ID) {
    console.log('🔄 Invalidating CloudFront cache...');
    const cloudfront = new AWS.CloudFront();
    
    await cloudfront.createInvalidation({
      DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    }).promise();
    
    console.log('✅ CloudFront cache invalidated');
  }
}

// Main execution
if (require.main === module) {
  deployToS3().catch(error => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
}

module.exports = { deployToS3 };