"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  HelpCircle, 
  Frown, 
  TrendingDown, 
  Clock, 
  Compass, 
  Users, 
  Target, 
  Trophy, 
  Calendar, 
  Briefcase, 
  Award,
  TrendingUp,
  BookOpen,
  Star,
  Eye,
  Lightbulb,
  Check,
  Map,
  Sparkles,
  Phone,
  Mail,
  Home,
  Handshake,
  Heart,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EDE8] text-slate-900 font-sans selection:bg-orange-500/20 selection:text-orange-900">
      <Navbar />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6 lg:max-w-xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 leading-[1.08] tracking-tight">
              Explore Careers.<br />
              Experience The<br />
              <span className="font-caveat text-orange-500 text-6xl sm:text-7xl lg:text-8xl block mt-1 rotate-[-2deg] origin-left">
                Real World.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Helping students <span className="text-orange-500 font-semibold">explore</span>, <span className="text-orange-500 font-semibold">experience</span> and <span className="text-orange-500 font-semibold">collaborate</span> with the real world.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/questionaaire"
                className="px-8 py-4 rounded-full bg-slate-950 text-white font-bold text-base hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-3 group"
              >
                <span>Explore Assessment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Collage */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/40 via-amber-50/30 to-transparent rounded-full filter blur-3xl -z-10" />
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              src="/hero-collage.png" 
              alt="READY Hero Collage"
              className="w-full max-w-[620px] h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
        {/* Statistics grid bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              
              {/* Stat 1 */}
              <div className="flex items-start gap-3.5 pb-4 sm:pb-0 sm:pr-4">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-950 leading-none">85%</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">of jobs in 2030 don't exist yet.</p>
                  <span className="text-[8px] font-bold text-slate-400">Source: World Economic Forum</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:pl-4 sm:pr-4">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-950 leading-none">2x</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">more likely to stay in school with real-world learning.</p>
                  <span className="text-[8px] font-bold text-slate-400">Source: Attendance Works</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:pl-4 sm:pr-4">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-950 leading-none">70%</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">of employers value practical experience over grades.</p>
                  <span className="text-[8px] font-bold text-slate-400">Source: NACE</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:pl-4 sm:pr-4">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-950 leading-none">1 Exp</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">can be the moment that changes everything.</p>
                </div>
              </div>

              {/* Stat 5 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:pl-4">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-950 leading-none uppercase tracking-wide">Stronger Together</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">Better prepared students build a better future.</p>
                </div>
              </div>

            </div>
          </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-[#F5EDE8] border-t border-b border-orange-200/20 w-full">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500 text-white font-bold text-xs uppercase tracking-widest relative">
              The Problem
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600"></span>
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950">
              Students are choosing a future <span className="font-caveat text-orange-500 text-4xl sm:text-6xl inline-block rotate-[-1deg]">in the dark.</span>
            </h2>
          </div>

          {/* Road splits visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Column: Confusion */}
            <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3 text-red-400">
                  <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Confusion</span>
                </div>

                <div className="space-y-4">
                  {/* Card 1 */}
                  <div className="flex items-start gap-3.5 bg-slate-850/60 p-4 rounded-2xl border border-white/5 hover:bg-slate-800/80 transition-colors duration-200">
                    <div className="p-2 bg-slate-800 text-red-400 rounded-xl">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Too many options</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Too little clarity on where interests lie.</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="flex items-start gap-3.5 bg-slate-850/60 p-4 rounded-2xl border border-white/5 hover:bg-slate-800/80 transition-colors duration-200">
                    <div className="p-2 bg-slate-800 text-red-400 rounded-xl">
                      <Frown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Limited exposure</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Unclear career paths and job profiles.</p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="flex items-start gap-3.5 bg-slate-850/60 p-4 rounded-2xl border border-white/5 hover:bg-slate-800/80 transition-colors duration-200">
                    <div className="p-2 bg-slate-800 text-red-400 rounded-xl">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Wrong choices</h4>
                      <p className="text-xs text-slate-400 mt-0.5">High risks of pursuing mismatching studies.</p>
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="flex items-start gap-3.5 bg-slate-850/60 p-4 rounded-2xl border border-white/5 hover:bg-slate-800/80 transition-colors duration-200">
                    <div className="p-2 bg-slate-800 text-red-400 rounded-xl">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Missed potential</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Wasted time and resources on wrong degrees.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Fork Illustration */}
            <div className="lg:col-span-4 min-h-[300px] bg-slate-200 rounded-3xl overflow-hidden relative shadow-lg group">
              <img 
                src="/road-split.png" 
                alt="Student standing at fork in the road"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Right Column: Clarity */}
            <div className="lg:col-span-4 bg-white text-slate-900 rounded-3xl p-8 flex flex-col justify-between border border-slate-200 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3 text-emerald-600">
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold uppercase tracking-wider">Clarity</span>
                </div>

                <div className="space-y-4">
                  {/* Card 1 */}
                  <div className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition-colors duration-200">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Real exposure</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Real understanding of diverse career tracks.</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition-colors duration-200">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Better choices</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Less exam stress, clearer goal orientation.</p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition-colors duration-200">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Right direction</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Strong confidence in academic selection.</p>
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition-colors duration-200">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">True potential</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Real success in life and specialized skills.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom callout section */}
          <div className="flex justify-center pt-6">
            <div className="bg-orange-50 border border-orange-200/50 rounded-2xl px-8 py-6 text-center max-w-2xl relative shadow-md">
              <span className="absolute -top-3 left-6 text-orange-400 fill-orange-400">
                <Lightbulb className="w-6 h-6" />
              </span>
              <p className="text-lg sm:text-xl font-medium text-slate-800">
                They don't lack potential. <span className="font-caveat text-orange-500 text-2xl sm:text-3xl block sm:inline-block font-bold">They lack real-world exposure.</span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: WHAT WE DO */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500 border-b-2 border-orange-500 pb-1">
                What We Do
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 leading-tight">
                <span className="font-caveat text-orange-500 text-5xl sm:text-7xl block rotate-[-1deg] origin-left">
                  We create experiences
                </span>
                that shape futures.
              </h2>
            </div>

            {/* Right overlapping images & Badge */}
            <div className="lg:col-span-7 relative w-full flex items-center justify-center">
              <img 
                src="/what-we-do-collage.png" 
                alt="Experiences that shape futures collage"
                className="w-full max-w-[620px] h-auto object-contain hover:scale-[1.01] transition duration-300"
              />
            </div>

          </div>

          {/* 4 Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 space-y-4 hover:shadow-md hover:border-orange-300 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider">One-Day Career Camps</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                High-impact, interactive camps that introduce students to diverse careers and real-world possibilities.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 space-y-4 hover:shadow-md hover:border-orange-300 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider">Experience Days with Professionals</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Students step into real environments, interact with professionals and experience a day in their shoes.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 space-y-4 hover:shadow-md hover:border-orange-300 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider">Internships</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Curated internship opportunities that help students apply their learning and build real-world skills.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 space-y-4 hover:shadow-md hover:border-orange-300 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider">Competitions & Beyond</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                From competitions to ongoing guidance, we support students to grow, showcase their talent and achieve more.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: EXPLORE. EXPERIENCE. DISCOVER. */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#F5EDE8] border-t border-b border-orange-200/20 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 leading-tight">
                Explore. <span className="text-orange-500">Experience.</span><br />
                Discover What Fits.
              </h2>
              <p className="text-slate-600 text-base max-w-xl">
                A diagnostic journey that introduces students to different professions and industries through <span className="text-orange-500 font-semibold">real exposure</span>, <span className="text-orange-500 font-semibold">expert interactions</span>, and <span className="text-orange-500 font-semibold">practical learning</span>.
              </p>
            </div>

            {/* Inner Grid Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md grid grid-cols-2 gap-6">
              <div className="space-y-2 border-r border-slate-100 pr-4">
                <div className="flex items-center gap-2 text-orange-500">
                  <TrendingUp className="w-4 h-4" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider">Real Data</h4>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Understand growth metrics of industries.</p>
              </div>

              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <Lightbulb className="w-4 h-4" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider">Real Knowledge</h4>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Learn practical concepts beyond textbooks.</p>
              </div>

              <div className="space-y-2 border-r border-slate-100 pr-4 pt-2">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Users className="w-4 h-4" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider">Real Connections</h4>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Build networks and mentor relationships.</p>
              </div>

              <div className="space-y-2 pl-2 pt-2">
                <div className="flex items-center gap-2 text-indigo-500">
                  <Star className="w-4 h-4" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider">Real Impact</h4>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Make confident and informed career choices.</p>
              </div>
            </div>
          </div>

          {/* Right Image and Process Steps */}
          <div className="lg:col-span-6 space-y-8">
            {/* Student Group Photo in Blazers */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/6.8] w-full border border-white group bg-[#fbf9f4]">
              <img 
                src="/students-blazers.png" 
                alt="Students exploring careers in school blazers"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute top-4 right-4 bg-orange-500/90 text-white font-bold text-xs uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                Practical Learning
              </div>
            </div>

            {/* 3 Step Process circles */}
            <div className="flex justify-between items-center px-4 relative max-w-md mx-auto">
              {/* Connecting line */}
              <div className="absolute top-1/3 left-6 right-6 h-0.5 bg-slate-200 -z-10" />

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md font-bold text-sm border-4 border-[#fbf9f4] group-hover:scale-110 transition duration-300">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">1. Explore</h4>
                  <p className="text-[10px] text-slate-500 max-w-[100px] leading-tight mt-0.5">Discover different industries.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md font-bold text-sm border-4 border-[#fbf9f4] group-hover:scale-110 transition duration-300">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">2. Experience</h4>
                  <p className="text-[10px] text-slate-500 max-w-[100px] leading-tight mt-0.5">Interact with industry experts.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md font-bold text-sm border-4 border-[#fbf9f4] group-hover:scale-110 transition duration-300">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">3. Discover</h4>
                  <p className="text-[10px] text-slate-500 max-w-[100px] leading-tight mt-0.5">Reflect and choose what fits.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: WHY THIS MATTERS */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500 text-white font-bold text-xs uppercase tracking-widest">
              Why This Matters
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950">
              Real-world today. <span className="text-orange-500">Stronger tomorrow.</span>
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto font-normal">
              Students who engage with real-world experiences build the skills, confidence, and mindset to thrive—in school, in careers, and in life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Graphics: Student overlooking sunrise city */}
            <div className="lg:col-span-8 space-y-8 relative">
              <div className="flex justify-center">
                <img 
                  src="/student.png" 
                  alt="Student facing sunset city road"
                  className="w-[410px] h-[390px] rounded-3xl shadow-lg border border-slate-200 transition duration-300 hover:scale-[1.02]"
                />
              </div>

              {/* Connected circular badges on arc path */}
              <div className="flex justify-between flex-wrap gap-4 px-2">
                {/* Node 1 */}
                <div className="flex flex-col items-center text-center space-y-1.5 max-w-[120px] group">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border-2 border-orange-500 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer shadow-md shadow-orange-500/5">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Broader Perspective</h4>
                  <p className="text-[9px] text-slate-500">See beyond bubble and discover.</p>
                </div>
                
                {/* Node 2 */}
                <div className="flex flex-col items-center text-center space-y-1.5 max-w-[120px] group">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border-2 border-orange-500 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer shadow-md shadow-orange-500/5">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Stronger Learning</h4>
                  <p className="text-[9px] text-slate-500">Meaningful and memorable learning.</p>
                </div>

                {/* Node 3 */}
                <div className="flex flex-col items-center text-center space-y-1.5 max-w-[120px] group">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border-2 border-orange-500 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer shadow-md shadow-orange-500/5">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Career Clarity</h4>
                  <p className="text-[9px] text-slate-500">Explore and make choices early.</p>
                </div>

                {/* Node 4 */}
                <div className="flex flex-col items-center text-center space-y-1.5 max-w-[120px] group">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border-2 border-orange-500 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer shadow-md shadow-orange-500/5">
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Future-Ready Skills</h4>
                  <p className="text-[9px] text-slate-500">Learn keys to workplace success.</p>
                </div>

                {/* Node 5 */}
                <div className="flex flex-col items-center text-center space-y-1.5 max-w-[120px] group">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border-2 border-orange-500 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer shadow-md shadow-orange-500/5">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Stronger Communities</h4>
                  <p className="text-[9px] text-slate-500">Grow together for better futures.</p>
                </div>
              </div>
            </div>

            {/* Right Graphics: Notepad check list */}
            <div className="lg:col-span-4 relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl rotate-[1deg] hover:rotate-0 transition duration-300">
              {/* Note tape top */}
              <div className="absolute -top-2.5 left-1/3 w-28 h-5 bg-amber-100/50 backdrop-blur-sm border border-slate-250/20 rotate-[-1deg]" />
              
              <div className="space-y-6">
                <div className="pb-4 border-b border-dashed border-slate-200">
                  <h3 className="text-2xl font-extrabold text-slate-950">
                    Exposure changes<br />
                    <span className="font-caveat text-orange-500 text-3xl font-bold">everything.</span>
                  </h3>
                </div>

                <div className="space-y-4 font-semibold text-sm">
                  {/* Bullet 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-orange-300 text-orange-500 bg-orange-50 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Opens minds</span>
                  </div>

                  {/* Bullet 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-orange-300 text-orange-500 bg-orange-50 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Builds confidence</span>
                  </div>

                  {/* Bullet 3 */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-orange-300 text-orange-500 bg-orange-50 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Creates clarity</span>
                  </div>

                  {/* Bullet 4 */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-orange-300 text-orange-500 bg-orange-50 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Unlocks possibilities</span>
                  </div>
                </div>

                {/* Handdrawn plane illustration */}
                <div className="pt-4 text-orange-500 flex justify-end">
                  <svg className="w-8 h-8 fill-none stroke-current rotate-45" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6: LET'S SHAPE TOMORROW, TOGETHER */}
      <section className="bg-slate-55 relative w-full overflow-hidden border-t border-slate-100 pt-16">
        
        {/* Contact information details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-32 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500 text-white font-bold text-xs uppercase tracking-widest">
              Let's Shape Tomorrow, Together
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950">
              Stronger together. <span className="text-orange-500">Greater impact.</span>
            </h2>
            <p className="text-slate-650 text-base max-w-xl mx-auto font-normal">
              Let's give students the real-world exposure they need to build confident, successful futures.
            </p>
          </div>

          {/* Process steps linked by dotted lines */}
          <div className="flex justify-between items-start flex-wrap gap-8 max-w-4xl mx-auto relative px-4">
            {/* step 1 */}
            <div className="flex flex-col items-center text-center space-y-2 max-w-[150px] mx-auto group">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-orange-500 transition duration-300">
                <Home className="w-7 h-7 text-orange-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase">Schools</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">Open doors to possibilities.</p>
            </div>

            {/* step 2 */}
            <div className="flex flex-col items-center text-center space-y-2 max-w-[150px] mx-auto group">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-orange-500 transition duration-300">
                <Eye className="w-7 h-7 text-orange-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase">Real-World Exposure</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">Inspires learning and growth.</p>
            </div>

            {/* step 3: Central Circle (Students Thrive Icon) */}
            <div className="flex flex-col items-center text-center space-y-2 max-w-[150px] mx-auto group">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-orange-500 transition duration-300">
                <Sparkles className="w-7 h-7 text-orange-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase">Students Thrive</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">Confident. Skilled. Future-ready.</p>
            </div>

            {/* step 4 */}
            <div className="flex flex-col items-center text-center space-y-2 max-w-[150px] mx-auto group">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-orange-500 transition duration-300">
                <Handshake className="w-7 h-7 text-orange-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase">Partners & Mentors</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">Share knowledge, create opportunities.</p>
            </div>

            {/* step 5 */}
            <div className="flex flex-col items-center text-center space-y-2 max-w-[150px] mx-auto group">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-orange-500 transition duration-300">
                <Heart className="w-7 h-7 text-orange-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase">Stronger Communities</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">Building a better tomorrow, together.</p>
            </div>
          </div>

          {/* Bottom Banner Image overlapping Collaborate Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 w-full aspect-[1357/164] bg-slate-950 flex items-center group">
            
            <img 
              src="/footer-students-banner.png" 
              className="absolute inset-0 w-full h-full object-cover"
              alt="Students facing city banner with contact info"
            />
            
            {/* Clickable transparent overlays matching the contact box layout */}
            <a 
              href="mailto:readyfutureskills@gmail.com" 
              title="Email readyfutureskills@gmail.com"
              className="absolute right-[4.5%] bottom-[23%] w-[21%] h-[15%] rounded cursor-pointer z-20 bg-transparent hover:bg-white/5 transition-colors duration-250"
            />
            <a 
              href="tel:8121427231" 
              title="Call 8121427231"
              className="absolute right-[16.5%] bottom-[8%] w-[9%] h-[15%] rounded cursor-pointer z-20 bg-transparent hover:bg-white/5 transition-colors duration-250"
            />
          </div>

        </div>
        
      </section>

      <Footer />
    </div>
  );
}
