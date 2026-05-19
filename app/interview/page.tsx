"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import frontend from "@/data/frontend-questions.json";
import backend from "@/data/backend-questions.json";
import python from "@/data/python-questions.json";
import aiml from "@/data/aiml-questions.json";
import hr from "@/data/hr-questions.json";
import { evaluateAnswer } from "@/lib/ai";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSessionGuard } from "@/components/sections/auth-gate";
import { createInterviewSession, saveInterviewAnswer } from "@/lib/db";

const datasets: Record<string, any[]> = { frontend, backend, python, aiml, hr };
const levels = ["easy", "medium", "hard"];

function InterviewContent() {
  const { session, checking } = useSessionGuard();
  const params = useSearchParams();
  const router = useRouter();
  const role = params.get("role") || "";
  const [pool, setPool] = useState<any[]>([]);
  const [used, setUsed] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<number[]>([]);
  const [last, setLast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!datasets[role]) router.replace("/dashboard");
  }, [role, router]);

  useEffect(() => {
    if (!datasets[role]) return;
    const shuffled = [...datasets[role]].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setUsed([]);
    setDifficulty("easy");
  }, [role]);

  useEffect(() => {
    if (!session?.user?.id || sessionId || !datasets[role]) return;
    createInterviewSession(session.user.id, role).then((res: any) => setSessionId(res?.data?.id ?? null));
  }, [role, session?.user?.id, sessionId]);

  const current = useMemo(() => {
    const cands = pool.filter((q) => !used.includes(q.id) && q.difficulty === difficulty);
    return cands[0] || pool.find((q) => !used.includes(q.id)) || null;
  }, [pool, used, difficulty]);

  const submit = async () => {
    if (!sessionId || !current || !answer.trim()) return;
    setLoading(true);
    const r = await evaluateAnswer(current, answer);
    await saveInterviewAnswer({ sessionId, questionId: current.id, questionText: current.question, answerText: answer, difficulty: current.difficulty, nlpScore: r.overall, sentimentScore: r.sentiment });
    const newScores = [...score, r.overall];
    setScore(newScores);
    setLast(r);
    setUsed((u) => [...u, current.id]);
    const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
    sessionStorage.setItem("gradiora_latest_report", JSON.stringify({ role, sessionId, avg, last: r, scores: newScores }));

    const step = r.overall >= 75 ? 1 : r.overall <= 45 ? -1 : 0;
    const idx = Math.max(0, Math.min(2, levels.indexOf(difficulty) + step));
    setDifficulty(levels[idx] as any);
    setAnswer("");
    setLoading(false);
    setTyping(true);
    setTimeout(() => setTyping(false), 900);
  };

  const avg = score.length ? Math.round(score.reduce((a, b) => a + b, 0) / score.length) : 0;
  if (checking || !session || !datasets[role]) return <main className="mx-auto max-w-5xl px-6 py-10"><div className="glass h-56 rounded-3xl shimmer" /></main>;
  if (!current) return <main className="mx-auto max-w-5xl px-6 py-10"><Card><p>Interview complete.</p><Link href={`/report?sessionId=${sessionId ?? ""}&avg=${avg}&role=${role}`}><Button className="mt-4">View Final Report</Button></Link></Card></main>;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-3 flex items-center justify-between"><h1 className="text-3xl font-bold capitalize">{role} Interview Chat</h1><span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase">{role}</span></div>
      <p className="mb-4 text-white/65">Interviewer: Nova — "I’ll adapt based on your responses. Think aloud and explain trade-offs."</p>
      <Card>
        <div className="mb-3 flex justify-between text-sm text-white/60"><span>Question {used.length + 1}</span><span>Avg Score {avg}%</span></div>
        <Progress value={Math.min(100, ((used.length) / Math.max(1, pool.length)) * 100)} />
        <p className="mt-4 text-lg">{typing ? "AI interviewer is preparing your next question..." : current.question}</p>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="mt-4 h-36 w-full rounded-xl border border-white/10 bg-black/20 p-3" placeholder="Type your response..." disabled={typing} />
        <div className="mt-3 flex items-center gap-3"><Button onClick={submit} disabled={loading || typing || !answer || !sessionId}>{loading ? "Analyzing..." : "Submit Answer"}</Button><span className="text-xs text-white/60">Difficulty: {difficulty}</span><span className="ml-auto">Confidence: {last?.confidence ?? "--"}%</span></div>
      </Card>
      <Link href={`/report?sessionId=${sessionId ?? ""}&avg=${avg}&role=${role}`} className="mt-4 inline-block"><Button variant="ghost">Finish & View Final Report</Button></Link>
    </main>
  );
}

export default function InterviewPage() {
  return <Suspense fallback={<main className="mx-auto max-w-5xl px-6 py-10"><div className="glass h-56 rounded-3xl shimmer" /></main>}><InterviewContent /></Suspense>;
}
