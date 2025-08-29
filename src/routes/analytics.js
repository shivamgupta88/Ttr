const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/AnalyticsService');
const Analytics = require('../models/Analytics');
const Page = require('../models/Page');

const analyticsService = new AnalyticsService();

/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard data
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { dateRange = 30 } = req.query;
    
    const dashboardData = await analyticsService.getDashboardData(parseInt(dateRange));
    
    res.json({
      success: true,
      data: dashboardData,
      dateRange: parseInt(dateRange)
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

/**
 * POST /api/analytics/track
 * Track custom analytics event
 */
router.post('/track', async (req, res) => {
  try {
    const {
      pageId,
      slug,
      eventType = 'pageview',
      data = {}
    } = req.body;

    if (!pageId && !slug) {
      return res.status(400).json({
        success: false,
        error: 'Either pageId or slug is required'
      });
    }

    // Get page ID if slug provided
    let resolvedPageId = pageId;
    if (!pageId && slug) {
      const page = await Page.findOne({ slug }).select('_id');
      if (!page) {
        return res.status(404).json({
          success: false,
          error: 'Page not found'
        });
      }
      resolvedPageId = page._id;
    }

    // Track different event types
    switch (eventType) {
      case 'pageview':
        await analyticsService.trackPageView({
          pageId: resolvedPageId,
          slug: slug || data.slug,
          visitorId: req.headers['x-visitor-id'] || data.visitorId,
          sessionId: req.headers['x-session-id'] || data.sessionId,
          source: data.source || 'direct',
          device: data.device || 'desktop',
          country: data.country,
          region: data.region,
          city: data.city,
          userAgent: req.headers['user-agent'],
          referrer: req.headers.referer || data.referrer,
          timeOnPage: data.timeOnPage,
          scrollDepth: data.scrollDepth,
          interactions: data.interactions || {}
        });
        break;

      case 'conversion':
        await analyticsService.trackConversion(
          resolvedPageId,
          slug || data.slug,
          data.conversionType || 'reelGenerated',
          data.value || 0
        );
        break;

      case 'search':
        await analyticsService.trackSearchMetrics(resolvedPageId, slug || data.slug, {
          impressions: data.impressions || 1,
          clicks: data.clicks || 0,
          position: data.position || 0,
          query: data.query || ''
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unknown event type: ${eventType}`
        });
    }

    res.json({
      success: true,
      message: `${eventType} tracked successfully`
    });

  } catch (error) {
    console.error('Error tracking analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track analytics',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/pages/top
 * Get top performing pages
 */
router.get('/pages/top', async (req, res) => {
  try {
    const { 
      limit = 20, 
      dateRange = 30,
      metric = 'views' 
    } = req.query;

    const topPages = await analyticsService.getTopPerformingPages(
      parseInt(limit),
      parseInt(dateRange)
    );

    // Enrich with page data
    const enrichedPages = await Promise.all(
      topPages.map(async (page) => {
        const pageData = await Page.findById(page._id)
          .select('content.title dimensions seo.metaTitle')
          .lean();
        
        return {
          ...page,
          pageData
        };
      })
    );

    res.json({
      success: true,
      data: {
        pages: enrichedPages,
        metric,
        dateRange: parseInt(dateRange)
      }
    });

  } catch (error) {
    console.error('Error fetching top pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top pages',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/traffic/trends
 * Get traffic trends over time
 */
router.get('/traffic/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const trends = await analyticsService.getTrafficTrends(parseInt(days));

    res.json({
      success: true,
      data: {
        trends,
        days: parseInt(days)
      }
    });

  } catch (error) {
    console.error('Error fetching traffic trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch traffic trends',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/search/performance
 * Get search engine performance data
 */
router.get('/search/performance', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const searchData = await analyticsService.getSearchPerformance(parseInt(limit));

    res.json({
      success: true,
      data: {
        keywords: searchData,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching search performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch search performance',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/conversions
 * Get conversion metrics and funnel data
 */
router.get('/conversions', async (req, res) => {
  try {
    const { dateRange = 30 } = req.query;

    const [conversionMetrics, funnelData] = await Promise.all([
      analyticsService.getConversionMetrics(parseInt(dateRange)),
      Analytics.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$pageViews' },
            totalInteractions: { $sum: '$interactions.clicks' },
            totalConversions: { $sum: '$conversions.reelGenerated' },
            totalRevenue: { $sum: '$conversions.revenue' }
          }
        },
        {
          $project: {
            _id: 0,
            totalViews: 1,
            totalInteractions: 1,
            totalConversions: 1,
            totalRevenue: 1,
            interactionRate: {
              $cond: {
                if: { $gt: ['$totalViews', 0] },
                then: { $multiply: [{ $divide: ['$totalInteractions', '$totalViews'] }, 100] },
                else: 0
              }
            },
            conversionRate: {
              $cond: {
                if: { $gt: ['$totalViews', 0] },
                then: { $multiply: [{ $divide: ['$totalConversions', '$totalViews'] }, 100] },
                else: 0
              }
            }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        conversions: conversionMetrics[0] || {},
        funnel: funnelData[0] || {},
        dateRange: parseInt(dateRange)
      }
    });

  } catch (error) {
    console.error('Error fetching conversion data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversion data',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/realtime
 * Get real-time analytics data
 */
router.get('/realtime', async (req, res) => {
  try {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const [realtimeData, activePages] = await Promise.all([
      Analytics.aggregate([
        {
          $match: {
            date: { $gte: lastHour }
          }
        },
        {
          $group: {
            _id: null,
            currentViews: { $sum: '$pageViews' },
            currentUnique: { $sum: '$uniqueVisitors' },
            currentSessions: { $sum: '$sessions' }
          }
        }
      ]),
      Analytics.aggregate([
        {
          $match: {
            date: { $gte: lastHour },
            pageViews: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: '$slug',
            views: { $sum: '$pageViews' },
            unique: { $sum: '$uniqueVisitors' }
          }
        },
        {
          $sort: { views: -1 }
        },
        {
          $limit: 10
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        current: realtimeData[0] || { currentViews: 0, currentUnique: 0, currentSessions: 0 },
        activePages,
        timestamp: now,
        timeRange: 'last_hour'
      }
    });

  } catch (error) {
    console.error('Error fetching realtime data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch realtime data',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/export
 * Export analytics data
 */
router.get('/export', async (req, res) => {
  try {
    const { 
      dateRange = 30,
      format = 'json',
      type = 'full'
    } = req.query;

    if (!['json', 'csv'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid format. Use json or csv.'
      });
    }

    const exportData = await analyticsService.exportAnalytics(
      parseInt(dateRange),
      format
    );

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${Date.now()}.csv`);
      res.send(exportData);
    } else {
      res.json({
        success: true,
        data: exportData,
        format,
        dateRange: parseInt(dateRange)
      });
    }

  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/summary
 * Get analytics summary for overview
 */
router.get('/summary', async (req, res) => {
  try {
    const { dateRange = 30 } = req.query;

    const summary = await analyticsService.getSummaryMetrics(parseInt(dateRange));

    // Additional insights
    const insights = await Analytics.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTimeOnPage: { $avg: '$avgTimeOnPage' },
          avgScrollDepth: { $avg: '$scrollDepth' },
          topHour: {
            $push: {
              hour: '$hour',
              views: '$pageViews'
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...summary,
        insights: insights[0] || {},
        dateRange: parseInt(dateRange)
      }
    });

  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics summary',
      message: error.message
    });
  }
});

module.exports = router;