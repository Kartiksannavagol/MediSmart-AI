// AuthPage.jsx — Fully Responsive
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode]                 = useState("login");
  const [role, setRole]                 = useState("Patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [fullName,  setFullName]        = useState("");
  const [email,     setEmail]           = useState("");
  const [password,  setPassword]        = useState("");
  const [confirm,   setConfirm]         = useState("");
  const [specialty, setSpecialty]       = useState("");
  const [license,   setLicense]         = useState("");
  const [agreed,    setAgreed]          = useState(false);
  const [loading,   setLoading]         = useState(false);
  const [error,     setError]           = useState("");

  const handleSubmit = () => {
    setError("");
    if (!email || !password)  { setError("Please fill in all required fields."); return; }
    if (mode === "signup") {
      if (!fullName)            { setError("Please enter your full name."); return; }
      if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }
      if (password !== confirm)  { setError("Passwords do not match."); return; }
      if (!agreed)               { setError("Please agree to the Terms of Service and Privacy Policy."); return; }
      if (role === "Doctor" && (!specialty || !license)) { setError("Please enter your specialty and medical license number."); return; }
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("token",     "demo_token");
      localStorage.setItem("user_name", fullName || email.split("@")[0]);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_email", email);
      if (role === "Doctor") {
        localStorage.setItem("user_specialty", specialty || "General Physician");
        localStorage.setItem("user_license",   license   || "MD-0000000");
      }
      setLoading(false);
      navigate("/dashboard");
    }, 900);
  };

  const handleKeyDown   = e => { if (e.key === "Enter") handleSubmit(); };
  const handleSocialAuth = provider => {
    localStorage.setItem("token",     `${provider}_token`);
    localStorage.setItem("user_name", provider === "google" ? "Google User" : "Apple User");
    localStorage.setItem("user_role", role);
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .auth-root { font-family: 'DM Sans', system-ui, sans-serif; }
        .heading-serif { font-family: 'DM Serif Display', Georgia, serif; }
        .italic-serif  { font-family: 'DM Serif Display', Georgia, serif; font-style: italic; }
        .auth-input:focus { border-color: #14b8a6 !important; box-shadow: 0 0 0 3px rgba(20,184,166,0.12) !important; outline: none !important; }
        .social-btn:hover { background: #f9fafb !important; }
        .cta-btn:hover { opacity: 0.9; }
      `}</style>

      {/* Full-page wrapper: column on mobile, row on lg+ */}
      <div className="auth-root min-h-screen flex flex-col lg:flex-row bg-[#F5F7FA]">

        {/* ══ LEFT PANEL — hidden on mobile, visible lg+ ══ */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-shrink-0">
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_122893eee-1768046466635.png"
            className="absolute inset-0 w-full h-full object-cover"
            alt="hospital"
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,22,38,0.58)" }}/>
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(8,22,38,0.48) 0%,rgba(8,22,38,0.22) 65%,rgba(8,22,38,0.04) 100%)" }}/>

          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#0d9488,#14b8a6)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9.5" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-base xl:text-lg font-semibold tracking-tight">MediSmart<span style={{ color:"#2dd4bf" }}>AI</span></span>
            </div>

            {/* Hero text */}
            <div>
              <h2 className="heading-serif text-3xl xl:text-[44px] leading-tight mb-4" style={{ fontWeight:700 }}>
                Healthcare that<br/>
                <span className="italic-serif" style={{ color:"#2dd4bf", fontWeight:400 }}>works for you.</span>
              </h2>
              <p className="text-slate-300 text-sm xl:text-[15px] max-w-xs mb-8 xl:mb-10 leading-relaxed">
                AI-powered symptom analysis, verified specialists, and instant booking — all in one secure platform.
              </p>
              <div className="flex gap-3 xl:gap-4 flex-wrap">
                {[["12,400+","Verified Doctors"],["94.7%","AI Accuracy"],["2.8M+","Patients Helped"]].map(([n,l])=>(
                  <div key={l} className="px-3 xl:px-5 py-3 xl:py-3.5 rounded-2xl border border-white/20 backdrop-blur-sm" style={{ background:"rgba(255,255,255,0.07)" }}>
                    <div className="text-sm xl:text-base font-bold">{n}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance badges */}
            <div className="flex gap-5 xl:gap-6 text-xs text-slate-400 flex-wrap">
              {["HIPAA Compliant","256-bit Encryption"].map(txt=>(
                <span key={txt} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {txt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL — full width on mobile, half on lg+ ══ */}
        <div className="flex-1 flex items-start lg:items-center justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-md px-4 sm:px-8 py-8 sm:py-10 lg:py-12">

            {/* Mobile logo — shown only on mobile */}
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"linear-gradient(135deg,#0d9488,#14b8a6)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9.5" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-base font-semibold text-gray-900">MediSmart<span style={{ color:"#14b8a6" }}>AI</span></span>
            </div>

            {/* Mode toggle */}
            <div className="flex bg-[#EEF2F6] rounded-full p-1 mb-6 sm:mb-7">
              {[["login","Log In"],["signup","Sign Up"]].map(([m,lbl])=>(
                <button key={m} onClick={()=>{setMode(m);setError("");}}
                  className="flex-1 py-2 text-xs sm:text-sm font-medium rounded-full transition-all"
                  style={{ background:mode===m?"#fff":"transparent", color:mode===m?"#111827":"#6b7280", boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.1)":"none", fontFamily:"inherit" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Heading */}
            <h1 className="heading-serif text-2xl sm:text-[26px] mb-1.5" style={{ color:"#111827", fontWeight:700 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
              {mode === "login" ? "Enter your credentials to access your dashboard." : "Join 2.8M patients getting smarter healthcare."}
            </p>

            {/* Role selector */}
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">I am a</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
              {[
                { r:"Patient", desc:"Book appointments & check symptoms", icon:(active)=>(
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill={active?"#0d9488":"#9ca3af"}/>
                  </svg>
                )},
                { r:"Doctor", desc:"Manage patients & appointments", icon:(active)=>(
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="4" rx="1" stroke={active?"#0d9488":"#9ca3af"} strokeWidth="1.8" fill="none"/>
                    <path d="M5 6h14v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6z" stroke={active?"#0d9488":"#9ca3af"} strokeWidth="1.8" fill="none"/>
                    <path d="M12 10v6M9 13h6" stroke={active?"#0d9488":"#9ca3af"} strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                )},
              ].map(({ r, desc, icon })=>(
                <div key={r} onClick={()=>setRole(r)}
                  className="p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all"
                  style={{ border:`2px solid ${role===r?"#14b8a6":"#e5e7eb"}`, background:role===r?"rgba(20,184,166,0.04)":"#fff" }}>
                  <div className="mb-1.5">{icon(role===r)}</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">{r}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</div>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-red-600">{error}</div>
            )}

            {/* Form */}
            <div className="space-y-3 sm:space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <input className="auth-input w-full text-xs sm:text-sm" style={inputSt} placeholder="Enter your full name" value={fullName} onChange={e=>setFullName(e.target.value)} onKeyDown={handleKeyDown}/>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#9ca3af" strokeWidth="1.8" fill="none"/><path d="M22 6l-10 7L2 6" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </span>
                  <input className="auth-input w-full text-xs sm:text-sm" style={{ ...inputSt, paddingLeft:34 }} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={handleKeyDown}/>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">Password</label>
                  {mode === "login" && <span className="text-xs text-[#14b8a6] cursor-pointer">Forgot password?</span>}
                </div>
                <div className="relative">
                  <input className="auth-input w-full text-xs sm:text-sm" style={{ ...inputSt, paddingRight:42 }} type={showPassword?"text":"password"} placeholder={mode==="login"?"Enter your password":"Min. 8 characters"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
                  <button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center"><EyeIcon open={showPassword}/></button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input className="auth-input w-full text-xs sm:text-sm" style={{ ...inputSt, paddingRight:42 }} type={showConfirm?"text":"password"} placeholder="Re-enter your password" value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={handleKeyDown}/>
                    <button type="button" onClick={()=>setShowConfirm(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center"><EyeIcon open={showConfirm}/></button>
                  </div>
                </div>
              )}

              {mode === "signup" && role === "Doctor" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Specialty</label>
                    <input className="auth-input w-full text-xs sm:text-sm" style={inputSt} placeholder="e.g. Cardiologist" value={specialty} onChange={e=>setSpecialty(e.target.value)}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Medical License Number</label>
                    <input className="auth-input w-full text-xs sm:text-sm" style={inputSt} placeholder="e.g. MD-1234567" value={license} onChange={e=>setLicense(e.target.value)}/>
                  </div>
                </>
              )}

              {mode === "signup" && (
                <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="mt-0.5 flex-shrink-0" style={{ accentColor:"#14b8a6" }}/>
                  <span>I agree to the <span style={{ color:"#14b8a6",cursor:"pointer" }}>Terms of Service</span> and <span style={{ color:"#14b8a6",cursor:"pointer" }}>Privacy Policy</span></span>
                </label>
              )}

              <button className="cta-btn w-full py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all"
                onClick={handleSubmit} disabled={loading}
                style={{ background:loading?"#9ca3af":"linear-gradient(135deg,#0d9488 0%,#14b8a6 100%)", boxShadow:loading?"none":"0 6px 22px rgba(20,184,166,0.38)", cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>
                {loading ? "Please wait…" : mode==="login" ? (role==="Doctor" ? "Sign In to Doctor Dashboard" : "Sign In to Dashboard") : (role==="Doctor" ? "Create Doctor Account" : "Create Free Account")}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4 sm:my-5">
              <div className="flex-1 h-px bg-gray-200"/>
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200"/>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button className="social-btn flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white transition-all" style={{ fontFamily:"inherit" }} onClick={()=>handleSocialAuth("google")}>
                <svg width="15" height="15" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="social-btn flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white transition-all" style={{ fontFamily:"inherit" }} onClick={()=>handleSocialAuth("apple")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#111827"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </button>
            </div>

            {/* Footer links */}
            <p className="text-center text-xs text-gray-500 mt-4 sm:mt-5">
              {mode === "login"
                ? <>Don't have an account?{" "}<span onClick={()=>{setMode("signup");setError("");}} className="font-semibold cursor-pointer" style={{ color:"#14b8a6" }}>Sign up free</span></>
                : <>Already have an account?{" "}<span onClick={()=>{setMode("login");setError("");}} className="font-semibold cursor-pointer" style={{ color:"#14b8a6" }}>Log in</span></>
              }
            </p>
            <p className="text-center text-xs text-gray-400 mt-2 cursor-pointer hover:text-gray-600 transition" onClick={()=>navigate("/")}>← Back to homepage</p>

          </div>
        </div>
      </div>
    </>
  );
}

const inputSt = {
  width:"100%", padding:"10px 14px",
  border:"1.5px solid #e5e7eb", borderRadius:12,
  fontSize:13, color:"#111827", outline:"none",
  background:"#fff", transition:"border-color 0.15s, box-shadow 0.15s",
  boxSizing:"border-box", fontFamily:"'DM Sans',system-ui,sans-serif",
};

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}