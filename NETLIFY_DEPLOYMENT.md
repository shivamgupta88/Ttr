# 🚀 Netlify Deployment Guide for TextToReels.in

## Quick Setup Steps

### 1. Connect GitHub Repository to Netlify

1. **Login to Netlify** → Go to [netlify.com](https://netlify.com)
2. **Click "New site from Git"**
3. **Choose GitHub** → Authorize if needed
4. **Select Repository**: `shivamgupta88/Ttr`
5. **Configure Build Settings**:
   - **Base directory**: `netlify-deploy`
   - **Build command**: `echo 'Static site ready for deployment'`
   - **Publish directory**: `netlify-deploy`

### 2. Deploy Configuration

Netlify will automatically:
- ✅ Use the `netlify.toml` configuration
- ✅ Set up proper redirects from `_redirects` file
- ✅ Enable security headers and caching
- ✅ Handle all static pages and routing

### 3. Custom Domain Setup (Optional)

1. **Add Custom Domain** → Go to Domain Settings
2. **Configure DNS**:
   ```
   Type: CNAME
   Name: www
   Value: [your-netlify-subdomain].netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5
   ```

### 4. Environment Variables (Analytics)

Go to **Site Settings** → **Environment Variables** and add:

```bash
# Umami Analytics
UMAMI_WEBSITE_ID=your-umami-website-id

# Google Analytics (Optional)
GA_TRACKING_ID=GA_TRACKING_ID

# Microsoft Clarity (Optional)
CLARITY_ID=CLARITY_ID
```

### 5. Post-Deployment

After deployment, these URLs will work:
- **Main Site**: `https://yourdomain.com/`
- **Contact**: `https://yourdomain.com/contact.html`
- **Privacy**: `https://yourdomain.com/privacy-policy.html`
- **Terms**: `https://yourdomain.com/terms-of-service.html`
- **API Docs**: `https://yourdomain.com/api.html`

All redirects `/contact` → `/contact.html` work automatically.

### 6. SEO Features Included

✅ **Complete Sitemap Structure**
- Main sitemap: `/sitemap.xml`
- Pages sitemap: `/sitemap-pages.xml`
- Content sitemap: `/sitemap-content.xml`

✅ **Analytics Ready**
- Umami tracking on all pages
- Google Analytics placeholder
- Microsoft Clarity placeholder

✅ **Performance Optimized**
- Static asset caching (1 year)
- HTML caching (1 hour)
- Gzip compression
- Security headers

---

## 🔧 Update Analytics IDs

Before going live, search and replace in all files:
- `UMAMI_WEBSITE_ID` → Your actual Umami ID
- `GA_TRACKING_ID` → Your Google Analytics ID
- `CLARITY_ID` → Your Microsoft Clarity ID

---

**Ready for deployment!** Just connect the repo to Netlify and everything will work automatically.