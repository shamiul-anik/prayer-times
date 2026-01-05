# PWA Deployment Checklist

## 🚀 Pre-Deployment Checklist

### [ ] Development Setup
- [ ] Clone/download repository
- [ ] Run `npm install` (if needed)
- [ ] Verify Node.js/server runs locally
- [ ] Test app on http://localhost:3000 (or your port)

### [ ] Icon Generation
- [ ] Run `npm install canvas` (if not done)
- [ ] Run `node generate-icons.js` to generate all icons
- [ ] Verify `public/icons/` folder has all PNG files
- [ ] Icons created:
  - [ ] icon-72x72.png
  - [ ] icon-96x96.png
  - [ ] icon-128x128.png
  - [ ] icon-144x144.png
  - [ ] icon-152x152.png
  - [ ] icon-192x192.png
  - [ ] icon-384x384.png
  - [ ] icon-512x512.png
  - [ ] icon-maskable-192x192.png
  - [ ] icon-maskable-512x512.png
  - [ ] screenshot-540x720.png
  - [ ] screenshot-1280x720.png

### [ ] File Verification
Ensure all PWA files exist:
- [ ] `public/manifest.json` - exists and valid
- [ ] `public/sw.js` - exists and no syntax errors
- [ ] `public/pwa.js` - exists and no syntax errors
- [ ] `public/index.html` - updated with PWA meta tags
- [ ] `public/script.js` - updated with notification logic
- [ ] `public/icons/` - folder with generated icons
- [ ] `public/audio/a1.mp3` - Adhan audio exists

### [ ] Manifest.json Validation
- [ ] Name field present and reasonable
- [ ] Short_name present (12 characters or less)
- [ ] Description present
- [ ] Start_url correct (usually "/")
- [ ] Display set to "standalone"
- [ ] Theme_color valid hex color
- [ ] Background_color valid hex color
- [ ] Icons array has at least 192x192 and 512x512
- [ ] Icons point to correct file paths
- [ ] Use JSON validator: https://web.dev/manifest/

### [ ] HTML/JavaScript Validation
- [ ] No console errors in DevTools (F12)
- [ ] No syntax errors in JavaScript
- [ ] Service Worker logs appear in console
- [ ] Manifest loads without errors
- [ ] All external resources load (CSS, JS, fonts)
- [ ] No mixed HTTP/HTTPS content

### [ ] Service Worker Testing
- [ ] Open DevTools → Application tab
- [ ] Service Worker shows "active and running"
- [ ] Manifest shows valid JSON
- [ ] Cache storage shows "prayer-times-v1"
- [ ] Static assets are cached
- [ ] API responses are cached

### [ ] Offline Testing
- [ ] Open DevTools → Network tab
- [ ] Check "Offline" checkbox
- [ ] Reload page
- [ ] Page still loads with cached content
- [ ] Next prayer section shows cached data
- [ ] Adhan audio still plays
- [ ] Uncheck "Offline" and verify online again

### [ ] Notification Testing
- [ ] Permission dialog appears on first load
- [ ] Can grant notification permission
- [ ] Welcome notification appears
- [ ] Can close notification
- [ ] Notification sounds/vibrates (device specific)
- [ ] At prayer time, notification triggers
- [ ] Can click notification to open app

### [ ] Installation Testing
- [ ] Chrome: Install button appears in address bar
- [ ] Click install button
- [ ] Confirmation dialog appears
- [ ] App installs to home screen
- [ ] App icon appears with correct name
- [ ] App opens in standalone mode (no address bar)
- [ ] Can uninstall via menu

### [ ] Browser Compatibility
- [ ] Chrome/Chromium: Full functionality
- [ ] Edge: Full functionality  
- [ ] Firefox: Service Worker and icons work
- [ ] Safari: Can add to home screen (iOS 15.1+)
- [ ] Mobile Chrome Android: Install works
- [ ] Mobile Safari iOS: Home screen add works

---

## 🌐 Production Deployment

### [ ] Server/Hosting Setup
- [ ] HTTPS enabled (required for PWA)
- [ ] SSL certificate valid and not expired
- [ ] Domain points to correct server
- [ ] Server responds on standard ports (80, 443)

### [ ] Cache Headers Configuration
Configure correct cache headers for each file type:

