"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import frontend from "@/data/frontend-questions.json";
import backend from "@/data/backend-questions.json";
import aiml from "@/data/aiml-questions.json";
import hr from "@/data/hr-questions.json";
import { evaluateAnswer } from "@/lib/ai";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const dataset: Record<string, any[]> = { frontend, backend, python: backend, aiml, hr };

export default function InterviewPage() {
  const params = useSearchParams();
  const initial = params.get("role") ?? "frontend";
  const [role, setRole] = useState<string>(dataset[initial] ? initial : "frontend");
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const q = useMemo(() => dataset[role][i], [role, i]);

  const submit = async () => {
    setLoading(true);
    const r = await evaluateAnswer(q, answer);
    setScore((s) => [...s, r.overall]);
    setAnswer("");
    setI((p) => Math.min(p + 1, dataset[role].length - 1));
    setLoading(false);
  };

  const avg = score.length ? Math.round(score.reduce((a, b) => a + b, 0) / score.length) : 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold capitalize">{role} Interview Chat</h1>
      <p className="mb-4 text-white/65">Real-time local AI scoring with adaptive difficulty and semantic feedback.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(dataset).map((r) => (
          <button
            key={r}
            onClick={() => {
              setRole(r);
              setI(0);
            }}
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
        <Progress value={(i / dataset[role].length) * 100} />
        <p className="mt-4 text-lg">{q.question}</p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mt-4 h-36 w-full rounded-xl border border-white/10 bg-black/20 p-3"
          placeholder="Type your response..."
        />
        <div className="mt-3 flex items-center gap-3">
          <Button onClick={submit} disabled={loading || !answer}>{loading ? "Analyzing..." : "Submit Answer"}</Button>
          <span className="text-xs text-white/60">Difficulty: {q.difficulty}</span>
          <span className="ml-auto">⏱️ 02:00</span>
        </div>
      </Card>
      <Link href="/report" className="mt-4 inline-block">
        <Button variant="ghost">Finish & View Final Report</Button>
      </Link>
    </main>
  );
}
