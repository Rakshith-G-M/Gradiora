"use client";

function getUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  let id = localStorage.getItem("gradiora_user_id");
  if (!id) {
    id = `user_${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem("gradiora_user_id", id);
  }
  return id;
}

// ── Orchestration API ────────────────────────────────────────

const ORCHESTRATE_BASE = "/api/orchestrate";

async function orchestrateFetch(body: unknown) {
  const res = await fetch(ORCHESTRATE_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": getUserId(),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Request failed");
  }

  return data;
}

export async function orchestrateCreatePipeline(message?: string) {
  return orchestrateFetch({ action: "create", message });
}

export async function orchestrateAssessment(message: string, pipelineId?: string) {
  return orchestrateFetch({ action: "assessment", message, pipelineId });
}

export async function orchestrateEvaluate(question: unknown, answer: string, pipelineId?: string) {
  return orchestrateFetch({ action: "evaluate", question, answer, pipelineId });
}

export async function fetchPipelineState(pipelineId: string) {
  const res = await fetch(`${ORCHESTRATE_BASE}?pipelineId=${pipelineId}`, {
    headers: { "x-user-id": getUserId() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch pipeline state");
  return data.state;
}