**Service Worker (CRITICAL - don't cache):**
```
/sw.js:
  Cache-Control: public, max-age=0, must-revalidate
```

**App Manifest:**
```
/manifest.json:
  Cache-Control: public, max-age=3600 (1 hour)
```

**Static Assets (can cache long-term):**
```
*.css, *.js:
  Cache-Control: public, max-age=31536000 (1 year)

/index.html:
  Cache-Control: public, max-age=3600 (1 hour)
```

**Icons (long-term cache):**
```
/icons/*:
  Cache-Control: public, max-age=31536000 (1 year)
```

### [ ] Vercel Deployment (if applicable)
- [ ] `vercel.json` configured correctly
- [ ] Service Worker cache headers set
- [ ] Manifest cache headers set
- [ ] Deploy using `vercel` or `vercel deploy`
- [ ] Verify deployment successful
- [ ] Check site on production URL

### [ ] Environment Verification
- [ ] Production URL is HTTPS
- [ ] No mixed content warnings
- [ ] API endpoints work correctly
- [ ] Icons load from correct paths
- [ ] Audio file loads correctly
- [ ] No CORS errors

### [ ] Performance Check
- [ ] Lighthouse PWA score
- [ ] PageSpeed Insights score
- [ ] Load time under 3 seconds
- [ ] First Contentful Paint reasonable
- [ ] Cumulative Layout Shift minimal

---

## 📋 Testing Checklist (Production)

### [ ] Desktop Testing
- [ ] Open in Chrome (desktop)
- [ ] Service Worker active and running
- [ ] Install button appears
- [ ] Can install app
- [ ] App works offline
- [ ] Notifications work
- [ ] No console errors

### [ ] Mobile Testing (Android)
- [ ] Open in Chrome Mobile
- [ ] Install banner appears
- [ ] Can install app
- [ ] App opens from home screen
- [ ] Uses correct theme color
- [ ] Displays full screen (no address bar)
- [ ] Notifications work
- [ ] Adhan plays
- [ ] Works offline

### [ ] Mobile Testing (iOS)
- [ ] Open in Safari
- [ ] Can add to home screen
- [ ] App name is correct
- [ ] Icon displays correctly
- [ ] Opens full screen
- [ ] Displays correctly in light/dark mode
- [ ] Prayer times update correctly
- [ ] Notifications work (limited support)

### [ ] Feature Testing
- [ ] City/country selection works
- [ ] Prayer times load correctly
- [ ] Next prayer displays
- [ ] Time countdown updates
- [ ] Adhan plays at prayer time
- [ ] Notification appears with Adhan
- [ ] Dates show correct Gregorian and Hijri
- [ ] Juristic school selection works

---

## 🔒 Security Checklist

- [ ] HTTPS on all pages
- [ ] No HTTP fallback
- [ ] No sensitive data in cache
- [ ] Content Security Policy headers set
- [ ] X-Content-Type-Options header set
- [ ] X-Frame-Options header set
- [ ] Referrer-Policy header set
- [ ] API endpoints validate requests
- [ ] No credentials exposed in service worker
- [ ] No hard-coded API keys

---

## 📊 Post-Deployment Monitoring

### [ ] Error Tracking
- [ ] Set up error logging/monitoring
- [ ] Monitor Service Worker errors
- [ ] Monitor API errors
- [ ] Check notification failures
- [ ] Review console errors (if accessible)

### [ ] Performance Monitoring
- [ ] Monitor page load time
- [ ] Track Service Worker registration success rate
- [ ] Monitor cache hit rate
- [ ] Track API response times
- [ ] Monitor offline usage patterns

### [ ] User Analytics
- [ ] Track installation count
- [ ] Monitor active users
- [ ] Track notification engagement
- [ ] Monitor notification clicks
- [ ] Track feature usage

### [ ] Maintenance
- [ ] Monitor for updates needed
- [ ] Update dependencies regularly
- [ ] Monitor SSL certificate expiration
- [ ] Review and update cache strategy if needed
- [ ] Monitor storage usage

---

## 🎯 Launch Promotion

- [ ] Update app store listings (Google Play, iOS App Store)
- [ ] Announce PWA features on website
- [ ] Create blog post about PWA
- [ ] Update documentation
- [ ] Share on social media
- [ ] Email users about app availability

---

## 📝 Rollback Plan

### If Issues Occur:
1. **Minor Issues**: Push fix and increment `CACHE_NAME` in `sw.js`
2. **Major Issues**: 
   - Revert to previous commit
   - Clear cloudflare cache (if applicable)
   - Monitor error rates before re-deploying

### Emergency Contacts:
- [ ] Team lead
- [ ] DevOps engineer
- [ ] Customer support lead

---

## ✅ Sign-Off

- [ ] All checks completed
- [ ] No blockers or issues
- [ ] Ready for production
- [ ] Deployment approved by: ________________
- [ ] Deployed by: ________________
- [ ] Date: ________________
- [ ] Notes: 

---

## 📞 Support & Escalation

### Known Issues:
- iOS notifications limited to foreground only
- Background sync only on Chrome/Edge
- Some older Android devices may not support PWA

### Workarounds:
- iOS: Users receive notifications when app open
- Firefox: Service Worker works, background sync limited
- Older Android: App still works as responsive website

### Contact & Support:
- Issue tracking: [Your issue tracker]
- Documentation: [Your docs site]
- Support email: [Your support email]

---

**Version:** 1.0
**Last Updated:** January 2026
**Status:** Ready for Deployment
