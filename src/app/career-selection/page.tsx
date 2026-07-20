"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  RotateCcw,
  Check,
  PartyPopper
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  getAssessmentResult, 
  saveAssessmentResult, 
  saveSubmissionDetail,
  getCurrentStudent,
  syncRemoteCareers
} from '@/lib/storage';
import { matchCareers, generateReadyDiagnosticReport } from '@/lib/assessment-engine';
import { AssessmentResult, StudentSubmissionDetail, StudentProfile } from '@/lib/types';

export default function CareerSelectionPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const res = getAssessmentResult();
    if (!res || !res.topCareerMatches || res.topCareerMatches.length === 0) {
      // Direct URL access forbidden: must complete assessment from Landing Page!
      router.replace('/');
      return;
    }
    
    setAssessment(res);

    if (res.selectedCareerId && res.exitTimestamp) {
      setSelectedCareerId(res.selectedCareerId);
      setIsConfirmed(true);
    } else {
      setSelectedCareerId('');
      setIsConfirmed(false);
    }

    // Sync live database careers from Supabase and match against student scores
    syncRemoteCareers().then(dbCareers => {
      if (dbCareers && dbCareers.length > 0 && res.dimensionScores) {
        const liveMatches = matchCareers(res.dimensionScores, dbCareers);
        const updatedRes = { ...res, topCareerMatches: liveMatches };
        setAssessment(updatedRes);
        saveAssessmentResult(updatedRes);
      }
    });
  }, [router]);

  if (!mounted || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-[#FDFBF7] dark:bg-[#0b0f19] text-slate-500">
        <p className="text-sm font-semibold animate-pulse">Loading Career Selection...</p>
      </div>
    );
  }

  const handleConfirmSelection = async () => {
    if (!assessment || !selectedCareerId) return;

    const chosenCareer = assessment.topCareerMatches.find(c => c.id === selectedCareerId);
    if (!chosenCareer) return;

    const updatedResult: AssessmentResult = {
      ...assessment,
      selectedCareerId: chosenCareer.id,
      selectedCareerName: chosenCareer.title,
      exitTimestamp: new Date().toISOString(),
    };

    saveAssessmentResult(updatedResult);
    setAssessment(updatedResult);
    setIsConfirmed(true);

    // Retrieve active student profile
    const activeStudent: StudentProfile = getCurrentStudent() || {
      id: assessment.studentId,
      name: assessment.studentName || 'Student Candidate',
      email: assessment.studentEmail || 'candidate@school.edu',
      school: 'Partner School',
      grade: 'Standard Grade',
      targetYear: '2028',
      createdAt: assessment.completedAt,
    };

    // Generate READY'S Team Diagnostic Report
    const readyReport = generateReadyDiagnosticReport(activeStudent, updatedResult.dimensionScores, chosenCareer);

    // SAVE COMPLETE SUBMISSION DATA ONLY HERE AT FINAL SUBMIT
    const completeSubmissionDetail: StudentSubmissionDetail = {
      profile: activeStudent,
      assessment: updatedResult,
      report: readyReport,
    };

    saveSubmissionDetail(completeSubmissionDetail);

    // Trigger celebration confetti dynamically (browser-only)
    try {
      const confettiModule = (await import('canvas-confetti')).default;
      confettiModule({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f97316', '#e11d48', '#f59e0b', '#0ea5e9'],
      });
    } catch (e) {
      // fallback
    }
  };

  const selectedCareer = assessment.topCareerMatches.find(c => c.id === selectedCareerId);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        
        {/* SUCCESSFUL EXIT CONFIRMATION VIEW */}
        {isConfirmed && selectedCareer ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            
            {/* Exit Banner */}
            <GlassCard className="p-8 border-2 border-emerald-500/40 bg-emerald-500/5 text-center space-y-4 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <PartyPopper className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  Diagnostic Exit Completed
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
                  Congratulations, {assessment.studentName}!
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You have successfully chosen your target career path: <strong className="text-orange-500">{selectedCareer.title}</strong>
                </p>
              </div>
            </GlassCard>

            {/* Official Career Alignment Certificate Card */}
            <GlassCard className="p-8 border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-7 h-7 text-orange-500" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Official Career Alignment Summary</h2>
                    <p className="text-xs text-slate-500">READY Student Diagnostic Exit Certificate</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold">
                  Exit Timestamp: {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Student Candidate:</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{assessment.studentName}</p>
                  <p className="text-xs text-slate-400">{assessment.studentEmail}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chosen Profession Path:</span>
                  <p className="text-base font-bold text-orange-500">{selectedCareer.title}</p>
                  <p className="text-xs text-slate-400">{selectedCareer.category}</p>
                </div>
              </div>

              {/* Recommended Action Roadmap */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  <span>Next Learning Milestones For Your Chosen Path</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedCareer.recommendedRoadmap || []).map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-500 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setIsConfirmed(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-semibold transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Change Career Selection</span>
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition shadow-lg flex items-center gap-2"
                >
                  <span>Complete & Return Home</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </div>
        ) : (
          /* CAREER SELECTION CHOOSER VIEW */
          <div className="space-y-8">
            
            {/* Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assessment Complete</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
                Select Your Profession Path
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Please click to choose the profession option below that interests you most, then click <strong className="text-orange-500">Confirm & Select Profession</strong>.
              </p>
            </div>

            {/* Career Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessment.topCareerMatches.map((career) => {
                const isSelected = selectedCareerId === career.id;

                return (
                  <GlassCard
                    key={career.id}
                    onClick={() => setSelectedCareerId(career.id)}
                    className={`p-6 space-y-5 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-2 border-orange-500 ring-4 ring-orange-500/20 bg-white dark:bg-slate-900 shadow-xl scale-[1.02]'
                        : 'border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-900'
                    }`}
                  >
                    {/* Top Row: Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono font-bold uppercase">
                        {career.badge}
                      </span>
                      <span className="text-xs text-orange-500 font-semibold uppercase font-mono">
                        {career.category}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-tight mb-1">
                        {career.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {career.description}
                    </p>

                    {/* Required Skills Badges */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Key Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {career.requiredSkills.slice(0, 4).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Selection Indicator Button */}
                    <div className="pt-3">
                      <div
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Selected Choice</span>
                          </>
                        ) : (
                          <span>Click To Select</span>
                        )}
                      </div>
                    </div>

                  </GlassCard>
                );
              })}
            </div>

            {/* Final Confirmation Bar */}
            <GlassCard className="p-6 border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Ready to Finalize Your Selection?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCareer ? (
                    <>Target Profession: <strong className="text-orange-500">{selectedCareer.title}</strong></>
                  ) : (
                    <span className="text-amber-500 font-semibold">Please click on a profession card above to choose your option.</span>
                  )}
                </p>
              </div>

              <button
                onClick={handleConfirmSelection}
                disabled={!selectedCareerId}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                  selectedCareerId 
                    ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-rose-600 text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Confirm & Select Profession</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </GlassCard>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
