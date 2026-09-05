import { useEffect, useState } from 'react';
import { api, formatError } from '@/lib/api';
import { toast } from 'sonner';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  ChevronDown,
  Star,
  MessageSquare,
} from 'lucide-react';
import { Hero } from './About';

const faqs = [
  {
    q: 'How can I apply for hostel admission?',
    a: 'To apply for hostel admission, go to the Hostel Admission section on the website, fill out the application form, and submit it. The application will be reviewed before the admission process is completed.',
  },
  {
    q: 'What are the hostel fees?',
    a: 'The Single Room costs ₹2,000 per month, while the Shared 4 Beds option costs ₹1,000 per month.',
  },
  {
    q: 'What room options are available?',
    a: 'The available room options are Single Room and Shared 4 Beds.',
  },
  {
    q: 'What documents are required for admission?',
    a: 'The admission application requires basic student information, including date of birth, mobile number, email address, residential address, college or institution name, course name, and emergency contact details.',
  },
  {
    q: 'Where can I find the prayer timings?',
    a: 'Daily prayer timings are available in the Prayer Timings section of the website.',
  },
  {
    q: 'What facilities are available in the hostel?',
    a: 'Depending on the room type, hostel facilities may include beds, study tables or desks, storage or wardrobes, and common study spaces.',
  },
  {
    q: 'How can I contact or visit the hostel?',
    a: 'You can contact us through the Contact section of the website. It is recommended to contact us before visiting to confirm the details.',
  },
  {
    q: 'Where is the mosque located?',
    a: 'The exact mosque location and directions are available in the Contact section of the website.',
  },
  {
    q: 'What facilities are available in the mosque?',
    a: 'The mosque provides daily prayers and religious activities, along with facilities for the community and students. More details are available in the Facilities section.',
  },
  {
    q: 'Who are the members of the mosque staff?',
    a: 'Hafiz Wahid Shahb — Imam & Khatib and Teacher. Iliyas Shah Shahab — Muazzin & Caretaker.',
  },
];

