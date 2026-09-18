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
  ArrowRight,
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
        title="Private Boys Hostel"
        sub="Comfortable, affordable and student-friendly accommodation with essential facilities."
      />

      {/* INTRODUCTION */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg leading-8 text-slate-600">
            Our Private Boys Hostel provides affordable accommodation for
            students looking for a comfortable and disciplined place to stay.
            The hostel offers furnished rooms, study facilities, internet
            access, clean water, power backup and other essential amenities
            for everyday student life.
          </p>

          <p className="text-lg leading-8 text-slate-600 mt-5">
            Hostel admission, room allocation, fees and management are
            handled separately by the private hostel management.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              to="/private-hostel/facilities"
              className="btn-primary-green rounded-full px-6 py-3 inline-flex items-center gap-2"
            >
              Explore Facilities
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/private-hostel/admission"
              className="border border-[#0D3B2E] text-[#0D3B2E] rounded-full px-6 py-3 inline-flex items-center gap-2"
            >
              Apply for Admission
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="py-20 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#0D3B2E] text-center mb-4">
            Hostel Rooms & Accommodation
          </h2>

          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            Choose from the available room options according to your
            accommodation requirements.
          </p>

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

                    <p className="mb-4 text-slate-600">
                      {room.description}
                    </p>

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
                      to="/private-hostel/admission"
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

      {/* FACILITIES PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#0D3B2E] text-center mb-4">
            Hostel Facilities
          </h2>

          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            Essential facilities are provided to make everyday student life
            comfortable and convenient.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {fac.map(([Icon, title]) => (
              <div
                className="card-elegant p-5 text-center"
                key={title}
              >
                <div className="w-11 h-11 rounded-full bg-[#E6F4F0] grid place-items-center mx-auto">
                  <Icon className="text-[#059669]" />
                </div>

                <div className="text-sm font-semibold text-[#0D3B2E] mt-3">
                  {title}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/private-hostel/facilities"
              className="text-[#0D3B2E] font-semibold inline-flex items-center gap-2"
            >
              View All Hostel Facilities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOSTEL INFORMATION */}
      <section className="py-16 islamic-pattern">
        <div className="max-w-5xl mx-auto px-4">
          <div className="card-elegant bg-white p-8 md:p-10">
            <h2 className="font-heading text-3xl text-[#0D3B2E] mb-4">
              Private Hostel Information
            </h2>

            <p className="text-slate-600 leading-7">
              The Private Boys Hostel is independently managed and is separate
              from the Jama Masjid. Hostel accommodation, room availability,
              admission, fees and related services are managed by the private
              hostel management.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                to="/private-hostel/rules"
                className="border border-slate-300 rounded-full px-5 py-2.5 text-sm"
              >
                Hostel Rules
              </Link>

              <Link
                to="/private-hostel/rooms"
                className="border border-slate-300 rounded-full px-5 py-2.5 text-sm"
              >
                View Rooms
              </Link>

              <Link
                to="/private-hostel/contact"
                className="border border-slate-300 rounded-full px-5 py-2.5 text-sm"
              >
                Hostel Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}