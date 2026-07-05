"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { RoadmapNode } from "@/lib/agents/types";

function TreeNode({ node, depth = 0 }: { node: RoadmapNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/5 ${
          depth === 0 ? "border-l-2 border-primary" : depth === 1 ? "border-l-2 border-secondary/50" : ""
        }`}
        style={{ marginLeft: depth * 20 }}
        onClick={() => setOpen(!open)}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-white/40" />
          )
        ) : (
          <BookOpen className="h-4 w-4 shrink-0 text-white/30" />
        )}

        <div className="flex-1">
          <p className={`text-sm font-medium ${depth === 0 ? "text-white" : depth === 1 ? "text-white/90" : "text-white/70"}`}>
            {node.label}
          </p>
          {node.description && depth < 2 && (
            <p className="mt-0.5 text-xs text-white/40">{node.description}</p>
          )}
        </div>

        {node.progress > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all"
                style={{ width: `${node.progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40">{node.progress}%</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapTree({ roadmap }: { roadmap: RoadmapNode }) {
  if (!roadmap) {
    return (
      <Card className="p-8 text-center">
        <p className="text-white/60">Complete the onboarding to generate your personalized roadmap.</p>
      </Card>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
        <BookOpen className="h-5 w-5 text-secondary" />
        <h3 className="font-semibold">{roadmap.label}</h3>
        {roadmap.progress > 0 && (
          <span className="ml-auto text-sm text-white/40">{roadmap.progress}% complete</span>
        )}
      </div>
      <TreeNode node={roadmap} />
    </div>
  );
}
