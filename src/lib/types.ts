export type DimensionKey = 
  | 'analytical'
  | 'creative'
  | 'leadership'
  | 'technical'
  | 'research'
  | 'communication';

export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  targetYear?: string;
  primaryInterests?: string[];
  createdAt?: string;
};

export type QuestionnaireOption = {
  id: string;
  label: string;
  description?: string;
  dimensionWeights: Record<DimensionKey, number>;
};

export type QuestionnaireQuestion = {
  id: string;
  category: string;
  question: string;
  subtitle?: string;
  options: QuestionnaireOption[];
};

export type CareerProfile = {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  matchPercentage?: number;
  salaryRange?: string;
  growthOutlook?: string;
  requiredSkills: string[];
  recommendedRoadmap?: string[];
  primaryDimension: DimensionKey;
  accentColor: string;
  pdfUrl?: string;
};

export type CareerMatch = CareerProfile & {
  score?: number;
  fitReason?: string;
};

export type AssessmentResult = {
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  completedAt: string;
  answers: Record<string, string>; // questionId -> optionId
  dimensionScores: Record<DimensionKey, number>;
  topCareerMatches: CareerMatch[];
  selectedCareerId?: string;
  selectedCareerName?: string;
  selectedCareerIds?: string[];
  selectedCareerNames?: string[];
  exitTimestamp?: string;
};

export type ReadyDiagnosticReport = {
  adminNotes?: string;
  status: 'Pending Review' | 'Reviewed' | 'Action Plan Dispatched';
};

export type StudentSubmissionDetail = {
  profile: StudentProfile;
  assessment: AssessmentResult;
  report: ReadyDiagnosticReport;
  deletedAt?: string;
};

export type FastTrackSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  selectedCareers: string[];
  createdAt: string;
  deletedAt?: string;
};
