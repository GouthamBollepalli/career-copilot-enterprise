import OpenAI from "openai";
import { OpenAIResumeGenerator } from "@infrastructure/ai/openai-resume-generator.adapter";
import { SimpleATSEvaluator } from "@infrastructure/ats/simple-ats.adapter";
import type { ResumeGeneratorPort } from "@domain/ports/resume-generator.port";
import type { ATSEvaluatorPort } from "@domain/ports/ats-evaluator.port";
import { SupabaseResumeRepository } from "@infrastructure/db/supabase-resume.repository";
import { SupabaseProfileAdapter } from "@infrastructure/db/supabase-profile.adapter";
import type { ResumeRepositoryPort } from "@domain/ports/resume-repository.port";
import type { ProfilePort } from "@domain/ports/profile.port";

type Token = "ResumeGeneratorPort" | "ATSEvaluatorPort" | "ResumeRepositoryPort" | "ProfilePort";

export function buildContainer() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const openai = new OpenAI({ apiKey });
  const services = {
    ResumeGeneratorPort: new OpenAIResumeGenerator(openai) as ResumeGeneratorPort,
    ATSEvaluatorPort: new SimpleATSEvaluator() as ATSEvaluatorPort,
    ResumeRepositoryPort: new SupabaseResumeRepository() as ResumeRepositoryPort,
    ProfilePort: new SupabaseProfileAdapter() as ProfilePort
  };
  return { resolve<T>(token: Token) { return services[token] as unknown as T; } };
}
