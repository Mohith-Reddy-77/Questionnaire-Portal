import { 
  DimensionKey, 
  QuestionnaireQuestion, 
  CareerProfile, 
  CareerMatch, 
  ReadyDiagnosticReport, 
  StudentProfile 
} from './types';
import { questionnaireQuestions, careerCatalog } from './mock-data';
import { getCustomCareers } from './storage';

export const calculateDimensionScores = (
  answers: Record<string, string>,
  questions: QuestionnaireQuestion[] = questionnaireQuestions
): Record<DimensionKey, number> => {
  const totals: Record<DimensionKey, number> = {
    analytical: 0,
    technical: 0,
    research: 0,
    creative: 0,
    leadership: 0,
    communication: 0,
  };

  const maxPossible: Record<DimensionKey, number> = {
    analytical: 0,
    technical: 0,
    research: 0,
    creative: 0,
    leadership: 0,
    communication: 0,
  };

  // Compute max possible weights per dimension across answered questions
  questions.forEach((q) => {
    q.options.forEach((opt) => {
      (Object.keys(opt.dimensionWeights) as DimensionKey[]).forEach((dim) => {
        maxPossible[dim] += opt.dimensionWeights[dim] || 0;
      });
    });

    const selectedOptionId = answers[q.id];
    if (selectedOptionId) {
      const chosenOpt = q.options.find((o) => o.id === selectedOptionId);
      if (chosenOpt) {
        (Object.keys(chosenOpt.dimensionWeights) as DimensionKey[]).forEach((dim) => {
          totals[dim] += chosenOpt.dimensionWeights[dim] || 0;
        });
      }
    }
  });

  // Normalize to 0-100 scale
  const normalized: Record<DimensionKey, number> = {
    analytical: 50,
    technical: 50,
    research: 50,
    creative: 50,
    leadership: 50,
    communication: 50,
  };

  (Object.keys(totals) as DimensionKey[]).forEach((dim) => {
    const raw = totals[dim];
    const scaled = Math.min(98, Math.max(35, Math.round((raw / 15) * 100)));
    normalized[dim] = scaled;
  });

  return normalized;
};

export const matchCareers = (
  scores: Record<DimensionKey, number>,
  catalog?: CareerProfile[]
): CareerMatch[] => {
  const activeCatalog = catalog && catalog.length > 0 ? catalog : getCustomCareers();

  const matches: CareerMatch[] = activeCatalog.map((career) => {
    const primaryScore = scores[career.primaryDimension] || 50;
    
    // Fit calculation: 75% primary dimension + 25% aggregate top strengths
    const allScores = Object.values(scores);
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    
    const finalScore = Math.min(99, Math.max(65, Math.round(primaryScore * 0.75 + avgScore * 0.25)));

    let fitReason = `High alignment with your ${career.primaryDimension} aptitude score (${primaryScore}%).`;
    if (career.primaryDimension === 'technical') {
      fitReason = `Your computational logic (${scores.technical}%) and problem-solving focus match high-demand software & systems roles.`;
    } else if (career.primaryDimension === 'leadership') {
      fitReason = `Your strong strategic vision (${scores.leadership}%) and team collaboration (${scores.communication}%) make you a natural lead.`;
    } else if (career.primaryDimension === 'creative') {
      fitReason = `Your design intuition (${scores.creative}%) combined with human empathy score (${scores.communication}%) shines in UI/UX architecture.`;
    } else if (career.primaryDimension === 'analytical') {
      fitReason = `Your mathematical rigor (${scores.analytical}%) and quantitative breakdown skills suit financial algorithms and data analytics.`;
    } else if (career.primaryDimension === 'research') {
      fitReason = `Your deep investigation score (${scores.research}%) and analytical focus (${scores.analytical}%) align with scientific research.`;
    }

    return {
      ...career,
      matchPercentage: finalScore,
      score: finalScore,
      fitReason,
    };
  });

  // Sort descending by match score
  return matches.sort((a, b) => (b.score || 0) - (a.score || 0));
};

export const generateReadyDiagnosticReport = (
  profile: StudentProfile,
  scores: Record<DimensionKey, number>,
  topCareer: CareerMatch
): ReadyDiagnosticReport => {
  return {
    adminNotes: `Candidate selected exit target: ${topCareer.title}.`,
    status: 'Pending Review',
  };
};
