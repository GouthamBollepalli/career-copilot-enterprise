import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserFromAuthHeader } from "../../_lib/auth";
import { buildContainer } from "@bootstrap/container";
import type { ProfilePort } from "@domain/ports/profile.port";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const c = buildContainer();
    const profile = await c.resolve<ProfilePort>("ProfilePort").get({ userId: user.id });
    if (!profile?.isPro) return NextResponse.json({ error: "Pro subscription required" }, { status: 402 });

    const { resume, jobDescription, question, answer } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set");
    const client = new OpenAI({ apiKey });
    const prompt = `You are an interview coach. Evaluate the candidate's answer using STAR, referencing JD and resume. Give a 0-10 score and 3 improvements.\nJD:${jobDescription}\nResume:${resume}\nQ:${question}\nA:${answer}`;
    const r = await client.chat.completions.create({ model: "gpt-4o", temperature: 0.2, messages: [{ role: "user", content: prompt }] });
    const feedback = r.choices[0]?.message?.content ?? "No feedback";
    return NextResponse.json({ feedback }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
