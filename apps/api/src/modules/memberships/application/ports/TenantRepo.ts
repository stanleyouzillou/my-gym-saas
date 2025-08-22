import { Tenant } from '../../domain/entities/Tenant';

export interface ITenantRepository {
  findByName(name: string): Promise<Tenant | null>;
  create(name: string): Promise<Tenant>;
}
