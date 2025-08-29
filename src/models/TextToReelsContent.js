const mongoose = require("mongoose");

const textToReelsContentSchema = new mongoose.Schema(
  {
    contentId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    isActive: { 
      type: Boolean, 
      required: true, 
      default: true,
      index: true 
    },
    slug: { 
      type: String, 
      required: true,
      unique: true,
      index: true 
    },
    contentType: { 
      type: String, 
      required: true,
      index: true,
      enum: [
        'love_quotes', 'motivational_quotes', 'funny_memes', 'success_quotes',
        'life_lessons', 'friendship_quotes', 'inspirational_stories', 
        'trending_thoughts', 'relationship_advice', 'self_care_tips'
      ]
    },
    language: { 
      type: String, 
      required: true,
      index: true,
      enum: ['hindi', 'english', 'hinglish', 'punjabi', 'gujarati']
    },
    theme: { 
      type: String, 
      required: true,
      index: true,
      enum: [
        'dark_theme', 'light_theme', 'gradient_theme', 
        'minimalist_theme', 'colorful_theme', 'neon_theme'
      ]
    },
    platform: { 
      type: String, 
      required: true,
      index: true,
      enum: [
        'instagram_post', 'instagram_story', 'twitter_post', 
        'facebook_post', 'linkedin_post', 'tiktok_video', 'youtube_shorts'
      ]
    },
    audience: { 
      type: String, 
      required: true,
      index: true,
      enum: [
        'students', 'professionals', 'entrepreneurs', 'teenagers',
        'young_adults', 'fitness_enthusiasts', 'travelers', 'booklovers'
      ]
    },
    metaTitle: [{ 
      type: String,
      required: true,
      maxlength: 60 
    }],
    shortDescription: { 
      type: String, 
      required: true,
      maxlength: 150 
    },
    description: { 
      type: String, 
      required: true,
      maxlength: 1000 
    },
    contentText: {
      primary: { 
        type: String, 
        required: true 
      },
      variations: [{ 
        type: String 
      }],
      hashtags: [{ 
        type: String 
      }],
      callToAction: { 
        type: String 
      }
    },
    designSpecs: {
      colorScheme: [{ 
        type: String 
      }],
      fontStyle: { 
        type: String 
      },
      layout: { 
        type: String 
      },
      elements: [{ 
        type: String 
      }]
    },
    seoData: {
      keywords: [{ 
        type: String, 
        required: true 
      }],
      canonicalUrl: { 
        type: String, 
        required: true 
      },
      ogImage: { 
        type: String 
      }
    },
    usageStats: {
      difficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
      },
      estimatedEngagement: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      bestTimeToPost: { 
        type: String, 
        enum: ['morning', 'afternoon', 'evening', 'night']
      },
      platformOptimization: { 
        type: String 
      },
      views: { 
        type: Number, 
        default: 0 
      },
      shares: { 
        type: Number, 
        default: 0 
      },
      likes: { 
        type: Number, 
        default: 0 
      }
    },
    relatedContent: [{ 
      type: String 
    }],
    creatorTips: [{ 
      type: String 
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound indexes for better query performance
textToReelsContentSchema.index({ isActive: 1, contentType: 1 });
textToReelsContentSchema.index({ isActive: 1, language: 1, theme: 1 });
textToReelsContentSchema.index({ isActive: 1, platform: 1, audience: 1 });
textToReelsContentSchema.index({ createdAt: -1 });
textToReelsContentSchema.index({ 'usageStats.views': -1 });
textToReelsContentSchema.index({ 'usageStats.estimatedEngagement': 1 });

// Text index for full-text search
textToReelsContentSchema.index({
  'metaTitle': 'text',
  'description': 'text',
  'shortDescription': 'text',
  'seoData.keywords': 'text',
  'contentText.primary': 'text',
  'contentText.variations': 'text'
});

// Virtual for primary meta title
textToReelsContentSchema.virtual('primaryTitle').get(function() {
  return Array.isArray(this.metaTitle) ? this.metaTitle[0] : this.metaTitle;
});

// Virtual for content category display
textToReelsContentSchema.virtual('categoryDisplay').get(function() {
  return `${this.contentType.replace(/_/g, ' ')} (${this.language})`;
});

// Virtual for platform display
textToReelsContentSchema.virtual('platformDisplay').get(function() {
  return this.platform.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

// Static method to find trending content
textToReelsContentSchema.statics.findTrending = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'usageStats.views': -1, 'usageStats.shares': -1 })
    .limit(limit);
};

// Static method to find content by category
textToReelsContentSchema.statics.findByCategory = function(contentType, language = null, limit = 20) {
  const query = { isActive: true, contentType };
  if (language) query.language = language;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find content for specific platform and audience
textToReelsContentSchema.statics.findForAudience = function(platform, audience, limit = 15) {
  return this.find({ 
    isActive: true, 
    platform, 
    audience 
  })
  .sort({ 'usageStats.estimatedEngagement': -1, createdAt: -1 })
  .limit(limit);
};

// Instance method to get SEO-friendly URL
textToReelsContentSchema.methods.getSEOUrl = function(baseUrl = 'https://texttoreels.in') {
  return `${baseUrl}/content/${this.slug}`;
};

// Instance method to increment view count
textToReelsContentSchema.methods.incrementViews = function() {
  this.usageStats.views = (this.usageStats.views || 0) + 1;
  return this.save();
};

// Instance method to get structured data for SEO
textToReelsContentSchema.methods.getStructuredData = function() {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": this.primaryTitle,
    "description": this.shortDescription,
    "url": this.getSEOUrl(),
    "creator": {
      "@type": "Organization",
      "name": "TextToReels.in"
    },
    "keywords": this.seoData.keywords.join(', '),
    "inLanguage": this.language,
    "audience": {
      "@type": "Audience",
      "audienceType": this.audience
    }
  };
};

// Pre-save middleware to ensure slug uniqueness and generate canonical URL
textToReelsContentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('slug')) {
    // Ensure slug is URL-friendly
    this.slug = this.slug.toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check for uniqueness
    const existingDoc = await this.constructor.findOne({ 
      slug: this.slug, 
      _id: { $ne: this._id } 
    });
    
    if (existingDoc) {
      const timestamp = Date.now().toString(36);
      this.slug = `${this.slug}-${timestamp}`;
    }
  }
  
  // Generate canonical URL if not set
  if (!this.seoData.canonicalUrl) {
    this.seoData.canonicalUrl = `https://texttoreels.in/content/${this.slug}`;
  }
  
  next();
});

// Pre-save middleware to generate content ID if not set
textToReelsContentSchema.pre('save', function(next) {
  if (!this.contentId) {
    this.contentId = `ttr_${this.contentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model("TextToReelsContent", textToReelsContentSchema);