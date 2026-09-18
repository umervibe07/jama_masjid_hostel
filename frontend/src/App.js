import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import About from "@/pages/About";
import PrayerTimings from "@/pages/PrayerTimings";

import Hostel from "@/pages/Hostel";
import Admission from "@/pages/Admission";
import Rules from "@/pages/Rules";
import Facilities from "@/pages/Facilities";
import HostelRooms from "@/pages/HostelRooms";
import HostelComplaint from "@/pages/HostelComplaint";
import HostelContact from "@/pages/HostelContact";

import Gallery from "@/pages/Gallery";
import Events from "@/pages/Events";
import Contact from "@/pages/Contact";

import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

import QuranReader from "@/pages/QuranReader";
import QuranAudio from "@/pages/QuranAudio";

function Layout() {
  return (
    <>
      <Navbar />

      <main className="min-h-[70vh]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

function Protected() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        Loading…
      </div>
    );
  }

  return user ? (
    <AdminDashboard />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />

        <Routes>

          {/* =========================
              MAIN JAMA MASJID WEBSITE
              ========================= */}

          <Route element={<Layout />}>

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route
              path="/prayer-timings"
              element={<PrayerTimings />}
            />

            <Route
              path="/gallery"
              element={<Gallery />}
            />

            <Route
              path="/events"
              element={<Events />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            {/* Qur'an */}
            <Route
              path="/quran/read/:type"
              element={<QuranReader />}
            />

            <Route
              path="/quran/listen"
              element={<QuranAudio />}
            />

            {/* =========================
                PRIVATE BOYS HOSTEL
                ========================= */}

            <Route
              path="/private-hostel"
              element={<Hostel />}
            />

            <Route
              path="/private-hostel/facilities"
              element={<Facilities />}
            />

            <Route
              path="/private-hostel/admission"
              element={<Admission />}
            />

            <Route
              path="/private-hostel/rules"
              element={<Rules />}
            />

            <Route
  path="/private-hostel/rooms"
  element={<HostelRooms />}
/>

            <Route
              path="/private-hostel/contact"
              element={<HostelContact />}
            />

            <Route
              path="/private-hostel/complaint"
              element={<HostelComplaint />}
            />

          </Route>

          {/* =========================
              ADMIN
              ========================= */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={<Protected />}
          />

          {/* =========================
              FALLBACK
              ========================= */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}