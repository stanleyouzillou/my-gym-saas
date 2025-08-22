export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type CreateSessionPayload = {
  programId: string;
  startTime: string; // ISO
  durationMinutes: number;
  maxCapacity: number;
  coachName?: string;
};

export async function createSession(payload: CreateSessionPayload) {
  const res = await fetch(`${API_URL}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data?.message === 'string' ? data.message : 'Failed to create session');
  }
  return data as { id: string } & CreateSessionPayload;
}

export type FakeSignupPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tenantName?: string;
};

export async function postFakeSignup(payload: FakeSignupPayload) {
  const res = await fetch(`${API_URL}/api/signup/fake-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data?.message === 'string' ? data.message : 'Signup failed');
  }
  return data as { ok: boolean; memberId: string; token: string; redirect?: string };
}

export type SessionDto = {
  id: string;
  programId: string;
  startTime: string;
  durationMinutes: number;
  maxCapacity: number;
  coachName?: string;
};

export async function getSessions() {
  const res = await fetch(`${API_URL}/api/sessions`, { cache: 'no-store' });
  if (!res.ok) return [] as SessionDto[];
  return (await res.json()) as SessionDto[];
}

export async function postMockPay(memberId: string) {
  const res = await fetch(`${API_URL}/api/signup/mock-pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data?.message === 'string' ? data.message : 'Payment failed');
  return data as { ok: boolean; memberId: string; status: 'ACTIVE' };
}

export async function postStatus(memberId: string) {
  const res = await fetch(`${API_URL}/api/signup/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data?.message === 'string' ? data.message : 'Status check failed');
  return data as { ok: boolean; memberId: string; status: 'ACTIVE' | 'PENDING' };
}
