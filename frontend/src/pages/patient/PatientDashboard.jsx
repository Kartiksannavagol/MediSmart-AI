// PatientDashboard.jsx  —  /patient/dashboard
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Search, LogOut, ChevronRight, Plus,
  Check, CheckCircle, X, TrendingUp, TrendingDown, Zap,
} from "lucide-react";

const FONT_LINK = `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap`;

/* ═══════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════ */
const VITALS = [
  { label: "Heart Rate",     value: "72",     unit: "bpm",  trend: +2,   icon: "❤️", color: "#ff6b6b", bg: "rgba(255,107,107,0.1)" },
  { label: "Blood Pressure", value: "118/76", unit: "mmHg", trend: null, icon: "💉", color: "#14b8a6", bg: "rgba(20,184,166,0.1)"   },
  { label: "SpO₂",           value: "98",     unit: "%",    trend: null, icon: "🫁", color: "#3b82f6", bg: "rgba(59,130,246,0.1)"   },
  { label: "Weight",         value: "74",     unit: "kg",   trend: -0.5, icon: "⚖️", color: "#a78bfa", bg: "rgba(167,139,250,0.1)"  },
];

const UPCOMING = [
  { id: 1, doctor: "Dr. Priya Mehta",  specialty: "Cardiologist", date: "Today",  time: "3:30 PM",  mode: "Video",     avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 2, doctor: "Dr. Arjun Patel",  specialty: "Neurologist",  date: "Apr 21", time: "10:00 AM", mode: "In-Person", avatar: "https://randomuser.me/api/portraits/men/54.jpg"   },
  { id: 3, doctor: "Dr. Lisa Chen",    specialty: "Pediatrician", date: "Apr 25", time: "2:00 PM",  mode: "Video",     avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
];

const PAST_VISITS = [
  { id: 4, doctor: "Dr. James Whitfield", specialty: "Cardiologist",  date: "Apr 10", time: "11:00 AM", avatar: "https://randomuser.me/api/portraits/men/32.jpg",   diagnosis: "Hypertension Stage 1", rating: 5 },
  { id: 5, doctor: "Dr. Sofia Reyes",     specialty: "Dermatologist", date: "Mar 28", time: "9:30 AM",  avatar: "https://randomuser.me/api/portraits/women/65.jpg", diagnosis: "Eczema – mild",        rating: 5 },
  { id: 6, doctor: "Dr. Marcus Brown",    specialty: "Orthopedist",   date: "Mar 14", time: "4:00 PM",  avatar: "https://randomuser.me/api/portraits/men/77.jpg",   diagnosis: "Knee strain",          rating: 4 },
];

const INIT_MEDS = [
  { name: "Amlodipine",   dose: "5mg",   freq: "Once daily",   time: "8:00 AM",  taken: true  },
  { name: "Metformin",    dose: "500mg", freq: "Twice daily",  time: "2:00 PM",  taken: false },
  { name: "Atorvastatin", dose: "20mg",  freq: "Once nightly", time: "10:00 PM", taken: false },
];

const REPORTS = [
  { name: "Blood Panel – Complete",   date: "Apr 10", type: "Lab",     icon: "🧪" },
  { name: "ECG Report",               date: "Apr 10", type: "Cardiac", icon: "💓" },
  { name: "Chest X-Ray",              date: "Mar 28", type: "Imaging", icon: "🫁" },
  { name: "Dermatology Consultation", date: "Mar 28", type: "Report",  icon: "📋" },
];

const NOTIFICATIONS = [
  { id: 1, text: "Dr. Priya confirmed your appointment for Today 3:30 PM", time: "10 min ago", read: false },
  { id: 2, text: "Your blood panel report is ready to view",               time: "1 hr ago",   read: false },
  { id: 3, text: "Reminder: Metformin 500mg due at 2:00 PM",              time: "2 hrs ago",  read: true  },
];

const AI_TIP = { text: "Your BP of 118/76 is excellent. Keep your low-sodium diet going strong.", icon: "💪" };

const ALL_DOCTORS = [
  { name: "Dr. Priya Mehta",     specialty: "Cardiologist",   rating: 4.9, reviews: 312, next: "Today 3:30 PM",     img: "https://randomuser.me/api/portraits/women/44.jpg", exp: "14 yrs", fee: "$120" },
  { name: "Dr. James Whitfield", specialty: "Cardiologist",   rating: 4.8, reviews: 201, next: "Today 5:00 PM",     img: "https://randomuser.me/api/portraits/men/32.jpg",   exp: "18 yrs", fee: "$140" },
  { name: "Dr. Sofia Reyes",     specialty: "Dermatologist",  rating: 4.9, reviews: 178, next: "Tomorrow 10:00 AM", img: "https://randomuser.me/api/portraits/women/65.jpg", exp: "10 yrs", fee: "$110" },
  { name: "Dr. Arjun Patel",     specialty: "Neurologist",    rating: 4.7, reviews: 145, next: "Today 6:30 PM",     img: "https://randomuser.me/api/portraits/men/54.jpg",   exp: "12 yrs", fee: "$160" },
  { name: "Dr. Lisa Chen",       specialty: "Pediatrician",   rating: 5.0, reviews: 263, next: "Today 4:00 PM",     img: "https://randomuser.me/api/portraits/women/22.jpg", exp: "9 yrs",  fee: "$95"  },
  { name: "Dr. Marcus Brown",    specialty: "Orthopedist",    rating: 4.8, reviews: 187, next: "Tomorrow 9:00 AM",  img: "https://randomuser.me/api/portraits/men/77.jpg",   exp: "16 yrs", fee: "$130" },
  { name: "Dr. Nisha Kapoor",    specialty: "Neurologist",    rating: 4.6, reviews: 87,  next: "Apr 22, 2:15 PM",  img: "https://randomuser.me/api/portraits/women/33.jpg", exp: "8 yrs",  fee: "$145" },
  { name: "Dr. Anand Mathur",    specialty: "Ophthalmologist",rating: 4.7, reviews: 112, next: "Apr 25, 11:30 AM", img: "https://randomuser.me/api/portraits/men/41.jpg",   exp: "11 yrs", fee: "$105" },
];

const SPECIALTIES = ["All", "Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "Orthopedist", "Ophthalmologist"];

const TABS = ["Overview", "Symptom Checker", "Appointments", "Medications", "Records", "Doctors", "Settings"];

const NOTIF_ITEMS = [
  { key: "appointments", label: "Appointment reminders" },
  { key: "medications",  label: "Medication alerts"     },
  { key: "insights",     label: "AI health insights"    },
  { key: "promo",        label: "Promotional emails"    },
];

/* ═══════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════ */
function NavPill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 11, fontSize: 13,
      fontWeight: active ? 700 : 500,
      border: "none", cursor: "pointer", transition: "all 0.18s",
      background: active ? "#fff" : "transparent",
      color: active ? "#0f172a" : "#94a3b8",
      boxShadow: active ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
      whiteSpace: "nowrap", fontFamily: "inherit",
    }}>
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: "24px",
      border: "1px solid #f1f5f9",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={{
          fontSize: 12, color: "#14b8a6", fontWeight: 700,
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 3, fontFamily: "inherit",
        }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

function StatCard({ v }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: "22px 24px",
      border: "1px solid #f1f5f9",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          {v.icon}
        </div>
        {v.trend !== null ? (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
            background: v.trend > 0 ? "rgba(239,68,68,0.1)" : "rgba(22,163,74,0.1)",
            color: v.trend > 0 ? "#ef4444" : "#16a34a",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            {v.trend > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {v.trend > 0 ? "+" : ""}{v.trend} {v.unit === "kg" ? "kg" : "%"}
          </span>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "rgba(20,184,166,0.1)", color: "#0d9488" }}>
            Normal
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
        {v.value}
        <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginLeft: 5 }}>{v.unit}</span>
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, fontWeight: 500 }}>{v.label}</div>
    </div>
  );
}

