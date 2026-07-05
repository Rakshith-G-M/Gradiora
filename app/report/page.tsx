"use client";
import { useMemo } from "react";
import Link from "next/link";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadResults } from "@/lib/results";

export default function ReportPage() {
  const results = loadResults();

  const summary = useMemo(() => {
    if (!results || results.answers.length === 0) return null;
    const n = results.answers.length;
    const agg = results.answers.reduce(
      (acc, a) => ({
        overall: acc.overall + a.scores.overall,
        technical: acc.technical + a.scores.technicalAccuracy,
        confidence: acc.confidence + a.scores.confidence,
        communication: acc.communication + a.scores.communication,
      }),
      { overall: 0, technical: 0, confidence: 0, communication: 0 }
    );
    return {
      overall: Math.round(agg.overall / n),
      technical: Math.round(agg.technical / n),
      confidence: Math.round(agg.confidence / n),
      communication: Math.round(agg.communication / n),
    };
  }, [results]);

  const radar = useMemo(() => {
    if (!summary) return [];
    return [
      { metric: "Technical", value: summary.technical },
      { metric: "Confidence", value: summary.confidence },
      { metric: "Communication", value: summary.communication },
      { metric: "Completeness", value: results ? Math.round(results.answers.reduce((s, a) => s + a.scores.completeness, 0) / results.answers.length) : 0 },
    ];
  }, [summary, results]);

  const bars = useMemo(() => {
    if (!results) return [];
    return results.answers.map((a, idx) => ({
      name: `Q${idx + 1}`,
      score: a.scores.overall,
    }));
  }, [results]);

  if (!results || results.answers.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold">No Interview Data</h1>
          <p className="mt-2 text-white/70">Complete an interview first to see your report.</p>
          <Link href="/interview" className="mt-4 inline-block">
            <Button>Start Interview</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">AI Interview Report</h1>
      <p className="mt-1 text-white/60 capitalize">{results.role} &middot; {results.answers.length} questions answered</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          { label: "Overall", value: summary!.overall },
          { label: "Technical", value: summary!.technical },
          { label: "Confidence", value: summary!.confidence },
          { label: "Communication", value: summary!.communication },
        ].map((s, i) => (
          <Card key={i}>
            <p className="text-white/60">{s.label}</p>
            <p className="text-3xl font-bold">{s.value}%</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bars}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="mt-6">
        <p className="font-semibold">AI Summary</p>
        <p className="mt-2 text-white/75">
          {summary!.technical >= 80
            ? "Strong technical depth across your answers. "
            : "Room for improvement in technical depth. "}
          {summary!.confidence >= 70
            ? "Good confidence signals detected. "
            : "Try using more assertive language (will, can, implemented). "}
          {summary!.communication >= 70
            ? "Communication is clear and well-structured."
            : "Consider structuring answers with clearer punctuation and framing."}
        </p>
      </Card>
    </main>
  );
}
