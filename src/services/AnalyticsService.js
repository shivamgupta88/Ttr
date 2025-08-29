const Analytics = require('../models/Analytics');
const Page = require('../models/Page');

class AnalyticsService {
  constructor() {
    this.batchQueue = [];
    this.batchSize = 1000;
    this.flushInterval = 30000; // 30 seconds
    this.startBatchProcessor();
  }
  
  /**
   * Track page view with comprehensive metrics
   */
  async trackPageView(data) {
    const {
      pageId,
      slug,
      visitorId,
      sessionId,
      timestamp = new Date(),
      source = 'direct',
      device = 'desktop',
      country,
      region,
      city,
      userAgent,
      referrer,
      searchQuery,
      timeOnPage,
      scrollDepth,
      interactions = {}
    } = data;
    
    // Add to batch queue for efficient processing
    this.batchQueue.push({
      pageId,
      slug,
      visitorId,
      sessionId,
      timestamp,
      source,
      device,
      country,
      region,
      city,
      userAgent,
      referrer,
      searchQuery,
      timeOnPage,
      scrollDepth,
      interactions
    });
    
    // Process immediately if batch is full
    if (this.batchQueue.length >= this.batchSize) {
      await this.processBatch();
    }
  }
  
  /**
   * Track search engine metrics
   */
  async trackSearchMetrics(pageId, slug, metrics) {
    const {
      impressions = 0,
      clicks = 0,
      position = 0,
      query = '',
      date = new Date()
    } = metrics;
    
    const analyticsData = {
      pageId,
      slug,
      date,
      searchMetrics: {
        impressions,
        clicks,
        avgPosition: position,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0
      }
    };
    
    if (query) {
      analyticsData.keywords = [{
        term: query,
        impressions,
        clicks,
        position
      }];
    }
    
    return this.updateAnalytics(analyticsData);
  }
  
  /**
   * Track conversion events
   */
  async trackConversion(pageId, slug, conversionType, value = 0) {
    const conversions = {};
    conversions[conversionType] = 1;
    
    if (value > 0) {
      conversions.revenue = value;
    }
    
    return this.updateAnalytics({
      pageId,
      slug,
      date: new Date(),
      conversions
    });
  }
  
  /**
   * Process batch of analytics data
   */
  async processBatch() {
    if (this.batchQueue.length === 0) return;
    
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    
    try {
      // Group by page and date for efficient aggregation
      const aggregated = this.aggregateBatchData(batch);
      
      // Bulk update analytics
      const updates = Object.values(aggregated).map(item => ({
        pageId: item.pageId,
        slug: item.slug,
        date: item.date,
        metrics: {
          pageViews: item.pageViews,
          uniqueVisitors: item.uniqueVisitors,
          sessions: item.sessions,
          bounces: item.bounces,
          avgTimeOnPage: item.avgTimeOnPage,
          'interactions.clicks': item.interactions.clicks,
          'interactions.downloads': item.interactions.downloads,
          'interactions.shares': item.interactions.shares,
          'interactions.ctaClicks': item.interactions.ctaClicks,
          [`sources.${item.primarySource}`]: item.sourceCount,
          [`devices.${item.primaryDevice}`]: item.deviceCount
        }
      }));
      
      await Analytics.bulkUpdateMetrics(updates);
      
      console.log(`📊 Processed ${batch.length} analytics events`);
      
    } catch (error) {
      console.error('Error processing analytics batch:', error);
      // Re-queue failed items
      this.batchQueue.unshift(...batch);
    }
  }
  
