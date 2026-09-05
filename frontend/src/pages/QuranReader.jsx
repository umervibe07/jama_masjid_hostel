import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';

const configs = {
  translation: {
    title: 'READ QUR’AN — English Translation',
    subtitle: 'The Holy Qur’an with Translation',
    file: process.env.REACT_APP_QURAN_TRANSLATION_PDF_URL || '/quran/translation.pdf',
    direction: 'ltr',
  },
  urdu: {
    title: 'READ QUR’AN — Urdu Arabic',
    subtitle: 'Arabic + Urdu',
    file: process.env.REACT_APP_QURAN_URDU_PDF_URL || '/quran/urdu-arabic.pdf',
    direction: 'rtl',
  },
};

export default function QuranReader() {
  const { type = 'translation' } = useParams();
  const config = configs[type] || configs.translation;
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    setZoom(100);
    setError(false);
    setLoading(true);
  }, [type]);

  const src = useMemo(
    () => `${config.file}#page=${page}&zoom=${zoom}`,
    [config.file, page, zoom]
  );

  const goFullscreen = async () => {
    const el = document.getElementById('quran-reader-frame');
    if (el?.requestFullscreen) await el.requestFullscreen();
  };

  return (
    <main className="min-h-screen bg-[#FAF6EE] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#059669] hover:text-[#0D3B2E] mb-3">
              <ArrowLeft className="w-4" /> Back to Home
            </Link>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-[#0D3B2E]">{config.title}</h1>
            <p className="text-[#475569] mt-1" dir={config.direction}>{config.subtitle}</p>
          </div>
          <a
            href={config.file}
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C5A059]/45 bg-white text-[#0D3B2E] text-sm font-semibold hover:shadow-md"
          >
            <Download className="w-4" /> Open / Download PDF
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-[#C5A059]/25 shadow-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-[#FFFDF5]">
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="quran-tool" aria-label="Previous page"><ChevronLeft className="w-5" /></button>
              <label className="text-sm text-slate-600 flex items-center gap-2">
                Page
                <input
                  value={page}
                  onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-center"
                  inputMode="numeric"
                  aria-label="Page number"
                />
              </label>
              <button onClick={() => setPage((p) => p + 1)} className="quran-tool" aria-label="Next page"><ChevronRight className="w-5" /></button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="quran-tool" aria-label="Zoom out"><Minus className="w-4" /></button>
              <span className="text-sm text-slate-600 min-w-14 text-center">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="quran-tool" aria-label="Zoom in"><Plus className="w-4" /></button>
              <button onClick={() => setZoom(100)} className="quran-tool" aria-label="Reset zoom"><RotateCcw className="w-4" /></button>
              <button onClick={goFullscreen} className="quran-tool" aria-label="Fullscreen"><Maximize2 className="w-4" /></button>
            </div>
          </div>

          <div id="quran-reader-frame" className="relative bg-slate-100 min-h-[70vh]">
            {loading && !error && (
              <div className="absolute inset-0 z-10 grid place-items-center bg-white/90 text-slate-600">Loading Qur’an PDF…</div>
            )}
            {error ? (
              <div className="min-h-[70vh] grid place-items-center p-8 text-center">
                <div>
                  <div className="text-[#0D3B2E] font-semibold text-lg">The PDF could not be loaded.</div>
                  <p className="text-slate-500 mt-2 max-w-lg">Please use the Open / Download PDF button above or check that the supplied PDF files are available at the configured paths.</p>
                </div>
              </div>
            ) : (
              <iframe
                key={src}
                src={src}
                title={config.title}
                className="w-full h-[78vh] min-h-[650px] border-0 bg-white"
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
