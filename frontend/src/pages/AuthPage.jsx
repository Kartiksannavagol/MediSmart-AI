// AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode]               = useState("login");
  const [role, setRole]               = useState("Patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  // Form fields
  const [fullName,  setFullName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [specialty, setSpecialty] = useState("");
  const [license,   setLicense]   = useState("");
  const [agreed,    setAgreed]    = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* ── Auth handler ────────────────────────────
     After success:
       - stores token, user_name, user_role in localStorage
       - navigates to /dashboard
       - App.jsx RoleRoute reads user_role and redirects to:
           Doctor  → /doctor/dashboard
           Patient → /patient/dashboard
  ─────────────────────────────────────────── */
  const handleSubmit = () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "signup") {
      if (!fullName)          { setError("Please enter your full name."); return; }
      if (password.length < 8){ setError("Password must be at least 8 characters."); return; }
      if (password !== confirm){ setError("Passwords do not match."); return; }
      if (!agreed)            { setError("Please agree to the Terms of Service and Privacy Policy."); return; }
      if (role === "Doctor" && (!specialty || !license)) {
        setError("Please enter your specialty and medical license number.");
        return;
      }
    }

    setLoading(true);

    // Simulate API call — replace with real auth logic
    setTimeout(() => {
      // Persist auth info
      localStorage.setItem("token",      "demo_token");
      localStorage.setItem("user_name",  fullName || email.split("@")[0]);
      localStorage.setItem("user_role",  role);               // "Patient" | "Doctor"
      localStorage.setItem("user_email", email);
      if (role === "Doctor") {
        localStorage.setItem("user_specialty", specialty || "General Physician");
        localStorage.setItem("user_license",   license  || "MD-0000000");
      }

      setLoading(false);

      // Navigate to /dashboard — App.jsx RoleRoute handles the split
      navigate("/dashboard");
    }, 900);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  /* ── Social OAuth (demo) ─────────────────── */
  const handleSocialAuth = (provider) => {
    localStorage.setItem("token",     `${provider}_token`);
    localStorage.setItem("user_name", provider === "google" ? "Google User" : "Apple User");
    localStorage.setItem("user_role", role);   // keeps whichever role tab is selected
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .auth-root { font-family: 'DM Sans', system-ui, sans-serif; }
        .heading-serif { font-family: 'DM Serif Display', Georgia, 'Times New Roman', serif; }
        .italic-serif  { font-family: 'DM Serif Display', Georgia, serif; font-style: italic; }
        .input-field:focus { border-color: #14b8a6 !important; box-shadow: 0 0 0 3px rgba(20,184,166,0.12); outline: none; }
        .social-btn:hover { background: #f9fafb !important; }
        .cta-btn { transition: opacity 0.15s; }
        .cta-btn:hover { opacity: 0.9; }
      `}</style>

      <div className="auth-root" style={{ minHeight: "100vh", display: "flex", background: "#F5F7FA" }}>

        {/* ══ LEFT PANEL ══ */}
        <div className="hidden lg:flex" style={{ width: "50%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_122893eee-1768046466635.png"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
            alt="hospital"
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,22,38,0.58)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(8,22,38,0.48) 0%,rgba(8,22,38,0.22) 65%,rgba(8,22,38,0.04) 100%)" }} />

          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px", color: "#fff", width: "100%" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#0d9488,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9.5" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.3px" }}>
                MediSmart<span style={{ color: "#2dd4bf" }}>AI</span>
              </span>
            </div>

            {/* Hero */}
            <div>
              <h2 className="heading-serif" style={{ fontSize: 44, lineHeight: 1.15, margin: "0 0 16px", fontWeight: 700 }}>
                Healthcare that<br />
                <span className="italic-serif" style={{ color: "#2dd4bf", fontWeight: 400 }}>works for you.</span>
              </h2>
              <p style={{ color: "#cbd5e1", fontSize: 15, maxWidth: 340, marginBottom: 40, lineHeight: 1.65 }}>
                AI-powered symptom analysis, verified specialists, and instant booking — all in one secure platform.
              </p>
              <div style={{ display: "flex", gap: 14 }}>
                {[["12,400+","Verified Doctors"],["94.7%","AI Accuracy"],["2.8M+","Patients Helped"]].map(([n,l]) => (
                  <div key={l} style={{ padding: "14px 20px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(6px)" }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{n}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance badges */}
            <div style={{ display: "flex", gap: 24, fontSize: 12, color: "#94a3b8" }}>
              {["HIPAA Compliant","256-bit Encryption"].map(txt => (
                <span key={txt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {txt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", background: "#ffffff", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>

            {/* Mode toggle */}
            <div style={{ display: "flex", background: "#EEF2F6", borderRadius: 999, padding: 4, marginBottom: 28 }}>
              {[["login","Log In"],["signup","Sign Up"]].map(([m,lbl]) => (
                <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                  flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 500,
                  borderRadius: 999, border: "none", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                  background: mode === m ? "#ffffff" : "transparent",
                  color:      mode === m ? "#111827" : "#6b7280",
                  boxShadow:  mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Heading */}
            <h1 className="heading-serif" style={{ fontSize: 26, margin: "0 0 6px", color: "#111827", fontWeight: 700 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>
              {mode === "login"
                ? "Enter your credentials to access your dashboard."
                : "Join 2.8M patients and doctors on MediSmart AI."}
            </p>

            {/* Role selector — always visible so user can pick Patient or Doctor */}
            <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: "0 0 10px" }}>I am a</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                {
                  r: "Patient",
                  desc: "Book appointments & check symptoms",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                        fill={role === "Patient" ? "#0d9488" : "#9ca3af"}/>
                    </svg>
                  ),
                },
                {
                  r: "Doctor",
                  desc: "Manage patients & appointments",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="2" width="6" height="4" rx="1"
                        stroke={role === "Doctor" ? "#0d9488" : "#9ca3af"} strokeWidth="1.8" fill="none"/>
                      <path d="M5 6h14v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6z"
                        stroke={role === "Doctor" ? "#0d9488" : "#9ca3af"} strokeWidth="1.8" fill="none"/>
                      <path d="M12 10v6M9 13h6"
                        stroke={role === "Doctor" ? "#0d9488" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                },
              ].map(({ r, desc, icon }) => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "14px 16px", borderRadius: 16, cursor: "pointer",
                    border: `2px solid ${role === r ? "#14b8a6" : "#e5e7eb"}`,
                    background: role === r ? "rgba(20,184,166,0.04)" : "#fff",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#dc2626", marginBottom: 14 }}>
                {error}
              </div>
            )}

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {mode === "signup" && (
                <div>
                  <label style={labelSt}>Full Name</label>
                  <input className="input-field" style={inputSt} placeholder="Enter your full name"
                    value={fullName} onChange={e => setFullName(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
              )}

              <div>
                <label style={labelSt}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#9ca3af" strokeWidth="1.8" fill="none"/>
                      <path d="M22 6l-10 7L2 6" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input className="input-field" type="email" placeholder="you@example.com"
                    style={{ ...inputSt, paddingLeft: 38 }}
                    value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ ...labelSt, marginBottom: 0 }}>Password</label>
                  {mode === "login" && (
                    <span style={{ fontSize: 12, color: "#14b8a6", cursor: "pointer" }}>Forgot password?</span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input className="input-field"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "login" ? "Enter your password" : "Min. 8 characters"}
                    style={{ ...inputSt, paddingRight: 42 }}
                    value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={eyeSt}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label style={labelSt}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input className="input-field"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      style={{ ...inputSt, paddingRight: 42 }}
                      value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={handleKeyDown} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} style={eyeSt}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>
              )}

              {/* Doctor-specific fields */}
              {mode === "signup" && role === "Doctor" && (
                <>
                  <div>
                    <label style={labelSt}>Specialty</label>
                    <input className="input-field" style={inputSt} placeholder="e.g. Cardiologist"
                      value={specialty} onChange={e => setSpecialty(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelSt}>Medical License Number</label>
                    <input className="input-field" style={inputSt} placeholder="e.g. MD-1234567"
                      value={license} onChange={e => setLicense(e.target.value)} />
                  </div>
                </>
              )}

              {mode === "signup" && (
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "#6b7280", cursor: "pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#14b8a6" }} />
                  <span>
                    I agree to the{" "}
                    <span style={{ color: "#14b8a6", cursor: "pointer" }}>Terms of Service</span>{" "}
                    and <span style={{ color: "#14b8a6", cursor: "pointer" }}>Privacy Policy</span>
                  </span>
                </label>
              )}

              <button className="cta-btn" onClick={handleSubmit} disabled={loading} style={{
                width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
                background: loading ? "#9ca3af" : "linear-gradient(135deg,#0d9488 0%,#14b8a6 100%)",
                color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.1px", fontFamily: "inherit",
                boxShadow: loading ? "none" : "0 6px 22px rgba(20,184,166,0.38)",
                transition: "all 0.15s",
              }}>
                {loading
                  ? "Please wait…"
                  : mode === "login"
                    ? (role === "Doctor" ? "Sign In to Doctor Dashboard" : "Sign In to Dashboard")
                    : (role === "Doctor" ? "Create Doctor Account" : "Create Free Account")}
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            {/* Social auth */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button className="social-btn" style={socialSt} onClick={() => handleSocialAuth("google")}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn" style={socialSt} onClick={() => handleSocialAuth("apple")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#111827">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Footer */}
            <p style={{ textAlign: "center", fontSize: 12, marginTop: 20, color: "#6b7280" }}>
              {mode === "login" ? (
                <>Don't have an account?{" "}
                  <span onClick={() => { setMode("signup"); setError(""); }} style={{ color: "#14b8a6", fontWeight: 600, cursor: "pointer" }}>
                    Sign up free
                  </span>
                </>
              ) : (
                <>Already have an account?{" "}
                  <span onClick={() => { setMode("login"); setError(""); }} style={{ color: "#14b8a6", fontWeight: 600, cursor: "pointer" }}>
                    Log in
                  </span>
                </>
              )}
            </p>
            <p style={{ textAlign: "center", fontSize: 12, marginTop: 8, color: "#9ca3af", cursor: "pointer" }}
               onClick={() => navigate("/")}>
              ← Back to homepage
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

/* ── Shared styles ── */
const labelSt = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };

const inputSt = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #e5e7eb", borderRadius: 12,
  fontSize: 13, color: "#111827", outline: "none",
  background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box", fontFamily: "'DM Sans', system-ui, sans-serif",
};

const eyeSt = {
  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer",
  color: "#9ca3af", display: "flex", alignItems: "center", padding: 0,
};

const socialSt = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "10px 0",
  fontSize: 13, fontWeight: 500, color: "#374151",
  background: "#fff", cursor: "pointer", transition: "background 0.15s",
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}