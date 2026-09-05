import { useEffect, useState } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  ChevronDown,
  Star,
} from "lucide-react";
import { Hero } from "./About";

const faqs = [
  {
    q: "Hostel admission kaise lein?",
    a: "Hostel admission ke liye website ke Hostel Admission section mein jaakar application form fill karke submit karein. Application review ke baad admission process complete kiya jayega.",
  },
  {
    q: "Hostel ki fees kya hai?",
    a: "Single Room ₹2,000/month aur Shared 4 Beds ₹1,000/month.",
  },
  {
    q: "Kaunse room options available hain?",
    a: "Single Room aur Shared 4 Beds.",
  },
  {
    q: "Admission ke liye documents kya chahiye?",
    a: "Admission application mein student ki basic information, DOB, mobile, email, address, college/institution, course aur emergency contact details provide karni hoti hain.",
  },
  {
    q: "Prayer timings kahan milengi?",
    a: "Daily Prayer Timings website ke Prayer Timings section mein available hain.",
  },
  {
    q: "Hostel facilities kya hain?",
    a: "Room type ke according beds, study tables/desks, storage/wardrobe, common study space jaise facilities.",
  },
  {
    q: "Contact/visit kaise karein?",
    a: "Website ke Contact section se contact karein; visit se pehle contact karke details confirm karna better.",
  },
  {
    q: "Masjid ki location kahan hai?",
    a: "Exact location/directions Contact section mein available hain.",
  },
  {
    q: "Masjid mein kya facilities available hain?",
    a: "Daily prayers/religious activities ke saath community/students ke liye available facilities ki details Facilities section mein.",
  },
  {
    q: "Masjid staff ke names kya hain?",
    a: "Hafiz Wahid Shahb — Imam & Khatib and Teacher and Iliyas Shah Shahab — Muazzin & Caretaker.",
  },
];

function Stars({ value, interactive = false, onChange }) {
  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating" : `${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            role="radio"
            aria-checked={value === n}
          >
            <Star
              className={`w-5 h-5 ${
                n <= value
                  ? "fill-[#C5A059] text-[#C5A059]"
                  : "text-slate-300"
              }`}
            />
          </button>
        ) : (
          <Star
            key={n}
            className={`w-5 h-5 ${
              n <= value
                ? "fill-[#C5A059] text-[#C5A059]"
                : "text-slate-300"
            }`}
            aria-hidden="true"
          />
        )
      )}
    </div>
  );
}

