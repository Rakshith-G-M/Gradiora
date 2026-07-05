"use client";
import type { ScoreBreakdown } from "./types";

export interface AnswerRecord {
  questionId: string;
  questionText: string;
  answerText: string;
  difficulty: string;
  scores: ScoreBreakdown;
}

export interface InterviewResults {
  role: string;
  answers: AnswerRecord[];
}

const STORAGE_KEY = "gradiora_interview_results";

export function saveResults(role: string, answers: AnswerRecord[]) {
  if (typeof window === "undefined") return;
  const data: InterviewResults = { role, answers };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadResults(): InterviewResults | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as InterviewResults) : null;
}

export function clearResults() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
