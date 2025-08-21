export interface ResumeRepositoryPort {
  save(input: { userId: string; title: string; content: string; atsScore: number }): Promise<{ id: string }>;
  list(input: { userId: string }): Promise<Array<{ id: string; title: string; atsScore: number; createdAt: string }>>;
}