  /**
   * Aggregate batch data for efficient storage
   */
  aggregateBatchData(batch) {
    const aggregated = {};
    
    batch.forEach(item => {
      const date = new Date(item.timestamp).toDateString();
      const key = `${item.pageId}_${date}`;
      
      if (!aggregated[key]) {
        aggregated[key] = {
          pageId: item.pageId,
          slug: item.slug,
          date: new Date(item.timestamp),
          pageViews: 0,
          uniqueVisitors: new Set(),
          sessions: new Set(),
          bounces: 0,
          totalTimeOnPage: 0,
          timeCount: 0,
          interactions: {
            clicks: 0,
            downloads: 0,
            shares: 0,
            ctaClicks: 0
          },
          sources: {},
          devices: {}
        };
      }
      
      const agg = aggregated[key];
      
      // Count metrics
      agg.pageViews++;
      agg.uniqueVisitors.add(item.visitorId);
      agg.sessions.add(item.sessionId);
      
      // Track bounces (sessions with only one page view)
      if (item.timeOnPage < 5) {
        agg.bounces++;
      }
      
      // Average time on page
      if (item.timeOnPage) {
        agg.totalTimeOnPage += item.timeOnPage;
        agg.timeCount++;
      }
      
      // Interactions
      Object.keys(item.interactions).forEach(key => {
        agg.interactions[key] += item.interactions[key] || 0;
      });
      
      // Sources and devices
      agg.sources[item.source] = (agg.sources[item.source] || 0) + 1;
      agg.devices[item.device] = (agg.devices[item.device] || 0) + 1;
    });
    
    // Finalize aggregated data
    Object.values(aggregated).forEach(agg => {
      agg.uniqueVisitors = agg.uniqueVisitors.size;
      agg.sessions = agg.sessions.size;
      agg.avgTimeOnPage = agg.timeCount > 0 ? agg.totalTimeOnPage / agg.timeCount : 0;
      
      // Get primary source and device
      agg.primarySource = Object.keys(agg.sources).reduce((a, b) => 
        agg.sources[a] > agg.sources[b] ? a : b
      );
      agg.primaryDevice = Object.keys(agg.devices).reduce((a, b) => 
        agg.devices[a] > agg.devices[b] ? a : b
      );
      agg.sourceCount = agg.sources[agg.primarySource];
      agg.deviceCount = agg.devices[agg.primaryDevice];
    });
    
    return aggregated;
  }
  
