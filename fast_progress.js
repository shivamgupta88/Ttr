#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

let lastCount = 999;
let startTime = Date.now();
let checkCount = 0;

async function showLiveProgress() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const count = await db.collection('pages').countDocuments();
    
    const progress = ((count/1000000)*100).toFixed(3);
    const newPages = count - lastCount;
    const elapsed = (Date.now() - startTime) / 1000;
    
    // Clear screen and show dashboard
    console.clear();
    console.log('🚀 TextToReels.in - LIVE 1M Page Generation');
    console.log('==========================================');
    console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
    console.log(`📊 Progress: ${createProgressBar(parseFloat(progress))} ${progress}%`);
    console.log(`✅ Generated: ${count.toLocaleString()}/1,000,000 pages`);
    console.log(`🆕 New Pages: +${newPages} (last check)`);
    
    if (newPages > 0) {
      const pagesPerSecond = newPages / elapsed;
      const pagesPerMinute = pagesPerSecond * 60;
      const pagesPerHour = pagesPerMinute * 60;
      const remainingPages = 1000000 - count;
      const etaSeconds = remainingPages / pagesPerSecond;
      
      console.log('');
      console.log('⚡ Performance Metrics:');
      console.log(`   Speed: ${Math.round(pagesPerSecond)} pages/second`);
      console.log(`   Speed: ${Math.round(pagesPerMinute).toLocaleString()} pages/minute`);
      console.log(`   Speed: ${Math.round(pagesPerHour).toLocaleString()} pages/hour`);
      console.log('');
      console.log(`⏱️  ETA to 1M: ${formatTime(etaSeconds)}`);
      
      // Progress prediction
      const completionTime = new Date(Date.now() + (etaSeconds * 1000));
      console.log(`🎯 Completion: ${completionTime.toLocaleTimeString()}`);
    }
    
    console.log('');
    console.log(`🔄 Update #${++checkCount} - Refreshing every 5 seconds...`);
    
    if (count >= 1000000) {
      console.log('');
      console.log('🎉 CONGRATULATIONS! 1 MILLION PAGES GENERATED!');
      process.exit(0);
    }
    
    lastCount = count;
    startTime = Date.now();
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

function createProgressBar(percentage, width = 40) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity || seconds < 0) return 'Calculating...';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Show initial progress
showLiveProgress();

// Update every 5 seconds
setInterval(showLiveProgress, 5000);