"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Eye, 
  FileSpreadsheet, 
  Lock, 
  Users, 
  Save, 
  User, 
  LogOut,
  Key,
  ShieldCheck,
  X,
  Plus,
  Trash2,
  Edit3,
  ListPlus,
  Briefcase,
  FileText,
  RotateCcw,
  AlertTriangle,
  Download,
  RefreshCw
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
  getCustomQuestions,
  saveCustomQuestions,
  deleteCustomQuestion,
  getCustomCareers,
  saveCustomCareers,
  deleteCustomCareer,
  getRecycleBinSubmissions,
  moveToRecycleBin,
  restoreFromRecycleBin,
  permanentlyDeleteSubmission,
  emptyRecycleBin,
  syncRemoteSubmissions,
  syncRemoteAdminPassword,
  syncRemoteQuestions,
  syncRemoteCareers,
  verifyAdminPassword,
  setAdminPassword
} from '@/lib/storage';
import { StudentSubmissionDetail, QuestionnaireQuestion, CareerProfile, DimensionKey, ReadyDiagnosticReport } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passError, setPassError] = useState(false);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passChangeError, setPassChangeError] = useState('');

  const [activeTab, setActiveTab] = useState<'submissions' | 'questionnaire' | 'careers' | 'recycleBin'>('submissions');
  const [submissions, setSubmissions] = useState<StudentSubmissionDetail[]>([]);
  const [recycleBin, setRecycleBin] = useState<StudentSubmissionDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected student detail for Deep Inspection Modal
  const [inspectDetail, setInspectDetail] = useState<StudentSubmissionDetail | null>(null);
  const [inspectionTab, setInspectionTab] = useState<'profile' | 'rawAnswers' | 'notes'>('profile');
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [inspectorStatus, setInspectorStatus] = useState<ReadyDiagnosticReport['status']>('Pending Review');
  const [noteSaved, setNoteSaved] = useState(false);

  // Questionnaire Management State
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionnaireQuestion | null>(null);

  // Career Options Management State
  const [careers, setCareers] = useState<CareerProfile[]>([]);
  const [editingCareer, setEditingCareer] = useState<CareerProfile | null>(null);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        syncRemoteSubmissions(),
        syncRemoteQuestions(),
        syncRemoteCareers(),
        syncRemoteAdminPassword(),
      ]);
      refreshData();
      triggerNotification('Dashboard refreshed with live database records!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    syncRemoteAdminPassword();
    const auth = isAdminAuthenticated();
    setIsAdmin(auth);

    if (auth) {
      refreshData();
    }

    const handleBeforeUnload = () => {
      logoutAdmin();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Auto-lock when navigating away from Admin page or unmounting
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      logoutAdmin();
    };
  }, []);

  const refreshData = () => {
    setSubmissions(getAllSubmissions());
    setRecycleBin(getRecycleBinSubmissions());
    setQuestions(getCustomQuestions());
    setCareers(getCustomCareers());

    syncRemoteSubmissions().then(() => {
      setSubmissions(getAllSubmissions());
      setRecycleBin(getRecycleBinSubmissions());
    });

    syncRemoteQuestions().then((qList) => {
      if (qList && qList.length > 0) setQuestions(qList);
    });

    syncRemoteCareers().then((cList) => {
      if (cList && cList.length > 0) setCareers(cList);
    });
  };

  const handleInlineAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passkeyInput)) {
      setAdminAuthenticated(true);
      setIsAdmin(true);
      setPassError(false);
      setPasskeyInput('');
      refreshData();
    } else {
      setPassError(true);
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) {
      setPassChangeError('Password cannot be empty.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPassChangeError('New password and confirm password do not match.');
      return;
    }

    setAdminPassword(newPasswordInput.trim());
    setShowPasswordModal(false);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPassChangeError('');
    triggerNotification('Admin password updated successfully!');
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setInspectDetail(null);
  };

  const handleOpenInspect = (sub: StudentSubmissionDetail) => {
    setInspectDetail(sub);
    setInspectorNotes(sub.report?.adminNotes || '');
    setInspectorStatus(sub.report?.status || 'Pending Review');
    setInspectionTab('profile');
  };

  const handleSaveInspectorNotes = () => {
    if (!inspectDetail) return;
    updateSubmissionAdminNotes(inspectDetail.profile.id, inspectorNotes, inspectorStatus);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);

    const updated = getAllSubmissions();
    setSubmissions(updated);
    const refreshed = updated.find(s => s.profile.id === inspectDetail.profile.id);
    if (refreshed) setInspectDetail(refreshed);
  };

  // PDF Report Exporter Handler
  const handleExportPDF = (sub: StudentSubmissionDetail) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const questionsLogHTML = questions.map((q, idx) => {
      const chosenOptId = sub.assessment.answers[q.id];
      const chosenOpt = q.options.find(o => o.id === chosenOptId);
      return `
        <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
          <div style="font-weight: bold; color: #ea580c; font-size: 11px; font-family: monospace;">
            Q${idx + 1} (${q.category}):
          </div>
          <div style="font-weight: bold; color: #0f172a; font-size: 13px; margin: 4px 0;">
            ${q.question}
          </div>
          <div style="font-size: 12px; color: #334155; margin-top: 6px; padding: 6px 10px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px;">
            <strong>Selected Answer:</strong> ${chosenOpt ? chosenOpt.label : 'No response logged'}
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>READY_Report_${sub.profile.name.replace(/\s+/g, '_')}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; }
            .header { border-bottom: 3px solid #ea580c; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 12px; font-weight: bold; color: #ea580c; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .card { padding: 10px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
            .card-label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }
            .card-val { font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 2px; }
            .comments-box { padding: 14px; background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; font-size: 12px; color: #9a3412; font-weight: 500; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="${window.location.origin}/logo.png" style="width: 44px; height: 44px; object-fit: contain;" />
              <div>
                <h1 class="title">READY Student Assessment Report</h1>
                <div class="subtitle">Official Student Details, Questionnaire Log & Counselor Comments</div>
              </div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748b;">
              <strong>Date:</strong> ${new Date(sub.assessment.completedAt).toLocaleDateString()}<br/>
              <strong>Status:</strong> ${sub.report.status}
            </div>
          </div>

          <div class="section">
            <div class="section-title">1. Student Details</div>
            <div class="grid">
              <div class="card"><div class="card-label">Student Name</div><div class="card-val">${sub.profile.name}</div></div>
              <div class="card"><div class="card-label">Email Address</div><div class="card-val">${sub.profile.email}</div></div>
              <div class="card"><div class="card-label">School / Institution</div><div class="card-val">${sub.profile.school}</div></div>
              <div class="card"><div class="card-label">Grade Level</div><div class="card-val">${sub.profile.grade}</div></div>
            </div>
            <div class="card" style="margin-top: 12px; background-color: #fff7ed; border-color: #fdba74;">
              <div class="card-label" style="color: #c2410c;">Selected Target Profession</div>
              <div class="card-val" style="color: #ea580c; font-size: 16px;">${sub.assessment.selectedCareerName || 'Not Selected Yet'}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">2. Diagnostic Questionnaire Log</div>
            ${questionsLogHTML}
          </div>

          <div class="section">
            <div class="section-title">3. Team Counselor Comments & Notes</div>
            <div class="comments-box">
              ${sub.report.adminNotes ? sub.report.adminNotes.replace(/\n/g, '<br/>') : '<em>No comments logged by counselor yet.</em>'}
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Recycle Bin Handlers (Instant 1-Click Execution)
  const handleMoveToBin = async (sub: StudentSubmissionDetail) => {
    if (confirm(`Move candidate "${sub.profile.name}" to Recycle Bin?`)) {
      const deletedItem = { ...sub, deletedAt: new Date().toISOString() };
      setSubmissions(prev => prev.filter(s => s.profile.id !== sub.profile.id));
      setRecycleBin(prev => [deletedItem, ...prev.filter(s => s.profile.id !== sub.profile.id)]);

      await moveToRecycleBin(sub.profile.id);
      triggerNotification(`Moved "${sub.profile.name}" to Recycle Bin. You can restore it anytime.`);
    }
  };

  const handleRestoreFromBin = async (sub: StudentSubmissionDetail) => {
    const restoredItem = { ...sub };
    delete restoredItem.deletedAt;

    setRecycleBin(prev => prev.filter(s => s.profile.id !== sub.profile.id));
    setSubmissions(prev => [restoredItem, ...prev.filter(s => s.profile.id !== sub.profile.id)]);

    await restoreFromRecycleBin(sub.profile.id);
    triggerNotification(`Restored "${sub.profile.name}" back to active submissions list.`);
  };

  const handlePermanentDelete = async (sub: StudentSubmissionDetail) => {
    if (confirm(`PERMANENTLY DELETE "${sub.profile.name}"? This action CANNOT be undone.`)) {
      setRecycleBin(prev => prev.filter(s => s.profile.id !== sub.profile.id));
      await permanentlyDeleteSubmission(sub.profile.id);
      triggerNotification(`Permanently deleted candidate record.`);
    }
  };

  const handleEmptyBin = async () => {
    if (confirm('Permanently delete ALL items in the Recycle Bin? This CANNOT be undone.')) {
      setRecycleBin([]);
      await emptyRecycleBin();
      triggerNotification('Recycle Bin emptied.');
    }
  };

  // Questionnaire Editing Logic
  const handleAddNewQuestion = () => {
    const nextNum = questions.length + 1;
    const newId = `Q-${nextNum}`;
    const newQ: QuestionnaireQuestion = {
      id: newId,
      category: 'Problem Solving & Exploration',
      question: 'New Question Prompt...',
      subtitle: 'Select the option that feels most like you.',
      options: [
        {
          id: `${newId}-a`,
          label: 'Option A choice...',
          dimensionWeights: { analytical: 3, technical: 2, research: 0, creative: 0, leadership: 0, communication: 0 },
        },
        {
          id: `${newId}-b`,
          label: 'Option B choice...',
          dimensionWeights: { analytical: 0, technical: 0, research: 0, creative: 3, leadership: 2, communication: 0 },
        },
      ],
    };
    setEditingQuestion(newQ);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;
    const existingIndex = questions.findIndex(q => q.id === editingQuestion.id);
    let updatedList: QuestionnaireQuestion[] = [];
    if (existingIndex >= 0) {
      updatedList = [...questions];
      updatedList[existingIndex] = editingQuestion;
    } else {
      updatedList = [...questions, editingQuestion];
    }
    setQuestions(updatedList);
    saveCustomQuestions(updatedList);
    setEditingQuestion(null);
    triggerNotification('Questionnaire updated successfully!');
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updatedList = questions.filter(q => q.id !== id);
      setQuestions(updatedList);
      deleteCustomQuestion(id);
      triggerNotification('Question deleted successfully.');
    }
  };

  // Career Management Logic
  const handleAddNewCareer = () => {
    const nextNum = careers.length + 1;
    const newId = `CAREER-${nextNum}`;
    const newCareer: CareerProfile = {
      id: newId,
      title: 'Doctor',
      category: 'Healthcare & Medicine',
      badge: 'Popular Choice',
      description: 'Help people stay healthy, treat illnesses, conduct medical research, and save lives.',
      matchPercentage: 90,
      salaryRange: 'High Impact Field',
      growthOutlook: 'Essential Role',
      requiredSkills: ['Biology & Health', 'Empathy & Care', 'Problem Solving'],
      recommendedRoadmap: ['Study life sciences topics', 'Participate in first-aid workshops', 'Read biology books'],
      primaryDimension: 'research',
      accentColor: '#10b981',
    };
    setEditingCareer(newCareer);
  };

  const handleSaveCareer = () => {
    if (!editingCareer) return;
    const existingIdx = careers.findIndex(c => c.id === editingCareer.id);
    let updatedList: CareerProfile[] = [];
    if (existingIdx >= 0) {
      updatedList = [...careers];
      updatedList[existingIdx] = editingCareer;
    } else {
      updatedList = [...careers, editingCareer];
    }
    setCareers(updatedList);
    saveCustomCareers(updatedList);
    setEditingCareer(null);
    triggerNotification('Career options updated successfully!');
  };

  const handleDeleteCareer = (id: string) => {
    if (confirm('Are you sure you want to delete this career option?')) {
      const updatedList = careers.filter(c => c.id !== id);
      setCareers(updatedList);
      deleteCustomCareer(id);
      triggerNotification('Career option deleted.');
    }
  };

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const exportCSV = () => {
    const csvHeader = 'Student Name,Email,School,Grade,Selected Career,Status,Completed At\n';
    const csvRows = submissions.map(s => 
      `"${s.profile.name}","${s.profile.email}","${s.profile.school}","${s.profile.grade}","${s.assessment.selectedCareerName || 'None'}","${s.report.status}","${s.assessment.completedAt}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `READY_Submissions_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0b0f19] text-slate-500 font-sans">
        <p className="text-sm font-semibold animate-pulse">Loading Admin Portal...</p>
      </div>
    );
  }

  // PASSWORD PROMPT SCREEN FOR UNAUTHENTICATED USERS
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
                Restricted Admin Area
              </span>
              <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                Admin Dashboard Access
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please enter the Team Admin password to manage questions, career options, and view candidate submissions.
              </p>
            </div>

            <form onSubmit={handleInlineAuthenticate} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Admin Password
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
                    Incorrect admin password.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </GlassCard>
        </main>
        <Footer />
      </div>
    );
  }

  // Filtering active submissions
  const filteredSubmissions = submissions.filter(s => {
    if (s.deletedAt) return false;

    const matchesQuery = 
      s.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profile.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.assessment.selectedCareerName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || s.report.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const totalSubmissions = submissions.length;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        
        {/* DASHBOARD HEADER BANNER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold uppercase">
                Admin Operations Control
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Authenticated
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
              Team Admin Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage school student submissions (Grades 3 to 10), customize questions, configure career options, export PDF reports, and access recycle bin.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              title="Fetch latest data from Supabase database"
            >
              <RefreshCw className={`w-4 h-4 text-sky-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Database'}</span>
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition flex items-center gap-2"
            >
              <Key className="w-4 h-4 text-orange-500" />
              <span>Change Password</span>
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>

        {/* MAIN TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === 'submissions'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Submissions ({totalSubmissions})</span>
          </button>

          <button
            onClick={() => setActiveTab('questionnaire')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === 'questionnaire'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span>Manage Questionnaire ({questions.length} Questions)</span>
          </button>

          <button
            onClick={() => setActiveTab('careers')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === 'careers'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Career Options ({careers.length} Careers)</span>
          </button>

          <button
            onClick={() => setActiveTab('recycleBin')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === 'recycleBin'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-rose-500'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Recycle Bin ({recycleBin.length})</span>
          </button>
        </div>

        {notificationMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <ShieldCheck className="w-4 h-4" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* TAB 1: ACTIVE STUDENT SUBMISSIONS LIST */}
        {activeTab === 'submissions' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* SEARCH & FILTER CONTROLS */}
            <GlassCard className="p-4 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student, email, school..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter Status:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Action Plan Dispatched">Action Plan Dispatched</option>
                </select>
              </div>
            </GlassCard>

            {/* SUBMISSIONS MASTER TABLE */}
            <GlassCard className="p-0 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-mono">
                      <th className="py-3.5 px-4">Student Candidate</th>
                      <th className="py-3.5 px-4">Selected Career Exit</th>
                      <th className="py-3.5 px-4 text-center">Questions Logged</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                          No matching student submissions found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.profile.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{sub.profile.name}</div>
                            <div className="text-[11px] text-slate-400">{sub.profile.email} &bull; {sub.profile.school} ({sub.profile.grade})</div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                              {sub.assessment.selectedCareerName || 'Not Finalized Yet'}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center font-mono font-bold text-slate-900 dark:text-white">
                            <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500">
                              {Object.keys(sub.assessment.answers || {}).length} Questions
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                              {sub.report.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleExportPDF(sub)}
                                title="Download PDF Report"
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-semibold text-xs transition inline-flex items-center gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5 text-orange-500" />
                                <span>Report PDF</span>
                              </button>

                              <button
                                onClick={() => handleOpenInspect(sub)}
                                className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>

                              <button
                                onClick={() => handleMoveToBin(sub)}
                                title="Move to Recycle Bin"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>

          </div>
        )}

        {/* TAB 4: RECYCLE BIN VIEW */}
        {activeTab === 'recycleBin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      Student Recycle Bin
                    </h3>
                    <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold">
                      {recycleBin.length} Deleted Items
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Deleted student submissions are safely kept here. You can restore them anytime or delete them permanently.
                  </p>
                </div>
              </div>

              {recycleBin.length > 0 && (
                <button
                  onClick={handleEmptyBin}
                  className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2 shrink-0"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Empty Recycle Bin</span>
                </button>
              )}
            </div>

            {/* RECYCLE BIN TABLE */}
            <GlassCard className="p-0 border-rose-500/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-rose-500/5 text-slate-500 dark:text-slate-400 uppercase font-mono">
                      <th className="py-3.5 px-4">Deleted Student Candidate</th>
                      <th className="py-3.5 px-4">Target Career Choice</th>
                      <th className="py-3.5 px-4 text-center">Moved To Bin On</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {recycleBin.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                          Recycle Bin is currently empty.
                        </td>
                      </tr>
                    ) : (
                      recycleBin.map((sub) => (
                        <tr key={sub.profile.id} className="hover:bg-rose-500/5 transition">
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{sub.profile.name}</div>
                            <div className="text-[11px] text-slate-400">{sub.profile.email} &bull; {sub.profile.school} ({sub.profile.grade})</div>
                          </td>

                          <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                            {sub.assessment.selectedCareerName || 'N/A'}
                          </td>

                          <td className="py-4 px-4 text-center font-mono text-slate-400 text-[11px]">
                            {sub.deletedAt ? new Date(sub.deletedAt).toLocaleString() : 'Recently'}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRestoreFromBin(sub)}
                                className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition flex items-center gap-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>

                              <button
                                onClick={() => handlePermanentDelete(sub)}
                                className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition shadow flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Forever</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 2: DYNAMIC QUESTIONNAIRE MANAGEMENT */}
        {activeTab === 'questionnaire' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                    Questionnaire Manager
                  </h3>
                  <span className="px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold">
                    No Limit ({questions.length} Active Questions)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add, edit, or delete diagnostic questions. Changes automatically reflect in student assessments.
                </p>
              </div>

              <button
                onClick={handleAddNewQuestion}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Question</span>
              </button>
            </div>

            {/* Questions List Cards */}
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <GlassCard key={q.id} className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 font-mono font-bold text-xs flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-orange-500 uppercase">
                          Category: {q.category}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">{q.question}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingQuestion({ ...q })}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {q.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-11">{q.subtitle}</p>
                  )}

                  <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => (
                      <div key={opt.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                        <span className="font-mono font-bold text-slate-400 text-[11px] shrink-0">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC CAREER OPTIONS MANAGEMENT */}
        {activeTab === 'careers' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                    Career Options Manager
                  </h3>
                  <span className="px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold">
                    ({careers.length} Configured Careers)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure school-student suitable career paths, skills, and roadmap steps.
                </p>
              </div>

              <button
                onClick={handleAddNewCareer}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Career Option</span>
              </button>
            </div>

            {/* Careers List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((c) => (
                <GlassCard key={c.id} className="p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold">
                        {c.badge}
                      </span>
                      <span className="text-xs font-bold text-orange-500 uppercase font-mono">
                        {c.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{c.title}</h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Key Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {c.requiredSkills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setEditingCareer({ ...c })}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                      <span>Edit Career</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCareer(c.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* CHANGE ADMIN PASSWORD MODAL */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">Change Admin Password</h3>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new admin password..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Confirm new admin password..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {passChangeError && (
                  <p className="text-rose-500 font-bold text-xs">{passChangeError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CAREER EDIT MODAL */}
        {editingCareer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Edit Career Option (ID: {editingCareer.id})
                </h3>
                <button
                  onClick={() => setEditingCareer(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Career Title</label>
                    <input
                      type="text"
                      value={editingCareer.title}
                      onChange={(e) => setEditingCareer({ ...editingCareer, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingCareer.category}
                      onChange={(e) => setEditingCareer({ ...editingCareer, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingCareer.description}
                    onChange={(e) => setEditingCareer({ ...editingCareer, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={editingCareer.badge}
                      onChange={(e) => setEditingCareer({ ...editingCareer, badge: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Focus Dimension</label>
                    <select
                      value={editingCareer.primaryDimension}
                      onChange={(e) => setEditingCareer({ ...editingCareer, primaryDimension: e.target.value as DimensionKey })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="technical">Technical & Engineering</option>
                      <option value="leadership">Leadership & Impact</option>
                      <option value="creative">Creative & Arts</option>
                      <option value="analytical">Analytics & Science</option>
                      <option value="research">Environmental & Research</option>
                      <option value="communication">Communication & Media</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={editingCareer.requiredSkills.join(', ')}
                    onChange={(e) => setEditingCareer({
                      ...editingCareer,
                      requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCareer(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCareer}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow"
                >
                  Save Career Option
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUESTION EDIT MODAL */}
        {editingQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  Edit Question (ID: {editingQuestion.id})
                </h3>
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingQuestion.category}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Question Prompt</label>
                  <textarea
                    rows={2}
                    value={editingQuestion.question}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={editingQuestion.subtitle || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, subtitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      Multiple Choice Options ({editingQuestion.options.length})
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const optId = `${editingQuestion.id}-opt-${editingQuestion.options.length + 1}`;
                        setEditingQuestion({
                          ...editingQuestion,
                          options: [
                            ...editingQuestion.options,
                            {
                              id: optId,
                              label: 'New Option...',
                              dimensionWeights: { analytical: 1, technical: 1, research: 0, creative: 0, leadership: 0, communication: 0 },
                            },
                          ],
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-600 font-bold text-[11px]"
                    >
                      + Add Choice Option
                    </button>
                  </div>

                  {editingQuestion.options.map((opt, oIdx) => (
                    <div key={opt.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-500 font-mono">Option {String.fromCharCode(65 + oIdx)}</span>
                        {editingQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingQuestion({
                                ...editingQuestion,
                                options: editingQuestion.options.filter((_, i) => i !== oIdx),
                              });
                            }}
                            className="text-rose-500 hover:text-rose-700 text-[11px] font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => {
                          const newOpts = [...editingQuestion.options];
                          newOpts[oIdx].label = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuestion}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow"
                >
                  Save Question Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEEP INSPECTION MODAL / DRAWER FOR CANDIDATES */}
        {inspectDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Clean Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/90">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 font-bold">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Candidate Inspection: {inspectDetail.profile.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID: {inspectDetail.profile.id} &bull; Submitted: {new Date(inspectDetail.assessment.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleExportPDF(inspectDetail)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-orange-500" />
                    <span>Download Report PDF</span>
                  </button>

                  <button
                    onClick={() => setInspectDetail(null)}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs inside Inspector */}
              <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold overflow-x-auto">
                <button
                  onClick={() => setInspectionTab('profile')}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    inspectionTab === 'profile'
                      ? 'bg-orange-500 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Profile</span>
                </button>

                <button
                  onClick={() => setInspectionTab('rawAnswers')}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    inspectionTab === 'rawAnswers'
                      ? 'bg-orange-500 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Raw Questionnaire Log</span>
                </button>

                <button
                  onClick={() => setInspectionTab('notes')}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    inspectionTab === 'notes'
                      ? 'bg-orange-500 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Counselor Notes</span>
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* TAB 1: STUDENT PROFILE */}
                {inspectionTab === 'profile' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Clear Student Information Cards */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Student Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Student Full Name</span>
                          <p className="text-base font-extrabold text-slate-900 dark:text-white">{inspectDetail.profile.name}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Parent / Student Email</span>
                          <p className="text-base font-bold text-slate-900 dark:text-white">{inspectDetail.profile.email}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">School / Institution</span>
                          <p className="text-base font-bold text-slate-900 dark:text-white">{inspectDetail.profile.school}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Grade Level</span>
                          <p className="text-base font-bold text-slate-900 dark:text-white">{inspectDetail.profile.grade}</p>
                        </div>
                      </div>
                    </div>

                    {/* Exit Career Choice Banner */}
                    <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-orange-500 font-bold uppercase tracking-wider text-[10px]">Selected Target Profession Path:</span>
                        <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">
                          {inspectDetail.assessment.selectedCareerName || 'Candidate has not finalized exit selection yet'}
                        </p>
                      </div>

                      <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/50 text-[11px] font-mono text-slate-500 shrink-0">
                        Exit Timestamp: {new Date(inspectDetail.assessment.completedAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Current Status Info Display */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Current Status:</span>
                      <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold text-xs">
                        {inspectDetail.report.status}
                      </span>
                    </div>

                  </div>
                )}

                {/* TAB 2: RAW QUESTIONNAIRE ANSWERS LOG */}
                {inspectionTab === 'rawAnswers' && (
                  <div className="space-y-4 animate-fadeIn">
                    <p className="text-slate-500 dark:text-slate-400 mb-2">
                      Detailed log of exact option choices selected by candidate across all diagnostic questions:
                    </p>

                    <div className="space-y-3">
                      {questions.map((q, idx) => {
                        const chosenOptId = inspectDetail.assessment.answers[q.id];
                        const chosenOpt = q.options.find(o => o.id === chosenOptId);

                        return (
                          <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-orange-500 font-bold">Q{idx + 1}: {q.category}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                                Selected Option: {chosenOptId || 'N/A'}
                              </span>
                            </div>

                            <p className="font-bold text-slate-900 dark:text-white">{q.question}</p>

                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                              {chosenOpt ? (
                                <span>{chosenOpt.label}</span>
                              ) : (
                                <span className="text-slate-400 italic">No response logged</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: COUNSELOR NOTES */}
                {inspectionTab === 'notes' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <label className="block font-bold text-slate-900 dark:text-white">
                        Edit Team Counselor Log:
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Set Status:</span>
                        <select
                          value={inspectorStatus}
                          onChange={(e) => setInspectorStatus(e.target.value as ReadyDiagnosticReport['status'])}
                          className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-orange-600 dark:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Action Plan Dispatched">Action Plan Dispatched</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      rows={5}
                      value={inspectorNotes}
                      onChange={(e) => setInspectorNotes(e.target.value)}
                      placeholder="Add confidential notes for candidate follow-up..."
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex items-center justify-between">
                      {noteSaved ? (
                        <span className="text-emerald-500 font-bold text-xs">Notes & Status Saved!</span>
                      ) : <div></div>}

                      <button
                        onClick={handleSaveInspectorNotes}
                        className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition shadow flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Notes & Update Status</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
