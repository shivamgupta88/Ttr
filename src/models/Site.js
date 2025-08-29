const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    siteId: { 
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
    slugId: { 
      type: String, 
      required: true,
      index: true 
    },
    slug: { 
      type: String, 
      required: true,
      unique: true,
      index: true 
    },
    metaTitle: [{ 
      type: String,
      required: true 
    }],
    location: {
      lat: { 
        type: Number, 
        required: true 
      },
      lng: { 
        type: Number, 
        required: true 
      },
      city: { 
        type: String, 
        required: true,
        index: true 
      },
      district: { 
        type: String, 
        required: true 
      },
      state: { 
        type: String, 
        required: true,
        index: true 
      },
      region: { 
        type: String, 
        required: true 
      },
      country: { 
        type: String, 
        required: true, 
        default: "India" 
      },
      pinCode: { 
        type: String, 
        required: true 
      },
    },
    propertyType: { 
      type: String, 
      required: true,
      index: true 
    },
    shortDescription: { 
      type: String, 
      required: true,
      maxlength: 500 
    },
    description: { 
      type: String, 
      required: true,
      maxlength: 2000 
    },
    localities: [[{ 
      type: String, 
      required: true 
    }]],
    quickLinks: [[{ 
      type: String, 
      required: true 
    }]],
    sublocalities: [[{ 
      type: String, 
      required: true 
    }]],
    keywords: [{ 
      type: String, 
      required: true 
    }],
    faq: [
      {
        question: { 
          type: String, 
          required: true 
        },
        answer: { 
          type: String, 
          required: true 
        },
      },
    ],
    footer: {
      title: { 
        type: String, 
        required: true 
      },
      description: { 
        type: String, 
        required: true 
      },
    },
  },
  { 
    timestamps: true,
    // Add text index for search functionality
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound indexes for better query performance
siteSchema.index({ isActive: 1, 'location.city': 1 });
siteSchema.index({ isActive: 1, propertyType: 1 });
siteSchema.index({ isActive: 1, 'location.state': 1, 'location.city': 1 });
siteSchema.index({ createdAt: -1 });

// Text index for full-text search
siteSchema.index({
  'metaTitle': 'text',
  'description': 'text',
  'shortDescription': 'text',
  'keywords': 'text',
  'location.city': 'text',
  'propertyType': 'text'
});

// Virtual for full location string
siteSchema.virtual('fullLocation').get(function() {
  return `${this.location.city}, ${this.location.district}, ${this.location.state}`;
});

// Virtual for primary meta title
siteSchema.virtual('primaryTitle').get(function() {
  return Array.isArray(this.metaTitle) ? this.metaTitle[0] : this.metaTitle;
});

// Static method to find active sites
siteSchema.statics.findActive = function(conditions = {}) {
  return this.find({ isActive: true, ...conditions });
};

// Static method to find by location
siteSchema.statics.findByLocation = function(city, state, limit = 50) {
  return this.findActive({
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i')
  }).limit(limit);
};

// Static method to find by property type
siteSchema.statics.findByPropertyType = function(propertyType, limit = 50) {
  return this.findActive({
    propertyType: new RegExp(propertyType, 'i')
  }).limit(limit);
};

// Instance method to get SEO-friendly URL
siteSchema.methods.getSEOUrl = function(baseUrl = 'https://reeltor.com') {
  return `${baseUrl}/${this.slug}`;
};

// Instance method to get structured data for SEO
siteSchema.methods.getStructuredData = function() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Reeltor.com",
    "description": this.shortDescription,
    "url": this.getSEOUrl(),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": this.location.city,
      "addressRegion": this.location.state,
      "addressCountry": this.location.country,
      "postalCode": this.location.pinCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": this.location.lat,
      "longitude": this.location.lng
    }
  };
};

// Pre-save middleware to ensure slug uniqueness and generate if needed
siteSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('slug')) {
    // Ensure slug is URL-friendly
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
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
  
  next();
});

// Pre-save middleware to validate coordinates
siteSchema.pre('save', function(next) {
  // Validate latitude and longitude
  if (this.location.lat < -90 || this.location.lat > 90) {
    return next(new Error('Latitude must be between -90 and 90'));
  }
  
  if (this.location.lng < -180 || this.location.lng > 180) {
    return next(new Error('Longitude must be between -180 and 180'));
  }
  
  next();
});

// Export the model
module.exports = mongoose.model("Site", siteSchema);