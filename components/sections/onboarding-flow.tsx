"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, Loader2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orchestrateCreatePipeline, fetchPipelineState } from "@/lib/ai";
import type { UserProfile, PipelineState } from "@/lib/agents/types";

interface Props {
  onComplete: (profile: UserProfile) => void;
  onSkip?: () => void;
}

const INITIAL_QUESTIONS = [
  "What's your current role and how many years of experience do you have?",
  "What role are you targeting for interviews? (e.g., frontend, backend, AI/ML, fullstack)",
  "What are your biggest strengths technically?",
  "What areas do you feel weakest in or want to improve?",
  "What's your goal — how many weeks until you want to be interview-ready?",
];

export default function OnboardingFlow({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<unknown[]>([]);
  const [collected, setCollected] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = INITIAL_QUESTIONS[step];

  const handleNext = async () => {
    if (!input.trim()) return;

    const answer = input.trim();
    setCollected((prev) => ({ ...prev, [`q${step}`]: answer }));
    setMessages((prev) => [
      ...prev,
      { role: "user", content: answer },
    ]);
    setInput("");
    setLoading(true);

    if (step < INITIAL_QUESTIONS.length - 1) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Thanks! Let me ask the next question." },
      ]);
      setLoading(false);
      setStep((s) => s + 1);
    } else {
      try {
        const profileSummary = `I've answered all questions. My profile: current role: ${collected.q0 ?? ""} years experience: ${collected.q0 ?? ""}. Target: ${collected.q1 ?? ""}. Strengths: ${collected.q2 ?? ""}. Weaknesses: ${collected.q3 ?? ""}. Timeline: ${collected.q4 ?? ""}. Generate my complete profile JSON.`;

        const result = await orchestrateCreatePipeline(profileSummary);
        const state = result.state as PipelineState;

        if (state.status === "completed" && state.context.profile) {
          localStorage.setItem("gradiora_pipeline_id", state.id);
          localStorage.setItem("gradiora_roadmap", JSON.stringify(state.context.roadmap));
          onComplete(state.context.profile);
        } else if (state.context.profile) {
          localStorage.setItem("gradiora_pipeline_id", state.id);
          onComplete(state.context.profile);
        } else {
          const extracted: UserProfile = {
            currentRole: collected.q0?.split(",")[0] ?? "",
            targetRole: (collected.q1 ?? "").toLowerCase().includes("front") ? "frontend"
              : (collected.q1 ?? "").toLowerCase().includes("back") ? "backend"
              : (collected.q1 ?? "").toLowerCase().includes("ai") || (collected.q1 ?? "").toLowerCase().includes("ml") ? "aiml"
              : (collected.q1 ?? "").toLowerCase().includes("full") ? "fullstack"
              : "frontend",
            experienceLevel: (collected.q0 ?? "").toLowerCase().includes("senior") || parseInt(collected.q0 ?? "0") > 5 ? "advanced"
              : parseInt(collected.q0 ?? "0") > 2 ? "intermediate"
              : "beginner",
            yearsOfExperience: parseInt(collected.q0 ?? "0") || 0,
            strengths: (collected.q2 ?? "").split(",").map((s) => s.trim()).filter(Boolean),
            weaknesses: (collected.q3 ?? "").split(",").map((s) => s.trim()).filter(Boolean),
            goals: [(collected.q4 ?? "").toLowerCase().includes("wee") ? collected.q4 : `Interview ready in ${collected.q4 ?? 4} weeks`],
            timelineWeeks: parseInt(collected.q4 ?? "4") || 4,
            topicsCompleted: [],
            completed: true,
          };
          onComplete(extracted);
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${err.message}. Let me ask the next question.` },
        ]);
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Bot className="h-8 w-8 text-secondary" />
        <div>
          <h2 className="text-xl font-bold">Let&apos;s Build Your Profile</h2>
          <p className="text-sm text-white/60">Answer a few questions to get your personalized roadmap.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-1">
        {INITIAL_QUESTIONS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition ${
              idx <= step ? "bg-gradient-to-r from-secondary to-primary" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-6">
            <p className="mb-4 text-lg font-medium">{currentQuestion}</p>

            {messages.length > 0 && (
              <div className="mb-4 space-y-2 rounded-xl bg-white/5 p-3">
                {messages.map((m, i) => (
                  <p key={i} className={`text-sm ${m.role === "user" ? "text-cyan-300" : "text-white/70"}`}>
                    {m.role === "assistant" && <Sparkles className="mr-1 inline h-3 w-3 text-secondary" />}
                    {m.content}
                  </p>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
                placeholder="Type your answer..."
                disabled={loading}
              />
              <Button onClick={handleNext} disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {onSkip && (
        <button onClick={onSkip} className="mt-4 w-full text-center text-sm text-white/50 hover:text-white/70">
          Skip onboarding — I&apos;ll set up later
        </button>
      )}
    </div>
  );
}
