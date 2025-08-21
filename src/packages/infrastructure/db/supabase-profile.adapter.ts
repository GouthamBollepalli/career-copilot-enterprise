import { ProfilePort } from "@domain/ports/profile.port";
import { supabaseAdmin } from "@config/supabaseAdmin";

export class SupabaseProfileAdapter implements ProfilePort {
  async get({ userId }: { userId: string }) {
    const { data, error } = await supabaseAdmin
      .from("profiles").select("id,is_pro,email").eq("id", userId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return { isPro: !!data.is_pro, email: data.email ?? undefined };
  }
  async setPro({ userId, isPro }: { userId: string; isPro: boolean }) {
    const { error } = await supabaseAdmin
      .from("profiles").upsert({ id: userId, is_pro: isPro }, { onConflict: "id" });
    if (error) throw new Error(error.message);
  }
}
