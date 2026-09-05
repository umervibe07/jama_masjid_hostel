import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones } from 'lucide-react';

const items = [
  {
    title: 'READ QUR’AN — English Translation',
    description: 'Holy Qur’an with Translation PDF',
    icon: BookOpen,
    to: '/quran/read/translation',
    theme: 'teal',
  },
  {
    title: 'READ QUR’AN — Urdu Arabic',
    description: 'Arabic + Urdu PDF',
    icon: BookOpen,
    to: '/quran/read/urdu',
    theme: 'purple',
  },
  {
    title: 'LISTEN TO QUR’AN',
    description: 'Complete Surah list with audio recitation',
    icon: Headphones,
    to: '/quran/listen',
    theme: 'blue',
  },
];

export default function QuranSection() {
  return (
    <section className="quran-section">
      <div className="quran-container">

        {/* Heading */}
        <div className="quran-heading">
          <div className="quran-eyebrow">
            <span className="quran-eyebrow-line" />
            <span>Qur’an-e-Kareem</span>
            <span className="quran-eyebrow-line" />
          </div>

          <h2 className="quran-title">
            <span className="quran-title-icon">📖</span>
            Qur’an-e-Kareem
          </h2>

          <p className="quran-subtitle">
            Read or Listen to the Holy Qur’an
          </p>
        </div>

        {/* Cards */}
        <div className="quran-cards">
          {items.map(({ title, description, icon: Icon, to, theme }) => (
            <Link
              key={to}
              to={to}
              className={`quran-card quran-card-${theme}`}
            >
              <div className="quran-card-content">

                {/* Icon */}
                <div className="quran-icon-box">
                  <Icon className="quran-icon" />
                </div>

                {/* Title */}
                <h3 className="quran-card-title">
                  {title}
                </h3>

                {/* Gold divider */}
                <div className="quran-card-divider">
                  <span />
                  <span className="quran-diamond">◆</span>
                  <span />
                </div>

                {/* Description */}
                <p className="quran-card-description">
                  {description}
                </p>

                {/* Open */}
                <div className="quran-open">
                  <span>Open</span>
                  <ArrowRight className="quran-arrow" />
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}