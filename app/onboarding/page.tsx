"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";
import OnboardingFlow from "@/components/sections/onboarding-flow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orchestrateAssessment } from "@/lib/ai";
import RoadmapTree from "@/components/sections/roadmap-tree";
import type { UserProfile, RoadmapNode } from "@/lib/agents/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapNode | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("gradiora_profile");
    if (saved) {
      try {
        const p = JSON.parse(saved) as UserProfile;
        if (p.completed) {
          setProfile(p);
          const savedRoadmap = localStorage.getItem("gradiora_roadmap");
          if (savedRoadmap) setRoadmap(JSON.parse(savedRoadmap));
        }
      } catch {}
    }
  }, []);

  const handleComplete = async (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem("gradiora_profile", JSON.stringify(p));
    setGenerating(true);
    setError(null);

    try {
      // Check if roadmap was already stored by onboarding flow
      const savedRoadmap = localStorage.getItem("gradiora_roadmap");
      if (savedRoadmap) {
        setRoadmap(JSON.parse(savedRoadmap));
      } else {
        const profileText = `Current role: ${p.currentRole}. Target: ${p.targetRole}. Experience: ${p.experienceLevel} (${p.yearsOfExperience}y). Strengths: ${p.strengths.join(", ")}. Weaknesses: ${p.weaknesses.join(", ")}. Timeline: ${p.timelineWeeks} weeks.`;
        const pipelineId = localStorage.getItem("gradiora_pipeline_id") ?? undefined;
        const result = await orchestrateAssessment(profileText, pipelineId);
        const state = result.state;
        if (state?.context?.roadmap) {
          setRoadmap(state.context.roadmap);
          localStorage.setItem("gradiora_roadmap", JSON.stringify(state.context.roadmap));
          localStorage.setItem("gradiora_pipeline_id", state.id);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (profile && roadmap) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold">Your Profile is Ready</h1>
              <p className="text-sm text-white/60">Your personalized interview roadmap has been generated.</p>
            </div>
          </div>

          <RoadmapTree roadmap={roadmap} />

          <div className="mt-6 flex gap-3">
            <Button onClick={() => router.push("/roadmap")}>View Full Roadmap</Button>
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  if (generating) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-secondary" />
          <h2 className="mt-4 text-lg font-semibold">Generating Your Roadmap</h2>
          <p className="mt-2 text-sm text-white/60">Analyzing your profile and building a personalized learning path...</p>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <OnboardingFlow onComplete={handleComplete} onSkip={() => router.push("/dashboard")} />
      </motion.div>
    </main>
  );
}
