import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";

import { Hero } from "./About";

export default function HostelContact() {
  return (
    <>
      <Hero
        title="Private Boys Hostel Contact"
        sub="Contact the independently managed Private Boys Hostel for accommodation, admission and hostel-related enquiries."
      />

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="card-elegant bg-white p-7 md:p-9">
              <div className="w-14 h-14 rounded-xl bg-[#E6F4F0] grid place-items-center mb-5">
                <Building2 className="text-[#059669]" size={28} />
              </div>

              <h2 className="font-heading text-3xl text-[#0D3B2E]">
                Private Boys Hostel
              </h2>

              <p className="text-slate-600 leading-7 mt-4">
                For hostel admission, room availability, fees, facilities or
                other accommodation-related enquiries, please contact the
                Private Boys Hostel management.
              </p>

              <div className="space-y-5 mt-8">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#E6F4F0] grid place-items-center shrink-0">
                    <MapPin className="text-[#059669]" size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0D3B2E]">
                      Hostel Location
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Private Boys Hostel
                      <br />
                      Location details can be provided by hostel management.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#E6F4F0] grid place-items-center shrink-0">
                    <Phone className="text-[#059669]" size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0D3B2E]">
                      Phone
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Contact number will be provided by hostel management.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#E6F4F0] grid place-items-center shrink-0">
                    <Mail className="text-[#059669]" size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0D3B2E]">
                      Email
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Hostel email will be provided by hostel management.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#E6F4F0] grid place-items-center shrink-0">
                    <Clock className="text-[#059669]" size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0D3B2E]">
                      Enquiry Hours
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Please contact hostel management during working hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="card-elegant bg-[#E6F4F0] p-7 md:p-9">
              <div className="w-14 h-14 rounded-xl bg-white grid place-items-center mb-5">
                <MessageCircle className="text-[#059669]" size={28} />
              </div>

              <h2 className="font-heading text-3xl text-[#0D3B2E]">
                Hostel Enquiries
              </h2>

              <p className="text-slate-600 leading-7 mt-4">
                Students and parents can contact the private hostel
                management regarding accommodation and hostel services.
              </p>

              <div className="space-y-3 mt-8">
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-[#0D3B2E]">
                    Room Availability
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Ask about available rooms and current occupancy.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-[#0D3B2E]">
                    Admission
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Get information about the hostel admission process.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-[#0D3B2E]">
                    Fees & Facilities
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Contact management for current fees and facility details.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-[#0D3B2E]">
                    Student Complaints
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Residents can submit complaints through the Student
                    Complaint section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separation Notice */}
      <section className="py-16 islamic-pattern">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card-elegant bg-white p-8 md:p-10 text-center">
            <h2 className="font-heading text-2xl md:text-3xl text-[#0D3B2E]">
              Important Notice
            </h2>

            <p className="text-slate-600 leading-7 mt-4">
              The Private Boys Hostel is an independently managed hostel.
              Hostel admission, room availability, fees, facilities,
              complaints and day-to-day management are handled separately
              from Jama Masjid.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}