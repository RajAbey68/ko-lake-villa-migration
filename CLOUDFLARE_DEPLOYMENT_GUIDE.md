# Ko Lake Villa - Cloudflare Pages Deployment Guide

This guide walks you through deploying Ko Lake Villa to Cloudflare Pages for optimal global performance and cost efficiency.

## Overview

Ko Lake Villa is configured for Cloudflare Pages deployment with:
- **Global CDN**: Optimized delivery for EU/Gulf, Asia/UAE, and US/Canada regions
- **Performance**: Pre-configured for 20 steady-state / 100 peak concurrent users
- **Cost Efficiency**: Serverless architecture with pay-per-use scaling
- **Security**: Built-in DDoS protection and security headers

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Ko Lake Villa code pushed to GitHub
3. **Supabase Project**: Backend database and API configured
4. **Domain** (Optional): Custom domain for production

## Deployment Steps

### 1. Connect GitHub Repository

1. Log into Cloudflare Dashboard
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Select **Connect to Git**
5. Choose your Ko Lake Villa repository
6. Click **Begin setup**

### 2. Configure Build Settings

Use these exact settings in the Cloudflare Pages setup:

```yaml
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
```

**Advanced Settings:**
- Node.js version: `20.x`
- Environment variables: (see section below)

### 3. Environment Variables

Configure these in **Settings > Environment variables**:

#### Required Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Contact Configuration  
VITE_CONTACT_EMAIL=info@kolakevilla.com
VITE_WHATSAPP_NUMBER=+94771234567

# App Configuration
VITE_APP_NAME=Ko Lake Villa
VITE_APP_URL=https://kolakevilla.com
```

#### Optional Variables
```bash
# Guesty Integration (if using PMS)
# ⚠️ SECURITY: API keys must NOT be exposed client-side
# Use Edge Functions for secure API integration
VITE_GUESTY_API_URL=https://api.guesty.com

# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=your-hotjar-id

# Performance
VITE_CDN_URL=https://your-cdn-domain.com
VITE_IMAGE_OPTIMIZATION_ENABLED=true
```

### 4. Domain Configuration

#### Using Cloudflare Domain
1. Go to **Pages > Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `kolakevilla.com`
4. Follow DNS configuration instructions

#### Using External Domain
1. Point your domain's nameservers to Cloudflare
2. Add the domain in **Pages > Custom domains**
3. Cloudflare will automatically configure SSL

### 5. Optimization Settings

#### Cloudflare Dashboard Optimizations

**Speed > Optimization:**
- ✅ Auto Minify: HTML, CSS, JavaScript
- ❌ Rocket Loader: OFF (can break modern ES6+ bundles - Vite handles optimization)
- ✅ Mirage: ON
- ✅ Polish: Lossless

**Speed > Caching:**
- Cache Level: Standard
- Browser Cache TTL: 4 hours
- Development Mode: OFF (for production)

**Security > Settings:**
- Security Level: Medium
- Challenge Passage: 30 minutes
- Browser Integrity Check: ON

### 6. Verify Deployment

After deployment, verify these endpoints:

1. **Homepage**: `https://your-domain.com/`
2. **Health Check**: `https://your-domain.com/build-info.json`
3. **SEO Files**: 
   - `https://your-domain.com/robots.txt`
   - `https://your-domain.com/sitemap.xml`
4. **PWA Manifest**: `https://your-domain.com/manifest.json`

## Performance Monitoring

### Cloudflare Analytics
1. Navigate to **Analytics > Web Analytics**
2. Enable Real User Monitoring (RUM)
3. Monitor Core Web Vitals:
   - Largest Contentful Paint (LCP) < 2.5s
   - First Input Delay (FID) < 100ms
   - Cumulative Layout Shift (CLS) < 0.1

### Custom Monitoring
The app includes built-in performance logging:
```javascript
// Check browser console for performance metrics
// Automatically logged on page load
```

## Cost Optimization

### Cloudflare Pages Pricing
- **Free Tier**: 500 builds/month, 20,000 requests/month
- **Pro Tier ($20/month)**: Unlimited builds, 10M requests/month
- **Business Tier**: Advanced features for high-traffic sites

### Expected Costs (20-100 concurrent users)
- **Free Tier**: $0/month (likely sufficient for initial launch)
- **Pro Tier**: $20/month (recommended for production)
- **Additional**: $0.50 per 1M additional requests