  /**
   * Update analytics with new data
   */
  async updateAnalytics(data) {
    try {
      const filter = {
        pageId: data.pageId,
        date: {
          $gte: new Date(data.date).setHours(0, 0, 0, 0),
          $lt: new Date(data.date).setHours(23, 59, 59, 999)
        }
      };
      
      const update = {
        $inc: {},
        $setOnInsert: {
          pageId: data.pageId,
          slug: data.slug,
          date: data.date,
          hour: new Date(data.date).getHours(),
          dayOfWeek: new Date(data.date).getDay()
        }
      };
      
      // Add incremental updates
      Object.keys(data).forEach(key => {
        if (!['pageId', 'slug', 'date'].includes(key)) {
          if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
            Object.keys(data[key]).forEach(subKey => {
              update.$inc[`${key}.${subKey}`] = data[key][subKey];
            });
          } else if (typeof data[key] === 'number') {
            update.$inc[key] = data[key];
          }
        }
      });
      
      // Handle keywords array
      if (data.keywords && Array.isArray(data.keywords)) {
        update.$push = { keywords: { $each: data.keywords } };
      }
      
      return await Analytics.findOneAndUpdate(filter, update, { 
        upsert: true, 
        new: true 
      });
      
    } catch (error) {
      console.error('Error updating analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get comprehensive analytics dashboard data
   */
  async getDashboardData(dateRange = 30) {
    try {
      const [
        topPages,
        trafficTrends,
        searchPerformance,
        conversionMetrics,
        audienceInsights
      ] = await Promise.all([
        this.getTopPerformingPages(10, dateRange),
        this.getTrafficTrends(dateRange),
        this.getSearchPerformance(25),
        this.getConversionMetrics(dateRange),
        this.getAudienceInsights(dateRange)
      ]);
      
      return {
        topPages,
        trafficTrends,
        searchPerformance,
        conversionMetrics,
        audienceInsights,
        summary: await this.getSummaryMetrics(dateRange)
      };
      
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
  
  /**
   * Get top performing pages
   */
  async getTopPerformingPages(limit = 10, dateRange = 30) {
    return Analytics.getTopPerformingPages(limit, dateRange);
  }
  
  /**
   * Get traffic trends
   */
  async getTrafficTrends(days = 30) {
    return Analytics.getTrafficTrends(days);
  }
  
  /**
   * Get search performance
   */
  async getSearchPerformance(limit = 50) {
    return Analytics.getSearchPerformance(limit);
  }
  
  /**
   * Get conversion metrics
   */
  async getConversionMetrics(dateRange = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    
    return Analytics.aggregate([
      {
        $match: { date: { $gte: startDate } }
      },
      {
        $group: {
          _id: null,
          totalConversions: { $sum: '$conversions.reelGenerated' },
          totalRevenue: { $sum: '$conversions.revenue' },
          emailSignups: { $sum: '$conversions.emailSignup' },
          totalSessions: { $sum: '$sessions' }
        }
      },
      {
        $addFields: {
          conversionRate: {
            $cond: {
              if: { $gt: ['$totalSessions', 0] },
              then: { $multiply: [{ $divide: ['$totalConversions', '$totalSessions'] }, 100] },
              else: 0
            }
          }
        }
      }
    ]);
  }
  
  /**
   * Get audience insights
   */
  async getAudienceInsights(dateRange = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    
    return Analytics.aggregate([
      {
        $match: { date: { $gte: startDate } }
      },
      {
        $group: {
          _id: null,
          totalDesktop: { $sum: '$devices.desktop' },
          totalMobile: { $sum: '$devices.mobile' },
          totalTablet: { $sum: '$devices.tablet' },
          organicTraffic: { $sum: '$sources.organic' },
          directTraffic: { $sum: '$sources.direct' },
          socialTraffic: { $sum: '$sources.social' },
          referralTraffic: { $sum: '$sources.referral' },
          avgTimeOnPage: { $avg: '$avgTimeOnPage' }
        }
      }
    ]);
  }
  
  /**
   * Get summary metrics
   */
  async getSummaryMetrics(dateRange = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    
    const [current, previous] = await Promise.all([
      // Current period
      Analytics.aggregate([
        {
          $match: { date: { $gte: startDate } }
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$pageViews' },
            totalUnique: { $sum: '$uniqueVisitors' },
            totalSessions: { $sum: '$sessions' },
            totalBounces: { $sum: '$bounces' },
            avgTimeOnPage: { $avg: '$avgTimeOnPage' }
          }
        }
      ]),
      
      // Previous period for comparison
      Analytics.aggregate([
        {
          $match: { 
            date: { 
              $gte: new Date(startDate.getTime() - (dateRange * 24 * 60 * 60 * 1000)),
              $lt: startDate
            }
          }
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$pageViews' },
            totalUnique: { $sum: '$uniqueVisitors' },
            totalSessions: { $sum: '$sessions' }
          }
        }
      ])
    ]);
    
    const currentData = current[0] || {};
    const previousData = previous[0] || {};
    
    return {
      current: currentData,
      previous: previousData,
      changes: {
        views: this.calculatePercentageChange(currentData.totalViews, previousData.totalViews),
        unique: this.calculatePercentageChange(currentData.totalUnique, previousData.totalUnique),
        sessions: this.calculatePercentageChange(currentData.totalSessions, previousData.totalSessions)
      }
    };
  }
  
  /**
   * Calculate percentage change
   */
  calculatePercentageChange(current, previous) {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
  
  /**
   * Start batch processor
   */
  startBatchProcessor() {
    setInterval(() => {
      if (this.batchQueue.length > 0) {
        this.processBatch();
      }
    }, this.flushInterval);
  }
  
  /**
   * Update page performance metrics
   */
  async updatePagePerformance(pageId, metrics) {
    try {
      await Page.findByIdAndUpdate(pageId, {
        'performance.views': metrics.views,
        'performance.uniqueVisitors': metrics.uniqueVisitors,
        'performance.bounceRate': metrics.bounceRate,
        'performance.avgTimeOnPage': metrics.avgTimeOnPage,
        'performance.conversionRate': metrics.conversionRate
      });
    } catch (error) {
      console.error('Error updating page performance:', error);
    }
  }
  
  /**
   * Generate analytics export
   */
  async exportAnalytics(dateRange = 30, format = 'json') {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    
    const data = await Analytics.find({
      date: { $gte: startDate }
    }).populate('pageId', 'slug content.title dimensions');
    
    if (format === 'csv') {
      return this.convertToCSV(data);
    }
    
    return data;
  }
  
  /**
   * Convert data to CSV format
   */
  convertToCSV(data) {
    const headers = [
      'Date', 'Page Title', 'Slug', 'Views', 'Unique Visitors', 
      'Sessions', 'Bounce Rate', 'Avg Time', 'Conversions'
    ];
    
    const rows = data.map(item => [
      item.date.toISOString().split('T')[0],
      item.pageId?.content?.title || 'N/A',
      item.slug,
      item.pageViews,
      item.uniqueVisitors,
      item.sessions,
      item.bounceRate.toFixed(2) + '%',
      Math.round(item.avgTimeOnPage) + 's',
      item.conversions.reelGenerated
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

module.exports = AnalyticsService;