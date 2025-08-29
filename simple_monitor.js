#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

let lastCount = 0;
let startTime = Date.now();

async function showProgress() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const count = await db.collection('pages').countDocuments();
    
    const progress = (count / 1000000 * 100).toFixed(2);
    const newPages = count - lastCount;
    const elapsed = (Date.now() - startTime) / 1000;
    
    console.log(`🕐 ${new Date().toLocaleTimeString()} | 📊 ${count.toLocaleString()}/1M (${progress}%) | +${newPages} new | Speed: ${Math.round(newPages/10*60)} p/min`);
    
    lastCount = count;
    startTime = Date.now();
    
    if (count >= 1000000) {
      console.log('🎉 1 MILLION PAGES COMPLETED! 🎉');
      process.exit(0);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  mongoose.connection.close();
}

console.log('📊 TextToReels.in - Simple Progress Monitor');
console.log('==========================================');

// Update every 10 seconds
setInterval(showProgress, 10000);
showProgress();