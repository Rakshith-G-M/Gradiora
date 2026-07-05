"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Loader2, Map } from "lucide-react";
import RoadmapTree from "@/components/sections/roadmap-tree";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orchestrateAssessment, fetchPipelineState } from "@/lib/ai";
import type { RoadmapNode, UserProfile, PipelineState } from "@/lib/agents/types";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapNode | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);

    const savedRoadmap = localStorage.getItem("gradiora_roadmap");
    const savedProfile = localStorage.getItem("gradiora_profile");

    if (savedRoadmap) {
      try {
        setRoadmap(JSON.parse(savedRoadmap));
      } catch {}
    }
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {}
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const regenerate = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const profileText = `Current role: ${profile.currentRole ?? "Not specified"}. Target: ${profile.targetRole}. Experience: ${profile.experienceLevel} (${profile.yearsOfExperience} years). Strengths: ${(profile.strengths ?? []).join(", ")}. Weaknesses: ${(profile.weaknesses ?? []).join(", ")}. Timeline: ${profile.timelineWeeks ?? 4} weeks.`;
      const pipelineId = localStorage.getItem("gradiora_pipeline_id") ?? undefined;
      const result = await orchestrateAssessment(profileText, pipelineId);
      const state = result.state as PipelineState;
      if (state.context.roadmap) {
        setRoadmap(state.context.roadmap);
        localStorage.setItem("gradiora_roadmap", JSON.stringify(state.context.roadmap));
        localStorage.setItem("gradiora_pipeline_id", state.id);
      } else {
        throw new Error("Failed to generate roadmap");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-6">
        <Card className="p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-3 text-white/60">Loading roadmap...</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-white/40 hover:text-white/70">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Map className="h-6 w-6 text-secondary" />
              <h1 className="text-2xl font-bold">Your Roadmap</h1>
            </div>
            {profile && (
              <p className="mt-1 text-sm text-white/50">
                {profile.targetRole} &middot; {profile.experienceLevel} &middot; {profile.timelineWeeks} weeks
              </p>
            )}
          </div>
          {profile && (
            <Button variant="ghost" onClick={regenerate} disabled={loading}>
              <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          )}
        </div>

        {error && (
          <Card className="mb-4 border-red-500/30 p-4">
            <p className="text-sm text-red-300">{error}</p>
          </Card>
        )}

        {roadmap ? (
          <RoadmapTree roadmap={roadmap} />
        ) : (
          <Card className="p-8 text-center">
            <Map className="mx-auto mb-3 h-10 w-10 text-white/20" />
            <h2 className="text-lg font-semibold">No Roadmap Yet</h2>
            <p className="mt-1 text-sm text-white/60">Complete the onboarding to generate your personalized roadmap.</p>
            <Link href="/onboarding" className="mt-4 inline-block">
              <Button>Start Onboarding</Button>
            </Link>
          </Card>
        )}
      </motion.div>
    </main>
  );
}
