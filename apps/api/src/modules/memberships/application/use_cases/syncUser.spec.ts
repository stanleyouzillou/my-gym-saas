import { InMemoryMemberRepository, InMemoryTenantRepository } from '../testing/inMemoryRepos';
import { SyncUserUseCase } from './syncUser';
import { Email } from '../../domain/value_objects/Email';

describe('SyncUserUseCase', () => {
  it('creates tenant if missing and upserts member for role=member', async () => {
    const tenants = new InMemoryTenantRepository();
    const members = new InMemoryMemberRepository();
    const uc = new SyncUserUseCase(tenants, members);

    const res = await uc.execute({
      email: 'new.user@example.com',
      tenantName: 'Franchise A',
      role: 'member',
      firstName: 'New',
      lastName: 'User',
    });

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.tenant.name).toBe('Franchise A');
      expect(res.member).toBeTruthy();
      expect(res.member?.email.value).toBe(Email.create('new.user@example.com').value);
    }
  });

  it('updates existing member details when they change', async () => {
    const tenants = new InMemoryTenantRepository();
    const members = new InMemoryMemberRepository();
    const uc = new SyncUserUseCase(tenants, members);

    // First call creates
    await uc.execute({
      email: 'edit.me@example.com',
      tenantName: 'Franchise B',
      role: 'member',
      firstName: 'Old',
      lastName: 'Name',
    });

    // Second call updates names
    const res2 = await uc.execute({
      email: 'edit.me@example.com',
      tenantName: 'Franchise B',
      role: 'member',
      firstName: 'NewFirst',
      lastName: 'NewLast',
    });

    expect(res2.ok).toBe(true);
    if (res2.ok) {
      expect(res2.member?.firstName).toBe('NewFirst');
      expect(res2.member?.lastName).toBe('NewLast');
    }
  });

  it('returns error when email missing', async () => {
    const tenants = new InMemoryTenantRepository();
    const members = new InMemoryMemberRepository();
    const uc = new SyncUserUseCase(tenants, members);

    const res = await uc.execute({
      // @ts-expect-error testing sad path
      email: '',
      tenantName: 'Franchise A',
      role: 'member',
    });

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.kind).toBe('MissingEmail');
  });
});
