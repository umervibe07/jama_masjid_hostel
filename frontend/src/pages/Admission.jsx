import { useRef, useState } from "react";

import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2,
  Printer,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Hero } from "./About";

const initial = {
  student_name: "",
  father_name: "",
  dob: "",
  mobile: "",
  email: "",
  address: "",
  institution: "",
  course: "",
  year: "",
  emergency_contact: "",
  room_type: "shared_4",
  admission_date: "",
  photo: "",
};

export default function Admission() {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(null);
  const [submittedForm, setSubmittedForm] = useState(null);

  const photoInputRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();

    if (!f.admission_date) {
      toast.error("Please select Date of Admission");
      return;
    }

    if (!f.photo) {
      toast.error("Please upload a passport-size photograph");
      return;
    }

    setBusy(true);

    try {
      const { data } = await api.post("/hostel/applications", f);

      const savedForm = {
        ...f,
        application_id: data.application_id,
        message: data.message,
        status: "pending",
      };

      setSubmittedForm(savedForm);
      setSuccess(data);
      setF(initial);

      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }

      toast.success("Application submitted successfully");
    } catch (x) {
      toast.error(formatError(x));
    } finally {
      setBusy(false);
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo size must be less than 2 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setF((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const printAdmission = () => {
    if (!submittedForm) return;

    window.print();
  };

  const downloadAdmission = () => {
    if (!submittedForm) return;

    const x = submittedForm;

    const formatDate = (value) => {
      if (!value) return "";

      const parts = value.split("-");

      if (parts.length !== 3) return value;

      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Private Boys Hostel Admission Form - ${
          x.application_id
        }</title>

        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #0f172a;
            font-family: Arial, Helvetica, sans-serif;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            margin: 0 auto;
            background: #ffffff;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #c5a059;
            padding-bottom: 12px;
          }

          .header h1 {
            margin: 0;
            font-size: 22px;
            color: #0d3b2e;
            letter-spacing: 1px;
          }

          .header h2 {
            margin: 7px 0 0;
            font-size: 16px;
            color: #15547f;
          }

          .header p {
            margin: 7px 0 0;
            font-size: 11px;
            color: #64748b;
          }

          .status {
            display: inline-block;
            margin-top: 12px;
            padding: 5px 14px;
            border-radius: 20px;
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            font-size: 11px;
            font-weight: bold;
          }

          .top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 20px;
          }

          .photo {
            width: 35mm;
            height: 45mm;
            object-fit: cover;
            border: 1px solid #cbd5e1;
            padding: 2px;
          }

          .details {
            flex: 1;
            margin-right: 18px;
          }

          .row {
            display: flex;
            border-bottom: 1px solid #e2e8f0;
            padding: 8px 0;
            font-size: 12px;
          }

          .label {
            width: 48mm;
            font-weight: bold;
            color: #475569;
          }

          .value {
            flex: 1;
          }

          .notice {
            margin-top: 18px;
            padding: 12px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
            font-size: 11px;
            line-height: 1.6;
          }

          .footer {
            margin-top: 35mm;
            border-top: 1px solid #cbd5e1;
            padding-top: 18px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #64748b;
          }

          .signature {
            width: 55mm;
            text-align: center;
            padding-top: 18px;
            border-top: 1px solid #334155;
          }
        </style>
      </head>

      <body>
        <div class="page">

          <div class="header">
            <h1>PRIVATE BOYS HOSTEL</h1>
            <h2>STUDENT ADMISSION FORM</h2>
            <p>Independently managed private accommodation facility</p>
            <div class="status">APPLICATION SUBMITTED</div>
          </div>

          <div class="top">

            <div class="details">

              <div class="row">
                <div class="label">Application ID</div>
                <div class="value">${x.application_id || ""}</div>
              </div>

              <div class="row">
                <div class="label">Student Name</div>
                <div class="value">${x.student_name || ""}</div>
              </div>

              <div class="row">
                <div class="label">Father / Guardian</div>
                <div class="value">${x.father_name || ""}</div>
              </div>

              <div class="row">
                <div class="label">Date of Birth</div>
                <div class="value">${formatDate(x.dob)}</div>
              </div>

              <div class="row">
                <div class="label">Date of Admission</div>
                <div class="value">${formatDate(x.admission_date)}</div>
              </div>

              <div class="row">
                <div class="label">Mobile Number</div>
                <div class="value">${x.mobile || ""}</div>
              </div>

              <div class="row">
                <div class="label">Email</div>
                <div class="value">${x.email || ""}</div>
              </div>

            </div>

            ${
              x.photo
                ? `<img class="photo" src="${x.photo}" alt="Passport Photo" />`
                : ""
            }

          </div>

          <div class="row">
            <div class="label">Permanent Address</div>
            <div class="value">${x.address || ""}</div>
          </div>

          <div class="row">
            <div class="label">College / Institution</div>
            <div class="value">${x.institution || ""}</div>
          </div>

          <div class="row">
            <div class="label">Course</div>
            <div class="value">${x.course || ""}</div>
          </div>

          <div class="row">
            <div class="label">Year / Semester</div>
            <div class="value">${x.year || ""}</div>
          </div>

          <div class="row">
            <div class="label">Emergency Contact</div>
            <div class="value">${x.emergency_contact || ""}</div>
          </div>

          <div class="row">
            <div class="label">Preferred Room Type</div>
            <div class="value">${x.room_type || ""}</div>
          </div>

          <div class="row">
            <div class="label">Application Status</div>
            <div class="value">Pending</div>
          </div>

          <div class="notice">
            This application is for accommodation at the Private Boys Hostel.
            The hostel is independently managed and is separate from Jama
            Masjid. Hostel admission, room allocation, fees and related
            services are handled by the private hostel management.
          </div>

          <div class="footer">
            <div>
              Private Boys Hostel
            </div>

            <div class="signature">
              Authorized Signature
            </div>
          </div>

        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Private-Hostel-Admission-Form-${
      x.application_id || "form"
    }.html`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const input =
    "w-full mt-1 px-4 py-3 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#059669]";

  if (success && submittedForm) {
    return (
      <>
        <div className="min-h-[75vh] grid place-items-center islamic-pattern p-4">
          <div className="card-elegant p-8 sm:p-10 max-w-lg w-full text-center">

            <CheckCircle2 className="w-16 h-16 text-[#059669] mx-auto" />

            <h2 className="font-heading text-3xl text-[#0D3B2E] mt-4">
              Application Received
            </h2>

            <p className="p mt-2">
              {success.message}
            </p>

            <p className="text-xs text-slate-500 mt-3">
              Application ID: {success.application_id}
            </p>

            <div className="mt-6 p-4 rounded-xl bg-[#E6F4F0] text-sm text-slate-600">
              Your application is for the{" "}
              <strong className="text-[#0D3B2E]">
                Private Boys Hostel
              </strong>
              . Hostel admission and management are handled separately from
              Jama Masjid.
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">

              <button
                type="button"
                onClick={printAdmission}
                className="btn-primary-green py-3 rounded-full inline-flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Admission Form
              </button>

              <button
                type="button"
                onClick={downloadAdmission}
                className="btn-gold py-3 rounded-full inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Admission Form
              </button>

            </div>

            <div className="mt-3 flex justify-center gap-3">

              <button
                type="button"
                onClick={() => {
                  setSuccess(null);
                  setSubmittedForm(null);
                }}
                className="border border-[#0D3B2E] px-5 py-2.5 rounded-full"
              >
                Submit Another
              </button>

              <Link
                to="/private-hostel"
                className="btn-primary-green px-5 py-2.5 rounded-full"
              >
                Hostel Home
              </Link>

            </div>

          </div>
        </div>

        <div className="admission-print-record">

          <div className="text-center border-b-2 border-[#C5A059] pb-4">

            <h1 className="text-2xl font-bold text-[#0D3B2E]">
              PRIVATE BOYS HOSTEL
            </h1>

            <h2 className="text-lg font-semibold text-[#15547F] mt-2">
              STUDENT ADMISSION FORM
            </h2>

            <p className="text-xs text-slate-500 mt-2">
              Independently managed private accommodation facility
            </p>

            <div className="inline-block mt-3 px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              APPLICATION SUBMITTED
            </div>

          </div>

          <div className="flex gap-6 mt-8">

            <div className="flex-1">

              <PrintRow
                label="Application ID"
                value={submittedForm.application_id}
              />

              <PrintRow
                label="Student Name"
                value={submittedForm.student_name}
              />

              <PrintRow
                label="Father / Guardian"
                value={submittedForm.father_name}
              />

              <PrintRow
                label="Date of Birth"
                value={submittedForm.dob}
                date
              />

              <PrintRow
                label="Date of Admission"
                value={submittedForm.admission_date}
                date
              />

              <PrintRow
                label="Mobile Number"
                value={submittedForm.mobile}
              />

              <PrintRow
                label="Email"
                value={submittedForm.email}
              />

            </div>

            {submittedForm.photo && (
              <img
                src={submittedForm.photo}
                alt="Passport"
                className="w-[120px] h-[150px] object-cover border border-slate-300 p-1"
              />
            )}

          </div>

          <PrintRow
            label="Permanent Address"
            value={submittedForm.address}
          />

          <PrintRow
            label="College / Institution"
            value={submittedForm.institution}
          />

          <PrintRow
            label="Course"
            value={submittedForm.course}
          />

          <PrintRow
            label="Year / Semester"
            value={submittedForm.year}
          />

          <PrintRow
            label="Emergency Contact"
            value={submittedForm.emergency_contact}
          />

          <PrintRow
            label="Preferred Room Type"
            value={submittedForm.room_type}
          />

          <PrintRow
            label="Application Status"
            value="Pending"
          />

          <div className="mt-6 p-4 border border-emerald-200 bg-emerald-50 text-xs text-slate-600 leading-5">
            This application is for accommodation at the Private Boys
            Hostel. The hostel is independently managed and is separate from
            Jama Masjid.
          </div>

          <div className="flex justify-between mt-16 pt-6 border-t border-slate-300 text-xs text-slate-500">
            <span>Private Boys Hostel</span>
            <span>Authorized Signature</span>
          </div>

        </div>

        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 0;
            }

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
            }

            body * {
              visibility: hidden !important;
            }

            .admission-print-record,
            .admission-print-record * {
              visibility: visible !important;
            }

            .admission-print-record {
              display: block !important;
              position: absolute !important;
              inset: 0 !important;
              width: 210mm !important;
              min-height: 297mm !important;
              box-sizing: border-box !important;
              padding: 14mm !important;
              background: #fff !important;
              color: #0f172a !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }

            .no-print {
              display: none !important;
            }
          }

          @media screen {
            .admission-print-record {
              display: none;
            }
          }
        `}</style>
      </>
    );
  }

  const fields = [
    ["student_name", "Student Name"],
    ["father_name", "Father / Guardian"],
    ["dob", "Date of Birth"],
    ["mobile", "Mobile Number"],
    ["email", "Email"],
    ["address", "Permanent Address"],
    ["institution", "College / Institution"],
    ["course", "Course"],
    ["year", "Year / Semester"],
    ["emergency_contact", "Emergency Contact"],
  ];

  return (
    <>
      <Hero
        title="Private Boys Hostel Admission"
        sub="Apply for accommodation at the independently managed Private Boys Hostel."
      />

      {/* INFORMATION */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-4">

          <div className="card-elegant bg-[#E6F4F0] p-6 md:p-8">

            <h2 className="font-heading text-2xl text-[#0D3B2E]">
              Before You Apply
            </h2>

            <p className="text-slate-600 leading-7 mt-3">
              This admission form is for the Private Boys Hostel. The hostel
              is independently managed and is separate from Jama Masjid.
              Hostel admission, room allocation, fees and related services
              are handled by the private hostel management.
            </p>

          </div>

        </div>
      </section>

      {/* FORM */}
      <section className="py-16 islamic-pattern">

        <form
          onSubmit={submit}
          className="max-w-3xl mx-auto px-4 card-elegant p-6 sm:p-10 grid sm:grid-cols-2 gap-5"
        >

          {fields.map(([k, l]) => (
            <label
              key={k}
              className={
                k === "address" || k === "email"
                  ? "sm:col-span-2"
                  : ""
              }
            >

              <span className="text-sm font-semibold text-[#0D3B2E]">
                {l} *
              </span>

              {k === "address" ? (
                <textarea
                  required
                  rows="3"
                  className={input}
                  value={f[k]}
                  onChange={(e) =>
                    setF({
                      ...f,
                      [k]: e.target.value,
                    })
                  }
                />
              ) : (
                <input
                  required
                  type={
                    k === "dob"
                      ? "date"
                      : k === "email"
                        ? "email"
                        : "text"
                  }
                  className={input}
                  value={f[k]}
                  onChange={(e) =>
                    setF({
                      ...f,
                      [k]: e.target.value,
                    })
                  }
                />
              )}

            </label>
          ))}

          {/* DATE OF ADMISSION */}
          <label>

            <span className="text-sm font-semibold text-[#0D3B2E]">
              Date of Admission *
            </span>

            <input
              required
              type="date"
              className={input}
              value={f.admission_date}
              onChange={(e) =>
                setF({
                  ...f,
                  admission_date: e.target.value,
                })
              }
            />

          </label>

          {/* PHOTO */}
          <label>

            <span className="text-sm font-semibold text-[#0D3B2E]">
              Passport-size Photograph *
            </span>

            <input
              ref={photoInputRef}
              required={!f.photo}
              type="file"
              accept="image/*"
              className={`${input} bg-white`}
              onChange={handlePhoto}
            />

            <p className="text-xs text-slate-500 mt-1">
              JPG/PNG image, maximum 2 MB.
            </p>

            {f.photo && (
              <div className="mt-3">

                <img
                  src={f.photo}
                  alt="Passport preview"
                  className="w-[90px] h-[115px] object-cover border border-slate-300 rounded-lg p-1"
                />

              </div>
            )}

          </label>

          {/* ROOM TYPE */}
          <label className="sm:col-span-2">

            <span className="text-sm font-semibold text-[#0D3B2E]">
              Preferred Room Type *
            </span>

            <select
              className={input}
              value={f.room_type}
              onChange={(e) =>
                setF({
                  ...f,
                  room_type: e.target.value,
                })
              }
            >

              <option value="single">
                Single Room — ₹2,000/month
              </option>

              <option value="shared_4">
                Shared 4 Beds — ₹1,000/month
              </option>

            </select>

          </label>

          {/* NOTE */}
          <div className="sm:col-span-2 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600 leading-6">
            By submitting this form, you are applying for accommodation at
            the Private Boys Hostel. Hostel admission and management are
            separate from Jama Masjid.
          </div>

          {/* SUBMIT */}
          <button
            disabled={busy}
            className="btn-gold sm:col-span-2 py-4 rounded-full inline-flex justify-center items-center gap-2"
          >

            {busy ? (
              <>
                <Loader2 className="animate-spin w-4" />
                Submitting…
              </>
            ) : (
              "Submit Hostel Application"
            )}

          </button>

        </form>

      </section>
    </>
  );
}

function PrintRow({ label, value, date = false }) {
  const formatDate = (v) => {
    if (!v) return "";

    const parts = v.split("-");

    if (parts.length !== 3) return v;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="flex border-b border-slate-200 py-2 text-sm">

      <div className="w-48 font-semibold text-slate-600">
        {label}
      </div>

      <div className="flex-1 text-slate-900">
        {date ? formatDate(value) : value || ""}
      </div>

    </div>
  );
}