export default function Contact() {
  const [ci, setCi] = useState();
  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [busy, setBusy] = useState(false);

  const [openFaq, setOpenFaq] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    review: '',
  });
  const [reviewBusy, setReviewBusy] = useState(false);

  useEffect(() => {
    api
      .get('/contact-info')
      .then((r) => setCi(r.data))
      .catch((e) => toast.error(formatError(e)));

    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const r = await api.get('/reviews');
      setReviews(r.data || []);
    } catch (e) {
      console.error('Reviews load error:', e);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await api.post('/contact-messages', f);

      toast.success('Message sent successfully');

      setF({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (x) {
      toast.error(formatError(x));
    } finally {
      setBusy(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewBusy(true);

    try {
      await api.post('/reviews', {
        name: reviewForm.name.trim(),
        rating: Number(reviewForm.rating),
        review: reviewForm.review.trim(),
      });

      toast.success(
        'Review submitted successfully. It will appear after admin approval.'
      );

      setReviewForm({
        name: '',
        rating: 5,
        review: '',
      });

      await loadReviews();
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setReviewBusy(false);
    }
  };

  const field =
    'w-full px-4 py-3 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#059669]';

  return (
    <>
      <Hero
        title="Contact Us"
        sub="For admissions, general queries or community support."
      />

      {/* CONTACT INFORMATION + CONTACT FORM */}
      <section className="py-16 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {ci &&
              [
                ['Mosque Address', MapPin, ci.mosque_address],
                ['Hostel Address', MapPin, ci.hostel_address],
                ['Phone', Phone, ci.phone],
                ['Email', Mail, ci.email],
                ['Office Hours', Clock, ci.office_hours],
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

                    <p className="p text-sm">{v}</p>
                  </div>
                </div>
              ))}
          </div>

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
              className="btn-primary-green w-full py-3.5 rounded-full inline-flex justify-center items-center gap-2"
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
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#FAF6EE] border-y border-[#C5A059]/15">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="gold-divider text-xs uppercase tracking-widest mb-3">
              <span>Help & Information</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-semibold text-[#0D3B2E]">
              ❓ Frequently Asked Questions
            </h2>

            <p className="text-[#475569] mt-3 text-base sm:text-lg">
              Find answers to common questions about the masjid and hostel.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-[#C5A059]/25 shadow-[0_8px_25px_-12px_rgba(13,59,46,.15)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="w-full px-5 sm:px-6 py-5 flex items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-[#0D3B2E] text-sm sm:text-base">
                      {faq.q}
                    </span>

                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-[#C5A059] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5">
                      <div className="border-t border-[#C5A059]/15 pt-4">
                        <p className="text-sm sm:text-base text-[#475569] leading-7">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISITOR REVIEWS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="gold-divider text-xs uppercase tracking-widest mb-3">
              <span>Community Feedback</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-semibold text-[#0D3B2E]">
              ⭐ Visitor Reviews
            </h2>

            <p className="text-[#475569] mt-3 text-base sm:text-lg">
              Share your experience with Jama Masjid & Boys' Hostel.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* REVIEW FORM */}
            <form
              onSubmit={submitReview}
              className="card-elegant p-7 sm:p-8 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#E6F4F0] grid place-items-center">
                  <MessageSquare className="w-5 h-5 text-[#059669]" />
                </div>

                <div>
                  <h3 className="font-heading text-2xl font-semibold text-[#0D3B2E]">
                    Leave a Review
                  </h3>

                  <p className="text-xs text-[#64748B]">
                    Your review will appear after approval.
                  </p>
                </div>
              </div>

              <input
                required
                minLength={2}
                maxLength={100}
                className={field}
                placeholder="Your name"
                value={reviewForm.name}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    name: e.target.value,
                  })
                }
              />

              <div>
                <label className="block text-sm font-semibold text-[#0D3B2E] mb-2">
                  Rating
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({
                          ...reviewForm,
                          rating: star,
                        })
                      }
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewForm.rating
                            ? 'fill-[#C5A059] text-[#C5A059]'
                            : 'text-[#CBD5E1]'
                        }`}
                      />
                    </button>
                  ))}

                  <span className="ml-2 text-sm font-semibold text-[#475569]">
                    {reviewForm.rating}/5
                  </span>
                </div>
              </div>

              <textarea
                required
                minLength={5}
                maxLength={1000}
                rows="6"
                className={field}
                placeholder="Write your review..."
                value={reviewForm.review}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    review: e.target.value,
                  })
                }
              />

              <button
                disabled={reviewBusy}
                className="btn-primary-green w-full py-3.5 rounded-full inline-flex justify-center items-center gap-2"
              >
                {reviewBusy ? (
                  <Loader2 className="animate-spin w-4" />
                ) : (
                  <Star className="w-4" />
                )}
                Submit Review
              </button>
            </form>

            {/* APPROVED REVIEWS */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="card-elegant p-8 text-center">
                  <Star className="w-10 h-10 text-[#C5A059] mx-auto mb-3" />

                  <h3 className="font-heading text-2xl text-[#0D3B2E]">
                    Be the first to leave a review
                  </h3>

                  <p className="text-sm text-[#64748B] mt-2">
                    Your feedback helps our community.
                  </p>
                </div>
              ) : (
                reviews.map((item) => (
                  <div
                    key={item.id}
                    className="card-elegant p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-[#0D3B2E]">
                          {item.name}
                        </h3>

                        <div className="flex gap-0.5 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Number(item.rating)
                                  ? 'fill-[#C5A059] text-[#C5A059]'
                                  : 'text-[#CBD5E1]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <span className="text-xs text-[#94A3B8]">
                        Visitor
                      </span>
                    </div>

                    <p className="text-sm text-[#475569] leading-7 mt-4">
                      {item.review}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}