import { ATSEvaluatorPort } from "@domain/ports/ats-evaluator.port";
const tok = (s: string) => s.toLowerCase().match(/[a-z0-9+#.-]+/g) ?? [];
export class SimpleATSEvaluator implements ATSEvaluatorPort {
  async score({ resume, jobDescription }: { resume: string; jobDescription: string }) {
    const r = new Set(tok(resume));
    const jd = Array.from(new Set(tok(jobDescription)));
    const missing = jd.filter(w => !r.has(w)).slice(0, 50);
    const matched = jd.length - missing.length;
    const score = Math.min(100, Math.round((matched / Math.max(jd.length, 1)) * 100));
    const explanations = [
      `Matched ${matched}/${jd.length} unique JD keywords.`,
      `Add ${Math.min(missing.length, 5)} missing terms to improve quickly.`
    ];
    return { score, missing, explanations };
  }
}
