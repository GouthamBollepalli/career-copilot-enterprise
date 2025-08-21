import OpenAI from "openai";
import { ResumeGeneratorPort } from "@domain/ports/resume-generator.port";
const SYSTEM = `You are a resume optimizer. Use ATS-friendly formatting, STAR storytelling, and quantify impact.`;
export class OpenAIResumeGenerator implements ResumeGeneratorPort {
  constructor(private client: OpenAI) {}
  async generate({ rawResume, jobDescription }: { rawResume: string; jobDescription: string }) {
    const resp = await this.client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Job Description:\n${jobDescription}\n\nResume:\n${rawResume}` }
      ]
    });
    return { optimizedResume: resp.choices[0]?.message?.content ?? "" };
  }
}
