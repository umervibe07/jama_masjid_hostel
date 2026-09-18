import { useEffect, useState } from "react";

import {
  Building2,
  Bed,
  BookOpen,
  Utensils,
  Library,
  Wifi,
  Droplet,
  Shield,
  HeartPulse,
  Users,
  Zap,
} from "lucide-react";

import { Hero } from "./About";
import { api } from "@/lib/api";

const iconMap = {
  Building2,
  Bed,
  BookOpen,
  Utensils,
  Library,
  Wifi,
  Droplet,
  Shield,
  HeartPulse,
  Users,
  Zap,
};

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFacilities = async () => {
    try {
      const res = await api.get("/facilities");
      setFacilities(res.data || []);
    } catch (error) {
      console.error("Hostel facilities loading failed:", error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  return (
    <>
      <Hero
        title="Private Boys Hostel Facilities"
        sub="Essential facilities designed to provide students with a comfortable, convenient and secure place to stay."
      />

      {/* INTRODUCTION */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-[#0D3B2E]">
            Hostel Facilities & Amenities
          </h2>

          <p className="text-lg leading-8 text-slate-600 mt-5">
            The Private Boys Hostel provides essential amenities for students,
            including accommodation, study facilities, internet access, clean
            water, dining arrangements and security.
          </p>

          <p className="text-base leading-7 text-slate-500 mt-4">
            These facilities are managed independently by the private hostel
            management and are separate from Jama Masjid services.
          </p>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="py-20 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">
          {loading && (
            <div className="text-center py-16 text-slate-500">
              Loading hostel facilities...
            </div>
          )}

          {!loading && facilities.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => {
                const Icon = iconMap[facility.icon] || Building2;

                return (
                  <div
                    className="card-elegant overflow-hidden bg-white"
                    key={facility.id}
                  >
                    {facility.image ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={facility.image}
                          alt={facility.title}
                          className="h-full w-full object-cover hover:scale-105 transition duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-[#E6F4F0] grid place-items-center">
                        <Icon className="w-16 h-16 text-[#C5A059]" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="w-12 h-12 bg-[#E6F4F0] rounded-xl grid place-items-center">
                        <Icon className="text-[#059669]" />
                      </div>

                      <h3 className="font-heading text-xl text-[#0D3B2E] font-semibold mt-4">
                        {facility.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-6 mt-2">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && facilities.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Building2 className="w-14 h-14 mx-auto text-[#C5A059] mb-4" />

              <h2 className="font-heading text-2xl text-[#0D3B2E]">
                Hostel Facilities
              </h2>

              <p className="text-slate-500 mt-2">
                Facility information will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* COMMON AMENITIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl text-[#0D3B2E] text-center mb-4">
            Essential Hostel Amenities
          </h2>

          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            The hostel is designed around the everyday needs of students.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              [Bed, "Furnished Rooms"],
              [BookOpen, "Study Area"],
              [Wifi, "Wi-Fi"],
              [Droplet, "Clean Water"],
              [Utensils, "Dining / Mess"],
              [Shield, "Security"],
              [Zap, "Power Backup"],
              [Library, "Study Space"],
              [HeartPulse, "First Aid"],
              [Users, "Student Friendly"],
            ].map(([Icon, title]) => (
              <div
                key={title}
                className="card-elegant p-5 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#E6F4F0] grid place-items-center mx-auto">
                  <Icon className="text-[#059669]" />
                </div>

                <div className="text-sm font-semibold text-[#0D3B2E] mt-3">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEPARATE MANAGEMENT NOTE */}
      <section className="py-16 islamic-pattern">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card-elegant bg-white p-8 md:p-10">
            <h2 className="font-heading text-3xl text-[#0D3B2E] mb-4">
              Private Hostel Management
            </h2>

            <p className="text-slate-600 leading-7">
              The Private Boys Hostel is an independently managed
              accommodation facility. Hostel facilities, room availability,
              admission, fees and day-to-day management are handled by the
              private hostel management and are separate from Jama Masjid.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}