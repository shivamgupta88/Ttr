#!/usr/bin/env node

const { spawn } = require('child_process');
const mongoose = require('mongoose');
require('dotenv').config();

// Configuration for 1M pages
const TOTAL_TARGET = 1000000;
const BATCH_SIZE = 5000; // We know this works
const BATCHES_NEEDED = Math.ceil(TOTAL_TARGET / BATCH_SIZE); // 200 batches
const WORKERS = 8;

let currentBatch = 1;
let totalGenerated = 0;
let startTime = Date.now();

console.log('🚀 TextToReels.in - Smart 1M Page Generation');
console.log('=============================================');
console.log(`🎯 Target: ${TOTAL_TARGET.toLocaleString()} pages`);
console.log(`📦 Strategy: ${BATCHES_NEEDED} batches of ${BATCH_SIZE.toLocaleString()} pages each`);
console.log(`👥 Workers: ${WORKERS} per batch`);
console.log('');

async function getCurrentCount() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const count = await db.collection('pages').countDocuments();
    mongoose.connection.close();
    return count;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return 0;
  }
}

function showProgress(batchNum, generated) {
  const progress = (generated / TOTAL_TARGET * 100).toFixed(2);
  const elapsed = (Date.now() - startTime) / 1000;
  const rate = generated / elapsed;
  const eta = (TOTAL_TARGET - generated) / rate;
  
  console.clear();
  console.log('🚀 TextToReels.in - Smart 1M Page Generation');
  console.log('=============================================');
  console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
  console.log(`📊 Progress: ${createProgressBar(parseFloat(progress))} ${progress}%`);
  console.log(`✅ Generated: ${generated.toLocaleString()}/${TOTAL_TARGET.toLocaleString()} pages`);
  console.log(`🔢 Batch: ${batchNum}/${BATCHES_NEEDED}`);
  console.log('');
  console.log(`⚡ Speed: ${Math.round(rate)} pages/second`);
  console.log(`📈 Speed: ${Math.round(rate * 60).toLocaleString()} pages/minute`);
  console.log(`⏱️  ETA: ${formatTime(eta)}`);
  
  if (generated >= TOTAL_TARGET) {
    console.log('');
    console.log('🎉 CONGRATULATIONS! 1 MILLION PAGES GENERATED!');
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`⏱️  Total Time: ${formatTime(totalTime)}`);
    console.log(`📊 Final Speed: ${Math.round(TOTAL_TARGET / totalTime)} pages/second`);
    process.exit(0);
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

async function runBatch() {
  return new Promise((resolve) => {
    console.log(`\n🔄 Starting Batch ${currentBatch}/${BATCHES_NEEDED}...`);
    
    const child = spawn('npm', ['run', 'generate', '--', `--pages=${BATCH_SIZE}`, `--batch=1000`, `--workers=${WORKERS}`], {
      stdio: 'pipe'
    });
    
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });
    
    child.on('close', async (code) => {
      const newCount = await getCurrentCount();
      totalGenerated = newCount;
      
      showProgress(currentBatch, totalGenerated);
      
      if (totalGenerated >= TOTAL_TARGET) {
        console.log('🎉 TARGET REACHED!');
        resolve();
        return;
      }
      
      currentBatch++;
      
      if (currentBatch <= BATCHES_NEEDED) {
        // Wait 2 seconds between batches
        setTimeout(runBatch, 2000);
      }
      
      resolve();
    });
  });
}

async function main() {
  // Show initial count
  const initialCount = await getCurrentCount();
  totalGenerated = initialCount;
  
  showProgress(0, totalGenerated);
  
  if (totalGenerated >= TOTAL_TARGET) {
    console.log('🎉 Target already reached!');
    return;
  }
  
  console.log('\n🚀 Starting smart batch generation...');
  await runBatch();
}

main().catch(console.error);