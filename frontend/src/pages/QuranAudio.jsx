import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Headphones, Loader2, Pause, Play, Volume2 } from 'lucide-react';

const API = 'https://mp3quran.net/api/v3';

const fallbackSurahs = [
  'Al-Fatihah','Al-Baqarah','Aal-E-Imran','An-Nisa','Al-Ma’idah','Al-An’am','Al-A’raf','Al-Anfal','At-Tawbah','Yunus','Hud','Yusuf','Ar-Ra’d','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Mu’minun','An-Nur','Al-Furqan','Ash-Shu’ara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqi’ah','Al-Hadid','Al-Mujadilah','Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumu’ah','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Ma’arij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Nazi’at','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-A’la','Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat','Al-Qari’ah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil','Quraysh','Al-Ma’un','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas'
].map((name, i) => ({ id: i + 1, name }));

export default function QuranAudio() {
  const audioRef = useRef(null);
  const [surahs, setSurahs] = useState(fallbackSurahs);
  const [reciters, setReciters] = useState([]);
  const [surahId, setSurahId] = useState(1);
  const [reciterId, setReciterId] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${API}/suwar?language=eng`).then((r) => r.ok ? r.json() : Promise.reject(new Error('Surah list failed'))),
      fetch(`${API}/reciters?language=eng`).then((r) => r.ok ? r.json() : Promise.reject(new Error('Reciters failed'))),
    ]).then(([suraData, reciterData]) => {
      if (cancelled) return;
      if (Array.isArray(suraData?.suwar) && suraData.suwar.length) setSurahs(suraData.suwar.map((s) => ({ id: Number(s.id), name: String(s.name).trim() })));
      const all = (reciterData?.reciters || []).flatMap((r) => (r.moshaf || []).filter((m) => Number(m.surah_total) === 114).map((m) => ({ id: `${r.id}:${m.id}`, reciterId: r.id, moshafId: m.id, name: r.name, moshaf: m })));
      const unique = all.filter((x, i, arr) => arr.findIndex((y) => y.name === x.name && y.moshafId === x.moshafId) === i);
      setReciters(unique);
      if (unique[0]) setReciterId(unique[0].id);
    }).catch(() => {
      if (!cancelled) setError('Audio library could not be loaded right now. Please try again.');
    }).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const currentReciter = useMemo(() => reciters.find((r) => r.id === reciterId) || reciters[0], [reciters, reciterId]);
  const currentSurah = surahs.find((s) => s.id === surahId) || surahs[0];
  const audioUrl = currentReciter?.moshaf?.server
    ? `${currentReciter.moshaf.server}${String(surahId).padStart(3, '0')}.mp3`
    : '';

  const loadSurah = (nextId, autoPlay = false) => {
    const id = Math.min(114, Math.max(1, nextId));
    setSurahId(id);
    setPlaying(autoPlay);
    setTimeout(() => {
      if (autoPlay) audioRef.current?.play().catch(() => setPlaying(false));
    }, 80);
  };

  return (
    <main className="min-h-screen bg-[#FAF6EE] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#059669] hover:text-[#0D3B2E] mb-5"><ArrowLeft className="w-4" /> Back to Home</Link>
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-[#C5A059]/35 grid place-items-center shadow-sm"><Headphones className="text-[#0D3B2E]" /></div>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-[#0D3B2E] mt-5">🎧 LISTEN TO QUR’AN</h1>
          <p className="text-[#475569] mt-2">Complete Surah list with audio recitation</p>
        </div>

        <div className="bg-white border border-[#C5A059]/25 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-[#FFFDF5] grid md:grid-cols-2 gap-4">
            <label className="text-sm font-semibold text-slate-700">Reciter
              <select value={currentReciter?.id || ''} onChange={(e) => { setReciterId(e.target.value); setPlaying(false); }} className="quran-select mt-2">
                {reciters.length ? reciters.map((r) => <option key={r.id} value={r.id}>{r.name} — {r.moshaf.name}</option>) : <option>Loading reciters…</option>}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">Surah
              <select value={surahId} onChange={(e) => { setSurahId(Number(e.target.value)); setPlaying(false); }} className="quran-select mt-2">
                {surahs.map((s) => <option key={s.id} value={s.id}>{String(s.id).padStart(3,'0')} — {s.name}</option>)}
              </select>
            </label>
          </div>

          <div className="p-5 sm:p-7">
            <div className="rounded-2xl border border-[#C5A059]/25 bg-[#FAF6EE] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#C5A059]">Now Playing</div>
                  <h2 className="font-heading text-3xl text-[#0D3B2E] mt-1">{currentSurah?.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">Surah {surahId} of 114</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="quran-tool" onClick={() => loadSurah(surahId - 1, playing)} disabled={surahId === 1} aria-label="Previous Surah"><ChevronLeft /></button>
                  <button className="quran-play" onClick={() => { if (!audioUrl) return; if (playing) { audioRef.current?.pause(); setPlaying(false); } else { audioRef.current?.play().then(() => setPlaying(true)).catch(() => setError('This recitation could not be played. Please choose another reciter.')); } }} aria-label={playing ? 'Pause' : 'Play'}>
                    {playing ? <Pause className="w-5" /> : <Play className="w-5" fill="currentColor" />}
                  </button>
                  <button className="quran-tool" onClick={() => loadSurah(surahId + 1, playing)} disabled={surahId === 114} aria-label="Next Surah"><ChevronRight /></button>
                </div>
              </div>
              <audio
                ref={audioRef}
                key={audioUrl}
                src={audioUrl}
                controls
                preload="metadata"
                className="w-full mt-6"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => surahId < 114 && loadSurah(surahId + 1, true)}
                onError={() => setError('This audio could not be loaded. Please choose another reciter.')}
              />
              <div className="text-xs text-slate-500 mt-3 flex items-center gap-2"><Volume2 className="w-4" /> Use the audio controls for progress and volume.</div>
              {error && <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>}
            </div>

            <div className="mt-7">
              <h3 className="font-heading text-2xl text-[#0D3B2E] mb-4">All 114 Surahs</h3>
              {loading ? <div className="py-10 text-center text-slate-500"><Loader2 className="animate-spin inline w-5 mr-2" /> Loading audio library…</div> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[520px] overflow-auto pr-1">
                  {surahs.map((s) => (
                    <button key={s.id} onClick={() => loadSurah(s.id, true)} className={`text-left rounded-xl border px-4 py-3 transition ${s.id === surahId ? 'border-[#C5A059] bg-[#FFFDF5] shadow-sm' : 'border-slate-200 bg-white hover:border-[#C5A059]/60'}`}>
                      <span className="text-xs text-[#C5A059] mr-2">{String(s.id).padStart(3,'0')}</span>
                      <span className="font-medium text-[#0D3B2E]">{s.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-5 text-center">Audio is streamed from MP3Quran.net; no audio files are copied into this website.</p>
      </div>
    </main>
  );
}
