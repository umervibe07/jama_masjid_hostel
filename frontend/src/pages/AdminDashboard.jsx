import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";

import {
  Clock,
  Users,
  Star,
  Calendar,
  Megaphone,
  Image,
  MapPin,
  LogOut,
  Save,
  Plus,
  Trash2,
  Check,
  X,
  Bed,
  Building2,
  Eye,
  DoorOpen,
} from "lucide-react";

/* =========================
   ADMIN TABS
========================= */

const tabs = [
  ["prayer", "Prayer Timings", Clock],
  ["applications", "Applications", Users],
  ["events", "Events", Calendar],
  ["announcements", "Announcements", Megaphone],
  ["gallery", "Gallery", Image],
  ["hostel", "Hostel", Bed],
  ["facilities", "Facilities", Building2],
  ["staff", "Mosque Staff", Users],
  ["reviews", "Visitor Reviews", Star],
  ["contact", "Contact Info", MapPin],
];

/* =========================
   MAIN ADMIN DASHBOARD
========================= */

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [t, setT] = useState("prayer");

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="sticky top-0 z-40 bg-[#0D3B2E] text-white border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between gap-4">
          <div>
            <div className="font-heading text-2xl">
              Admin Dashboard
            </div>

            <div className="text-xs text-[#C5A059]">
              Welcome, {user?.name || user?.email}
            </div>
          </div>

          <button
            onClick={logout}
            className="text-sm flex gap-2 items-center whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {tabs.map(([k, l, I]) => (
            <button
              key={k}
              onClick={() => setT(k)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex gap-2 items-center ${t === k
                  ? "bg-[#C5A059] text-[#0D3B2E] font-semibold"
                  : "text-white/80 hover:bg-white/5"
                }`}
            >
              <I className="w-4 h-4" />
              {l}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {t === "prayer" && <Prayer />}
        {t === "applications" && <Applications />}
        {t === "events" && <Events />}
        {t === "announcements" && <Announcements />}
        {t === "gallery" && <Gallery />}
        {t === "hostel" && <Hostel />}
        {t === "facilities" && <Facilities />}
        {t === "staff" && <Staff />}
        {t === "reviews" && <VisitorReviews />}
        {t === "contact" && <Contact />}
      </main>
    </div>
  );
}

/* =========================
   PRAYER
========================= */

function Prayer() {
  const [p, setP] = useState();

  useEffect(() => {
    api
      .get("/prayer-timings")
      .then((r) => setP(r.data))
      .catch((e) => toast.error(formatError(e)));
  }, []);

  if (!p) {
    return <div>Loading…</div>;
  }

  const keys = [
    ["fajr", "Fajr"],
    ["sunrise", "Sunrise"],
    ["dhuhr", "Dhuhr"],
    ["asr", "Asr"],
    ["maghrib", "Maghrib"],
    ["isha", "Isha"],
    ["jumuah", "Jumu’ah"],
  ];

  return (
    <div className="card-elegant p-6 max-w-2xl">
      <h2 className="font-heading text-2xl text-[#0D3B2E] mb-6">
        Update Prayer Timings
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {keys.map(([k, l]) => (
          <label
            key={k}
            className="text-xs font-semibold text-[#0D3B2E] uppercase"
          >
            {l}

            <input
              type="time"
              className="w-full mt-1 px-3 py-2.5 rounded-xl border"
              value={p[k] || ""}
              onChange={(e) =>
                setP({
                  ...p,
                  [k]: e.target.value,
                })
              }
            />
          </label>
        ))}
      </div>

      <button
        onClick={() =>
          api
            .put("/prayer-timings", p)
            .then(() =>
              toast.success("Prayer timings updated")
            )
            .catch((e) =>
              toast.error(formatError(e))
            )
        }
        className="btn-primary-green mt-6 px-6 py-3 rounded-full flex gap-2"
      >
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  );
}

/* =========================
   APPLICATIONS
========================= */

function Applications() {
  const [a, setA] = useState([]);
  const [viewId, setViewId] = useState(null);
  const [roomDrafts, setRoomDrafts] = useState({});
  const [savingRoom, setSavingRoom] = useState(null);
  const [selectedPrint, setSelectedPrint] = useState(null);

  const load = () =>
    api
      .get("/hostel/applications")
      .then((r) => setA(r.data || []))
      .catch((e) => toast.error(formatError(e)));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const afterPrint = () => setSelectedPrint(null);

    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  const saveRoom = async (x) => {
    const roomNo = (roomDrafts[x.id] ?? x.room_no ?? "").trim();

    if (!roomNo) {
      toast.error("Please enter a Room No.");
      return;
    }

    try {
      setSavingRoom(x.id);

      await api.patch(`/hostel/applications/${x.id}`, {
        room_no: roomNo,
      });

      toast.success("Room No. assigned successfully");
      await load();
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setSavingRoom(null);
    }
  };

  const approve = async (x) => {
    const roomNo = (roomDrafts[x.id] ?? x.room_no ?? "").trim();

    if (!roomNo) {
      toast.error(
        "Please assign a Room No. before approving this application."
      );
      return;
    }

    try {
      await api.patch(`/hostel/applications/${x.id}`, {
        room_no: roomNo,
        status: "approved",
      });

      toast.success("Application approved");
      await load();
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const reject = async (id) => {
    try {
      await api.patch(`/hostel/applications/${id}`, {
        status: "rejected",
      });

      toast.success("Application rejected");
      await load();
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Delete this application?")) {
      return;
    }

    try {
      await api.delete(`/hostel/applications/${id}`);
      toast.success("Application deleted");
      load();
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const formatDob = (value) => {
    if (!value) return "-";

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) {
      return value;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const printApplication = (x) => {
    if (x.status !== "approved") {
      toast.error("Only approved applications can be printed.");
      return;
    }

    setSelectedPrint(x);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const selectedView = a.find((x) => x.id === viewId);

  return (
    <div className="applications-screen">
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
      `}</style>

      <div className="no-print">
        <h2 className="font-heading text-3xl text-[#0D3B2E] mb-5">
          Hostel Applications ({a.length})
        </h2>

        <div className="space-y-4">
          {a.map((x) => {
            const status = x.status || "pending";

            const roomNo =
              roomDrafts[x.id] !== undefined
                ? roomDrafts[x.id]
                : x.room_no || "";

            const displayName = x.full_name || x.student_name || "-";
            const collegeName = x.college_name || x.institution || "-";
            const courseName = x.course_name || x.course || "-";

            return (
              <div
                className="card-elegant p-5"
                key={x.id}
              >
                <div className="flex justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="font-heading text-xl text-[#0D3B2E]">
                      {displayName}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {x.email} · {x.mobile} · {courseName} · {x.year}
                    </p>
                  </div>

                  <span
                    className={`text-xs uppercase font-semibold px-3 py-1 rounded-full ${status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-sm mt-3 text-slate-600">
                  Guardian: {x.father_name || "-"} · Room Type:{" "}
                  {x.room_type || "-"}
                </p>

                {status === "pending" && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={roomNo}
                      onChange={(e) =>
                        setRoomDrafts((prev) => ({
                          ...prev,
                          [x.id]: e.target.value,
                        }))
                      }
                      placeholder="Room No. e.g. A-102"
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <button
                      onClick={() => saveRoom(x)}
                      disabled={savingRoom === x.id}
                      className="bg-[#0D3B2E] text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <DoorOpen className="w-4 h-4" />
                      {savingRoom === x.id
                        ? "Saving..."
                        : "Assign Room"}
                    </button>
                  </div>
                )}

                {status !== "pending" && (
                  <div className="mt-3 text-sm">
                    <span className="font-semibold text-slate-700">
                      Room No.:
                    </span>{" "}
                    <span className="text-[#0D3B2E] font-semibold">
                      {x.room_no || "-"}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => setViewId(x.id)}
                    className="border border-slate-300 px-3 py-1.5 rounded-full text-xs flex gap-1 items-center"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>

                  {status === "pending" && (
                    <>
                      <button
                        onClick={() => approve(x)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs flex gap-1 items-center"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>

                      <button
                        onClick={() => reject(x.id)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs flex gap-1 items-center"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </>
                  )}

                  {status === "approved" && (
                    <button
                      onClick={() => printApplication(x)}
                      className="bg-[#C5A059] text-white px-3 py-1.5 rounded-full text-xs flex gap-1 items-center"
                    >
                      🖨️ Print
                    </button>
                  )}

                  <button
                    onClick={() => deleteApplication(x.id)}
                    className="border px-3 py-1.5 rounded-full text-xs flex gap-1 items-center"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {a.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No applications found.
          </div>
        )}

        {selectedView && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-heading text-2xl text-[#0D3B2E]">
                  Application Details
                </h3>

                <button
                  onClick={() => setViewId(null)}
                  className="text-slate-500 hover:text-slate-900 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Full Name</span>
                  <p>{selectedView.full_name || selectedView.student_name || "-"}</p>
                </div>

                <div>
                  <span className="font-semibold">Date of Birth</span>
                  <p>{formatDob(selectedView.dob)}</p>
                </div>

                <div>
                  <span className="font-semibold">Mobile</span>
                  <p>{selectedView.mobile || "-"}</p>
                </div>

                <div>
                  <span className="font-semibold">Email</span>
                  <p>{selectedView.email || "-"}</p>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-semibold">Address</span>
                  <p>{selectedView.address || "-"}</p>
                </div>

                <div>
                  <span className="font-semibold">College / Institution</span>
                  <p>
                    {selectedView.college_name ||
                      selectedView.institution ||
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-semibold">Course</span>
                  <p>
                    {selectedView.course_name ||
                      selectedView.course ||
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-semibold">Room No.</span>
                  <p>{selectedView.room_no || "-"}</p>
                </div>

                <div>
                  <span className="font-semibold">Status</span>
                  <p className="uppercase">
                    {selectedView.status || "pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedPrint && (
        <div className="admission-print-record">
          <div
            style={{
              border: "2px solid #0D3B2E",
              minHeight: "269mm",
              padding: "10mm",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                textAlign: "center",
                borderBottom: "3px solid #C5A059",
                paddingBottom: "6mm",
                marginBottom: "8mm",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  color: "#0D3B2E",
                }}
              >
                JAMA MASJID & BOYS' HOSTEL
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#059669",
                }}
              >
                STUDENT ADMISSION RECORD
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "7mm",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#64748b",
                }}
              >
                Admission Status
              </div>

              <div
                style={{
                  background: "#0D3B2E",
                  color: "#fff",
                  padding: "7px 18px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                APPROVED
              </div>
            </div>

            <div
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {[
                [
                  "Full Name",
                  selectedPrint.full_name ||
                  selectedPrint.student_name ||
                  "-",
                ],
                [
                  "Date of Birth",
                  formatDob(selectedPrint.dob),
                ],
                ["Mobile", selectedPrint.mobile || "-"],
                ["Email", selectedPrint.email || "-"],
                ["Address", selectedPrint.address || "-"],
                [
                  "College / Institution",
                  selectedPrint.college_name ||
                  selectedPrint.institution ||
                  "-",
                ],
                [
                  "Course",
                  selectedPrint.course_name ||
                  selectedPrint.course ||
                  "-",
                ],
                ["Room No.", selectedPrint.room_no || "-"],
                ["Status", "APPROVED"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "42% 58%",
                    borderBottom:
                      index === 8
                        ? "none"
                        : "1px solid #e2e8f0",
                    minHeight: "13mm",
                  }}
                >
                  <div
                    style={{
                      padding: "3.5mm",
                      background: "#f8fafc",
                      fontWeight: "700",
                      fontSize: "11px",
                      color: "#475569",
                    }}
                  >
                    {label}
                  </div>

                  <div
                    style={{
                      padding: "3.5mm",
                      fontSize: "12px",
                      color: "#0f172a",
                      wordBreak: "break-word",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "22mm",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "25mm",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderTop: "1px solid #334155",
                    paddingTop: "3mm",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  Student Signature
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderTop: "1px solid #334155",
                    paddingTop: "3mm",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  Hostel Administrator
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "12mm",
                left: "14mm",
                right: "14mm",
                borderTop: "1px solid #cbd5e1",
                paddingTop: "4mm",
                textAlign: "center",
                fontSize: "9px",
                color: "#64748b",
              }}
            >
              This is an official hostel admission record.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   EVENTS
========================= */

function Events() {
  const [e, setE] = useState([]);

  const [f, setF] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    category: "General",
  });

  const load = () =>
    api
      .get("/events")
      .then((r) => setE(r.data || []))
      .catch((x) => toast.error(formatError(x)));

  useEffect(() => {
    load();
  }, []);

  const addEvent = async (ev) => {
    ev.preventDefault();

    try {
      await api.post("/events", f);

      setF({
        title: "",
        description: "",
        date: "",
        time: "",
        category: "General",
      });

      await load();

      toast.success("Event added");
    } catch (x) {
      toast.error(formatError(x));
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      await load();
      toast.success("Event deleted");
    } catch (x) {
      toast.error(formatError(x));
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form
        className="card-elegant p-6 space-y-3"
        onSubmit={addEvent}
      >
        <h2 className="font-heading text-2xl text-[#0D3B2E]">
          Add Event
        </h2>

        <input
          required
          type="text"
          className="w-full px-3 py-2.5 rounded-xl border"
          placeholder="Event title"
          value={f.title}
          onChange={(e) =>
            setF({
              ...f,
              title: e.target.value,
            })
          }
        />

        <textarea
          required
          rows="4"
          className="w-full px-3 py-2.5 rounded-xl border"
          placeholder="Description"
          value={f.description}
          onChange={(e) =>
            setF({
              ...f,
              description: e.target.value,
            })
          }
        />

        <input
          required
          type="date"
          className="w-full px-3 py-2.5 rounded-xl border"
          value={f.date}
          onChange={(e) =>
            setF({
              ...f,
              date: e.target.value,
            })
          }
        />

        <input
          type="time"
          className="w-full px-3 py-2.5 rounded-xl border"
          value={f.time}
          onChange={(e) =>
            setF({
              ...f,
              time: e.target.value,
            })
          }
        />

        <input
          required
          type="text"
          className="w-full px-3 py-2.5 rounded-xl border"
          placeholder="Category"
          value={f.category}
          onChange={(e) =>
            setF({
              ...f,
              category: e.target.value,
            })
          }
        />

        <button className="btn-primary-green w-full py-3 rounded-full flex justify-center gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </form>

      <div className="lg:col-span-2 space-y-3">
        {e.map((x) => (
          <div
            className="card-elegant p-5 flex justify-between gap-4"
            key={x.id}
          >
            <div>
              <div className="text-xs text-[#C5A059] uppercase">
                {x.category} · {x.date}
              </div>

              <h3 className="font-heading text-xl text-[#0D3B2E]">
                {x.title}
              </h3>

              <p className="p text-sm">
                {x.description}
              </p>

              {x.time && (
                <div className="text-xs text-slate-500 mt-2">
                  Time: {x.time}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => deleteEvent(x.id)}
            >
              <Trash2 className="text-red-500 w-4 h-4" />
            </button>
          </div>
        ))}

        {e.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   ANNOUNCEMENTS
========================= */

function Announcements() {
  const [a, setA] = useState([]);

  const [f, setF] = useState({
    title: "",
    body: "",
    pinned: false,
  });

  const load = () =>
    api
      .get("/announcements")
      .then((r) => setA(r.data || []))
      .catch((e) => toast.error(formatError(e)));

  useEffect(() => {
    load();
  }, []);

  const publish = async (e) => {
    e.preventDefault();

    try {
      await api.post("/announcements", f);

      setF({
        title: "",
        body: "",
        pinned: false,
      });

      await load();

      toast.success("Published");
    } catch (x) {
      toast.error(formatError(x));
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) {
      return;
    }

    try {
      await api.delete(`/announcements/${id}`);
      await load();
      toast.success("Announcement deleted");
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form
        className="card-elegant p-6 space-y-3"
        onSubmit={publish}
      >
        <h2 className="font-heading text-2xl text-[#0D3B2E]">
          New Announcement
        </h2>

        <input
          required
          className="w-full p-3 rounded-xl border"
          placeholder="Title"
          value={f.title}
          onChange={(e) =>
            setF({
              ...f,
              title: e.target.value,
            })
          }
        />

        <textarea
          required
          rows="4"
          className="w-full p-3 rounded-xl border"
          placeholder="Body"
          value={f.body}
          onChange={(e) =>
            setF({
              ...f,
              body: e.target.value,
            })
          }
        />

        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={f.pinned}
            onChange={(e) =>
              setF({
                ...f,
                pinned: e.target.checked,
              })
            }
          />
          Pin to top
        </label>

        <button className="btn-primary-green w-full py-3 rounded-full">
          Publish
        </button>
      </form>

      <div className="lg:col-span-2 space-y-3">
        {a.map((x) => (
          <div
            className="card-elegant p-5 flex justify-between gap-4"
            key={x.id}
          >
            <div>
              <h3 className="font-heading text-xl text-[#0D3B2E]">
                {x.title}
              </h3>

              <p className="p text-sm">
                {x.body}
              </p>

              {x.pinned && (
                <div className="text-xs text-[#C5A059] font-semibold mt-2">
                  PINNED
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => deleteAnnouncement(x.id)}
            >
              <Trash2 className="text-red-500 w-4 h-4" />
            </button>
          </div>
        ))}

        {a.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No announcements found.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   GALLERY
========================= */

function Gallery() {
  const [g, setG] = useState([]);

  const [f, setF] = useState({
    url: "",
    caption: "",
    category: "Masjid",
  });

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () => {
    api
      .get("/gallery")
      .then((r) => setG(r.data || []))
      .catch((e) => toast.error(formatError(e)));
  };

  useEffect(() => {
    load();
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();

      img.onload = () => {
        const maxWidth = 1600;

        const scale = Math.min(
          1,
          maxWidth / img.width
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.round(
          img.width * scale
        );

        canvas.height = Math.round(
          img.height * scale
        );

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Could not process image");
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const imageData = canvas.toDataURL(
          "image/jpeg",
          0.78
        );

        setF((old) => ({
          ...old,
          url: imageData,
        }));

        setPreview(imageData);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const addImage = async (e) => {
    e.preventDefault();

    if (!f.url) {
      toast.error("Please choose a photo");
      return;
    }

    if (!f.caption.trim()) {
      toast.error("Please enter a caption");
      return;
    }

    setUploading(true);

    try {
      await api.post("/gallery", f);

      setF({
        url: "",
        caption: "",
        category: "Masjid",
      });

      setPreview("");

      const input =
        document.getElementById("gallery-photo");

      if (input) {
        input.value = "";
      }

      await load();

      toast.success("Image added successfully");
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) {
      return;
    }

    try {
      await api.delete(`/gallery/${id}`);

      await load();

      toast.success("Image deleted");
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  return (
    <div>
      <form
        className="card-elegant p-5 mb-6"
        onSubmit={addImage}
      >
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label
              htmlFor="gallery-photo"
              className="block cursor-pointer border-2 border-dashed border-[#C5A059]/50 rounded-2xl p-5 text-center hover:bg-[#C5A059]/5 transition"
            >
              <Image className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />

              <div className="font-semibold text-[#0D3B2E]">
                Choose Photo
              </div>

              <div className="text-xs text-slate-500 mt-1">
                JPG, PNG, WEBP • Max 10 MB
              </div>

              <input
                id="gallery-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhoto}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border mt-3"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D3B2E] mb-1">
              Caption
            </label>

            <input
              required
              className="w-full px-3 py-2.5 rounded-xl border"
              placeholder="e.g. Hostel Room"
              value={f.caption}
              onChange={(e) =>
                setF({
                  ...f,
                  caption: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D3B2E] mb-1">
              Category
            </label>

            <select
              className="w-full px-3 py-2.5 rounded-xl border bg-white"
              value={f.category}
              onChange={(e) =>
                setF({
                  ...f,
                  category: e.target.value,
                })
              }
            >
              <option value="Masjid">Masjid</option>
              <option value="Hostel">Hostel</option>
              <option value="Study">Study</option>
              <option value="Dining">Dining</option>
              <option value="Facilities">Facilities</option>
              <option value="Events">Events</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn-primary-green mt-5 px-6 py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <span>⏳</span>
              Uploading...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Image
            </>
          )}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {g.map((x) => (
          <div
            className="card-elegant overflow-hidden"
            key={x.id}
          >
            <img
              src={x.url}
              alt={x.caption || "Gallery image"}
              className="aspect-square w-full object-cover"
            />

            <div className="p-3 flex justify-between items-center text-sm gap-3">
              <div>
                <div className="font-medium">
                  {x.caption}
                </div>

                <div className="text-xs text-slate-500">
                  {x.category || "Masjid"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteImage(x.id)}
              >
                <Trash2 className="text-red-500 w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {g.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No gallery images found.
        </div>
      )}
    </div>
  );
}

/* =========================
   HOSTEL
========================= */

function Hostel() {
  const emptyRoom = {
    name: "",
    price: "",
    description: "",
    image: "",
    features: "",
  };

  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRoom);

  const loadRooms = async () => {
    try {
      const res = await api.get("/hostel/rooms");
      setRooms(res.data || []);
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();

      img.onload = () => {
        const maxWidth = 1600;

        const scale = Math.min(
          1,
          maxWidth / img.width
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.round(
          img.width * scale
        );

        canvas.height = Math.round(
          img.height * scale
        );

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Could not process image");
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const imageData = canvas.toDataURL(
          "image/jpeg",
          0.78
        );

        setForm((old) => ({
          ...old,
          image: imageData,
        }));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const startEdit = (room) => {
    setEditing(room.id);

    setForm({
      name: room.name || "",
      price: room.price || "",
      description: room.description || "",
      image: room.image || "",
      features: Array.isArray(room.features)
        ? room.features.join(", ")
        : "",
    });

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ ...emptyRoom });

    const input =
      document.getElementById("hostel-room-photo");

    if (input) {
      input.value = "";
    }
  };

  const saveRoom = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter room name");
      return;
    }

    if (!form.price.trim()) {
      toast.error("Please enter room price");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please enter room description");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: form.price.trim(),
      description: form.description.trim(),
      image: form.image || "",
      features: form.features
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await api.put(
          `/hostel/rooms/${editing}`,
          payload
        );

        toast.success("Room updated successfully");
      } else {
        await api.post(
          "/hostel/rooms",
          payload
        );

        toast.success("Room added successfully");
      }

      resetForm();
      await loadRooms();
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this hostel room?")) {
      return;
    }

    try {
      await api.delete(`/hostel/rooms/${id}`);

      toast.success("Room deleted");

      if (editing === id) {
        resetForm();
      }

      await loadRooms();
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  return (
    <div>
      <form
        onSubmit={saveRoom}
        className="card-elegant p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-5 gap-4">
          <div>
            <h2 className="font-heading text-2xl text-[#0D3B2E]">
              {editing
                ? "Edit Hostel Room"
                : "Add Hostel Room"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage room name, price, details and photo.
            </p>
          </div>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-full border text-sm"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-1">
              Room Name
            </label>

            <input
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="e.g. Single Room"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-1">
              Price
            </label>

            <input
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="e.g. ₹ 8,000 / mo"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-1">
              Description
            </label>

            <textarea
              rows="3"
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Describe the room..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-1">
              Features
            </label>

            <input
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Private room, Study table, Storage"
              value={form.features}
              onChange={(e) =>
                setForm({
                  ...form,
                  features: e.target.value,
                })
              }
            />

            <p className="text-xs text-slate-500 mt-1">
              Separate features with commas.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-2">
              Room Photo
            </label>

            <label
              htmlFor="hostel-room-photo"
              className="block cursor-pointer border-2 border-dashed border-[#C5A059]/50 rounded-2xl p-5 text-center hover:bg-[#C5A059]/5 transition"
            >
              <Bed className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />

              <div className="font-semibold text-[#0D3B2E]">
                Choose Room Photo
              </div>

              <div className="text-xs text-slate-500 mt-1">
                JPG, PNG, WEBP • Max 10 MB
              </div>

              <input
                id="hostel-room-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhoto}
              />
            </label>

            {form.image && (
              <img
                src={form.image}
                alt="Room preview"
                className="w-full max-w-md h-48 object-cover rounded-xl border mt-3"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary-green mt-6 px-6 py-3 rounded-full flex items-center gap-2"
        >
          {editing ? (
            <>
              <Save className="w-4 h-4" />
              Update Room
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Room
            </>
          )}
        </button>
      </form>

      <div>
        <h2 className="font-heading text-2xl text-[#0D3B2E] mb-5">
          Existing Hostel Rooms
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="card-elegant overflow-hidden bg-white"
            >
              {room.image ? (
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-[#E6F4F0] grid place-items-center">
                  <Bed className="w-14 h-14 text-[#C5A059]" />
                </div>
              )}

              <div className="p-5">
                <h3 className="font-heading text-xl text-[#0D3B2E]">
                  {room.name}
                </h3>

                <div className="text-[#C5A059] font-semibold mt-1">
                  {room.price}
                </div>

                <p className="text-sm text-slate-600 mt-3">
                  {room.description}
                </p>

                {room.features?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {room.features.map(
                      (feature, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 rounded-full bg-[#E6F4F0] text-[#0D3B2E]"
                        >
                          {feature}
                        </span>
                      )
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => startEdit(room)}
                    className="flex-1 px-4 py-2.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] hover:bg-[#E6F4F0]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteRoom(room.id)}
                    className="px-4 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hostel rooms found.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   FACILITIES
========================= */

function Facilities() {
  const [facilities, setFacilities] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "Building2",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFacilities();
  }, []);

  async function loadFacilities() {
    try {
      const res = await api.get("/facilities");
      setFacilities(res.data || []);
    } catch (e) {
      toast.error(formatError(e));
    }
  }

  function chooseImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();

      img.onload = () => {
        const maxWidth = 1600;

        const scale = Math.min(
          1,
          maxWidth / img.width
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.round(
          img.width * scale
        );

        canvas.height = Math.round(
          img.height * scale
        );

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Could not process image");
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const imageData = canvas.toDataURL(
          "image/jpeg",
          0.78
        );

        setForm((old) => ({
          ...old,
          image: imageData,
        }));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  async function saveFacility(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Facility title required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon,
        image: form.image || "",
      };

      if (editingId) {
        await api.put(
          `/facilities/${editingId}`,
          payload
        );

        toast.success("Facility updated");
      } else {
        await api.post(
          "/facilities",
          payload
        );

        toast.success("Facility added");
      }

      resetFacilityForm();

      await loadFacilities();
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setSaving(false);
    }
  }

  function editFacility(item) {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      description: item.description || "",
      icon: item.icon || "Building2",
      image: item.image || "",
    });

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  }

  function resetFacilityForm() {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      icon: "Building2",
      image: "",
    });

    const input =
      document.getElementById("facility-photo");

    if (input) {
      input.value = "";
    }
  }

  async function deleteFacility(id) {
    if (!window.confirm("Delete this facility?")) {
      return;
    }

    try {
      await api.delete(`/facilities/${id}`);

      toast.success("Facility deleted");

      if (editingId === id) {
        resetFacilityForm();
      }

      await loadFacilities();
    } catch (e) {
      toast.error(formatError(e));
    }
  }

  return (
    <div>
      <form
        onSubmit={saveFacility}
        className="card-elegant p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#E6F4F0] grid place-items-center">
            <Building2 className="text-[#059669]" />
          </div>

          <div>
            <h2 className="font-heading text-2xl text-[#0D3B2E]">
              {editingId
                ? "Edit Facility"
                : "Add Facility"}
            </h2>

            <p className="text-sm text-slate-500">
              Manage facilities shown on the website.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Facility Title
            </label>

            <input
              required
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="e.g. Jama Masjid"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Icon
            </label>

            <select
              className="w-full px-4 py-3 rounded-xl border bg-white"
              value={form.icon}
              onChange={(e) =>
                setForm({
                  ...form,
                  icon: e.target.value,
                })
              }
            >
              <option value="Building2">
                Building
              </option>

              <option value="Bed">
                Hostel / Bed
              </option>

              <option value="BookOpen">
                Study
              </option>

              <option value="Utensils">
                Dining
              </option>

              <option value="Library">
                Library
              </option>

              <option value="Wifi">
                Wi-Fi
              </option>

              <option value="Droplet">
                Water
              </option>

              <option value="Shield">
                Security
              </option>

              <option value="HeartPulse">
                Medical
              </option>

              <option value="Users">
                Common Room
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>

            <textarea
              required
              rows="4"
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Describe this facility..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Facility Photo
            </label>

            <input
              id="facility-photo"
              type="file"
              accept="image/*"
              onChange={chooseImage}
              className="w-full px-4 py-3 rounded-xl border"
            />
          </div>

          {form.image && (
            <div className="md:col-span-2">
              <img
                src={form.image}
                alt="Facility preview"
                className="w-full max-w-md h-48 object-cover rounded-xl border"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary-green px-6 py-3 rounded-full flex items-center gap-2 disabled:opacity-50"
          >
            {editingId ? (
              <>
                <Save className="w-4 h-4" />

                {saving
                  ? "Updating..."
                  : "Update Facility"}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />

                {saving
                  ? "Adding..."
                  : "Add Facility"}
              </>
            )}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetFacilityForm}
              className="px-6 py-3 rounded-full border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="font-heading text-2xl text-[#0D3B2E] mb-5">
        Existing Facilities
      </h2>

      {facilities.length === 0 ? (
        <div className="card-elegant p-10 text-center text-slate-500">
          No facilities added yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((item) => (
            <div
              key={item.id}
              className="card-elegant overflow-hidden bg-white"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-[#E6F4F0] grid place-items-center">
                  <Building2 className="w-14 h-14 text-[#C5A059]" />
                </div>
              )}

              <div className="p-5">
                <h3 className="font-heading text-xl text-[#0D3B2E]">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  {item.description}
                </p>

                <div className="flex gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() =>
                      editFacility(item)
                    }
                    className="flex-1 px-4 py-2.5 rounded-full border"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteFacility(item.id)
                    }
                    className="px-4 py-2.5 rounded-full bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   MOSQUE STAFF
========================= */

function Staff() {
  const emptyStaff = {
    name: "",
    role: "",
    introduction: "",
    image: "",
  };

  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(emptyStaff);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      const res = await api.get("/staff");
      setStaff(res.data || []);
    } catch (e) {
      toast.error(formatError(e));
    }
  }

  function chooseStaffPhoto(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();

      img.onload = () => {
        const maxWidth = 1200;

        const scale = Math.min(
          1,
          maxWidth / img.width
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.max(
          1,
          Math.round(img.width * scale)
        );

        canvas.height = Math.max(
          1,
          Math.round(img.height * scale)
        );

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Could not process image");
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const imageData = canvas.toDataURL(
          "image/jpeg",
          0.78
        );

        setForm((old) => ({
          ...old,
          image: imageData,
        }));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  function editStaff(item) {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      role: item.role || "",
      introduction: item.introduction || "",
      image: item.image || "",
    });

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  }

  function resetStaffForm() {
    setEditingId(null);

    setForm({
      ...emptyStaff,
    });

    const input =
      document.getElementById("staff-photo");

    if (input) {
      input.value = "";
    }
  }

  async function saveStaff(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter staff name");
      return;
    }

    if (!form.role.trim()) {
      toast.error("Please enter staff role");
      return;
    }

    if (!form.introduction.trim()) {
      toast.error("Please enter a short introduction");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        introduction: form.introduction.trim(),
        image: form.image || "",
      };

      if (editingId) {
        await api.put(
          `/staff/${editingId}`,
          payload
        );

        toast.success("Staff member updated successfully");
      } else {
        await api.post(
          "/staff",
          payload
        );

        toast.success("Staff member added successfully");
      }

      resetStaffForm();
      await loadStaff();
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setSaving(false);
    }
  }

  async function deleteStaff(id) {
    if (
      !window.confirm(
        "Delete this mosque staff member?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/staff/${id}`);

      if (editingId === id) {
        resetStaffForm();
      }

      await loadStaff();

      toast.success("Staff member deleted");
    } catch (e) {
      toast.error(formatError(e));
    }
  }

  return (
    <div>
      {/* STAFF FORM */}

      <form
        onSubmit={saveStaff}
        className="card-elegant p-6 mb-8"
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading text-2xl text-[#0D3B2E]">
              {editingId
                ? "Edit Mosque Staff"
                : "Add Mosque Staff"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage Imam, Muazzin and Caretaker information
              shown on the website.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetStaffForm}
              className="px-4 py-2 rounded-full border text-sm"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* NAME */}

          <div>
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-2">
              Name
            </label>

            <input
              required
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="e.g. Maulana Ahmed Sahib"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          {/* ROLE */}

          <div>
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-2">
              Role
            </label>

            <input
              required
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="e.g. Imam & Khatib"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            />
          </div>

          {/* INTRODUCTION */}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-2">
              Short Introduction
            </label>

            <textarea
              required
              maxLength={500}
              rows="5"
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Write a short introduction about this person..."
              value={form.introduction}
              onChange={(e) =>
                setForm({
                  ...form,
                  introduction: e.target.value,
                })
              }
            />

            <div className="text-xs text-slate-500 mt-1">
              Maximum 500 characters.
            </div>
          </div>

          {/* PHOTO */}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0D3B2E] mb-2">
              Photo
            </label>

            <label
              htmlFor="staff-photo"
              className="block cursor-pointer border-2 border-dashed border-[#C5A059]/50 rounded-2xl p-6 text-center hover:bg-[#C5A059]/5 transition"
            >
              <Users className="w-9 h-9 mx-auto mb-2 text-[#C5A059]" />

              <div className="font-semibold text-[#0D3B2E]">
                Choose Staff Photo
              </div>

              <div className="text-xs text-slate-500 mt-1">
                JPG, PNG, WEBP • Max 10 MB
              </div>

              <input
                id="staff-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={chooseStaffPhoto}
              />
            </label>

            {form.image && (
              <div className="mt-4">
                <img
                  src={form.image}
                  alt="Staff preview"
                  className="w-48 h-48 object-cover rounded-2xl border shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* SAVE BUTTON */}

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary-green px-6 py-3 rounded-full flex items-center gap-2 disabled:opacity-50"
          >
            {editingId ? (
              <>
                <Save className="w-4 h-4" />
                {saving
                  ? "Updating..."
                  : "Update Staff"}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {saving
                  ? "Adding..."
                  : "Add Staff"}
              </>
            )}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetStaffForm}
              className="px-6 py-3 rounded-full border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* STAFF LIST */}

      <h2 className="font-heading text-2xl text-[#0D3B2E] mb-5">
        Mosque Leadership & Staff
      </h2>

      {staff.length === 0 ? (
        <div className="card-elegant p-10 text-center text-slate-500">
          No mosque staff added yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map((item) => (
            <div
              key={item.id}
              className="card-elegant overflow-hidden bg-white"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-[#E6F4F0] grid place-items-center">
                  <Users className="w-20 h-20 text-[#C5A059]" />
                </div>
              )}

              <div className="p-5">
                <div className="text-xs uppercase tracking-wide text-[#C5A059] font-semibold">
                  {item.role}
                </div>

                <h3 className="font-heading text-2xl text-[#0D3B2E] mt-1">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-600 mt-3 leading-6">
                  {item.introduction}
                </p>

                <div className="flex gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => editStaff(item)}
                    className="flex-1 px-4 py-2.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] hover:bg-[#E6F4F0]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteStaff(item.id)
                    }
                    className="px-4 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   CONTACT
========================= */

function Contact() {
  const [c, setC] = useState();
  const [m, setM] = useState([]);

  useEffect(() => {
    api
      .get("/contact-info")
      .then((r) => setC(r.data))
      .catch((e) => toast.error(formatError(e)));

    api
      .get("/contact-messages")
      .then((r) => setM(r.data || []))
      .catch((e) => toast.error(formatError(e)));
  }, []);

  if (!c) {
    return <div>Loading…</div>;
  }

  const saveContact = async () => {
    try {
      await api.put("/contact-info", c);
      toast.success("Contact information saved");
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) {
      return;
    }

    try {
      await api.delete(`/contact-messages/${id}`);

      setM((old) =>
        old.filter((item) => item.id !== id)
      );

      toast.success("Message deleted");
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card-elegant p-6 space-y-3">
        <h2 className="font-heading text-2xl text-[#0D3B2E]">
          Contact Information
        </h2>

        {[
          ["mosque_address", "Mosque Address"],
          ["hostel_address", "Hostel Address"],
          ["phone", "Phone"],
          ["email", "Email"],
          ["office_hours", "Office Hours"],
          ["maps_embed", "Google Maps Embed URL"],
          ["facebook", "Facebook URL"],
          ["instagram", "Instagram URL"],
          ["twitter", "Twitter / X URL"],
          ["youtube", "YouTube URL"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-[#0D3B2E] mb-1">
              {label}
            </label>

            <input
              className="w-full p-2.5 rounded-xl border"
              value={c[key] || ""}
              onChange={(e) =>
                setC({
                  ...c,
                  [key]: e.target.value,
                })
              }
            />
          </div>
        ))}

        <button
          onClick={saveContact}
          className="btn-primary-green w-full py-3 rounded-full flex justify-center items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Contact Information
        </button>
      </div>

      <div>
        <h2 className="font-heading text-2xl text-[#0D3B2E] mb-3">
          Contact Messages ({m.length})
        </h2>

        <div className="space-y-3">
          {m.map((x) => (
            <div
              className="card-elegant p-4"
              key={x.id}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <b>{x.name}</b>

                  <div className="text-xs text-slate-500">
                    {x.email} · {x.subject}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    deleteMessage(x.id)
                  }
                >
                  <Trash2 className="text-red-500 w-4 h-4" />
                </button>
              </div>

              <p className="p text-sm mt-2">
                {x.message}
              </p>
            </div>
          ))}
        </div>

        {m.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No contact messages.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   VISITOR REVIEWS
========================= */

function VisitorReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);

      const res = await api.get("/reviews/admin");

      setReviews(res.data || []);
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/reviews/${id}`, {
        status,
      });

      if (status === "approved") {
        toast.success("Review approved");
      } else if (status === "rejected") {
        toast.success("Review rejected");
      } else {
        toast.success("Review moved to pending");
      }

      await loadReviews();
    } catch (e) {
      toast.error(formatError(e));
    }
  }

  async function deleteReview(id) {
    const confirmed = window.confirm(
      "Delete this review permanently?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/reviews/${id}`);

      toast.success("Review deleted");

      await loadReviews();
    } catch (e) {
      toast.error(formatError(e));
    }
  }

  if (loading) {
    return (
      <div className="card-elegant p-10 text-center">
        <div className="text-slate-500">
          Loading reviews...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#E6F4F0] grid place-items-center">
            <Star className="w-5 h-5 text-[#C5A059]" />
          </div>

          <div>
            <h2 className="font-heading text-3xl text-[#0D3B2E]">
              Visitor Reviews
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Approve, reject or delete visitor reviews submitted
              from the website.
            </p>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {reviews.length === 0 ? (
        <div className="card-elegant p-10 text-center">
          <Star className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />

          <h3 className="font-heading text-2xl text-[#0D3B2E]">
            No reviews yet
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Visitor reviews will appear here after they are
            submitted.
          </p>
        </div>
      ) : (
        /* REVIEWS LIST */
        <div className="space-y-5">
          {reviews.map((item) => {
            const status = item.status || "pending";

            return (
              <div
                key={item.id}
                className="card-elegant p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                  {/* REVIEW CONTENT */}
                  <div className="min-w-0 flex-1">

                    {/* NAME + STATUS */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-2xl font-semibold text-[#0D3B2E]">
                        {item.name}
                      </h3>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : status === "rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* STARS */}
                    <div className="flex items-center gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= Number(item.rating)
                              ? "fill-[#C5A059] text-[#C5A059]"
                              : "text-slate-300"
                            }`}
                        />
                      ))}

                      <span className="text-sm text-slate-500 ml-2">
                        {item.rating}/5
                      </span>
                    </div>

                    {/* REVIEW TEXT */}
                    <p className="text-slate-600 leading-7 mt-4 break-words">
                      {item.review}
                    </p>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap gap-2 shrink-0">

                    {status !== "approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "approved"
                          )
                        }
                        className="px-4 py-2.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition"
                      >
                        Approve
                      </button>
                    )}

                    {status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "rejected"
                          )
                        }
                        className="px-4 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition"
                      >
                        Reject
                      </button>
                    )}

                    {status !== "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "pending"
                          )
                        }
                        className="px-4 py-2.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-semibold transition"
                      >
                        Pending
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteReview(item.id)
                      }
                      className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}