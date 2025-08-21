import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { buildContainer } from "@bootstrap/container";
import type { ATSEvaluatorPort } from "@domain/ports/ats-evaluator.port";
import { ScoreAtsUseCase, ScoreAtsInput } from "@application/usecases/score-ats.usecase";
import { getUserFromAuthHeader } from "../../_lib/auth";
import { checkRateLimit } from "../../_lib/limit";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { allowed } = await checkRateLimit(user.id);
    if (!allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const body = await req.json();
    const c = buildContainer();
    const uc = new ScoreAtsUseCase(c.resolve<ATSEvaluatorPort>("ATSEvaluatorPort"));
    const result = await uc.execute(ScoreAtsInput.parse(body));
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof ZodError) return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
