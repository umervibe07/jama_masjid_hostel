import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import PrayerCountdown from '@/components/PrayerCountdown';
import { Hero } from './About';

export default function PrayerTimings() {
  const [pt, setPt] = useState();

  useEffect(() => {
    api.get('/prayer-timings').then((r) => setPt(r.data));
  }, []);

  // 24-hour time ko 12-hour AM/PM mein convert karta hai
  const formatTime = (time) => {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);

    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
  };

  const rows = [
    ['fajr', 'Fajr', 'فجر', 'Dawn'],
    ['sunrise', 'Sunrise', 'شروق', 'Morning'],
    ['dhuhr', 'Dhuhr', 'ظهر', 'Noon'],
    ['asr', 'Asr', 'عصر', 'Afternoon'],
    ['maghrib', 'Maghrib', 'مغرب', 'Sunset'],
    ['isha', 'Isha', 'عشاء', 'Night'],
    ['jumuah', 'Jumu’ah', 'جمعة', 'Friday'],
  ];

  return (
    <>
      <Hero
        title="Prayer Timings"
        sub="Today's salah schedule, managed by the mosque administration."
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">

          <PrayerCountdown timings={pt} />

          <div className="card-elegant overflow-hidden mt-8">

            <div className="bg-[#0D3B2E] text-white p-5 font-heading text-xl">
              Today's Schedule
            </div>

            {pt &&
              rows.map((r) => (
                <div
                  key={r[0]}
                  className="grid grid-cols-3 p-5 border-b border-slate-100 items-center"
                >
                  <div>
                    <div className="font-heading text-xl text-[#0D3B2E]">
                      {r[1]}{' '}
                      <span className="font-arabic text-[#C5A059]">
                        {r[2]}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      {r[3]}
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-500">
                    Adhan
                  </div>

                  <div className="text-right font-mono font-semibold text-[#0D3B2E]">
                    {formatTime(pt[r[0]])}
                  </div>
                </div>
              ))}

          </div>
        </div>
      </section>
    </>
  );
}