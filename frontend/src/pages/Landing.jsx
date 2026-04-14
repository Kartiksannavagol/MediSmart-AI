// landing.jsx
import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Star, Users, Shield, Clock, Calendar } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#14b8a6] rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
        <span className="text-3xl font-semibold text-white tracking-tight">
          MediSmart<span className="text-[#14b8a6]">AI</span>
        </span>
      </div>
      <div className="w-48 h-px bg-gray-700 mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm tracking-widest">LOADING YOUR HEALTH PLATFORM</p>
    </div>
  </div>
);

export default function Landing() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <div className="min-h-screen font-sans">

  {/* HERO SECTION (with Navbar inside) */}
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1C2C]">

    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src="https://img.rocket.new/generatedImages/rocket_gen_img_17ab12f7b-1772807980091.png"
        className="w-full h-full object-cover scale-110"
        alt="hospital"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2C]/95 via-[#0B1C2C]/80 to-transparent"></div>
    </div>

    {/* ✅ NAVBAR (Now inside Hero) */}
    <nav className="absolute top-0 left-0 w-full z-20 px-8 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" strokeWidth={4} />
          </div>
          <span className="text-2xl font-semibold">
            MediSmart<span className="text-teal-400">AI</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how" className="hover:text-white transition">How It Works</a>
          <a href="#doctors" className="hover:text-white transition">Doctors</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-300 hover:text-white">
            Log in
          </button>

          <button className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-teal-500/20">
            Get Started
          </button>
        </div>

      </div>
    </nav>

    {/* Content */}
    <div className="relative z-10 max-w-7xl w-full px-8">

      {/* Badge */}
      <div className="inline-block px-4 py-2 mb-6 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm backdrop-blur">
        AI-Powered Healthcare Platform
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-7xl font-light text-white leading-tight">
        Smart Healthcare,
      </h1>

      <h1 className="text-5xl md:text-7xl font-semibold text-teal-400 leading-tight">
        Instant Care.
      </h1>

      {/* Description */}
      <p className="text-gray-300 mt-6 max-w-xl text-lg">
        Describe your symptoms and our AI matches you with the right specialist
        in under 30 seconds. Book verified doctors, manage your health — all in one place.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <a
          href="#"
          className="bg-teal-500 hover:bg-teal-400 transition px-6 py-3 rounded-xl text-white font-medium shadow-lg shadow-teal-500/20"
        >
          ⚡ Check Symptoms Free
        </a>

        <a
          href="#"
          className="border border-white/20 hover:bg-white/10 transition px-6 py-3 rounded-xl text-white font-medium backdrop-blur"
        >
          Book a Doctor →
        </a>
      </div>

      {/* Stats */}
      <div className="flex gap-12 mt-12 text-white">
        <div>
          <h3 className="text-2xl font-semibold">94.7%</h3>
          <p className="text-gray-400 text-sm">Diagnostic accuracy</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">12,400+</h3>
          <p className="text-gray-400 text-sm">Verified doctors</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">2.8M+</h3>
          <p className="text-gray-400 text-sm">Patients helped</p>
        </div>
      </div>

    </div>

    {/* Doctor Card */}
    <div className="absolute right-10 bottom-20 hidden md:block">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 w-64 text-white shadow-xl">
        
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            className="w-12 h-12 rounded-full"
            alt="doctor"
          />
          <div>
            <h4 className="font-semibold">Dr. Priya Mehta</h4>
            <p className="text-xs text-gray-300">Cardiologist</p>
          </div>
        </div>

        <div className="mt-4 text-yellow-400 text-sm">
          ⭐⭐⭐⭐⭐ <span className="text-gray-300">4.9 (312)</span>
        </div>

        <div className="mt-3 text-xs text-teal-300">
          Next available: Today 3:30 PM
        </div>

      </div>
    </div>

  </section>
</div>

      {/* AI Symptom Analysis - Third Image */}
      <section className="py-24 bg-gradient-to-b from-white to-teal-50">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-teal-600 font-medium mb-2">AI SYMPTOM ANALYSIS</div>
            <h2 className="text-5xl font-semibold leading-none mb-6">
              Describe symptoms.<br />
              <span className="text-teal-500">Get answers in seconds.</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Our clinical AI, trained on 2.4 million patient records and validated by 340+ physicians, 
              analyzes your symptoms and gives you an accurate assessment — not a generic web search result.
            </p>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="text-teal-500 mt-1">📊</div>
                <div>94.7% diagnostic accuracy across 2,847 conditions</div>
              </li>
              <li className="flex gap-4">
                <div className="text-teal-500 mt-1">⚡</div>
                <div>Results in under 30 seconds, 24/7 availability</div>
              </li>
              <li className="flex gap-4">
                <div className="text-teal-500 mt-1">🔒</div>
                <div>HIPAA-compliant, end-to-end encrypted analysis</div>
              </li>
            </ul>

            <button className="mt-10 bg-gray-900 text-white px-8 py-4 rounded-2xl font-medium flex items-center gap-3 hover:bg-black transition">
              Try Symptom Checker <ArrowRight />
            </button>
          </div>

          {/* Mock Symptom Checker UI */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-sm text-gray-500 mb-2">SELECTED SYMPTOMS</div>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Headache', 'Fatigue', 'Chest tightness', 'Shortness of breath'].map(s => (
                <div key={s} className="bg-teal-100 text-teal-700 px-4 py-1 rounded-full text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" /> {s}
                </div>
              ))}
              <div className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-sm">+ Add symptom</div>
            </div>

            <div className="bg-teal-50 rounded-2xl p-5 mb-6">
              <div className="flex justify-between mb-2">
                <div>AI Analysis confidence</div>
                <div className="font-semibold text-teal-600">87%</div>
              </div>
              <div className="h-2 bg-teal-200 rounded-full overflow-hidden">
                <div className="h-2 bg-teal-500 w-[87%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-amber-800">Possible Hypertension</div>
                  <p className="text-sm text-amber-700 mt-2">
                    Your symptoms suggest elevated blood pressure. This condition is manageable but should be evaluated by a specialist within 48 hours.
                  </p>
                </div>
                <div className="bg-amber-200 text-amber-700 text-xs px-3 py-1 rounded-full">Medium</div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-teal-600 font-medium">Recommended: Cardiologist</div>
                <button className="bg-teal-600 text-white px-6 py-2 rounded-2xl text-sm">Book now →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="text-teal-600 font-medium">HOW IT WORKS</div>
            <h2 className="text-5xl font-semibold mt-2">From symptom to specialist in three simple steps.</h2>
            <p className="text-gray-600 mt-4">No confusing medical jargon. No endless waiting. Just fast, accurate guidance.</p>
          </div>

          {/* Step 01 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="text-6xl font-light text-teal-200">01</div>
              <div className="text-teal-500 text-sm tracking-widest mt-2">30 seconds</div>
              <h3 className="text-4xl font-semibold mt-4">Describe Your Symptoms</h3>
              <p className="text-gray-600 mt-6 text-lg">
                Enter what you're feeling in plain language. Our AI understands medical terms and everyday descriptions equally well.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a035833173?q=80&w=2070" alt="Office" className="w-full" />
            </div>
          </div>

          {/* Step 02 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1559757148-5e995136c87b?q=80&w=2070" alt="AI Control Room" className="w-full" />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-6xl font-light text-teal-200">02</div>
              <div className="text-teal-500 text-sm tracking-widest mt-2">94.7% accuracy</div>
              <h3 className="text-4xl font-semibold mt-4">Get AI-Powered Analysis</h3>
              <p className="text-gray-600 mt-6 text-lg">
                Our model cross-references 2.4M patient records to identify likely conditions and urgency level with 94.7% accuracy.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-6xl font-light text-teal-200">03</div>
              <div className="text-teal-500 text-sm tracking-widest mt-2">Same-day slots</div>
              <h3 className="text-4xl font-semibold mt-4">Book the Right Doctor</h3>
              <p className="text-gray-600 mt-6 text-lg">
                AI matches you with verified specialists available today. See real-time slots, ratings, and book instantly.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1559757148-5e995136c87b?q=80&w=2070" alt="Operating Room" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="text-teal-600">PLATFORM FEATURES</div>
            <h2 className="text-5xl font-semibold mt-3">Everything you need for smarter healthcare.</h2>
            <p className="text-gray-600 mt-4">One platform that replaces fragmented health apps, slow booking systems, and unreliable symptom searches.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl">
              <div className="text-5xl font-semibold text-teal-500 mb-6">94.7%</div>
              <h4 className="font-semibold text-xl">Diagnostic Accuracy</h4>
            </div>

            <div className="bg-white p-8 rounded-3xl">
              <Calendar className="w-12 h-12 text-teal-500 mb-6" />
              <h4 className="font-semibold text-xl">Instant Doctor Booking</h4>
              <p className="text-gray-600 mt-3">Real-time availability from 12,400+ verified specialists. Average booking time &lt; 2 min.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl">
              <Shield className="w-12 h-12 text-teal-500 mb-6" />
              <h4 className="font-semibold text-xl">HIPAA-Compliant Security</h4>
              <p className="text-gray-600 mt-3">End-to-end encryption, zero-knowledge architecture, and SOC 2 Type II certification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="text-teal-600">PATIENT STORIES</div>
            <h2 className="text-5xl font-semibold">Real outcomes from real patients.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl">
              <div className="flex gap-1 text-teal-500 mb-6">
                {Array(5).fill().map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
              </div>
              <p className="italic">"As a working mom, I can't spend 3 hours in a waiting room. MediSmart got my daughter's ear infection diagnosed and antibiotics prescribed in 40 minutes, start to finish."</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl">
              <div className="flex gap-1 text-teal-500 mb-6">
                {Array(5).fill().map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
              </div>
              <p className="italic">"My patient panel has grown 34% since joining MediSmart. The AI pre-screens patients so I see more complex cases — the kind of work I went to medical school for."</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl">
              <div className="flex gap-1 text-teal-500 mb-6">
                {Array(5).fill().map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
              </div>
              <p className="italic">"98% of patients would recommend MediSmart. The speed and accuracy are unmatched."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0a0f1c] text-white py-28">
        <div className="max-w-4xl mx-auto text-center px-8">
          <div className="inline-block bg-teal-500/10 text-teal-400 text-sm px-6 py-2 rounded-full mb-6">
            Free to start, no credit card required
          </div>
          <h2 className="text-6xl font-semibold leading-none mb-6">
            Your health deserves<br />
            <span className="text-teal-400">better than a web search.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join 2.8 million patients who get accurate AI analysis and same-day doctor access — not forum threads and anxiety.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-teal-500 hover:bg-teal-600 px-10 py-5 rounded-2xl text-lg font-medium flex items-center justify-center gap-3">
              ⚡ Start Free — Check Symptoms
            </button>
            <button className="border border-white/50 hover:bg-white/10 px-10 py-5 rounded-2xl text-lg font-medium">
              Browse Doctors
            </button>
          </div>

          <div className="flex justify-center gap-8 mt-12 text-sm text-gray-400">
            <div>✔ HIPAA Compliant</div>
            <div>✔ SOC 2 Type II</div>
            <div>✔ AMA Verified Doctors</div>
            <div>✔ 256-bit Encryption</div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            MediSmartAI
          </div>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#">Features</a>
            <a href="#">How It Works</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <div>© 2026 MediSmart AI</div>
        </div>
      </footer>
    </div>
  );
}