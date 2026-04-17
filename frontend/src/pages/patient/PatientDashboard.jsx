// PatientDashboard.jsx  —  /patient/dashboard
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, X, Bell, Search, ChevronRight, ArrowRight,
  Calendar, FileText, Activity, Clock, Star,
  LogOut, Settings, User, Heart, Pill, TrendingUp,
  AlertCircle, CheckCircle, Plus, Menu,
} from "lucide-react";

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const PATIENT = {
  name: "Alex Johnson",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  plan: "Pro",
  memberSince: "Jan 2024",
};

const UPCOMING = [
  { id: 1, doctor: "Dr. Priya Mehta",    specialty: "Cardiologist",  date: "Today",    time: "3:30 PM", avatar: "https://randomuser.me/api/portraits/women/44.jpg", mode: "Video",     status: "confirmed" },
  { id: 2, doctor: "Dr. Arjun Patel",    specialty: "Neurologist",   date: "Apr 21",   time: "10:00 AM",avatar: "https://randomuser.me/api/portraits/men/54.jpg",   mode: "In-Person", status: "confirmed" },
  { id: 3, doctor: "Dr. Lisa Chen",      specialty: "Pediatrician",  date: "Apr 25",   time: "2:00 PM", avatar: "https://randomuser.me/api/portraits/women/22.jpg", mode: "Video",     status: "pending"   },
];

const PAST = [
  { id: 4, doctor: "Dr. James Whitfield", specialty: "Cardiologist", date: "Apr 10", time: "11:00 AM", avatar: "https://randomuser.me/api/portraits/men/32.jpg",   diagnosis: "Hypertension Stage 1", rating: 5 },
  { id: 5, doctor: "Dr. Sofia Reyes",     specialty: "Dermatologist",date: "Mar 28", time: "9:30 AM",  avatar: "https://randomuser.me/api/portraits/women/65.jpg", diagnosis: "Eczema – mild",        rating: 5 },
  { id: 6, doctor: "Dr. Marcus Brown",    specialty: "Orthopedist",  date: "Mar 14", time: "4:00 PM",  avatar: "https://randomuser.me/api/portraits/men/77.jpg",   diagnosis: "Knee strain",          rating: 4 },
];

const VITALS = [
  { label: "Heart Rate",    value: "72",  unit: "bpm",  icon: Heart,      color: "#ef4444", bg: "#fef2f2", trend: "+2%",  trendUp: true  },
  { label: "Blood Pressure",value: "118/76",unit:"mmHg",icon: Activity,   color: "#0d9488", bg: "#f0fdfa", trend: "Normal",trendUp: null  },
  { label: "SpO₂",          value: "98",  unit: "%",    icon: TrendingUp, color: "#3b82f6", bg: "#eff6ff", trend: "Good", trendUp: null  },
  { label: "Weight",        value: "74",  unit: "kg",   icon: User,       color: "#8b5cf6", bg: "#f5f3ff", trend: "-0.5kg",trendUp: false },
];

const MEDICATIONS = [
  { name: "Amlodipine",  dose: "5mg",   freq: "Once daily",    next: "8:00 AM",  status: "taken"   },
  { name: "Metformin",   dose: "500mg", freq: "Twice daily",   next: "2:00 PM",  status: "pending" },
  { name: "Atorvastatin",dose: "20mg",  freq: "Once at night", next: "10:00 PM", status: "pending" },
];

const REPORTS = [
  { name: "Blood Panel – Complete",    date: "Apr 10, 2026", type: "Lab",      size: "1.2 MB" },
  { name: "ECG Report",                date: "Apr 10, 2026", type: "Cardiac",  size: "0.8 MB" },
  { name: "Chest X-Ray",               date: "Mar 28, 2026", type: "Imaging",  size: "3.4 MB" },
  { name: "Dermatology Consultation",  date: "Mar 28, 2026", type: "Report",   size: "0.5 MB" },
];

const NOTIFICATIONS = [
  { id: 1, text: "Dr. Priya Mehta confirmed your appointment for Today 3:30 PM", time: "10 min ago", read: false },
  { id: 2, text: "Your blood pressure report is ready to view",                  time: "1 hr ago",  read: false },
  { id: 3, text: "Reminder: Take Metformin 500mg at 2:00 PM",                   time: "2 hrs ago", read: true  },
  { id: 4, text: "New symptom check available — AI model updated",              time: "Yesterday", read: true  },
];

