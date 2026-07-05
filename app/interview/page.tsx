"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import frontend from "@/data/frontend-questions.json";
import backend from "@/data/backend-questions.json";
import aiml from "@/data/aiml-questions.json";
import hr from "@/data/hr-questions.json";
import python from "@/data/python-questions.json";
import { orchestrateEvaluate } from "@/lib/ai";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { ScoreBreakdown } from "@/lib/types";
import { saveResults, clearResults } from "@/lib/results";
import type { AnswerRecord } from "@/lib/results";

const dataset: Record<string, any[]> = { frontend, backend, python, aiml, hr };

export default function InterviewPage() {
  const params = useSearchParams();
  const initial = params.get("role") ?? "frontend";
  const [role, setRole] = useState<string>(dataset[initial] ? initial : "frontend");
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState<ScoreBreakdown[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerRef = useRef("");
  const answersRef = useRef<AnswerRecord[]>([]);
  const scoresRef = useRef<ScoreBreakdown[]>([]);
  const roleRef = useRef(role);
  const qRef = useRef<{ id: string; question: string; difficulty: string }>({ id: "", question: "", difficulty: "" });

  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const startTimer = () => {
    clearTimer();
    setTimer(120);
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearTimer();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const q = useMemo(() => dataset[role][i], [role, i]);

  useEffect(() => { startTimer(); return clearTimer; }, [i, role]);

  useEffect(() => { answerRef.current = answer; }, [answer]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { scoresRef.current = scores; }, [scores]);
  useEffect(() => { roleRef.current = role; }, [role]);
  useEffect(() => { qRef.current = q; }, [q]);

  const submit = async () => {
    const currentAnswer = answerRef.current;
    if (!currentAnswer.trim()) return;
    setLoading(true);
    try {
      const pipelineId = localStorage.getItem("gradiora_pipeline_id") ?? undefined;
      const result = await orchestrateEvaluate(qRef.current as any, currentAnswer, pipelineId);
      const scores = result.scores ?? { overall: 0, technicalAccuracy: 0, completeness: 0, communication: 0, confidence: 0, sentiment: 0, feedback: "" };
      if (result.state?.id && !pipelineId) {
        localStorage.setItem("gradiora_pipeline_id", result.state.id);
      }
      const record: AnswerRecord = {
        questionId: qRef.current.id,
        questionText: qRef.current.question,
        answerText: currentAnswer,
        difficulty: qRef.current.difficulty,
        scores
      };
      const nextAnswers = [...answersRef.current, record];
      const nextScores = [...scoresRef.current, scores];
      setAnswers(nextAnswers);
      setScores(nextScores);
      saveResults(roleRef.current, nextAnswers);
      setAnswer("");
      answerRef.current = "";
      setI((p) => Math.min(p + 1, dataset[roleRef.current].length - 1));
    } catch (err: any) {
      console.error("Evaluation failed:", err);
    }
    setLoading(false);
  };

  const submitOnTimer = useRef(submit);
  submitOnTimer.current = submit;

  useEffect(() => {
    if (timer === 0 && answerRef.current.trim()) {
      submitOnTimer.current();
    }
  }, [timer]);

  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b.overall, 0) / scores.length) : 0;

  const switchRole = (r: string) => {
    clearTimer();
    setRole(r);
    setI(0);
    setAnswers([]);
    setScores([]);
    setAnswer("");
    answerRef.current = "";
    clearResults();
  };

  const displayTimer = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold capitalize">{role} Interview Chat</h1>
      <p className="mb-4 text-white/65">Real-time local AI scoring with adaptive difficulty and semantic feedback.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(dataset).map((r) => (
          <button
            key={r}
            onClick={() => switchRole(r)}
            className="rounded-lg border border-white/10 px-3 py-1.5 capitalize hover:bg-white/10"
          >
            {r}
          </button>
        ))}
      </div>
      <Card>
        <div className="mb-3 flex justify-between text-sm text-white/60">
          <span>Question {i + 1}</span>
          <span>Avg Score {avg}%</span>
        </div>
        <Progress value={((i) / dataset[role].length) * 100} />
        <p className="mt-4 text-lg">{q.question}</p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={loading || timer === 0}
          className="mt-4 h-36 w-full rounded-xl border border-white/10 bg-black/20 p-3 disabled:opacity-50"
          placeholder="Type your response..."
        />
        <div className="mt-3 flex items-center gap-3">
          <Button onClick={submit} disabled={loading || !answer.trim()}>{loading ? "Analyzing..." : "Submit Answer"}</Button>
          <span className="text-xs text-white/60">Difficulty: {q.difficulty}</span>
          <span className={`ml-auto font-mono ${timer <= 10 ? "text-red-400" : "text-white/60"}`}>
            {displayTimer}
          </span>
        </div>
      </Card>
      <Link href="/report" className="mt-4 inline-block">
        <Button variant="ghost">Finish & View Final Report</Button>
      </Link>
    </main>
  );
}
