"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Save, 
  UserCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  getCurrentStudent, 
  getQuestionnaireAnswers, 
  saveQuestionnaireAnswers, 
  saveAssessmentResult,
  getCustomQuestions,
  syncRemoteQuestions
} from '@/lib/storage';
import { calculateDimensionScores, matchCareers, generateReadyDiagnosticReport } from '@/lib/assessment-engine';
import { StudentProfile, AssessmentResult, QuestionnaireQuestion } from '@/lib/types';

export default function AssessmentPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const activeStudent = getCurrentStudent();
    if (!activeStudent) {
      // Direct URL access forbidden: must start from Landing Page setup!
      router.replace('/');
      return;
    }
    setStudent(activeStudent);

    const activeQuestions = getCustomQuestions();
    setQuestions(activeQuestions);

    syncRemoteQuestions().then(remoteQuestions => {
      if (remoteQuestions && remoteQuestions.length > 0) {
        setQuestions(remoteQuestions);
      }
    });

    const savedAnswers = getQuestionnaireAnswers();
    setAnswers(savedAnswers);
  }, [router]);

  if (!mounted || !student || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-[#FDFBF7] dark:bg-[#0b0f19] text-slate-500">
        <p className="text-sm font-semibold animate-pulse">Initializing Assessment...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentStepIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalQuestions) * 100);
  const selectedOptionId = answers[currentQuestion?.id || ''];

  const handleSelectOption = (optionId: string) => {
    const updated = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(updated);
    saveQuestionnaireAnswers(updated);
  };

  const handleNext = () => {
    if (!selectedOptionId) return;

    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleCompleteAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompleteAssessment = () => {
    if (!student) return;
    setIsSubmitting(true);

    setTimeout(() => {
      // Calculate scores across all active questions
      const dimensionScores = calculateDimensionScores(answers, questions);
      const topMatches = matchCareers(dimensionScores);
      const topCareer = topMatches[0];

      // Create temporary AssessmentResult (NOT permanently stored in submissions yet)
      const assessmentResult: AssessmentResult = {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        completedAt: new Date().toISOString(),
        answers,
        dimensionScores,
        topCareerMatches: topMatches,
        selectedCareerId: '',
        selectedCareerName: '',
      };

      // Save temporary result for career selection stage
      saveAssessmentResult(assessmentResult);

      setIsSubmitting(false);
      // Proceed to Career Selection
      router.push('/career-selection');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 space-y-8">
        
        {/* Candidate & Progress Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold">
              <UserCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px]">
                  {student.grade}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{student.school}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5 text-orange-500">
              <Clock className="w-4 h-4" />
              <span>Question {currentStepIndex + 1} of {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-slate-500 dark:text-slate-400">Assessment Progress</span>
            <span className="text-orange-500">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* DIAGNOSTIC QUESTION CARD */}
        {currentQuestion && (
          <GlassCard className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800 relative">
            <div className="flex items-center justify-between gap-4">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold uppercase tracking-wider">
                Category: {currentQuestion.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Q{currentStepIndex + 1}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white leading-snug">
                {currentQuestion.question}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* MULTIPLE CHOICE OPTIONS GRID */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/20 text-slate-950 dark:text-white shadow-md'
                        : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-900 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div 
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition ${
                        isSelected 
                          ? 'bg-orange-500 text-white shadow-sm' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {optionLetter}
                    </div>

                    <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                      {option.label}
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => saveQuestionnaireAnswers(answers)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Progress</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedOptionId || isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing Diagnostic...</span>
                  ) : currentStepIndex === totalQuestions - 1 ? (
                    <>
                      <span>Submit & Select Profession</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </GlassCard>
        )}

      </main>

      <Footer />
    </div>
  );
}
