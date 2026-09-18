import { CheckCircle2 } from "lucide-react";
import { Hero } from "./About";

const rules = [
  "Maintain cleanliness in rooms and common areas.",
  "Follow curfew, meal timings and study hours.",
  "Respect residents, staff and visitors with adab.",
  "Follow instructions from the warden and private hostel management.",
  "No ragging, smoking, intoxicants or disruptive behaviour.",
  "Visitors are allowed only in designated areas with prior approval.",
  "Maintain quiet study hours from 8:00 PM to 10:00 PM.",
  "Follow electrical and fire-safety requirements.",
  "Residents are encouraged to attend congregation prayers.",
  "Report damage, maintenance issues or safety concerns promptly.",
];

export default function Rules() {
  return (
    <>
      <Hero
        title="Private Boys Hostel Rules"
        sub="Rules that help maintain a peaceful, disciplined and respectful environment for all residents."
      />

      {/* INTRODUCTION */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-[#0D3B2E]">
            Hostel Code of Conduct
          </h2>

          <p className="text-lg leading-8 text-slate-600 mt-5">
            All residents are expected to follow these rules to maintain a
            clean, safe, peaceful and student-friendly environment.
          </p>

          <p className="text-base leading-7 text-slate-500 mt-4">
            These rules are applicable to residents of the Private Boys
            Hostel and are managed independently by the private hostel
            management.
          </p>
        </div>
      </section>

      {/* RULES */}
      <section className="py-20 islamic-pattern">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                className="card-elegant p-6 flex gap-4 bg-white"
                key={rule}
              >
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#E6F4F0] grid place-items-center">
                  <CheckCircle2 className="text-[#059669]" />
                </div>

                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0D3B2E]">
                    Rule {index + 1}
                  </h3>

                  <p className="text-slate-600 text-sm leading-6 mt-1">
                    {rule}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTE */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card-elegant bg-[#E6F4F0] p-8 md:p-10">
            <h2 className="font-heading text-2xl md:text-3xl text-[#0D3B2E] mb-4">
              Important Information
            </h2>

            <p className="text-slate-600 leading-7">
              Hostel residents are responsible for following the rules and
              respecting other residents, staff and visitors. Serious or
              repeated violations may result in action according to the
              policies of the private hostel management.
            </p>

            <p className="text-slate-500 text-sm leading-6 mt-4">
              The Private Boys Hostel is separate from Jama Masjid and is
              independently managed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}