'use client'

import { useState } from 'react';
import { postFakeSignup, type FakeSignupPayload } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function FakeSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FakeSignupPayload>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    tenantName: 'DefaultFranchise',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await postFakeSignup(form);
      const redirect = res.redirect ?? '/sessions';
      router.push(redirect);
    } catch (err: any) {
      setError(err?.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fake Checkout</h1>
      <p className="text-gray-600 mb-4">MVP demo — no real payment.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Optional"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tenant</label>
          <input
            type="text"
            value={form.tenantName}
            onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded"
        >
          {loading ? 'Processing…' : 'Confirm Payment'}
        </button>
      </form>
    </main>
  );
}
