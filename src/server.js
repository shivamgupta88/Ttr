require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/database');

// Routes
const pagesRoutes = require('./routes/pages');
const generateRoutes = require('./routes/generate');
const analyticsRoutes = require('./routes/analytics');
const sitesRoutes = require('./routes/sites');
const urlMappingsRoutes = require('./routes/urlMappings');

// Middleware
const { urlRedirectMiddleware } = require('./middleware/urlRedirectMiddleware');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;
const WORKER_ID = process.env.WORKER_ID || '0';

// Connect to MongoDB
connectDB();

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false
}));

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://texttoreels.in'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Visitor-ID', 'X-Session-ID', 'X-Traffic-Source', 'X-Device-Type', 'X-Country']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      worker: WORKER_ID,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    if (duration > 1000) { // Log slow requests
      console.log('🐌 Slow Request:', JSON.stringify(logData));
    } else if (process.env.NODE_ENV === 'development') {
      console.log('📝 Request:', JSON.stringify(logData));
    }
  });
  
  next();
});

// Rate limiting for API endpoints
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => 
  rateLimit({
    windowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for local development
      return process.env.NODE_ENV === 'development' && req.ip === '::1';
    }
  });

// Different rate limits for different endpoints
app.use('/api/generate/bulk', createRateLimiter(60 * 60 * 1000, 5, 'Too many bulk generation requests')); // 5 per hour
app.use('/api/generate', createRateLimiter(15 * 60 * 1000, 100, 'Too many generation requests')); // 100 per 15 minutes
app.use('/api/analytics', createRateLimiter(15 * 60 * 1000, 500, 'Too many analytics requests')); // 500 per 15 minutes
app.use('/api', createRateLimiter(15 * 60 * 1000, 1000, 'Too many API requests')); // 1000 per 15 minutes

// Health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    worker: WORKER_ID,
    uptime: process.uptime(),
    memory: {
      used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
    },
    database: 'connected', // You might want to check actual DB connection
    version: process.env.npm_package_version || '1.0.0'
  };
  
  res.json(healthData);
});

// URL redirect middleware (must be before API routes)
app.use(urlRedirectMiddleware);

// API Routes
app.use('/api/pages', pagesRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/url-mappings', urlMappingsRoutes);

// Serve static files (for sitemaps, robots.txt, etc.)
app.use('/public', express.static('public'));
app.use('/robots.txt', express.static('public/robots.txt'));
app.use('/sitemap*.xml', express.static('public'));

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  const apiDocs = {
    title: 'TextToReels Backend API',
    version: '1.0.0',
    description: 'High-performance backend for static page generation and analytics',
    worker: WORKER_ID,
    endpoints: {
      pages: {
        'GET /api/pages': 'Get paginated list of pages with filtering',
        'GET /api/pages/:slug': 'Get single page by slug',
        'POST /api/pages': 'Create new page',
        'PUT /api/pages/:slug': 'Update page by slug',
        'DELETE /api/pages/:slug': 'Delete page by slug',
        'GET /api/pages/stats/overview': 'Get pages overview statistics',
        'POST /api/pages/bulk': 'Bulk operations on pages'
      },
      generation: {
        'POST /api/generate/bulk': 'Start bulk page generation (up to 1M pages)',
        'GET /api/generate/status': 'Get generation status and statistics',
        'POST /api/generate/single': 'Generate single page with specific dimensions',
        'GET /api/generate/dimensions': 'Get available dimensions for generation',
        'POST /api/generate/preview': 'Preview generated content without saving',
        'POST /api/generate/seo': 'Generate SEO assets (sitemaps, robots.txt)',
        'DELETE /api/generate/cleanup': 'Clean up generated pages'
      },
      analytics: {
        'GET /api/analytics/dashboard': 'Get comprehensive dashboard data',
        'POST /api/analytics/track': 'Track custom analytics event',
        'GET /api/analytics/pages/top': 'Get top performing pages',
        'GET /api/analytics/traffic/trends': 'Get traffic trends over time',
        'GET /api/analytics/search/performance': 'Get search engine performance',
        'GET /api/analytics/conversions': 'Get conversion metrics',
        'GET /api/analytics/realtime': 'Get real-time analytics data',
        'GET /api/analytics/export': 'Export analytics data (JSON/CSV)'
      }
    },
    capabilities: {
      'Page Generation': 'Generate millions of unique pages with advanced algorithms',
      'SEO Optimization': 'Automatic sitemaps, structured data, meta tags',
      'Analytics Tracking': 'Comprehensive analytics with real-time data',
      'Performance': 'Optimized for M4 processors with clustering',
      'Bulk Operations': 'Efficient bulk operations for large datasets'
    }
  };
  
  res.json(apiDocs);
});

// Catch-all for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    availableEndpoints: '/api/docs'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TextToReels Backend API',
    version: '1.0.0',
    worker: WORKER_ID,
    documentation: '/api/docs',
    health: '/health',
    status: 'running'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Global Error Handler:', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    url: req.url,
    method: req.method,
    worker: WORKER_ID
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    error: isDevelopment ? error.message : 'Internal server error',
    ...(isDevelopment && { stack: error.stack }),
    worker: WORKER_ID
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Worker ${WORKER_ID} received ${signal}. Starting graceful shutdown...`);
  
  global.server.close((err) => {
    if (err) {
      console.error('❌ Error during server close:', err);
      process.exit(1);
    }
    
    console.log(`✅ Worker ${WORKER_ID} HTTP server closed`);
    
    // Close database connection
    require('mongoose').connection.close((err) => {
      if (err) {
        console.error('❌ Error closing MongoDB:', err);
      } else {
        console.log(`✅ Worker ${WORKER_ID} MongoDB connection closed`);
      }
      process.exit(0);
    });
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    console.error(`💥 Worker ${WORKER_ID} force exit after 30 seconds`);
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('💥 Unhandled Promise Rejection:', {
    error: err.message,
    worker: WORKER_ID,
    stack: err.stack
  });
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', {
    error: err.message,
    worker: WORKER_ID,
    stack: err.stack
  });
  process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Worker ${WORKER_ID} server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${process.env.MONGODB_URI ? 'MongoDB connected' : 'MongoDB URI not set'}`);
  console.log(`⚡ Performance mode: M4 optimized`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});

// Store server globally for graceful shutdown
global.server = server;

// Optimize server for high performance
server.keepAliveTimeout = 65000; // Slightly higher than ALB idle timeout
server.headersTimeout = 66000; // Slightly higher than keepAliveTimeout

module.exports = app;