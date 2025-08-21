export interface ResumeGeneratorPort {
  generate(input: { rawResume: string; jobDescription: string }): Promise<{ optimizedResume: string }>;
}
