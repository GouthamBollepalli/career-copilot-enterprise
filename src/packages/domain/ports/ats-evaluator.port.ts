export interface ATSEvaluatorPort {
  score(input: { resume: string; jobDescription: string }): Promise<{ score: number; missing: string[]; explanations: string[] }>;
}
