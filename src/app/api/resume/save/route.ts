import { NextResponse } from "next/server";
import { buildContainer } from "@bootstrap/container";
import type { ResumeRepositoryPort } from "@domain/ports/resume-repository.port";
import { getUserFromAuthHeader } from "../../_lib/auth";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { title, content, atsScore } = await req.json();
    const c = buildContainer();
    const repo = c.resolve<ResumeRepositoryPort>("ResumeRepositoryPort");
    const out = await repo.save({ userId: user.id, title, content, atsScore });
    return NextResponse.json(out, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
