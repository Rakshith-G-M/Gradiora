"use client";

import { fallbackKeys, getLocal, pushLocal } from "@/lib/fallback";
import { supabase } from "@/lib/supabase";

export async function ensureUserProfile(userId: string, email: string | null) {
  if (!supabase) return { data: { id: userId, email }, error: null } as any;
  const res = await supabase.from("users").upsert({ id: userId, email }, { onConflict: "id" });
  return res.error ? ({ data: { id: userId, email }, error: null } as any) : (res as any);
}

export async function createInterviewSession(userId: string, role: string) {
  const localId = `sess-${crypto.randomUUID()}`;
  if (!supabase) {
    pushLocal(fallbackKeys.sessions, { id: localId, user_id: userId, selected_role: role, started_at: new Date().toISOString() });
    return { data: { id: localId }, error: null } as any;
  }
  const res = await supabase
    .from("interview_sessions")
    .insert({ user_id: userId, selected_role: role, status: "in_progress", started_at: new Date().toISOString() })
    .select("id")
    .single();
  if (res.error) {
    pushLocal(fallbackKeys.sessions, { id: localId, user_id: userId, selected_role: role, started_at: new Date().toISOString() });
    return { data: { id: localId }, error: null } as any;
  }
  return res as any;
}

export async function saveInterviewAnswer(input: any) {
  const row = { ...input, answered_at: new Date().toISOString() };
  if (!supabase) return pushLocal(fallbackKeys.answers, row);
  const res = await supabase.from("interview_answers").insert({
    session_id: input.sessionId,
    question_id: input.questionId,
    question_text: input.questionText,
    answer_text: input.answerText,
    difficulty: input.difficulty,
    nlp_score: input.nlpScore,
    sentiment_score: input.sentimentScore,
    answered_at: row.answered_at
  });
  if (res.error) pushLocal(fallbackKeys.answers, row);
  return res as any;
}

export async function saveInterviewReport(input: any) {
  const row = { ...input, generated_at: new Date().toISOString() };
  if (!supabase) return pushLocal(fallbackKeys.reports, row);
  await supabase.from("interview_sessions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", input.sessionId);
  const res = await supabase.from("interview_reports").upsert({
    session_id: input.sessionId,
    user_id: input.userId,
    overall_score: input.overallScore,
    technical_score: input.technicalScore,
    confidence_score: input.confidenceScore,
    communication_score: input.communicationScore,
    analytics: input.analytics,
    generated_at: row.generated_at
  }, { onConflict: "session_id" });
  if (res.error) pushLocal(fallbackKeys.reports, row);
  return res as any;
}

export async function fetchUserReports(userId: string) {
  const local = getLocal<any>(fallbackKeys.reports)
    .filter((r) => r.userId === userId || r.user_id === userId)
    .map((r, i) => ({ id: r.id ?? `local-${i}`, overall_score: r.overallScore ?? r.overall_score ?? 0, generated_at: r.generated_at ?? new Date().toISOString() }));
  if (!supabase) return { data: local, error: null } as any;
  const res = await supabase
    .from("interview_reports")
    .select("id, session_id, overall_score, technical_score, confidence_score, communication_score, generated_at")
    .eq("user_id", userId)
    .order("generated_at", { ascending: false });
  if (res.error) return { data: local, error: null } as any;
  return { data: [...(res.data ?? []), ...local], error: null } as any;
}
