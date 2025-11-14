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
      test: data,
      city,
      country,
      school: schoolName,
      schoolValue: parseInt(school),
      date: data.date.gregorian.date,
      gregorianDate: data.date.gregorian,
      hijriDate: data.date.hijri,
      prayers: prayers,
      timezone: data.meta.timezone,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
