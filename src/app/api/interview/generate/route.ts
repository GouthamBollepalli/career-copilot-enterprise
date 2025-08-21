import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserFromAuthHeader } from "../../_lib/auth";
import { checkRateLimit } from "../../_lib/limit";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { allowed } = await checkRateLimit(user.id);
    if (!allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const { resume, jobDescription } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set");
    const client = new OpenAI({ apiKey });
    const prompt = `Create 10 role-specific interview questions using the job description and resume. Be specific.\nJD:\n${jobDescription}\n\nResume:\n${resume}`;
    const r = await client.chat.completions.create({ model: "gpt-4o", temperature: 0.2, messages: [{ role: "user", content: prompt }] });
    const text = r.choices[0]?.message?.content ?? "";
    const questions = text.split(/\n+/).map(s => s.replace(/^\d+\.|^-\s*/, "").trim()).filter(Boolean).slice(0, 10);
    return NextResponse.json({ questions }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
