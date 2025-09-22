const express = require('express');
const router = express.Router();
const { getRedirectStats, addUrlMapping } = require('../middleware/urlRedirectMiddleware');
const URLMapping = require('../models/URLMapping');

/**
 * GET /api/url-mappings/stats
 * Get redirect statistics
 */
router.get('/stats', getRedirectStats);

/**
 * POST /api/url-mappings
 * Add new URL mapping
 */
router.post('/', addUrlMapping);

/**
 * GET /api/url-mappings
 * Get all URL mappings with pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    // Add filters if provided
    if (req.query.redirectType) {
      filter.redirectType = parseInt(req.query.redirectType);
    }

    if (req.query.reason) {
      filter.reason = req.query.reason;
    }

    if (req.query.search) {
      filter.$or = [
        { oldUrl: { $regex: req.query.search, $options: 'i' } },
        { newUrl: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const mappings = await URLMapping.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('oldUrl newUrl redirectType reason hitCount lastHit createdAt');

    const total = await URLMapping.countDocuments(filter);

    res.json({
      mappings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching URL mappings:', error);
    res.status(500).json({ error: 'Failed to fetch URL mappings' });
  }
});

/**
 * PUT /api/url-mappings/:id
 * Update URL mapping
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid mapping ID' });
    }

    const mapping = await URLMapping.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!mapping) {
      return res.status(404).json({ error: 'URL mapping not found' });
    }

    res.json({
      message: 'URL mapping updated successfully',
      mapping
    });

  } catch (error) {
    console.error('Error updating URL mapping:', error);
    res.status(500).json({ error: 'Failed to update URL mapping' });
  }
});

/**
 * DELETE /api/url-mappings/:id
 * Delete (deactivate) URL mapping
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid mapping ID' });
    }

    const mapping = await URLMapping.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!mapping) {
      return res.status(404).json({ error: 'URL mapping not found' });
    }

    res.json({
      message: 'URL mapping deactivated successfully',
      mapping
    });

  } catch (error) {
    console.error('Error deactivating URL mapping:', error);
    res.status(500).json({ error: 'Failed to deactivate URL mapping' });
  }
});

/**
 * POST /api/url-mappings/bulk-import
 * Bulk import URL mappings
 */
router.post('/bulk-import', async (req, res) => {
  try {
    const { mappings } = req.body;

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return res.status(400).json({ error: 'Mappings array is required' });
    }

    const results = {
      added: 0,
      skipped: 0,
      errors: []
    };

    for (const mappingData of mappings) {
      try {
        const { oldUrl, newUrl, redirectType = 301, reason = 'BULK_IMPORT' } = mappingData;

        if (!oldUrl || !newUrl) {
          results.errors.push({ data: mappingData, error: 'oldUrl and newUrl are required' });
          continue;
        }

        // Check if mapping already exists
        const existing = await URLMapping.findOne({ oldUrl });
        if (existing) {
          results.skipped++;
          continue;
        }

        const mapping = new URLMapping({
          oldUrl,
          newUrl,
          redirectType,
          reason,
          isActive: true
        });

        await mapping.save();
        results.added++;

      } catch (error) {
        results.errors.push({ data: mappingData, error: error.message });
      }
    }

    res.json({
      message: 'Bulk import completed',
      results
    });

  } catch (error) {
    console.error('Error in bulk import:', error);
    res.status(500).json({ error: 'Bulk import failed' });
  }
});

module.exports = router;