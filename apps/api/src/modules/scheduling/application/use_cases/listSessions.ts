import { SessionRepo, Session, ListParams } from '../ports/SessionRepo';

export class ListSessionsUseCase {
  constructor(private readonly repo: SessionRepo) {}

  async execute(params: ListParams = {}): Promise<Session[]> {
    return this.repo.list(params);
  }
}