const AI_TIPS = [
  "Your recent BP reading of 118/76 is excellent. Keep up the low-sodium diet.",
  "You've had 3 cardiology visits this year. Consider scheduling your annual ECG.",
  "Your Metformin dose is due at 2:00 PM. Don't skip — consistency matters.",
];

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */
function Avatar({ src, name, size = 40 }) {
  return (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}

function Badge({ children, color = "teal" }) {
  const map = {
    teal:   { bg: "#f0fdfa", text: "#0d9488" },
    green:  { bg: "#f0fdf4", text: "#16a34a" },
    amber:  { bg: "#fffbeb", text: "#d97706" },
    red:    { bg: "#fef2f2", text: "#dc2626" },
    blue:   { bg: "#eff6ff", text: "#2563eb" },
    gray:   { bg: "#f9fafb", text: "#6b7280" },
  };
  const c = map[color] || map.teal;
  return (
    <span style={{
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 999,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #f1f5f9",
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      padding: "24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={{
          fontSize: 12, color: "#0d9488", fontWeight: 600,
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   NOTIFICATION PANEL
───────────────────────────────────────────── */
function NotificationPanel({ onClose }) {
  return (
    <div style={{
      position: "absolute", top: 52, right: 0, zIndex: 100,
      width: 340, background: "#fff",
      borderRadius: 20, border: "1px solid #e2e8f0",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: n.read ? "transparent" : "#14b8a6",
            marginTop: 5, flexShrink: 0,
          }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, margin: "0 0 3px" }}>{n.text}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{n.time}</p>
          </div>
        </div>
      ))}
      <div style={{ padding: "12px 20px", textAlign: "center" }}>
        <button style={{ fontSize: 12, color: "#0d9488", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
          Mark all as read
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",       icon: Activity  },
  { id: "symptoms",   label: "Symptom Checker", icon: AlertCircle },
  { id: "doctors",    label: "Find Doctors",    icon: User      },
  { id: "appointments",label:"Appointments",    icon: Calendar  },
  { id: "records",    label: "Health Records",  icon: FileText  },
  { id: "medications",label: "Medications",     icon: Pill      },
];

function Sidebar({ active, onNav, collapsed, onToggle, onLogout }) {
  return (
    <aside style={{
      width: collapsed ? 72 : 240,
      background: "#0b1c2c",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "fixed", top: 0, left: 0,
      zIndex: 50, transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "22px 18px" : "22px 24px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg,#0d9488,#14b8a6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={16} color="white" strokeWidth={3} />
        </div>
        {!collapsed && (
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>
            MediSmart<span style={{ color: "#2dd4bf" }}>AI</span>
          </span>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft: "auto", background: "none", border: "none",
            color: "#64748b", cursor: "pointer", padding: 4,
            display: "flex", flexShrink: 0,
          }}
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 12, padding: collapsed ? "11px 14px" : "11px 14px",
                borderRadius: 12, border: "none", cursor: "pointer",
                marginBottom: 2, textAlign: "left",
                background: isActive ? "rgba(20,184,166,0.15)" : "transparent",
                color: isActive ? "#2dd4bf" : "#94a3b8",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#14b8a6" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={() => onNav("settings")}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "transparent", color: "#64748b", marginBottom: 2, whiteSpace: "nowrap",
          }}
        >
          <Settings size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>Settings</span>}
        </button>
        <button
          onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "transparent", color: "#64748b", whiteSpace: "nowrap",
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   TAB VIEWS
───────────────────────────────────────────── */

/* ── Overview (main dashboard) ── */
function OverviewTab({ navigate }) {
  const [tipIdx] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* AI Health Tip */}
      <div style={{
        background: "linear-gradient(135deg,#0b1c2c 0%,#0d3347 100%)",
        borderRadius: 20, padding: "20px 24px",
        display: "flex", alignItems: "center", gap: 16,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -20, top: -20,
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(20,184,166,0.12)",
        }} />
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: "rgba(20,184,166,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 20 }}>🤖</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: "#2dd4bf", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
            AI Health Insight
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>
            {AI_TIPS[tipIdx]}
          </p>
        </div>
        <button
          onClick={() => navigate("/patient/symptom-checker")}
          style={{
            flexShrink: 0, background: "#14b8a6", color: "#fff",
            border: "none", borderRadius: 12, padding: "9px 16px",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Check Symptoms
        </button>
      </div>

      {/* Vitals row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {VITALS.map(v => {
          const Icon = v.icon;
          return (
            <Card key={v.label} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: v.bg, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={17} color={v.color} />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: v.trendUp === true ? "#ef4444" : v.trendUp === false ? "#16a34a" : "#0d9488",
                  background: v.trendUp === true ? "#fef2f2" : v.trendUp === false ? "#f0fdf4" : "#f0fdfa",
                  padding: "2px 8px", borderRadius: 999,
                }}>
                  {v.trend}
                </span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                {v.value}
                <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8", marginLeft: 4 }}>{v.unit}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{v.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Two-column: upcoming + medications */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>

        {/* Upcoming appointments */}
        <Card>
          <SectionHeader title="Upcoming Appointments" action="View all" onAction={() => {}} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {UPCOMING.map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 14,
                background: a.date === "Today" ? "#f0fdfa" : "#fafafa",
                border: `1px solid ${a.date === "Today" ? "#99f6e4" : "#f1f5f9"}`,
              }}>
                <Avatar src={a.avatar} name={a.doctor} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{a.doctor}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{a.specialty}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 7, flexWrap: "wrap" }}>
                    <Badge color={a.date === "Today" ? "teal" : "gray"}>
                      📅 {a.date} · {a.time}
                    </Badge>
                    <Badge color={a.mode === "Video" ? "blue" : "gray"}>
                      {a.mode === "Video" ? "📹" : "🏥"} {a.mode}
                    </Badge>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                  {a.date === "Today" && (
                    <button style={{
                      background: "#0d9488", color: "#fff", border: "none",
                      borderRadius: 10, padding: "7px 14px", fontSize: 11,
                      fontWeight: 600, cursor: "pointer",
                    }}>
                      Join
                    </button>
                  )}
                  <button style={{
                    background: "none", color: "#94a3b8", border: "1px solid #e2e8f0",
                    borderRadius: 10, padding: "7px 14px", fontSize: 11,
                    fontWeight: 500, cursor: "pointer",
                  }}>
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/patient/doctors")}
            style={{
              marginTop: 16, width: "100%", padding: "11px",
              borderRadius: 12, border: "1.5px dashed #99f6e4",
              background: "transparent", color: "#0d9488",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <Plus size={15} /> Book New Appointment
          </button>
        </Card>

        {/* Medications */}
        <Card>
          <SectionHeader title="Today's Medications" action="Full schedule" onAction={() => {}} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MEDICATIONS.map((m, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 14,
                background: m.status === "taken" ? "#f0fdf4" : "#fafafa",
                border: `1px solid ${m.status === "taken" ? "#bbf7d0" : "#f1f5f9"}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: m.status === "taken" ? "#dcfce7" : "#f0fdfa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>
                  💊
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{m.dose} · {m.freq}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    🕒 Next: <strong>{m.next}</strong>
                  </div>
                </div>
                {m.status === "taken" ? (
                  <CheckCircle size={18} color="#16a34a" />
                ) : (
                  <button style={{
                    background: "#0d9488", color: "#fff", border: "none",
                    borderRadius: 8, padding: "5px 10px", fontSize: 11,
                    fontWeight: 600, cursor: "pointer", flexShrink: 0,
                  }}>
                    Mark taken
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Weekly adherence mini chart */}
          <div style={{ marginTop: 20, padding: "14px", background: "#fafafa", borderRadius: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>Weekly Adherence</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#0d9488" }}>86%</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["M","T","W","T","F","S","S"].map((d, i) => {
                const vals = [1,1,1,0.5,1,0,0];
                return (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      height: 28, borderRadius: 6, marginBottom: 4,
                      background: vals[i] === 1 ? "#14b8a6" : vals[i] === 0.5 ? "#99f6e4" : "#e2e8f0",
                    }} />
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{d}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row: recent reports + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Recent reports */}
        <Card>
          <SectionHeader title="Recent Reports" action="All records" onAction={() => {}} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REPORTS.map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 14,
                background: "#fafafa", border: "1px solid #f1f5f9",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "#f0fdfa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{r.date} · {r.size}</div>
                </div>
                <Badge color="gray">{r.type}</Badge>
                <button style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#0d9488", fontSize: 11, fontWeight: 600,
                  flexShrink: 0,
                }}>
                  View
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Past visits */}
        <Card>
          <SectionHeader title="Past Visits" action="Full history" onAction={() => {}} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PAST.map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 14,
                background: "#fafafa", border: "1px solid #f1f5f9",
              }}>
                <Avatar src={a.avatar} name={a.doctor} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{a.doctor}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{a.specialty} · {a.date}</div>
                  <div style={{ fontSize: 11, color: "#0d9488", marginTop: 3, fontWeight: 500 }}>
                    {a.diagnosis}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: "#f59e0b" }}>
                    {"⭐".repeat(a.rating)}
                  </div>
                  <button style={{
                    marginTop: 6, background: "none", border: "1px solid #e2e8f0",
                    borderRadius: 8, padding: "4px 10px", fontSize: 11,
                    color: "#64748b", cursor: "pointer",
                  }}>
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── Appointments Tab ── */
function AppointmentsTab({ navigate }) {
  const [tab, setTab] = useState("upcoming");
  const list = tab === "upcoming" ? UPCOMING : PAST;

  return (
    <Card>
      <SectionHeader title="Appointments" action="+ Book new" onAction={() => navigate("/patient/doctors")} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["upcoming","past"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
            border: "none", cursor: "pointer",
            background: tab === t ? "#0d9488" : "#f1f5f9",
            color: tab === t ? "#fff" : "#64748b",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.map(a => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "18px 20px", borderRadius: 16,
            background: "#fafafa", border: "1px solid #f1f5f9",
          }}>
            <Avatar src={a.avatar} name={a.doctor} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{a.doctor}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{a.specialty}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <Badge color="gray">📅 {a.date} · {a.time}</Badge>
                {"mode" in a && <Badge color={a.mode === "Video" ? "blue" : "gray"}>{a.mode === "Video" ? "📹" : "🏥"} {a.mode}</Badge>}
                {"status" in a && <Badge color={a.status === "confirmed" ? "green" : "amber"}>{a.status}</Badge>}
                {"diagnosis" in a && <Badge color="teal">{a.diagnosis}</Badge>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {tab === "upcoming" && a.date === "Today" && (
                <button style={{
                  background: "#0d9488", color: "#fff", border: "none",
                  borderRadius: 10, padding: "9px 18px", fontSize: 12,
                  fontWeight: 600, cursor: "pointer",
                }}>
                  Join Call
                </button>
              )}
              <button style={{
                background: "none", color: "#64748b", border: "1px solid #e2e8f0",
                borderRadius: 10, padding: "9px 16px", fontSize: 12,
                fontWeight: 500, cursor: "pointer",
              }}>
                {tab === "upcoming" ? "Reschedule" : "Book again"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Records Tab ── */
function RecordsTab() {
  return (
    <Card>
      <SectionHeader title="Health Records" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {REPORTS.map((r, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "16px 20px", borderRadius: 16,
            background: "#fafafa", border: "1px solid #f1f5f9",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "#f0fdfa", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>
              📄
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{r.date} · {r.size}</div>
            </div>
            <Badge color="teal">{r.type}</Badge>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                background: "#0d9488", color: "#fff", border: "none",
                borderRadius: 10, padding: "8px 16px", fontSize: 12,
                fontWeight: 600, cursor: "pointer",
              }}>
                View
              </button>
              <button style={{
                background: "none", border: "1px solid #e2e8f0", color: "#64748b",
                borderRadius: 10, padding: "8px 16px", fontSize: 12,
                fontWeight: 500, cursor: "pointer",
              }}>
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 16, width: "100%", padding: "12px",
        borderRadius: 12, border: "1.5px dashed #99f6e4",
        background: "transparent", color: "#0d9488",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <Plus size={15} /> Upload New Record
      </button>
    </Card>
  );
}

/* ── Medications Tab ── */
function MedicationsTab() {
  const [meds, setMeds] = useState(MEDICATIONS);
  const markTaken = (i) => setMeds(prev => prev.map((m, idx) => idx === i ? { ...m, status: "taken" } : m));
  return (
    <Card>
      <SectionHeader title="Medications" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {meds.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "18px 20px", borderRadius: 16,
            background: m.status === "taken" ? "#f0fdf4" : "#fafafa",
            border: `1px solid ${m.status === "taken" ? "#bbf7d0" : "#f1f5f9"}`,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: m.status === "taken" ? "#dcfce7" : "#f0fdfa",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>💊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{m.dose} · {m.freq}</div>
              <div style={{ fontSize: 12, color: "#0d9488", marginTop: 4, fontWeight: 500 }}>
                🕒 Next dose: {m.next}
              </div>
            </div>
            {m.status === "taken" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a" }}>
                <CheckCircle size={20} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Taken</span>
              </div>
            ) : (
              <button onClick={() => markTaken(i)} style={{
                background: "#0d9488", color: "#fff", border: "none",
                borderRadius: 10, padding: "9px 18px", fontSize: 12,
                fontWeight: 600, cursor: "pointer",
              }}>
                Mark taken
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Settings Tab ── */
function SettingsTab() {
  const [form, setForm] = useState({ name: PATIENT.name, email: "alex.johnson@email.com", phone: "+1 (555) 012-3456", dob: "1990-06-14" });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionHeader title="Personal Information" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Date of Birth","dob","date"]].map(([label, key, type]) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb",
                  borderRadius: 12, fontSize: 13, color: "#111827",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          ))}
        </div>
        <button onClick={save} style={{
          marginTop: 20, background: saved ? "#16a34a" : "#0d9488", color: "#fff",
          border: "none", borderRadius: 12, padding: "11px 28px",
          fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.2s",
        }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </Card>

      <Card>
        <SectionHeader title="Notifications" />
        {[
          ["Appointment reminders", true],
          ["Medication alerts", true],
          ["AI health insights", true],
          ["Promotional emails", false],
        ].map(([label, def]) => {
          const [on, setOn] = useState(def);
          return (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 0", borderBottom: "1px solid #f8fafc",
            }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
              <button onClick={() => setOn(!on)} style={{
                width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
                background: on ? "#14b8a6" : "#e2e8f0",
                position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 3, transition: "left 0.2s",
                  left: on ? 23 : 3,
                }} />
              </button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function PatientDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]         = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  // Guard: if no token, redirect to /login
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNav = (id) => {
    if (id === "symptoms") { navigate("/patient/symptom-checker"); return; }
    if (id === "doctors")  { navigate("/patient/doctors");         return; }
    setActiveNav(id);
  };

  const sideWidth = sidebarCollapsed ? 72 : 240;

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":    return <OverviewTab navigate={navigate} />;
      case "appointments": return <AppointmentsTab navigate={navigate} />;
      case "records":      return <RecordsTab />;
      case "medications":  return <MedicationsTab />;
      case "settings":     return <SettingsTab />;
      default:             return <OverviewTab navigate={navigate} />;
    }
  };

  const PAGE_TITLES = {
    dashboard:    "Dashboard",
    appointments: "Appointments",
    records:      "Health Records",
    medications:  "Medications",
    settings:     "Settings",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        input:focus { border-color: #14b8a6 !important; box-shadow: 0 0 0 3px rgba(20,184,166,0.1); }
      `}</style>

      {/* Sidebar */}
      <Sidebar
        active={activeNav}
        onNav={handleNav}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        onLogout={handleLogout}
      />

      {/* Main area */}
      <div style={{
        marginLeft: sideWidth, flex: 1, display: "flex", flexDirection: "column",
        minHeight: "100vh", transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Top bar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "rgba(248,250,252,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f1f5f9",
          padding: "0 32px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
        }}>
          {/* Page title + breadcrumb */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {PAGE_TITLES[activeNav] || "Dashboard"}
            </h2>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
              {activeNav === "dashboard" ? `Good ${new Date().getHours() < 12 ? "morning" : "afternoon"}, ${PATIENT.name.split(" ")[0]} 👋` : `MediSmartAI / ${PAGE_TITLES[activeNav]}`}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search records, doctors…"
                style={{
                  paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  border: "1.5px solid #e2e8f0", borderRadius: 12,
                  fontSize: 12, color: "#374151", outline: "none",
                  background: "#fff", width: 220,
                }}
              />
            </div>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotifications(v => !v)}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", position: "relative",
                }}
              >
                <Bell size={17} color="#64748b" />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#ef4444", color: "#fff",
                    fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #f8fafc",
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
            </div>

            {/* Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
              onClick={() => setActiveNav("settings")}>
              <Avatar src={PATIENT.avatar} name={PATIENT.name} size={36} />
              <div style={{ display: "none" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{PATIENT.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{PATIENT.plan} Plan</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>{PATIENT.name}</div>
                <div style={{ fontSize: 11, color: "#0d9488", fontWeight: 600 }}>{PATIENT.plan} Plan</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {renderContent()}
        </main>
      </div>

      {/* Close notifications on outside click */}
      {showNotifications && (
        <div
          onClick={() => setShowNotifications(false)}
          style={{ position: "fixed", inset: 0, zIndex: 39 }}
        />
      )}
    </div>
  );
}
