// DoctorDashboard.jsx  —  /doctor/dashboard
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Search, LogOut, ChevronRight, Plus, Check,
  CheckCircle, X, TrendingUp, TrendingDown,
  Clock, Video, Calendar, MessageSquare,
  AlertCircle,
} from "lucide-react";

const FONT = `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap`;

/* ── DESIGN TOKENS ── */
const T = {
  teal:"#14b8a6", teal2:"#0d9488", tealLight:"rgba(20,184,166,0.1)",
  navy:"#0b1c2c", bg:"#f8fafc", card:"#fff",
  border:"#f1f5f9", border2:"#e2e8f0",
  text:"#0f172a", text2:"#64748b", text3:"#94a3b8",
  red:"#ef4444", green:"#16a34a", amber:"#d97706",
};
const btn = (bg, color, extra={}) => ({ background:bg, color, border:"none", borderRadius:12, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", ...extra });

/* ── MOCK DATA ── */
const DOCTOR_INFO = {
  name: "Dr. Priya Mehta",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  specialty: "Cardiologist",
  hospital: "Apollo Hospital, Mumbai",
  rating: 4.9, reviews: 312, verified: true, plan: "Pro", license: "MD-1234567",
};

const INIT_APPOINTMENTS = [
  { id:1, patient:"Rahul Sharma",   age:45, avatar:"https://randomuser.me/api/portraits/men/1.jpg",   time:"9:00 AM",  mode:"Video",     status:"completed",   condition:"Hypertension follow-up",  fee:420, notes:"" },
  { id:2, patient:"Priya Kapoor",   age:32, avatar:"https://randomuser.me/api/portraits/women/2.jpg", time:"9:30 AM",  mode:"Video",     status:"completed",   condition:"Chest pain evaluation",   fee:380, notes:"" },
  { id:3, patient:"Ahmed Khan",     age:58, avatar:"https://randomuser.me/api/portraits/men/3.jpg",   time:"10:00 AM", mode:"In-Person", status:"in-progress", condition:"ECG review",              fee:450, notes:"" },
  { id:4, patient:"Sneha Patel",    age:29, avatar:"https://randomuser.me/api/portraits/women/4.jpg", time:"10:30 AM", mode:"Video",     status:"waiting",     condition:"Palpitations consult",    fee:380, notes:"" },
  { id:5, patient:"Ravi Mehta",     age:63, avatar:"https://randomuser.me/api/portraits/men/5.jpg",   time:"11:00 AM", mode:"In-Person", status:"waiting",     condition:"Post-surgery check",      fee:500, notes:"" },
  { id:6, patient:"Kavya Nair",     age:41, avatar:"https://randomuser.me/api/portraits/women/6.jpg", time:"11:30 AM", mode:"Video",     status:"scheduled",   condition:"Lipid panel review",      fee:350, notes:"" },
  { id:7, patient:"Suresh Reddy",   age:55, avatar:"https://randomuser.me/api/portraits/men/7.jpg",   time:"2:00 PM",  mode:"In-Person", status:"scheduled",   condition:"Annual cardiac checkup",  fee:600, notes:"" },
  { id:8, patient:"Meena Joshi",    age:37, avatar:"https://randomuser.me/api/portraits/women/8.jpg", time:"3:30 PM",  mode:"Video",     status:"scheduled",   condition:"New patient consult",     fee:380, notes:"" },
];

const INIT_PATIENTS = [
  { id:1, name:"Rahul Sharma",  age:45, avatar:"https://randomuser.me/api/portraits/men/1.jpg",   lastVisit:"Today",  diagnosis:"Hypertension Stage 1", risk:"medium", nextAppt:"Apr 25", phone:"+91 98100 00001", email:"rahul@email.com",  history:["Amlodipine 5mg prescribed","BP 138/88 — improving","Advised low-sodium diet"] },
  { id:2, name:"Priya Kapoor",  age:32, avatar:"https://randomuser.me/api/portraits/women/2.jpg", lastVisit:"Today",  diagnosis:"Atrial Fibrillation",  risk:"high",   nextAppt:"Apr 22", phone:"+91 98100 00002", email:"priya@email.com",  history:["Started anticoagulant therapy","Holter monitor ordered","Echo scheduled for Apr 22"] },
  { id:3, name:"Ahmed Khan",    age:58, avatar:"https://randomuser.me/api/portraits/men/3.jpg",   lastVisit:"Today",  diagnosis:"Post-MI Recovery",     risk:"high",   nextAppt:"Apr 21", phone:"+91 98100 00003", email:"ahmed@email.com",  history:["Stent placed Jan 2026","On dual antiplatelet therapy","Cardiac rehab ongoing"] },
  { id:4, name:"Lata Verma",    age:67, avatar:"https://randomuser.me/api/portraits/women/9.jpg", lastVisit:"Apr 15", diagnosis:"Heart Failure (CHF)",  risk:"high",   nextAppt:"Apr 29", phone:"+91 98100 00004", email:"lata@email.com",   history:["EF 35% — NYHA Class II","Furosemide adjusted","Weight monitoring daily"] },
  { id:5, name:"Vikram Singh",  age:49, avatar:"https://randomuser.me/api/portraits/men/10.jpg",  lastVisit:"Apr 14", diagnosis:"Stable Angina",        risk:"medium", nextAppt:"May 5",  phone:"+91 98100 00005", email:"vikram@email.com", history:["Nitrates PRN prescribed","Stress test normal","Lifestyle modifications advised"] },
];

const INIT_MESSAGES = [
  { id:1, patient:"Sneha Patel",  avatar:"https://randomuser.me/api/portraits/women/4.jpg", unread:true,  thread:[
    { from:"patient", text:"Doctor, I've been feeling dizzy since this morning. Should I come in?", time:"8:42 AM" },
    { from:"doctor",  text:"I'll review and get back to you shortly. Please monitor your symptoms in the meantime.", time:"8:50 AM" },
  ]},
  { id:2, patient:"Rahul Sharma", avatar:"https://randomuser.me/api/portraits/men/1.jpg",   unread:true,  thread:[
    { from:"patient", text:"Thank you for the prescription. When should I get the next BP check?", time:"8:15 AM" },
  ]},
  { id:3, patient:"Meena Joshi",  avatar:"https://randomuser.me/api/portraits/women/8.jpg", unread:false, thread:[
    { from:"patient", text:"I've attached my latest ECG report. Please review at your convenience.", time:"Yesterday" },
    { from:"doctor",  text:"Received, I'll review it before our appointment. No concerns so far.", time:"Yesterday" },
  ]},
];

const INIT_NOTIFS = [
  { id:1, text:"Ahmed Khan is in the waiting room for his 10:00 AM slot",  time:"2 min ago",  read:false, type:"appt"  },
  { id:2, text:"New appointment request from Meena Joshi for Apr 21",      time:"18 min ago", read:false, type:"appt"  },
  { id:3, text:"Sneha Patel sent a message regarding dizziness",           time:"23 min ago", read:false, type:"msg"   },
  { id:4, text:"Your monthly earnings report for March is ready",          time:"Yesterday",  read:true,  type:"report" },
];

const EARNINGS_WEEKLY = [18, 24, 20, 30, 26, 35, 28];
const MONTHS_DATA = { labels:["Oct","Nov","Dec","Jan","Feb","Mar","Apr"], vals:[62,71,68,80,75,92,88] };
const TABS = ["Overview","Appointments","Patients","Earnings","Messages","Settings"];

/* ══════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════ */
function Card({ children, style={} }) {
  return <div style={{ background:"#fff", borderRadius:22, padding:22, border:"1px solid #f1f5f9", boxShadow:"0 2px 12px rgba(0,0,0,0.04)", ...style }}>{children}</div>;
}
function STitle({ title, action, onAction }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
      <h3 style={{ fontSize:15, fontWeight:800, color:T.text, margin:0 }}>{title}</h3>
      {action && <button onClick={onAction} style={{ fontSize:12, color:T.teal2, fontWeight:700, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontFamily:"inherit" }}>{action}<ChevronRight size={13}/></button>}
    </div>
  );
}
function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{ width:46, height:26, borderRadius:999, border:"none", cursor:"pointer", background:on?T.teal:"#e2e8f0", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?23:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.18)" }}/>
    </button>
  );
}
function StatusBadge({ status }) {
  const map = {
    completed:    { bg:"#f0fdf4",                     color:"#16a34a", label:"Completed"    },
    "in-progress":{ bg:"rgba(20,184,166,0.12)",        color:"#0d9488", label:"In Progress"  },
    waiting:      { bg:"rgba(245,158,11,0.1)",          color:"#d97706", label:"Waiting"      },
    scheduled:    { bg:"#f1f5f9",                       color:"#64748b", label:"Scheduled"    },
  };
  const s = map[status] || map.scheduled;
  return <span style={{ fontSize:10, fontWeight:700, background:s.bg, color:s.color, padding:"3px 10px", borderRadius:999 }}>{s.label}</span>;
}
function RiskBadge({ risk }) {
  const map = { high:{ bg:"rgba(239,68,68,0.1)", color:"#ef4444" }, medium:{ bg:"rgba(245,158,11,0.1)", color:"#d97706" }, low:{ bg:"rgba(22,163,74,0.1)", color:"#16a34a" } };
  const s = map[risk] || map.low;
  return <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:999, background:s.bg, color:s.color }}>{risk.toUpperCase()} RISK</span>;
}
function MiniChart({ data }) {
  const max = Math.max(...data);
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:70 }}>
      {data.map((v,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
          <div style={{ width:"100%", borderRadius:"6px 6px 0 0", height:`${(v/max)*60}px`, background:i===5?"linear-gradient(180deg,#0d9488,#14b8a6)":"rgba(20,184,166,0.15)", transition:"height 0.3s" }}/>
          <span style={{ fontSize:9, color:T.text3, fontWeight:500 }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MODAL SYSTEM
══════════════════════════════════════════════ */
function Modal({ onClose, children, width=480 }) {
  useEffect(() => {
    const h = e => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:24, width:"100%", maxWidth:width, boxShadow:"0 30px 80px rgba(0,0,0,0.18)", overflow:"hidden", maxHeight:"90vh", overflowY:"auto" }}>
        {children}
      </div>
    </div>
  );
}
function MHead({ title, sub, onClose }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"20px 22px 14px", borderBottom:`1px solid ${T.border}` }}>
      <div>
        <h2 style={{ fontSize:17, fontWeight:800, color:T.text, margin:0 }}>{title}</h2>
        {sub && <p style={{ fontSize:12, color:T.text3, margin:"3px 0 0" }}>{sub}</p>}
      </div>
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.text3, padding:2, display:"flex", marginLeft:12 }}><X size={18}/></button>
    </div>
  );
}

