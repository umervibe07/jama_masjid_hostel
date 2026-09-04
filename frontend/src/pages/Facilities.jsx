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
};

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFacilities = async () => {
    try {
      const res = await api.get("/facilities");
      setFacilities(res.data || []);
    } catch (error) {
      console.error("Facilities loading failed:", error);
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
        title="Facilities & Amenities"
        sub="Everything students need for a comfortable, spiritual and academically successful life."
      />

      <section className="py-16 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">

          {loading && (
            <div className="text-center py-16 text-slate-500">
              Loading facilities...
            </div>
          )}

          {!loading && facilities.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => {
                const Icon =
                  iconMap[facility.icon] || Building2;

                return (
                  <div
                    className="card-elegant overflow-hidden bg-white"
                    key={facility.id}
                  >
                    {facility.image ? (
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="h-44 w-full object-cover hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="h-44 w-full bg-[#E6F4F0] grid place-items-center">
                        <Icon className="w-16 h-16 text-[#C5A059]" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="w-11 h-11 bg-[#E6F4F0] rounded-xl grid place-items-center">
                        <Icon className="text-[#059669]" />
                      </div>

                      <h3 className="font-heading text-xl text-[#0D3B2E] font-semibold mt-3">
                        {facility.title}
                      </h3>

                      <p className="p text-sm mt-2">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && facilities.length === 0 && (
            <div className="text-center py-20">
              <Building2 className="w-14 h-14 mx-auto text-[#C5A059] mb-4" />

              <h2 className="font-heading text-2xl text-[#0D3B2E]">
                No Facilities Yet
              </h2>

              <p className="text-slate-500 mt-2">
                Facilities will appear here.
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}