const mongoose = require('mongoose');
const URLMapping = require('../models/URLMapping');
require('dotenv').config();

// List of URLs that were indexed by Google but don't exist anymore
const googleIndexedOldUrls = [
  // Love Quotes variations
  {
    oldUrl: '/content/love-quotes-hindi-dark-theme',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/love-quotes-hindi-dark-theme-twitter-post',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/hindi-love-quotes-reel-maker',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/hindi-love-quotes-status-maker',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/hindi-love-quotes-content-creator',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/incredible-hindi-love-quotes-generator',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/exceptional-love-quotes-twitter-post-generator',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/spectacular-love-quotes-reels-hindi',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/remarkable-love-quotes-reels',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/construct-stunning-love-quotes-reels',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },

  // Motivational Quotes variations
  {
    oldUrl: '/content/motivational-quotes-hindi',
    newUrl: '/content-types/motivational-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/hindi-motivational-quotes-generator',
    newUrl: '/content-types/motivational-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/success-mantras-motivational',
    newUrl: '/content-types/motivational-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },

  // Friendship Quotes variations
  {
    oldUrl: '/content/friendship-quotes-dosti-shayari',
    newUrl: '/content-types/friendship-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/dosti-quotes-hindi',
    newUrl: '/content-types/friendship-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },

  // Good Morning variations
  {
    oldUrl: '/content/good-morning-quotes-hindi',
    newUrl: '/content-types/good-morning/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/suprabhat-messages',
    newUrl: '/content-types/good-morning/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },

  // Hindi Shayari variations
  {
    oldUrl: '/content/hindi-shayari-love',
    newUrl: '/content-types/hindi-shayari/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/romantic-shayari-hindi',
    newUrl: '/content-types/hindi-shayari/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },

  // Birthday Wishes variations
  {
    oldUrl: '/content/birthday-wishes-hindi',
    newUrl: '/content-types/birthday-wishes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/janmadin-wishes',
    newUrl: '/content-types/birthday-wishes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },

  // General content patterns that might be indexed
  {
    oldUrl: '/content/hindi-quotes-generator',
    newUrl: '/content-types/love-quotes/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/social-media-content-creator',
    newUrl: '/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/instagram-reels-maker',
    newUrl: '/platform/instagram-reels/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/youtube-shorts-generator',
    newUrl: '/platform/youtube-shorts/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  },
  {
    oldUrl: '/content/whatsapp-status-maker',
    newUrl: '/platform/whatsapp-status/',
    reason: 'GOOGLE_INDEXED',
    source: 'GOOGLE_SEARCH'
  }
];

async function addGoogleIndexedURLs() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/texttoreels');

    console.log('📝 Starting URL mapping migration...');

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const urlData of googleIndexedOldUrls) {
      try {
        // Check if URL mapping already exists
        const existing = await URLMapping.findOne({ oldUrl: urlData.oldUrl });

        if (existing) {
          console.log(`⚠️  URL mapping already exists: ${urlData.oldUrl}`);
          skippedCount++;
          continue;
        }

        // Create new URL mapping
        const mapping = new URLMapping({
          oldUrl: urlData.oldUrl,
          newUrl: urlData.newUrl,
          redirectType: 301,
          isActive: true,
          reason: urlData.reason,
          source: urlData.source,
          hitCount: 0
        });

        await mapping.save();
        console.log(`✅ Added URL mapping: ${urlData.oldUrl} → ${urlData.newUrl}`);
        addedCount++;

      } catch (error) {
        console.error(`❌ Error adding mapping for ${urlData.oldUrl}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Added: ${addedCount} URL mappings`);
    console.log(`⚠️  Skipped: ${skippedCount} existing mappings`);
    console.log(`❌ Errors: ${errorCount} failed mappings`);
    console.log(`📝 Total processed: ${googleIndexedOldUrls.length} URLs`);

    // Add some statistics about the added mappings
    const totalMappings = await URLMapping.countDocuments({ isActive: true });
    console.log(`📈 Total active URL mappings in database: ${totalMappings}`);

    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration
if (require.main === module) {
  addGoogleIndexedURLs();
}

module.exports = { addGoogleIndexedURLs, googleIndexedOldUrls };