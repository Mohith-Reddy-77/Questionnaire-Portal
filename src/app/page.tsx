"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  User, 
  Mail, 
  GraduationCap, 
  Sparkles, 
  Zap, 
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GlassCard } from '@/components/ui/glass-card';
import { saveCurrentStudent, clearQuestionnaireAnswers, getAllSubmissions } from '@/lib/storage';
import { StudentProfile } from '@/lib/types';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form starts completely empty - no stock/demo data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    grade: '6th Grade',
    targetYear: '2028',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    clearQuestionnaireAnswers();

    const existingSubs = getAllSubmissions();
    const studentNum = existingSubs.length + 1;
    const studentId = `STUDENT-${String(studentNum).padStart(3, '0')}`;

    const profile: StudentProfile = {
      id: studentId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      school: formData.school.trim() || 'School',
      grade: formData.grade,
      targetYear: formData.targetYear,
      primaryInterests: [],
      createdAt: new Date().toISOString(),
    };

    saveCurrentStudent(profile);
    router.push('/assessment');
  };

  const handleScrollToSetup = () => {
    const el = document.getElementById('start-setup');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0b0f19] text-slate-500 font-sans">
        <p className="text-sm font-semibold animate-pulse">Loading Diagnostic Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
        
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Hero Left Content */}
          <div className="flex-1 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>School Student Discovery Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
              Explore Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 font-bebas tracking-wide text-5xl sm:text-6xl lg:text-7xl">Dream Career Path</span> With READY Diagnostic Intelligence.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Designed specially for school students (Grades 3 to 10). Discover your natural talents, explore exciting future professions, and align your interests.
            </p>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Tailored for Grades 3rd - 10th</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Fun Diagnostic Questions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Exciting Profession Milestones</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleScrollToSetup}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group"
              >
                <Zap className="w-5 h-5 fill-white text-white" />
                <span>Start Assessment Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Hero Right Student Form Card */}
          <div id="start-setup" className="w-full lg:w-[440px] shrink-0">
            <GlassCard className="border-2 border-orange-500/30 shadow-2xl relative">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Start Your Assessment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enter student details to begin the diagnostic portal.</p>
              </div>

              <form onSubmit={handleStartAssessment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter student full name..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent / Student Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter email address..."
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">School Name</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="School name..."
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        className="w-full pl-9 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Grade Level</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                    >
                      <option value="3rd Grade">3rd Grade</option>
                      <option value="4th Grade">4th Grade</option>
                      <option value="5th Grade">5th Grade</option>
                      <option value="6th Grade">6th Grade</option>
                      <option value="7th Grade">7th Grade</option>
                      <option value="8th Grade">8th Grade</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  <span>Begin Diagnostic Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </GlassCard>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
