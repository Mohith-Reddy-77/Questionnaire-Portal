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

export type QuestionType = 'mcq' | 'msq' | 'paragraph' | 'scaling';

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
  type?: QuestionType;
  options: QuestionnaireOption[];
  minLabel?: string;
  maxLabel?: string;
  minValue?: number;
  maxValue?: number;
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
  answers: Record<string, any>; // questionId -> optionId (string), optionIds (string[]), rating (string), or text response
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
