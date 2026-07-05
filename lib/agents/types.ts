export type Difficulty = "easy" | "medium" | "hard";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type InterviewRole = "frontend" | "backend" | "python" | "aiml" | "hr" | "fullstack" | "devops" | "mobile";

export interface UserProfile {
  currentRole: string;
  targetRole: InterviewRole;
  experienceLevel: ExperienceLevel;
  yearsOfExperience: number;
  strengths: string[];
  weaknesses: string[];
  goals: string[];
  timelineWeeks: number;
  topicsCompleted: string[];
  completed: boolean;
}

export interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  progress: number;
  children: RoadmapNode[];
  resources?: string[];
}

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
  feedback: string;
}

export interface ReportData {
  overallScore: number;
  technicalScore: number;
  confidenceScore: number;
  communicationScore: number;
  completenessScore: number;
  perQuestion: { question: string; score: number; feedback: string }[];
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

// ── Orchestration types ──────────────────────────────────────
export type PipelineStage =
  | "assessment"
  | "questions"
  | "evaluate"
  | "report";

export type PipelineStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface PipelineContext {
  userId: string;
  profile?: UserProfile;
  roadmap?: RoadmapNode;
  questions?: Question[];
  sessionId?: string;
  answers?: AnswerRecord[];
  report?: ReportData;
  error?: string;
}

export interface PipelineState {
  id: string;
  status: PipelineStatus;
  currentStage: PipelineStage | null;
  context: PipelineContext;
  stages: {
    stage: PipelineStage;
    status: PipelineStatus;
    startedAt?: string;
    completedAt?: string;
    error?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AnswerRecord {
  questionId: string;
  questionText: string;
  answerText: string;
  difficulty: string;
  scores: ScoreBreakdown;
}
