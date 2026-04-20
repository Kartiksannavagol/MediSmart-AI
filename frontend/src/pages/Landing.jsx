// Landing.jsx — Fully Responsive
import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const isLoggedIn = () => Boolean(localStorage.getItem('token'));

function useAuthNav() {
  const navigate = useNavigate();
  const goCheckSymptoms = () => navigate(isLoggedIn() ? '/patient/dashboard?tab=symptom-checker' : '/auth');
  const goBookDoctor    = () => navigate(isLoggedIn() ? '/patient/dashboard?tab=doctors'         : '/auth');
  const goGetStarted    = () => navigate(isLoggedIn() ? '/patient/dashboard'                     : '/auth');
  return { goCheckSymptoms, goBookDoctor, goGetStarted };
}

const PLANS = [
  { name:'Free',   price:'$0',  period:'/month', color:'bg-gray-50',    badge:null,           features:['5 AI symptom checks/month','Browse doctor profiles','Basic health records','Email support'],                                                                        cta:'Get Started Free',  ctaStyle:'bg-gray-900 text-white' },
  { name:'Pro',    price:'$19', period:'/month', color:'bg-[#0B1C2C]', badge:'Most Popular', features:['Unlimited symptom checks','Priority doctor booking','Full health records & history','Video consultations','AI follow-up reminders','24/7 chat support'],          cta:'Start Pro Free',    ctaStyle:'bg-teal-500 text-white', textColor:'text-white', subColor:'text-white/60', featureColor:'text-white/80' },
  { name:'Family', price:'$39', period:'/month', color:'bg-gray-50',    badge:null,           features:['Everything in Pro','Up to 6 family members','Shared health dashboard','Pediatric specialist access','Dedicated care manager'],                                   cta:'Start Family Plan', ctaStyle:'bg-gray-900 text-white' },
];

