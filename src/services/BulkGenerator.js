const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const cluster = require('cluster');
const os = require('os');
const path = require('path');
const ContentGenerator = require('./ContentGenerator');
const Page = require('../models/Page');

class BulkGenerator {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 5000; // Increased for better performance
    this.maxWorkers = options.maxWorkers || os.cpus().length;
    this.targetPages = options.targetPages || 1000000;
    this.contentGenerator = new ContentGenerator();
    this.generatedCount = 0;
    this.startTime = Date.now();
    this.duplicateCount = 0;
    this.errorCount = 0;
  }
  
  /**
   * Main generation orchestrator - uses M4's full power
   */
  async generatePagesInParallel() {
    console.log(`🚀 Starting bulk generation: ${this.targetPages} pages with ${this.maxWorkers} workers`);
    
    try {
      // Calculate dimension combinations
      const combinations = await this.calculateDimensionCombinations();
      console.log(`📊 Total possible combinations: ${combinations.total.toLocaleString()}`);
      
      if (combinations.total < this.targetPages) {
        console.log(`⚠️  Warning: Only ${combinations.total} unique combinations possible, adjusting target...`);
        this.targetPages = combinations.total;
      }
      
      // Generate pages using worker threads for maximum efficiency
      const results = await this.generateWithWorkerThreads(combinations.dimensions);
      
      // Final stats
      const duration = (Date.now() - this.startTime) / 1000;
      const pagesPerSecond = results.inserted / duration;
      
      console.log(`✅ Generation Complete!`);
      console.log(`📈 Results:`);
      console.log(`   - Generated: ${results.inserted.toLocaleString()} pages`);
      console.log(`   - Duplicates: ${results.duplicates.toLocaleString()}`);
      console.log(`   - Errors: ${results.errors.toLocaleString()}`);
      console.log(`   - Duration: ${duration.toFixed(2)} seconds`);
      console.log(`   - Speed: ${pagesPerSecond.toFixed(0)} pages/second`);
      console.log(`   - Memory Used: ${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Bulk generation failed:', error);
      throw error;
    }
  }
  
  /**
   * Calculate all possible dimension combinations
   */
  async calculateDimensionCombinations() {
    const dimensions = require('../../data/datasets/dimensions');
    
    const combos = {
      themes: dimensions.themes.length,
      languages: dimensions.languages.length,
      styles: dimensions.styles.length,
      platforms: dimensions.platforms.length,
      audiences: dimensions.audiences.length,
      emotions: dimensions.emotions.length,
      occasions: dimensions.occasions.length,
      lengths: dimensions.lengths.length
    };
    
    const total = Object.values(combos).reduce((acc, val) => acc * val, 1);
    
    return {
      dimensions,
      combos,
      total
    };
  }
  
  /**
   * Generate using worker threads for maximum M4 utilization
   */
  async generateWithWorkerThreads(dimensions) {
    const chunkSize = Math.ceil(this.targetPages / this.maxWorkers);
    const workers = [];
    const results = { inserted: 0, duplicates: 0, errors: 0 };
    const workerStats = new Map(); // Track per-worker stats
    
    console.log('\n📊 Real-time Progress Dashboard:');
    console.log('=====================================');
    
    // Create worker pool
    for (let i = 0; i < this.maxWorkers; i++) {
      const startIndex = i * chunkSize;
      const endIndex = Math.min(startIndex + chunkSize, this.targetPages);
      
      if (startIndex >= this.targetPages) break;
      
      // Initialize worker stats
      workerStats.set(i, { processed: 0, errors: 0, duplicates: 0, rate: 0 });
      
      const worker = new Promise((resolve, reject) => {
        const workerInstance = new Worker(__filename, {
          workerData: {
            dimensions,
            startIndex,
            endIndex,
            workerId: i,
            batchSize: this.batchSize
          }
        });
        
        workerInstance.on('message', (result) => {
          if (result.type === 'progress') {
            // Update worker stats
            const stats = workerStats.get(result.workerId || i) || {};
            stats.processed = result.processed;
            stats.errors = result.errors || 0;
            stats.duplicates = result.duplicates || 0;
            
            const elapsed = (Date.now() - this.startTime) / 1000;
            stats.rate = elapsed > 0 ? result.processed / elapsed : 0;
            workerStats.set(result.workerId || i, stats);
            
            // Display real-time dashboard
            this.displayProgressDashboard(workerStats, elapsed);
          } else if (result.type === 'complete') {
            resolve(result.data);
          }
        });
        
        workerInstance.on('error', reject);
        workerInstance.on('exit', (code) => {
          if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
      });
      
      workers.push(worker);
    }
    
    // Wait for all workers to complete
    const workerResults = await Promise.all(workers);
    
    // Aggregate results
    workerResults.forEach(result => {
      results.inserted += result.inserted;
      results.duplicates += result.duplicates;
      results.errors += result.errors;
    });
    
    console.log('\n✅ All workers completed');
    return results;
  }
  
  /**
   * Generate single batch of pages
   */
  async generateBatch(dimensions, startIndex, count, workerId = 0) {
    const pages = [];
    const batchResults = { inserted: 0, duplicates: 0, errors: 0 };
    
    try {
      // Generate dimension combinations for this batch
      const combinations = this.generateCombinations(dimensions, startIndex, count);
      
      console.log(`Worker ${workerId}: Generating ${combinations.length} combinations...`);
      
      // Generate content for each combination
      for (let i = 0; i < combinations.length; i++) {
        try {
          const combo = combinations[i];
          const variationIndex = Math.floor((startIndex + i) / this.getCombinationCount(dimensions));
          
          // Skip invalid combinations
          const contentGenerator = this.contentGenerator || new (require('./ContentGenerator'))();
          if (!contentGenerator.isValidCombination(combo)) {
            console.log(`Worker ${workerId}: Skipping invalid combination: ${JSON.stringify(combo)}`);
            continue;
          }
          
          const pageData = contentGenerator.generateUniqueContent(combo, variationIndex);
          
          // Create page object
          const page = {
            ...pageData,
            status: 'generated',
            generation: {
              ...pageData.generation,
              batch: `batch_${workerId}_${Math.floor(i / this.batchSize)}`
            }
          };
          
          pages.push(page);
          
          // Send progress updates every 50 pages or at completion
          if ((i + 1) % 50 === 0 || i === combinations.length - 1) {
            const progressPercentage = ((i + 1) / combinations.length * 100).toFixed(1);
            console.log(`Worker ${workerId}: Generated ${i + 1}/${combinations.length} combinations (${progressPercentage}%) - ${pages.length} valid pages`);
          }
          
        } catch (error) {
          // Handle different types of errors gracefully
          if (error.message.includes('Invalid combination')) {
            console.log(`Worker ${workerId}: Skipped invalid combination at index ${startIndex + i}`);
          } else {
            console.error(`Worker ${workerId}: Error generating page ${startIndex + i}:`, error.message);
          }
          batchResults.errors++;
        }
      }
      
      // Bulk insert to MongoDB
      if (pages.length > 0) {
        console.log(`Worker ${workerId}: Inserting ${pages.length} pages to database...`);
        const insertResult = await Page.bulkInsertUnique(pages, {
          batchSize: this.batchSize,
          skipDuplicates: true
        });
        
        batchResults.inserted += insertResult.inserted;
        batchResults.duplicates += insertResult.duplicates;
        batchResults.errors += insertResult.errors;
      }
      
    } catch (error) {
      console.error(`Batch generation error:`, error);
      batchResults.errors += count;
    }
    
    return batchResults;
  }
  
  /**
   * Generate dimension combinations
   */
  generateCombinations(dimensions, startIndex, count) {
    const combinations = [];
    const totalCombos = this.getCombinationCount(dimensions);
    
    for (let i = 0; i < count; i++) {
      const globalIndex = (startIndex + i) % totalCombos;
      const combo = this.indexToDimensions(globalIndex, dimensions);
      combinations.push(combo);
    }
    
    return combinations;
  }
  
  /**
   * Convert linear index to dimension combination
   */
  indexToDimensions(index, dimensions) {
    const combo = {};
    let remaining = index;
    
    const keys = ['themes', 'languages', 'styles', 'platforms', 'audiences', 'emotions'];
    const sizes = keys.map(key => dimensions[key].length);
    
    for (let i = keys.length - 1; i >= 0; i--) {
      const size = sizes[i];
      combo[keys[i].slice(0, -1)] = dimensions[keys[i]][remaining % size]; // Remove 's' from key
      remaining = Math.floor(remaining / size);
    }
    
    // Add occasion and length with some variation
    combo.occasion = dimensions.occasions[index % dimensions.occasions.length];
    combo.length = dimensions.lengths[index % dimensions.lengths.length];
    
    return combo;
  }
  
  /**
   * Calculate total combination count
   */
  getCombinationCount(dimensions) {
    return dimensions.themes.length * 
           dimensions.languages.length * 
           dimensions.styles.length * 
           dimensions.platforms.length * 
           dimensions.audiences.length * 
           dimensions.emotions.length;
  }
  
  /**
   * Generate pages in smaller chunks for memory efficiency
   */
  async generateInChunks(targetCount = 1000000) {
    const chunkSize = 50000; // Process 50k at a time
    const results = { inserted: 0, duplicates: 0, errors: 0 };
    
    for (let i = 0; i < targetCount; i += chunkSize) {
      const currentChunkSize = Math.min(chunkSize, targetCount - i);
      console.log(`\n📦 Processing chunk ${Math.floor(i/chunkSize) + 1}: ${i.toLocaleString()} - ${(i + currentChunkSize).toLocaleString()}`);
      
      const chunkResult = await this.generateBatch(
        require('../../data/datasets/dimensions'),
        i,
        currentChunkSize,
        Math.floor(i/chunkSize)
      );
      
      results.inserted += chunkResult.inserted;
      results.duplicates += chunkResult.duplicates;
      results.errors += chunkResult.errors;
      
      // Memory cleanup
      if (global.gc) global.gc();
      
      const progress = ((i + currentChunkSize) / targetCount * 100).toFixed(1);
      console.log(`✅ Chunk complete. Total progress: ${progress}%`);
    }
    
    return results;
  }
  
  /**
   * Get generation statistics
   */
  getStats() {
    const duration = (Date.now() - this.startTime) / 1000;
    return {
      generated: this.generatedCount,
      duplicates: this.duplicateCount,
      errors: this.errorCount,
      duration,
      pagesPerSecond: this.generatedCount / duration,
      memoryUsage: process.memoryUsage()
    };
  }
  
  /**
   * Format time in human readable format
   */
  formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return 'Unknown';
    
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
  
  /**
   * Display real-time progress dashboard
   */
  displayProgressDashboard(workerStats, elapsed) {
    // Clear previous output and move cursor to top
    process.stdout.write('\x1B[2J\x1B[0f');
    
    console.log('🚀 TextToReels.in Bulk Generation Dashboard');
    console.log('==========================================');
    console.log(`⏱️  Elapsed: ${this.formatTime(elapsed)}`);
    console.log(`🎯 Target: ${this.targetPages.toLocaleString()} pages`);
    console.log(`👥 Workers: ${workerStats.size}\n`);
    
    let totalProcessed = 0;
    let totalErrors = 0;
    let totalDuplicates = 0;
    let totalRate = 0;
    
    // Display per-worker stats
    console.log('Worker Status:');
    for (const [workerId, stats] of workerStats) {
      const progress = (stats.processed / (this.targetPages / workerStats.size) * 100).toFixed(1);
      const statusBar = this.createProgressBar(parseFloat(progress), 20);
      
      console.log(`Worker ${workerId}: ${statusBar} ${progress}% | ${stats.processed.toLocaleString()} pages | ${stats.rate.toFixed(0)} p/s | E:${stats.errors} D:${stats.duplicates}`);
      
      totalProcessed += stats.processed;
      totalErrors += stats.errors;
      totalDuplicates += stats.duplicates;
      totalRate += stats.rate;
    }
    
    // Display overall stats
    const overallProgress = (totalProcessed / this.targetPages * 100).toFixed(1);
    const eta = totalRate > 0 ? (this.targetPages - totalProcessed) / totalRate : 0;
    
    console.log('\n📊 Overall Progress:');
    console.log(`${this.createProgressBar(parseFloat(overallProgress), 40)} ${overallProgress}%`);
    console.log(`✅ Generated: ${totalProcessed.toLocaleString()}/${this.targetPages.toLocaleString()}`);
    console.log(`🚀 Speed: ${totalRate.toFixed(0)} pages/second`);
    console.log(`❌ Errors: ${totalErrors} | 🔄 Duplicates: ${totalDuplicates}`);
    console.log(`⏰ ETA: ${this.formatTime(eta)}`);
    
    const memUsage = process.memoryUsage();
    console.log(`💾 Memory: ${(memUsage.heapUsed / 1024 / 1024).toFixed(0)}MB used`);
  }
  
  /**
   * Create visual progress bar
   */
  createProgressBar(percentage, width = 20) {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

// Worker thread execution
if (!isMainThread) {
  const { dimensions, startIndex, endIndex, workerId, batchSize } = workerData;
  
  (async () => {
    try {
      const generator = new BulkGenerator({ batchSize });
      const count = endIndex - startIndex;
      
      // Connect to database in worker
      require('dotenv').config();
      await require('../config/database')();
      
      // Generate batch
      const result = await generator.generateBatch(dimensions, startIndex, count, workerId);
      
      // Send progress updates
      parentPort.postMessage({
        type: 'progress',
        processed: result.inserted,
        percentage: ((result.inserted / count) * 100).toFixed(1),
        workerId: workerId,
        errors: result.errors,
        duplicates: result.duplicates
      });
      
      // Send final result
      parentPort.postMessage({
        type: 'complete',
        data: result
      });
      
    } catch (error) {
      parentPort.postMessage({
        type: 'error',
        error: error.message
      });
    }
  })();
}

module.exports = BulkGenerator;