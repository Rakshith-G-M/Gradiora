"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, Route, Bot, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Bot, title: "Profile Agent", desc: "AI assesses your current skills and goals" },
  { icon: Route, title: "Roadmap Agent", desc: "Personalized learning path to interview-ready" },
  { icon: Brain, title: "Question Agent", desc: "Generates role-specific interview questions" },
  { icon: Sparkles, title: "Evaluator Agent", desc: "Scores answers with detailed NLP feedback" },
  { icon: BarChart3, title: "Report Agent", desc: "Comprehensive performance analytics" },
  { icon: TrendingUp, title: "Agent Orchestrator", desc: "All agents work in a unified pipeline from 0 to ready" },
];

const pipelineSteps = [
  { step: "1", label: "Profile", desc: "Assess skills & goals" },
  { step: "2", label: "Roadmap", desc: "Generate learning path" },
  { step: "3", label: "Questions", desc: "Role-specific practice" },
  { step: "4", label: "Evaluate", desc: "AI scores your answers" },
  { step: "5", label: "Report", desc: "Track your progress" },
];

export default function Landing() {
  return (
    <main className="px-6 pb-16">
      <section className="mx-auto grid max-w-6xl gap-8 pt-20 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-4 text-secondary font-medium tracking-wide uppercase text-sm">Multi-Agent Platform</p>
          <h1 className="text-5xl font-bold leading-tight">
            From <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">0</span> to{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">Interview Ready</span>
          </h1>
          <p className="mt-6 text-white/70 text-lg leading-relaxed">
            Five specialized AI agents orchestrated in a unified pipeline — assess your skills,
            build a personalized roadmap, generate questions, evaluate answers, and generate reports.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/onboarding">
              <Button size="lg" className="animate-glow">Start Your Journey</Button>
            </Link>
            <Link href="/interview">
              <Button size="lg" variant="ghost">Try Interview</Button>
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-6">
            <div className="space-y-3">
              {features.slice(0, 4).map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{f.title}</p>
                      <p className="text-xs text-white/50">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Agent Pipeline</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {pipelineSteps.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <Card className="h-full text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-sm font-bold">
                  {p.step}
                </div>
                <p className="font-semibold text-sm">{p.label}</p>
                <p className="mt-1 text-xs text-white/50">{p.desc}</p>
              </Card>
              {i < pipelineSteps.length - 1 && (
                <div className="absolute -right-2 top-5 hidden text-white/20 md:block">
                  <TrendingUp className="h-5 w-5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-center text-2xl font-bold">Meet the Agents</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} whileHover={{ y: -4 }}>
                <Card>
                  <Icon className="mb-3 text-secondary" />
                  <p className="font-semibold">{f.title}</p>
                  <p className="mt-1 text-sm text-white/60">{f.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
