import { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

const ORDER = [
  ['fajr', 'Fajr', 'فجر'],
  ['sunrise', 'Sunrise', 'شروق'],
  ['dhuhr', 'Dhuhr', 'ظهر'],
  ['asr', 'Asr', 'عصر'],
  ['maghrib', 'Maghrib', 'مغرب'],
  ['isha', 'Isha', 'عشاء'],
];

const mins = (s) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};

const formatTime = (time) => {
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);

  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

const fmt = (x) => {
  x = Math.max(0, x);

  const h = Math.floor(x / 60);
  const m = Math.floor(x % 60);
  const s = Math.floor((x - Math.floor(x)) * 60);

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function PrayerCountdown({ timings }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const n = useMemo(() => {
    if (!timings) return null;

    const cur =
      now.getHours() * 60 +
      now.getMinutes() +
      now.getSeconds() / 60;

    for (const [k, l, a] of ORDER) {
      const t = mins(timings[k]);

      if (t > cur) {
        return {
          l,
          a,
          t: timings[k],
          d: t - cur,
        };
      }
    }

    const t = mins(timings.fajr);

    return {
      l: 'Fajr (Tomorrow)',
      a: 'فجر',
      t: timings.fajr,
      d: 1440 - cur + t,
    };
  }, [timings, now]);

  return (
    <div
      data-testid="next-prayer-countdown-card"
      className="card-elegant p-6 sm:p-8 bg-gradient-to-br from-white via-[#FAF6EE] to-white"
    >
      <div className="flex items-center gap-2 text-[#059669] text-xs uppercase tracking-widest">
        <Clock className="w-4 h-4" />
        Next Prayer
      </div>

      {n ? (
        <>
          <div className="flex items-baseline gap-3 mt-3">
            <h3 className="font-heading text-3xl sm:text-4xl text-[#0D3B2E] font-bold">
              {n.l}
            </h3>

            <span className="font-arabic text-2xl text-[#C5A059]">
              {n.a}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <div className="text-xs text-slate-500">
                Scheduled at
              </div>

              <div className="font-mono text-2xl font-semibold text-[#0D3B2E]">
                {formatTime(n.t)}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">
                Time remaining
              </div>

              <div
                data-testid="countdown-timer"
                className="font-mono text-2xl font-semibold text-gradient-gold"
              >
                {fmt(n.d)}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 text-slate-500">
          Loading prayer schedule…
        </div>
      )}
    </div>
  );
}