import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  Bed,
  CheckCircle2,
  Users,
  ArrowRight,
} from "lucide-react";

import { Hero } from "./About";
import { api } from "@/lib/api";

export default function HostelRooms() {
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
        title="Private Boys Hostel Rooms"
        sub="Choose an accommodation option according to your needs."
      />

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-[#0D3B2E]">
            Room & Accommodation Options
          </h2>

          <p className="text-lg leading-8 text-slate-600 mt-5">
            The Private Boys Hostel provides affordable accommodation options
            for students. Room availability, allocation and fees are handled
            independently by the private hostel management.
          </p>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-20 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">

          {loading && (
            <div className="text-center py-16 text-slate-500">
              Loading rooms...
            </div>
          )}

          {!loading && rooms.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="card-elegant overflow-hidden bg-white flex flex-col"
                >
                  {/* Room Image */}
                  {room.image ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-[#E6F4F0] grid place-items-center">
                      <Bed className="w-20 h-20 text-[#C5A059]" />
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">

                    {/* Room Name */}
                    <h3 className="font-heading text-2xl text-[#0D3B2E]">
                      {room.name}
                    </h3>

                    {/* Price */}
                    <div className="font-heading text-3xl text-gradient-gold mt-3">
                      {room.price}
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 leading-7 mt-3">
                      {room.description}
                    </p>

                    {/* Capacity */}
                    <div className="flex items-center gap-2 mt-5 text-sm text-slate-600">
                      <Users className="w-5 h-5 text-[#059669]" />

                      <span>
                        {room.name?.toLowerCase().includes("single")
                          ? "1 student per room"
                          : "4 students per room"}
                      </span>
                    </div>

                    {/* Features */}
                    {room.features?.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="font-semibold text-[#0D3B2E]">
                          Room Features
                        </h4>

                        {room.features.map((feature, index) => (
                          <div
                            key={`${room.id}-feature-${index}`}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />

                            {feature}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Apply */}
                    <Link
                      to="/private-hostel/admission"
                      className="btn-primary-green rounded-full text-center py-3 mt-7 inline-flex items-center justify-center gap-2"
                    >
                      Apply for This Room

                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && rooms.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Bed className="w-14 h-14 mx-auto text-[#C5A059] mb-4" />

              <h2 className="font-heading text-2xl text-[#0D3B2E]">
                Rooms Currently Unavailable
              </h2>

              <p className="text-slate-500 mt-2">
                Room information will appear here when available.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card-elegant bg-[#E6F4F0] p-8 md:p-10">
            <h2 className="font-heading text-2xl md:text-3xl text-[#0D3B2E]">
              Important Information
            </h2>

            <p className="text-slate-600 leading-7 mt-4">
              Room availability and allocation may change according to hostel
              occupancy. Please submit the admission form or contact the
              private hostel management for current availability.
            </p>

            <p className="text-slate-500 text-sm leading-6 mt-4">
              The Private Boys Hostel is independently managed and is separate
              from Jama Masjid.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/private-hostel/admission"
                className="btn-primary-green rounded-full px-6 py-3 inline-flex items-center gap-2"
              >
                Hostel Admission
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/private-hostel/contact"
                className="border border-[#0D3B2E] text-[#0D3B2E] rounded-full px-6 py-3 inline-flex items-center gap-2"
              >
                Contact Hostel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}