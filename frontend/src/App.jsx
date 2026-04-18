// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing          from "./pages/Landing";
import AuthPage         from "./pages/AuthPage";
import PatientDashboard from "./pages/patient/PatientDashboard";

/* ─────────────────────────────────────────────
   Auth guard — redirects to /auth if no token
───────────────────────────────────────────── */
function PrivateRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
}

/* ─────────────────────────────────────────────
   DashboardWithTab — reads ?tab= from URL and
   passes it as initialTab prop so the dashboard
   can open the correct section immediately.
   
   Usage from Landing / anywhere:
     navigate('/patient/dashboard?tab=symptom-checker')
     navigate('/patient/dashboard?tab=doctors')
     navigate('/patient/dashboard')            ← opens overview
───────────────────────────────────────────── */
function DashboardWithTab() {
  const params   = new URLSearchParams(window.location.search);
  const tabParam = params.get("tab") || "overview";

  // Normalize URL tab slugs → the tab IDs used inside PatientDashboard
  const TAB_MAP = {
    "overview":         "Overview",
    "symptom-checker":  "Symptom Checker",
    "appointments":     "Appointments",
    "medications":      "Medications",
    "records":          "Records",
    "doctors":          "Doctors",
    "settings":         "Settings",
  };

  const initialTab = TAB_MAP[tabParam] || "Overview";
  return <PatientDashboard initialTab={initialTab} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"     element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Legacy login path — redirect to /auth */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />

        {/* Protected patient routes */}
        <Route
          path="/patient/dashboard"
          element={
            <PrivateRoute>
              <DashboardWithTab />
            </PrivateRoute>
          }
        />

        {/* Convenience deep-link routes → redirect to dashboard with tab param */}
        <Route
          path="/patient/symptom-checker"
          element={
            <PrivateRoute>
              <Navigate to="/patient/dashboard?tab=symptom-checker" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <PrivateRoute>
              <Navigate to="/patient/dashboard?tab=doctors" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <PrivateRoute>
              <Navigate to="/patient/dashboard?tab=appointments" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/records"
          element={
            <PrivateRoute>
              <Navigate to="/patient/dashboard?tab=records" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/medications"
          element={
            <PrivateRoute>
              <Navigate to="/patient/dashboard?tab=medications" replace />
            </PrivateRoute>
          }
        />

        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
