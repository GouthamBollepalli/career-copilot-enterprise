export interface ProfilePort {
  get(input: { userId: string }): Promise<{ isPro: boolean; email?: string } | null>;
  setPro(input: { userId: string; isPro: boolean }): Promise<void>;
}
