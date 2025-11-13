import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { city = 'Tokyo', country = 'Japan' } = req.query;
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;
    
    const response = await axios.get(url);
    const timings = response.data.data.timings;

    const prayers = [
      { name: 'Fajr', time: timings.Fajr },
      { name: 'Dhuhr', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Maghrib', time: timings.Maghrib },
      { name: 'Isha', time: timings.Isha }
    ];

    const now = new Date();
    let nextPrayer = null;
    
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0);

      if (prayerDate > now) {
        nextPrayer = {
          name: prayer.name,
          time: prayer.time
        };
        break;
      }
    }

    if (!nextPrayer) {
      nextPrayer = {
        name: 'Fajr',
        time: timings.Fajr,
        tomorrow: true
      };
    }

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
}
