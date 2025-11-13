import axios from 'axios';

async function getNextPrayer(timings) {
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha }
  ];

  const now = new Date();
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0);

    if (prayerDate > now) {
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
        const nextPrayer = await getNextPrayer(timings);
        return {
          city: loc.city,
          country: loc.country,
          nextPrayer: nextPrayer,
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
}
