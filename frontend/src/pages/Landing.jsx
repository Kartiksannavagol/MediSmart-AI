// landing.jsx
import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Star, Users, Shield, Clock, Calendar } from 'lucide-react';

export default function Landing() {

  useEffect(() => {
    const preloader = document.getElementById("ms-preloader");
    const progress = document.getElementById("ms-preloader-progress");

    if (!preloader || !progress) return;

    let width = 0;

    const interval = setInterval(() => {
      width += Math.random() * 18 + 5;

      if (width >= 100) {
        width = 100;
        clearInterval(interval);

        setTimeout(() => {
          preloader.style.transition =
            "opacity 0.6s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)";
          preloader.style.opacity = "0";
          preloader.style.transform = "translateY(-100%)";

          setTimeout(() => {
            preloader.style.display = "none";
          }, 700);
        }, 200);
      }

      progress.style.width = `${width}%`;
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
   <>
    {/* ✅ PRELOADER */}
    <div
      id="ms-preloader"
      className="fixed inset-0 bg-[#0B1C2C] z-[9999] flex items-center justify-center"
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
          <div
            id="ms-preloader-progress"
            className="h-full bg-teal-400"
            style={{ width: "0%" }}
          />
        </div>

        <p className="text-white/40 text-xs uppercase tracking-widest">
          Loading your health platform
        </p>

      </div>
    </div>
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
<section id="how-it-works" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    {/* Header */}
    <div className="max-w-2xl mb-16">
      <span className="text-teal-500 text-sm font-semibold tracking-wide uppercase mb-4 block">
        How It Works
      </span>

      <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
        From symptom to specialist <br />
        <span className="italic font-light text-gray-400">
          in three simple steps.
        </span>
      </h2>

      <p className="text-gray-500 text-lg leading-relaxed">
        No confusing medical jargon. No endless waiting. Just fast, accurate guidance.
      </p>
    </div>

    {/* Steps */}
    <div className="space-y-16">

      {/* Step 01 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Text */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <span className="text-6xl font-light text-teal-500/20 leading-none select-none">
              01
            </span>
            <span className="bg-teal-100 text-teal-600 text-xs font-bold px-3 py-1.5 rounded-xl">
              30 seconds
            </span>
          </div>

          <h3 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
            Describe Your Symptoms
          </h3>

          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            Enter what you're feeling in plain language. Our AI understands medical terms and everyday descriptions equally well.
          </p>

          <div className="w-12 h-[2px] bg-teal-500 rounded-full" />
        </div>

        {/* Image */}
        <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-md">
          <img
            src="https://images.unsplash.com/photo-1643834963537-62f8ec2c2ea6"
            alt="Symptoms input"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Step 02 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Image (LEFT on desktop) */}
        <div className="lg:order-1 rounded-3xl overflow-hidden aspect-[4/3] shadow-md">
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_1f376ac7d-1767619725224.png"
            alt="AI analysis"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="lg:order-2">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-6xl font-light text-teal-500/20 leading-none select-none">
              02
            </span>
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl">
              94.7% accuracy
            </span>
          </div>

          <h3 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
            Get AI-Powered Analysis
          </h3>

          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            Our model cross-references 2.4M patient records to identify likely conditions and urgency level with 94.7% accuracy.
          </p>

          <div className="w-12 h-[2px] bg-teal-500 rounded-full" />
        </div>
      </div>

      {/* Step 03 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Text */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <span className="text-6xl font-light text-teal-500/20 leading-none select-none">
              03
            </span>
            <span className="bg-teal-100 text-teal-600 text-xs font-bold px-3 py-1.5 rounded-xl">
              Same-day slots
            </span>
          </div>

          <h3 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
            Book the Right Doctor
          </h3>

          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            AI matches you with verified specialists available today. See real-time slots, ratings, and book instantly.
          </p>

          <div className="w-12 h-[2px] bg-teal-500 rounded-full" />
        </div>

        {/* Image */}
        <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-md">
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_135574ef8-1772992346576.png"
            alt="Doctor booking"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    </div>

    {/* CTA */}
    <div className="text-center mt-16">
      <a
  href="#"
  className="inline-flex items-center gap-2 px-10 py-4 
  rounded-full text-white font-semibold text-lg
  bg-gradient-to-r from-teal-500 to-teal-400
  shadow-[0_10px_30px_rgba(20,184,166,0.5)]
  hover:shadow-[0_15px_40px_rgba(20,184,166,0.7)]
  hover:scale-105 transition-all duration-300"
>
  Get Started Free →
</a>
    </div>

  </div>
</section>

      {/* Features Section */}
<section id="features" className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6">

    {/* Header */}
    <div className="text-center max-w-2xl mx-auto mb-14">
      <span className="text-teal-500 text-sm font-semibold tracking-wide uppercase mb-4 block">
        Platform Features
      </span>

      <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
        Everything you need for <br />
        <span className="italic font-light text-gray-400">
          smarter healthcare.
        </span>
      </h2>

      <p className="text-gray-500 text-lg">
        One platform that replaces fragmented health apps, slow booking systems, and unreliable symptom searches.
      </p>
    </div>

    {/* Bento Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* Card 1 */}
      <div className="md:col-span-2 bg-[#0B1C2C] text-white p-7 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-400/10 blur-3xl"></div>

        <div className="mb-5 text-teal-300">
          💻
        </div>

        <h3 className="text-xl font-semibold mb-2">
          Clinical AI Diagnosis
        </h3>

        <p className="text-sm text-white/70 mb-6">
          Trained on 2.4M patient records across 2,847 conditions. Get differential diagnoses with confidence scores — not just a list of possibilities.
        </p>

        <div>
          <span className="text-3xl font-semibold text-teal-400">94.7%</span>
          <p className="text-xs text-white/50 mt-1">Accuracy rate</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="md:col-span-2 bg-teal-50 p-7 rounded-2xl">
        <div className="mb-5 text-teal-500">
          📅
        </div>

        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          Instant Doctor Booking
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Real-time availability from 12,400+ verified specialists. Filter by specialty, language, insurance, and same-day slots.
        </p>

        <div>
          <span className="text-3xl font-semibold text-teal-500">&lt; 2 min</span>
          <p className="text-xs text-gray-400 mt-1">Average booking time</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white p-7 rounded-2xl shadow-sm">
        <div className="mb-5 text-teal-500">
          📄
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Health Records
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Unified medical history, prescriptions, and test results in one secure timeline.
        </p>

        <div>
          <span className="text-2xl font-semibold text-teal-500">∞</span>
          <p className="text-xs text-gray-400 mt-1">Storage</p>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-gray-100 p-7 rounded-2xl">
        <div className="mb-5 text-teal-500">
          👨‍⚕️
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Doctor Network
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          40+ specialties, all board-certified. Telehealth and in-person options available.
        </p>

        <div>
          <span className="text-2xl font-semibold text-teal-500">40+</span>
          <p className="text-xs text-gray-400 mt-1">Specialties</p>
        </div>
      </div>

      {/* Card 5 */}
      <div className="md:col-span-2 bg-teal-50 p-7 rounded-2xl">
        <div className="mb-5 text-teal-500">
          🔒
        </div>

        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          HIPAA-Compliant Security
        </h3>

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

     {/* Testimonials Section */}
<section id="testimonials" className="py-20 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">

    {/* Header */}
    <div className="text-center max-w-2xl mx-auto mb-14">
      <span className="text-teal-500 text-sm font-semibold tracking-wide uppercase mb-4 block">
        Patient Stories
      </span>

      <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
        Real outcomes from <br />
        <span className="italic font-light text-gray-400">
          real patients.
        </span>
      </h2>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
      <div className="text-center p-5 bg-gray-100 rounded-2xl border">
        <p className="text-3xl font-semibold text-gray-900 mb-1">2.8M+</p>
        <p className="text-sm text-gray-500">Patients helped</p>
      </div>

      <div className="text-center p-5 bg-gray-100 rounded-2xl border">
        <p className="text-3xl font-semibold text-gray-900 mb-1">4.9/5</p>
        <p className="text-sm text-gray-500">Average rating</p>
      </div>

      <div className="text-center p-5 bg-gray-100 rounded-2xl border">
        <p className="text-3xl font-semibold text-gray-900 mb-1">98%</p>
        <p className="text-sm text-gray-500">Would recommend</p>
      </div>

      <div className="text-center p-5 bg-gray-100 rounded-2xl border">
        <p className="text-3xl font-semibold text-gray-900 mb-1">&lt; 4 hrs</p>
        <p className="text-sm text-gray-500">Avg. time to appointment</p>
      </div>
    </div>

    {/* Testimonials Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Card 1 (Featured) */}
      <div className="p-7 bg-[#0B1C2C] text-white rounded-2xl">

        {/* Stars */}
        <div className="flex gap-1 mb-5 text-teal-400">
          ⭐⭐⭐⭐⭐
        </div>

        {/* Quote */}
        <blockquote className="text-lg italic leading-relaxed mb-6 text-white/90">
          “I described chest tightness at 11 PM. MediSmart identified early-stage hypertension, matched me with a cardiologist for 8 AM the next morning. That appointment likely saved my life.”
        </blockquote>

        {/* Badge */}
        <span className="inline-block text-xs font-bold px-3 py-1 rounded-xl mb-5 bg-yellow-100 text-yellow-700">
          Hypertension detected
        </span>

        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_1c33d7f44-1763294684965.png"
            className="w-11 h-11 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <p className="font-semibold text-sm">Daniel Okafor</p>
            <p className="text-xs text-white/50">Patient · Houston, TX</p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="p-7 bg-white rounded-2xl shadow-sm">

        {/* Stars */}
        <div className="flex gap-1 mb-5 text-yellow-400">
          ⭐⭐⭐⭐⭐
        </div>

        {/* Quote */}
        <blockquote className="text-lg italic leading-relaxed mb-6 text-gray-900">
          “As a working mom, I can't spend 3 hours in a waiting room. MediSmart got my daughter's ear infection diagnosed and antibiotics prescribed in 40 minutes, start to finish.”
        </blockquote>

        {/* Badge */}
        <span className="inline-block text-xs font-bold px-3 py-1 rounded-xl mb-5 bg-green-100 text-green-700">
          Ear infection treated
        </span>

        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_11984bfac-1763296141464.png"
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-gray-900">Sofia Ramirez</p>
            <p className="text-xs text-gray-500">Patient · Miami, FL</p>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="p-7 bg-white rounded-2xl shadow-sm">

        {/* Stars */}
        <div className="flex gap-1 mb-5 text-yellow-400">
          ⭐⭐⭐⭐⭐
        </div>

        {/* Quote */}
        <blockquote className="text-lg italic leading-relaxed mb-6 text-gray-900">
          “My patient panel has grown 34% since joining MediSmart. The AI pre-screens patients so I see more complex cases — the kind of work I went to medical school for.”
        </blockquote>

        {/* Badge */}
        <span className="inline-block text-xs font-bold px-3 py-1 rounded-xl mb-5 bg-teal-100 text-teal-600">
          +34% patient growth
        </span>

        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_193b727c8-1772148634503.png"
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-gray-900">Dr. James Whitfield</p>
            <p className="text-xs text-gray-500">Cardiologist · Johns Hopkins</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

     {/* CTA Section */}
<section className="py-20 bg-[#0B1C2C] relative overflow-hidden">

  {/* Background Glow */}
  <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-teal-400/10 blur-[80px]" />
  <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-teal-300/10 blur-[60px]" />

  {/* Watermark */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
    <span className="text-[20vw] font-bold text-white/5 whitespace-nowrap">
      MediSmart
    </span>
  </div>

  <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

    {/* Badge */}
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-semibold mb-6">
      <span className="w-2 h-2 rounded-full bg-teal-400"></span>
      Free to start, no credit card required
    </span>

    {/* Heading */}
    <h2 className="text-4xl md:text-6xl font-semibold text-white leading-tight mb-6">
      Your health deserves <br />
      <span className="italic font-light text-teal-400">
        better than a web search.
      </span>
    </h2>

    {/* Description */}
    <p className="text-white/60 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
      Join 2.8 million patients who get accurate AI analysis and same-day doctor access — not forum threads and anxiety.
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">

      {/* Primary Button */}
      <a
        href="#"
        className="inline-flex items-center justify-center gap-2 px-9 py-4 
        bg-gradient-to-r from-teal-500 to-teal-400 
        text-white font-semibold rounded-full 
        shadow-[0_10px_30px_rgba(20,184,166,0.5)]
        hover:scale-105 transition-all duration-300"
      >
        ⚡ Start Free — Check Symptoms
      </a>

      {/* Secondary Button */}
      <a
        href="#"
        className="inline-flex items-center justify-center gap-2 px-9 py-4 
        border border-white/20 text-white font-semibold rounded-2xl 
        hover:bg-white/10 transition-all"
      >
        Browse Doctors
      </a>

    </div>

    {/* Trust Badges */}
    <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium tracking-wide">

      <span className="flex items-center gap-1.5">
        ✔ HIPAA Compliant
      </span>

      <span className="flex items-center gap-1.5">
        ✔ SOC 2 Type II
      </span>

      <span className="flex items-center gap-1.5">
        ✔ AMA Verified Doctors
      </span>

      <span className="flex items-center gap-1.5">
        ✔ 256-bit Encryption
      </span>

    </div>

  </div>
</section>

     <footer className="bg-gray-100 py-6 border-t">
  <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">

    {/* Left - Logo */}
    <div className="flex items-center gap-2 text-gray-900 font-medium">
      <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
      <span>
        MediSmart<span className="text-teal-500">AI</span>
      </span>
    </div>

    {/* Center - Links */}
    <div className="flex flex-wrap justify-center gap-6 text-gray-600">
      <a href="#" className="hover:text-gray-900">Features</a>
      <a href="#" className="hover:text-gray-900">How It Works</a>
      <a href="#" className="hover:text-gray-900">Privacy</a>
      <a href="#" className="hover:text-gray-900">Terms</a>
      <a href="#" className="hover:text-gray-900">Contact</a>
    </div>

    {/* Right - Social + Copyright */}
    <div className="flex items-center gap-4 text-gray-500">

      {/* X Icon */}
      <div className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-200 cursor-pointer">
        ✕
      </div>

      {/* LinkedIn Icon */}
      <div className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-200 cursor-pointer">
        in
      </div>

      <span className="text-sm">© 2026 MediSmart AI</span>
    </div>

  </div>
</footer>
    </div>
    </>
  );
}