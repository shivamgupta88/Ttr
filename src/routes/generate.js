const express = require('express');
const router = express.Router();
const BulkGenerator = require('../services/BulkGenerator');
const ContentGenerator = require('../services/ContentGenerator');
const SEOEngine = require('../services/SEOEngine');
const Page = require('../models/Page');
const dimensions = require('../../data/datasets/dimensions');

/**
 * POST /api/generate/bulk
 * Start bulk page generation process
 */
router.post('/bulk', async (req, res) => {
  try {
    const {
      targetPages = 100000,
      batchSize = 10000,
      maxWorkers = require('os').cpus().length
    } = req.body;

    // Validate parameters
    if (targetPages > 1000000) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 1 million pages allowed per generation'
      });
    }

    const generator = new BulkGenerator({
      targetPages,
      batchSize,
      maxWorkers
    });

    // Start generation in background
    const generationPromise = generator.generatePagesInParallel();
    
    // Don't await - let it run in background
    generationPromise.catch(error => {
      console.error('Background generation failed:', error);
    });

    res.json({
      success: true,
      message: `Bulk generation started for ${targetPages.toLocaleString()} pages`,
      data: {
        targetPages,
        batchSize,
        maxWorkers,
        estimatedTime: `${Math.ceil(targetPages / 10000)} minutes`
      }
    });

  } catch (error) {
    console.error('Error starting bulk generation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start bulk generation',
      message: error.message
    });
  }
});

/**
 * GET /api/generate/status
 * Get generation status and statistics
 */
