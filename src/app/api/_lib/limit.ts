import { getRatelimit } from "@config/ratelimit";
export async function checkRateLimit(identifier: string) {
  const rl = getRatelimit();
  if (!rl) return { allowed: true };
  const { success } = await rl.limit(identifier);
  return { allowed: success };
}
