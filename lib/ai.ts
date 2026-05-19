"use client";
import { pipeline } from "@xenova/transformers";
import type { Question, ScoreBreakdown } from "./types";

let featureExtractor: any;
let sentimentClassifier: any;

export async function loadModels() {
  if (!featureExtractor) featureExtractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  if (!sentimentClassifier) sentimentClassifier = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");
}

const cosine = (a: number[], b: number[]) => {
  const d = a.reduce((s, v, i) => s + v * b[i], 0);
  const ma = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const mb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return d / (ma * mb + 1e-9);
};

export async function evaluateAnswer(question: Question, answer: string): Promise<ScoreBreakdown> {
  await loadModels();
  const qVec = Array.from((await featureExtractor(question.idealAnswerSummary, { pooling: "mean", normalize: true })).data as Float32Array);
  const aVec = Array.from((await featureExtractor(answer, { pooling: "mean", normalize: true })).data as Float32Array);

  const semantic = Math.max(0, cosine(qVec, aVec));
  const keyword = question.keywords.filter((k) => answer.toLowerCase().includes(k.toLowerCase())).length / Math.max(1, question.keywords.length);
  const sentiment = await sentimentClassifier(answer);
  const positive = sentiment[0]?.label === "POSITIVE" ? sentiment[0].score : 1 - sentiment[0].score;
  const lengthScore = Math.min(1, answer.trim().split(/\s+/).length / 90);
  const communication = Math.min(1, 0.25 + (answer.match(/[,.]/g)?.length ?? 0) * 0.08 + (answer.match(/\b(first|then|because|therefore|trade-off)\b/gi)?.length ?? 0) * 0.06);
  const confidence = Math.min(1, positive * 0.45 + (answer.match(/\b(will|can|designed|implemented|measured|improved|optimized)\b/gi)?.length ?? 0) * 0.08);
  const problemSolving = Math.min(1, semantic * 0.5 + keyword * 0.3 + lengthScore * 0.2);

  const technicalAccuracy = Math.min(1, semantic * 0.65 + keyword * 0.35);
  const overall = technicalAccuracy * 0.32 + communication * 0.2 + confidence * 0.18 + problemSolving * 0.2 + lengthScore * 0.1;

  const pct = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 100);
  return {
    technicalAccuracy: pct(technicalAccuracy),
    completeness: pct(problemSolving),
    communication: pct(communication),
    confidence: pct(confidence),
    sentiment: pct(positive),
    overall: pct(overall)
  };
}
