"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { useSessionGuard } from "@/components/sections/auth-gate";
import { saveInterviewReport } from "@/lib/db";

export default function ReportPage() {
  const params = useSearchParams();
  const { session, checking } = useSessionGuard();
  const overall = Number(params.get("avg") ?? 72);
  const role = params.get("role") || "frontend";
  const sessionId = params.get("sessionId");

  const metrics = useMemo(() => {
    const technical = Math.max(40, Math.min(98, overall + (role === "aiml" ? 1 : 3)));
    const confidence = Math.max(35, Math.min(96, overall - 4));
    const communication = Math.max(45, Math.min(97, overall - 1));
    const problemSolving = Math.max(42, Math.min(95, overall + 2));
    return { technical, confidence, communication, problemSolving };
  }, [overall, role]);

  const radar = [
    { metric: "Technical", value: metrics.technical },
    { metric: "Confidence", value: metrics.confidence },
    { metric: "Communication", value: metrics.communication },
    { metric: "Problem Solving", value: metrics.problemSolving }
  ];
  const bars = radar.map((r) => ({ name: r.metric.slice(0, 4), score: r.value }));

  useEffect(() => {
    if (!session?.user || !sessionId) return;
    saveInterviewReport({
      sessionId,
      userId: session.user.id,
      overallScore: overall,
      technicalScore: metrics.technical,
      confidenceScore: metrics.confidence,
      communicationScore: metrics.communication,
      analytics: { role, bars, radar, problemSolving: metrics.problemSolving }
    });
  }, [metrics.communication, metrics.confidence, metrics.problemSolving, metrics.technical, overall, role, session?.user, sessionId]);

  const strengths = [
    metrics.technical > 70 ? "Solid technical concept alignment" : "Good baseline technical understanding",
    metrics.communication > 70 ? "Clear structured communication" : "Improving communication clarity"
  ];
  const weaknesses = [
    metrics.confidence < 65 ? "Confidence and decisiveness under pressure" : "Minor confidence dips in follow-up questions",
    metrics.problemSolving < 70 ? "Needs deeper trade-off articulation" : "Can improve edge-case depth"
  ];

  if (checking || !session) return <main className="mx-auto max-w-6xl px-6 py-10"><div className="glass h-56 rounded-3xl shimmer" /></main>;

  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">AI Interview Report</h1><p className="mt-1 text-white/60">Role: <span className="capitalize">{role}</span></p><div className="mt-6 grid gap-4 md:grid-cols-4">{[overall, metrics.technical, metrics.confidence, metrics.communication].map((s,i)=><Card key={i}><p className="text-white/60">{["Overall","Technical","Confidence","Communication"][i]}</p><p className="text-3xl font-bold">{Math.round(s)}%</p></Card>)}</div>
  <div className="mt-6 grid gap-4 md:grid-cols-2"><Card className="h-80"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radar}><PolarGrid /><PolarAngleAxis dataKey="metric"/><Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5}/></RadarChart></ResponsiveContainer></Card>
  <Card className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={bars}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="score" fill="#22d3ee" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></Card></div>
  <div className="mt-6 grid gap-4 md:grid-cols-3"><Card><p className="font-semibold">AI Summary</p><p className="mt-2 text-white/75">You demonstrated {role.toUpperCase()} fundamentals with an overall score of {Math.round(overall)}%. Focus on concise reasoning, explicit trade-offs, and stronger confidence phrases to level up rapidly.</p></Card><Card><p className="font-semibold">Strengths</p><ul className="mt-2 list-disc space-y-1 pl-5 text-white/75">{strengths.map((s)=><li key={s}>{s}</li>)}</ul></Card><Card><p className="font-semibold">Improvements</p><ul className="mt-2 list-disc space-y-1 pl-5 text-white/75">{weaknesses.map((s)=><li key={s}>{s}</li>)}</ul></Card></div></main>;
}
