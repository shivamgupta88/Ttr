const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Page reference
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true,
    index: true
  },
  
  slug: {
    type: String,
    required: true,
    index: true
  },
  
  // Time tracking
  date: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
  },
  
  hour: {
    type: Number,
    min: 0,
    max: 23,
    index: true
  },
  
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    index: true
  },
  
  // Traffic metrics
  pageViews: {
    type: Number,
    default: 0
  },
  
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  
  sessions: {
    type: Number,
    default: 0
  },
  
  bounces: {
    type: Number,
    default: 0
  },
  
  // Engagement metrics
  avgTimeOnPage: {
    type: Number,
    default: 0
  },
  
  scrollDepth: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  interactions: {
    clicks: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    ctaClicks: { type: Number, default: 0 }
  },
  
  // Traffic sources
  sources: {
    organic: { type: Number, default: 0 },
    direct: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    referral: { type: Number, default: 0 },
    email: { type: Number, default: 0 },
    paid: { type: Number, default: 0 }
  },
  
  // Search metrics
  searchMetrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    avgPosition: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 }
  },
  
  // Keywords that brought traffic
  keywords: [{
    term: String,
    impressions: Number,
    clicks: Number,
    position: Number
  }],
  
  // Geographic data
  geography: {
    country: String,
    region: String,
    city: String
  },
  
  // Device data
  devices: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  },
  
  // Conversion tracking
  conversions: {
    reelGenerated: { type: Number, default: 0 },
    emailSignup: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  
  // Performance scores
  performance: {
    loadTime: Number,
    coreWebVitals: {
      lcp: Number, // Largest Contentful Paint
      fid: Number, // First Input Delay
      cls: Number  // Cumulative Layout Shift
    }
  }
  
}, {
  timestamps: true,
  collection: 'analytics'
});

// Compound indexes for efficient queries
analyticsSchema.index({ pageId: 1, date: -1 });
analyticsSchema.index({ slug: 1, date: -1 });
analyticsSchema.index({ date: -1, pageViews: -1 });
analyticsSchema.index({ 'searchMetrics.impressions': -1, date: -1 });

// Virtual for bounce rate
analyticsSchema.virtual('bounceRate').get(function() {
  return this.sessions > 0 ? (this.bounces / this.sessions) * 100 : 0;
});

// Virtual for CTR
analyticsSchema.virtual('ctr').get(function() {
  return this.searchMetrics.impressions > 0 
    ? (this.searchMetrics.clicks / this.searchMetrics.impressions) * 100 
    : 0;
});

// Static methods for analytics aggregation
analyticsSchema.statics.getTopPerformingPages = function(limit = 10, dateRange = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - dateRange);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$pageId',
        totalViews: { $sum: '$pageViews' },
        totalUnique: { $sum: '$uniqueVisitors' },
        totalConversions: { $sum: '$conversions.reelGenerated' },
        avgTimeOnPage: { $avg: '$avgTimeOnPage' },
        slug: { $first: '$slug' }
      }
    },
    {
      $sort: { totalViews: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

analyticsSchema.statics.getTrafficTrends = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' }
        },
        totalViews: { $sum: '$pageViews' },
        totalUnique: { $sum: '$uniqueVisitors' },
        totalSessions: { $sum: '$sessions' },
        totalConversions: { $sum: '$conversions.reelGenerated' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);
};

analyticsSchema.statics.getSearchPerformance = function(limit = 50) {
  return this.aggregate([
    {
      $unwind: '$keywords'
    },
    {
      $group: {
        _id: '$keywords.term',
        totalImpressions: { $sum: '$keywords.impressions' },
        totalClicks: { $sum: '$keywords.clicks' },
        avgPosition: { $avg: '$keywords.position' }
      }
    },
    {
      $addFields: {
        ctr: {
          $cond: {
            if: { $gt: ['$totalImpressions', 0] },
            then: { $multiply: [{ $divide: ['$totalClicks', '$totalImpressions'] }, 100] },
            else: 0
          }
        }
      }
    },
    {
      $sort: { totalImpressions: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

analyticsSchema.statics.bulkUpdateMetrics = async function(updates) {
  const bulkOps = updates.map(update => ({
    updateOne: {
      filter: { 
        pageId: update.pageId, 
        date: { 
          $gte: new Date(update.date).setHours(0, 0, 0, 0),
          $lt: new Date(update.date).setHours(23, 59, 59, 999)
        }
      },
      update: { 
        $inc: update.metrics,
        $setOnInsert: {
          pageId: update.pageId,
          slug: update.slug,
          date: update.date,
          hour: new Date(update.date).getHours(),
          dayOfWeek: new Date(update.date).getDay()
        }
      },
      upsert: true
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

module.exports = mongoose.model('Analytics', analyticsSchema);