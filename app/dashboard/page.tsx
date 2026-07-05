"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { loadResults } from "@/lib/results";
import type { UserProfile, RoadmapNode } from "@/lib/agents/types";

const roles = [
  { label: "Frontend Developer", value: "frontend" },
  { label: "Backend Developer", value: "backend" },
  { label: "Python Developer", value: "python" },
  { label: "AI/ML Engineer", value: "aiml" },
  { label: "HR Interview", value: "hr" }
] as const;

function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("gradiora_profile");
  return raw ? JSON.parse(raw) : null;
}

function getRoadmap(): RoadmapNode | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("gradiora_roadmap");
  return raw ? JSON.parse(raw) : null;
}

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[number]["value"]>("frontend");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapNode | null>(null);

  useEffect(() => {
    setProfile(getProfile());
    setRoadmap(getRoadmap());
  }, []);

  const results = useMemo(() => {
    if (typeof window === "undefined") return null;
    return loadResults();
  }, []);

  const avgScore = results && results.answers.length > 0
    ? Math.round(results.answers.reduce((s, a) => s + a.scores.overall, 0) / results.answers.length)
    : null;

  const questionsCompleted = results?.answers.length ?? 0;
  const roadmapProgress = roadmap?.progress ?? 0;
  const targetRole = profile?.targetRole ?? selectedRole;

  const metrics = [
    { label: "Interview Score", value: avgScore !== null ? `${avgScore}%` : "—" },
    { label: "Questions Done", value: `${questionsCompleted}` },
    { label: "Roadmap Progress", value: `${roadmapProgress}%` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-white/70">
        {profile
          ? `Preparing for ${profile.targetRole} · ${profile.experienceLevel} · ${profile.timelineWeeks} week plan`
          : "Complete onboarding to get started."}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {metrics.map((m, i) => (
          <Card key={i}>
            <p className="text-white/60 text-sm">{m.label}</p>
            <p className="text-3xl font-bold">{m.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <p className="mb-3 text-white/70">Overall Progress</p>
        <Progress value={roadmapProgress} />
        <p className="mt-1 text-xs text-white/40">{roadmapProgress}% complete</p>
      </Card>

      <Card className="mt-6">
        <p className="mb-3">Choose Role</p>
        <div className="grid gap-2 md:grid-cols-3">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedRole(r.value)}
              className={`rounded-lg border px-3 py-2 text-left transition ${
                (selectedRole === r.value) ? "border-secondary bg-cyan-400/10" : "border-white/10 hover:bg-white/10"
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
}
