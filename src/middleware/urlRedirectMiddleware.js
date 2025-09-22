const URLMapping = require('../models/URLMapping');

/**
 * Middleware to handle URL redirects based on database mappings
 * This ensures that old URLs indexed by Google are properly redirected
 */
const urlRedirectMiddleware = async (req, res, next) => {
  try {
    // Only process for GET requests to avoid interfering with POST/PUT operations
    if (req.method !== 'GET') {
      return next();
    }

    // Skip API routes and static assets
    if (req.path.startsWith('/api/') ||
        req.path.startsWith('/_next/') ||
        req.path.startsWith('/static/') ||
        req.path.includes('.')) {
      return next();
    }

    // Clean the path for consistent matching
    const cleanPath = req.path.toLowerCase().replace(/\/$/, '') || '/';

    // Check if this URL has a mapping in the database
    const mapping = await URLMapping.findRedirect(cleanPath);

    if (mapping && mapping.isActive) {
      // Record the hit asynchronously (don't wait for it)
      mapping.recordHit().catch(err => {
        console.error('Error recording URL mapping hit:', err);
      });

      // Log the redirect for monitoring
      console.log(`🔀 Redirecting: ${cleanPath} → ${mapping.newUrl} (${mapping.redirectType})`);

      // Perform the redirect
      if (mapping.redirectType === 301) {
        return res.redirect(301, mapping.newUrl);
      } else if (mapping.redirectType === 302) {
        return res.redirect(302, mapping.newUrl);
      } else if (mapping.redirectType === 200) {
        // Internal rewrite (keep same URL in browser)
        req.url = mapping.newUrl;
        req.path = mapping.newUrl;
        return next();
      }
    }

    // No mapping found, continue to next middleware
    next();

  } catch (error) {
    console.error('Error in URL redirect middleware:', error);
    // Don't break the request, just continue
    next();
  }
};

/**
 * Route handler to get redirect statistics (for admin/monitoring)
 */
const getRedirectStats = async (req, res) => {
  try {
    const stats = await URLMapping.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$redirectType',
          count: { $sum: 1 },
          totalHits: { $sum: '$hitCount' }
        }
      }
    ]);

    const popularRedirects = await URLMapping.getPopularRedirects(10);

    const response = {
      totalMappings: await URLMapping.countDocuments({ isActive: true }),
      byType: stats,
      popularRedirects: popularRedirects.map(m => ({
        oldUrl: m.oldUrl,
        newUrl: m.newUrl,
        hits: m.hitCount,
        lastHit: m.lastHit
      })),
      recentMappings: await URLMapping.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('oldUrl newUrl redirectType reason createdAt')
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting redirect stats:', error);
    res.status(500).json({ error: 'Failed to get redirect statistics' });
  }
};

/**
 * Route handler to add new URL mappings (for admin use)
 */
const addUrlMapping = async (req, res) => {
  try {
    const { oldUrl, newUrl, redirectType = 301, reason = 'URL_RESTRUCTURE' } = req.body;

    if (!oldUrl || !newUrl) {
      return res.status(400).json({
        error: 'oldUrl and newUrl are required'
      });
    }

    // Check if mapping already exists
    const existing = await URLMapping.findOne({ oldUrl });
    if (existing) {
      return res.status(409).json({
        error: 'URL mapping already exists',
        existing: {
          oldUrl: existing.oldUrl,
          newUrl: existing.newUrl,
          redirectType: existing.redirectType
        }
      });
    }

    const mapping = new URLMapping({
      oldUrl,
      newUrl,
      redirectType,
      reason,
      isActive: true
    });

    await mapping.save();

    res.status(201).json({
      message: 'URL mapping created successfully',
      mapping: {
        oldUrl: mapping.oldUrl,
        newUrl: mapping.newUrl,
        redirectType: mapping.redirectType,
        reason: mapping.reason
      }
    });

  } catch (error) {
    console.error('Error adding URL mapping:', error);
    res.status(500).json({ error: 'Failed to add URL mapping' });
  }
};

module.exports = {
  urlRedirectMiddleware,
  getRedirectStats,
  addUrlMapping
};