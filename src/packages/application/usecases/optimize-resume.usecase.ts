import { z } from "zod";
import { ResumeGeneratorPort } from "@domain/ports/resume-generator.port";
import { ATSEvaluatorPort } from "@domain/ports/ats-evaluator.port";

export const OptimizeResumeInput = z.object({ rawResume: z.string().min(20), jobDescription: z.string().min(20) });
export type OptimizeResumeInput = z.infer<typeof OptimizeResumeInput>;

export class OptimizeResumeUseCase {
  constructor(private gen: ResumeGeneratorPort, private ats: ATSEvaluatorPort) {}
  async execute(input: OptimizeResumeInput) {
    const v = OptimizeResumeInput.parse(input);
    const { optimizedResume } = await this.gen.generate(v);
    const ats = await this.ats.score({ resume: optimizedResume, jobDescription: v.jobDescription });
    return { optimizedResume, ats };
  }
}
