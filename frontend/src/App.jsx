// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing          from "./pages/Landing";
import AuthPage         from "./pages/AuthPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard  from "./pages/doctor/DoctorDashboard";

/* ─────────────────────────────────────────────
   Auth guard — redirects to /auth if no token
───────────────────────────────────────────── */
function PrivateRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
}

/* ─────────────────────────────────────────────
   Role guard — reads user_role and redirects
   to the correct dashboard automatically.
   Used at /dashboard so auth page can just
   navigate('/dashboard') and this handles routing.
───────────────────────────────────────────── */
function RoleRoute() {
  const role = localStorage.getItem("user_role");
  if (role === "Doctor") return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/dashboard" replace />;
}

/* ─────────────────────────────────────────────
   Patient dashboard with ?tab= URL param support
───────────────────────────────────────────── */
function DashboardWithTab() {
  const params   = new URLSearchParams(window.location.search);
  const tabParam = params.get("tab") || "overview";

  const TAB_MAP = {
    "overview":         "Overview",
    "symptom-checker":  "Symptom Checker",
    "appointments":     "Appointments",
    "medications":      "Medications",
    "records":          "Records",
    "doctors":          "Doctors",
    "settings":         "Settings",
  };

  return <PatientDashboard initialTab={TAB_MAP[tabParam] || "Overview"} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/"     element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login"  element={<Navigate to="/auth" replace />} />
        <Route path="/signup" element={<Navigate to="/auth" replace />} />

        {/* ── Smart redirect after login — auto-routes by role ── */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><RoleRoute /></PrivateRoute>}
        />

        {/* ── Patient routes ── */}
        <Route
          path="/patient/dashboard"
          element={<PrivateRoute><DashboardWithTab /></PrivateRoute>}
        />
        <Route path="/patient/symptom-checker" element={<PrivateRoute><Navigate to="/patient/dashboard?tab=symptom-checker" replace /></PrivateRoute>} />
        <Route path="/patient/doctors"         element={<PrivateRoute><Navigate to="/patient/dashboard?tab=doctors"         replace /></PrivateRoute>} />
        <Route path="/patient/appointments"    element={<PrivateRoute><Navigate to="/patient/dashboard?tab=appointments"    replace /></PrivateRoute>} />
        <Route path="/patient/records"         element={<PrivateRoute><Navigate to="/patient/dashboard?tab=records"         replace /></PrivateRoute>} />
        <Route path="/patient/medications"     element={<PrivateRoute><Navigate to="/patient/dashboard?tab=medications"     replace /></PrivateRoute>} />

        {/* ── Doctor routes ── */}
        <Route
          path="/doctor/dashboard"
          element={<PrivateRoute><DoctorDashboard /></PrivateRoute>}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;