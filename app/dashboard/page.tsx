"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const roles = ["Frontend Developer", "Backend Developer", "Python Developer", "AI/ML Engineer", "HR Interview"];

export default function Dashboard() {
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Interview Dashboard</h1><div className="mt-6 grid gap-4 md:grid-cols-3">{[82,76,91].map((v,i)=><Card key={i}><p className="text-white/60">Metric {i+1}</p><p className="text-3xl font-bold">{v}%</p></Card>)}</div>
  <Card className="mt-6"><p className="mb-3 text-white/70">Progress Tracker</p><Progress value={68}/></Card>
  <Card className="mt-6"><p className="mb-3">Choose Role</p><div className="grid gap-2 md:grid-cols-3">{roles.map(r=><button key={r} className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/10">{r}</button>)}</div><Link href="/interview" className="mt-4 inline-block"><Button>Continue Interview</Button></Link></Card>
  </main>;
}
