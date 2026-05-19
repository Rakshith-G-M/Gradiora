"use client";

import { supabase } from "@/lib/supabase";

export async function ensureUserProfile(userId: string, email: string | null) {
  return supabase.from("users").upsert({ id: userId, email }, { onConflict: "id" });
}

export async function createInterviewSession(userId: string, role: string) {
  return supabase
    .from("interview_sessions")
    .insert({ user_id: userId, selected_role: role, status: "in_progress", started_at: new Date().toISOString() })
    .select("id")
    .single();
}

export async function saveInterviewAnswer(input: {
  sessionId: string;
  questionId: string;
  questionText: string;
  answerText: string;
  difficulty: string;
  nlpScore: number;
  sentimentScore: number;
}) {
  return supabase.from("interview_answers").insert({
    session_id: input.sessionId,
    question_id: input.questionId,
    question_text: input.questionText,
    answer_text: input.answerText,
    difficulty: input.difficulty,
    nlp_score: input.nlpScore,
    sentiment_score: input.sentimentScore,
    answered_at: new Date().toISOString()
  });
}

export async function saveInterviewReport(input: {
  sessionId: string;
  userId: string;
  overallScore: number;
  technicalScore: number;
  confidenceScore: number;
  communicationScore: number;
  analytics: Record<string, unknown>;
}) {
  await supabase
    .from("interview_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", input.sessionId);

  return supabase.from("interview_reports").upsert(
    {
      session_id: input.sessionId,
      user_id: input.userId,
      overall_score: input.overallScore,
      technical_score: input.technicalScore,
      confidence_score: input.confidenceScore,
      communication_score: input.communicationScore,
      analytics: input.analytics,
      generated_at: new Date().toISOString()
    },
    { onConflict: "session_id" }
  );
}

export async function fetchUserReports(userId: string) {
  return supabase
    .from("interview_reports")
    .select("id, session_id, overall_score, technical_score, confidence_score, communication_score, generated_at")
    .eq("user_id", userId)
    .order("generated_at", { ascending: false });
}