export default function Contact() {
  const [ci, setCi] = useState();
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    review: "",
  });
  const [reviewBusy, setReviewBusy] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const loadReviews = async () => {
    try {
      const res = await api.get("/reviews");
      setReviews(res.data || []);
    } catch (error) {
      console.error("Reviews loading failed:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    api
      .get("/contact-info")
      .then((r) => setCi(r.data))
      .catch((e) => toast.error(formatError(e)));

    loadReviews();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await api.post("/contact-messages", f);
      toast.success("Message sent successfully");
      setF({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (x) {
      toast.error(formatError(x));
    } finally {
      setBusy(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (reviewForm.name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }

    if (reviewForm.review.trim().length < 5) {
      toast.error("Please write a little more about your experience");
      return;
    }

    try {
      setReviewBusy(true);

      await api.post("/reviews", {
        name: reviewForm.name.trim(),
        rating: reviewForm.rating,
        review: reviewForm.review.trim(),
      });

      toast.success("Review submitted for approval");
      setReviewForm({
        name: "",
        rating: 5,
        review: "",
      });
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setReviewBusy(false);
    }
  };

  const field =
    "w-full px-4 py-3 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#059669]";

  return (
    <>
      <Hero
        title="Contact Us"
        sub="For admissions, general queries or community support."
      />

      {/* CONTACT INFORMATION */}
      <section className="py-16 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#0D3B2E] text-center mb-10">
            Contact Information
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {ci &&
                [
                  ["Mosque Address", MapPin, ci.mosque_address],
                  ["Hostel Address", MapPin, ci.hostel_address],
                  ["Phone", Phone, ci.phone],
                  ["Email", Mail, ci.email],
                  ["Office Hours", Clock, ci.office_hours],
                ].map(([t, I, v]) => (
                  <div
                    className="card-elegant p-6 flex gap-4"
                    key={t}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#E6F4F0] grid place-items-center shrink-0">
                      <I className="text-[#059669]" />
                    </div>

                    <div>
                      <h3 className="font-heading text-lg font-semibold text-[#0D3B2E]">
                        {t}
                      </h3>
                      <p className="p text-sm">{v || "-"}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* CONTACT FORM */}
            <form
              onSubmit={submit}
              className="card-elegant p-7 space-y-4"
            >
              <h2 className="font-heading text-3xl text-[#0D3B2E]">
                Send us a message
              </h2>

              <input
                required
                className={field}
                placeholder="Your name"
                value={f.name}
                onChange={(e) =>
                  setF({ ...f, name: e.target.value })
                }
              />

              <input
                required
                type="email"
                className={field}
                placeholder="Email"
                value={f.email}
                onChange={(e) =>
                  setF({ ...f, email: e.target.value })
                }
              />

              <input
                className={field}
                placeholder="Phone"
                value={f.phone}
                onChange={(e) =>
                  setF({ ...f, phone: e.target.value })
                }
              />

              <input
                required
                className={field}
                placeholder="Subject"
                value={f.subject}
                onChange={(e) =>
                  setF({ ...f, subject: e.target.value })
                }
              />

              <textarea
                required
                rows="6"
                className={field}
                placeholder="Your message"
                value={f.message}
                onChange={(e) =>
                  setF({ ...f, message: e.target.value })
                }
              />

              <button
                disabled={busy}
                className="btn-primary-green w-full py-3.5 rounded-full inline-flex justify-center items-center gap-2 disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="animate-spin w-4" />
                ) : (
                  <Send className="w-4" />
                )}
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="gold-divider text-xs uppercase tracking-widest mb-3">
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-heading text-4xl text-[#0D3B2E]">
              FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={item.q}
                  className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-[#FFFDF5]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#C5A059]"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-[#0D3B2E]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-[#C5A059] transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-7">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISITOR REVIEWS */}
      <section className="py-16 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="gold-divider text-xs uppercase tracking-widest mb-3">
              <span>Visitor Reviews</span>
            </div>
            <h2 className="font-heading text-4xl text-[#0D3B2E]">
              What Visitors Say
            </h2>
            <p className="p max-w-2xl mx-auto mt-3">
              Share your experience. Reviews are published after admin approval.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div>
              {reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-5">
                  {reviews.map((item) => (
                    <article
                      key={item.id}
                      className="card-elegant p-6 bg-white"
                    >
                      <Stars value={item.rating} />
                      <p className="text-slate-600 leading-7 mt-4">
                        “{item.review}”
                      </p>
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="font-semibold text-[#0D3B2E]">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Visitor
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="card-elegant p-10 text-center bg-white">
                  <Star className="w-10 h-10 text-[#C5A059] mx-auto" />
                  <p className="text-slate-500 mt-3">
                    No approved reviews yet. Be the first to share your experience.
                  </p>
                </div>
              )}
            </div>

            <form
              onSubmit={submitReview}
              className="card-elegant p-7 bg-white space-y-4"
            >
              <h3 className="font-heading text-3xl text-[#0D3B2E]">
                Leave a Review
              </h3>

              <div>
                <label className="block text-sm font-semibold text-[#0D3B2E]">
                  Your Name *
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  className={`${field} mt-1`}
                  placeholder="Enter your name"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <div className="text-sm font-semibold text-[#0D3B2E] mb-1">
                  Rating *
                </div>
                <Stars
                  value={reviewForm.rating}
                  interactive
                  onChange={(rating) =>
                    setReviewForm({
                      ...reviewForm,
                      rating,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0D3B2E]">
                  Your Review *
                </label>
                <textarea
                  required
                  minLength={5}
                  maxLength={1000}
                  rows="5"
                  className={`${field} mt-1`}
                  placeholder="Tell us about your experience..."
                  value={reviewForm.review}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      review: e.target.value,
                    })
                  }
                />
              </div>

              <button
                disabled={reviewBusy}
                className="btn-gold w-full py-3.5 rounded-full inline-flex justify-center items-center gap-2 disabled:opacity-60"
              >
                {reviewBusy && (
                  <Loader2 className="animate-spin w-4" />
                )}
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
