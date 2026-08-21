"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GlassCard } from '@/components/ui/glass-card';
import {
  saveCurrentStudent,
  clearQuestionnaireAnswers,
  getAllSubmissions,
  getCustomCareers,
  saveAssessmentResult,
  syncRemoteCareers,
  saveFastTrackSubmission
} from '@/lib/storage';
import { StudentProfile, CareerProfile, AssessmentResult } from '@/lib/types';

export default function QuestionaaireLandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeFlow, setActiveFlow] = useState<'assessment' | 'fasttrack'>('assessment');
  const [careersList, setCareersList] = useState<CareerProfile[]>([]);
  const [selectedFastTrackCareers, setSelectedFastTrackCareers] = useState<string[]>([]);

  // Form starts completely empty - no stock/demo data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: '6th Grade',
    targetYear: '2028',
  });

  useEffect(() => {
    setMounted(true);
    setCareersList(getCustomCareers());
    syncRemoteCareers().then(list => {
      if (list && list.length > 0) {
        setCareersList(list);
      }
    });
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
      phone: formData.phone.trim(),
      school: formData.school.trim() || 'School',
      grade: formData.grade,
      targetYear: formData.targetYear,
      primaryInterests: [],
      createdAt: new Date().toISOString(),
    };

    saveCurrentStudent(profile);
    router.push('/assessment');
  };

  const handleFastTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFastTrackCareers.length === 0) {
      alert("Please select at least 1 profession to connect.");
      return;
    }

    const existingSubs = getAllSubmissions();
    const studentNum = existingSubs.length + 1;
    const studentId = `STUDENT-${String(studentNum).padStart(3, '0')}`;

    const profile: StudentProfile = {
      id: studentId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      school: formData.school.trim() || 'School',
      grade: formData.grade,
      targetYear: formData.targetYear,
      primaryInterests: [],
      createdAt: new Date().toISOString(),
    };

    const chosenCareers = careersList.filter(c => selectedFastTrackCareers.includes(c.id));

    // Construct mock assessment result (no questionnaire attempted)
    const mockResult: AssessmentResult = {
      studentId: studentId,
      studentName: formData.name.trim(),
      studentEmail: formData.email.trim(),
      completedAt: new Date().toISOString(),
      answers: {}, // skipped questionnaire
      dimensionScores: { analytical: 0, technical: 0, research: 0, creative: 0, leadership: 0, communication: 0 },
      topCareerMatches: chosenCareers.map(c => ({ ...c, score: 100 })),
      selectedCareerId: chosenCareers[0]?.id,
      selectedCareerName: chosenCareers[0]?.title,
      selectedCareerIds: chosenCareers.map(c => c.id),
      selectedCareerNames: chosenCareers.map(c => c.title),
      exitTimestamp: new Date().toISOString(),
    };

    saveCurrentStudent(profile);
    saveAssessmentResult(mockResult);

    saveFastTrackSubmission({
      id: studentId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      school: formData.school.trim() || 'School',
      grade: formData.grade,
      selectedCareers: chosenCareers.map(c => c.title),
      createdAt: new Date().toISOString(),
    });

    router.push('/career-selection');
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
    <div className="min-h-screen flex flex-col bg-[#f8f1ea] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 overflow-x-hidden px-4 sm:px-6 py-8 sm:py-14">

        {/* HERO SECTION */}
        <section className="relative mx-auto w-full max-w-[1450px] rounded-[32px] border border-slate-200/70 bg-[#f7efe6] px-4 py-8 sm:px-8 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

          {/* Hero Left Content */}
          <div className="flex-1 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-600 text-[11px] font-black uppercase tracking-[0.14em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>School Student Discovery Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-slate-950 leading-[1.04]">
              Explore Your
              <span className="block text-orange-500 font-caveat text-5xl sm:text-6xl lg:text-7xl tracking-normal rotate-[-1deg] origin-left">Dream Career Path</span>
              With READY Diagnostic Intelligence.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
              Designed specially for school students (Grades 3 to 12). Discover your natural talents, explore exciting future professions, and align your interests.
            </p>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 flex-wrap pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Tailored for Grades 3rd - 12th</span>
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
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black text-base shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group"
              >
                <Zap className="w-5 h-5 fill-white text-white" />
                <span>Start Assessment Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Hero Right Student Form Card */}
          <div id="start-setup" className="w-full lg:w-[460px] shrink-0">
            <GlassCard className="border-2 border-orange-500/30 shadow-2xl relative rounded-[28px] bg-white/80">
              <div className="mb-4">
                <h3 className="text-xl font-black text-slate-900">Student Registration</h3>
                <p className="text-xs text-slate-500">Choose your path to explore career diagnostic tools.</p>
              </div>

              {/* Path Tabs */}
              <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveFlow('assessment')}
                  className={`flex-1 pb-2 border-b-2 text-center transition ${activeFlow === 'assessment'
                    ? 'border-orange-500 text-orange-600 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                  Take Questionnaire
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFlow('fasttrack')}
                  className={`flex-1 pb-2 border-b-2 text-center transition ${activeFlow === 'fasttrack'
                    ? 'border-orange-500 text-orange-600 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                  Experience Profession Connect
                </button>
              </div>

              <form onSubmit={activeFlow === 'assessment' ? handleStartAssessment : handleFastTrackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter student full name..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Student Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter email address..."
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Enter contact phone number..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">School Name</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="School name..."
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        className="w-full pl-9 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                    >
                      <option value="3rd Grade">3rd Grade</option>
                      <option value="4th Grade">4th Grade</option>
                      <option value="5th Grade">5th Grade</option>
                      <option value="6th Grade">6th Grade</option>
                      <option value="7th Grade">7th Grade</option>
                      <option value="8th Grade">8th Grade</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                </div>

                {activeFlow === 'fasttrack' && (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="block text-xs font-semibold text-slate-700">
                      Select Up to 3 Professions
                    </label>
                    <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50 space-y-1.5">
                      {careersList.map(c => {
                        const isChecked = selectedFastTrackCareers.includes(c.id);
                        return (
                          <label key={c.id} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedFastTrackCareers(selectedFastTrackCareers.filter(id => id !== c.id));
                                } else {
                                  if (selectedFastTrackCareers.length >= 3) {
                                    alert("You can select a maximum of 3 professions.");
                                    return;
                                  }
                                  setSelectedFastTrackCareers([...selectedFastTrackCareers, c.id]);
                                }
                              }}
                              className="rounded text-orange-500 focus:ring-orange-500 border-slate-300"
                            />
                            <span>{c.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  <span>{activeFlow === 'assessment' ? 'Begin Diagnostic Assessment' : 'Connect & Get Career Guides'}</span>
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
