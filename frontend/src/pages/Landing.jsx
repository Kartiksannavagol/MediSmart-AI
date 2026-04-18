// Landing.jsx
import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   AUTH UTILITY
───────────────────────────────────────────── */
const isLoggedIn = () => Boolean(localStorage.getItem('token'));

function useAuthNav() {
  const navigate = useNavigate();
  const goCheckSymptoms = () => navigate(isLoggedIn() ? '/patient/dashboard?tab=symptom-checker' : '/auth');
  const goBookDoctor    = () => navigate(isLoggedIn() ? '/patient/dashboard?tab=doctors'         : '/auth');
  const goGetStarted    = () => navigate(isLoggedIn() ? '/patient/dashboard'                     : '/auth');
  return { goCheckSymptoms, goBookDoctor, goGetStarted };
}

/* ─────────────────────────────────────────────
   PRICING MODAL
───────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Free', price: '$0', period: '/month', color: 'bg-gray-50', badge: null,
    features: ['5 AI symptom checks/month', 'Browse doctor profiles', 'Basic health records', 'Email support'],
    cta: 'Get Started Free', ctaStyle: 'bg-gray-900 text-white',
  },
  {
    name: 'Pro', price: '$19', period: '/month', color: 'bg-[#0B1C2C]', badge: 'Most Popular',
    features: ['Unlimited symptom checks', 'Priority doctor booking', 'Full health records & history', 'Video consultations', 'AI follow-up reminders', '24/7 chat support'],
    cta: 'Start Pro Free', ctaStyle: 'bg-teal-500 text-white',
    textColor: 'text-white', subColor: 'text-white/60', featureColor: 'text-white/80',
  },
  {
    name: 'Family', price: '$39', period: '/month', color: 'bg-gray-50', badge: null,
    features: ['Everything in Pro', 'Up to 6 family members', 'Shared health dashboard', 'Pediatric specialist access', 'Dedicated care manager'],
    cta: 'Start Family Plan', ctaStyle: 'bg-gray-900 text-white',
  },
];

function PricingModal({ onClose, navigate }) {
  const handlePlanSelect = () => {
    onClose();
    navigate('/auth');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-sm text-gray-500 mt-0.5">No hidden fees · Cancel anytime</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => (
            <div key={plan.name} className={`${plan.color} rounded-2xl p-6 relative flex flex-col`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <p className={`text-sm font-semibold mb-2 ${plan.textColor || 'text-gray-500'}`}>{plan.name}</p>
              <div className="flex items-end gap-1 mb-5">
                <span className={`text-4xl font-bold ${plan.textColor || 'text-gray-900'}`}>{plan.price}</span>
                <span className={`text-sm mb-1 ${plan.subColor || 'text-gray-400'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.featureColor || 'text-gray-600'}`}>
                    <Check size={15} className="text-teal-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handlePlanSelect}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold ${plan.ctaStyle} hover:opacity-90 transition`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGIN MODAL
   — sets token, then navigates to dashboard
───────────────────────────────────────────── */
function LoginModal({ onClose, navigate }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSignIn = () => {
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    // Simulate auth — replace with real API call
    setTimeout(() => {
      localStorage.setItem('token', 'demo_token');
      localStorage.setItem('user_name', email.split('@')[0]);
      setLoading(false);
      onClose();
      navigate('/patient/dashboard');
    }, 800);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSignIn(); };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Log in to MediSmartAI</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition shadow-lg shadow-teal-500/30 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In to Dashboard'}
          </button>
          <p className="text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <span
              onClick={() => { onClose(); navigate('/auth'); }}
              className="text-teal-500 font-semibold cursor-pointer hover:underline"
            >
              Sign up free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING COMPONENT
───────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const { goCheckSymptoms, goBookDoctor, goGetStarted } = useAuthNav();

  const [showPricing, setShowPricing] = useState(false);
  const [showLogin,   setShowLogin]   = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Preloader
  useEffect(() => {
    const preloader = document.getElementById('ms-preloader');
    const progress  = document.getElementById('ms-preloader-progress');
    if (!preloader || !progress) return;
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 18 + 5;
      if (width >= 100) {
        width = 100;
        clearInterval(interval);
        setTimeout(() => {
          preloader.style.transition = 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)';
          preloader.style.opacity   = '0';
          preloader.style.transform = 'translateY(-100%)';
          setTimeout(() => { preloader.style.display = 'none'; }, 700);
        }, 200);
      }
      progress.style.width = `${width}%`;
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── Modals ── */}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} navigate={navigate} />}
      {showLogin   && <LoginModal  onClose={() => setShowLogin(false)}   navigate={navigate} />}

      {/* ── Preloader ── */}
      <div
        id="ms-preloader"
        className="fixed inset-0 bg-[#0B1C2C] z-[9998] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <span className="text-2xl font-semibold text-white">
              MediSmart<span className="text-teal-400">AI</span>
            </span>
          </div>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div id="ms-preloader-progress" className="h-full bg-teal-400" style={{ width: '0%' }} />
          </div>
          <p className="text-white/40 text-xs uppercase tracking-widest">Loading your health platform</p>
        </div>
      </div>

      <div className="min-h-screen bg-white font-sans">

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1C2C]">
          <div className="absolute inset-0">
            <img
              src="https://img.rocket.new/generatedImages/rocket_gen_img_17ab12f7b-1772807980091.png"
              className="w-full h-full object-cover scale-110"
              alt="hospital"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2C]/95 via-[#0B1C2C]/80 to-transparent" />
          </div>

          {/* NAVBAR */}
          <nav className="absolute top-0 left-0 w-full z-20 px-8 py-5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={4} />
                </div>
                <span className="text-2xl font-semibold">
                  MediSmart<span className="text-teal-400">AI</span>
                </span>
              </div>

              <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                <button onClick={() => scrollTo('features')}     className="hover:text-white transition">Features</button>
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition">How It Works</button>
                <button onClick={goBookDoctor}                   className="hover:text-white transition">Doctors</button>
                <button onClick={() => setShowPricing(true)}     className="hover:text-white transition">Pricing</button>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Log in
                </button>
                <button
                  onClick={goGetStarted}
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-teal-500/20"
                >
                  Get Started
                </button>
              </div>
            </div>
          </nav>

          {/* Hero content */}
          <div className="relative z-10 max-w-7xl w-full px-8">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm backdrop-blur">
              ✦ AI-Powered Healthcare Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-light text-white leading-tight">Smart Healthcare,</h1>
            <h1 className="text-5xl md:text-7xl font-semibold text-teal-400 leading-tight">Instant Care.</h1>
            <p className="text-gray-300 mt-6 max-w-xl text-lg">
              Describe your symptoms and our AI matches you with the right specialist in under 30 seconds.
              Book verified doctors, manage your health — all in one place.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <button
                onClick={goCheckSymptoms}
                className="bg-teal-500 hover:bg-teal-400 transition px-6 py-3 rounded-xl text-white font-medium shadow-lg shadow-teal-500/20"
              >
                ⚡ Check Symptoms Free
              </button>
              <button
                onClick={goBookDoctor}
                className="border border-white/20 hover:bg-white/10 transition px-6 py-3 rounded-xl text-white font-medium backdrop-blur"
              >
                Book a Doctor →
              </button>
            </div>
            <div className="flex gap-12 mt-12 text-white flex-wrap">
              <div><h3 className="text-2xl font-semibold">94.7%</h3><p className="text-gray-400 text-sm">Diagnostic accuracy</p></div>
              <div><h3 className="text-2xl font-semibold">12,400+</h3><p className="text-gray-400 text-sm">Verified doctors</p></div>
              <div><h3 className="text-2xl font-semibold">2.8M+</h3><p className="text-gray-400 text-sm">Patients helped</p></div>
            </div>
          </div>

          {/* Doctor card */}
          <div className="absolute right-10 bottom-20 hidden md:block">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 w-64 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-12 h-12 rounded-full" alt="doctor" />
                <div>
                  <h4 className="font-semibold">Dr. Priya Mehta</h4>
                  <p className="text-xs text-gray-300">Cardiologist</p>
                </div>
              </div>
              <div className="mt-4 text-yellow-400 text-sm">⭐⭐⭐⭐⭐ <span className="text-gray-300">4.9 (312)</span></div>
              <div className="mt-3 text-xs text-teal-300">Next available: Today 3:30 PM</div>
              <button
                onClick={goBookDoctor}
                className="mt-4 w-full bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold py-2 rounded-xl transition"
              >
                Book Now
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            AI SYMPTOM SECTION
        ══════════════════════════════════════ */}
        <section id="symptom-checker" className="py-24 bg-gradient-to-b from-white to-teal-50">
          <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-teal-600 font-medium mb-2 text-sm tracking-wide uppercase">AI Symptom Analysis</div>
              <h2 className="text-5xl font-semibold leading-none mb-6">
                Describe symptoms.<br />
                <span className="text-teal-500 italic font-light">Get answers in seconds.</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Our clinical AI, trained on 2.4 million patient records and validated by 340+ physicians,
                analyzes your symptoms and gives you an accurate assessment — not a generic web search result.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4 text-gray-700"><span className="text-teal-500 mt-1 text-lg">📊</span><span>94.7% diagnostic accuracy across 2,847 conditions</span></li>
                <li className="flex gap-4 text-gray-700"><span className="text-teal-500 mt-1 text-lg">⚡</span><span>Results in under 30 seconds, 24/7 availability</span></li>
                <li className="flex gap-4 text-gray-700"><span className="text-teal-500 mt-1 text-lg">🔒</span><span>HIPAA-compliant, end-to-end encrypted analysis</span></li>
              </ul>
              <button
                onClick={goCheckSymptoms}
                className="mt-10 bg-gray-900 text-white px-8 py-4 rounded-2xl font-medium flex items-center gap-3 hover:bg-black transition"
              >
                Try Symptom Checker <ArrowRight size={18} />
              </button>
            </div>

            {/* Mock UI */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Selected Symptoms</div>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Headache', 'Fatigue', 'Chest tightness', 'Shortness of breath'].map(s => (
                  <div key={s} className="bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" /> {s}
                  </div>
                ))}
                <button
                  onClick={goCheckSymptoms}
                  className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-sm hover:bg-teal-100 hover:text-teal-600 transition"
                >
                  + Add symptom
                </button>
              </div>
              <div className="bg-teal-50 rounded-2xl p-5 mb-5">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">AI Analysis confidence</span>
                  <span className="font-semibold text-teal-600">87%</span>
                </div>
                <div className="h-2 bg-teal-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-teal-500 w-[87%] rounded-full" />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-amber-800">Possible Hypertension</div>
                  <div className="bg-amber-200 text-amber-700 text-xs px-3 py-1 rounded-full font-semibold">Medium</div>
                </div>
                <p className="text-sm text-amber-700 mb-5 leading-relaxed">
                  Your symptoms suggest elevated blood pressure. Should be evaluated by a specialist within 48 hours.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-amber-200">
                  <div className="text-teal-600 font-medium text-sm">Recommended: Cardiologist</div>
                  <button
                    onClick={goBookDoctor}
                    className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition"
                  >
                    Book now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════ */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-16">
              <span className="text-teal-500 text-sm font-semibold tracking-wide uppercase mb-4 block">How It Works</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
                From symptom to specialist<br />
                <span className="italic font-light text-gray-400">in three simple steps.</span>
              </h2>
              <p className="text-gray-500 text-lg">No confusing medical jargon. No endless waiting. Just fast, accurate guidance.</p>
            </div>

            <div className="space-y-16">
              {[
                {
                  n: '01', badge: '30 seconds', badgeColor: 'bg-teal-100 text-teal-600',
                  title: 'Describe Your Symptoms',
                  desc: "Enter what you're feeling in plain language. Our AI understands medical terms and everyday descriptions equally well.",
                  img: 'https://images.unsplash.com/photo-1643834963537-62f8ec2c2ea6?w=600&q=80',
                  reverse: false, btnLabel: 'Try it now', btnAction: goCheckSymptoms,
                },
                {
                  n: '02', badge: '94.7% accuracy', badgeColor: 'bg-blue-100 text-blue-600',
                  title: 'Get AI-Powered Analysis',
                  desc: 'Our model cross-references 2.4M patient records to identify likely conditions and urgency level with 94.7% accuracy.',
                  img: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f376ac7d-1767619725224.png',
                  reverse: true, btnLabel: null,
                },
                {
                  n: '03', badge: 'Same-day slots', badgeColor: 'bg-teal-100 text-teal-600',
                  title: 'Book the Right Doctor',
                  desc: 'AI matches you with verified specialists available today. See real-time slots, ratings, and book instantly.',
                  img: 'https://img.rocket.new/generatedImages/rocket_gen_img_135574ef8-1772992346576.png',
                  reverse: false, btnLabel: 'Book a Doctor', btnAction: goBookDoctor,
                },
              ].map((step, i) => (
                <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  <div className={step.reverse ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-4 mb-5">
                      <span className="text-6xl font-light text-teal-500/20 leading-none select-none">{step.n}</span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${step.badgeColor}`}>{step.badge}</span>
                    </div>
                    <h3 className="text-3xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-500 text-lg leading-relaxed mb-6">{step.desc}</p>
                    {step.btnLabel && (
                      <button
                        onClick={step.btnAction}
                        className="bg-teal-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-teal-600 transition flex items-center gap-2"
                      >
                        {step.btnLabel} <ArrowRight size={16} />
                      </button>
                    )}
                    <div className="w-12 h-0.5 bg-teal-500 rounded-full mt-6" />
                  </div>
                  <div className={`rounded-3xl overflow-hidden aspect-[4/3] shadow-md ${step.reverse ? 'lg:order-1' : ''}`}>
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <button
                onClick={goGetStarted}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-teal-500 to-teal-400 shadow-[0_10px_30px_rgba(20,184,166,0.5)] hover:shadow-[0_15px_40px_rgba(20,184,166,0.7)] hover:scale-105 transition-all duration-300"
              >
                Get Started Free →
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURES
        ══════════════════════════════════════ */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-teal-500 text-sm font-semibold tracking-wide uppercase mb-4 block">Platform Features</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
                Everything you need for<br />
                <span className="italic font-light text-gray-400">smarter healthcare.</span>
              </h2>
              <p className="text-gray-500 text-lg">
                One platform that replaces fragmented health apps, slow booking systems, and unreliable symptom searches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 bg-[#0B1C2C] text-white p-7 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-400/10 blur-3xl" />
                <div className="mb-5 text-2xl">💻</div>
                <h3 className="text-xl font-semibold mb-2">Clinical AI Diagnosis</h3>
                <p className="text-sm text-white/70 mb-6">
                  Trained on 2.4M patient records across 2,847 conditions. Get differential diagnoses with confidence scores.
                </p>
                <div>
                  <span className="text-3xl font-semibold text-teal-400">94.7%</span>
                  <p className="text-xs text-white/50 mt-1">Accuracy rate</p>
                </div>
                <button
                  onClick={goCheckSymptoms}
                  className="mt-5 text-xs text-teal-300 underline hover:text-teal-200 transition"
                >
                  Try symptom checker →
                </button>
              </div>

              <div className="md:col-span-2 bg-teal-50 p-7 rounded-2xl">
                <div className="mb-5 text-2xl">📅</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Instant Doctor Booking</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Real-time availability from 12,400+ verified specialists. Filter by specialty, language, insurance, and same-day slots.
                </p>
                <div>
                  <span className="text-3xl font-semibold text-teal-500">&lt; 2 min</span>
                  <p className="text-xs text-gray-400 mt-1">Average booking time</p>
                </div>
                <button
                  onClick={goBookDoctor}
                  className="mt-5 text-xs text-teal-600 underline hover:text-teal-700 transition"
                >
                  Browse doctors →
                </button>
              </div>

              <div className="bg-white p-7 rounded-2xl shadow-sm">
                <div className="mb-5 text-2xl">📄</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Health Records</h3>
                <p className="text-sm text-gray-600 mb-6">Unified medical history, prescriptions, and test results in one secure timeline.</p>
                <div>
                  <span className="text-2xl font-semibold text-teal-500">∞</span>
                  <p className="text-xs text-gray-400 mt-1">Storage</p>
                </div>
              </div>

              <div className="bg-gray-100 p-7 rounded-2xl">
                <div className="mb-5 text-2xl">👨‍⚕️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Doctor Network</h3>
                <p className="text-sm text-gray-600 mb-6">40+ specialties, all board-certified. Telehealth and in-person options available.</p>
                <div>
                  <span className="text-2xl font-semibold text-teal-500">40+</span>
                  <p className="text-xs text-gray-400 mt-1">Specialties</p>
                </div>
                <button
                  onClick={goBookDoctor}
                  className="mt-3 text-xs text-teal-600 underline hover:text-teal-700 transition"
                >
                  See all doctors →
                </button>
              </div>

              <div className="md:col-span-2 bg-teal-50 p-7 rounded-2xl">
                <div className="mb-5 text-2xl">🔒</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">HIPAA-Compliant Security</h3>
                <p className="text-sm text-gray-600 mb-6">
                  End-to-end encryption, zero-knowledge architecture, and SOC 2 Type II certification. Your health data stays yours — always.
                </p>
                <div>
                  <span className="text-3xl font-semibold text-teal-500">SOC 2</span>
                  <p className="text-xs text-gray-400 mt-1">Type II certified</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════ */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-teal-500 text-sm font-semibold tracking-wide uppercase mb-4 block">Patient Stories</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
                Real outcomes from<br /><span className="italic font-light text-gray-400">real patients.</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
              {[['2.8M+','Patients helped'],['4.9/5','Average rating'],['98%','Would recommend'],['< 4 hrs','Avg. time to appointment']].map(([v,l]) => (
                <div key={l} className="text-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-3xl font-semibold text-gray-900 mb-1">{v}</p>
                  <p className="text-sm text-gray-500">{l}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-7 bg-[#0B1C2C] text-white rounded-2xl">
                <div className="flex gap-1 mb-5 text-teal-400 text-sm">⭐⭐⭐⭐⭐</div>
                <blockquote className="text-lg italic leading-relaxed mb-6 text-white/90">
                  "I described chest tightness at 11 PM. MediSmart identified early-stage hypertension, matched me with a cardiologist for 8 AM the next morning."
                </blockquote>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-xl mb-5 bg-yellow-100 text-yellow-700">Hypertension detected</span>
                <div className="flex items-center gap-3">
                  <img src="https://img.rocket.new/generatedImages/rocket_gen_img_1c33d7f44-1763294684965.png" className="w-11 h-11 rounded-full object-cover border-2 border-white/20" alt="" />
                  <div>
                    <p className="font-semibold text-sm">Daniel Okafor</p>
                    <p className="text-xs text-white/50">Patient · Houston, TX</p>
                  </div>
                </div>
              </div>
              <div className="p-7 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-5 text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                <blockquote className="text-lg italic leading-relaxed mb-6 text-gray-900">
                  "As a working mom, I can't spend 3 hours in a waiting room. MediSmart got my daughter's ear infection diagnosed and antibiotics prescribed in 40 minutes."
                </blockquote>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-xl mb-5 bg-green-100 text-green-700">Ear infection treated</span>
                <div className="flex items-center gap-3">
                  <img src="https://img.rocket.new/generatedImages/rocket_gen_img_11984bfac-1763296141464.png" className="w-11 h-11 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Sofia Ramirez</p>
                    <p className="text-xs text-gray-500">Patient · Miami, FL</p>
                  </div>
                </div>
              </div>
              <div className="p-7 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-5 text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                <blockquote className="text-lg italic leading-relaxed mb-6 text-gray-900">
                  "My patient panel has grown 34% since joining MediSmart. The AI pre-screens patients so I see more complex cases — the kind of work I went to medical school for."
                </blockquote>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-xl mb-5 bg-teal-100 text-teal-600">+34% patient growth</span>
                <div className="flex items-center gap-3">
                  <img src="https://img.rocket.new/generatedImages/rocket_gen_img_193b727c8-1772148634503.png" className="w-11 h-11 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Dr. James Whitfield</p>
                    <p className="text-xs text-gray-500">Cardiologist · Johns Hopkins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA SECTION
        ══════════════════════════════════════ */}
        <section className="py-20 bg-[#0B1C2C] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-teal-400/10 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-teal-300/10 blur-[60px]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[20vw] font-bold text-white/5 whitespace-nowrap">MediSmart</span>
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400" /> Free to start, no credit card required
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold text-white leading-tight mb-6">
              Your health deserves<br />
              <span className="italic font-light text-teal-400">better than a web search.</span>
            </h2>
            <p className="text-white/60 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Join 2.8 million patients who get accurate AI analysis and same-day doctor access — not forum threads and anxiety.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={goCheckSymptoms}
                className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold rounded-full shadow-[0_10px_30px_rgba(20,184,166,0.5)] hover:scale-105 transition-all duration-300"
              >
                ⚡ Start Free — Check Symptoms
              </button>
              <button
                onClick={goBookDoctor}
                className="inline-flex items-center justify-center gap-2 px-9 py-4 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all"
              >
                Browse Doctors
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium tracking-wide">
              {['HIPAA Compliant','SOC 2 Type II','AMA Verified Doctors','256-bit Encryption'].map(t => (
                <span key={t} className="flex items-center gap-1.5">✔ {t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FOOTER
        ══════════════════════════════════════ */}
        <footer className="bg-gray-100 py-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span>MediSmart<span className="text-teal-500">AI</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-gray-600">
              <button onClick={() => scrollTo('features')}     className="hover:text-gray-900 transition">Features</button>
              <button onClick={() => scrollTo('how-it-works')} className="hover:text-gray-900 transition">How It Works</button>
              <button onClick={() => setShowPricing(true)}     className="hover:text-gray-900 transition">Pricing</button>
              <a href="#" className="hover:text-gray-900 transition">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition">Terms</a>
              <a href="#" className="hover:text-gray-900 transition">Contact</a>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <span className="text-sm">© 2026 MediSmart AI</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