/* ── JOIN CALL MODAL ── */
function JoinCallModal({ appt, onClose }) {
  const [countdown, setCountdown] = useState(3);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  useEffect(() => {
    if (countdown > 0) { const t = setTimeout(() => setCountdown(c=>c-1), 1000); return () => clearTimeout(t); }
    else setJoined(true);
  }, [countdown]);
  return (
    <Modal onClose={onClose} width={420}>
      <MHead title={joined ? "In Call" : "Joining Call…"} sub={`${appt.patient} · ${appt.condition}`} onClose={onClose}/>
      <div style={{ padding:"28px 22px", textAlign:"center" }}>
        {!joined ? (
          <>
            <div style={{ width:72, height:72, borderRadius:"50%", background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:28 }}>📹</div>
            <div style={{ fontSize:36, fontWeight:800, color:T.teal, marginBottom:8 }}>{countdown}</div>
            <p style={{ fontSize:14, color:T.text2 }}>Connecting to {appt.patient}…</p>
          </>
        ) : (
          <>
            <img src={appt.avatar} alt="" style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover", margin:"0 auto 12px", display:"block" }}/>
            <p style={{ fontSize:16, fontWeight:700, color:T.text, margin:"0 0 4px" }}>{appt.patient}</p>
            <p style={{ fontSize:12, color:T.text3, marginBottom:20 }}>● Live · {appt.condition}</p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:20 }}>
              {[["🎤",muted?"Unmute":"Mute",()=>setMuted(v=>!v),muted],["📹",camOff?"Start Cam":"Stop Cam",()=>setCamOff(v=>!v),camOff],["🖥️","Share Screen",()=>{},false]].map(([ic,label,action,active])=>(
                <button key={label} onClick={action} style={{ ...btn(active?"#fef2f2":"#f1f5f9", active?T.red:T.text2, { display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"12px 16px", fontSize:11, borderRadius:14 }) }}>
                  <span style={{ fontSize:20 }}>{ic}</span>{label}
                </button>
              ))}
            </div>
            <button onClick={onClose} style={{ ...btn("#ef4444","#fff",{ width:"100%", padding:"12px" }) }}>End Call</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── NOTES MODAL ── */
function NotesModal({ appt, onClose, onSave }) {
  const [notes, setNotes] = useState(appt.notes || "");
  const [saved, setSaved] = useState(false);
  const save = () => { onSave(appt.id, notes); setSaved(true); setTimeout(() => { setSaved(false); onClose(); }, 1000); };
  return (
    <Modal onClose={onClose} width={520}>
      <MHead title={`${appt.status==="completed"?"View Notes":"Add Notes"}`} sub={`${appt.patient} · ${appt.condition} · ${appt.time}`} onClose={onClose}/>
      <div style={{ padding:"20px 22px 24px" }}>
        <p style={{ fontSize:12, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Clinical Notes</p>
        <textarea
          value={notes} onChange={e=>setNotes(e.target.value)}
          placeholder="Symptoms reported, examination findings, diagnosis, prescription, follow-up instructions…"
          rows={8}
          style={{ width:"100%", padding:"12px 14px", border:`1.5px solid ${T.border2}`, borderRadius:13, fontSize:13, fontFamily:"inherit", resize:"vertical", outline:"none", boxSizing:"border-box", lineHeight:1.6 }}
        />
        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <button onClick={onClose} style={{ ...btn("#f1f5f9", T.text2, { flex:1 }) }}>Cancel</button>
          <button onClick={save} style={{ ...btn(saved?"#16a34a":T.teal2, "#fff", { flex:2, boxShadow:"0 4px 14px rgba(13,148,136,0.3)" }) }}>
            {saved ? "✓ Saved!" : "Save Notes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── ADD SLOT MODAL ── */
function AddSlotModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ patient:"", time:"", mode:"Video", condition:"" });
  const [done, setDone] = useState(false);
  const add = () => {
    if (!form.patient || !form.time) return;
    setDone(true);
    setTimeout(() => { onAdd({ ...form, id:Date.now(), age:"-", avatar:"https://randomuser.me/api/portraits/lego/1.jpg", status:"scheduled", fee:380, notes:"", waitTime:null }); onClose(); }, 1000);
  };
  return (
    <Modal onClose={onClose} width={440}>
      <MHead title="Add Appointment Slot" sub="Schedule a new patient slot for today" onClose={onClose}/>
      <div style={{ padding:"20px 22px 24px", display:"flex", flexDirection:"column", gap:14 }}>
        {done ? (
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
            <p style={{ fontSize:15, fontWeight:700, color:T.text }}>Slot added!</p>
          </div>
        ) : (
          <>
            {[["Patient Name","patient","text","e.g. John Smith"],["Condition / Reason","condition","text","e.g. Follow-up consult"]].map(([label,key,type,ph])=>(
              <div key={key}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text2, display:"block", marginBottom:6 }}>{label}</label>
                <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${T.border2}`, borderRadius:11, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.text2, display:"block", marginBottom:6 }}>Time</label>
              <input type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))}
                style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${T.border2}`, borderRadius:11, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.text2, display:"block", marginBottom:8 }}>Mode</label>
              <div style={{ display:"flex", gap:10 }}>
                {["Video","In-Person"].map(m=>(
                  <button key={m} onClick={()=>setForm(p=>({...p,mode:m}))} style={{ flex:1, padding:"10px", borderRadius:11, border:`1.5px solid ${form.mode===m?T.teal:T.border2}`, background:form.mode===m?T.tealLight:"#fff", color:form.mode===m?T.teal2:T.text2, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    {m==="Video"?"📹":"🏥"} {m}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={add} disabled={!form.patient||!form.time} style={{ ...btn(form.patient&&form.time?T.teal2:"#e2e8f0", form.patient&&form.time?"#fff":T.text3, { width:"100%", padding:"12px", marginTop:4, boxShadow:form.patient&&form.time?"0 4px 14px rgba(13,148,136,0.3)":"none" }) }}>
              Add Slot
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── PATIENT PROFILE MODAL ── */
function PatientProfileModal({ patient, onClose, onMessage }) {
  return (
    <Modal onClose={onClose} width={520}>
      <MHead title={patient.name} sub={`${patient.age} yrs · ${patient.diagnosis}`} onClose={onClose}/>
      <div style={{ padding:"20px 22px 24px" }}>
        <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:20 }}>
          <img src={patient.avatar} style={{ width:64, height:64, borderRadius:"50%", objectFit:"cover" }} alt=""/>
          <div>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
              <RiskBadge risk={patient.risk}/>
            </div>
            <div style={{ fontSize:13, color:T.text2 }}>Last visit: {patient.lastVisit} · Next: {patient.nextAppt}</div>
            <div style={{ fontSize:12, color:T.text3, marginTop:3 }}>{patient.phone} · {patient.email}</div>
          </div>
        </div>

        <p style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Medical History</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
          {patient.history.map((h,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px", background:"#f8fafc", borderRadius:10, border:`1px solid ${T.border}` }}>
              <span style={{ color:T.teal2, fontWeight:700, fontSize:13, flexShrink:0 }}>·</span>
              <span style={{ fontSize:12, color:T.text2, lineHeight:1.5 }}>{h}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { onMessage(patient); onClose(); }} style={{ ...btn("#f1f5f9", T.text2, { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }) }}>
            <MessageSquare size={14}/> Message
          </button>
          <button onClick={onClose} style={{ ...btn(T.teal2,"#fff",{ flex:2, boxShadow:"0 4px 14px rgba(13,148,136,0.3)" }) }}>
            ✓ Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── NOTIFICATION DROPDOWN ── */
function NotifDropdown({ notifs, onClose, onMarkRead, onMarkAll }) {
  const icons = { appt:"📅", msg:"💬", report:"📋" };
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:98 }}/>
      <div style={{ position:"absolute", top:52, right:0, zIndex:99, width:350, background:"#fff", borderRadius:20, border:`1px solid ${T.border}`, boxShadow:"0 20px 60px rgba(0,0,0,0.13)", overflow:"hidden" }}>
        <div style={{ padding:"14px 18px 10px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:14, fontWeight:800, color:T.text }}>Notifications</span>
          <button onClick={onMarkAll} style={{ fontSize:11, color:T.teal2, fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Mark all read</button>
        </div>
        {notifs.map(n => (
          <div key={n.id} onClick={()=>onMarkRead(n.id)} style={{ padding:"12px 16px", background:n.read?"#fff":"#f0fdfa", borderBottom:`1px solid ${T.border}`, display:"flex", gap:10, cursor:"pointer" }}>
            <span style={{ fontSize:16, flexShrink:0 }}>{icons[n.type]||"🔔"}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, color:"#334155", lineHeight:1.55, margin:"0 0 2px" }}>{n.text}</p>
              <p style={{ fontSize:10, color:T.text3, margin:0 }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width:7, height:7, borderRadius:"50%", background:T.teal, flexShrink:0, marginTop:4 }}/>}
          </div>
        ))}
        {notifs.every(n=>n.read) && <div style={{ padding:"20px", textAlign:"center", color:T.text3, fontSize:13 }}>All caught up! 🎉</div>}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   TAB: OVERVIEW
══════════════════════════════════════════════ */
function Overview({ setTab, appointments, messages }) {
  const upcoming  = appointments.filter(a=>a.status==="scheduled").slice(0,3);
  const inProgress= appointments.find(a=>a.status==="in-progress");
  const waiting   = appointments.filter(a=>a.status==="waiting");
  const completed = appointments.filter(a=>a.status==="completed").length;
  const CIRC = 2*Math.PI*44;
  const dash = CIRC*(completed/appointments.length);
  const doctorName = localStorage.getItem("user_name") || DOCTOR_INFO.name;
  const unreadMsg  = messages.filter(m=>m.unread).length;

  const stats = [
    { label:"Today's Patients", value:String(appointments.length), sub:`${completed} completed`,   trend:+1,  icon:"👥", bg:"rgba(13,148,136,0.08)"  },
    { label:"Consultations",    value:"312",                        sub:"This month",               trend:+12, icon:"🩺", bg:"rgba(59,130,246,0.08)"  },
    { label:"Patient Rating",   value:"4.9★",                       sub:"312 reviews",              trend:0,   icon:"⭐", bg:"rgba(245,158,11,0.08)"  },
    { label:"Earnings (Apr)",   value:"₹1.2L",                      sub:"+18% vs last month",       trend:+18, icon:"💰", bg:"rgba(139,92,246,0.08)"  },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#0b1c2c 0%,#0d3347 55%,#083344 100%)", borderRadius:26, padding:"28px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:160, top:-50, width:200, height:200, borderRadius:"50%", background:"rgba(20,184,166,0.07)", pointerEvents:"none" }}/>
        <div style={{ zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ position:"relative" }}>
              <img src={DOCTOR_INFO.avatar} alt="" style={{ width:52, height:52, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.2)", objectFit:"cover" }}/>
              <div style={{ position:"absolute", bottom:0, right:0, width:13, height:13, background:T.teal, borderRadius:"50%", border:"2px solid #0b1c2c" }}/>
            </div>
            <div>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", margin:0, fontWeight:500 }}>Good {new Date().getHours()<12?"morning":"afternoon"} 👋</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-0.3px" }}>{doctorName}</h2>
              <p style={{ fontSize:11, color:"#2dd4bf", margin:0, fontWeight:600 }}>{DOCTOR_INFO.specialty} · {DOCTOR_INFO.hospital}</p>
            </div>
          </div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 20px", lineHeight:1.65 }}>
            You have <strong style={{ color:"#fff" }}>{appointments.length} appointments</strong> today — {completed} completed, {waiting.length} in queue.
          </p>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setTab("Appointments")} style={{ ...btn(T.teal,"#fff",{ display:"flex", alignItems:"center", gap:6, boxShadow:"0 5px 18px rgba(20,184,166,0.4)" }) }}>
              <Calendar size={13}/> Today's Schedule
            </button>
            <button onClick={()=>setTab("Messages")} style={{ ...btn("rgba(255,255,255,0.08)","#fff",{ border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", gap:6 }) }}>
              <MessageSquare size={13}/> Messages
              {unreadMsg>0 && <span style={{ background:"#ef4444", color:"#fff", fontSize:9, fontWeight:800, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{unreadMsg}</span>}
            </button>
          </div>
        </div>
        <div style={{ zIndex:1, textAlign:"center", flexShrink:0 }}>
          <div style={{ position:"relative", width:110, height:110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9"/>
              <circle cx="55" cy="55" r="44" fill="none" stroke={T.teal} strokeWidth="9" strokeDasharray={`${dash} ${CIRC}`} strokeLinecap="round"/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1 }}>{completed}</span>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.05em" }}>done</span>
            </div>
          </div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:8 }}>of {appointments.length} today</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {stats.map(s=>(
          <Card key={s.label} style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:13, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
              {s.trend!==0 && (
                <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:999, background:s.trend>0?"rgba(22,163,74,0.1)":"rgba(239,68,68,0.1)", color:s.trend>0?"#16a34a":"#ef4444", display:"flex", alignItems:"center", gap:3 }}>
                  {s.trend>0?<TrendingUp size={10}/>:<TrendingDown size={10}/>} {Math.abs(s.trend)}%
                </span>
              )}
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:T.text, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:T.text2, marginTop:5, fontWeight:500 }}>{s.label}</div>
            <div style={{ fontSize:10, color:T.text3, marginTop:3 }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20 }}>
        <Card>
          <STitle title="Today's Patient Queue" action="Full schedule" onAction={()=>setTab("Appointments")}/>
          {inProgress && (
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:10, fontWeight:700, color:T.teal2, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 8px" }}>Currently Seeing</p>
              <div style={{ display:"flex", alignItems:"center", gap:13, padding:"13px 15px", borderRadius:15, background:"linear-gradient(135deg,rgba(20,184,166,0.06),rgba(20,184,166,0.02))", border:"1.5px solid rgba(20,184,166,0.25)" }}>
                <div style={{ position:"relative" }}>
                  <img src={inProgress.avatar} alt="" style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", top:-2, right:-2, width:11, height:11, borderRadius:"50%", background:T.teal, border:"2px solid #fff" }}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{inProgress.patient} <span style={{ color:T.text3, fontWeight:500 }}>· {inProgress.age} yrs</span></div>
                  <div style={{ fontSize:11, color:T.text2 }}>{inProgress.condition}</div>
                  <div style={{ fontSize:11, color:T.teal2, fontWeight:600, marginTop:3 }}>{inProgress.time} · {inProgress.mode}</div>
                </div>
                <button onClick={()=>setTab("Appointments")} style={{ ...btn(T.teal,"#fff",{ fontSize:11, padding:"6px 13px", boxShadow:"0 3px 10px rgba(20,184,166,0.3)" }) }}>View</button>
              </div>
            </div>
          )}
          {waiting.length>0 && (
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:10, fontWeight:700, color:T.amber, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 8px" }}>Waiting ({waiting.length})</p>
              {waiting.map(a=>(
                <div key={a.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px", borderRadius:13, background:"rgba(245,158,11,0.04)", border:"1px solid rgba(245,158,11,0.15)", marginBottom:7 }}>
                  <img src={a.avatar} alt="" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover" }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{a.patient}</div>
                    <div style={{ fontSize:11, color:T.text2 }}>{a.condition}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:11, color:T.amber, fontWeight:700 }}>~{a.waitTime}</div>
                    <div style={{ fontSize:10, color:T.text3 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize:10, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 8px" }}>Up Next</p>
          {upcoming.map(a=>(
            <div key={a.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 13px", borderRadius:13, background:"#fafafa", border:`1px solid ${T.border}`, marginBottom:7 }}>
              <img src={a.avatar} alt="" style={{ width:34, height:34, borderRadius:"50%", objectFit:"cover" }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{a.patient}</div>
                <div style={{ fontSize:11, color:T.text3 }}>{a.condition}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:11, fontWeight:600, color:T.text2 }}>{a.time}</div>
                <span style={{ fontSize:10, fontWeight:600, background:a.mode==="Video"?"rgba(59,130,246,0.1)":"#f1f5f9", color:a.mode==="Video"?"#3b82f6":T.text2, padding:"2px 7px", borderRadius:999, display:"inline-block", marginTop:2 }}>
                  {a.mode==="Video"?"📹":"🏥"} {a.mode}
                </span>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card style={{ flex:1 }}>
            <STitle title="Weekly Earnings" action="Full report" onAction={()=>setTab("Earnings")}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
              <div>
                <div style={{ fontSize:26, fontWeight:800, color:T.text, lineHeight:1 }}>₹35,000</div>
                <div style={{ fontSize:11, color:"#16a34a", fontWeight:600, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                  <TrendingUp size={11}/> +18% vs last week
                </div>
              </div>
              <div style={{ fontSize:11, color:T.text3 }}>This week</div>
            </div>
            <MiniChart data={EARNINGS_WEEKLY}/>
          </Card>

          <Card>
            <STitle title="Recent Messages" action="View all" onAction={()=>setTab("Messages")}/>
            {messages.slice(0,2).map(m=>(
              <div key={m.id} style={{ display:"flex", gap:10, padding:"10px 12px", borderRadius:13, background:m.unread?"#f0fdfa":"#fafafa", border:`1px solid ${m.unread?"rgba(20,184,166,0.2)":T.border}`, marginBottom:8 }}>
                <img src={m.avatar} alt="" style={{ width:34, height:34, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{m.patient}</span>
                    <span style={{ fontSize:10, color:T.text3 }}>{m.thread[m.thread.length-1].time}</span>
                  </div>
                  <p style={{ fontSize:11, color:T.text2, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.thread[m.thread.length-1].text}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Recent patients mini */}
      <Card>
        <STitle title="Recent Patients" action="All patients" onAction={()=>setTab("Patients")}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
          {INIT_PATIENTS.map(p=>(
            <div key={p.id} style={{ padding:"14px 15px", borderRadius:16, background:"#fafafa", border:`1px solid ${T.border}`, cursor:"pointer", transition:"all 0.15s" }}
              onMouseEnter={e=>{e.currentTarget.style.border="1px solid rgba(20,184,166,0.25)";e.currentTarget.style.background="rgba(20,184,166,0.02)";}}
              onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${T.border}`;e.currentTarget.style.background="#fafafa";}}>
              <img src={p.avatar} alt="" style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover", marginBottom:9 }}/>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:10, color:T.text3, marginBottom:5 }}>{p.age} yrs · {p.lastVisit}</div>
              <div style={{ fontSize:10, fontWeight:600, color:T.teal2, marginBottom:7, lineHeight:1.4 }}>{p.diagnosis}</div>
              <RiskBadge risk={p.risk}/>
              <div style={{ fontSize:10, color:T.text3, marginTop:6 }}>Next: {p.nextAppt}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB: APPOINTMENTS
══════════════════════════════════════════════ */
function AppointmentsTab({ appointments, setAppointments }) {
  const [filter,    setFilter]    = useState("All");
  const [joinAppt,  setJoinAppt]  = useState(null);
  const [notesAppt, setNotesAppt] = useState(null);
  const [addSlot,   setAddSlot]   = useState(false);
  const filters = ["All","Completed","In Progress","Waiting","Scheduled"];

  const filtered = filter==="All" ? appointments : appointments.filter(a => {
    const norm = s => s.toLowerCase().replace("-"," ");
    return norm(a.status)===norm(filter);
  });

  const startAppt = id => setAppointments(p=>p.map(a=>a.id===id?{...a,status:"in-progress"}:a.status==="in-progress"?{...a,status:"waiting"}:a));
  const completeAppt = id => setAppointments(p=>p.map(a=>a.id===id?{...a,status:"completed"}:a));
  const saveNotes = (id, notes) => setAppointments(p=>p.map(a=>a.id===id?{...a,notes}:a));
  const addNewSlot = slot => setAppointments(p=>[...p, slot]);

  return (
    <Card>
      {joinAppt  && <JoinCallModal appt={joinAppt}   onClose={()=>setJoinAppt(null)}/>}
      {notesAppt && <NotesModal    appt={notesAppt}  onClose={()=>setNotesAppt(null)} onSave={saveNotes}/>}
      {addSlot   && <AddSlotModal  onClose={()=>setAddSlot(false)} onAdd={addNewSlot}/>}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ fontSize:18, fontWeight:800, color:T.text, margin:0 }}>Today's Appointments</h3>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, color:T.text3 }}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span>
          <button onClick={()=>setAddSlot(true)} style={{ ...btn(T.teal2,"#fff",{ display:"flex", alignItems:"center", gap:5, fontSize:12, boxShadow:"0 3px 10px rgba(13,148,136,0.3)" }) }}>
            <Plus size={13}/> Add Slot
          </button>
        </div>
      </div>

      <div style={{ display:"flex", gap:7, marginBottom:20, flexWrap:"wrap" }}>
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 16px", borderRadius:999, fontSize:12, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", background:filter===f?T.teal2:"#f1f5f9", color:filter===f?"#fff":T.text2, boxShadow:filter===f?"0 3px 12px rgba(13,148,136,0.3)":"none" }}>
            {f} {f!=="All"&&<span style={{ opacity:0.7 }}>({appointments.filter(a=>{const norm=s=>s.toLowerCase().replace("-"," ");return norm(a.status)===norm(f);}).length})</span>}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(a=>(
          <div key={a.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"15px 18px", borderRadius:18, background:"#fafafa", border:`1.5px solid ${a.status==="in-progress"?"rgba(20,184,166,0.25)":a.status==="waiting"?"rgba(245,158,11,0.2)":T.border}`, transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(20,184,166,0.02)";e.currentTarget.style.borderColor="rgba(20,184,166,0.2)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#fafafa";e.currentTarget.style.borderColor=a.status==="in-progress"?"rgba(20,184,166,0.25)":a.status==="waiting"?"rgba(245,158,11,0.2)":T.border;}}>
            <img src={a.avatar} alt="" style={{ width:50, height:50, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{a.patient} <span style={{ fontSize:12, color:T.text3, fontWeight:500 }}>· {a.age} yrs</span></div>
              <div style={{ fontSize:12, color:T.text2, marginTop:2 }}>{a.condition}</div>
              <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontWeight:600, background:"#f1f5f9", color:T.text2, padding:"3px 10px", borderRadius:999 }}>🕒 {a.time}</span>
                <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:999, background:a.mode==="Video"?"rgba(59,130,246,0.1)":"#f1f5f9", color:a.mode==="Video"?"#3b82f6":T.text2 }}>
                  {a.mode==="Video"?"📹":"🏥"} {a.mode}
                </span>
                <StatusBadge status={a.status}/>
                {a.notes && <span style={{ fontSize:11, fontWeight:600, background:"rgba(139,92,246,0.1)", color:"#7c3aed", padding:"3px 10px", borderRadius:999 }}>📝 Notes</span>}
              </div>
            </div>
            <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
              {a.status==="in-progress" && a.mode==="Video" && (
                <button onClick={()=>setJoinAppt(a)} style={{ ...btn(T.teal,"#fff",{ fontSize:12, display:"flex", alignItems:"center", gap:5, boxShadow:"0 4px 14px rgba(20,184,166,0.3)" }) }}>
                  <Video size={12}/> Join Call
                </button>
              )}
              {(a.status==="waiting"||a.status==="scheduled") && (
                <button onClick={()=>startAppt(a.id)} style={{ ...btn(T.teal2,"#fff",{ fontSize:12 }) }}>Start</button>
              )}
              {a.status==="in-progress" && (
                <button onClick={()=>completeAppt(a.id)} style={{ ...btn("#16a34a","#fff",{ fontSize:12 }) }}>Complete</button>
              )}
              <button onClick={()=>setNotesAppt(a)} style={{ ...btn("transparent", T.text2, { fontSize:12, border:`1.5px solid ${T.border2}` }) }}>
                {a.status==="completed"?"View Notes":"Add Notes"}
              </button>
            </div>
          </div>
        ))}
        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"32px 0", color:T.text3 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
            <p style={{ fontSize:14, fontWeight:600 }}>No appointments for this filter</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════
   TAB: PATIENTS
══════════════════════════════════════════════ */
function PatientsTab({ setTab, setActiveMsg }) {
  const [search, setSearch] = useState("");
  const [viewPatient, setViewPatient] = useState(null);
  const [riskFilter, setRiskFilter] = useState("All");

  const filtered = INIT_PATIENTS.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchRisk   = riskFilter==="All" || p.risk===riskFilter.toLowerCase();
    return matchSearch && matchRisk;
  });

  const handleMessage = patient => {
    setActiveMsg(patient.name);
    setTab("Messages");
  };

  return (
    <Card>
      {viewPatient && <PatientProfileModal patient={viewPatient} onClose={()=>setViewPatient(null)} onMessage={handleMessage}/>}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ fontSize:18, fontWeight:800, color:T.text, margin:0 }}>My Patients</h3>
        <div style={{ display:"flex", gap:8 }}>
          {["All","High","Medium","Low"].map(r=>(
            <button key={r} onClick={()=>setRiskFilter(r)} style={{ padding:"6px 14px", borderRadius:999, fontSize:12, fontWeight:600, border:`1.5px solid ${riskFilter===r?T.teal:T.border2}`, background:riskFilter===r?T.tealLight:"#fff", color:riskFilter===r?T.teal2:T.text2, cursor:"pointer", fontFamily:"inherit" }}>{r}</button>
          ))}
        </div>
      </div>

      <div style={{ position:"relative", marginBottom:16 }}>
        <Search size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.text3, pointerEvents:"none" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or diagnosis…"
          style={{ width:"100%", paddingLeft:30, paddingRight:14, paddingTop:9, paddingBottom:9, border:`1.5px solid ${T.border2}`, borderRadius:12, fontSize:13, color:T.text, background:"#fff", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(p=>(
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"15px 18px", borderRadius:18, background:"#fafafa", border:`1.5px solid ${T.border}`, transition:"all 0.15s", cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.style.border="1.5px solid rgba(20,184,166,0.2)";e.currentTarget.style.background="rgba(20,184,166,0.02)";}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1.5px solid ${T.border}`;e.currentTarget.style.background="#fafafa";}}>
            <img src={p.avatar} alt="" style={{ width:52, height:52, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{p.name} <span style={{ fontSize:12, color:T.text3, fontWeight:500 }}>· {p.age} yrs</span></div>
              <div style={{ fontSize:12, color:T.teal2, fontWeight:600, marginTop:2 }}>{p.diagnosis}</div>
              <div style={{ fontSize:11, color:T.text3, marginTop:4 }}>Last: {p.lastVisit} · Next: {p.nextAppt}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
              <RiskBadge risk={p.risk}/>
              <div style={{ display:"flex", gap:7 }}>
                <button onClick={e=>{e.stopPropagation();setViewPatient(p);}} style={{ ...btn(T.teal2,"#fff",{ fontSize:11, padding:"6px 13px" }) }}>View</button>
                <button onClick={e=>{e.stopPropagation();handleMessage(p);}} style={{ ...btn("transparent",T.text2,{ fontSize:11, padding:"6px 11px", border:`1px solid ${T.border2}` }) }}>
                  <MessageSquare size={12}/>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"28px 0", color:T.text3 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
            <p style={{ fontSize:14, fontWeight:600 }}>No patients found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════
   TAB: EARNINGS
══════════════════════════════════════════════ */
function EarningsTab({ appointments }) {
  const [period, setPeriod] = useState("Monthly");
  const { labels, vals } = MONTHS_DATA;
  const maxV = Math.max(...vals);

  // Fixed fee amounts (no Math.random — stable across renders)
  const transactions = appointments
    .filter(a=>a.status==="completed"||a.status==="in-progress"||a.status==="waiting")
    .slice(0,5);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[
          { label:"April Earnings",      value:"₹1,20,000", sub:"+18% vs March",  color:T.teal2  },
          { label:"Total Consultations", value:"312",        sub:"This month",     color:"#3b82f6" },
          { label:"Avg per Consult",     value:"₹385",       sub:"Based on Apr",   color:"#8b5cf6" },
        ].map(e=>(
          <Card key={e.label} style={{ padding:"20px 22px" }}>
            <div style={{ fontSize:26, fontWeight:800, color:e.color, lineHeight:1, marginBottom:6 }}>{e.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{e.label}</div>
            <div style={{ fontSize:11, color:T.text3, marginTop:4 }}>{e.sub}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:T.text, margin:0 }}>Earnings Overview (₹000s)</h3>
          <div style={{ display:"flex", gap:6 }}>
            {["Monthly","Weekly"].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{ padding:"6px 14px", borderRadius:999, fontSize:12, fontWeight:600, border:`1.5px solid ${period===p?T.teal:T.border2}`, background:period===p?T.tealLight:"#fff", color:period===p?T.teal2:T.text2, cursor:"pointer", fontFamily:"inherit" }}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"flex-end", height:130 }}>
          {(period==="Monthly"?vals:EARNINGS_WEEKLY).map((v,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:10, color:T.text3, fontWeight:600 }}>{v}k</span>
              <div style={{ width:"100%", borderRadius:"7px 7px 0 0", height:`${(v/maxV)*100}px`, background:i===(period==="Monthly"?6:5)?"linear-gradient(180deg,#0d9488,#14b8a6)":"rgba(20,184,166,0.15)", transition:"height 0.3s" }}/>
              <span style={{ fontSize:9, color:T.text3 }}>{period==="Monthly"?labels[i]:["M","T","W","T","F","S","S"][i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <STitle title="Recent Transactions"/>
        {transactions.map(a=>(
          <div key={a.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <img src={a.avatar} alt="" style={{ width:38, height:38, borderRadius:"50%", objectFit:"cover" }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{a.patient}</div>
                <div style={{ fontSize:11, color:T.text3 }}>{a.mode} · {a.time}</div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.text }}>₹{a.fee}</div>
              <StatusBadge status={a.status}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB: MESSAGES
══════════════════════════════════════════════ */
function MessagesTab({ messages, setMessages, activePatient }) {
  const [active, setActive] = useState(() => {
    if (activePatient) return messages.find(m=>m.patient===activePatient) || messages[0];
    return messages[0];
  });
  const [reply, setReply] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activePatient) {
      const found = messages.find(m=>m.patient===activePatient);
      if (found) setActive(found);
    }
  }, [activePatient]);

  useEffect(() => {
    // Mark active thread as read
    if (active) {
      setMessages(p=>p.map(m=>m.id===active.id?{...m,unread:false}:m));
    }
  }, [active?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [active]);

  const send = () => {
    if (!reply.trim() || !active) return;
    const newMsg = { from:"doctor", text:reply.trim(), time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) };
    setMessages(p=>p.map(m=>m.id===active.id?{...m, thread:[...m.thread,newMsg]}:m));
    setActive(prev=>({...prev, thread:[...prev.thread,newMsg]}));
    setReply("");
  };

  const handleKeyDown = e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const unreadCount = messages.filter(m=>m.unread).length;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:16, height:580 }}>
      {/* Sidebar */}
      <Card style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontWeight:800, fontSize:14, color:T.text }}>Messages</span>
          {unreadCount>0 && <span style={{ fontSize:11, fontWeight:700, background:"#ef4444", color:"#fff", padding:"2px 8px", borderRadius:999 }}>{unreadCount}</span>}
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {messages.map(m=>(
            <div key={m.id} onClick={()=>setActive(m)} style={{ padding:"13px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", gap:10, cursor:"pointer", background:active?.id===m.id?"rgba(20,184,166,0.06)":"transparent", transition:"background 0.15s" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <img src={m.avatar} alt="" style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover" }}/>
                {m.unread && <div style={{ position:"absolute", top:0, right:0, width:10, height:10, borderRadius:"50%", background:T.teal, border:"2px solid #fff" }}/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{m.patient}</span>
                  <span style={{ fontSize:10, color:T.text3 }}>{m.thread[m.thread.length-1].time}</span>
                </div>
                <p style={{ fontSize:11, color:T.text2, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.thread[m.thread.length-1].text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat */}
      <Card style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {active ? (
          <>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
              <img src={active.avatar} alt="" style={{ width:38, height:38, borderRadius:"50%", objectFit:"cover" }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{active.patient}</div>
                <div style={{ fontSize:11, color:T.teal2, fontWeight:600 }}>Patient</div>
              </div>
            </div>
            <div style={{ flex:1, padding:"18px 20px", overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
              {active.thread.map((msg,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:msg.from==="doctor"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"72%", background:msg.from==="doctor"?"linear-gradient(135deg,#0d9488,#14b8a6)":"#f1f5f9", borderRadius:msg.from==="doctor"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"11px 15px", fontSize:13, color:msg.from==="doctor"?"#fff":"#374151", lineHeight:1.55 }}>
                    {msg.text}
                    <div style={{ fontSize:10, color:msg.from==="doctor"?"rgba(255,255,255,0.6)":"#94a3b8", marginTop:5, textAlign:"right" }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}/>
            </div>
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10 }}>
              <input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your reply… (Enter to send)"
                style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${T.border2}`, borderRadius:12, fontSize:13, fontFamily:"inherit", outline:"none" }}/>
              <button onClick={send} disabled={!reply.trim()} style={{ ...btn(reply.trim()?T.teal2:"#e2e8f0", reply.trim()?"#fff":T.text3, { boxShadow:reply.trim()?"0 3px 10px rgba(13,148,136,0.3)":"none" }) }}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:T.text3, fontSize:14 }}>Select a conversation</div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB: SETTINGS
══════════════════════════════════════════════ */
function DoctorSettings() {
  const [form, setForm] = useState({
    name:     localStorage.getItem("user_name")      || DOCTOR_INFO.name,
    email:    localStorage.getItem("user_email")     || "priya.mehta@apollo.in",
    phone:    "+91 98765 43210",
    specialty:localStorage.getItem("user_specialty") || DOCTOR_INFO.specialty,
    hospital: DOCTOR_INFO.hospital,
    fee:      "120",
    license:  localStorage.getItem("user_license")   || DOCTOR_INFO.license,
  });
  const [saved,   setSaved]   = useState(false);
  const [notifs,  setNotifs]  = useState({ appointments:true, messages:true, payments:true, reminders:true });
  const [privacy, setPrivacy] = useState({ analytics:true, shareAnonymized:false });

  const save = () => {
    localStorage.setItem("user_name",      form.name);
    localStorage.setItem("user_email",     form.email);
    localStorage.setItem("user_specialty", form.specialty);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <Card>
        <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 18px" }}>Profile Information</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Specialty","specialty","text"],["Hospital / Clinic","hospital","text"],["License Number","license","text"],["Consultation Fee (₹)","fee","number"]].map(([label,key,type])=>(
            <div key={key}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text2, display:"block", marginBottom:6 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${T.border2}`, borderRadius:11, fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
            </div>
          ))}
        </div>
        <button onClick={save} style={{ ...btn(saved?"#16a34a":T.teal2,"#fff",{ marginTop:16, padding:"11px 28px", boxShadow:saved?"0 4px 14px rgba(22,163,74,0.3)":"0 4px 14px rgba(13,148,136,0.3)", transition:"all 0.2s" }) }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </Card>

      <Card>
        <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 14px" }}>Notifications</h3>
        {[["appointments","New appointment requests"],["messages","Patient messages"],["payments","Payment confirmations"],["reminders","Schedule reminders"]].map(([key,label])=>(
          <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:13, color:T.text2, fontWeight:500 }}>{label}</span>
            <Toggle on={notifs[key]} onToggle={()=>setNotifs(p=>({...p,[key]:!p[key]}))}/>
          </div>
        ))}
      </Card>

      <Card>
        <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 14px" }}>Privacy</h3>
        {[["analytics","Usage analytics to improve platform"],["shareAnonymized","Share anonymized patient data for research"]].map(([key,label])=>(
          <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:13, color:T.text2, fontWeight:500 }}>{label}</span>
            <Toggle on={privacy[key]} onToggle={()=>setPrivacy(p=>({...p,[key]:!p[key]}))}/>
          </div>
        ))}
      </Card>

      <Card>
        <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 12px" }}>Plan</h3>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", background:"linear-gradient(135deg,#0b1c2c,#0d3347)", borderRadius:14 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Pro Plan</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:2 }}>Unlimited consultations · Analytics · Priority support</div>
          </div>
          <span style={{ fontSize:11, fontWeight:700, background:T.tealLight, color:T.teal, padding:"4px 11px", borderRadius:999 }}>Active</span>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab,  setActiveTab]  = useState("Overview");
  const [showNotifs, setShowNotifs] = useState(false);
  const [search,     setSearch]     = useState("");
  const [notifs,     setNotifs]     = useState(INIT_NOTIFS);
  const [appointments, setAppointments] = useState(INIT_APPOINTMENTS);
  const [messages,   setMessages]   = useState(INIT_MESSAGES);
  const [activeMsg,  setActiveMsg]  = useState(null);  // patient name to open in messages

  const doctorName = localStorage.getItem("user_name")      || DOCTOR_INFO.name;
  const specialty  = localStorage.getItem("user_specialty") || DOCTOR_INFO.specialty;
  const unread     = notifs.filter(n=>!n.read).length;

  // Auth guard — uses correct localStorage keys from AuthPage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("user_role");
    if (!token)             { navigate("/auth"); return; }
    if (role==="Patient")   { navigate("/patient/dashboard"); }
  }, [navigate]);

  // Global search — navigate to matching tab
  const handleSearch = e => {
    const q = e.target.value;
    setSearch(q);
    if (!q) return;
    const lower = q.toLowerCase();
    if (["appointment","schedule","slot","patient queue"].some(k=>lower.includes(k))) setActiveTab("Appointments");
    else if (["patient","rahul","priya","ahmed","lata","vikram"].some(k=>lower.includes(k))) setActiveTab("Patients");
    else if (["earn","money","revenue","payment","transaction"].some(k=>lower.includes(k))) setActiveTab("Earnings");
    else if (["message","chat","reply"].some(k=>lower.includes(k))) setActiveTab("Messages");
    else if (["setting","profile","notification"].some(k=>lower.includes(k))) setActiveTab("Settings");
  };

  const handleLogout = () => {
    ["token","user_name","user_role","user_email","user_specialty","user_license"].forEach(k=>localStorage.removeItem(k));
    navigate("/");
  };

  const openMessageFor = patientName => {
    setActiveMsg(patientName);
    setActiveTab("Messages");
  };

  const renderTab = () => {
    switch(activeTab) {
      case "Overview":     return <Overview     setTab={setActiveTab} appointments={appointments} messages={messages}/>;
      case "Appointments": return <AppointmentsTab appointments={appointments} setAppointments={setAppointments}/>;
      case "Patients":     return <PatientsTab  setTab={setActiveTab} setActiveMsg={name=>{setActiveMsg(name);setActiveTab("Messages");}}/>;
      case "Earnings":     return <EarningsTab  appointments={appointments}/>;
      case "Messages":     return <MessagesTab  messages={messages} setMessages={setMessages} activePatient={activeMsg}/>;
      case "Settings":     return <DoctorSettings/>;
      default:             return <Overview     setTab={setActiveTab} appointments={appointments} messages={messages}/>;
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Manrope',system-ui,sans-serif" }}>
      <style>{`
        @import url('${FONT}');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.bg};}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:99px;}
        input:focus,textarea:focus,select:focus{border-color:${T.teal}!important;box-shadow:0 0 0 3px rgba(20,184,166,0.1)!important;outline:none!important;}
      `}</style>

      {/* NAVBAR */}
      <header style={{ position:"sticky", top:0, zIndex:50, background:"rgba(255,255,255,0.90)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid rgba(241,245,249,0.9)", padding:"0 36px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0, cursor:"pointer" }} onClick={()=>setActiveTab("Overview")}>
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${T.teal2},${T.teal})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Check size={16} color="#fff" strokeWidth={3}/>
          </div>
          <div>
            <span style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:"-0.3px" }}>MediSmart<span style={{ color:T.teal }}>AI</span></span>
            <span style={{ fontSize:10, fontWeight:700, background:T.tealLight, color:T.teal2, padding:"1px 7px", borderRadius:999, marginLeft:7 }}>Doctor</span>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ display:"flex", alignItems:"center", gap:3, background:"#f8fafc", borderRadius:14, padding:4, border:`1px solid ${T.border}` }}>
          {TABS.map(tab => {
            const active = activeTab===tab;
            const msgUnread = tab==="Messages" && messages.filter(m=>m.unread).length>0;
            return (
              <button key={tab} onClick={()=>{ setActiveTab(tab); if(tab!=="Messages") setActiveMsg(null); }} style={{ padding:"7px 14px", borderRadius:10, fontSize:12, fontWeight:active?700:500, border:"none", cursor:"pointer", transition:"all 0.15s", background:active?"#fff":"transparent", color:active?T.text:T.text3, boxShadow:active?"0 2px 8px rgba(0,0,0,0.08)":"none", whiteSpace:"nowrap", fontFamily:"inherit", position:"relative" }}>
                {tab}
                {msgUnread && <span style={{ position:"absolute", top:4, right:4, width:7, height:7, borderRadius:"50%", background:T.teal }}/>}
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <Search size={12} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.text3, pointerEvents:"none" }}/>
            <input value={search} onChange={handleSearch} placeholder="Search…"
              style={{ paddingLeft:28, paddingRight:12, paddingTop:8, paddingBottom:8, border:`1.5px solid ${T.border2}`, borderRadius:11, fontSize:12, color:T.text, background:"#fff", width:160, fontFamily:"inherit" }}/>
          </div>

          {/* Bell */}
          <div style={{ position:"relative" }}>
            <button onClick={()=>setShowNotifs(v=>!v)} style={{ width:38, height:38, borderRadius:11, background:"#fff", border:`1.5px solid ${T.border2}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Bell size={15} color={T.text2}/>
              {unread>0 && <span style={{ position:"absolute", top:-3, right:-3, width:17, height:17, borderRadius:"50%", background:T.red, color:"#fff", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #f8fafc" }}>{unread}</span>}
            </button>
            {showNotifs && (
              <NotifDropdown
                notifs={notifs}
                onClose={()=>setShowNotifs(false)}
                onMarkRead={id=>setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n))}
                onMarkAll={()=>setNotifs(p=>p.map(n=>({...n,read:true})))}
              />
            )}
          </div>

          {/* Profile */}
          <div style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }} onClick={()=>setActiveTab("Settings")}>
            <div style={{ position:"relative" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${T.teal2},${T.teal})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", border:`2px solid ${T.border2}` }}>
                {doctorName.charAt(0).toUpperCase()}
              </div>
              <div style={{ position:"absolute", bottom:0, right:0, width:10, height:10, background:T.teal, borderRadius:"50%", border:"2px solid #fff" }}/>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, lineHeight:1.2 }}>{doctorName.split(" ").slice(0,2).join(" ")}</div>
              <div style={{ fontSize:10, color:T.teal2, fontWeight:700 }}>{specialty}</div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} title="Log out"
            style={{ width:34, height:34, borderRadius:9, background:"#fff", border:`1.5px solid ${T.border2}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.text3, transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.borderColor="#fca5a5";e.currentTarget.style.color=T.red;}}
            onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.color=T.text3;}}>
            <LogOut size={14}/>
          </button>
        </div>
      </header>

      <main style={{ maxWidth:1200, margin:"0 auto", padding:"28px 36px 60px" }}>
        {renderTab()}
      </main>
    </div>
  );
}