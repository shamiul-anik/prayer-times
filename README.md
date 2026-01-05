# 🕌 Prayer Times - Progressive Web App

A simple and responsive Islamic Prayer Time Dashboard built with Express.js, Node.js, and vanilla JavaScript, designed to display accurate prayer times using a live API. The dashboard automatically plays the Adhan (call to prayer) at each prayer time and updates in real time. It features clean, modern UI styling with HTML5/CSS3, supports multiple Islamic juristic schools (madhabs), and is optimized for fast global access with Vercel deployment. **Now available as a Progressive Web App!**

## 🌟 Features

### Core Features
- **Real-time Prayer Times**: Displays accurate prayer times for multiple cities worldwide
- **Multiple Juristic Schools**: Support for Hanafi and Shafi juristic schools
- **12/24 Hour Format Toggle**: Switch between 12-hour and 24-hour time display (NEW!)
- **Auto-refresh**: Updates prayer times every second for real-time accuracy
- **Automatic Adhan Playback**: Automatically plays Adhan audio when prayer time arrives
- **Next Prayer Countdown**: Shows time remaining until the next prayer with live countdown
- **Dark Theme UI**: Modern dark interface with glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Date Information**: Displays both Gregorian and Hijri calendar dates
- **Device Time Detection**: Uses your device's local time for prayer time checking

### 🚀 Progressive Web App Features (NEW!)
- **📱 Installable**: One-click installation on Android, iOS, Windows, Mac, and Linux
- **📴 Offline Support**: Works without internet connection with cached prayer times
- **🔔 Push Notifications**: Prayer time alerts with Adhan audio, even when app is closed
- **🔄 Background Sync**: Automatic updates in the background (Chrome/Edge)
- **⚡ Fast Loading**: Service Worker caching for instant app load
- **🏠 Home Screen**: Launch directly from your device's home screen like a native app
- **✨ Native-like Experience**: Fullscreen, standalone app experience without browser UI
- **⏱️ Time Format Preferences**: Notifications respect your 12/24 hour format choice (NEW!)

## 🚀 Quick Start

### Prerequisites
- Node.js (v22 or higher)
- npm

### Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/shamiul-anik/prayer-times.git
cd prayer-times
```

2. Install dependencies
```bash
npm install
```

3. **For PWA Support** - Generate app icons
```bash
npm install canvas
node generate-icons.js
```
*(Or use `icon-generator.html` in your browser if the Node.js method doesn't work)*

4. Start the server
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

### Install as PWA

**Android:**
- Open in Chrome → Menu (⋮) → "Install app"
- Or tap the install button in the address bar

**iOS:**
- Open in Safari → Share (↗) → "Add to Home Screen"

**Desktop:**
- Open in Chrome/Edge → Click install icon in address bar
- Or use the app menu → "Install app"

---

## 📚 Progressive Web App Documentation

Complete PWA guides are available in the `docs/` folder:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [**START_HERE.md**](./docs/START_HERE.md) | 📍 Index and quick reference | 3 min |
| [**QUICKSTART.md**](./docs/QUICKSTART.md) | 🚀 5-minute setup guide | 5 min |
| [**README_PWA.md**](./docs/README_PWA.md) | 📖 PWA overview | 5 min |
| [**PWA_SETUP.md**](./docs/PWA_SETUP.md) | ⚙️ Complete configuration | 20 min |
| [**PWA_IMPLEMENTATION_SUMMARY.md**](./docs/PWA_IMPLEMENTATION_SUMMARY.md) | 📋 What was implemented | 10 min |
| [**PWA_ARCHITECTURE.md**](./docs/PWA_ARCHITECTURE.md) | 🏗️ System design & diagrams | 15 min |
| [**DEPLOYMENT_CHECKLIST.md**](./docs/DEPLOYMENT_CHECKLIST.md) | ✅ Production deployment | 20 min |

**Quick tip:** Start with [QUICKSTART.md](./docs/QUICKSTART.md) to get up and running in 5 minutes!

---

## 📁 Project Structure

```
prayer-times/
├── 📄 README.md                    # Main documentation
├── 📄 package.json                 # Dependencies and scripts
│
├── 📱 Public Files (Frontend)
│   ├── public/
│   │   ├── index.html              # Main HTML file
│   │   ├── script.js               # Frontend logic
│   │   ├── style.css               # Dashboard styling
│   │   ├── manifest.json           # PWA manifest
│   │   ├── sw.js                   # Service Worker
│   │   ├── pwa.js                  # PWA manager
│   │   ├── audio/
│   │   │   └── a1.mp3              # Adhan audio file
│   │   └── icons/                  # App icons (generated)
│   │
│   └── api/
│       └── prayer-times.js         # API endpoints
│
├── 🛠️ Utilities
│   ├── generate-icons.js           # Icon generator script
│   ├── icon-generator.html         # Browser-based generator
│
├── 📚 Documentation (Complete PWA guides)
│   └── docs/
│       ├── START_HERE.md
│       ├── QUICKSTART.md
│       ├── README_PWA.md
│       ├── PWA_SETUP.md
│       ├── PWA_IMPLEMENTATION_SUMMARY.md
│       ├── PWA_ARCHITECTURE.md
│       └── DEPLOYMENT_CHECKLIST.md
│
└── server.js                       # Express server
```

## 🎛️ How to Use

1. **Select Location**: Choose your city and country from the dropdown menus
2. **Choose School**: Select between Hanafi (default) or Shafi juristic school
3. **Choose Time Format**: Toggle between 12-hour and 24-hour time display (NEW!)
4. **View Prayer Times**: All five daily prayers are displayed with times in your preferred format
5. **Monitor Next Prayer**: The next prayer countdown shows time remaining
6. **Automatic Playback**: Adhan will automatically play when prayer time arrives

### PWA Features

- **Install to Home Screen**: Use your device's "Install app" feature
  - Automatic install banner appears when app is ready
  - Works on Android, iOS, Windows, Mac, and Linux
  - One-click installation process
- **Offline Usage**: App works without internet with cached prayer times
- **Notifications**: Get prayer time alerts even when the app is closed
  - Notifications display time in your selected format (12/24 hour)
- **Background Updates**: Data syncs automatically in the background
- **Smart Caching**: Lightning-fast load times with intelligent local storage
  - Daily cache refresh ensures always-current prayer times
  - Old cache entries automatically cleaned up

---

## 📊 API Integration

The application uses the **Aladhan API** to fetch accurate prayer times:
- **API Endpoint**: `https://api.aladhan.com/v1/`
- **Documentation**: [Aladhan API](https://aladhan.com/prayer-times-api)

### Backend API Endpoints

- `GET /api/prayer-times` - Get prayer times for a specific location
  ```
  /api/prayer-times?city=Osaka&country=Japan&school=1
  ```

## 🎨 Customization

### Adding More Cities
Edit `public/index.html` and add options to the city dropdown:
```html
<option value="YourCity">Your City</option>
```

### Changing Adhan Audio
Replace the audio file at `public/audio/a1.mp3` with your preferred Adhan recording.

### Modifying Theme Colors
Edit the CSS variables in `public/style.css`:
```css
:root {
  --primary-dark: #1a1f3a;
  --accent-color: #6366f1;
  /* ... other colors ... */
}
```

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔊 Audio Playback

The dashboard automatically plays the Adhan audio file when the current device time matches a prayer time. Make sure:
- Audio file is present at `public/audio/a1.mp3`
- Your browser allows audio autoplay (may require user interaction first)
- System volume is not muted

---

## 🌐 PWA Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ⚠️ | ✅ |
| Installation | ✅ | ✅ | ⚠️ | ✅ |
| Notifications | ✅ | ✅ | ⚠️ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Offline Mode | ✅ | ✅ | ⚠️ | ✅ |

**Note:** Safari has limited PWA support on iOS but better support on macOS (15.1+)

---

## 🛠️ PWA Development

### Generate App Icons
```bash
# Using Node.js (recommended)
npm install canvas
node generate-icons.js

# Or use the browser-based generator
# Open icon-generator.html in your web browser
```

### Test Service Worker
1. Open DevTools (F12)
2. Go to: Application → Service Workers
3. You should see `/sw.js` as "active and running"
4. Check "Offline" to test offline functionality

### Modify PWA Configuration
Edit `public/manifest.json` to customize:
- App name and short name
- Theme colors
- Display mode
- App icons
- Start URL

See [PWA_SETUP.md](./docs/PWA_SETUP.md) for detailed configuration options.

---

## ⚙️ Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **PWA**: Service Worker, Web App Manifest, Notifications API
- **API**: AlAdhan Islamic Network API
- **Styling**: Custom CSS with modern design patterns
- **Audio**: HTML5 Audio
- **Caching**: Cache API with network/cache strategies

---

## 🚀 Deployment

### Vercel (Recommended)
The project is configured for easy Vercel deployment:

```bash
npm install -g vercel
vercel
```

See `vercel.json` for deployment configuration.

### Other Platforms
- Any Node.js hosting: Run `npm start`

**Important for PWA:** Ensure HTTPS is enabled on your production domain (required for Service Worker and notifications).

---

## ⚡ Performance Optimization

### Smart Caching Strategy

The app implements intelligent caching for lightning-fast performance:

**Client-Side Caching (LocalStorage)**
- Prayer times are cached **daily per location** with automatic refresh
- Timing format preference is saved and persists across sessions
- Instant display on subsequent loads
- Background refresh without blocking UI
- Automatic fallback if network is unavailable
- Old cache entries automatically cleaned up hourly

**Server-Side Caching**
- API responses cached with intelligent expiration
- Reduces calls to external Aladhan API
- Faster response times on production

**Network Optimization**
- Service Worker caches static assets
- Network-first strategy for API calls
- Cache-first strategy for static files
- Validates cached data before use

**Result:**
- ⚡ First load: ~2-5 seconds (external API)
- 🚀 Subsequent loads: **Instant** (uses cache)
- 📴 Offline: Shows last cached prayer times
- 🔄 Background updates: Fresh data fetches silently
- ⏱️ Time format persists: Your 12/24 hour preference is remembered

### How It Works

1. **App loads** → Shows cached data instantly if available
2. **Fetches fresh data** → Updates cache in background
3. **User switches cities** → New cached data displays immediately
4. **User changes time format** → All times update and preference is saved
5. **Network unavailable** → Falls back to latest cached data
6. **Daily automatic cleanup** → Old cache entries removed automatically

This approach ensures the app always feels fast and responsive!

---

## 📋 Troubleshooting

### PWA Features Not Working

**Service Worker not registering?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check DevTools console for errors
- Verify `/sw.js` file exists

**Can't install app?**
- Must use HTTPS (or localhost for testing)
- Check `manifest.json` is valid
- Verify all app icons are generated

**Notifications not appearing?**
- Check notification permission (browser settings)
- Verify browser supports notifications
- Check DevTools console for errors

**See [PWA_SETUP.md](./docs/PWA_SETUP.md) → Troubleshooting section for more help**

---

## 🌍 Supported Locations

The application supports any city/country combination that AlAdhan API provides data for. Popular locations include:

- **Japan**: Osaka, Tokyo
- **Middle East**: Dubai, Istanbul, Cairo, Medina, Mecca
- **Europe**: London

---

## 📱 Mobile First Design

The Prayer Times dashboard is optimized for mobile devices:

- **Responsive Layout**: Adapts to any screen size
- **Touch-Friendly**: Large, easy-to-tap buttons
- **Mobile Theme**: Optimized colors for bright outdoor use
- **Device Orientation**: Works in portrait and landscape
- **Offline Accessible**: Full functionality without internet

---

## 🔐 Privacy & Security

- ✅ No tracking or analytics cookies
- ✅ Prayer times data cached locally
- ✅ Location data used only for API calls
- ✅ HTTPS required for PWA features
- ✅ Service Worker validates all cached content
- ✅ No sensitive data stored locally

---

## 📝 Recent Updates (January 2026)

### ✨ New Features
- **Time Format Selection** - Toggle between 12-hour and 24-hour prayer time display
  - Setting persists across page reloads using localStorage
  - Notifications respect your time format preference
  - All prayer times update instantly when format changes

### 🐛 Bug Fixes & Improvements
- **Fixed caching issues** - Implemented date-based cache keys for daily refresh
- **Improved cache management** - Automatic cleanup of old cache entries every hour
- **Enhanced background fetch** - Better validation and comparison of cached data
- **Fixed timing control visibility** - Updated Service Worker cache version (v1 → v2)
- **Better error handling** - Null checks and graceful fallbacks for all DOM elements
- **PWA cache updates** - Added cache cleanup to PWA initialization

### 🔄 Cache System Improvements
- **Daily refresh**: Cache keys now include date (YYYY-MM-DD) for automatic daily reset
- **Intelligent updates**: Only updates cache when data actually changes
- **Automatic cleanup**: Removes old cache entries hourly
- **Better validation**: Verifies cached data structure before use

---

## 📝 Prayer Times Information

The dashboard displays the following prayers:

1. **Fajr** (فجر) - Dawn prayer
2. **Sunrise** (شروق) - Sunrise time
3. **Dhuhr** (ظهر) - Midday prayer
4. **Asr** (عصر) - Afternoon prayer
5. **Maghrib** (مغرب) - Sunset prayer
6. **Isha** (عشاء) - Evening prayer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the GNU GENERAL PUBLIC LICENSE v3.0

## 👨‍💻 Author

**A K M Shamiul Islam** 
- [Portfolio](https://shamiul.netlify.app/)
- [LinkedIn](https://www.linkedin.com/in/anikbd/)
- [GitHub](https://github.com/shamiul-anik)

## 🙏 Credits

- Prayer times API provided by [Aladhan - Islamic Network](https://aladhan.com/)
- PWA implementation with modern Web APIs

## 📧 Contact & Support

For questions, suggestions, or bug reports:
- Create an issue on [GitHub](https://github.com/shamiul-anik/prayer-times/issues)
- Reach out via LinkedIn or email

---

## 📖 Additional Resources

- [PWA Quick Start](./docs/QUICKSTART.md) - Get running in 5 minutes
- [PWA Complete Guide](./docs/PWA_SETUP.md) - Detailed configuration
- [Deployment Guide](./docs/DEPLOYMENT_CHECKLIST.md) - Production setup
- [Architecture Documentation](./docs/PWA_ARCHITECTURE.md) - Technical details

---

**Note:** This dashboard requires an active internet connection to fetch prayer times from the Aladhan API on first load. Once cached, it works offline. Audio playback may require user interaction on some browsers due to autoplay policies.

**Last Updated:** January 5, 2026
**Version:** 1.1 (with Time Format Selection, Improved Caching, and Bug Fixes)

