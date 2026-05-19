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

const extractKeywordsScore = (answer: string, keywords: string[]) => {
  const lower = answer.toLowerCase();
  return keywords.filter((k) => lower.includes(k.toLowerCase())).length / Math.max(1, keywords.length);
};

export async function evaluateAnswer(question: Question, answer: string): Promise<ScoreBreakdown> {
  await loadModels();
  const qVec = Array.from((await featureExtractor(question.idealAnswerSummary, { pooling: "mean", normalize: true })).data as Float32Array);
  const aVec = Array.from((await featureExtractor(answer, { pooling: "mean", normalize: true })).data as Float32Array);
  const semantic = Math.max(0, cosine(qVec, aVec));
  const keyword = extractKeywordsScore(answer, question.keywords);
  const sentiment = await sentimentClassifier(answer);
  const positive = sentiment[0]?.label === "POSITIVE" ? sentiment[0].score : 1 - sentiment[0].score;
  const completeness = Math.min(1, answer.split(" ").length / 80);
  const communication = Math.min(1, (answer.match(/[,.]/g)?.length ?? 0) / 8 + 0.3);
  const confidence = Math.min(1, (answer.match(/\b(will|can|implemented|measured|improved)\b/gi)?.length ?? 0) / 6 + positive * 0.3);

  const technicalAccuracy = semantic * 0.6 + keyword * 0.4;
  const overall = technicalAccuracy * 0.35 + completeness * 0.2 + communication * 0.2 + confidence * 0.15 + positive * 0.1;

  const toPct = (v: number) => Math.round(v * 100);
  return { technicalAccuracy: toPct(technicalAccuracy), completeness: toPct(completeness), communication: toPct(communication), confidence: toPct(confidence), sentiment: toPct(positive), overall: toPct(overall) };
}