### Cost Monitoring
1. Monitor usage in **Analytics > Usage**
2. Set up billing alerts at 80% of limits
3. Consider upgrading before hitting limits

## Security Configuration

### Automatic Security Features
- DDoS protection (included)
- SSL/TLS encryption (automatic)
- Bot protection (configurable)
- Security headers (pre-configured)

### API Key Security
⚠️ **CRITICAL**: Never expose API keys in client-side environment variables!

**Secure Approach:**
- Use **Edge Functions** for server-side API calls requiring secrets
- Store sensitive keys in **Cloudflare Environment Variables** (server-side only)
- Only expose public configuration via `VITE_*` variables

**Client vs Server Variables:**
- `VITE_*` variables: Publicly accessible in browser (use for public configs only)
- Non-`VITE_*` variables: Server-side only (use for API keys, secrets)

### Additional Security
1. **WAF Rules**: Configure if needed for high-security requirements
2. **Access Control**: Use Cloudflare Access for admin areas
3. **Rate Limiting**: Configure for API endpoints if needed
4. **Edge Functions**: Handle sensitive API integrations server-side

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Cloudflare Pages dashboard
# Common fixes:
- Verify Node.js version (use 20.x)
- Check environment variables are set
- Ensure all dependencies are in package.json
```

#### Deployment Issues
```bash
# Clear cache and retry
- Go to Caching > Configuration
- Click "Purge Everything"
- Redeploy from Pages dashboard
```

#### Performance Issues
```bash
# Enable Development Mode temporarily
- Speed > Caching > Development Mode: ON
- Test performance
- Turn OFF after testing
```

### Getting Help

1. **Cloudflare Community**: [community.cloudflare.com](https://community.cloudflare.com)
2. **Documentation**: [developers.cloudflare.com](https://developers.cloudflare.com)
3. **Support**: Available with paid plans

## Advanced Configuration

### Custom Headers (Already Configured)
The deployment includes optimized headers in `_headers` file:
- Security headers (XSS protection, content sniffing prevention)
- Cache control (1 year for assets, no-cache for HTML)
- CORS headers for API requests

### Redirects (Already Configured)
SPA routing is handled via `_redirects` file:
- All routes serve `index.html` for client-side routing
- Legacy SEO redirects for `/rooms` → `/accommodations`

### Wrangler Configuration
For advanced users, `wrangler.toml` provides:
- Environment-specific configurations
- Build settings
- Basic Cloudflare Pages configuration

**Note**: Headers and redirects are configured via `_headers` and `_redirects` files for better maintainability.

## Maintenance

### Regular Tasks
1. **Monthly**: Review analytics and performance metrics
2. **Quarterly**: Update dependencies and security patches
3. **Bi-annually**: Review and optimize Cloudflare settings

### Updates and Deployments
- **Automatic**: Deployments trigger on git push to main branch
- **Manual**: Redeploy from Cloudflare Pages dashboard
- **Rollback**: Use "View details" on deployments to rollback if needed

### Monitoring Checklist
- [ ] Site accessibility (uptime)
- [ ] Performance metrics (Core Web Vitals)
- [ ] Security alerts (if any)
- [ ] Cost tracking (usage vs. limits)
- [ ] User feedback and error reports

## Success Metrics

After deployment, you should achieve:

### Performance Targets
- **Global TTFB**: < 200ms (all regions)
- **LCP**: < 2.5s (75th percentile)
- **FID**: < 100ms (75th percentile)
- **CLS**: < 0.1 (75th percentile)

### Availability Targets
- **Uptime**: 99.9%+
- **Error Rate**: < 0.1%
- **MTTR**: < 5 minutes

### User Experience
- Fast loading in EU/Gulf, Asia/UAE, US/Canada
- Responsive design on all devices
- Progressive Web App features
- SEO optimized (Core Web Vitals green)

## Conclusion

Ko Lake Villa is now configured for optimal performance on Cloudflare Pages. The serverless architecture provides global reach, automatic scaling, and cost efficiency for your luxury resort booking platform.

For questions or issues, refer to the troubleshooting section or reach out to the development team.

---

**Deployment Date**: $(date)  
**Version**: 1.0.0  
**Target Platform**: Cloudflare Pages  
**Optimized For**: Global CDN, 20-100 concurrent users