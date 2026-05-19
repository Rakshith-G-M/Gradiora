export type InterviewRole = "frontend" | "backend" | "python" | "aiml" | "hr";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  question: string;
  difficulty: Difficulty;
  keywords: string[];
  expectedConcepts: string[];
  idealAnswerSummary: string;
}

export interface ScoreBreakdown {
  technicalAccuracy: number;
  completeness: number;
  communication: number;
  confidence: number;
  sentiment: number;
  overall: number;
}
