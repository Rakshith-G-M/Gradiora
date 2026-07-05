"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { fetchPipelineState } from "@/lib/ai";
import type { PipelineState, PipelineStage } from "@/lib/agents/types";

interface Props {
  pipelineId: string;
  onComplete?: (state: PipelineState) => void;
  onError?: (error: string) => void;
  pollInterval?: number;
}

const stageLabels: Record<PipelineStage, string> = {
  assessment: "Profile & Roadmap",
  questions: "Question Generation",
  evaluate: "Answer Evaluation",
  report: "Report Generation",
};

const stageOrder: PipelineStage[] = [
  "assessment",
  "questions",
  "evaluate",
  "report",
];

export default function PipelineStatus({
  pipelineId,
  onComplete,
  onError,
  pollInterval = 2000,
}: Props) {
  const [state, setState] = useState<PipelineState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const poll = useCallback(async () => {
    try {
      const s = await fetchPipelineState(pipelineId);
      setState(s);
      setError(null);

      if (s.status === "completed" && onComplete) {
        onComplete(s);
      }
      if (s.status === "failed" && onError) {
        onError(s.context.error ?? "Pipeline failed");
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [pipelineId, onComplete, onError]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, pollInterval);
    return () => clearInterval(interval);
  }, [poll, pollInterval]);

  if (!state) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
        <p className="mt-3 text-sm text-white/60">Connecting to pipeline...</p>
      </Card>
    );
  }

  const isComplete = state.status === "completed";
  const hasFailed = state.status === "failed";
  const currentIdx = state.currentStage
    ? stageOrder.indexOf(state.currentStage)
    : -1;

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        {isComplete ? (
          <CheckCircle className="h-5 w-5 text-green-400" />
        ) : hasFailed ? (
          <XCircle className="h-5 w-5 text-red-400" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-secondary" />
        )}
        <span className="font-semibold">
          {isComplete
            ? "Pipeline Complete"
            : hasFailed
              ? "Pipeline Failed"
              : "Pipeline Running"}
        </span>
      </div>

      {error && (
        <p className="mb-3 text-sm text-red-300">{error}</p>
      )}

      <div className="space-y-2">
        {stageOrder.map((stage, idx) => {
          const s = state.stages.find((st) => st.stage === stage);
          const isActive = s?.status === "running";
          const isDone = s?.status === "completed";
          const isFailed = s?.status === "failed";
          const isPending = s?.status === "pending";
          const isPast = currentIdx >= idx;

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-secondary/10 text-white"
                  : isDone
                    ? "bg-green-500/5 text-green-300"
                    : isFailed
                      ? "bg-red-500/10 text-red-300"
                      : "text-white/40"
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                {isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isDone ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : isFailed ? (
                  <XCircle className="h-4 w-4 text-red-400" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <span className="flex-1">{stageLabels[stage]}</span>
              {isDone && s?.completedAt && (
                <span className="text-xs text-white/30">
                  {new Date(s.completedAt).toLocaleTimeString()}
                </span>
              )}
              {isFailed && s?.error && (
                <span className="text-xs text-red-400" title={s.error}>
                  Failed
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {!isComplete && !hasFailed && (
        <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
          <ArrowRight className="h-3 w-3" />
          <span>
            Processing stage {stageOrder.indexOf(state.currentStage ?? stageOrder[0]) + 1} of{" "}
            {stageOrder.length}
          </span>
        </div>
      )}
    </Card>
  );
}
