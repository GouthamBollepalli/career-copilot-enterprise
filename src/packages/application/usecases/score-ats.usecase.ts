import { z } from "zod";
import { ATSEvaluatorPort } from "@domain/ports/ats-evaluator.port";

export const ScoreAtsInput = z.object({ resume: z.string().min(1), jobDescription: z.string().min(1) });
export type ScoreAtsInput = z.infer<typeof ScoreAtsInput>;

export class ScoreAtsUseCase {
  constructor(private ats: ATSEvaluatorPort) {}
  async execute(input: ScoreAtsInput) { return this.ats.score(ScoreAtsInput.parse(input)); }
}
