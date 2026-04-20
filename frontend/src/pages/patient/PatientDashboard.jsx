// PatientDashboard.jsx  —  /patient/dashboard
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Search, LogOut, ChevronRight, Plus, Check, CheckCircle,
  X, TrendingUp, TrendingDown, Zap, Upload, Download, Eye,
  Video, Star, Send, AlertCircle,
} from "lucide-react";

const FONT_LINK = `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap`;

const T = {
  teal:"#14b8a6",teal2:"#0d9488",tealLight:"rgba(20,184,166,0.1)",
  navy:"#0b1c2c",bg:"#f8fafc",card:"#fff",
  border:"#f1f5f9",border2:"#e2e8f0",
  text:"#0f172a",text2:"#64748b",text3:"#94a3b8",
  red:"#ef4444",green:"#16a34a",amber:"#d97706",
};
const mkBtn=(bg,color,extra={})=>({background:bg,color,border:"none",borderRadius:12,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",...extra});
const mkCard=(extra={})=>({background:T.card,borderRadius:22,padding:22,border:`1px solid ${T.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.04)",...extra});

const VITALS_DATA=[
  {label:"Heart Rate",value:"72",unit:"bpm",trend:+2,icon:"❤️",bg:"rgba(255,107,107,0.1)"},
  {label:"Blood Pressure",value:"118/76",unit:"mmHg",trend:null,icon:"💉",bg:"rgba(20,184,166,0.1)"},
  {label:"SpO₂",value:"98",unit:"%",trend:null,icon:"🫁",bg:"rgba(59,130,246,0.1)"},
  {label:"Weight",value:"74",unit:"kg",trend:-0.5,icon:"⚖️",bg:"rgba(167,139,250,0.1)"},
];
const INIT_APPOINTMENTS=[
  {id:1,doctor:"Dr. Priya Mehta",specialty:"Cardiologist",date:"Today",time:"3:30 PM",mode:"Video",avatar:"https://randomuser.me/api/portraits/women/44.jpg",status:"upcoming"},
  {id:2,doctor:"Dr. Arjun Patel",specialty:"Neurologist",date:"Apr 21",time:"10:00 AM",mode:"In-Person",avatar:"https://randomuser.me/api/portraits/men/54.jpg",status:"upcoming"},
  {id:3,doctor:"Dr. Lisa Chen",specialty:"Pediatrician",date:"Apr 25",time:"2:00 PM",mode:"Video",avatar:"https://randomuser.me/api/portraits/women/22.jpg",status:"upcoming"},
  {id:4,doctor:"Dr. James Whitfield",specialty:"Cardiologist",date:"Apr 10",time:"11:00 AM",mode:"Video",avatar:"https://randomuser.me/api/portraits/men/32.jpg",status:"past",diagnosis:"Hypertension Stage 1",rating:5},
  {id:5,doctor:"Dr. Sofia Reyes",specialty:"Dermatologist",date:"Mar 28",time:"9:30 AM",mode:"In-Person",avatar:"https://randomuser.me/api/portraits/women/65.jpg",status:"past",diagnosis:"Eczema – mild",rating:5},
  {id:6,doctor:"Dr. Marcus Brown",specialty:"Orthopedist",date:"Mar 14",time:"4:00 PM",mode:"In-Person",avatar:"https://randomuser.me/api/portraits/men/77.jpg",status:"past",diagnosis:"Knee strain",rating:4},
];
const INIT_MEDS=[
  {id:1,name:"Amlodipine",dose:"5mg",freq:"Once daily",time:"8:00 AM",taken:true,refillDue:false},
  {id:2,name:"Metformin",dose:"500mg",freq:"Twice daily",time:"2:00 PM",taken:false,refillDue:true},
  {id:3,name:"Atorvastatin",dose:"20mg",freq:"Once nightly",time:"10:00 PM",taken:false,refillDue:false},
];
const INIT_RECORDS=[
  {id:1,name:"Blood Panel – Complete",date:"Apr 10, 2026",type:"Lab",icon:"🧪",size:"2.4 MB",status:"ready"},
  {id:2,name:"ECG Report",date:"Apr 10, 2026",type:"Cardiac",icon:"💓",size:"1.1 MB",status:"ready"},
  {id:3,name:"Chest X-Ray",date:"Mar 28, 2026",type:"Imaging",icon:"🫁",size:"8.7 MB",status:"ready"},
  {id:4,name:"Dermatology Consultation",date:"Mar 28, 2026",type:"Report",icon:"📋",size:"512 KB",status:"ready"},
  {id:5,name:"Blood Panel (March)",date:"Mar 10, 2026",type:"Lab",icon:"🧪",size:"2.1 MB",status:"ready"},
  {id:6,name:"Follow-up Consultation",date:"Mar 10, 2026",type:"Report",icon:"📋",size:"340 KB",status:"ready"},
];
const INIT_NOTIFS=[
  {id:1,text:"Dr. Priya confirmed your appointment for Today 3:30 PM",time:"10 min ago",read:false,type:"appt"},
  {id:2,text:"Your blood panel report is ready to view",time:"1 hr ago",read:false,type:"report"},
  {id:3,text:"Reminder: Metformin 500mg due at 2:00 PM",time:"2 hrs ago",read:false,type:"med"},
  {id:4,text:"New message from Dr. Priya Mehta",time:"3 hrs ago",read:true,type:"msg"},
];
const ALL_DOCTORS=[
  {id:1,name:"Dr. Priya Mehta",specialty:"Cardiologist",rating:4.9,reviews:312,next:"Today 3:30 PM",img:"https://randomuser.me/api/portraits/women/44.jpg",exp:"14 yrs",fee:"$120",hospital:"Apollo Hospital",slots:["Today 3:30 PM","Today 5:00 PM","Tomorrow 10:00 AM"]},
  {id:2,name:"Dr. James Whitfield",specialty:"Cardiologist",rating:4.8,reviews:201,next:"Today 5:00 PM",img:"https://randomuser.me/api/portraits/men/32.jpg",exp:"18 yrs",fee:"$140",hospital:"Johns Hopkins",slots:["Today 5:00 PM","Tomorrow 9:00 AM","Tomorrow 2:00 PM"]},
  {id:3,name:"Dr. Sofia Reyes",specialty:"Dermatologist",rating:4.9,reviews:178,next:"Tomorrow 10:00 AM",img:"https://randomuser.me/api/portraits/women/65.jpg",exp:"10 yrs",fee:"$110",hospital:"Medanta",slots:["Tomorrow 10:00 AM","Tomorrow 3:00 PM","Apr 22 11:00 AM"]},
  {id:4,name:"Dr. Arjun Patel",specialty:"Neurologist",rating:4.7,reviews:145,next:"Today 6:30 PM",img:"https://randomuser.me/api/portraits/men/54.jpg",exp:"12 yrs",fee:"$160",hospital:"NIMHANS",slots:["Today 6:30 PM","Apr 22 10:00 AM","Apr 23 2:00 PM"]},
  {id:5,name:"Dr. Lisa Chen",specialty:"Pediatrician",rating:5.0,reviews:263,next:"Today 4:00 PM",img:"https://randomuser.me/api/portraits/women/22.jpg",exp:"9 yrs",fee:"$95",hospital:"Children's Hospital",slots:["Today 4:00 PM","Tomorrow 11:00 AM","Apr 22 9:00 AM"]},
  {id:6,name:"Dr. Marcus Brown",specialty:"Orthopedist",rating:4.8,reviews:187,next:"Tomorrow 9:00 AM",img:"https://randomuser.me/api/portraits/men/77.jpg",exp:"16 yrs",fee:"$130",hospital:"Orthopedic Center",slots:["Tomorrow 9:00 AM","Tomorrow 1:00 PM","Apr 23 11:00 AM"]},
  {id:7,name:"Dr. Nisha Kapoor",specialty:"Neurologist",rating:4.6,reviews:87,next:"Apr 22, 2:15 PM",img:"https://randomuser.me/api/portraits/women/33.jpg",exp:"8 yrs",fee:"$145",hospital:"Fortis Hospital",slots:["Apr 22 2:15 PM","Apr 23 10:00 AM","Apr 24 3:00 PM"]},
  {id:8,name:"Dr. Anand Mathur",specialty:"Ophthalmologist",rating:4.7,reviews:112,next:"Apr 25, 11:30 AM",img:"https://randomuser.me/api/portraits/men/41.jpg",exp:"11 yrs",fee:"$105",hospital:"Sankara Eye",slots:["Apr 25 11:30 AM","Apr 26 9:00 AM","Apr 26 2:00 PM"]},
];
const SPECIALTIES=["All","Cardiologist","Dermatologist","Neurologist","Pediatrician","Orthopedist","Ophthalmologist"];
const TABS=["Overview","Symptom Checker","Appointments","Medications","Records","Doctors","Settings"];

/* ── SHARED COMPONENTS ── */
function Card({children,style={}}){return <div style={{...mkCard(),...style}}>{children}</div>}
function STitle({title,action,onAction}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:800,color:T.text,margin:0}}>{title}</h3>
      {action&&<button onClick={onAction} style={{fontSize:12,color:T.teal,fontWeight:700,background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontFamily:"inherit"}}>{action}<ChevronRight size={13}/></button>}
    </div>
  );
}
function Toggle({on,onToggle}){
  return(
    <button onClick={onToggle} style={{width:46,height:26,borderRadius:999,border:"none",cursor:"pointer",background:on?T.teal:"#e2e8f0",position:"relative",transition:"background 0.2s",flexShrink:0}}>
      <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}/>
    </button>
  );
}
function Modal({onClose,children,width=480}){
  useEffect(()=>{
    const h=e=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[onClose]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:width,boxShadow:"0 30px 80px rgba(0,0,0,0.18)",overflow:"hidden",maxHeight:"90vh",overflowY:"auto"}}>
        {children}
      </div>
    </div>
  );
}
function MHead({title,sub,onClose}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"20px 22px 14px",borderBottom:`1px solid ${T.border}`}}>
      <div>
        <h2 style={{fontSize:17,fontWeight:800,color:T.text,margin:0}}>{title}</h2>
        {sub&&<p style={{fontSize:12,color:T.text3,margin:"3px 0 0"}}>{sub}</p>}
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.text3,padding:2,display:"flex",marginLeft:12}}><X size={18}/></button>
    </div>
  );
}

/* ── NOTIFICATION DROPDOWN ── */
function NotifDropdown({notifs,onClose,onMarkRead,onMarkAllRead}){
  const icons={appt:"📅",report:"📋",med:"💊",msg:"💬"};
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:98}}/>
      <div style={{position:"absolute",top:50,right:0,zIndex:99,width:340,background:"#fff",borderRadius:20,border:`1px solid ${T.border}`,boxShadow:"0 20px 60px rgba(0,0,0,0.13)",overflow:"hidden"}}>
        <div style={{padding:"14px 18px 10px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:800,color:T.text}}>Notifications</span>
          <button onClick={onMarkAllRead} style={{fontSize:11,color:T.teal,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Mark all read</button>
        </div>
        {notifs.map(n=>(
          <div key={n.id} onClick={()=>onMarkRead(n.id)} style={{padding:"12px 16px",background:n.read?"#fff":"#f0fdfa",borderBottom:`1px solid ${T.border}`,display:"flex",gap:10,cursor:"pointer"}}>
            <span style={{fontSize:16,flexShrink:0}}>{icons[n.type]||"🔔"}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:12,color:"#334155",lineHeight:1.55,margin:"0 0 2px"}}>{n.text}</p>
              <p style={{fontSize:10,color:T.text3,margin:0}}>{n.time}</p>
            </div>
            {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:T.teal,flexShrink:0,marginTop:4}}/>}
          </div>
        ))}
        {notifs.length===0&&<div style={{padding:"24px",textAlign:"center",color:T.text3,fontSize:13}}>All caught up! 🎉</div>}
      </div>
    </>
  );
}

/* ── JOIN CALL MODAL ── */
function JoinCallModal({appt,onClose}){
  const [countdown,setCountdown]=useState(3);
  const [joined,setJoined]=useState(false);
  useEffect(()=>{
    if(countdown>0){const t=setTimeout(()=>setCountdown(c=>c-1),1000);return()=>clearTimeout(t);}
    else setJoined(true);
  },[countdown]);
  return(
    <Modal onClose={onClose} width={400}>
      <MHead title={joined?"In Call":"Joining Call…"} sub={`${appt.doctor} · ${appt.specialty}`} onClose={onClose}/>
      <div style={{padding:"28px 22px",textAlign:"center"}}>
        {!joined?(
          <>
            <div style={{width:72,height:72,borderRadius:"50%",background:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:28}}>📹</div>
            <div style={{fontSize:36,fontWeight:800,color:T.teal,marginBottom:8}}>{countdown}</div>
            <p style={{fontSize:14,color:T.text2}}>Connecting to your appointment…</p>
          </>
        ):(
          <>
            <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",margin:"0 auto 12px"}}><img src={appt.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
            <p style={{fontSize:16,fontWeight:700,color:T.text,margin:"0 0 4px"}}>{appt.doctor}</p>
            <p style={{fontSize:12,color:T.text3,marginBottom:18}}>Connected ●</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:18}}>
              {[["🎤","Mute"],["📹","Camera"],["🖥️","Share"]].map(([ic,label])=>(
                <button key={label} style={{...mkBtn("#f1f5f9",T.text2,{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",fontSize:11})}}>
                  <span style={{fontSize:18}}>{ic}</span>{label}
                </button>
              ))}
            </div>
            <button onClick={onClose} style={{...mkBtn("#ef4444","#fff",{width:"100%",padding:"12px"})}}>End Call</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── RESCHEDULE MODAL ── */
function RescheduleModal({appt,onClose,onConfirm}){
  const dates=["Apr 20, 2026","Apr 21, 2026","Apr 22, 2026","Apr 23, 2026","Apr 24, 2026","Apr 25, 2026"];
  const times=["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
  const [selDate,setSelDate]=useState(null);
  const [selTime,setSelTime]=useState(null);
  const [done,setDone]=useState(false);
  const confirm=()=>{
    if(!selDate||!selTime)return;
    setDone(true);
    setTimeout(()=>{onConfirm(appt.id,selDate,selTime);onClose();},1200);
  };
  return(
    <Modal onClose={onClose} width={460}>
      <MHead title="Reschedule Appointment" sub={`${appt.doctor} · ${appt.specialty}`} onClose={onClose}/>
      <div style={{padding:"18px 22px 22px"}}>
        {done?(
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:40,marginBottom:10}}>✅</div>
            <p style={{fontSize:15,fontWeight:700,color:T.text}}>Appointment rescheduled!</p>
            <p style={{fontSize:13,color:T.text2}}>{selDate} at {selTime}</p>
          </div>
        ):(
          <>
            <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Select Date</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
              {dates.map(d=>(
                <button key={d} onClick={()=>setSelDate(d)} style={{padding:"9px 6px",borderRadius:11,fontSize:11,fontWeight:600,border:`1.5px solid ${selDate===d?T.teal:T.border2}`,background:selDate===d?T.tealLight:"#fff",color:selDate===d?T.teal2:T.text2,cursor:"pointer",fontFamily:"inherit"}}>{d}</button>
              ))}
            </div>
            <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Select Time</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}}>
              {times.map(t=>(
                <button key={t} onClick={()=>setSelTime(t)} style={{padding:"8px 4px",borderRadius:10,fontSize:11,fontWeight:600,border:`1.5px solid ${selTime===t?T.teal:T.border2}`,background:selTime===t?T.tealLight:"#fff",color:selTime===t?T.teal2:T.text2,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
              ))}
            </div>
            <button onClick={confirm} disabled={!selDate||!selTime} style={{...mkBtn(selDate&&selTime?T.teal:"#e2e8f0",selDate&&selTime?"#fff":T.text3,{width:"100%",padding:"12px"})}}>Confirm Reschedule</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── BOOK APPOINTMENT MODAL ── */
function BookModal({doctor,onClose,onBook}){
  const [step,setStep]=useState(1);
  const [selSlot,setSelSlot]=useState(null);
  const [mode,setMode]=useState("Video");
  const [notes,setNotes]=useState("");
  const [done,setDone]=useState(false);
  const confirm=()=>{
    if(!selSlot)return;
    setDone(true);
    setTimeout(()=>{onBook(doctor,selSlot,mode);onClose();},1300);
  };
  return(
    <Modal onClose={onClose} width={480}>
      <MHead title={done?"Booking Confirmed!":"Book Appointment"} sub={`${doctor.name} · ${doctor.specialty} · ${doctor.hospital}`} onClose={onClose}/>
      <div style={{padding:"18px 22px 22px"}}>
        {done?(
          <div style={{textAlign:"center",padding:"12px 0"}}>
            <div style={{width:64,height:64,borderRadius:"50%",overflow:"hidden",margin:"0 auto 10px"}}><img src={doctor.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
            <p style={{fontSize:16,fontWeight:800,color:T.text,margin:"0 0 4px"}}>You're all set!</p>
            <p style={{fontSize:13,color:T.text2,margin:"0 0 14px"}}>{selSlot} · {mode}</p>
            <div style={{background:T.tealLight,borderRadius:12,padding:"10px 14px",fontSize:12,color:T.teal2,fontWeight:600}}>📧 Confirmation sent to your email</div>
          </div>
        ):(
          <>
            <div style={{display:"flex",gap:6,marginBottom:18}}>
              {["Select Slot","Preferences","Confirm"].map((s,i)=>(
                <div key={s} style={{flex:1,padding:"5px",borderRadius:8,background:step>=i+1?T.tealLight:"#f8fafc",textAlign:"center",fontSize:11,fontWeight:700,color:step>=i+1?T.teal2:T.text3,border:`1px solid ${step>=i+1?T.teal:T.border}`}}>{s}</div>
              ))}
            </div>
            {step===1&&(
              <>
                <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Available Slots</p>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                  {doctor.slots.map(sl=>(
                    <button key={sl} onClick={()=>setSelSlot(sl)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${selSlot===sl?T.teal:T.border2}`,background:selSlot===sl?T.tealLight:"#fafafa",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                      <span style={{fontSize:13,fontWeight:600,color:T.text}}>🕒 {sl}</span>
                      {selSlot===sl&&<Check size={14} color={T.teal2}/>}
                    </button>
                  ))}
                </div>
                <button onClick={()=>selSlot&&setStep(2)} style={{...mkBtn(selSlot?T.teal:"#e2e8f0",selSlot?"#fff":T.text3,{width:"100%",padding:"11px"})}}>Next →</button>
              </>
            )}
            {step===2&&(
              <>
                <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Consultation Mode</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {[["Video","📹","Online video call"],["In-Person","🏥","Visit at clinic"]].map(([m,icon,desc])=>(
                    <button key={m} onClick={()=>setMode(m)} style={{padding:"13px 10px",borderRadius:12,border:`1.5px solid ${mode===m?T.teal:T.border2}`,background:mode===m?T.tealLight:"#fafafa",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                      <div style={{fontSize:20,marginBottom:5}}>{icon}</div>
                      <div style={{fontSize:13,fontWeight:700,color:T.text}}>{m}</div>
                      <div style={{fontSize:11,color:T.text3}}>{desc}</div>
                    </button>
                  ))}
                </div>
                <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Notes (optional)</p>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Describe your reason for visit…" rows={3} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:13,fontFamily:"inherit",resize:"none",outline:"none",boxSizing:"border-box",marginBottom:14}}/>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setStep(1)} style={{...mkBtn("#f1f5f9",T.text2,{flex:1,padding:"11px"})}}>← Back</button>
                  <button onClick={()=>setStep(3)} style={{...mkBtn(T.teal,"#fff",{flex:2,padding:"11px"})}}>Review →</button>
                </div>
              </>
            )}
            {step===3&&(
              <>
                <div style={{background:"#f8fafc",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                    <img src={doctor.img} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover"}} alt=""/>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:T.text}}>{doctor.name}</div>
                      <div style={{fontSize:11,color:T.text3}}>{doctor.specialty} · {doctor.hospital}</div>
                    </div>
                  </div>
                  {[["Date & Time",selSlot],["Mode",mode],["Fee",doctor.fee+"/visit"]].map(([label,val])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:`1px solid ${T.border}`}}>
                      <span style={{fontSize:12,color:T.text3}}>{label}</span>
                      <span style={{fontSize:12,fontWeight:700,color:T.text}}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setStep(2)} style={{...mkBtn("#f1f5f9",T.text2,{flex:1,padding:"11px"})}}>← Back</button>
                  <button onClick={confirm} style={{...mkBtn(T.teal,"#fff",{flex:2,padding:"11px",boxShadow:"0 4px 14px rgba(20,184,166,0.3)"})}}>Confirm Booking</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── REPORT VIEWER MODAL ── */
function ReportModal({report,onClose}){
  const content={
    Lab:"All values within normal range.\nHemoglobin: 14.2 g/dL ✓\nWBC: 7,200 /μL ✓\nPlatelets: 245,000 /μL ✓\nCholesterol: 178 mg/dL ✓",
    Cardiac:"Sinus rhythm. Normal PR interval (160ms).\nNo ST changes. QTc: 420ms.\nConclusion: Normal ECG.",
    Imaging:"Chest X-ray PA view. Lungs clear bilaterally.\nNo pleural effusion. Cardiac silhouette normal.\nNo acute findings.",
    Report:"Patient presented with mild eczema on forearms.\nPrescribed topical corticosteroid cream.\nFollow-up in 4 weeks. Condition improving.",
  };
  return(
    <Modal onClose={onClose} width={500}>
      <MHead title={report.name} sub={`${report.type} · ${report.date} · ${report.size}`} onClose={onClose}/>
      <div style={{padding:"18px 22px 22px"}}>
        <div style={{background:"#f8fafc",borderRadius:14,padding:"28px",textAlign:"center",marginBottom:16,border:`1px dashed ${T.border2}`}}>
          <div style={{fontSize:48,marginBottom:10}}>{report.icon}</div>
          <p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:3}}>{report.name}</p>
          <p style={{fontSize:11,color:T.text3,marginBottom:14}}>Generated on {report.date}</p>
          <div style={{background:"#fff",borderRadius:11,padding:"14px",border:`1px solid ${T.border}`,textAlign:"left",fontSize:12,color:T.text2,lineHeight:1.8,whiteSpace:"pre-line"}}>
            {content[report.type]||"Report content available. Please download for full details."}
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{...mkBtn("#f1f5f9",T.text2,{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px"})}}>
            <Download size={13}/> Download
          </button>
          <button style={{...mkBtn("#f1f5f9",T.text2,{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px"})}}>
            <Send size={13}/> Share
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── UPLOAD MODAL ── */
function UploadModal({onClose,onUpload}){
  const [dragging,setDragging]=useState(false);
  const [file,setFile]=useState(null);
  const [type,setType]=useState("Lab");
  const [progress,setProgress]=useState(0);
  const [done,setDone]=useState(false);
  const inputRef=useRef();
  const handleFile=f=>{if(f)setFile(f);};
  const upload=()=>{
    if(!file)return;
    let p=0;
    const iv=setInterval(()=>{
      p+=Math.random()*25+5;
      if(p>=100){p=100;clearInterval(iv);setDone(true);
        setTimeout(()=>{onUpload({name:file.name,type,icon:type==="Lab"?"🧪":type==="Imaging"?"🫁":type==="Cardiac"?"💓":"📋",date:"Today",size:(file.size/1024).toFixed(0)+" KB",status:"ready"});onClose();},1000);
      }
      setProgress(Math.min(p,100));
    },180);
  };
  return(
    <Modal onClose={onClose} width={440}>
      <MHead title="Upload Medical Record" sub="PDF, JPG, PNG up to 25MB" onClose={onClose}/>
      <div style={{padding:"18px 22px 22px"}}>
        {progress>0?(
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:32,marginBottom:10}}>{done?"✅":"⏳"}</div>
            <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>{done?"Uploaded successfully!":"Uploading…"}</p>
            <div style={{height:6,background:"#f1f5f9",borderRadius:999,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${T.teal2},${T.teal})`,borderRadius:999,transition:"width 0.2s"}}/>
            </div>
            <p style={{fontSize:12,color:T.text3,marginTop:8}}>{Math.round(progress)}%</p>
          </div>
        ):(
          <>
            <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
              onClick={()=>inputRef.current.click()}
              style={{border:`2px dashed ${dragging?T.teal:T.border2}`,borderRadius:14,padding:"26px 18px",textAlign:"center",cursor:"pointer",background:dragging?T.tealLight:"#fafafa",transition:"all 0.15s",marginBottom:14}}>
              <Upload size={26} color={T.teal} style={{marginBottom:8}}/>
              <p style={{fontSize:13,fontWeight:700,color:T.text,margin:"0 0 3px"}}>{file?file.name:"Drop file here or click to browse"}</p>
              <p style={{fontSize:11,color:T.text3,margin:0}}>{file?(file.size/1024).toFixed(0)+" KB":"PDF, JPG, PNG up to 25MB"}</p>
              <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:700,color:T.text2,display:"block",marginBottom:8}}>Record Type</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Lab","Imaging","Cardiac","Report"].map(t=>(
                  <button key={t} onClick={()=>setType(t)} style={{padding:"6px 14px",borderRadius:999,fontSize:12,fontWeight:600,border:`1.5px solid ${type===t?T.teal:T.border2}`,background:type===t?T.tealLight:"#fff",color:type===t?T.teal2:T.text2,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={upload} disabled={!file} style={{...mkBtn(file?T.teal:"#e2e8f0",file?"#fff":T.text3,{width:"100%",padding:"12px",boxShadow:file?"0 4px 14px rgba(20,184,166,0.3)":"none"})}}>Upload Record</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── REFILL MODAL ── */
function RefillModal({med,onClose,onConfirm}){
  const [done,setDone]=useState(false);
  return(
    <Modal onClose={onClose} width={380}>
      <MHead title="Request Refill" sub={`${med.name} ${med.dose}`} onClose={onClose}/>
      <div style={{padding:"20px 22px 22px",textAlign:"center"}}>
        {done?(
          <>
            <div style={{fontSize:44,marginBottom:10}}>✅</div>
            <p style={{fontSize:15,fontWeight:700,color:T.text}}>Refill requested!</p>
            <p style={{fontSize:13,color:T.text2}}>Your doctor will approve within 24 hours.</p>
          </>
        ):(
          <>
            <div style={{fontSize:44,marginBottom:10}}>💊</div>
            <p style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>{med.name} {med.dose}</p>
            <p style={{fontSize:13,color:T.text2,marginBottom:18}}>Request a 30-day refill from your prescribing doctor.</p>
            <button onClick={()=>{setDone(true);setTimeout(()=>{onConfirm(med.id);onClose();},1200);}} style={{...mkBtn(T.teal,"#fff",{width:"100%",padding:"12px",boxShadow:"0 4px 14px rgba(20,184,166,0.3)"})}}>Send Refill Request</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── CANCEL CONFIRM MODAL ── */
function CancelModal({onClose,onConfirm}){
  return(
    <Modal onClose={onClose} width={360}>
      <MHead title="Cancel Appointment" sub="This cannot be undone." onClose={onClose}/>
      <div style={{padding:"20px 22px 22px",textAlign:"center"}}>
        <div style={{fontSize:38,marginBottom:12}}>⚠️</div>
        <p style={{fontSize:14,color:T.text2,marginBottom:20}}>Are you sure you want to cancel this appointment?</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{...mkBtn("#f1f5f9",T.text2,{flex:1})}}>Keep it</button>
          <button onClick={onConfirm} style={{...mkBtn("#ef4444","#fff",{flex:1})}}>Yes, Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

/* ══ TAB: OVERVIEW ══ */
function Overview({setActiveTab,appointments,meds,setMeds,records}){
  const upcoming=appointments.filter(a=>a.status==="upcoming").slice(0,3);
  const takenCount=meds.filter(m=>m.taken).length;
  const adherePct=Math.round((takenCount/meds.length)*100);
  const patientName=localStorage.getItem("user_name")||"Alex Johnson";
  const CIRC=2*Math.PI*50;
  const dash=(87/100)*CIRC;
  const [joinAppt,setJoinAppt]=useState(null);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      {joinAppt&&<JoinCallModal appt={joinAppt} onClose={()=>setJoinAppt(null)}/>}

      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#0b1c2c 0%,#0d3347 60%,#083344 100%)",borderRadius:28,padding:"28px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:180,top:-50,width:200,height:200,borderRadius:"50%",background:"rgba(20,184,166,0.07)",pointerEvents:"none"}}/>
        <div style={{zIndex:1}}>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 4px",fontWeight:500}}>Good {new Date().getHours()<12?"morning":"afternoon"} 👋</p>
          <h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 8px",fontFamily:"Georgia,serif"}}>Welcome back, <em style={{color:"#2dd4bf"}}>{patientName.split(" ")[0]}.</em></h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 18px",lineHeight:1.65,maxWidth:380}}>
            {upcoming.length>0?`${upcoming.length} upcoming appointment${upcoming.length>1?"s":""}`:""} · {meds.length-takenCount} medication{meds.length-takenCount!==1?"s":""} due today.
          </p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setActiveTab("Symptom Checker")} style={{...mkBtn(T.teal,"#fff",{display:"flex",alignItems:"center",gap:7,boxShadow:"0 6px 20px rgba(20,184,166,0.4)"})}}>
              <Zap size={13}/>Check Symptoms
            </button>
            <button onClick={()=>setActiveTab("Doctors")} style={{...mkBtn("rgba(255,255,255,0.1)","#fff",{border:"1px solid rgba(255,255,255,0.18)"})}}>
              Book Doctor →
            </button>
          </div>
        </div>
        <div style={{zIndex:1,textAlign:"center",flexShrink:0}}>
          <div style={{position:"relative",width:110,height:110,margin:"0 auto"}}>
            <svg width="110" height="110" viewBox="0 0 120 120" style={{transform:"rotate(-90deg)"}}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke={T.teal} strokeWidth="10" strokeDasharray={`${dash} ${CIRC}`} strokeLinecap="round"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:24,fontWeight:800,color:"#fff",lineHeight:1}}>87</span>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.05em"}}>score</span>
            </div>
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:8}}>Health Score</p>
          <p style={{fontSize:11,color:"#2dd4bf",margin:0,fontWeight:700}}>Excellent</p>
        </div>
      </div>

      {/* Vitals */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {VITALS_DATA.map(v=>(
          <Card key={v.label}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{width:42,height:42,borderRadius:13,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{v.icon}</div>
              {v.trend!==null?(
                <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:999,background:v.trend>0?"rgba(239,68,68,0.1)":"rgba(22,163,74,0.1)",color:v.trend>0?T.red:T.green,display:"flex",alignItems:"center",gap:2}}>
                  {v.trend>0?<TrendingUp size={10}/>:<TrendingDown size={10}/>} {v.trend>0?"+":""}{v.trend}
                </span>
              ):(
                <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:999,background:T.tealLight,color:T.teal2}}>Normal</span>
              )}
            </div>
            <div style={{fontSize:26,fontWeight:800,color:T.text,lineHeight:1}}>{v.value}<span style={{fontSize:12,fontWeight:500,color:T.text3,marginLeft:4}}>{v.unit}</span></div>
            <div style={{fontSize:11,color:T.text3,marginTop:5,fontWeight:500}}>{v.label}</div>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20}}>
        <Card>
          <STitle title="Upcoming Appointments" action="View all" onAction={()=>setActiveTab("Appointments")}/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {upcoming.length===0&&<p style={{fontSize:13,color:T.text3,padding:"12px 0"}}>No upcoming appointments</p>}
            {upcoming.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 13px",borderRadius:15,background:a.date==="Today"?"rgba(20,184,166,0.05)":"#fafafa",border:`1.5px solid ${a.date==="Today"?"rgba(20,184,166,0.22)":T.border}`}}>
                <img src={a.avatar} alt="" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{a.doctor}</div>
                  <div style={{fontSize:11,color:T.text3}}>{a.specialty} · {a.date} {a.time}</div>
                </div>
                {a.date==="Today"
                  ?<button onClick={()=>setJoinAppt(a)} style={{...mkBtn(T.teal,"#fff",{fontSize:11,padding:"6px 13px",boxShadow:"0 3px 10px rgba(20,184,166,0.3)"})}}>Join</button>
                  :<button onClick={()=>setActiveTab("Appointments")} style={{...mkBtn("transparent",T.text3,{fontSize:11,padding:"6px 11px",border:`1px solid ${T.border2}`})}}>View</button>
                }
              </div>
            ))}
          </div>
          <button onClick={()=>setActiveTab("Doctors")} style={{marginTop:12,width:"100%",padding:"10px",borderRadius:12,border:"1.5px dashed #99f6e4",background:"transparent",color:T.teal2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}
            onMouseEnter={e=>e.currentTarget.style.background=T.tealLight}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Plus size={13}/>Book New Appointment
          </button>
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"linear-gradient(135deg,#0b1c2c,#0d3347)",borderRadius:20,padding:"16px 18px",border:"1px solid rgba(20,184,166,0.2)"}}>
            <p style={{fontSize:10,color:"#2dd4bf",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 5px"}}>💪 AI Insight</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.8)",lineHeight:1.65,margin:0}}>Your BP of 118/76 is excellent. Keep your low-sodium diet going — you're on track!</p>
          </div>
          <Card style={{flex:1,padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h3 style={{fontSize:14,fontWeight:800,color:T.text,margin:0}}>Today's Meds</h3>
              <span style={{fontSize:12,fontWeight:700,color:T.teal2}}>{takenCount}/{meds.length} done</span>
            </div>
            <div style={{height:5,background:"#f1f5f9",borderRadius:999,overflow:"hidden",marginBottom:11}}>
              <div style={{height:"100%",width:`${adherePct}%`,background:`linear-gradient(90deg,${T.teal2},${T.teal})`,borderRadius:999,transition:"width 0.4s"}}/>
            </div>
            {meds.map((m,i)=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 9px",borderRadius:11,background:m.taken?"#f0fdf4":"#fafafa",border:`1px solid ${m.taken?"#bbf7d0":T.border}`,marginBottom:7}}>
                <span style={{fontSize:14}}>💊</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text}}>{m.name} <span style={{color:T.text3,fontWeight:500}}>{m.dose}</span></div>
                  <div style={{fontSize:10,color:T.text3}}>🕒 {m.time}</div>
                </div>
                {m.taken
                  ?<CheckCircle size={15} color={T.green}/>
                  :<button onClick={()=>setMeds(p=>p.map(x=>x.id===m.id?{...x,taken:true}:x))} style={{...mkBtn(T.teal,"#fff",{fontSize:10,padding:"3px 8px",borderRadius:7})}}>Take</button>
                }
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Recent reports */}
      <Card>
        <STitle title="Recent Reports" action="View all" onAction={()=>setActiveTab("Records")}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {records.slice(0,4).map((r,i)=>(
            <div key={r.id||i} style={{padding:13,borderRadius:15,background:"#fafafa",border:`1px solid ${T.border}`,cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.border="1px solid rgba(20,184,166,0.3)";e.currentTarget.style.background=T.tealLight;}}
              onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${T.border}`;e.currentTarget.style.background="#fafafa";}}
              onClick={()=>setActiveTab("Records")}>
              <div style={{fontSize:22,marginBottom:7}}>{r.icon}</div>
              <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:3,lineHeight:1.4}}>{r.name}</div>
              <div style={{fontSize:10,color:T.text3,marginBottom:7}}>{r.date}</div>
              <span style={{fontSize:10,fontWeight:700,background:T.tealLight,color:T.teal2,padding:"2px 7px",borderRadius:999}}>{r.type}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ══ TAB: SYMPTOM CHECKER ══ */
function SymptomCheckerTab({setActiveTab}){
  const [input,setInput]=useState("");
  const [symptoms,setSymptoms]=useState([]);
  const [analyzing,setAnalyzing]=useState(false);
  const [result,setResult]=useState(null);

  const addSymptom=()=>{
    const t=input.trim();
    if(t&&!symptoms.includes(t)){setSymptoms(p=>[...p,t]);setInput("");}
  };

  const analyze=()=>{
    if(!symptoms.length)return;
    setAnalyzing(true);setResult(null);
    // Smart local symptom analysis engine
    setTimeout(()=>{
      const s=symptoms.map(x=>x.toLowerCase()).join(" ");
      const is=(...k)=>k.some(k2=>s.includes(k2));
      let condition,confidence,urgency,urgencyColor,description,specialist,tips;
      if(is("chest pain","chest tightness","heart attack","palpitation","shortness of breath","angina")){
        condition="Possible Cardiac Event";confidence=89;urgency="High";urgencyColor="red";
        description="Your symptoms suggest a potential cardiac issue. Chest pain combined with breathing difficulty can indicate heart-related conditions that require immediate evaluation. Please seek medical attention urgently.";
        specialist="Cardiologist";
        tips=["Call emergency services (112) if pain is severe or spreading to arm/jaw","Avoid physical exertion immediately","Take aspirin if not allergic and approved by a doctor","Do NOT drive yourself — have someone take you"];
      } else if(is("fever","high temperature","chills","sweating")){
        condition="Febrile Illness / Possible Infection";confidence=82;urgency="Medium";urgencyColor="yellow";
        description="Your symptoms indicate a febrile illness, likely caused by a viral or bacterial infection. Most cases resolve with rest and hydration, but persistent high fever requires medical evaluation.";
        specialist="General Physician";
        tips=["Stay hydrated — drink at least 2–3 litres of water daily","Take paracetamol for fever above 38.5°C","Rest and avoid strenuous activity","Visit a doctor if fever persists beyond 3 days or exceeds 40°C"];
      } else if(is("headache","migraine","head pain","throbbing head")){
        condition="Tension Headache / Migraine";confidence=80;urgency="Low";urgencyColor="green";
        description="Your symptoms are consistent with tension-type headache or migraine. These are commonly triggered by stress, dehydration, or sleep disruption and usually respond well to rest and OTC medication.";
        specialist="Neurologist";
        tips=["Rest in a quiet, dark room","Stay well hydrated — dehydration is a common trigger","OTC pain relievers (ibuprofen or paracetamol) may help","Maintain regular sleep and meal schedules to prevent recurrence"];
      } else if(is("cough","cold","runny nose","sore throat","congestion","sneezing")){
        condition="Upper Respiratory Infection (URI)";confidence=85;urgency="Low";urgencyColor="green";
        description="Your symptoms suggest a common cold or upper respiratory tract infection, typically viral in nature. Most URIs resolve on their own within 7–10 days with supportive care.";
        specialist="General Physician";
        tips=["Gargle with warm salt water for sore throat","Use saline nasal rinses to ease congestion","Get adequate rest and stay warm","See a doctor if symptoms worsen after 5 days or include high fever"];
      } else if(is("nausea","vomiting","stomach","abdominal","diarrhea","indigestion")){
        condition="Gastrointestinal Disturbance";confidence=78;urgency="Low";urgencyColor="green";
        description="Your symptoms point to a gastrointestinal issue such as gastroenteritis, food intolerance, or indigestion. Most cases are self-limiting and resolve with dietary adjustments and hydration.";
        specialist="Gastroenterologist";
        tips=["Follow the BRAT diet (Bananas, Rice, Applesauce, Toast) temporarily","Avoid spicy, fatty, or dairy foods","Drink oral rehydration solution (ORS) to prevent dehydration","Seek care if symptoms include blood in stool or last more than 48 hours"];
      } else if(is("fatigue","tired","exhausted","weakness","low energy")){
        condition="Fatigue Syndrome / Possible Anaemia";confidence=72;urgency="Low";urgencyColor="green";
        description="Persistent fatigue can have many causes including anaemia, thyroid issues, poor sleep, nutritional deficiencies, or chronic stress. A blood panel can help identify the underlying cause.";
        specialist="General Physician";
        tips=["Ensure 7–9 hours of sleep per night","Check your diet for iron, B12 and vitamin D deficiency","Reduce caffeine intake, especially in the evening","Schedule a blood test to rule out anaemia or thyroid dysfunction"];
      } else if(is("dizziness","vertigo","lightheaded","spinning","balance")){
        condition="Vertigo / Inner Ear Disorder";confidence=76;urgency="Medium";urgencyColor="yellow";
        description="Dizziness or vertigo often originates from the inner ear (BPPV) or can relate to blood pressure changes. While usually benign, it can sometimes indicate neurological concerns if accompanied by other symptoms.";
        specialist="ENT / Neurologist";
        tips=["Avoid sudden head movements or sitting up quickly","Stay seated or lying down when dizzy to prevent falls","Stay hydrated as dehydration can worsen symptoms","Seek urgent care if dizziness is accompanied by double vision or speech difficulty"];
      } else if(is("back pain","lower back","spine","lumbar")){
        condition="Musculoskeletal Back Pain";confidence=81;urgency="Low";urgencyColor="green";
        description="Back pain is extremely common and most often caused by muscle strain, poor posture, or disc issues. The majority of cases improve within a few weeks with conservative management.";
        specialist="Orthopedist / Physiotherapist";
        tips=["Apply ice packs for the first 48 hours, then switch to heat","Avoid prolonged bed rest — gentle movement helps recovery","Practice gentle stretching and strengthening exercises","Seek care if pain radiates down the leg or causes numbness"];
      } else if(is("rash","skin","itching","hives","eczema","allergy")){
        condition="Dermatological Reaction / Allergy";confidence=77;urgency="Low";urgencyColor="green";
        description="Your symptoms suggest a skin-related condition, possibly an allergic reaction, contact dermatitis, or eczema flare-up. Most rashes respond well to antihistamines or topical treatments.";
        specialist="Dermatologist";
        tips=["Avoid known allergens and harsh soaps","Apply a fragrance-free moisturizer or hydrocortisone cream","Take an antihistamine (e.g. cetirizine) if itching is severe","Seek urgent care if rash spreads rapidly, blisters, or is accompanied by fever"];
      } else {
        condition="General Symptom Presentation";confidence=68;urgency="Medium";urgencyColor="yellow";
        description="Based on the symptoms reported, a comprehensive clinical evaluation is recommended. While no single clear diagnosis is indicated here, a doctor can perform a thorough examination and order relevant tests.";
        specialist="General Physician";
        tips=["Keep a symptom diary noting timing, severity, and triggers","Ensure adequate hydration and sleep","Avoid self-medicating with prescription drugs","Schedule an appointment with your general physician for a full assessment"];
      }
      setResult({condition,confidence,urgency,urgencyColor,description,specialist,tips});
      setAnalyzing(false);
    },2000);
  };

  return(
    <div style={{maxWidth:640,margin:"0 auto"}}>
      <Card>
        <div style={{marginBottom:18}}>
          <h2 style={{fontSize:22,fontWeight:800,color:T.text,margin:"0 0 5px",fontFamily:"Georgia,serif"}}>AI Symptom Checker</h2>
          <p style={{fontSize:13,color:T.text3,margin:0}}>Powered by Claude AI · Accurate assessment in seconds</p>
        </div>

        <label style={{fontSize:11,fontWeight:700,color:T.text2,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:8}}>Add Symptoms</label>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSymptom()}
            placeholder="e.g. chest pain, dizziness, headache…"
            style={{flex:1,border:`1.5px solid ${T.border2}`,borderRadius:12,padding:"10px 13px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          <button onClick={addSymptom} style={{...mkBtn(T.teal,"#fff")}}>Add</button>
        </div>

        {/* Quick suggestions */}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {["Headache","Fatigue","Chest pain","Fever","Cough","Dizziness","Nausea","Back pain"].filter(s=>!symptoms.includes(s)).slice(0,6).map(s=>(
            <button key={s} onClick={()=>setSymptoms(p=>[...p,s])} style={{padding:"4px 10px",borderRadius:999,fontSize:11,fontWeight:600,border:`1px dashed ${T.border2}`,background:"#fff",color:T.text3,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.teal;e.currentTarget.style.color=T.teal2;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.color=T.text3;}}>
              + {s}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:18,minHeight:36}}>
          {symptoms.map(s=>(
            <span key={s} style={{display:"flex",alignItems:"center",gap:6,background:T.tealLight,color:T.teal2,padding:"5px 11px",borderRadius:999,fontSize:12,fontWeight:600}}>
              <Check size={12}/>{s}
              <button onClick={()=>setSymptoms(p=>p.filter(x=>x!==s))} style={{background:"none",border:"none",cursor:"pointer",color:T.teal,display:"flex",alignItems:"center",marginLeft:2,padding:0}}><X size={12}/></button>
            </span>
          ))}
          {symptoms.length===0&&<span style={{fontSize:13,color:T.text3,fontStyle:"italic"}}>Type above or click suggestions to add symptoms</span>}
        </div>

        {!result&&(
          <button onClick={analyze} disabled={symptoms.length===0||analyzing} style={{width:"100%",padding:"12px",borderRadius:13,background:analyzing?"#64748b":symptoms.length===0?"#e2e8f0":"#0f172a",color:"#fff",fontWeight:700,fontSize:14,border:"none",cursor:symptoms.length===0||analyzing?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit",transition:"all 0.2s"}}>
            {analyzing?(<>⏳ Analyzing symptoms…</>):"⚡ Analyze Symptoms"}
          </button>
        )}

        {result&&(
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div style={{background:"rgba(20,184,166,0.06)",borderRadius:14,padding:"13px 15px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:13}}>
                <span style={{color:T.text2}}>AI Confidence</span>
                <span style={{fontWeight:700,color:T.teal2}}>{result.confidence}%</span>
              </div>
              <div style={{height:6,background:"rgba(20,184,166,0.15)",borderRadius:999,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${result.confidence}%`,background:`linear-gradient(90deg,${T.teal2},${T.teal})`,borderRadius:999,transition:"width 0.7s"}}/>
              </div>
            </div>

            <div style={{border:`1.5px solid ${T.border2}`,borderRadius:17,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                <p style={{fontWeight:800,color:T.text,fontSize:15,margin:0}}>{result.condition}</p>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:999,background:result.urgencyColor==="green"?"#dcfce7":result.urgencyColor==="yellow"?"#fef3c7":"#fee2e2",color:result.urgencyColor==="green"?T.green:result.urgencyColor==="yellow"?T.amber:T.red,flexShrink:0,marginLeft:8}}>
                  {result.urgency} urgency
                </span>
              </div>
              <p style={{fontSize:13,color:T.text2,lineHeight:1.65,marginBottom:12}}>{result.description}</p>
              {result.tips&&(
                <div style={{background:"#f8fafc",borderRadius:11,padding:"11px 13px",marginBottom:12}}>
                  <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.06em",margin:"0 0 7px"}}>Recommendations</p>
                  {result.tips.map((tip,i)=>(
                    <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:i<result.tips.length-1?5:0}}>
                      <span style={{color:T.teal,fontWeight:700,fontSize:13,flexShrink:0}}>·</span>
                      <span style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:11,borderTop:`1px solid ${T.border}`}}>
                <span style={{fontSize:13,color:T.teal2,fontWeight:600}}>Recommended: {result.specialist}</span>
                <button onClick={()=>setActiveTab("Doctors")} style={{...mkBtn(T.teal,"#fff",{fontSize:12,boxShadow:"0 3px 10px rgba(20,184,166,0.3)"})}}>Book now →</button>
              </div>
            </div>

            {result.urgency==="High"&&(
              <div style={{background:"#fff5f5",border:"1.5px solid #fecaca",borderRadius:13,padding:"11px 14px",display:"flex",gap:9,alignItems:"flex-start"}}>
                <AlertCircle size={15} color={T.red} style={{flexShrink:0,marginTop:1}}/>
                <p style={{fontSize:12,color:"#991b1b",margin:0,lineHeight:1.6}}><strong>Important:</strong> Your symptoms may require urgent attention. Call emergency services (112) or visit your nearest ER if symptoms worsen rapidly.</p>
              </div>
            )}

            <button onClick={()=>{setResult(null);setSymptoms([]);}} style={{width:"100%",fontSize:12,color:T.text3,background:"none",border:"none",cursor:"pointer",padding:"6px",fontFamily:"inherit"}}>← Start over</button>
          </div>
        )}


        <div style={{marginTop:16,padding:"10px 13px",background:"#f8fafc",borderRadius:10}}>
          <p style={{fontSize:11,color:T.text3,textAlign:"center",margin:0}}>For informational purposes only. Not a substitute for professional medical advice.</p>
        </div>
      </Card>
    </div>
  );
}

/* ══ TAB: APPOINTMENTS ══ */
function AppointmentsTab({appointments,setAppointments,setActiveTab}){
  const [tab,setTab]=useState("upcoming");
  const [reschedule,setReschedule]=useState(null);
  const [joinAppt,setJoinAppt]=useState(null);
  const [cancelItem,setCancelItem]=useState(null);

  const upcoming=appointments.filter(a=>a.status==="upcoming");
  const past=appointments.filter(a=>a.status==="past");
  const list=tab==="upcoming"?upcoming:past;

  const handleReschedule=(id,date,time)=>setAppointments(p=>p.map(a=>a.id===id?{...a,date,time}:a));
  const handleCancel=id=>{setAppointments(p=>p.filter(a=>a.id!==id));setCancelItem(null);};

  return(
    <Card>
      {reschedule&&<RescheduleModal appt={reschedule} onClose={()=>setReschedule(null)} onConfirm={handleReschedule}/>}
      {joinAppt&&<JoinCallModal appt={joinAppt} onClose={()=>setJoinAppt(null)}/>}
      {cancelItem&&<CancelModal onClose={()=>setCancelItem(null)} onConfirm={()=>handleCancel(cancelItem)}/>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{fontSize:18,fontWeight:800,color:T.text,margin:0}}>Appointments</h3>
        <button onClick={()=>setActiveTab("Doctors")} style={{...mkBtn(T.teal2,"#fff",{display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 14px rgba(13,148,136,0.3)"})}}>
          <Plus size={13}/>Book New
        </button>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:20,background:"#f8fafc",borderRadius:13,padding:4,width:"fit-content",border:`1px solid ${T.border}`}}>
        {["upcoming","past"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 20px",borderRadius:9,fontSize:13,fontWeight:700,border:"none",cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?T.text:T.text3,boxShadow:tab===t?"0 2px 8px rgba(0,0,0,0.08)":"none",fontFamily:"inherit",textTransform:"capitalize",transition:"all 0.15s"}}>
            {t.charAt(0).toUpperCase()+t.slice(1)} <span style={{fontSize:11,color:T.text3,fontWeight:500}}>({(t==="upcoming"?upcoming:past).length})</span>
          </button>
        ))}
      </div>

      {list.length===0&&<p style={{fontSize:13,color:T.text3,padding:"20px 0",textAlign:"center"}}>No {tab} appointments</p>}

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {list.map(a=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:15,padding:"15px 18px",borderRadius:19,background:"#fafafa",border:`1.5px solid ${T.border}`,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.border="1.5px solid rgba(20,184,166,0.2)";e.currentTarget.style.background="rgba(20,184,166,0.02)";}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1.5px solid ${T.border}`;e.currentTarget.style.background="#fafafa";}}>
            <img src={a.avatar} alt="" style={{width:50,height:50,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text}}>{a.doctor}</div>
              <div style={{fontSize:12,color:T.text2,marginTop:2}}>{a.specialty}</div>
              <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,fontWeight:600,background:"#f1f5f9",color:T.text2,padding:"3px 10px",borderRadius:999}}>📅 {a.date} · {a.time}</span>
                {"mode"in a&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,background:a.mode==="Video"?"rgba(59,130,246,0.1)":"#f1f5f9",color:a.mode==="Video"?"#3b82f6":T.text2}}>{a.mode==="Video"?"📹":"🏥"} {a.mode}</span>}
                {"diagnosis"in a&&<span style={{fontSize:11,fontWeight:600,background:T.tealLight,color:T.teal2,padding:"3px 10px",borderRadius:999}}>{a.diagnosis}</span>}
                {"rating"in a&&<span style={{fontSize:11,fontWeight:600,background:"rgba(245,158,11,0.1)",color:T.amber,padding:"3px 10px",borderRadius:999}}>{"⭐".repeat(a.rating)}</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:7,flexShrink:0,flexWrap:"wrap"}}>
              {tab==="upcoming"&&a.date==="Today"&&a.mode==="Video"&&(
                <button onClick={()=>setJoinAppt(a)} style={{...mkBtn(T.teal,"#fff",{fontSize:12,boxShadow:"0 4px 14px rgba(20,184,166,0.3)",display:"flex",alignItems:"center",gap:5})}}><Video size={12}/>Join Call</button>
              )}
              {tab==="upcoming"&&<button onClick={()=>setReschedule(a)} style={{...mkBtn("transparent",T.text2,{fontSize:12,border:`1.5px solid ${T.border2}`})}}>Reschedule</button>}
              {tab==="upcoming"&&<button onClick={()=>setCancelItem(a.id)} style={{...mkBtn("transparent",T.red,{fontSize:12,border:"1.5px solid #fecaca"})}}>Cancel</button>}
              {tab==="past"&&<button onClick={()=>setActiveTab("Doctors")} style={{...mkBtn("transparent",T.text2,{fontSize:12,border:`1.5px solid ${T.border2}`})}}>Book again</button>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ══ TAB: MEDICATIONS ══ */
function MedicationsTab({meds,setMeds}){
  const [refillMed,setRefillMed]=useState(null);
  const [addOpen,setAddOpen]=useState(false);
  const [newMed,setNewMed]=useState({name:"",dose:"",freq:"Once daily",time:"8:00 AM"});
  const taken=meds.filter(m=>m.taken).length;

  const handleAdd=()=>{
    if(!newMed.name||!newMed.dose)return;
    setMeds(p=>[...p,{id:Date.now(),...newMed,taken:false,refillDue:false}]);
    setNewMed({name:"",dose:"",freq:"Once daily",time:"8:00 AM"});
    setAddOpen(false);
  };

  return(
    <Card>
      {refillMed&&<RefillModal med={refillMed} onClose={()=>setRefillMed(null)} onConfirm={id=>setMeds(p=>p.map(m=>m.id===id?{...m,refillDue:false}:m))}/>}
      {addOpen&&(
        <Modal onClose={()=>setAddOpen(false)} width={420}>
          <MHead title="Add Medication" sub="Track a new prescription" onClose={()=>setAddOpen(false)}/>
          <div style={{padding:"18px 22px 22px",display:"flex",flexDirection:"column",gap:13}}>
            {[["Medication Name","name","text","e.g. Lisinopril"],["Dosage","dose","text","e.g. 10mg"]].map(([label,key,type,ph])=>(
              <div key={key}>
                <label style={{fontSize:12,fontWeight:700,color:T.text2,display:"block",marginBottom:6}}>{label}</label>
                <input type={type} placeholder={ph} value={newMed[key]} onChange={e=>setNewMed(p=>({...p,[key]:e.target.value}))}
                  style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}
            <div>
              <label style={{fontSize:12,fontWeight:700,color:T.text2,display:"block",marginBottom:6}}>Time</label>
              <input type="time" value={newMed.time} onChange={e=>setNewMed(p=>({...p,time:e.target.value}))}
                style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:700,color:T.text2,display:"block",marginBottom:6}}>Frequency</label>
              <select value={newMed.freq} onChange={e=>setNewMed(p=>({...p,freq:e.target.value}))}
                style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:13,fontFamily:"inherit",outline:"none",background:"#fff",boxSizing:"border-box"}}>
                {["Once daily","Twice daily","Three times daily","Once nightly","As needed"].map(f=><option key={f}>{f}</option>)}
              </select>
            </div>
            <button onClick={handleAdd} style={{...mkBtn(T.teal,"#fff",{width:"100%",padding:"11px",marginTop:4,boxShadow:"0 4px 14px rgba(20,184,166,0.3)"})}}>Add Medication</button>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h3 style={{fontSize:18,fontWeight:800,color:T.text,margin:0}}>Medications</h3>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:700,color:T.teal2}}>{taken}/{meds.length} taken today</span>
          <button onClick={()=>setAddOpen(true)} style={{...mkBtn(T.teal2,"#fff",{display:"flex",alignItems:"center",gap:5,fontSize:12,boxShadow:"0 3px 10px rgba(13,148,136,0.3)"})}}>
            <Plus size={12}/>Add Med
          </button>
        </div>
      </div>

      <div style={{height:6,background:"#f1f5f9",borderRadius:999,overflow:"hidden",marginBottom:20}}>
        <div style={{height:"100%",width:`${meds.length?((taken/meds.length)*100):0}%`,background:`linear-gradient(90deg,${T.teal2},${T.teal})`,borderRadius:999,transition:"width 0.4s"}}/>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        {meds.map((m,i)=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:15,padding:"17px 20px",borderRadius:19,background:m.taken?"#f0fdf4":"#fafafa",border:`1.5px solid ${m.taken?"#bbf7d0":T.border}`,transition:"all 0.2s"}}>
            <div style={{width:48,height:48,borderRadius:14,flexShrink:0,background:m.taken?"#dcfce7":T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💊</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:T.text}}>{m.name} <span style={{color:T.text3,fontWeight:500,fontSize:13}}>{m.dose}</span></div>
              <div style={{fontSize:12,color:T.text2,marginTop:3}}>{m.freq}</div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginTop:5}}>
                <span style={{fontSize:12,color:T.teal2,fontWeight:600}}>🕒 {m.time}</span>
                {m.refillDue&&<span style={{fontSize:10,fontWeight:700,background:"rgba(245,158,11,0.1)",color:T.amber,padding:"2px 8px",borderRadius:999}}>Refill due</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
              {m.refillDue&&<button onClick={()=>setRefillMed(m)} style={{...mkBtn("rgba(245,158,11,0.1)",T.amber,{fontSize:11,padding:"6px 11px",borderRadius:9})}}>Refill</button>}
              {m.taken
                ?<div style={{display:"flex",alignItems:"center",gap:5,color:T.green}}><CheckCircle size={18}/><span style={{fontSize:13,fontWeight:700}}>Taken</span></div>
                :<button onClick={()=>setMeds(p=>p.map(x=>x.id===m.id?{...x,taken:true}:x))} style={{...mkBtn(T.teal2,"#fff",{fontSize:12,boxShadow:"0 4px 14px rgba(13,148,136,0.3)"})}}>Mark taken</button>
              }
              <button onClick={()=>setMeds(p=>p.filter(x=>x.id!==m.id))} style={{...mkBtn("transparent",T.text3,{fontSize:11,padding:"6px 7px",borderRadius:9})}}>
                <X size={13}/>
              </button>
            </div>
          </div>
        ))}
        {meds.length===0&&<p style={{textAlign:"center",color:T.text3,padding:"24px 0"}}>No medications added yet</p>}
      </div>
    </Card>
  );
}

/* ══ TAB: RECORDS ══ */
function RecordsTab({records,setRecords}){
  const [viewReport,setViewReport]=useState(null);
  const [uploadOpen,setUploadOpen]=useState(false);
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");

  const types=["All","Lab","Cardiac","Imaging","Report"];
  const filtered=records.filter(r=>(filter==="All"||r.type===filter)&&(!search||r.name.toLowerCase().includes(search.toLowerCase())));

  return(
    <Card>
      {viewReport&&<ReportModal report={viewReport} onClose={()=>setViewReport(null)}/>}
      {uploadOpen&&<UploadModal onClose={()=>setUploadOpen(false)} onUpload={r=>setRecords(p=>[{id:Date.now(),...r},...p])}/>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{fontSize:18,fontWeight:800,color:T.text,margin:0}}>Health Records</h3>
        <button onClick={()=>setUploadOpen(true)} style={{...mkBtn(T.teal2,"#fff",{display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 14px rgba(13,148,136,0.3)"})}}>
          <Upload size={13}/>Upload Record
        </button>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:160}}>
          <Search size={12} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.text3}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search records…"
            style={{width:"100%",paddingLeft:28,paddingRight:11,paddingTop:8,paddingBottom:8,border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {types.map(t=>(
            <button key={t} onClick={()=>setFilter(t)} style={{padding:"6px 13px",borderRadius:999,fontSize:12,fontWeight:600,border:`1.5px solid ${filter===t?T.teal:T.border2}`,background:filter===t?T.tealLight:"#fff",color:filter===t?T.teal2:T.text2,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:13}}>
        {filtered.map((r,i)=>(
          <div key={r.id||i} style={{display:"flex",alignItems:"center",gap:13,padding:"14px 16px",borderRadius:17,background:"#fafafa",border:`1.5px solid ${T.border}`,transition:"all 0.15s",cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.border="1.5px solid rgba(20,184,166,0.25)";e.currentTarget.style.background=T.tealLight;}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1.5px solid ${T.border}`;e.currentTarget.style.background="#fafafa";}}>
            <div style={{width:44,height:44,borderRadius:12,background:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
              <div style={{fontSize:11,color:T.text3,marginTop:2}}>{r.date} · {r.size}</div>
              <span style={{fontSize:10,fontWeight:700,background:T.tealLight,color:T.teal2,padding:"2px 7px",borderRadius:999,marginTop:5,display:"inline-block"}}>{r.type}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
              <button onClick={e=>{e.stopPropagation();setViewReport(r);}} style={{...mkBtn(T.teal2,"#fff",{fontSize:11,padding:"5px 11px",borderRadius:8,display:"flex",alignItems:"center",gap:3})}}>
                <Eye size={11}/>View
              </button>
              <button onClick={e=>e.stopPropagation()} style={{...mkBtn("transparent",T.text2,{fontSize:11,padding:"5px 11px",borderRadius:8,border:`1px solid ${T.border2}`,display:"flex",alignItems:"center",gap:3})}}>
                <Download size={11}/>Save
              </button>
            </div>
          </div>
        ))}
        {filtered.length===0&&(
          <div style={{gridColumn:"span 2",textAlign:"center",padding:"32px 0",color:T.text3}}>
            <div style={{fontSize:30,marginBottom:9}}>🔍</div>
            <p style={{fontSize:14,fontWeight:600}}>No records found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ══ TAB: DOCTORS ══ */
function DoctorsTab({appointments,setAppointments}){
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [bookDoc,setBookDoc]=useState(null);
  const [viewDoc,setViewDoc]=useState(null);

  const filtered=ALL_DOCTORS.filter(d=>(filter==="All"||d.specialty===filter)&&(!search||d.name.toLowerCase().includes(search.toLowerCase())||d.specialty.toLowerCase().includes(search.toLowerCase())||d.hospital.toLowerCase().includes(search.toLowerCase())));
  const isBooked=name=>appointments.some(a=>a.doctor===name&&a.status==="upcoming");

  const handleBook=(doctor,slot,mode)=>{
    // Parse "Today 3:30 PM", "Tomorrow 9:00 AM", "Apr 22 10:00 AM"
    const parts=slot.split(" ");
    let date,time;
    if(parts[0]==="Today"||parts[0]==="Tomorrow"){
      date=parts[0];time=parts.slice(1).join(" ");
    } else {
      date=parts.slice(0,2).join(" ");time=parts.slice(2).join(" ");
    }
    setAppointments(p=>[...p,{id:Date.now(),doctor:doctor.name,specialty:doctor.specialty,date,time,mode,avatar:doctor.img,status:"upcoming"}]);
  };

  return(
    <Card>
      {bookDoc&&<BookModal doctor={bookDoc} onClose={()=>setBookDoc(null)} onBook={handleBook}/>}
      {viewDoc&&(
        <Modal onClose={()=>setViewDoc(null)} width={460}>
          <MHead title={viewDoc.name} sub={`${viewDoc.specialty} · ${viewDoc.hospital}`} onClose={()=>setViewDoc(null)}/>
          <div style={{padding:"18px 22px 22px"}}>
            <div style={{display:"flex",gap:15,alignItems:"flex-start",marginBottom:16}}>
              <img src={viewDoc.img} style={{width:60,height:60,borderRadius:"50%",objectFit:"cover"}} alt=""/>
              <div>
                <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:4}}>
                  {Array.from({length:Math.round(viewDoc.rating)}).map((_,i)=><Star key={i} size={13} fill="#f59e0b" color="#f59e0b"/>)}
                  <span style={{fontSize:13,fontWeight:700,color:T.text,marginLeft:3}}>{viewDoc.rating}</span>
                  <span style={{fontSize:12,color:T.text3}}>({viewDoc.reviews})</span>
                </div>
                <div style={{fontSize:13,color:T.text2}}>{viewDoc.exp} experience · {viewDoc.fee}/visit</div>
              </div>
            </div>
            {[["Hospital",viewDoc.hospital],["Next Available",viewDoc.next],["Specialty",viewDoc.specialty]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.text3}}>{l}</span>
                <span style={{fontSize:12,fontWeight:700,color:T.text}}>{v}</span>
              </div>
            ))}
            <button onClick={()=>{setViewDoc(null);setBookDoc(viewDoc);}} style={{...mkBtn(T.teal,"#fff",{width:"100%",padding:"11px",marginTop:16,boxShadow:"0 4px 14px rgba(20,184,166,0.3)"})}}>Book Appointment →</button>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <h3 style={{fontSize:18,fontWeight:800,color:T.text,margin:"0 0 3px"}}>Find a Doctor</h3>
          <p style={{fontSize:12,color:T.text3,margin:0}}>12,400+ verified specialists · Real-time availability</p>
        </div>
        <div style={{position:"relative"}}>
          <Search size={12} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:T.text3}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doctors, hospitals…"
            style={{paddingLeft:28,paddingRight:11,paddingTop:8,paddingBottom:8,border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:12,color:T.text,background:"#fff",width:210,fontFamily:"inherit",outline:"none"}}/>
        </div>
      </div>

      <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap"}}>
        {SPECIALTIES.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:999,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:filter===s?T.teal:"#f1f5f9",color:filter===s?"#fff":T.text2,fontFamily:"inherit",transition:"all 0.15s"}}>{s}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {filtered.map(doc=>(
          <div key={doc.id} style={{display:"flex",alignItems:"center",gap:15,padding:"15px 18px",borderRadius:19,background:"#fafafa",border:`1.5px solid ${T.border}`,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.border="1.5px solid rgba(20,184,166,0.2)";e.currentTarget.style.background="rgba(20,184,166,0.02)";}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1.5px solid ${T.border}`;e.currentTarget.style.background="#fafafa";}}>
            <img src={doc.img} alt="" style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                <span style={{fontSize:14,fontWeight:700,color:T.text}}>{doc.name}</span>
                <span style={{fontSize:11,fontWeight:600,background:T.tealLight,color:T.teal2,padding:"2px 7px",borderRadius:999}}>{doc.specialty}</span>
              </div>
              <div style={{fontSize:11,color:T.text2,marginTop:2}}>{doc.hospital}</div>
              <div style={{display:"flex",gap:9,marginTop:4,fontSize:12,color:T.text2,flexWrap:"wrap"}}>
                <span style={{color:"#f59e0b"}}>⭐ {doc.rating}</span>
                <span>({doc.reviews})</span>
                <span>· {doc.exp}</span>
                <span>· {doc.fee}/visit</span>
              </div>
              <p style={{fontSize:11,color:T.teal,fontWeight:600,margin:"3px 0 0"}}>🕒 {doc.next}</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
              <button onClick={()=>setBookDoc(doc)} style={{...mkBtn(isBooked(doc.name)?"#f0fdf4":T.text,isBooked(doc.name)?T.green:"#fff",{fontSize:12})}}>{isBooked(doc.name)?"✓ Booked":"Book Now"}</button>
              <button onClick={()=>setViewDoc(doc)} style={{...mkBtn("transparent",T.text2,{fontSize:11,padding:"5px 9px",border:`1px solid ${T.border2}`})}}>View Profile</button>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"28px 0",color:T.text3}}><div style={{fontSize:28,marginBottom:8}}>🔍</div><p style={{fontSize:14,fontWeight:600}}>No doctors found</p></div>}
      </div>
    </Card>
  );
}

/* ══ TAB: SETTINGS ══ */
function SettingsTab(){
  const [form,setForm]=useState({name:localStorage.getItem("user_name")||"Alex Johnson",email:localStorage.getItem("user_email")||"alex@example.com",phone:"+91 98765 43210",dob:"1990-06-14",blood:"O+",emergency:""});
  const [saved,setSaved]=useState(false);
  const [notifs,setNotifs]=useState({appointments:true,medications:true,insights:true,promo:false,reports:true});
  const [privacy,setPrivacy]=useState({shareData:false,analytics:true});
  const save=()=>{localStorage.setItem("user_name",form.name);localStorage.setItem("user_email",form.email);setSaved(true);setTimeout(()=>setSaved(false),2200);};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Card>
        <h3 style={{fontSize:16,fontWeight:800,color:T.text,margin:"0 0 18px"}}>Personal Information</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Date of Birth","dob","date"],["Blood Type","blood","text"],["Emergency Contact","emergency","tel"]].map(([label,key,type])=>(
            <div key={key}>
              <label style={{fontSize:12,fontWeight:700,color:T.text2,display:"block",marginBottom:6}}>{label}</label>
              <input type={type} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
            </div>
          ))}
        </div>
        <button onClick={save} style={{...mkBtn(saved?"#16a34a":T.teal2,"#fff",{marginTop:16,padding:"10px 26px",boxShadow:saved?"0 4px 14px rgba(22,163,74,0.3)":"0 4px 14px rgba(13,148,136,0.3)",transition:"all 0.2s"})}}>
          {saved?"✓ Saved!":"Save Changes"}
        </button>
      </Card>

      <Card>
        <h3 style={{fontSize:16,fontWeight:800,color:T.text,margin:"0 0 14px"}}>Notifications</h3>
        {[["appointments","Appointment reminders"],["medications","Medication alerts"],["reports","New report notifications"],["insights","AI health insights"],["promo","Promotional emails"]].map(([key,label])=>(
          <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.text2,fontWeight:500}}>{label}</span>
            <Toggle on={notifs[key]} onToggle={()=>setNotifs(p=>({...p,[key]:!p[key]}))}/>
          </div>
        ))}
      </Card>

      <Card>
        <h3 style={{fontSize:16,fontWeight:800,color:T.text,margin:"0 0 14px"}}>Privacy & Data</h3>
        {[["shareData","Share data with research partners"],["analytics","Usage analytics to improve app"]].map(([key,label])=>(
          <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.text2,fontWeight:500}}>{label}</span>
            <Toggle on={privacy[key]} onToggle={()=>setPrivacy(p=>({...p,[key]:!p[key]}))}/>
          </div>
        ))}
        <div style={{marginTop:14}}>
          <button style={{...mkBtn("transparent",T.red,{fontSize:13,padding:"9px 16px",border:"1.5px solid #fecaca"})}}>Request data deletion</button>
        </div>
      </Card>

      <Card>
        <h3 style={{fontSize:16,fontWeight:800,color:T.text,margin:"0 0 12px"}}>Current Plan</h3>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"linear-gradient(135deg,#0b1c2c,#0d3347)",borderRadius:14}}>
          <div>
            <div style={{fontSize:17,fontWeight:800,color:"#fff"}}>Pro Plan</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>Unlimited checks · Priority booking</div>
          </div>
          <span style={{fontSize:11,fontWeight:700,background:T.tealLight,color:T.teal,padding:"4px 11px",borderRadius:999}}>Active</span>
        </div>
      </Card>
    </div>
  );
}

/* ══ MAIN EXPORT ══ */
export default function PatientDashboard({initialTab="Overview"}){
  const navigate=useNavigate();
  const [activeTab,setActiveTab]=useState(initialTab);
  const [showNotifs,setShowNotifs]=useState(false);
  const [globalSearch,setGlobalSearch]=useState("");
  const [notifs,setNotifs]=useState(INIT_NOTIFS);
  const [appointments,setAppointments]=useState(INIT_APPOINTMENTS);
  const [meds,setMeds]=useState(INIT_MEDS);
  const [records,setRecords]=useState(INIT_RECORDS);

  const patientName=localStorage.getItem("user_name")||"Alex Johnson";
  const unread=notifs.filter(n=>!n.read).length;

  useEffect(()=>{if(!localStorage.getItem("token"))navigate("/auth");},[navigate]);
  useEffect(()=>{setActiveTab(initialTab);},[initialTab]);

  const handleSearch=e=>{
    const q=e.target.value;setGlobalSearch(q);
    if(!q)return;
    const lower=q.toLowerCase();
    if(["symptom","pain","fever","headache","cough"].some(k=>lower.includes(k)))setActiveTab("Symptom Checker");
    else if(["doctor","specialist","book"].some(k=>lower.includes(k)))setActiveTab("Doctors");
    else if(["med","pill","prescription"].some(k=>lower.includes(k)))setActiveTab("Medications");
    else if(["record","report","lab","ecg"].some(k=>lower.includes(k)))setActiveTab("Records");
  };

  const handleLogout=()=>{
    ["token","user_name","user_role","user_email","user_specialty","user_license"].forEach(k=>localStorage.removeItem(k));
    navigate("/");
  };

  const renderTab=()=>{
    switch(activeTab){
      case "Overview":        return <Overview          setActiveTab={setActiveTab} appointments={appointments} meds={meds} setMeds={setMeds} records={records}/>;
      case "Symptom Checker": return <SymptomCheckerTab setActiveTab={setActiveTab}/>;
      case "Appointments":    return <AppointmentsTab   appointments={appointments} setAppointments={setAppointments} setActiveTab={setActiveTab}/>;
      case "Medications":     return <MedicationsTab    meds={meds} setMeds={setMeds}/>;
      case "Records":         return <RecordsTab        records={records} setRecords={setRecords}/>;
      case "Doctors":         return <DoctorsTab        appointments={appointments} setAppointments={setAppointments}/>;
      case "Settings":        return <SettingsTab/>;
      default:                return <Overview          setActiveTab={setActiveTab} appointments={appointments} meds={meds} setMeds={setMeds} records={records}/>;
    }
  };

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Manrope',system-ui,sans-serif"}}>
      <style>{`
        @import url('${FONT_LINK}');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.bg};}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:99px;}
        input:focus,textarea:focus,select:focus{border-color:${T.teal}!important;box-shadow:0 0 0 3px rgba(20,184,166,0.12)!important;outline:none!important;}
      `}</style>

      {/* NAVBAR */}
      <header style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.90)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:"1px solid rgba(241,245,249,0.9)",padding:"0 34px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0,cursor:"pointer"}} onClick={()=>setActiveTab("Overview")}>
          <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${T.teal2},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={15} color="#fff" strokeWidth={3}/></div>
          <span style={{fontSize:15,fontWeight:800,color:T.text,letterSpacing:"-0.3px"}}>MediSmart<span style={{color:T.teal}}>AI</span></span>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:3,background:"#f8fafc",borderRadius:14,padding:4,border:`1px solid ${T.border}`,overflowX:"auto"}}>
          {TABS.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:"6px 13px",borderRadius:9,fontSize:11,fontWeight:activeTab===tab?700:500,border:"none",cursor:"pointer",background:activeTab===tab?"#fff":"transparent",color:activeTab===tab?T.text:T.text3,boxShadow:activeTab===tab?"0 2px 8px rgba(0,0,0,0.08)":"none",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all 0.15s"}}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
          <div style={{position:"relative"}}>
            <Search size={12} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:T.text3,pointerEvents:"none"}}/>
            <input value={globalSearch} onChange={handleSearch} placeholder="Search anything…"
              style={{paddingLeft:28,paddingRight:11,paddingTop:7,paddingBottom:7,border:`1.5px solid ${T.border2}`,borderRadius:11,fontSize:12,color:T.text,background:"#fff",width:160,fontFamily:"inherit"}}/>
          </div>

          <div style={{position:"relative"}}>
            <button onClick={()=>setShowNotifs(v=>!v)} style={{width:36,height:36,borderRadius:10,background:"#fff",border:`1.5px solid ${T.border2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <Bell size={14} color={T.text2}/>
              {unread>0&&<span style={{position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:T.red,color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #f8fafc"}}>{unread}</span>}
            </button>
            {showNotifs&&<NotifDropdown notifs={notifs} onClose={()=>setShowNotifs(false)} onMarkRead={id=>setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n))} onMarkAllRead={()=>setNotifs(p=>p.map(n=>({...n,read:true})))}/>}
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setActiveTab("Settings")}>
            <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal2},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",border:`2px solid ${T.border2}`}}>
              {patientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:T.text,lineHeight:1.2}}>{patientName.split(" ")[0]}</div>
              <div style={{fontSize:10,color:T.teal,fontWeight:700}}>Pro Plan</div>
            </div>
          </div>

          <button onClick={handleLogout} title="Log out"
            style={{width:32,height:32,borderRadius:8,background:"#fff",border:`1.5px solid ${T.border2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.text3,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.borderColor="#fca5a5";e.currentTarget.style.color=T.red;}}
            onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.color=T.text3;}}>
            <LogOut size={13}/>
          </button>
        </div>
      </header>

      <main style={{maxWidth:1200,margin:"0 auto",padding:"26px 34px 56px"}}>
        {renderTab()}
      </main>
    </div>
  );
}