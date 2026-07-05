import { NextRequest, NextResponse } from "next/server";
import {
  createPipeline,
  getPipeline,
  runFullPipeline,
  runAssessmentOnlyPipeline,
  runEvaluateOnlyPipeline,
} from "@/lib/agents/orchestrator";
import { sanitizeString } from "@/lib/security";

export async function POST(request: NextRequest) {
  const userId = sanitizeString(request.headers.get("x-user-id") ?? "anonymous");

  try {
    const body = await request.json();
    const { action, pipelineId } = body;

    let state = pipelineId ? getPipeline(pipelineId) : undefined;

    switch (action) {
      case "create": {
        state = createPipeline(userId);
        if (body.message) {
          state = await runFullPipeline(state, String(body.message).slice(0, 5000));
        }
        return NextResponse.json({ pipelineId: state.id, state });
      }

      case "assessment": {
        if (!state) state = createPipeline(userId);
        if (!body.message || typeof body.message !== "string") {
          return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }
        state = await runAssessmentOnlyPipeline(state, body.message.slice(0, 5000));
        return NextResponse.json({ pipelineId: state.id, state });
      }

      case "evaluate": {
        if (!state) state = createPipeline(userId);
        if (!body.question || !body.answer) {
          return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
        }
        state = await runEvaluateOnlyPipeline(state, body.question, String(body.answer).slice(0, 10000));
        return NextResponse.json({
          pipelineId: state.id,
          scores: state.context.answers?.at(-1)?.scores,
          state,
        });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pipelineId = sanitizeString(searchParams.get("pipelineId") ?? "");

  if (!pipelineId) {
    return NextResponse.json({ error: "pipelineId is required" }, { status: 400 });
  }

  const state = getPipeline(pipelineId);
  if (!state) {
    return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
  }

  return NextResponse.json({ state });
}
