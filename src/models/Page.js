const mongoose = require('mongoose');
const crypto = require('crypto');

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Content Generation Data
  dimensions: {
    theme: { type: String, required: true, index: true },
    language: { type: String, required: true, index: true },
    style: { type: String, required: true, index: true },
    platform: { type: String, required: true },
    audience: { type: String, required: true },
    emotion: { type: String, required: true },
    occasion: String,
    length: { type: String, enum: ['short', 'medium', 'long'], default: 'medium' }
  },
  
  // Generated Content
  content: {
    title: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    introduction: String,
    features: [String],
    examples: [String],
    callToAction: String,
    footerText: String,
    uniqueValue: String // Unique content differentiator
  },
  
  // SEO Optimization
  seo: {
    metaTitle: { type: String, required: true, index: true },
    metaDescription: { type: String, required: true },
    keywords: [String],
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    structuredData: Object,
    breadcrumbs: [Object]
  },
  
  // Analytics & Performance
  performance: {
    views: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    avgTimeOnPage: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  
  // Quality Metrics
  quality: {
    readabilityScore: Number,
    uniquenessScore: { type: Number, default: 100 }, // 0-100
    sentimentScore: Number,
    keywordDensity: Number,
    contentLength: Number
  },
  
  // Generation Metadata
  generation: {
    algorithm: { type: String, default: 'v1.0' },
    batch: String,
    hash: String, // Content hash for uniqueness checking
    variations: Number, // How many variations of this combination exist
    templateVersion: String
  },
  
  // Status & Flags
  status: {
    type: String,
    enum: ['draft', 'generated', 'published', 'archived'],
    default: 'draft'
  },
  
  isActive: { type: Boolean, default: true },
  publishedAt: Date,
  
}, {
  timestamps: true,
  collection: 'pages'
});

// Compound indexes for better query performance
pageSchema.index({ 'dimensions.theme': 1, 'dimensions.language': 1 });
pageSchema.index({ 'dimensions.platform': 1, status: 1 });
pageSchema.index({ 'generation.hash': 1 }); // For duplicate checking
pageSchema.index({ status: 1, createdAt: -1 }); // For filtering by status and date
pageSchema.index({ 'dimensions.theme': 1, 'dimensions.platform': 1, status: 1 }); // For theme-platform queries
pageSchema.index({ isActive: 1, publishedAt: -1 }); // For published content queries

// Generate content hash before saving
pageSchema.pre('save', function(next) {
  if (this.isModified('content') || this.isNew) {
    const contentString = JSON.stringify({
      ...this.content,
      ...this.dimensions
    });
    this.generation.hash = crypto.createHash('sha256').update(contentString).digest('hex');
  }
  next();
});

// Virtual for URL
pageSchema.virtual('url').get(function() {
  return `/${this.slug}`;
});

// Static method to check uniqueness
pageSchema.statics.checkUniqueness = async function(contentHash) {
  const existing = await this.findOne({ 'generation.hash': contentHash });
  return !existing;
};

// Static method for bulk operations with optimized performance
pageSchema.statics.bulkInsertUnique = async function(pages, options = {}) {
  const { batchSize = 5000, skipDuplicates = true } = options;
  const results = {
    inserted: 0,
    duplicates: 0,
    errors: 0
  };
  
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    
    try {
      if (skipDuplicates) {
        // Use aggregation pipeline for faster duplicate checking
        const hashes = batch.map(p => p.generation.hash);
        const existingHashes = await this.aggregate([
          { $match: { 'generation.hash': { $in: hashes } } },
          { $group: { _id: '$generation.hash' } }
        ]).exec();
        
        const existingHashSet = new Set(existingHashes.map(item => item._id));
        const uniquePages = batch.filter(p => !existingHashSet.has(p.generation.hash));
        
        if (uniquePages.length > 0) {
          // Use ordered: false and bypass mongoose validation for speed
          await this.collection.insertMany(uniquePages, { 
            ordered: false, 
            writeConcern: { w: 1, j: false } // Faster write concern
          });
          results.inserted += uniquePages.length;
        }
        results.duplicates += batch.length - uniquePages.length;
      } else {
        await this.collection.insertMany(batch, { 
          ordered: false,
          writeConcern: { w: 1, j: false }
        });
        results.inserted += batch.length;
      }
    } catch (error) {
      // Handle duplicate key errors more gracefully
      if (error.code === 11000) {
        // Parse duplicate key errors to get accurate counts
        const writeErrors = error.writeErrors || [];
        results.duplicates += writeErrors.length;
        results.inserted += batch.length - writeErrors.length;
      } else {
        console.error(`Batch ${i}-${i + batchSize} error:`, error.message);
        results.errors += batch.length;
      }
    }
  }
  
  return results;
};

module.exports = mongoose.model('Page', pageSchema);