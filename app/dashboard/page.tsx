"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSessionGuard } from "@/components/sections/auth-gate";
import { signOut } from "@/lib/auth";
import { ensureUserProfile, fetchUserReports } from "@/lib/db";

const roles = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "AIML", value: "aiml" },
  { label: "HR", value: "hr" }
] as const;

export default function Dashboard() {
  const { session, checking } = useSessionGuard();
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[number]["value"] | null>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const user = session?.user;
    if (!user) return;
    ensureUserProfile(user.id, user.email ?? null);
    fetchUserReports(user.id).then(({ data }) => setReports(data ?? []));
  }, [session]);

  if (checking || !session) return <main className="mx-auto max-w-6xl px-6 py-10"><div className="glass h-48 rounded-3xl shimmer" /></main>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h1 className="text-3xl font-bold">Role Selection</h1><p className="mt-2 text-white/70">Select one role to unlock your interview session.</p></div>
        <Button variant="ghost" onClick={() => signOut()}>Logout</Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">{[82, 76, 91].map((v, i) => <Card key={i}><p className="text-white/60">Metric {i + 1}</p><p className="text-3xl font-bold">{v}%</p></Card>)}</div>
      <Card className="mt-6"><p className="mb-3 text-white/70">Progress Tracker</p><Progress value={selectedRole ? 45 : 12} /></Card>

      <Card className="mt-6">
        <p className="mb-3">Choose Role</p>
        <div className="grid gap-2 sm:grid-cols-2">{roles.map((r) => <button key={r.value} onClick={() => setSelectedRole(r.value)} className={`rounded-lg border px-3 py-2 text-left transition ${selectedRole === r.value ? "border-secondary bg-cyan-400/10" : "border-white/10 hover:bg-white/10"}`}>{r.label}</button>)}</div>
        <Link href={selectedRole ? `/interview?role=${selectedRole}` : "#"} className="mt-4 inline-block">
          <Button disabled={!selectedRole}>Start Interview Chat</Button>
        </Link>
      </Card>

      <Card className="mt-6"><p className="mb-3 font-semibold">Previous Interview Reports</p><div className="space-y-2 text-sm text-white/75">{reports.length === 0 ? <p>No reports yet. Complete your first interview.</p> : reports.slice(0, 5).map((r) => <p key={r.id}>Score {r.overall_score}% · {new Date(r.generated_at).toLocaleString()}</p>)}</div></Card>
    </main>
  );
}
