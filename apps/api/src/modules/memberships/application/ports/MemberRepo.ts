import { Member } from '../../domain/entities/Member';
import { Email } from '../../domain/value_objects/Email';

export interface IMemberRepository {
  save(member: Member): Promise<void>;
  findByEmail(email: Email): Promise<Member | null>;
  findByTenant(tenantId: string): Promise<Member[]>;
}
