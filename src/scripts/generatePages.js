#!/usr/bin/env node

/**
 * Command-line script for generating pages
 * Usage: npm run generate -- --pages=100000 --workers=8
 */

require('dotenv').config();
const BulkGenerator = require('../services/BulkGenerator');
const SEOEngine = require('../services/SEOEngine');
const connectDB = require('../config/database');
const Page = require('../models/Page');

async function main() {
  console.log('🚀 TextToReels Page Generation Script');
  console.log('=====================================\n');

  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const config = parseArgs(args);
    
    console.log('📋 Generation Configuration:');
    console.log(`   Target Pages: ${config.pages.toLocaleString()}`);
    console.log(`   Batch Size: ${config.batchSize.toLocaleString()}`);
    console.log(`   Workers: ${config.workers}`);
    console.log(`   Generate SEO: ${config.seo ? 'Yes' : 'No'}`);
    console.log(`   Cleanup Old: ${config.cleanup ? 'Yes' : 'No'}\n`);

    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Database connected\n');

    // Cleanup old pages if requested
    if (config.cleanup) {
      await cleanupOldPages();
    }

    // Generate pages
    const generator = new BulkGenerator({
      targetPages: config.pages,
      batchSize: config.batchSize,
      maxWorkers: config.workers
    });

    console.log('🏭 Starting bulk generation...\n');
    const startTime = Date.now();
    
    const results = await generator.generatePagesInParallel();
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n✅ Generation completed in ${duration.toFixed(2)} seconds`);
    console.log(`📊 Final Results:`);
    console.log(`   Generated: ${results.inserted.toLocaleString()} pages`);
    console.log(`   Duplicates: ${results.duplicates.toLocaleString()}`);
    console.log(`   Errors: ${results.errors.toLocaleString()}`);
    console.log(`   Success Rate: ${((results.inserted / (results.inserted + results.errors)) * 100).toFixed(2)}%`);
    console.log(`   Speed: ${(results.inserted / duration).toFixed(0)} pages/second`);

    // Generate SEO assets if requested
    if (config.seo && results.inserted > 0) {
      await generateSEOAssets();
    }

    // Show final statistics
    await showFinalStats();

    console.log('\n🎉 Script completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function parseArgs(args) {
  const config = {
    // pages: 100000,
    // batchSize: 10000,
    pages: 10,
    batchSize: 1,
    workers: require('os').cpus().length,
    seo: false,
    cleanup: false
  };

  args.forEach(arg => {
    if (arg.startsWith('--pages=')) {
      config.pages = parseInt(arg.split('=')[1]) || config.pages;
    } else if (arg.startsWith('--batch=')) {
      config.batchSize = parseInt(arg.split('=')[1]) || config.batchSize;
    } else if (arg.startsWith('--workers=')) {
      config.workers = parseInt(arg.split('=')[1]) || config.workers;
    } else if (arg === '--seo') {
      config.seo = true;
    } else if (arg === '--cleanup') {
      config.cleanup = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    }
  });

  // Validate config
  if (config.pages > 1000000) {
    console.warn('⚠️  Warning: Maximum recommended pages is 1,000,000');
    config.pages = 1000000;
  }

  if (config.batchSize > 50000) {
    console.warn('⚠️  Warning: Maximum recommended batch size is 50,000');
    config.batchSize = 50000;
  }

  return config;
}

function showHelp() {
  console.log(`
🚀 TextToReels Page Generation Script

Usage:
  npm run generate [options]

Options:
  --pages=N       Number of pages to generate (default: 100000, max: 1000000)
  --batch=N       Batch size for processing (default: 10000, max: 50000)
  --workers=N     Number of worker threads (default: CPU cores)
  --seo           Generate SEO assets after page generation
  --cleanup       Clean up old draft pages before generation
  --help, -h      Show this help message

Examples:
  npm run generate -- --pages=500000 --workers=8 --seo
  npm run generate -- --pages=100000 --batch=5000 --cleanup
  npm run generate -- --pages=1000000 --seo

Performance Tips:
  - Use --batch=50000 for maximum speed on M4 processors
  - Use --workers=12 on M4 Pro/Max for optimal performance
  - Use --cleanup periodically to remove old draft pages
  - Always use --seo after large generations for SEO optimization
`);
}

async function cleanupOldPages() {
  console.log('🧹 Cleaning up old draft pages...');
  
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 24); // Older than 24 hours
  
  const deleteResult = await Page.deleteMany({
    status: 'draft',
    createdAt: { $lt: cutoffDate }
  });
  
  console.log(`✅ Cleaned up ${deleteResult.deletedCount.toLocaleString()} old draft pages\n`);
}

async function generateSEOAssets() {
  console.log('\n🔍 Generating SEO assets...');
  
  try {
    const pages = await Page.find({ status: { $in: ['published', 'generated'] } })
      .select('slug seo content dimensions createdAt updatedAt performance')
      .limit(50000) // Limit for initial SEO generation
      .lean();

    if (pages.length === 0) {
      console.log('⚠️  No pages found for SEO generation');
      return;
    }

    const seoEngine = new SEOEngine();
    const seoAssets = await seoEngine.generateAllSEOAssets(pages);

    console.log(`✅ SEO assets generated:`);
    console.log(`   Sitemaps: ${seoAssets.sitemaps.length}`);
    console.log(`   Robots.txt: Generated`);
    console.log(`   Structured data types: ${Object.keys(seoAssets.structuredData).length}`);
    console.log(`   Pages processed: ${pages.length.toLocaleString()}`);

  } catch (error) {
    console.error('❌ SEO generation failed:', error.message);
  }
}

async function showFinalStats() {
  console.log('\n📈 Database Statistics:');
  
  try {
    const [
      totalPages,
      publishedPages,
      draftPages,
      generatedPages,
      todayPages
    ] = await Promise.all([
      Page.countDocuments(),
      Page.countDocuments({ status: 'published' }),
      Page.countDocuments({ status: 'draft' }),
      Page.countDocuments({ status: 'generated' }),
      Page.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

    console.log(`   Total Pages: ${totalPages.toLocaleString()}`);
    console.log(`   Published: ${publishedPages.toLocaleString()}`);
    console.log(`   Generated: ${generatedPages.toLocaleString()}`);
    console.log(`   Draft: ${draftPages.toLocaleString()}`);
    console.log(`   Created Today: ${todayPages.toLocaleString()}`);

    // Top themes
    const topThemes = await Page.aggregate([
      { $group: { _id: '$dimensions.theme', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    console.log('\n🎯 Top Themes:');
    topThemes.forEach((theme, index) => {
      console.log(`   ${index + 1}. ${theme._id}: ${theme.count.toLocaleString()} pages`);
    });

  } catch (error) {
    console.error('❌ Error fetching statistics:', error.message);
  }
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n🛑 Script interrupted. Cleaning up...');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Script terminated. Cleaning up...');
  process.exit(1);
});

// Start the script
if (require.main === module) {
  main();
}

module.exports = { main, parseArgs };