# 🕌 Prayer Times Dashboard

A simple and modern, responsive web dashboard for displaying Islamic prayer times with automatic Adhan (call to prayer) playback. Built with vanilla JavaScript and modern CSS, featuring real-time updates and support for different Islamic juristic schools.

## 🌟 Features

- **Real-time Prayer Times**: Displays accurate prayer times for Osaka and Tokyo in Japan.
- **Multiple Juristic Schools**: Support for Hanafi and Shafi juristic schools
- **Auto-refresh**: Updates prayer times every second for real-time accuracy
- **Automatic Adhan Playback**: Automatically plays Adhan audio when prayer time arrives
- **Next Prayer Countdown**: Shows time remaining until the next prayer with live countdown
- **Dark Theme UI**: Modern dark interface with glassmorphism effects.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Date Information**: Displays both Gregorian and Hijri calendar dates
- **Device Time Detection**: Uses your device's local time for prayer time checking

## 🚀 Quick Start

### Prerequisites
- Node.js (v22 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/shamiul-anik/prayer-times.git
cd prayer-times
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
prayer-time/
├── server.js              # Express server with API endpoints
├── package.json           # Dependencies and scripts
├── public/
│   ├── index.html         # Main HTML file
│   ├── script.js          # Frontend JavaScript logic
│   ├── style.css          # Dashboard styling
│   └── audio/
│       └── a1.mp3         # Adhan audio file
└── README.md              # This file
```

## 🎛️ How to Use

1. **Select Location**: Choose your city and country from the dropdown menus
2. **Choose School**: Select between Hanafi (default) or Shafi juristic school
3. **View Prayer Times**: All five daily prayers are displayed with times
4. **Monitor Next Prayer**: The next prayer countdown shows time remaining
5. **Automatic Playback**: Adhan will automatically play when prayer time arrives

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

## ⚙️ Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **API**: AlAdhan Islamic Network API
- **Styling**: Custom CSS with modern design patterns
- **Audio**: HTML5 Audio API

## 🌍 Supported Locations

The application supports any city/country combination that AlAdhan API provides data for. Popular locations include:

- **Japan**: Osaka, Tokyo
- **Middle East**: Dubai, Istanbul, Cairo, Medina, Mecca
- **Europe**: London

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

## 🙏 Credits

- Prayer times data provided by [Aladhan - Islamic Network](https://aladhan.com/)

## 📧 Contact

For questions or suggestions, feel free to reach out!

---

**Note**: This dashboard requires an active internet connection to fetch prayer times from the Aladhan API. Audio playback may require user interaction on some browsers due to autoplay policies.
