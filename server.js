import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get prayer times for a specific city
app.get('/api/prayer-times', async (req, res) => {
  try {
    const { city = 'Osaka', country = 'Japan', method = 3, school = 1 } = req.query;
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}`;
    
    const response = await axios.get(url);
    const data = response.data.data;
    const timings = data.timings;

    const prayers = [
      { name: 'Fajr', ar: 'فجر', time: timings.Fajr },
      { name: 'Sunrise', ar: 'شروق', time: timings.Sunrise },
      { name: 'Dhuhr', ar: 'ظهر', time: timings.Dhuhr },
      { name: 'Asr', ar: 'عصر', time: timings.Asr },
      { name: 'Maghrib', ar: 'مغرب', time: timings.Maghrib },
      { name: 'Isha', ar: 'عشاء', time: timings.Isha }
    ];

    const schoolName = school == 0 ? 'Shafi' : 'Hanafi';

    res.json({
      success: true,
      city,
      country,
      school: schoolName,
      schoolValue: parseInt(school),
      date: data.date.gregorian.date,
      gregorianDate: data.date.gregorian.format,
      hijriDate: data.date.hijri.format,
      prayers: prayers,
      timezone: data.meta.timezone,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get prayer times for multiple cities
app.get('/api/prayer-times-multi', async (req, res) => {
  try {
    const cities = [
      { city: 'Tokyo', country: 'Japan' },
      { city: 'London', country: 'UK' },
      { city: 'Dubai', country: 'UAE' },
      { city: 'Istanbul', country: 'Turkey' },
      { city: 'Cairo', country: 'Egypt' }
    ];

    const results = await Promise.all(
      cities.map(async (loc) => {
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${loc.city}&country=${loc.country}&method=2`;
        const response = await axios.get(url);
        const timings = response.data.data.timings;
        return {
          city: loc.city,
          country: loc.country,
          nextPrayer: getNextPrayer(timings),
          fajr: timings.Fajr,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha
        };
      })
    );

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      cities: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get next prayer time
app.get('/api/next-prayer', async (req, res) => {
  try {
    const { city = 'Tokyo', country = 'Japan' } = req.query;
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;
    
    const response = await axios.get(url);
    const timings = response.data.data.timings;

    const nextPrayer = getNextPrayer(timings);
    res.json({
      success: true,
      city,
      country,
      nextPrayer,
      timings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function getNextPrayer(timings) {
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha }
  ];

  const now = dayjs();
  for (const prayer of prayers) {
    const prayerTime = dayjs(prayer.time, 'HH:mm');
    if (prayerTime.isAfter(now)) {
      return {
        name: prayer.name,
        time: prayer.time
      };
    }
  }

  return {
    name: 'Fajr',
    time: timings.Fajr,
    tomorrow: true
  };
}

app.listen(PORT, () => {
  console.log(`Prayer Time Dashboard running on http://localhost:${PORT}`);
});
