import { useState } from "react";
import { AlertCircle, CheckCircle2, Image as ImageIcon, Send } from "lucide-react";

import { api } from "@/lib/api";
import { Hero } from "./About";

export default function HostelComplaint() {
  const [studentName, setStudentName] = useState("");
  const [photo, setPhoto] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [locationDescription, setLocationDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPhoto("");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Photo / evidence must be less than 2MB.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result);
      setError("");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!studentName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!complaintDescription.trim()) {
      setError("Please describe your complaint.");
      return;
    }

    if (!locationDescription.trim()) {
      setError("Please describe the location.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/hostel/complaints", {
        student_name: studentName.trim(),
        photo: photo || null,
        complaint_description: complaintDescription.trim(),
        location_description: locationDescription.trim(),
      });

      setSuccess(
        "Your complaint has been submitted successfully. Hostel management will review it."
      );

      setStudentName("");
      setPhoto("");
      setComplaintDescription("");
      setLocationDescription("");

      const fileInput = document.getElementById("complaint-photo");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Complaint submission failed:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to submit your complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero
        title="Student Complaint"
        sub="Private Boys Hostel residents can use this form to report complaints or maintenance concerns."
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl text-[#0D3B2E]">
              Submit a Complaint
            </h2>

            <p className="text-slate-600 mt-4 leading-7">
              Please provide clear information so the private hostel
              management can understand and review your complaint.
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex gap-3">
              <CheckCircle2 className="text-emerald-600 shrink-0" />

              <div>
                <h3 className="font-semibold text-emerald-800">
                  Complaint Submitted
                </h3>

                <p className="text-sm text-emerald-700 mt-1">
                  {success}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 flex gap-3">
              <AlertCircle className="text-red-600 shrink-0" />

              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="card-elegant bg-white p-6 md:p-8 space-y-6"
          >
            {/* Student Name */}
            <div>
              <label
                htmlFor="student-name"
                className="block text-sm font-semibold text-[#0D3B2E] mb-2"
              >
                Student Name
              </label>

              <input
                id="student-name"
                type="text"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                maxLength={100}
                required
              />
            </div>

            {/* Photo / Evidence */}
            <div>
              <label
                htmlFor="complaint-photo"
                className="block text-sm font-semibold text-[#0D3B2E] mb-2"
              >
                Photo / Evidence
                <span className="text-slate-400 font-normal ml-2">
                  (Optional)
                </span>
              </label>

              <div className="border border-dashed border-slate-300 rounded-xl p-5 bg-slate-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E6F4F0] grid place-items-center">
                    <ImageIcon className="text-[#059669]" size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#0D3B2E]">
                      Upload supporting evidence
                    </p>

                    <p className="text-xs text-slate-500">
                      Image only • Maximum 2MB
                    </p>
                  </div>
                </div>

                <input
                  id="complaint-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-slate-600"
                />

                {photo && (
                  <div className="mt-4">
                    <img
                      src={photo}
                      alt="Complaint evidence preview"
                      className="w-full max-h-64 object-contain rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Complaint Description */}
            <div>
              <label
                htmlFor="complaint-description"
                className="block text-sm font-semibold text-[#0D3B2E] mb-2"
              >
                Complaint Description
              </label>

              <textarea
                id="complaint-description"
                value={complaintDescription}
                onChange={(event) =>
                  setComplaintDescription(event.target.value)
                }
                placeholder="Describe your complaint clearly..."
                rows={6}
                maxLength={2000}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none resize-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                required
              />
            </div>

            {/* Location Description */}
            <div>
              <label
                htmlFor="location-description"
                className="block text-sm font-semibold text-[#0D3B2E] mb-2"
              >
                Location Description
              </label>

              <textarea
                id="location-description"
                value={locationDescription}
                onChange={(event) =>
                  setLocationDescription(event.target.value)
                }
                placeholder="Example: First floor bathroom near Room 12"
                rows={3}
                maxLength={500}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none resize-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={18} />

              {loading ? "Submitting Complaint..." : "Submit Complaint"}
            </button>

            <p className="text-xs text-center text-slate-500 leading-5">
              This complaint form is for the independently managed Private
              Boys Hostel and is separate from Jama Masjid services.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}