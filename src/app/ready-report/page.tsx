"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Lock, 
  Printer, 
  CheckCircle2, 
  Save, 
  Key,
  LogOut,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Award,
  FileText
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  isAdminAuthenticated, 
  setAdminAuthenticated,
  logoutAdmin,
  getAllSubmissions, 
  updateSubmissionAdminNotes, 
  getAssessmentResult,
  getCustomQuestions,
  verifyAdminPassword,
  syncRemoteAdminPassword
} from '@/lib/storage';
import { StudentSubmissionDetail } from '@/lib/types';

export default function ReadyReportPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passError, setPassError] = useState(false);

  const [submissions, setSubmissions] = useState<StudentSubmissionDetail[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    syncRemoteAdminPassword();
    const auth = isAdminAuthenticated();
    setIsAdmin(auth);

    if (auth) {
      const allSubs = getAllSubmissions();
      setSubmissions(allSubs);

      const activeRes = getAssessmentResult();
      if (activeRes && allSubs.some(s => s.profile.id === activeRes.studentId)) {
        setSelectedStudentId(activeRes.studentId);
      } else if (allSubs.length > 0) {
        setSelectedStudentId(allSubs[0].profile.id);
      }
    }
  }, []);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passkeyInput)) {
      setAdminAuthenticated(true);
      setIsAdmin(true);
      setPassError(false);
      setPasskeyInput('');

      const allSubs = getAllSubmissions();
      setSubmissions(allSubs);
      if (allSubs.length > 0) {
        setSelectedStudentId(allSubs[0].profile.id);
      }
    } else {
      setPassError(true);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
  };

  const activeSubmission = submissions.find(
    s => s.profile.id === selectedStudentId || s.assessment.studentId === selectedStudentId
  ) || submissions[0];

  useEffect(() => {
    if (activeSubmission?.report?.adminNotes) {
      setAdminNoteInput(activeSubmission.report.adminNotes);
    } else {
      setAdminNoteInput('');
    }
  }, [selectedStudentId, activeSubmission]);

  const handleSaveNotes = () => {
    if (!activeSubmission) return;
    updateSubmissionAdminNotes(activeSubmission.profile.id, adminNoteInput, 'Reviewed');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);

    setSubmissions(getAllSubmissions());
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0b0f19] text-slate-500 font-sans">
        <p className="text-sm font-semibold animate-pulse">Loading Diagnostic Report...</p>
      </div>
    );
  }

  // PASSWORD PROMPT FOR TEAM REPORT
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-md px-4 py-16 space-y-6">
          <GlassCard className="p-8 border-2 border-rose-500/30 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-mono text-xs font-bold uppercase tracking-wider">
                Confidential Team Access
              </span>
              <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                READY&apos;S Team Report
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please enter the Team Admin password to view student details and questionnaire response logs.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Team Password (PIN: <code className="text-orange-500 font-mono">1234</code> or <code className="text-orange-500 font-mono">READY2026</code>)
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                {passError && (
                  <p className="mt-2 text-xs text-rose-500 font-bold">
                    Incorrect password. Try 1234 or READY2026.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Unlock Team Report
              </button>
            </form>
          </GlassCard>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = activeSubmission?.profile;
  const assessment = activeSubmission?.assessment;
  const activeQuestions = getCustomQuestions();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 space-y-8">
        
        {/* TEAM RESTRICTED WARNING BANNER */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white font-bold shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest font-mono text-rose-600 dark:text-rose-400">
                  CONFIDENTIAL READY TEAM ACCESS
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-[10px] font-bold">STRICTLY INTERNAL</span>
              </div>
              <p className="text-xs text-rose-600/80 dark:text-rose-300/80">
                Student response reports are restricted to certified team mentors & counselors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Student:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {submissions.map((sub) => (
                  <option key={sub.profile.id} value={sub.profile.id}>
                    {sub.profile.name} ({sub.assessment.selectedCareerName || 'No Career Selected'})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/30 transition flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* REPORT CARD CONTAINER */}
        {activeSubmission && profile && assessment && (
          <GlassCard className="p-6 sm:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            
            {/* SECTION 1: STUDENT DETAILS CARD */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold uppercase">
                    Official READY Student Report
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-2">
                    {profile.name}
                  </h1>
                </div>

                <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Submitted On:</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {new Date(assessment.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    Student Name:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.name}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-orange-500" />
                    Email Address:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    Contact Phone:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.phone || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                    Institution:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.school}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    Level / Grade:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.grade}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    Selected Exit Career Path:
                  </span>
                  <p className="font-extrabold text-orange-600 dark:text-orange-400 text-sm">
                    {assessment.selectedCareerName || 'Candidate pending career exit selection'}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: QUESTIONNAIRE RESPONSE LOG */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <span>Questionnaire Response Log</span>
                </h3>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-xs font-bold">
                  {Object.keys(assessment.answers).length} Questions Answered
                </span>
              </div>

              <div className="space-y-4">
                {activeQuestions.map((q, idx) => {
                  const answer = assessment.answers[q.id];
                  let contentToRender = null;
                  let optionLetter = '-';

                  if (q.type === 'msq') {
                    const selectedList = Array.isArray(answer) ? answer : [];
                    contentToRender = selectedList.length > 0 ? (
                      <div className="space-y-1">
                        {selectedList.map((id) => {
                          const opt = q.options.find(o => o.id === id);
                          return (
                            <div key={id} className="flex items-center gap-2">
                              <span className="text-orange-500 font-bold font-mono">☑</span>
                              <span>{opt ? opt.label : id}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No options selected</span>
                    );
                  } else if (q.type === 'paragraph') {
                    contentToRender = answer ? (
                      <div className="whitespace-pre-wrap">{answer}</div>
                    ) : (
                      <span className="text-slate-400 italic">No response written</span>
                    );
                  } else if (q.type === 'scaling') {
                    const scaleOpt = q.options.find(o => o.id === answer);
                    optionLetter = scaleOpt ? scaleOpt.label : '-';
                    contentToRender = scaleOpt ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs font-medium">
                          (Scale range: {q.minValue ?? 1} to {q.maxValue ?? 5} {q.minLabel || q.maxLabel ? `| ${q.minLabel || 'Low'} to ${q.maxLabel || 'High'}` : ''})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No rating selected</span>
                    );
                  } else {
                    const chosenOpt = q.options.find(o => o.id === answer);
                    const optionIdx = q.options.findIndex(o => o.id === answer);
                    optionLetter = optionIdx >= 0 ? String.fromCharCode(65 + optionIdx) : '-';
                    contentToRender = chosenOpt ? (
                      <span>{chosenOpt.label}</span>
                    ) : (
                      <span className="text-slate-400 italic">No option selected</span>
                    );
                  }

                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold uppercase flex items-center gap-2">
                          <span>Question {idx + 1} &bull; {q.category}</span>
                          <span className="px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[9px] uppercase tracking-wider font-extrabold font-mono">
                            {q.type || 'mcq'}
                          </span>
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          ID: {q.id}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h4>

                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                        {(q.type === 'scaling' || !q.type || q.type === 'mcq') && (
                          <div className="w-6 h-6 rounded-lg bg-orange-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {optionLetter}
                          </div>
                        )}
                        {q.type === 'msq' && (
                          <div className="w-6 h-6 rounded-lg bg-orange-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            ☑
                          </div>
                        )}
                        {q.type === 'paragraph' && (
                          <div className="w-6 h-6 rounded-lg bg-orange-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            ✎
                          </div>
                        )}
                        <div className="text-xs text-slate-800 dark:text-slate-200 font-medium pt-0.5 flex-1">
                          {contentToRender}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: COUNSELOR NOTES */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Team Counselor Log & Notes
                </label>
                {saveSuccess && (
                  <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved to Admin Log</span>
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Enter counseling notes or remarks for candidate follow-up..."
                className="w-full p-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Counselor Log</span>
                </button>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => router.push('/admin')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
              >
                <span>Return To Admin Dashboard</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition shadow flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print READY Report Log</span>
              </button>
            </div>

          </GlassCard>
        )}

      </main>

      <Footer />
    </div>
  );
}