router.get('/status', async (req, res) => {
  try {
    const [
      totalPages,
      publishedPages,
      draftPages,
      todayPages,
      recentBatches
    ] = await Promise.all([
      Page.countDocuments(),
      Page.countDocuments({ status: 'published' }),
      Page.countDocuments({ status: 'draft' }),
      Page.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      Page.aggregate([
        {
          $group: {
            _id: '$generation.batch',
            count: { $sum: 1 },
            algorithm: { $first: '$generation.algorithm' },
            latestCreated: { $max: '$createdAt' }
          }
        },
        {
          $sort: { latestCreated: -1 }
        },
        {
          $limit: 10
        }
      ])
    ]);

    // Calculate generation stats
    const generationStats = {
      total: totalPages,
      published: publishedPages,
      draft: draftPages,
      generatedToday: todayPages,
      rate: todayPages > 0 ? `${todayPages}/day` : '0/day'
    };

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const systemStats = {
      memoryUsed: `${(memoryUsage.heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB`,
      memoryTotal: `${(memoryUsage.heapTotal / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: `${(process.uptime() / 3600).toFixed(2)} hours`,
      nodeVersion: process.version
    };

    res.json({
      success: true,
      data: {
        generationStats,
        systemStats,
        recentBatches: recentBatches.map(batch => ({
          batchId: batch._id,
          pageCount: batch.count,
          algorithm: batch.algorithm,
          created: batch.latestCreated
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching generation status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch generation status',
      message: error.message
    });
  }
});

/**
 * POST /api/generate/single
 * Generate single page with specific dimensions
 */
router.post('/single', async (req, res) => {
  try {
    const { dimensions: pageDimensions, variation = 0 } = req.body;

    // Validate dimensions
    const requiredDimensions = ['theme', 'language', 'style', 'platform', 'audience'];
    const missingDimensions = requiredDimensions.filter(dim => !pageDimensions[dim]);

    if (missingDimensions.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required dimensions',
        missing: missingDimensions,
        required: requiredDimensions
      });
    }

    const contentGenerator = new ContentGenerator();
    
    // Add default dimensions if not provided
    const fullDimensions = {
      emotion: 'happy_joyful',
      occasion: 'general',
      length: 'medium',
      ...pageDimensions
    };

    const pageData = contentGenerator.generateUniqueContent(fullDimensions, variation);
    
    // Create page
    const page = new Page({
      ...pageData,
      status: 'draft'
    });

    await page.save();

    res.json({
      success: true,
      data: page,
      message: 'Page generated successfully'
    });

  } catch (error) {
    console.error('Error generating single page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate page',
      message: error.message
    });
  }
});

/**
 * GET /api/generate/dimensions
 * Get available dimensions for generation
 */
router.get('/dimensions', (req, res) => {
  try {
    const availableDimensions = {
      themes: dimensions.themes.map(theme => ({
        value: theme,
        label: theme.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        category: theme.includes('quote') ? 'quotes' : 
                  theme.includes('wish') ? 'wishes' : 
                  theme.includes('motivation') ? 'motivation' : 'general'
      })),
      languages: dimensions.languages.map(lang => ({
        value: lang,
        label: lang.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      })),
      styles: dimensions.styles.map(style => ({
        value: style,
        label: style.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        type: style.includes('aesthetic') || style.includes('theme') ? 'visual' : 'content'
      })),
      platforms: dimensions.platforms.map(platform => ({
        value: platform,
        label: platform.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      })),
      audiences: dimensions.audiences.map(audience => ({
        value: audience,
        label: audience.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      })),
      emotions: dimensions.emotions.map(emotion => ({
        value: emotion,
        label: emotion.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      })),
      occasions: dimensions.occasions.map(occasion => ({
        value: occasion,
        label: occasion.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      })),
      lengths: dimensions.lengths.map(length => ({
        value: length,
        label: length.replace(/\b\w/g, c => c.toUpperCase())
      }))
    };

    // Calculate total combinations
    const totalCombinations = Object.values(dimensions).reduce(
      (acc, dimArray) => acc * (Array.isArray(dimArray) ? dimArray.length : 1), 
      1
    );

    res.json({
      success: true,
      data: {
        dimensions: availableDimensions,
        stats: {
          totalCombinations: totalCombinations.toLocaleString(),
          maxPossiblePages: totalCombinations
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dimensions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dimensions',
      message: error.message
    });
  }
});

/**
 * POST /api/generate/preview
 * Preview generated content without saving
 */
router.post('/preview', async (req, res) => {
  try {
    const { dimensions: pageDimensions, variation = 0 } = req.body;

    // Validate dimensions
    const requiredDimensions = ['theme', 'language', 'style'];
    const missingDimensions = requiredDimensions.filter(dim => !pageDimensions[dim]);

    if (missingDimensions.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required dimensions for preview',
        missing: missingDimensions
      });
    }

    const contentGenerator = new ContentGenerator();
    
    // Add default dimensions
    const fullDimensions = {
      platform: 'instagram_reel',
      audience: 'young_adults',
      emotion: 'happy_joyful',
      occasion: 'general',
      length: 'medium',
      ...pageDimensions
    };

    const previewData = contentGenerator.generateUniqueContent(fullDimensions, variation);

    res.json({
      success: true,
      data: {
        content: previewData.content,
        seo: previewData.seo,
        quality: previewData.quality,
        slug: previewData.slug,
        dimensions: fullDimensions
      },
      message: 'Preview generated successfully'
    });

  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate preview',
      message: error.message
    });
  }
});

/**
 * POST /api/generate/seo
 * Generate SEO assets (sitemaps, robots.txt, etc.)
 */
router.post('/seo', async (req, res) => {
  try {
    const { limit = 50000 } = req.body;

    // Get published pages
    const pages = await Page.find({ status: 'published' })
      .select('slug seo content dimensions createdAt updatedAt performance')
      .limit(limit)
      .lean();

    if (pages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No published pages found for SEO generation'
      });
    }

    const seoEngine = new SEOEngine();
    const seoAssets = await seoEngine.generateAllSEOAssets(pages);

    res.json({
      success: true,
      data: {
        seoAssets: {
          sitemaps: seoAssets.sitemaps.length,
          robotsTxt: !!seoAssets.robotsTxt,
          structuredDataTypes: Object.keys(seoAssets.structuredData).length
        },
        stats: {
          pagesProcessed: pages.length,
          sitemapCount: seoAssets.sitemaps.length,
          avgPriority: seoAssets.sitemaps.reduce((acc, sitemap) => 
            acc + (sitemap.avgPriority || 0.5), 0) / seoAssets.sitemaps.length
        }
      },
      message: `SEO assets generated for ${pages.length.toLocaleString()} pages`
    });

  } catch (error) {
    console.error('Error generating SEO assets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate SEO assets',
      message: error.message
    });
  }
});

/**
 * DELETE /api/generate/cleanup
 * Clean up generated pages (for testing/development)
 */
router.delete('/cleanup', async (req, res) => {
  try {
    const { 
      keepCount = 1000,
      olderThan = 24,
      batchId,
      status = 'draft'
    } = req.body;

    let deleteFilter = { status };

    if (batchId) {
      deleteFilter['generation.batch'] = batchId;
    } else if (olderThan) {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - olderThan);
      deleteFilter.createdAt = { $lt: cutoffDate };
    }

    // Always keep the most recent pages
    const pagesToDelete = await Page.find(deleteFilter)
      .select('_id')
      .sort({ createdAt: 1 })
      .skip(keepCount)
      .lean();

    if (pagesToDelete.length === 0) {
      return res.json({
        success: true,
        data: { deletedCount: 0 },
        message: 'No pages to clean up'
      });
    }

    const deleteResult = await Page.deleteMany({
      _id: { $in: pagesToDelete.map(p => p._id) }
    });

    res.json({
      success: true,
      data: {
        deletedCount: deleteResult.deletedCount,
        keptCount: keepCount,
        filter: deleteFilter
      },
      message: `Cleaned up ${deleteResult.deletedCount} pages`
    });

  } catch (error) {
    console.error('Error cleaning up pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clean up pages',
      message: error.message
    });
  }
});

module.exports = router;