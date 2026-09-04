import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { api } from "@/lib/api";

export default function About() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await api.get("/staff");
      setStaff(res.data || []);
    } catch (error) {
      console.error("Failed to load mosque staff:", error);
    }
  };

  return (
    <div>
      <Hero
        title="Our History & Legacy"
        sub="A place of worship, service, learning and community."
      />

      {/* OUR STORY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Kicker t="Our Story" />

            <h2 className="h2">
              A sanctuary built around faith and learning
            </h2>

            <p className="p">
              Jama Masjid stands as a community centre for daily prayer,
              Jumu’ah, Quran learning and spiritual guidance. The attached
              Boys’ Hostel extends that mission by giving students a
              disciplined and supportive environment while they pursue higher
              education.
            </p>

            <p className="p">
              Our vision is to combine timeless Islamic values with modern
              academic excellence and service to society.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1776937629858-ce84563640b8?w=1000&q=85"
            alt="Prayer hall"
            className="rounded-3xl h-[430px] w-full object-cover shadow-xl"
          />
        </div>
      </section>

      {/* MOSQUE LEADERSHIP & STAFF */}
      <section className="py-20 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4">
          <Kicker t="Our Team" />

          <h2 className="h2 mb-10">
            Mosque Leadership & Staff
          </h2>

          {staff.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {staff.map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-sm"
                >
                  {/* PHOTO */}
                  {person.image ? (
  <div className="w-full bg-[#E8F4F1] flex items-center justify-center overflow-hidden">
    <img
      src={person.image}
      alt={person.name}
      className="w-full h-auto max-h-[500px] object-contain"
    />
  </div>
) : (
  <div className="w-full h-[300px] bg-[#E8F4F1] flex items-center justify-center">
    <Users className="w-20 h-20 text-[#C5A059]" />
  </div>
)}

                  {/* DETAILS */}
                  <div className="p-7">
                    <div className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-2">
                      {person.role}
                    </div>

                    <h3 className="font-heading text-2xl text-[#0D3B2E] font-semibold mb-4">
                      {person.name}
                    </h3>

                    <p className="text-[#475569] leading-7">
                      {person.introduction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-10 text-center">
              <Users className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />

              <h3 className="font-heading text-2xl text-[#0D3B2E]">
                Our Mosque Team
              </h3>

              <p className="text-gray-500 mt-2">
                Leadership and staff information will be available here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <Info
            t="Our Mission"
            d="Provide authentic worship, Islamic learning and wholesome accommodation where students and worshippers feel spiritually grounded and academically empowered."
          />

          <Info
            t="Our Vision"
            d="Become a model Islamic institution that nurtures God-conscious, service-minded and academically capable young leaders."
          />
        </div>
      </section>
    </div>
  );
}

export function Hero({ title, sub }) {
  return (
    <section className="py-20 bg-[#0D3B2E] text-white islamic-pattern-dark text-center">
      <div className="max-w-4xl mx-auto px-4">
        <Kicker t="Jama Masjid & Boys' Hostel" />

        <h1 className="font-heading text-5xl font-bold">
          {title}
        </h1>

        <p className="text-white/75 mt-3">
          {sub}
        </p>
      </div>
    </section>
  );
}

export function Kicker({ t }) {
  return (
    <div className="gold-divider text-xs uppercase tracking-widest mb-3">
      <span>{t}</span>
    </div>
  );
}

export function Info({ t, d }) {
  return (
    <div className="card-elegant p-8">
      <h3 className="font-heading text-2xl text-[#0D3B2E] font-semibold">
        {t}
      </h3>

      <p className="p mt-2">
        {d}
      </p>
    </div>
  );
}

export const H = ({ title, sub }) => (
  <Hero title={title} sub={sub} />
);

export const SectionTitle = ({ title }) => (
  <h2 className="font-heading text-4xl text-[#0D3B2E] font-semibold">
    {title}
  </h2>
);