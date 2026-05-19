"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

const radar = [{ metric: "Technical", value: 84 }, { metric: "Confidence", value: 72 }, { metric: "Communication", value: 78 }, { metric: "Completeness", value: 80 }];
const bars = [{ name: "Q1", score: 68 }, { name: "Q2", score: 75 }, { name: "Q3", score: 82 }, { name: "Q4", score: 88 }, { name: "Q5", score: 79 }];

export default function ReportPage() {
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">AI Interview Report</h1><div className="mt-6 grid gap-4 md:grid-cols-4">{[81,84,72,78].map((s,i)=><Card key={i}><p className="text-white/60">{["Overall","Technical","Confidence","Communication"][i]}</p><p className="text-3xl font-bold">{s}%</p></Card>)}</div>
  <div className="mt-6 grid gap-4 md:grid-cols-2"><Card className="h-80"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radar}><PolarGrid /><PolarAngleAxis dataKey="metric"/><Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5}/></RadarChart></ResponsiveContainer></Card>
  <Card className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={bars}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="score" fill="#22d3ee" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></Card></div>
  <Card className="mt-6"><p className="font-semibold">AI Summary</p><p className="mt-2 text-white/75">Strong system design framing and solid communication tone. Improve depth in edge-case handling and include clearer impact metrics in technical answers.</p></Card></main>;
}
