import { 
  StudentProfile, 
  AssessmentResult, 
  StudentSubmissionDetail, 
  ReadyDiagnosticReport,
  QuestionnaireQuestion,
  CareerProfile
} from './types';
import { sampleInitialSubmissions, questionnaireQuestions, careerCatalog } from './mock-data';

const STORAGE_KEYS = {
  CURRENT_STUDENT: 'ready_portal_current_student',
  CURRENT_ANSWERS: 'ready_portal_current_answers',
  CURRENT_RESULT: 'ready_portal_current_result',
  SUBMISSIONS: 'ready_portal_all_submissions',
  RECYCLE_BIN: 'ready_portal_recycle_bin',
  ADMIN_AUTH: 'ready_portal_admin_authenticated',
  ADMIN_PASSWORD: 'ready_portal_admin_password',
  QUESTIONS: 'ready_portal_custom_questions',
  CAREERS: 'ready_portal_custom_careers',
  THEME: 'ready_theme',
};

const isBrowser = () => typeof window !== 'undefined';

const getItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
};

// Async Cloud API sync helper
const callApi = async (url: string, payload?: any) => {
  if (!isBrowser()) return;
  try {
    const res = await fetch(url, {
      method: payload ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Online API call to ${url} notice:`, err);
  }
};

// Sync remote database to local storage
export const syncRemoteSubmissions = async (): Promise<void> => {
  const data = await callApi('/api/submissions');
  if (data && Array.isArray(data.submissions)) {
    const activeOnly = data.submissions.filter((s: StudentSubmissionDetail) => !s.deletedAt);
    setItem(STORAGE_KEYS.SUBMISSIONS, activeOnly);
  }
  if (data && Array.isArray(data.recycleBin)) {
    setItem(STORAGE_KEYS.RECYCLE_BIN, data.recycleBin);
  }
};

export const syncRemoteQuestions = async (): Promise<QuestionnaireQuestion[]> => {
  const data = await callApi('/api/questions');
  if (data && Array.isArray(data.questions) && data.questions.length > 0) {
    setItem(STORAGE_KEYS.QUESTIONS, data.questions);
    return data.questions;
  }
  return getCustomQuestions();
};

export const syncRemoteCareers = async (): Promise<CareerProfile[]> => {
  const data = await callApi('/api/careers');
  if (data && Array.isArray(data.careers) && data.careers.length > 0) {
    setItem(STORAGE_KEYS.CAREERS, data.careers);
    return data.careers;
  }
  return getCustomCareers();
};

// --- Dynamic Questionnaire Management ---
export const getCustomQuestions = (): QuestionnaireQuestion[] => {
  const stored = getItem<QuestionnaireQuestion[]>(STORAGE_KEYS.QUESTIONS, []);
  if (stored.length > 0) {
    return stored;
  }
  setItem(STORAGE_KEYS.QUESTIONS, questionnaireQuestions);
  return questionnaireQuestions;
};

export const saveCustomQuestions = (questions: QuestionnaireQuestion[]): void => {
  setItem(STORAGE_KEYS.QUESTIONS, questions);
  callApi('/api/questions', { questions });
};

export const deleteCustomQuestion = (id: string): void => {
  const current = getCustomQuestions();
  const updated = current.filter(q => q.id !== id);
  setItem(STORAGE_KEYS.QUESTIONS, updated);
  callApi('/api/questions', { action: 'delete', questionId: id, questions: updated });
};

// --- Dynamic Career Options Management ---
export const getCustomCareers = (): CareerProfile[] => {
  const stored = getItem<CareerProfile[]>(STORAGE_KEYS.CAREERS, []);
  if (stored.length > 0) {
    return stored;
  }
  setItem(STORAGE_KEYS.CAREERS, careerCatalog);
  return careerCatalog;
};

export const saveCustomCareers = (careers: CareerProfile[]): void => {
  setItem(STORAGE_KEYS.CAREERS, careers);
  callApi('/api/careers', { careers });
};

export const deleteCustomCareer = (id: string): void => {
  const current = getCustomCareers();
  const updated = current.filter(c => c.id !== id);
  setItem(STORAGE_KEYS.CAREERS, updated);
  callApi('/api/careers', { action: 'delete', careerId: id, careers: updated });
};

// --- Student Profile ---
export const saveCurrentStudent = (profile: StudentProfile): void => {
  setItem(STORAGE_KEYS.CURRENT_STUDENT, profile);
};

export const getCurrentStudent = (): StudentProfile | null => {
  return getItem<StudentProfile | null>(STORAGE_KEYS.CURRENT_STUDENT, null);
};

// --- Live Questionnaire Answers ---
export const saveQuestionnaireAnswers = (answers: Record<string, string>): void => {
  setItem(STORAGE_KEYS.CURRENT_ANSWERS, answers);
};

export const getQuestionnaireAnswers = (): Record<string, string> => {
  return getItem<Record<string, string>>(STORAGE_KEYS.CURRENT_ANSWERS, {});
};

export const clearQuestionnaireAnswers = (): void => {
  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEYS.CURRENT_ANSWERS);
  }
};

// --- Assessment Result ---
export const saveAssessmentResult = (result: AssessmentResult): void => {
  setItem(STORAGE_KEYS.CURRENT_RESULT, result);
};

export const getAssessmentResult = (): AssessmentResult | null => {
  return getItem<AssessmentResult | null>(STORAGE_KEYS.CURRENT_RESULT, null);
};

// --- Active Submissions & Recycle Bin ---
export const getAllSubmissions = (): StudentSubmissionDetail[] => {
  const stored = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.SUBMISSIONS, []);
  return stored.filter(s => !s.deletedAt);
};

export const saveSubmissionDetail = async (detail: StudentSubmissionDetail): Promise<void> => {
  const existing = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.SUBMISSIONS, []);
  const index = existing.findIndex(s => s.profile.id === detail.profile.id || s.profile.email === detail.profile.email);
  
  if (index >= 0) {
    existing[index] = detail;
  } else {
    existing.unshift(detail);
  }
  
  setItem(STORAGE_KEYS.SUBMISSIONS, existing);
  await callApi('/api/submissions', { action: 'save_submission', detail });
};

export const updateSubmissionAdminNotes = async (
  studentId: string, 
  notes: string, 
  status?: ReadyDiagnosticReport['status']
): Promise<void> => {
  const existing = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.SUBMISSIONS, []);
  const index = existing.findIndex(s => s.profile.id === studentId || s.assessment.studentId === studentId);
  
  if (index >= 0) {
    existing[index].report.adminNotes = notes;
    if (status) {
      existing[index].report.status = status;
    }
    setItem(STORAGE_KEYS.SUBMISSIONS, existing);
    await callApi('/api/submissions', { action: 'update_notes', studentId, notes, status });
  }
};

// --- Recycle Bin Management ---
export const getRecycleBinSubmissions = (): StudentSubmissionDetail[] => {
  const stored = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.RECYCLE_BIN, []);
  return stored.filter(s => !!s.deletedAt);
};

export const moveToRecycleBin = async (studentId: string): Promise<void> => {
  const activeSubs = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.SUBMISSIONS, []);
  const targetIndex = activeSubs.findIndex(s => s.profile.id === studentId || s.assessment.studentId === studentId);
  
  if (targetIndex >= 0) {
    const [targetItem] = activeSubs.splice(targetIndex, 1);
    targetItem.deletedAt = new Date().toISOString();

    const binItems = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.RECYCLE_BIN, []);
    const filteredBin = binItems.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
    filteredBin.unshift(targetItem);

    setItem(STORAGE_KEYS.SUBMISSIONS, activeSubs);
    setItem(STORAGE_KEYS.RECYCLE_BIN, filteredBin);
    await callApi('/api/submissions', { action: 'move_to_bin', studentId, detail: targetItem });
  }
};

export const restoreFromRecycleBin = async (studentId: string): Promise<void> => {
  const binItems = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.RECYCLE_BIN, []);
  const targetIndex = binItems.findIndex(s => s.profile.id === studentId || s.assessment.studentId === studentId);
  
  if (targetIndex >= 0) {
    const [targetItem] = binItems.splice(targetIndex, 1);
    delete targetItem.deletedAt;

    const activeSubs = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.SUBMISSIONS, []);
    const filteredActive = activeSubs.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
    filteredActive.unshift(targetItem);

    setItem(STORAGE_KEYS.SUBMISSIONS, filteredActive);
    setItem(STORAGE_KEYS.RECYCLE_BIN, binItems);
    await callApi('/api/submissions', { action: 'restore_from_bin', studentId, detail: targetItem });
  }
};

export const permanentlyDeleteSubmission = async (studentId: string): Promise<void> => {
  const binItems = getItem<StudentSubmissionDetail[]>(STORAGE_KEYS.RECYCLE_BIN, []);
  const updatedBin = binItems.filter(s => s.profile.id !== studentId && s.assessment.studentId !== studentId);
  setItem(STORAGE_KEYS.RECYCLE_BIN, updatedBin);
  await callApi('/api/submissions', { action: 'permanent_delete', studentId });
};

export const emptyRecycleBin = async (): Promise<void> => {
  setItem(STORAGE_KEYS.RECYCLE_BIN, []);
  await callApi('/api/submissions', { action: 'empty_bin' });
};

// --- Admin Password Management & Authentication ---
export const getAdminPassword = (): string => {
  return getItem<string>(STORAGE_KEYS.ADMIN_PASSWORD, '1234');
};

export const setAdminPassword = (newPassword: string): void => {
  const clean = newPassword.trim();
  setItem(STORAGE_KEYS.ADMIN_PASSWORD, clean);
  callApi('/api/admin-auth', { action: 'update', password: clean });
};

export const syncRemoteAdminPassword = async (): Promise<void> => {
  const data = await callApi('/api/admin-auth');
  if (data && data.password) {
    setItem(STORAGE_KEYS.ADMIN_PASSWORD, data.password);
  }
};

export const verifyAdminPassword = (input: string): boolean => {
  const clean = input.trim();
  const currentPass = getAdminPassword();
  return clean === currentPass;
};

export const isAdminAuthenticated = (): boolean => {
  if (!isBrowser()) return false;
  
  window.localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  
  try {
    const sessionVal = window.sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return sessionVal ? JSON.parse(sessionVal) === true : false;
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (auth: boolean): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  try {
    if (auth) {
      window.sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(true));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  } catch (e) {
    console.error(e);
  }
};

export const logoutAdmin = (): void => {
  setAdminAuthenticated(false);
};
