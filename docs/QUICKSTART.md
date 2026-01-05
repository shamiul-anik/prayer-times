# Quick Start: Testing Your PWA

## 🚀 Quick Setup (5 minutes)

### Step 1: Generate Icons
```bash
# Option A: Using Node.js (requires canvas module)
npm install canvas
node generate-icons.js

# Option B: Using Browser
# 1. Open icon-generator.html in browser
# 2. Click "Download All" or download individually
# 3. Save to public/icons/ folder
```

### Step 2: Start Your Server
```bash
# If using Node.js server
node server.js

# If using Python
python -m http.server 3000 -d public

# Then open: http://localhost:3000
```

### Step 3: Test on Chrome (Desktop)
1. Open DevTools: **F12**
2. Go to **Application** tab
3. Look for **Service Workers** section
4. You should see `/sw.js` registered and active
5. Try checking "Offline" to test offline mode

### Step 4: Test Notifications
1. Look for notification permission prompt
2. Click **Allow**
3. You should see a welcome notification
4. At next prayer time, you'll get a prayer notification

### Step 5: Test Installation
1. Look for **Install** button in address bar (Chrome logo icon)
2. Or open browser menu → **Install app**
3. Follow prompts to install to home screen

## 📱 Mobile Testing

### Android Chrome
1. Open app in Chrome
2. Menu (⋮) → **Install app** (or use banner)
3. Confirm installation
4. App appears on home screen

### iOS Safari
1. Open app in Safari
2. Tap Share (↗) button
3. Scroll → **Add to Home Screen**
4. Tap **Add**

## ✅ Checklist

- [ ] Service Worker showing as "active" in DevTools
- [ ] Can load offline (DevTools → Offline)
- [ ] Install prompt appears
- [ ] Can install to home screen
- [ ] Notification permission works
- [ ] Welcome notification displays
- [ ] Adhan plays at prayer times
- [ ] Notification appears with Adhan

## 🐛 Troubleshooting

**Service Worker not registering?**
- Check console for errors (F12)
- Verify `/sw.js` file exists
- Clear cache: DevTools → Application → Clear site data

**Can't install app?**
- Must be HTTPS (or localhost only)
- Manifest.json must be valid
- Icons must exist in `/icons/` folder
- Try incognito mode

**Notifications not working?**
- Check notification permission
- Verify browser supports notifications
- Check console for errors

**Icons showing but wrong?**
- Icons must be PNG (not SVG)
- Check exact filenames in manifest.json
- Clear cache and refresh

## 📖 Detailed Setup

See **PWA_SETUP.md** for:
- Complete configuration options
- Deployment instructions
- Advanced troubleshooting
- Browser compatibility matrix

## 🔍 Developer Tools

### View Service Worker
1. DevTools → Application → Service Workers
2. Should show: "ServiceWorker at https://yoursite/sw.js"
3. Status: "active and running"

### Check Manifest
1. DevTools → Application → Manifest
2. Should load and validate correctly

### Monitor Network
1. DevTools → Network tab
2. Reload offline to see cached responses
3. Look for Service Worker in "Name" column

### Debug Notifications
1. Console: `navigator.serviceWorker.controller`
2. Should return ServiceWorkerContainer
3. Try: `Notification.requestPermission()`

## 🎯 Next Steps

1. **Deploy**: Push code to your hosting (Vercel, etc.)
2. **Monitor**: Check user feedback on notifications
3. **Improve**: Add more prayer time options
4. **Optimize**: Reduce cache size if needed
5. **Update**: Bump version in CACHE_NAME when deploying

## 📚 Useful Links

- [Chrome DevTools PWA](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Manifest Validator](https://web.dev/manifest/)
- [Service Worker Demo](https://serviceworke.rs/)

## 💡 Pro Tips

- Clear all site data before testing: DevTools → Application → Clear site data
- Use incognito mode to test fresh install
- Check phone WiFi is same as desktop for debugging
- Look at browser console for all errors
- Test in Chrome first, then Firefox and Safari

---

**Last Updated:** January 2026
