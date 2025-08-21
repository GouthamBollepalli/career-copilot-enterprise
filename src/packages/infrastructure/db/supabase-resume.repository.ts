import { ResumeRepositoryPort } from "@domain/ports/resume-repository.port";
import { supabaseAdmin } from "@config/supabaseAdmin";

export class SupabaseResumeRepository implements ResumeRepositoryPort {
  async save(
    { userId, title, content, atsScore }: { userId: string; title: string; content: string; atsScore: number }
  ): Promise<{ id: string }> {
    const { data, error } = await supabaseAdmin
      .from("resumes")
      .insert({ user_id: userId, title, content, ats_score: atsScore })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id as string };
  }

  async list(
    { userId }: { userId: string }
  ): Promise<Array<{ id: string; title: string; atsScore: number; createdAt: string }>> {
    const { data, error } = await supabaseAdmin
      .from("resumes")
      .select("id,title,ats_score,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      atsScore: (r.ats_score as number) ?? 0,
      createdAt: r.created_at as string,
    }));
  }
}
