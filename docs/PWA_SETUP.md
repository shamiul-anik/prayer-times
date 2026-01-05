# Prayer Times PWA - Installation & Configuration Guide

## Overview
Your Prayer Times application is now configured as a **Progressive Web App (PWA)**, making it installable on smartphones and desktop devices with offline support and push notifications.

## What's New

### ✅ Features Added
1. **Service Worker** - Offline functionality and caching strategy
2. **Web App Manifest** - App installation on home screen
3. **Push Notifications** - Prayer time alerts with Adhan
4. **Background Sync** - Automatic data updates in background
5. **Responsive Icons** - Multiple sizes for different devices

## Files Created/Modified

### New Files:
- `public/manifest.json` - PWA metadata and configuration
- `public/sw.js` - Service Worker for offline support
- `public/pwa.js` - PWA initialization and notification handling
- `generate-icons.js` - Script to generate app icons
- `icon-generator.html` - Browser-based icon generator

### Modified Files:
- `public/index.html` - Added manifest link and PWA meta tags
- `public/script.js` - Integrated PWA notifications with Adhan playback

### Icon Directory:
- `public/icons/` - Store app icons here (generated separately)

## Icon Generation

### Method 1: Node.js Script (Recommended)
```bash
# Install required dependency
npm install canvas

# Generate all icons
node generate-icons.js
```

This will create:
- 8 standard icons (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
- 2 maskable icons (192x192, 512x512) - for devices that support adaptive icons
- 2 screenshot images for app stores

### Method 2: Browser-Based Generator
1. Open `icon-generator.html` in your web browser
2. Click "Generate All Icons"
3. Download each icon by clicking the download button
4. Save all files to `public/icons/` folder

**Important:** Icon filenames must match exactly as specified in `manifest.json`

## Installation on Devices

### Android
1. Open your PWA in Chrome
2. Tap the menu (three dots) → "Install app"
3. Or tap the "Install" banner if displayed
4. Tap "Install"

### iOS (iPhone/iPad)
1. Open your PWA in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Enter a name and tap "Add"
5. Note: iOS PWAs are limited compared to Android (no background sync)

### Desktop (Windows/Mac/Linux)
1. Open your PWA in Chrome, Edge, or other Chromium browsers
2. Click the install icon in the address bar (if available)
3. Or use the app menu → "Install app"

## Notification Setup

### User Permissions
When users first load the app, they'll be prompted to enable notifications:
- **Allow**: Receive prayer time notifications
- **Block**: No notifications (but app still works offline)

### Notification Features
- 🔔 Automatic notifications at prayer times
- 🎵 Adhan audio playback with notification
- ⏰ Customizable notification timing
- 📱 Works even when app is closed (with Service Worker)

## Testing the PWA

### Test Offline Functionality
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline" checkbox
4. Page should still load with cached content

### Test Notifications
1. Allow notifications when prompted
2. The app will show a welcome notification
3. At prayer times, you'll receive notifications

### Test Installation
1. Look for install prompt/banner
2. Install the app to your home screen
3. Open from home screen icon

## Deployment Considerations

### For Vercel
The current `vercel.json` should work, but verify:
```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

Service Worker should NOT be cached (always serve latest version).

### For Other Hosts
Ensure these files are served with correct headers:
- `sw.js` - No caching or short cache (max-age=0)
- `manifest.json` - No caching recommended
- Other static files - Can be cached normally

### HTTPS Requirement
PWAs require HTTPS (except localhost):
- ✅ Production: Must use HTTPS
- ✅ Development: http://localhost works
- ❌ HTTP (non-localhost): Won't work

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ⚠️ | ✅ |
| Web App Manifest | ✅ | ✅ | ❌ | ✅ |
| Notifications | ✅ | ✅ | ⚠️ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Periodic Sync | ✅ | ❌ | ❌ | ✅ |

Notes:
- Safari: Limited PWA support on iOS, better on macOS
- Firefox: Notifications require user interaction first

## Configuration Options

### Update Service Worker Cache
Edit `public/sw.js`, line 3:
```javascript
const CACHE_NAME = 'prayer-times-v1'; // Change version to bust cache
```

### Modify Notification Appearance
Edit `public/pwa.js`, `showPrayerNotification()` method:
```javascript
const notificationOptions = {
  body: `It's time for ${prayer.name}...`,
  // ... customize here
};
```

### Change App Name/Theme
Edit `public/manifest.json`:
```json
{
  "name": "Prayer Times Dashboard",
  "short_name": "Prayer Times",
  "theme_color": "#1b4332",
  // ...
}
```

## Troubleshooting

### Icons Not Showing
1. Verify all icon files are in `public/icons/` directory
2. Check manifest.json has correct icon paths
3. Clear browser cache and reload
4. Run `node generate-icons.js` if icons are missing

### Notifications Not Working
1. Check browser notification permissions
2. Verify Service Worker is registered (DevTools → Application → Service Workers)
3. Ensure HTTPS is enabled (or testing on localhost)
4. Check browser console for errors (F12)

### App Won't Install
1. Verify manifest.json is valid (use web.dev/manifest validator)
2. Check all required manifest fields present
3. Ensure icons exist at specified paths
4. Verify HTTPS connection
5. Check screen size requirements (typically needs > 320px width)

### Service Worker Updates Not Showing
1. The app checks for updates every hour
2. Or manually refresh the page
3. Check Network tab in DevTools to see service worker requests

## Testing Checklist

- [ ] Service Worker registered and running
- [ ] Manifest.json valid and icons present
- [ ] App installable on Android
- [ ] App installable on iOS
- [ ] Notifications working at prayer times
- [ ] Offline mode displays cached content
- [ ] Background sync registered (Chrome/Edge)
- [ ] HTTPS working on production

## Next Steps

1. **Generate Icons**: Run `npm install canvas && node generate-icons.js`
2. **Test Locally**: Open http://localhost:3000 (adjust port as needed)
3. **Deploy to Production**: Push to your hosting platform
4. **Monitor**: Check browser console and DevTools for errors
5. **Update**: Bump `CACHE_NAME` version when deploying updates

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web App Manifest](https://www.w3.org/TR/appmanifest/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Manifest Validator](https://web.dev/manifest/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console errors (F12)
3. Test in incognito/private mode to rule out cache issues
4. Check [web.dev](https://web.dev) for PWA best practices

---

**Created:** January 2026
**Version:** 1.0
**Status:** Ready for Production
