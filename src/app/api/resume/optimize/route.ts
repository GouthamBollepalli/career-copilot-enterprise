import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { buildContainer } from "@bootstrap/container";
import type { ResumeGeneratorPort } from "@domain/ports/resume-generator.port";
import type { ATSEvaluatorPort } from "@domain/ports/ats-evaluator.port";
import { OptimizeResumeUseCase, OptimizeResumeInput } from "@application/usecases/optimize-resume.usecase";
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
    const input = OptimizeResumeInput.parse(body);
    const c = buildContainer();
    const usecase = new OptimizeResumeUseCase(
      c.resolve<ResumeGeneratorPort>("ResumeGeneratorPort"),
      c.resolve<ATSEvaluatorPort>("ATSEvaluatorPort")
    );
    const result = await usecase.execute(input);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof ZodError) return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