function NotifDropdown({ onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
      <div style={{
        position: "absolute", top: 52, right: 0, zIndex: 99,
        width: 340, background: "#fff",
        borderRadius: 20, border: "1px solid #f1f5f9",
        boxShadow: "0 20px 60px rgba(0,0,0,0.13)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Notifications</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <X size={16} />
          </button>
        </div>
        {NOTIFICATIONS.map(n => (
          <div key={n.id} style={{
            padding: "14px 20px",
            background: n.read ? "#fff" : "#f0fdfa",
            borderBottom: "1px solid #f8fafc",
            display: "flex", gap: 12,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : "#14b8a6", marginTop: 5, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.55, margin: "0 0 3px" }}>{n.text}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{n.time}</p>
            </div>
          </div>
        ))}
        <div style={{ padding: "12px 20px", textAlign: "center" }}>
          <button style={{ fontSize: 12, color: "#0d9488", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   TAB: OVERVIEW
═══════════════════════════════════════ */
function Overview({ navigate, setActiveTab }) {
  const [medList, setMedList] = useState(INIT_MEDS);
  const takenCount = medList.filter(m => m.taken).length;
  const adherePct  = Math.round((takenCount / medList.length) * 100);
  const CIRC       = 2 * Math.PI * 50;
  const dash       = (87 / 100) * CIRC;
  const patientName = localStorage.getItem("user_name") || "Alex Johnson";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Hero banner */}
      <div style={{
        background: "linear-gradient(135deg,#0b1c2c 0%,#0d3347 60%,#083344 100%)",
        borderRadius: 28, padding: "32px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: 180, top: -60,  width: 220, height: 220, borderRadius: "50%", background: "rgba(20,184,166,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 40,  bottom: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(20,184,166,0.05)", pointerEvents: "none" }} />

        <div style={{ zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#14b8a6,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {patientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 500 }}>
                Good {new Date().getHours() < 12 ? "morning" : "afternoon"} 👋
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px", fontFamily: "Georgia, serif" }}>
                {patientName}
              </h2>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 20px", maxWidth: 420, lineHeight: 1.65 }}>
            Your health looks great today. 1 appointment coming up and {medList.length - takenCount} medication{medList.length - takenCount !== 1 ? "s" : ""} due.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setActiveTab("Symptom Checker")} style={{
              background: "#14b8a6", color: "#fff", border: "none", borderRadius: 14,
              padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7,
              boxShadow: "0 6px 20px rgba(20,184,166,0.4)", fontFamily: "inherit",
            }}>
              <Zap size={14} /> Check Symptoms
            </button>
            <button onClick={() => setActiveTab("Doctors")} style={{
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 14, padding: "10px 20px", fontSize: 13,
              fontWeight: 600, cursor: "pointer", backdropFilter: "blur(4px)",
              fontFamily: "inherit",
            }}>
              Book Doctor →
            </button>
          </div>
        </div>

        {/* Health Score Ring */}
        <div style={{ zIndex: 1, textAlign: "center", flexShrink: 0 }}>
          <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="#14b8a6" strokeWidth="10"
                strokeDasharray={`${dash} ${CIRC}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>87</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>score</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 10, fontWeight: 500 }}>Health Score</p>
          <p style={{ fontSize: 11, color: "#2dd4bf", margin: 0, fontWeight: 600 }}>Excellent</p>
        </div>
      </div>

      {/* Vitals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {VITALS.map(v => <StatCard key={v.label} v={v} />)}
      </div>

      {/* Bento grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>

        {/* Upcoming Appointments */}
        <Card>
          <SectionTitle title="Upcoming Appointments" action="View all" onAction={() => setActiveTab("Appointments")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {UPCOMING.map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 18,
                background: a.date === "Today" ? "linear-gradient(135deg,rgba(20,184,166,0.06),rgba(20,184,166,0.02))" : "#fafafa",
                border: `1.5px solid ${a.date === "Today" ? "rgba(20,184,166,0.25)" : "#f1f5f9"}`,
              }}>
                <img src={a.avatar} alt={a.doctor} style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{a.doctor}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{a.specialty}</div>
                  <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: a.date === "Today" ? "rgba(20,184,166,0.12)" : "#f1f5f9", color: a.date === "Today" ? "#0d9488" : "#64748b" }}>
                      📅 {a.date} · {a.time}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: a.mode === "Video" ? "rgba(59,130,246,0.1)" : "#f1f5f9", color: a.mode === "Video" ? "#3b82f6" : "#64748b" }}>
                      {a.mode === "Video" ? "📹" : "🏥"} {a.mode}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
                  {a.date === "Today" && (
                    <button style={{ background: "#14b8a6", color: "#fff", border: "none", borderRadius: 10, padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(20,184,166,0.3)", fontFamily: "inherit" }}>
                      Join
                    </button>
                  )}
                  <button style={{ background: "none", color: "#94a3b8", border: "1px solid #e2e8f0", borderRadius: 10, padding: "7px 16px", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab("Doctors")} style={{
            marginTop: 14, width: "100%", padding: "11px",
            borderRadius: 14, border: "1.5px dashed #99f6e4", background: "transparent",
            color: "#0d9488", fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "background 0.15s", fontFamily: "inherit",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(20,184,166,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Plus size={15} /> Book New Appointment
          </button>
        </Card>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* AI Insight */}
          <div style={{
            background: "linear-gradient(135deg,#0b1c2c,#0d3347)",
            borderRadius: 24, padding: "20px 22px",
            border: "1px solid rgba(20,184,166,0.2)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: -10, bottom: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(20,184,166,0.1)", pointerEvents: "none" }} />
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{AI_TIP.icon}</span>
              <div>
                <p style={{ fontSize: 10, color: "#2dd4bf", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 5px" }}>AI Insight</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, margin: 0 }}>{AI_TIP.text}</p>
              </div>
            </div>
          </div>

          {/* Meds mini */}
          <Card style={{ flex: 1, padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: 0 }}>Today's Meds</h3>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488" }}>{takenCount}/{medList.length} done</span>
            </div>
            <div style={{ height: 5, background: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${adherePct}%`, background: "linear-gradient(90deg,#0d9488,#14b8a6)", borderRadius: 999, transition: "width 0.4s" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {medList.map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 14,
                  background: m.taken ? "#f0fdf4" : "#fafafa",
                  border: `1px solid ${m.taken ? "#bbf7d0" : "#f1f5f9"}`,
                }}>
                  <span style={{ fontSize: 16 }}>💊</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                      {m.name} <span style={{ color: "#94a3b8", fontWeight: 500 }}>{m.dose}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>🕒 {m.time}</div>
                  </div>
                  {m.taken
                    ? <CheckCircle size={17} color="#16a34a" />
                    : <button
                        onClick={() => setMedList(prev => prev.map((x, j) => j === i ? { ...x, taken: true } : x))}
                        style={{ background: "#14b8a6", color: "#fff", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Take
                      </button>
                  }
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Reports */}
      <Card>
        <SectionTitle title="Recent Reports" action="View all" onAction={() => setActiveTab("Records")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {REPORTS.map((r, i) => (
            <div key={i} style={{
              padding: "16px", borderRadius: 18,
              background: "#fafafa", border: "1px solid #f1f5f9",
              cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(20,184,166,0.3)"; e.currentTarget.style.background = "rgba(20,184,166,0.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid #f1f5f9"; e.currentTarget.style.background = "#fafafa"; }}
            >
              <div style={{ fontSize: 26, marginBottom: 10 }}>{r.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1.4 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.date}</div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(20,184,166,0.1)", color: "#0d9488", padding: "2px 8px", borderRadius: 999 }}>{r.type}</span>
                <span style={{ fontSize: 11, color: "#14b8a6", fontWeight: 600 }}>View →</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════
   TAB: SYMPTOM CHECKER
═══════════════════════════════════════ */
function SymptomCheckerTab({ setActiveTab }) {
  const [input,     setInput]     = useState("");
  const [symptoms,  setSymptoms]  = useState(["Headache", "Fatigue"]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result,    setResult]    = useState(null);

  const addSymptom = () => {
    const trimmed = input.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms(prev => [...prev, trimmed]);
      setInput("");
    }
  };

  const removeSymptom = (s) => setSymptoms(prev => prev.filter(x => x !== s));

  const analyze = () => {
    if (symptoms.length === 0) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        condition:    "Possible Tension Headache / Fatigue Syndrome",
        confidence:   82,
        urgency:      "Low",
        urgencyColor: "green",
        description:  "Your symptoms are consistent with tension-type headaches combined with fatigue. Rest, hydration, and stress management are recommended. Consider seeing a general physician if symptoms persist beyond 3 days.",
        specialist:   "General Physician",
      });
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>AI Symptom Checker</h2>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Powered by clinical AI · 94.7% accuracy across 2,847 conditions</p>
        </div>

        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>
          Add Symptoms
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addSymptom()}
            placeholder="e.g. chest pain, dizziness…"
            style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={addSymptom}
            style={{ background: "#14b8a6", color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Add
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, minHeight: 36 }}>
          {symptoms.map(s => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(20,184,166,0.1)", color: "#0d9488", padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
              <Check size={13} /> {s}
              <button onClick={() => removeSymptom(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#14b8a6", display: "flex", alignItems: "center", marginLeft: 2, padding: 0 }}>
                <X size={12} />
              </button>
            </span>
          ))}
          {symptoms.length === 0 && (
            <span style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>No symptoms added yet</span>
          )}
        </div>

        {!result && (
          <button
            onClick={analyze}
            disabled={symptoms.length === 0 || analyzing}
            style={{
              width: "100%", padding: "13px", borderRadius: 14,
              background: "#0f172a", color: "#fff", fontWeight: 700, fontSize: 14,
              border: "none", cursor: symptoms.length === 0 || analyzing ? "not-allowed" : "pointer",
              opacity: symptoms.length === 0 || analyzing ? 0.4 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "inherit", transition: "opacity 0.15s",
            }}
          >
            {analyzing ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                </svg>
                Analyzing symptoms…
              </>
            ) : "⚡ Analyze Symptoms"}
          </button>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "rgba(20,184,166,0.06)", borderRadius: 16, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>AI Confidence</span>
                <span style={{ fontWeight: 700, color: "#0d9488" }}>{result.confidence}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(20,184,166,0.15)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${result.confidence}%`, background: "linear-gradient(90deg,#0d9488,#14b8a6)", borderRadius: 999, transition: "width 0.7s" }} />
              </div>
            </div>

            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 18, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 15, margin: 0 }}>{result.condition}</p>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                  background: result.urgencyColor === "green" ? "#dcfce7" : result.urgencyColor === "yellow" ? "#fef3c7" : "#fee2e2",
                  color:      result.urgencyColor === "green" ? "#166534" : result.urgencyColor === "yellow" ? "#92400e" : "#991b1b",
                }}>
                  {result.urgency} urgency
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, marginBottom: 16 }}>{result.description}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 13, color: "#0d9488", fontWeight: 600 }}>Recommended: {result.specialist}</span>
                <button
                  onClick={() => setActiveTab("Doctors")}
                  style={{ background: "#14b8a6", color: "#fff", border: "none", borderRadius: 11, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Book now →
                </button>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setSymptoms([]); }}
              style={{ width: "100%", fontSize: 12, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", padding: "6px", fontFamily: "inherit" }}
            >
              ← Start over
            </button>
          </div>
        )}

        <div style={{ marginTop: 20, padding: "12px 16px", background: "#f8fafc", borderRadius: 12, borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: 0 }}>
            This tool provides informational guidance only and does not replace professional medical advice.
          </p>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════
   TAB: APPOINTMENTS
═══════════════════════════════════════ */
function Appointments({ setActiveTab }) {
  const [tab, setTab] = useState("upcoming");

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>Appointments</h3>
        <button onClick={() => setActiveTab("Doctors")} style={{
          background: "#0d9488", color: "#fff", border: "none", borderRadius: 12,
          padding: "9px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 14px rgba(13,148,136,0.3)", fontFamily: "inherit",
        }}>
          <Plus size={14} /> Book New
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 22, background: "#f8fafc", borderRadius: 14, padding: 4, width: "fit-content", border: "1px solid #f1f5f9" }}>
        {["upcoming", "past"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            border: "none", cursor: "pointer", transition: "all 0.15s",
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "#0f172a" : "#94a3b8",
            boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            fontFamily: "inherit", textTransform: "capitalize",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(tab === "upcoming" ? UPCOMING : PAST_VISITS).map(a => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "18px 22px", borderRadius: 20,
            background: "#fafafa", border: "1.5px solid #f1f5f9",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.border = "1.5px solid rgba(20,184,166,0.2)"; e.currentTarget.style.background = "rgba(20,184,166,0.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1.5px solid #f1f5f9"; e.currentTarget.style.background = "#fafafa"; }}
          >
            <img src={a.avatar} alt="" style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{a.doctor}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{a.specialty}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#64748b", padding: "4px 12px", borderRadius: 999 }}>
                  📅 {a.date} · {a.time}
                </span>
                {"mode" in a && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 999, background: a.mode === "Video" ? "rgba(59,130,246,0.1)" : "#f1f5f9", color: a.mode === "Video" ? "#3b82f6" : "#64748b" }}>
                    {a.mode === "Video" ? "📹" : "🏥"} {a.mode}
                  </span>
                )}
                {"diagnosis" in a && (
                  <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(20,184,166,0.1)", color: "#0d9488", padding: "4px 12px", borderRadius: 999 }}>
                    {a.diagnosis}
                  </span>
                )}
                {"rating" in a && (
                  <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(245,158,11,0.1)", color: "#d97706", padding: "4px 12px", borderRadius: 999 }}>
                    {"⭐".repeat(a.rating)}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {tab === "upcoming" && a.date === "Today" && (
                <button style={{ background: "#14b8a6", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(20,184,166,0.3)", fontFamily: "inherit" }}>
                  Join Call
                </button>
              )}
              <button style={{ background: "none", border: "1.5px solid #e2e8f0", color: "#64748b", borderRadius: 12, padding: "10px 18px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                {tab === "upcoming" ? "Reschedule" : "Book again"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════
   TAB: MEDICATIONS
═══════════════════════════════════════ */
function Medications() {
  const [meds, setMeds] = useState(INIT_MEDS);
  const taken = meds.filter(m => m.taken).length;

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>Medications</h3>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0d9488" }}>{taken}/{meds.length} taken today</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ height: "100%", width: `${(taken / meds.length) * 100}%`, background: "linear-gradient(90deg,#0d9488,#14b8a6)", borderRadius: 999, transition: "width 0.4s" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {meds.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 18,
            padding: "20px 24px", borderRadius: 20,
            background: m.taken ? "#f0fdf4" : "#fafafa",
            border: `1.5px solid ${m.taken ? "#bbf7d0" : "#f1f5f9"}`,
            transition: "all 0.2s",
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, background: m.taken ? "#dcfce7" : "rgba(20,184,166,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              💊
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{m.dose} · {m.freq}</div>
              <div style={{ fontSize: 12, color: "#0d9488", marginTop: 5, fontWeight: 600 }}>🕒 Next: {m.time}</div>
            </div>
            {m.taken
              ? <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#16a34a" }}>
                  <CheckCircle size={22} /><span style={{ fontSize: 13, fontWeight: 700 }}>Taken</span>
                </div>
              : <button
                  onClick={() => setMeds(p => p.map((x, j) => j === i ? { ...x, taken: true } : x))}
                  style={{ background: "#0d9488", color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(13,148,136,0.3)", fontFamily: "inherit" }}
                >
                  Mark taken
                </button>
            }
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════
   TAB: RECORDS
═══════════════════════════════════════ */
const ALL_REPORTS = [
  ...REPORTS,
  { name: "Blood Panel (March)",     date: "Mar 10", type: "Lab",    icon: "🧪" },
  { name: "Follow-up Consultation",  date: "Mar 10", type: "Report", icon: "📋" },
];

function Records() {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>Health Records</h3>
        <button style={{ background: "#0d9488", color: "#fff", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(13,148,136,0.3)", fontFamily: "inherit" }}>
          <Plus size={14} /> Upload
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {ALL_REPORTS.map((r, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "18px 20px", borderRadius: 18,
            background: "#fafafa", border: "1.5px solid #f1f5f9",
            transition: "all 0.15s", cursor: "pointer",
          }}
            onMouseEnter={e => { e.currentTarget.style.border = "1.5px solid rgba(20,184,166,0.25)"; e.currentTarget.style.background = "rgba(20,184,166,0.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1.5px solid #f1f5f9"; e.currentTarget.style.background = "#fafafa"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(20,184,166,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {r.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{r.date}</div>
              <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(20,184,166,0.1)", color: "#0d9488", padding: "2px 8px", borderRadius: 999, marginTop: 5, display: "inline-block" }}>
                {r.type}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <button style={{ background: "#0d9488", color: "#fff", border: "none", borderRadius: 9, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>View</button>
              <button style={{ background: "none", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: 9, padding: "6px 14px", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════
   TAB: DOCTORS
═══════════════════════════════════════ */
function DoctorsTab() {
  const [filter, setFilter]   = useState("All");
  const [booked, setBooked]   = useState(null);
  const [search, setSearch]   = useState("");

  const filtered = ALL_DOCTORS.filter(d => {
    const matchesFilter = filter === "All" || d.specialty === filter;
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                          d.specialty.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Find a Doctor</h3>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>12,400+ verified specialists · Real-time availability</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctors…"
            style={{ paddingLeft: 30, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 12, color: "#374151", background: "#fff", width: 200, fontFamily: "inherit", outline: "none" }}
          />
        </div>
      </div>

      {/* Specialty filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {SPECIALTIES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600,
            border: "none", cursor: "pointer", transition: "all 0.15s",
            background: filter === s ? "#14b8a6" : "#f1f5f9",
            color: filter === s ? "#fff" : "#64748b",
            fontFamily: "inherit",
          }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(doc => (
          <div key={doc.name} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "18px 22px", borderRadius: 20,
            background: "#fafafa", border: "1.5px solid #f1f5f9",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.border = "1.5px solid rgba(20,184,166,0.2)"; e.currentTarget.style.background = "rgba(20,184,166,0.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1.5px solid #f1f5f9"; e.currentTarget.style.background = "#fafafa"; }}
          >
            <img src={doc.img} alt={doc.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{doc.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(20,184,166,0.1)", color: "#0d9488", padding: "2px 8px", borderRadius: 999 }}>{doc.specialty}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 5, fontSize: 12, color: "#64748b", flexWrap: "wrap" }}>
                <span style={{ color: "#f59e0b" }}>⭐ {doc.rating}</span>
                <span>({doc.reviews} reviews)</span>
                <span>· {doc.exp} exp</span>
                <span>· {doc.fee}/visit</span>
              </div>
              <p style={{ fontSize: 12, color: "#14b8a6", marginTop: 5, fontWeight: 600, margin: "5px 0 0" }}>🕒 {doc.next}</p>
            </div>
            {booked === doc.name ? (
              <span style={{ fontSize: 12, fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "8px 14px", borderRadius: 12, flexShrink: 0 }}>
                ✓ Booked!
              </span>
            ) : (
              <button
                onClick={() => setBooked(doc.name)}
                style={{ flexShrink: 0, background: "#0f172a", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.background = "#14b8a6"}
                onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
              >
                Book Now
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>No doctors found</p>
            <p style={{ fontSize: 12 }}>Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════
   TAB: SETTINGS
═══════════════════════════════════════ */
function SettingsTab() {
  const savedName  = localStorage.getItem("user_name")  || "Alex Johnson";
  const savedEmail = localStorage.getItem("user_email") || "alex.johnson@email.com";

  const [form, setForm] = useState({
    name:  savedName,
    email: savedEmail,
    phone: "+1 (555) 012-3456",
    dob:   "1990-06-14",
  });
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    appointments: true,
    medications:  true,
    insights:     true,
    promo:        false,
  });

  const save = () => {
    localStorage.setItem("user_name", form.name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: "0 0 22px" }}>Personal Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            ["Full Name",    "name",  "text"],
            ["Email",        "email", "email"],
            ["Phone",        "phone", "tel"],
            ["Date of Birth","dob",   "date"],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 7 }}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={{ width: "100%", padding: "11px 15px", border: "1.5px solid #e5e7eb", borderRadius: 13, fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s" }}
              />
            </div>
          ))}
        </div>
        <button onClick={save} style={{
          marginTop: 22,
          background: saved ? "#16a34a" : "#0d9488",
          color: "#fff", border: "none", borderRadius: 13,
          padding: "12px 30px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: saved ? "0 4px 14px rgba(22,163,74,0.3)" : "0 4px 14px rgba(13,148,136,0.3)",
          transition: "all 0.2s",
        }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </Card>

      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: "0 0 18px" }}>Notifications</h3>
        {NOTIF_ITEMS.map(({ key, label }) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{label}</span>
            <button
              onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
              style={{ width: 46, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: notifs[key] ? "#14b8a6" : "#e2e8f0", position: "relative", transition: "background 0.2s" }}
            >
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: notifs[key] ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════ */
export default function PatientDashboard({ initialTab = "Overview" }) {
  const navigate = useNavigate();

  const [activeTab,  setActiveTab]  = useState(initialTab);
  const [showNotifs, setShowNotifs] = useState(false);
  const [search,     setSearch]     = useState("");

  const patientName = localStorage.getItem("user_name") || "Alex Johnson";
  const unread      = NOTIFICATIONS.filter(n => !n.read).length;

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/auth");
  }, [navigate]);

  // Sync tab when initialTab prop changes (e.g. via URL param)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    navigate("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":        return <Overview          navigate={navigate} setActiveTab={setActiveTab} />;
      case "Symptom Checker": return <SymptomCheckerTab setActiveTab={setActiveTab} />;
      case "Appointments":    return <Appointments      setActiveTab={setActiveTab} />;
      case "Medications":     return <Medications />;
      case "Records":         return <Records />;
      case "Doctors":         return <DoctorsTab />;
      case "Settings":        return <SettingsTab />;
      default:                return <Overview          navigate={navigate} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('${FONT_LINK}');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8fafc; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        input:focus {
          border-color: #14b8a6 !important;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.12) !important;
          outline: none !important;
        }
      `}</style>

      {/* ══════════ TOP NAVBAR ══════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(241,245,249,0.9)",
        padding: "0 40px", height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#0d9488,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={17} color="white" strokeWidth={3} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.3px" }}>
            MediSmart<span style={{ color: "#14b8a6" }}>AI</span>
          </span>
        </div>

        {/* Nav tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f8fafc", borderRadius: 16, padding: 5, border: "1px solid #f1f5f9", overflowX: "auto" }}>
          {TABS.map(tab => (
            <NavPill key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </NavPill>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 12, color: "#374151", background: "#fff", width: 180, fontFamily: "inherit" }}
            />
          </div>

          {/* Bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifs(v => !v)} style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Bell size={16} color="#64748b" />
              {unread > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #f8fafc" }}>
                  {unread}
                </span>
              )}
            </button>
            {showNotifs && <NotifDropdown onClose={() => setShowNotifs(false)} />}
          </div>

          {/* Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setActiveTab("Settings")}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#0d9488,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", border: "2px solid #e2e8f0" }}>
              {patientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{patientName.split(" ")[0]}</div>
              <div style={{ fontSize: 11, color: "#14b8a6", fontWeight: 700 }}>Pro Plan</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Log out"
            style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff";    e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ══════════ PAGE CONTENT ══════════ */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px 60px" }}>
        {renderTab()}
      </main>
    </div>
  );
}
