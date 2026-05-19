"use client";
<<<<<<< HEAD
import Link from "next/link";
=======

import Link from "next/link";
import { useState } from "react";
>>>>>>> origin/codex/build-ai-interview-preparation-saas-app-xyd5m4
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

<<<<<<< HEAD
const roles = ["Frontend Developer", "Backend Developer", "Python Developer", "AI/ML Engineer", "HR Interview"];

export default function Dashboard() {
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Interview Dashboard</h1><div className="mt-6 grid gap-4 md:grid-cols-3">{[82,76,91].map((v,i)=><Card key={i}><p className="text-white/60">Metric {i+1}</p><p className="text-3xl font-bold">{v}%</p></Card>)}</div>
  <Card className="mt-6"><p className="mb-3 text-white/70">Progress Tracker</p><Progress value={68}/></Card>
  <Card className="mt-6"><p className="mb-3">Choose Role</p><div className="grid gap-2 md:grid-cols-3">{roles.map(r=><button key={r} className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/10">{r}</button>)}</div><Link href="/interview" className="mt-4 inline-block"><Button>Continue Interview</Button></Link></Card>
  </main>;
=======
const roles = [
  { label: "Frontend Developer", value: "frontend" },
  { label: "Backend Developer", value: "backend" },
  { label: "Python Developer", value: "python" },
  { label: "AI/ML Engineer", value: "aiml" },
  { label: "HR Interview", value: "hr" }
] as const;

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[number]["value"]>("frontend");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Role Selection</h1>
      <p className="mt-2 text-white/70">Choose your track, then launch into the live AI interview chat.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[82, 76, 91].map((v, i) => (
          <Card key={i}>
            <p className="text-white/60">Metric {i + 1}</p>
            <p className="text-3xl font-bold">{v}%</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <p className="mb-3 text-white/70">Progress Tracker</p>
        <Progress value={68} />
      </Card>

      <Card className="mt-6">
        <p className="mb-3">Choose Role</p>
        <div className="grid gap-2 md:grid-cols-3">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedRole(r.value)}
              className={`rounded-lg border px-3 py-2 text-left transition ${
                selectedRole === r.value ? "border-secondary bg-cyan-400/10" : "border-white/10 hover:bg-white/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <Link href={`/interview?role=${selectedRole}`} className="mt-4 inline-block">
          <Button>Start Interview Chat</Button>
        </Link>
      </Card>
    </main>
  );
>>>>>>> origin/codex/build-ai-interview-preparation-saas-app-xyd5m4
}
