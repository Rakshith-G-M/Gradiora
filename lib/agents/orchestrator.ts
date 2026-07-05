import {
  localProfile,
  localRoadmap,
  localQuestions,
  localEvaluate,
  localReport,
} from "./local";
import type {
  PipelineStage,
  PipelineStatus,
  PipelineContext,
  PipelineState,
  UserProfile,
  RoadmapNode,
  Question,
  ScoreBreakdown,
  ReportData,
  AnswerRecord,
} from "./types";

// ── In-memory pipeline store ─────────────────────────────────
const pipelines = new Map<string, PipelineState>();

function generateId(): string {
  return `pipeline_${(typeof crypto !== "undefined" && crypto.randomUUID?.()) ?? Math.random().toString(36).slice(2)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function getPipeline(id: string): PipelineState | undefined {
  return pipelines.get(id);
}

export function createPipeline(userId: string): PipelineState {
  const state: PipelineState = {
    id: generateId(),
    status: "pending",
    currentStage: null,
    context: { userId },
    stages: [
      { stage: "assessment", status: "pending" },
      { stage: "questions", status: "pending" },
      { stage: "evaluate", status: "pending" },
      { stage: "report", status: "pending" },
    ],
    createdAt: now(),
    updatedAt: now(),
  };
  pipelines.set(state.id, state);
  return state;
}

function updateStage(
  state: PipelineState,
  stage: PipelineStage,
  status: PipelineStatus,
  error?: string
) {
  const s = state.stages.find((s) => s.stage === stage);
  if (s) {
    s.status = status;
    if (status === "running") s.startedAt = now();
    if (status === "completed") s.completedAt = now();
    if (error) s.error = error;
  }
  state.currentStage = status === "running" ? stage : state.currentStage;
  state.updatedAt = now();
}

// ── Fully local agent runners ────────────────────────────────

async function runAssessmentAgent(
  rawMessage: string
): Promise<{ profile: UserProfile; roadmap: RoadmapNode }> {
  const profile = localProfile(rawMessage);
  const roadmap = localRoadmap(profile);
  return { profile, roadmap };
}

async function runQuestionsAgent(
  role: string,
  count = 10
): Promise<Question[]> {
  return localQuestions(role, count);
}

async function runEvaluateAgent(
  question: Question,
  answer: string
): Promise<ScoreBreakdown> {
  return localEvaluate(question, answer);
}

async function runReportAgent(
  role: string,
  answers: AnswerRecord[]
): Promise<ReportData> {
  return localReport(role, answers);
}

// ── Pipeline runners ─────────────────────────────────────────

export async function runFullPipeline(
  state: PipelineState,
  rawMessage: string
): Promise<PipelineState> {
  state.status = "running";

  try {
    updateStage(state, "assessment", "running");
    const { profile, roadmap } = await runAssessmentAgent(rawMessage);
    state.context.profile = profile;
    state.context.roadmap = roadmap;
    updateStage(state, "assessment", "completed");

    updateStage(state, "questions", "running");
    const questions = await runQuestionsAgent(profile.targetRole);
    state.context.questions = questions;
    updateStage(state, "questions", "completed");

    state.status = "completed";
  } catch (err: any) {
    state.status = "failed";
    state.context.error = err.message;
    const currentStage = state.stages.find((s) => s.status === "running");
    if (currentStage) updateStage(state, currentStage.stage, "failed", err.message);
  }

  state.updatedAt = now();
  return state;
}

export async function runAssessmentOnlyPipeline(
  state: PipelineState,
  rawMessage: string
): Promise<PipelineState> {
  state.status = "running";

  try {
    updateStage(state, "assessment", "running");
    const { profile, roadmap } = await runAssessmentAgent(rawMessage);
    state.context.profile = profile;
    state.context.roadmap = roadmap;
    updateStage(state, "assessment", "completed");
    state.status = "completed";
  } catch (err: any) {
    state.status = "failed";
    state.context.error = err.message;
    updateStage(state, "assessment", "failed", err.message);
  }

  state.updatedAt = now();
  return state;
}

export async function runQuestionsOnlyPipeline(
  state: PipelineState,
  role: string,
  count?: number
): Promise<PipelineState> {
  state.status = "running";

  try {
    updateStage(state, "questions", "running");
    const questions = await runQuestionsAgent(role, count);
    state.context.questions = questions;
    updateStage(state, "questions", "completed");
    state.status = "completed";
  } catch (err: any) {
    state.status = "failed";
    state.context.error = err.message;
    updateStage(state, "questions", "failed", err.message);
  }

  state.updatedAt = now();
  return state;
}

export async function runEvaluateOnlyPipeline(
  state: PipelineState,
  question: Question,
  answer: string
): Promise<PipelineState> {
  state.status = "running";

  try {
    updateStage(state, "evaluate", "running");
    const scores = await runEvaluateAgent(question, answer);
    const record: AnswerRecord = {
      questionId: question.id,
      questionText: question.question,
      answerText: answer,
      difficulty: question.difficulty,
      scores,
    };
    state.context.answers = [...(state.context.answers ?? []), record];
    updateStage(state, "evaluate", "completed");
    state.status = "completed";
  } catch (err: any) {
    state.status = "failed";
    state.context.error = err.message;
    updateStage(state, "evaluate", "failed", err.message);
  }

  state.updatedAt = now();
  return state;
}

export async function runReportOnlyPipeline(
  state: PipelineState,
  role: string,
  answers: AnswerRecord[]
): Promise<PipelineState> {
  state.status = "running";

  try {
    updateStage(state, "report", "running");
    const report = await runReportAgent(role, answers);
    state.context.report = report;
    updateStage(state, "report", "completed");
    state.status = "completed";
  } catch (err: any) {
    state.status = "failed";
    state.context.error = err.message;
    updateStage(state, "report", "failed", err.message);
  }

  state.updatedAt = now();
  return state;
}