function PricingModal({ onClose, navigate }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">No hidden fees · Cancel anytime</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition flex-shrink-0"><X size={18}/></button>
        </div>
        <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {PLANS.map(plan => (
            <div key={plan.name} className={`${plan.color} rounded-2xl p-5 sm:p-6 relative flex flex-col`}>
              {plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">{plan.badge}</span>}
              <p className={`text-sm font-semibold mb-2 ${plan.textColor||'text-gray-500'}`}>{plan.name}</p>
              <div className="flex items-end gap-1 mb-4 sm:mb-5">
                <span className={`text-3xl sm:text-4xl font-bold ${plan.textColor||'text-gray-900'}`}>{plan.price}</span>
                <span className={`text-sm mb-1 ${plan.subColor||'text-gray-400'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.featureColor||'text-gray-600'}`}>
                    <Check size={14} className="text-teal-400 flex-shrink-0 mt-0.5"/>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => { onClose(); navigate('/auth'); }} className={`w-full py-2.5 rounded-xl text-sm font-semibold ${plan.ctaStyle} hover:opacity-90 transition`}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginModal({ onClose, navigate }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSignIn = () => {
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('token','demo_token');
      localStorage.setItem('user_name', email.split('@')[0]);
      setLoading(false); onClose(); navigate('/patient/dashboard');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Log in to MediSmartAI</h2>
          <button onClick={onClose} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"><X size={18}/></button>
        </div>
        <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSignIn()}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="Enter your password" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSignIn()}/>
          </div>
          <button onClick={handleSignIn} disabled={loading} className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition shadow-lg shadow-teal-500/30 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In to Dashboard'}
          </button>
          <p className="text-center text-xs text-gray-500">Don't have an account?{' '}<span onClick={()=>{onClose();navigate('/auth');}} className="text-teal-500 font-semibold cursor-pointer hover:underline">Sign up free</span></p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { goCheckSymptoms, goBookDoctor, goGetStarted } = useAuthNav();
  const [showPricing, setShowPricing] = useState(false);
  const [showLogin,   setShowLogin]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' }); setMobileOpen(false); };

  useEffect(() => {
    const preloader = document.getElementById('ms-preloader');
    const progress  = document.getElementById('ms-preloader-progress');
    if (!preloader || !progress) return;
    let w = 0;
    const iv = setInterval(() => {
      w += Math.random() * 18 + 5;
      if (w >= 100) {
        w = 100; clearInterval(iv);
        setTimeout(() => {
          preloader.style.transition = 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)';
          preloader.style.opacity = '0'; preloader.style.transform = 'translateY(-100%)';
          setTimeout(() => { preloader.style.display = 'none'; }, 700);
        }, 200);
      }
      progress.style.width = `${w}%`;
    }, 60);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {showPricing && <PricingModal onClose={()=>setShowPricing(false)} navigate={navigate}/>}
      {showLogin   && <LoginModal  onClose={()=>setShowLogin(false)}   navigate={navigate}/>}

      {/* Preloader */}
      <div id="ms-preloader" className="fixed inset-0 bg-[#0B1C2C] z-[9998] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-500 rounded-xl flex items-center justify-center"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3}/></div>
            <span className="text-xl sm:text-2xl font-semibold text-white">MediSmart<span className="text-teal-400">AI</span></span>
          </div>
          <div className="w-40 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden"><div id="ms-preloader-progress" className="h-full bg-teal-400" style={{width:'0%'}}/></div>
          <p className="text-white/40 text-xs uppercase tracking-widest text-center">Loading your health platform</p>
        </div>
      </div>

      <div className="min-h-screen bg-white font-sans">

        {/* ══ HERO ══ */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1C2C]">
          <div className="absolute inset-0">
            <img src="https://img.rocket.new/generatedImages/rocket_gen_img_17ab12f7b-1772807980091.png" className="w-full h-full object-cover scale-110" alt="hospital"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2C]/95 via-[#0B1C2C]/85 to-[#0B1C2C]/60 md:to-transparent"/>
          </div>

          {/* Navbar */}
          <nav className="absolute top-0 left-0 w-full z-20 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3 text-white">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={4}/></div>
                <span className="text-lg sm:text-2xl font-semibold">MediSmart<span className="text-teal-400">AI</span></span>
              </div>
              <div className="hidden md:flex gap-5 lg:gap-8 text-sm font-medium text-gray-300">
                <button onClick={()=>scrollTo('features')}     className="hover:text-white transition">Features</button>
                <button onClick={()=>scrollTo('how-it-works')} className="hover:text-white transition">How It Works</button>
                <button onClick={goBookDoctor}                  className="hover:text-white transition">Doctors</button>
                <button onClick={()=>setShowPricing(true)}     className="hover:text-white transition">Pricing</button>
              </div>
              <div className="hidden md:flex items-center gap-3 lg:gap-4">
                <button onClick={()=>setShowLogin(true)} className="text-sm font-medium text-gray-300 hover:text-white transition">Log in</button>
                <button onClick={goGetStarted} className="px-4 lg:px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-teal-500/20">Get Started</button>
              </div>
              {/* Mobile */}
              <div className="flex md:hidden items-center gap-3">
                <button onClick={()=>setShowLogin(true)} className="text-xs font-medium text-gray-300 hover:text-white transition">Log in</button>
                <button onClick={()=>setMobileOpen(v=>!v)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
                  {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
                </button>
              </div>
            </div>
            {mobileOpen && (
              <div className="md:hidden mt-3 bg-[#0B1C2C]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 space-y-1">
                {[['Features',()=>scrollTo('features')],['How It Works',()=>scrollTo('how-it-works')],['Doctors',goBookDoctor],['Pricing',()=>{setShowPricing(true);setMobileOpen(false);}]].map(([label,action])=>(
                  <button key={label} onClick={action} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition">{label}</button>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <button onClick={()=>{goGetStarted();setMobileOpen(false);}} className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-semibold transition">Get Started Free</button>
                </div>
              </div>
            )}
          </nav>

          {/* Hero content */}
          <div className="relative z-10 max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-0">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs sm:text-sm backdrop-blur">✦ AI-Powered Healthcare Platform</div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-light text-white leading-tight">Smart Healthcare,</h1>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-semibold text-teal-400 leading-tight">Instant Care.</h1>
            <p className="text-gray-300 mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg leading-relaxed">
              Describe your symptoms and our AI matches you with the right specialist in under 30 seconds. Book verified doctors, manage your health — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button onClick={goCheckSymptoms} className="bg-teal-500 hover:bg-teal-400 transition px-5 sm:px-6 py-3 rounded-xl text-white font-medium shadow-lg shadow-teal-500/20 text-sm sm:text-base text-center">⚡ Check Symptoms Free</button>
              <button onClick={goBookDoctor}    className="border border-white/20 hover:bg-white/10 transition px-5 sm:px-6 py-3 rounded-xl text-white font-medium backdrop-blur text-sm sm:text-base text-center">Book a Doctor →</button>
            </div>
            <div className="flex gap-6 sm:gap-10 lg:gap-12 mt-8 sm:mt-12 text-white flex-wrap">
              {[['94.7%','Diagnostic accuracy'],['12,400+','Verified doctors'],['2.8M+','Patients helped']].map(([v,l])=>(
                <div key={l}><h3 className="text-xl sm:text-2xl font-semibold">{v}</h3><p className="text-gray-400 text-xs sm:text-sm">{l}</p></div>
              ))}
            </div>
          </div>

          {/* Doctor card — desktop only */}
          <div className="absolute right-6 lg:right-10 bottom-16 sm:bottom-20 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 lg:p-5 w-56 lg:w-64 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex-shrink-0" alt=""/>
                <div><h4 className="font-semibold text-sm">Dr. Priya Mehta</h4><p className="text-xs text-gray-300">Cardiologist</p></div>
              </div>
              <div className="mt-3 text-yellow-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐ <span className="text-gray-300">4.9 (312)</span></div>
              <div className="mt-2 text-xs text-teal-300">Next available: Today 3:30 PM</div>
              <button onClick={goBookDoctor} className="mt-3 w-full bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold py-2 rounded-xl transition">Book Now</button>
            </div>
          </div>
        </section>

        {/* ══ AI SYMPTOM SECTION ══ */}
        <section id="symptom-checker" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-teal-600 font-medium mb-2 text-xs sm:text-sm tracking-wide uppercase">AI Symptom Analysis</div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-4 sm:mb-6">
                Describe symptoms.<br/><span className="text-teal-500 italic font-light">Get answers in seconds.</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Our clinical AI, trained on 2.4 million patient records and validated by 340+ physicians, analyzes your symptoms and gives you an accurate assessment — not a generic web search result.
              </p>
              <ul className="space-y-4 sm:space-y-6">
                {[['📊','94.7% diagnostic accuracy across 2,847 conditions'],['⚡','Results in under 30 seconds, 24/7 availability'],['🔒','HIPAA-compliant, end-to-end encrypted analysis']].map(([icon,text])=>(
                  <li key={text} className="flex gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base"><span className="text-teal-500 mt-0.5 text-base sm:text-lg flex-shrink-0">{icon}</span><span>{text}</span></li>
                ))}
              </ul>
              <button onClick={goCheckSymptoms} className="mt-8 sm:mt-10 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium flex items-center gap-2 sm:gap-3 hover:bg-black transition text-sm sm:text-base">
                Try Symptom Checker <ArrowRight size={16}/>
              </button>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-5 sm:p-8 border border-gray-100">
              <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Selected Symptoms</div>
              <div className="flex flex-wrap gap-2 mb-5 sm:mb-8">
                {['Headache','Fatigue','Chest tightness','Shortness of breath'].map(s=>(
                  <div key={s} className="bg-teal-100 text-teal-700 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>{s}
                  </div>
                ))}
                <button onClick={goCheckSymptoms} className="bg-gray-100 text-gray-500 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm hover:bg-teal-100 hover:text-teal-600 transition">+ Add symptom</button>
              </div>
              <div className="bg-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5">
                <div className="flex justify-between mb-2 text-xs sm:text-sm">
                  <span className="text-gray-600">AI Analysis confidence</span>
                  <span className="font-semibold text-teal-600">87%</span>
                </div>
                <div className="h-1.5 sm:h-2 bg-teal-200 rounded-full overflow-hidden"><div className="h-full bg-teal-500 w-[87%] rounded-full"/></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                  <div className="font-semibold text-amber-800 text-sm sm:text-base">Possible Hypertension</div>
                  <div className="bg-amber-200 text-amber-700 text-xs px-2 sm:px-3 py-1 rounded-full font-semibold flex-shrink-0">Medium</div>
                </div>
                <p className="text-xs sm:text-sm text-amber-700 mb-4 sm:mb-5 leading-relaxed">Your symptoms suggest elevated blood pressure. Should be evaluated by a specialist within 48 hours.</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-amber-200">
                  <div className="text-teal-600 font-medium text-xs sm:text-sm">Recommended: Cardiologist</div>
                  <button onClick={goBookDoctor} className="bg-teal-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-teal-700 transition w-full sm:w-auto text-center">Book now →</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-16">
              <span className="text-teal-500 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 sm:mb-4 block">How It Works</span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-3 sm:mb-4">
                From symptom to specialist<br/><span className="italic font-light text-gray-400">in three simple steps.</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-lg">No confusing medical jargon. No endless waiting. Just fast, accurate guidance.</p>
            </div>
            <div className="space-y-10 sm:space-y-16">
              {[
                { n:'01', badge:'30 seconds',     badgeColor:'bg-teal-100 text-teal-600', title:'Describe Your Symptoms',       desc:"Enter what you're feeling in plain language. Our AI understands medical terms and everyday descriptions equally well.", img:'https://images.unsplash.com/photo-1643834963537-62f8ec2c2ea6?w=600&q=80', reverse:false, btnLabel:'Try it now',    btnAction:goCheckSymptoms },
                { n:'02', badge:'94.7% accuracy', badgeColor:'bg-blue-100 text-blue-600',  title:'Get AI-Powered Analysis',       desc:'Our model cross-references 2.4M patient records to identify likely conditions and urgency level with 94.7% accuracy.',       img:'https://img.rocket.new/generatedImages/rocket_gen_img_1f376ac7d-1767619725224.png',    reverse:true,  btnLabel:null },
                { n:'03', badge:'Same-day slots',  badgeColor:'bg-teal-100 text-teal-600', title:'Book the Right Doctor',         desc:'AI matches you with verified specialists available today. See real-time slots, ratings, and book instantly.',                  img:'https://img.rocket.new/generatedImages/rocket_gen_img_135574ef8-1772992346576.png',  reverse:false, btnLabel:'Book a Doctor', btnAction:goBookDoctor },
              ].map((step,i)=>(
                <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
                  <div className={step.reverse ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <span className="text-4xl sm:text-6xl font-light text-teal-500/20 leading-none select-none">{step.n}</span>
                      <span className={`text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl ${step.badgeColor}`}>{step.badge}</span>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                    <p className="text-gray-500 text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6">{step.desc}</p>
                    {step.btnLabel && (
                      <button onClick={step.btnAction} className="bg-teal-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-semibold hover:bg-teal-600 transition flex items-center gap-2">
                        {step.btnLabel} <ArrowRight size={15}/>
                      </button>
                    )}
                    <div className="w-10 sm:w-12 h-0.5 bg-teal-500 rounded-full mt-4 sm:mt-6"/>
                  </div>
                  <div className={`rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] shadow-md ${step.reverse ? 'lg:order-1' : ''}`}>
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover"/>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10 sm:mt-16">
              <button onClick={goGetStarted} className="inline-flex items-center gap-2 px-7 sm:px-10 py-3.5 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-lg bg-gradient-to-r from-teal-500 to-teal-400 shadow-[0_10px_30px_rgba(20,184,166,0.5)] hover:shadow-[0_15px_40px_rgba(20,184,166,0.7)] hover:scale-105 transition-all duration-300">
                Get Started Free →
              </button>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-teal-500 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 sm:mb-4 block">Platform Features</span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-3 sm:mb-4">
                Everything you need for<br/><span className="italic font-light text-gray-400">smarter healthcare.</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-lg">One platform that replaces fragmented health apps, slow booking systems, and unreliable symptom searches.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-2 bg-[#0B1C2C] text-white p-5 sm:p-7 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 sm:w-48 h-40 sm:h-48 rounded-full bg-teal-400/10 blur-3xl"/>
                <div className="mb-4 sm:mb-5 text-xl sm:text-2xl">💻</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Clinical AI Diagnosis</h3>
                <p className="text-xs sm:text-sm text-white/70 mb-4 sm:mb-6">Trained on 2.4M patient records across 2,847 conditions. Get differential diagnoses with confidence scores.</p>
                <div><span className="text-2xl sm:text-3xl font-semibold text-teal-400">94.7%</span><p className="text-xs text-white/50 mt-1">Accuracy rate</p></div>
                <button onClick={goCheckSymptoms} className="mt-4 sm:mt-5 text-xs text-teal-300 underline hover:text-teal-200 transition">Try symptom checker →</button>
              </div>
              <div className="sm:col-span-2 bg-teal-50 p-5 sm:p-7 rounded-2xl">
                <div className="mb-4 sm:mb-5 text-xl sm:text-2xl">📅</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Instant Doctor Booking</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Real-time availability from 12,400+ verified specialists. Filter by specialty, language, insurance, and same-day slots.</p>
                <div><span className="text-2xl sm:text-3xl font-semibold text-teal-500">&lt; 2 min</span><p className="text-xs text-gray-400 mt-1">Average booking time</p></div>
                <button onClick={goBookDoctor} className="mt-4 sm:mt-5 text-xs text-teal-600 underline hover:text-teal-700 transition">Browse doctors →</button>
              </div>
              <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm">
                <div className="mb-4 sm:mb-5 text-xl sm:text-2xl">📄</div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Health Records</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Unified medical history, prescriptions, and test results in one secure timeline.</p>
                <div><span className="text-xl sm:text-2xl font-semibold text-teal-500">∞</span><p className="text-xs text-gray-400 mt-1">Storage</p></div>
              </div>
              <div className="bg-gray-100 p-5 sm:p-7 rounded-2xl">
                <div className="mb-4 sm:mb-5 text-xl sm:text-2xl">👨‍⚕️</div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Doctor Network</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">40+ specialties, all board-certified. Telehealth and in-person options available.</p>
                <div><span className="text-xl sm:text-2xl font-semibold text-teal-500">40+</span><p className="text-xs text-gray-400 mt-1">Specialties</p></div>
                <button onClick={goBookDoctor} className="mt-3 text-xs text-teal-600 underline hover:text-teal-700 transition">See all doctors →</button>
              </div>
              <div className="sm:col-span-2 bg-teal-50 p-5 sm:p-7 rounded-2xl">
                <div className="mb-4 sm:mb-5 text-xl sm:text-2xl">🔒</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">HIPAA-Compliant Security</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">End-to-end encryption, zero-knowledge architecture, and SOC 2 Type II certification. Your health data stays yours — always.</p>
                <div><span className="text-2xl sm:text-3xl font-semibold text-teal-500">SOC 2</span><p className="text-xs text-gray-400 mt-1">Type II certified</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
              <span className="text-teal-500 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 sm:mb-4 block">Patient Stories</span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-3 sm:mb-4">
                Real outcomes from<br/><span className="italic font-light text-gray-400">real patients.</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-14">
              {[['2.8M+','Patients helped'],['4.9/5','Average rating'],['98%','Would recommend'],['< 4 hrs','Avg. to appointment']].map(([v,l])=>(
                <div key={l} className="text-center p-3 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
                  <p className="text-lg sm:text-3xl font-semibold text-gray-900 mb-1">{v}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{l}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { dark:true,  starCls:'text-teal-400',   quote:'"I described chest tightness at 11 PM. MediSmart identified early-stage hypertension, matched me with a cardiologist for 8 AM the next morning."',                                         badge:'Hypertension detected', badgeCls:'bg-yellow-100 text-yellow-700', img:'https://img.rocket.new/generatedImages/rocket_gen_img_1c33d7f44-1763294684965.png', name:'Daniel Okafor',      role:'Patient · Houston, TX' },
                { dark:false, starCls:'text-yellow-400', quote:'"As a working mom, I can\'t spend 3 hours in a waiting room. MediSmart got my daughter\'s ear infection diagnosed and antibiotics prescribed in 40 minutes."',                              badge:'Ear infection treated', badgeCls:'bg-green-100 text-green-700',   img:'https://img.rocket.new/generatedImages/rocket_gen_img_11984bfac-1763296141464.png', name:'Sofia Ramirez',       role:'Patient · Miami, FL' },
                { dark:false, starCls:'text-yellow-400', quote:'"My patient panel has grown 34% since joining MediSmart. The AI pre-screens patients so I see more complex cases — the kind of work I went to medical school for."',                           badge:'+34% patient growth',   badgeCls:'bg-teal-100 text-teal-600',    img:'https://img.rocket.new/generatedImages/rocket_gen_img_193b727c8-1772148634503.png', name:'Dr. James Whitfield', role:'Cardiologist · Johns Hopkins' },
              ].map((t,i)=>(
                <div key={i} className={`p-5 sm:p-7 ${t.dark ? 'bg-[#0B1C2C] text-white' : 'bg-white shadow-sm border border-gray-100'} rounded-2xl`}>
                  <div className={`flex gap-1 mb-4 sm:mb-5 text-xs sm:text-sm ${t.starCls}`}>⭐⭐⭐⭐⭐</div>
                  <blockquote className={`text-sm sm:text-lg italic leading-relaxed mb-4 sm:mb-6 ${t.dark ? 'text-white/90' : 'text-gray-900'}`}>{t.quote}</blockquote>
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-xl mb-4 sm:mb-5 ${t.badgeCls}`}>{t.badge}</span>
                  <div className="flex items-center gap-3">
                    <img src={t.img} className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover flex-shrink-0 ${t.dark ? 'border-2 border-white/20' : ''}`} alt=""/>
                    <div>
                      <p className={`font-semibold text-xs sm:text-sm ${t.dark ? 'text-white' : 'text-gray-900'}`}>{t.name}</p>
                      <p className={`text-xs ${t.dark ? 'text-white/50' : 'text-gray-500'}`}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="py-14 sm:py-20 bg-[#0B1C2C] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-teal-400/10 blur-[80px]"/>
          <div className="absolute bottom-0 right-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-teal-300/10 blur-[60px]"/>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[20vw] font-bold text-white/5 whitespace-nowrap">MediSmart</span>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs sm:text-sm font-semibold mb-5 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400"/> Free to start, no credit card required
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-semibold text-white leading-tight mb-4 sm:mb-6">
              Your health deserves<br/><span className="italic font-light text-teal-400">better than a web search.</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join 2.8 million patients who get accurate AI analysis and same-day doctor access — not forum threads and anxiety.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <button onClick={goCheckSymptoms} className="inline-flex items-center justify-center gap-2 px-6 sm:px-9 py-3.5 sm:py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold rounded-full shadow-[0_10px_30px_rgba(20,184,166,0.5)] hover:scale-105 transition-all duration-300 text-sm sm:text-base">⚡ Start Free — Check Symptoms</button>
              <button onClick={goBookDoctor}    className="inline-flex items-center justify-center gap-2 px-6 sm:px-9 py-3.5 sm:py-4 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-sm sm:text-base">Browse Doctors</button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/40 text-xs font-medium tracking-wide">
              {['HIPAA Compliant','SOC 2 Type II','AMA Verified Doctors','256-bit Encryption'].map(t=>(
                <span key={t} className="flex items-center gap-1.5">✔ {t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="bg-gray-100 py-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white"/></div>
              <span>MediSmart<span className="text-teal-500">AI</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-600 text-xs sm:text-sm">
              <button onClick={()=>scrollTo('features')}     className="hover:text-gray-900 transition">Features</button>
              <button onClick={()=>scrollTo('how-it-works')} className="hover:text-gray-900 transition">How It Works</button>
              <button onClick={()=>setShowPricing(true)}     className="hover:text-gray-900 transition">Pricing</button>
              <a href="#" className="hover:text-gray-900 transition">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition">Terms</a>
              <a href="#" className="hover:text-gray-900 transition">Contact</a>
            </div>
            <span className="text-gray-500 text-xs sm:text-sm">© 2026 MediSmart AI</span>
          </div>
        </footer>

      </div>
    </>
  );
}