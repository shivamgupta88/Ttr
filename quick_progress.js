#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

let lastCount = 999;
let startTime = Date.now();

async function checkProgress() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const count = await db.collection('pages').countDocuments();
    
    const progress = ((count/1000000)*100).toFixed(3);
    const newPages = count - lastCount;
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    
    console.log(`🕐 ${new Date().toLocaleTimeString()} | Pages: ${count.toLocaleString()} (${progress}%) | +${newPages} new | Speed: ${Math.round(newPages*6)} pages/min`);
    
    if (newPages > 0) {
      const rate = newPages / (elapsed / 60); // pages per minute
      const eta = (1000000 - count) / rate;
      console.log(`⚡ Rate: ${Math.round(rate)} pages/min | ETA: ${Math.round(eta)} minutes (${Math.round(eta/60)} hours)`);
    }
    
    lastCount = count;
    startTime = Date.now();
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  mongoose.connection.close();
}

// Run every 10 seconds
setInterval(checkProgress, 10000);
checkProgress(); // Initial check