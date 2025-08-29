const mongoose = require('mongoose');

// Import the site model
const SiteModel = require('../models/Site');

class SiteDataService {
  /**
   * Fetch site data for static generation
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of sites to fetch
   * @param {number} options.skip - Number of sites to skip
   * @param {boolean} options.activeOnly - Whether to fetch only active sites
   * @returns {Promise<Array>} Array of site data
   */
  async fetchSiteData(options = {}) {
    const {
      limit = 100,
      skip = 0,
      activeOnly = true,
      location = null,
      propertyType = null
    } = options;

    try {
      let query = {};
      
      // Filter by active status
      if (activeOnly) {
        query.isActive = true;
      }
      
      // Filter by location if specified
      if (location) {
        if (location.city) query['location.city'] = new RegExp(location.city, 'i');
        if (location.state) query['location.state'] = new RegExp(location.state, 'i');
      }
      
      // Filter by property type if specified
      if (propertyType) {
        query.propertyType = new RegExp(propertyType, 'i');
      }

      const sites = await SiteModel
        .find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }) // Most recent first
        .lean(); // Return plain objects for better performance

      return sites;
    } catch (error) {
      console.error('Error fetching site data:', error);
      throw new Error(`Failed to fetch site data: ${error.message}`);
    }
  }

  /**
   * Get total count of sites for pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async getTotalCount(filters = {}) {
    try {
      let query = { isActive: true };
      
      if (filters.location) {
        if (filters.location.city) query['location.city'] = new RegExp(filters.location.city, 'i');
        if (filters.location.state) query['location.state'] = new RegExp(filters.location.state, 'i');
      }
      
      if (filters.propertyType) {
        query.propertyType = new RegExp(filters.propertyType, 'i');
      }

      const count = await SiteModel.countDocuments(query);
      return count;
    } catch (error) {
      console.error('Error getting site count:', error);
      throw new Error(`Failed to get site count: ${error.message}`);
    }
  }

  /**
   * Get a single site by slug
   * @param {string} slug - Site slug
   * @returns {Promise<Object|null>} Site data or null if not found
   */
  async getSiteBySlug(slug) {
    try {
      const site = await SiteModel
        .findOne({ slug, isActive: true })
        .lean();
      
      return site;
    } catch (error) {
      console.error('Error fetching site by slug:', error);
      throw new Error(`Failed to fetch site: ${error.message}`);
    }
  }

  /**
   * Get sites by location for batch processing
   * @param {string} city - City name
   * @param {string} state - State name
   * @param {number} limit - Batch size
   * @returns {Promise<Array>} Array of site data
   */
  async getSitesByLocation(city, state, limit = 50) {
    try {
      const sites = await SiteModel
        .find({
          'location.city': new RegExp(city, 'i'),
          'location.state': new RegExp(state, 'i'),
          isActive: true
        })
        .limit(limit)
        .lean();
      
      return sites;
    } catch (error) {
      console.error('Error fetching sites by location:', error);
      throw new Error(`Failed to fetch sites by location: ${error.message}`);
    }
  }

  /**
   * Transform site data for static generation
   * This ensures the data structure matches what the templates expect
   * @param {Object} siteData - Raw site data from MongoDB
   * @returns {Object} Transformed site data
   */
  transformSiteData(siteData) {
    return {
      // Core identifiers
      siteId: siteData.siteId,
      slug: siteData.slug,
      slugId: siteData.slugId,
      
      // Meta information
      metaTitle: Array.isArray(siteData.metaTitle) ? siteData.metaTitle : [siteData.metaTitle],
      shortDescription: siteData.shortDescription,
      description: siteData.description,
      keywords: siteData.keywords || [],
      
      // Location data
      location: {
        ...siteData.location,
        // Ensure all location fields exist
        lat: siteData.location?.lat || 0,
        lng: siteData.location?.lng || 0,
        city: siteData.location?.city || '',
        district: siteData.location?.district || '',
        state: siteData.location?.state || '',
        region: siteData.location?.region || '',
        country: siteData.location?.country || 'India',
        pinCode: siteData.location?.pinCode || ''
      },
      
      // Property information
      propertyType: siteData.propertyType,
      
      // Content arrays
      localities: siteData.localities || [],
      quickLinks: siteData.quickLinks || [],
      sublocalities: siteData.sublocalities || [],
      
      // FAQ data
      faq: siteData.faq || [],
      
      // Footer information
      footer: siteData.footer || {
        title: 'Reeltor.com',
        description: 'Your trusted real estate partner in India'
      },
      
      // Metadata
      isActive: siteData.isActive,
      createdAt: siteData.createdAt,
      updatedAt: siteData.updatedAt
    };
  }

  /**
   * Batch process sites for static generation
   * @param {number} batchSize - Size of each batch
   * @param {Function} processingFunction - Function to process each batch
   * @returns {Promise<Object>} Processing results
   */
  async batchProcessSites(batchSize = 100, processingFunction) {
    try {
      const totalCount = await this.getTotalCount();
      const totalBatches = Math.ceil(totalCount / batchSize);
      
      let processedCount = 0;
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      console.log(`Starting batch processing: ${totalCount} total sites, ${totalBatches} batches`);

      for (let i = 0; i < totalBatches; i++) {
        const skip = i * batchSize;
        const sites = await this.fetchSiteData({ limit: batchSize, skip });
        
        console.log(`Processing batch ${i + 1}/${totalBatches} (${sites.length} sites)`);
        
        try {
          await processingFunction(sites.map(site => this.transformSiteData(site)));
          successCount += sites.length;
        } catch (error) {
          console.error(`Error processing batch ${i + 1}:`, error);
          errorCount += sites.length;
          errors.push({ batch: i + 1, error: error.message });
        }
        
        processedCount += sites.length;
        
        // Log progress
        const progress = Math.round((processedCount / totalCount) * 100);
        console.log(`Progress: ${progress}% (${processedCount}/${totalCount})`);
      }

      return {
        totalSites: totalCount,
        processedSites: processedCount,
        successCount,
        errorCount,
        errors
      };
    } catch (error) {
      console.error('Error in batch processing:', error);
      throw error;
    }
  }
}

module.exports = new SiteDataService();