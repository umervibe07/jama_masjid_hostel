import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bed,
  BookOpen,
  Utensils,
  Wifi,
  Shield,
  Droplet,
  Users,
  Zap,
} from "lucide-react";
import { Hero } from "./About";
import { api } from "@/lib/api";

const fac = [
  [Bed, "Furnished Rooms"],
  [BookOpen, "Study Area"],
  [Utensils, "Dining / Mess"],
  [Droplet, "Clean Water"],
  [Wifi, "High-speed Wi-Fi"],
  [Zap, "Power Backup"],
  [Shield, "24×7 Security"],
  [Users, "Prayer Facility"],
];

export default function Hostel() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    try {
      const res = await api.get("/hostel/rooms");
      setRooms(res.data || []);
    } catch (error) {
      console.error("Hostel rooms loading failed:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <>
      <Hero
        title="Boys' Hostel — where students thrive"
        sub="A disciplined, Islamic environment paired with modern amenities."
      />

      {/* ROOMS */}
      <section className="py-20 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#0D3B2E] text-center mb-10">
            Hostel Rooms & Accommodation
          </h2>

          {loading && (
            <div className="text-center py-12 text-slate-500">
              Loading rooms...
            </div>
          )}

          {!loading && rooms.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  className="card-elegant overflow-hidden bg-white flex flex-col"
                  key={room.id}
                >
                  {/* ROOM IMAGE */}
                  {room.image ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-[#E6F4F0] grid place-items-center">
                      <Bed className="w-16 h-16 text-[#C5A059]" />
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-heading text-2xl text-[#0D3B2E]">
                      {room.name}
                    </h3>

                    <div className="font-heading text-3xl text-gradient-gold my-3">
                      {room.price}
                    </div>

                    <p className="p mb-4">
                      {room.description}
                    </p>

                    {/* FEATURES */}
                    {room.features?.length > 0 && (
                      <div className="space-y-2 mb-5">
                        {room.features.map((feature, index) => (
                          <div
                            key={`${room.id}-feature-${index}`}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      to="/admission"
                      className="btn-primary-green rounded-full text-center py-3 mt-auto"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No hostel rooms available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* FACILITIES - ABHI STATIC HAI */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#0D3B2E] text-center mb-10">
            Everything a student needs
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {fac.map(([I, t]) => (
              <div
                className="card-elegant p-5 text-center"
                key={t}
              >
                <div className="w-11 h-11 rounded-full bg-[#E6F4F0] grid place-items-center mx-auto">
                  <I className="text-[#059669]" />
                </div>

                <div className="text-sm font-semibold text-[#0D3B2E] mt-3">
                  {t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}