import { NextResponse } from "next/server";
import { buildContainer } from "@bootstrap/container";
import type { ResumeRepositoryPort } from "@domain/ports/resume-repository.port";
import { getUserFromAuthHeader } from "../../_lib/auth";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const c = buildContainer();
    const repo = c.resolve<ResumeRepositoryPort>("ResumeRepositoryPort");
    const rows = await repo.list({ userId: user.id });
    return NextResponse.json(rows, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
