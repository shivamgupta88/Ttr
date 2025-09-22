const mongoose = require('mongoose');

const urlMappingSchema = new mongoose.Schema({
  oldUrl: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  newUrl: {
    type: String,
    required: true,
    index: true
  },
  redirectType: {
    type: Number,
    enum: [301, 302, 200],
    default: 301
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  reason: {
    type: String,
    enum: ['URL_RESTRUCTURE', 'SEO_OPTIMIZATION', 'CONTENT_MIGRATION', 'GOOGLE_INDEXED'],
    default: 'URL_RESTRUCTURE'
  },
  hitCount: {
    type: Number,
    default: 0
  },
  lastHit: {
    type: Date
  },
  source: {
    type: String,
    enum: ['GOOGLE_SEARCH', 'DIRECT_LINK', 'SOCIAL_MEDIA', 'INTERNAL_LINK'],
    default: 'GOOGLE_SEARCH'
  }
}, {
  timestamps: true,
  collection: 'url_mappings'
});

// Indexes for performance
urlMappingSchema.index({ oldUrl: 1, isActive: 1 });
urlMappingSchema.index({ redirectType: 1, isActive: 1 });
urlMappingSchema.index({ createdAt: -1 });
urlMappingSchema.index({ hitCount: -1 });

// Instance method to record a hit
urlMappingSchema.methods.recordHit = function() {
  this.hitCount = (this.hitCount || 0) + 1;
  this.lastHit = new Date();
  return this.save();
};

// Static method to find redirect for URL
urlMappingSchema.statics.findRedirect = async function(url) {
  // Clean the URL for consistent matching
  const cleanUrl = url.toLowerCase().replace(/\/$/, '');

  // Try exact match first
  let mapping = await this.findOne({
    oldUrl: cleanUrl,
    isActive: true
  });

  // If no exact match, try pattern matching for content URLs
  if (!mapping && cleanUrl.includes('/content/')) {
    mapping = await this.findOne({
      oldUrl: { $regex: new RegExp(cleanUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) },
      isActive: true
    });
  }

  return mapping;
};

// Static method to get popular old URLs
urlMappingSchema.statics.getPopularRedirects = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ hitCount: -1 })
    .limit(limit);
};

// Virtual for display URL
urlMappingSchema.virtual('displayOldUrl').get(function() {
  return this.oldUrl.startsWith('/') ? this.oldUrl : `/${this.oldUrl}`;
});

urlMappingSchema.virtual('displayNewUrl').get(function() {
  return this.newUrl.startsWith('/') ? this.newUrl : `/${this.newUrl}`;
});

module.exports = mongoose.model('URLMapping', urlMappingSchema);