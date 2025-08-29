#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// Page schema (minimal for counting)
const pageSchema = new mongoose.Schema({
  status: String,
  dimensions: {
    theme: String,
    language: String,
    platform: String
  }
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema, 'pages');

async function showProgress() {
  try {
    const [
      totalPages,
      publishedPages,
      generatedPages,
      draftPages,
      todayPages
    ] = await Promise.all([
      Page.countDocuments(),
      Page.countDocuments({ status: 'published' }),
      Page.countDocuments({ status: 'generated' }),
      Page.countDocuments({ status: 'draft' }),
      Page.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

    // Clear screen and show progress
    console.clear();
    console.log('🚀 TextToReels.in - Live Generation Monitor');
    console.log('==========================================');
    console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
    console.log('');
    
    // Calculate progress for 1M target
    const targetPages = 1000000;
    const currentProgress = (totalPages / targetPages * 100).toFixed(2);
    const progressBar = createProgressBar(parseFloat(currentProgress), 50);
    
    console.log('📊 Overall Progress toward 1M pages:');
    console.log(`${progressBar} ${currentProgress}%`);
    console.log(`✅ Generated: ${totalPages.toLocaleString()}/${targetPages.toLocaleString()}`);
    console.log('');
    
    console.log('📈 Database Statistics:');
    console.log(`   Total Pages: ${totalPages.toLocaleString()}`);
    console.log(`   Published: ${publishedPages.toLocaleString()}`);
    console.log(`   Generated: ${generatedPages.toLocaleString()}`);
    console.log(`   Draft: ${draftPages.toLocaleString()}`);
    console.log(`   Created Today: ${todayPages.toLocaleString()}`);
    console.log('');

    // Top themes
    const topThemes = await Page.aggregate([
      { $group: { _id: '$dimensions.theme', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    console.log('🎯 Top Themes:');
    topThemes.forEach((theme, index) => {
      console.log(`   ${index + 1}. ${theme._id || 'Unknown'}: ${theme.count.toLocaleString()} pages`);
    });
    console.log('');

    // Platform distribution
    const platforms = await Page.aggregate([
      { $group: { _id: '$dimensions.platform', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    console.log('📱 Top Platforms:');
    platforms.forEach((platform, index) => {
      console.log(`   ${index + 1}. ${platform._id || 'Unknown'}: ${platform.count.toLocaleString()} pages`);
    });
    
    // ETA calculation
    if (todayPages > 0) {
      const hoursElapsed = (new Date() - new Date(new Date().setHours(0, 0, 0, 0))) / (1000 * 60 * 60);
      const pagesPerHour = todayPages / hoursElapsed;
      const remainingPages = targetPages - totalPages;
      const etaHours = remainingPages / pagesPerHour;
      
      console.log('');
      console.log('⏰ Performance:');
      console.log(`   Current Speed: ${Math.round(pagesPerHour).toLocaleString()} pages/hour`);
      console.log(`   ETA to 1M: ${formatTime(etaHours)}`);
    }
    
    console.log('\n🔄 Monitoring... (Press Ctrl+C to stop)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function createProgressBar(percentage, width = 50) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function formatTime(hours) {
  if (isNaN(hours) || hours === Infinity || hours < 0) return 'Unknown';
  
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours % 1) * 60);
  
  if (days > 0) {
    return `${days}d ${remainingHours}h ${minutes}m`;
  } else if (remainingHours > 0) {
    return `${remainingHours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

async function main() {
  await connectDB();
  
  // Show initial progress
  await showProgress();
  
  // Update every 5 seconds
  setInterval(showProgress, 5000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Monitoring stopped. Goodbye!');
  mongoose.connection.close();
  process.exit(0);
});

main().catch(console.error);