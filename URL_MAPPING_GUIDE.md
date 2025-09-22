# URL Mapping System - Google Indexing Fix

This document explains the URL mapping system implemented to fix Google indexing issues where old URLs were indexed but no longer exist.

## Problem

Google indexed URLs like `/content/love-quotes-hindi-dark-theme` that were showing 404 errors when users clicked from search results. This caused poor user experience and hurt SEO rankings.

## Solution

Implemented a comprehensive URL mapping system with:

1. **Database Model** (`URLMapping`) to store redirect mappings
2. **Middleware** to handle redirects at the server level
3. **Migration Script** to add Google-indexed URLs to database
4. **Admin API** to manage URL mappings

## Database Schema

```javascript
{
  oldUrl: '/content/love-quotes-hindi-dark-theme',
  newUrl: '/content-types/love-quotes/',
  redirectType: 301, // 301, 302, or 200
  isActive: true,
  reason: 'GOOGLE_INDEXED',
  source: 'GOOGLE_SEARCH',
  hitCount: 0,
  lastHit: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Files Added

### Models
- `src/models/URLMapping.js` - Database model for URL mappings

### Middleware
- `src/middleware/urlRedirectMiddleware.js` - Express middleware for handling redirects

### Routes
- `src/routes/urlMappings.js` - API endpoints for managing URL mappings

### Scripts
- `src/scripts/addGoogleIndexedURLs.js` - Migration script for Google-indexed URLs

## API Endpoints

### Get URL Mapping Statistics
```
GET /api/url-mappings/stats
```

### Get All URL Mappings
```
GET /api/url-mappings?page=1&limit=20&search=love-quotes
```

### Add New URL Mapping
```
POST /api/url-mappings
{
  "oldUrl": "/old-path",
  "newUrl": "/new-path",
  "redirectType": 301,
  "reason": "URL_RESTRUCTURE"
}
```

### Update URL Mapping
```
PUT /api/url-mappings/:id
{
  "newUrl": "/updated-path",
  "isActive": false
}
```

### Bulk Import Mappings
```
POST /api/url-mappings/bulk-import
{
  "mappings": [
    {
      "oldUrl": "/old1",
      "newUrl": "/new1"
    },
    {
      "oldUrl": "/old2",
      "newUrl": "/new2"
    }
  ]
}
```

## Migration Usage

### Run Migration
```bash
npm run migrate:url-mappings
```

### Manual Migration
```bash
node src/scripts/addGoogleIndexedURLs.js
```

## How It Works

1. **Request Interception**: Middleware runs on every GET request
2. **URL Lookup**: Checks database for matching old URL
3. **Redirect/Rewrite**: Performs 301/302 redirect or internal rewrite (200)
4. **Hit Tracking**: Records usage statistics for monitoring
5. **Fallback**: If no mapping found, continues to normal routing

## Redirect Types

- **301 (Permanent)**: Search engines update their index to new URL
- **302 (Temporary)**: Search engines keep old URL in index
- **200 (Internal Rewrite)**: URL stays same in browser, content served from new path

## Current Mappings

The migration script added 26 URL mappings for Google-indexed URLs:

### Love Quotes (10 mappings)
- `/content/love-quotes-hindi-dark-theme` → `/content-types/love-quotes/`
- `/content/hindi-love-quotes-reel-maker` → `/content-types/love-quotes/`
- `/content/incredible-hindi-love-quotes-generator` → `/content-types/love-quotes/`
- And 7 more variants...

### Other Content Types (16 mappings)
- Motivational quotes (3 mappings)
- Friendship quotes (2 mappings)
- Good morning quotes (2 mappings)
- Hindi shayari (2 mappings)
- Birthday wishes (2 mappings)
- Platform-specific URLs (5 mappings)

## Benefits

1. **No More 404s**: Google-indexed URLs now redirect properly
2. **SEO Preservation**: 301 redirects transfer link equity
3. **User Experience**: Users reach relevant content instead of errors
4. **Analytics**: Track which old URLs are still being accessed
5. **Flexibility**: Easy to add new mappings as needed

## Monitoring

Check redirect statistics:
```bash
curl https://texttoreels.in/api/url-mappings/stats
```

Monitor server logs for redirect activity:
```
🔀 Redirecting: /content/love-quotes-hindi-dark-theme → /content-types/love-quotes/ (301)
```

## Future Maintenance

1. **Monitor Google Search Console** for new 404 errors
2. **Add new mappings** via API or migration scripts
3. **Review analytics** to see which old URLs are still popular
4. **Update redirects** if URL structure changes again

## Integration with Netlify

The system works alongside Netlify redirects in `netlify.toml`:
- **Netlify handles**: Pattern-based redirects (`/content/*love-quotes*`)
- **Database handles**: Specific URL mappings with analytics

This dual approach ensures comprehensive coverage and provides detailed tracking.