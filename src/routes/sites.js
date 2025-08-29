const express = require('express');
const router = express.Router();
const SiteDataService = require('../services/SiteDataService');

// GET /api/sites/batch - Fetch sites in batches for static generation
router.get('/batch', async (req, res) => {
  try {
    const { skip = 0, limit = 100, city, state, propertyType } = req.query;
    
    const options = {
      skip: parseInt(skip),
      limit: parseInt(limit),
      activeOnly: true
    };

    // Add filters if provided
    if (city || state) {
      options.location = {};
      if (city) options.location.city = city;
      if (state) options.location.state = state;
    }
    
    if (propertyType) {
      options.propertyType = propertyType;
    }

    const sites = await SiteDataService.fetchSiteData(options);
    
    res.json({
      success: true,
      data: sites.map(site => SiteDataService.transformSiteData(site)),
      count: sites.length,
      pagination: {
        skip: parseInt(skip),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in /batch endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sites batch',
      message: error.message
    });
  }
});

// GET /api/sites/count - Get total count of active sites
router.get('/count', async (req, res) => {
  try {
    const { city, state, propertyType } = req.query;
    
    const filters = {};
    
    // Add filters if provided
    if (city || state) {
      filters.location = {};
      if (city) filters.location.city = city;
      if (state) filters.location.state = state;
    }
    
    if (propertyType) {
      filters.propertyType = propertyType;
    }

    const count = await SiteDataService.getTotalCount(filters);
    
    res.json({
      success: true,
      count,
      filters
    });
  } catch (error) {
    console.error('Error in /count endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sites count',
      message: error.message
    });
  }
});

// GET /api/sites/:slug - Get single site by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const site = await SiteDataService.getSiteBySlug(slug);
    
    if (!site) {
      return res.status(404).json({
        success: false,
        error: 'Site not found',
        message: `No site found with slug: ${slug}`
      });
    }
    
    res.json({
      success: true,
      data: SiteDataService.transformSiteData(site)
    });
  } catch (error) {
    console.error('Error in /:slug endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch site',
      message: error.message
    });
  }
});

// GET /api/sites/location/:city/:state - Get sites by location
router.get('/location/:city/:state', async (req, res) => {
  try {
    const { city, state } = req.params;
    const { limit = 50 } = req.query;
    
    const sites = await SiteDataService.getSitesByLocation(city, state, parseInt(limit));
    
    res.json({
      success: true,
      data: sites.map(site => SiteDataService.transformSiteData(site)),
      count: sites.length,
      location: { city, state }
    });
  } catch (error) {
    console.error('Error in /location endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sites by location',
      message: error.message
    });
  }
});

// POST /api/sites/generate-batch - Trigger batch generation for static sites
router.post('/generate-batch', async (req, res) => {
  try {
    const { batchSize = 100, filters = {} } = req.body;
    
    // This would trigger the static generation process
    // You can customize this based on your generation needs
    const processingFunction = async (sites) => {
      console.log(`Processing batch of ${sites.length} sites for static generation...`);
      // Here you would call your static generation logic
      return sites;
    };
    
    const results = await SiteDataService.batchProcessSites(batchSize, processingFunction);
    
    res.json({
      success: true,
      message: 'Batch generation completed',
      results
    });
  } catch (error) {
    console.error('Error in /generate-batch endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate batch',
      message: error.message
    });
  }
});

// GET /api/sites/stats/overview - Get overview statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalSites = await SiteDataService.getTotalCount();
    const activeSites = await SiteDataService.getTotalCount({ activeOnly: true });
    
    res.json({
      success: true,
      data: {
        overview: {
          totalSites,
          activeSites,
          generatedAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error in /stats/overview endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get overview stats',
      message: error.message
    });
  }
});

module.exports = router;