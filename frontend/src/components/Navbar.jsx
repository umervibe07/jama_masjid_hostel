import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon, ShieldCheck } from 'lucide-react';

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/prayer-timings', 'Prayer Timings'],
  ['/hostel', 'Hostel'],
  ['/facilities', 'Facilities'],
  ['/gallery', 'Gallery'],
  ['/events', 'Events'],
  ['/contact', 'Contact'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0D3B2E]/95 backdrop-blur-xl text-white border-b border-[#C5A059]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 lg:h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C5A059] flex items-center justify-center">
              <Moon
                className="text-[#0D3B2E]"
                fill="#0D3B2E"
              />
            </div>

            <div>
              <div className="font-heading text-xl">
                Jama Masjid
              </div>

              <div className="font-arabic text-xs text-[#C5A059]">
                جامع مسجد و بوائز ہاسٹل
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-1 items-center">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm ${
                    isActive
                      ? 'text-[#D4AF37] bg-white/5'
                      : 'text-white/85 hover:text-[#D4AF37]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Admin */}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#D4AF37] bg-white/5'
                    : 'text-white/85 hover:text-[#D4AF37]'
                }`
              }
            >
              <ShieldCheck size={16} />
              Admin
            </NavLink>
          </div>

          {/* Admission Button */}
          <div className="hidden lg:block">
            <Link
              to="/admission"
              className="btn-gold px-5 py-2.5 rounded-full text-sm"
            >
              Hostel Admission
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="lg:hidden pb-4 border-t border-white/10 pt-2">

            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm"
              >
                {label}
              </NavLink>
            ))}

            {/* Mobile Admin */}
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm"
            >
              <ShieldCheck size={17} />
              Admin
            </NavLink>

            <Link
              to="/admission"
              onClick={() => setOpen(false)}
              className="btn-gold block text-center mt-3 py-3 rounded-full"
            >
              Hostel Admission
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}