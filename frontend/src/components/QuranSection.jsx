import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones } from 'lucide-react';

const items = [
  {
    title: 'READ QUR’AN — English Translation',
    description: 'Holy Qur’an with Translation PDF',
    icon: BookOpen,
    to: '/quran/read/translation',
  },
  {
    title: 'READ QUR’AN — Urdu Arabic',
    description: 'Arabic + Urdu PDF',
    icon: BookOpen,
    to: '/quran/read/urdu',
  },
  {
    title: 'LISTEN TO QUR’AN',
    description: 'Complete Surah list with audio recitation',
    icon: Headphones,
    to: '/quran/listen',
  },
];

export default function QuranSection() {
  return (
    <section className="py-20 lg:py-24 bg-[#FAF6EE] border-y border-[#C5A059]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="gold-divider text-xs uppercase tracking-widest mb-3">
            <span>Qur’an-e-Kareem</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-semibold text-[#0D3B2E]">
            📖 Qur’an-e-Kareem
          </h2>
          <p className="text-[#475569] mt-3 text-base sm:text-lg">
            Read or Listen to the Holy Qur’an
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {items.map(({ title, description, icon: Icon, to }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white rounded-2xl border border-[#C5A059]/35 shadow-[0_12px_35px_-12px_rgba(13,59,46,.16)] p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-14px_rgba(13,59,46,.22)] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFFDF5] border border-[#C5A059]/30 grid place-items-center">
                <Icon className="w-6 h-6 text-[#0D3B2E]" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#0D3B2E] mt-6 leading-tight">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-[#475569] mt-3 leading-relaxed">
                {description}
              </p>
              <div className="mt-6 text-sm font-semibold text-[#059669] group-hover:text-[#0D3B2E]">
                Open <ArrowRight className="inline w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
