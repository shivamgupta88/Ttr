const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const AnalyticsService = require('../services/AnalyticsService');

const analyticsService = new AnalyticsService();

/**
 * GET /api/pages
 * Get paginated list of pages with filtering
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      theme,
      language,
      style,
      platform,
      audience,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = 'published'
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (theme) filter['dimensions.theme'] = theme;
    if (language) filter['dimensions.language'] = language;
    if (style) filter['dimensions.style'] = style;
    if (platform) filter['dimensions.platform'] = platform;
    if (audience) filter['dimensions.audience'] = audience;
    
    // Text search
    if (search) {
      filter.$or = [
        { 'content.title': { $regex: search, $options: 'i' } },
        { 'content.description': { $regex: search, $options: 'i' } },
        { 'seo.keywords': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [pages, total] = await Promise.all([
      Page.find(filter)
        .select('slug content dimensions seo performance createdAt updatedAt')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Page.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        pages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        filters: {
          theme,
          language,
          style,
          platform,
          audience,
          search,
          status
        }
      }
    });

  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pages',
      message: error.message
    });
  }
});

/**
 * GET /api/pages/random
 * Get random pages for featured content
 */
router.get('/random', async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const maxLimit = Math.min(parseInt(limit), 50); // Cap at 50

    const randomPages = await Page.aggregate([
      { $match: { status: 'published' } },
      { $sample: { size: maxLimit } },
      {
        $project: {
          slug: 1,
          'content.title': 1,
          'content.description': 1,
          'dimensions.theme': 1,
          'dimensions.language': 1,
          'dimensions.platform': 1,
          'dimensions.audience': 1,
          'seo.metaTitle': 1,
          'seo.metaDescription': 1,
          'performance.views': 1,
          'performance.likes': 1,
          createdAt: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: randomPages,
      total: randomPages.length
    });

  } catch (error) {
    console.error('Error fetching random pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random pages',
      message: error.message
    });
  }
});

/**
 * GET /api/pages/:slug
 * Get single page by slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { track = true } = req.query;

    const page = await Page.findOne({ slug, status: 'published' }).lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }

    // Track page view if requested
    if (track === 'true' || track === true) {
      await analyticsService.trackPageView({
        pageId: page._id,
        slug: page.slug,
        visitorId: req.headers['x-visitor-id'] || 'anonymous',
        sessionId: req.headers['x-session-id'] || 'anonymous',
        source: req.headers['x-traffic-source'] || 'direct',
        device: req.headers['x-device-type'] || 'desktop',
        country: req.headers['x-country'] || 'unknown',
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer
      });
    }

    res.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page',
      message: error.message
    });
  }
});

/**
 * POST /api/pages
 * Create new page
 */
router.post('/', async (req, res) => {
  try {
    const pageData = req.body;

    // Validate required fields
    const requiredFields = ['dimensions', 'content', 'seo'];
    const missingFields = requiredFields.filter(field => !pageData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    const page = new Page(pageData);
    await page.save();

    res.status(201).json({
      success: true,
      data: page,
      message: 'Page created successfully'
    });

  } catch (error) {
    console.error('Error creating page:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Page with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create page',
      message: error.message
    });
  }
});

/**
 * PUT /api/pages/:slug
 * Update page by slug
 */
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;

    const page = await Page.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }

    res.json({
      success: true,
      data: page,
      message: 'Page updated successfully'
    });

  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update page',
      message: error.message
    });
  }
});

/**
 * DELETE /api/pages/:slug
 * Delete page by slug
 */
router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOneAndDelete({ slug });

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }

    res.json({
      success: true,
      message: 'Page deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete page',
      message: error.message
    });
  }
});

/**
 * GET /api/pages/stats/overview
 * Get pages overview statistics
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalPages,
      publishedPages,
      draftPages,
      totalViews,
      topThemes,
      topLanguages,
      recentPages
    ] = await Promise.all([
      Page.countDocuments(),
      Page.countDocuments({ status: 'published' }),
      Page.countDocuments({ status: 'draft' }),
      Page.aggregate([
        { $group: { _id: null, total: { $sum: '$performance.views' } } }
      ]),
      Page.aggregate([
        { $group: { _id: '$dimensions.theme', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Page.aggregate([
        { $group: { _id: '$dimensions.language', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Page.find({ status: 'published' })
        .select('slug content.title dimensions createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalPages,
          publishedPages,
          draftPages,
          totalViews: totalViews[0]?.total || 0
        },
        topThemes: topThemes.map(item => ({
          theme: item._id,
          count: item.count
        })),
        topLanguages: topLanguages.map(item => ({
          language: item._id,
          count: item.count
        })),
        recentPages
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

/**
 * POST /api/pages/bulk
 * Bulk operations on pages
 */
router.post('/bulk', async (req, res) => {
  try {
    const { operation, pageIds, data } = req.body;

    if (!operation || !pageIds || !Array.isArray(pageIds)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bulk operation parameters'
      });
    }

    let result;

    switch (operation) {
      case 'publish':
        result = await Page.updateMany(
          { _id: { $in: pageIds } },
          { status: 'published', publishedAt: new Date() }
        );
        break;

      case 'unpublish':
        result = await Page.updateMany(
          { _id: { $in: pageIds } },
          { status: 'draft', $unset: { publishedAt: 1 } }
        );
        break;

      case 'delete':
        result = await Page.deleteMany({ _id: { $in: pageIds } });
        break;

      case 'update':
        if (!data) {
          return res.status(400).json({
            success: false,
            error: 'Update data is required'
          });
        }
        result = await Page.updateMany(
          { _id: { $in: pageIds } },
          data
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation'
        });
    }

    res.json({
      success: true,
      data: {
        operation,
        affected: result.modifiedCount || result.deletedCount || 0,
        result
      },
      message: `Bulk ${operation} completed successfully`
    });

  } catch (error) {
    console.error('Error in bulk operation:', error);
    res.status(500).json({
      success: false,
      error: 'Bulk operation failed',
      message: error.message
    });
  }
});

/**
 * GET /api/pages/search/suggestions
 * Get search suggestions
 */
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const suggestions = await Page.aggregate([
      {
        $match: {
          status: 'published',
          $or: [
            { 'content.title': { $regex: q, $options: 'i' } },
            { 'seo.keywords': { $in: [new RegExp(q, 'i')] } }
          ]
        }
      },
      {
        $project: {
          title: '$content.title',
          slug: 1,
          theme: '$dimensions.theme',
          language: '$dimensions.language',
          score: { $meta: 'textScore' }
        }
      },
      {
        $sort: { score: { $meta: 'textScore' } }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: { suggestions }
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions',
      message: error.message
    });
  }
});

module.exports = router;