'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function OnboardPage() {
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()
  const [tenantName, setTenantName] = useState('DefaultFranchise')
  const [plan, setPlan] = useState<'free' | 'paid'>('paid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      // If not signed in, send to home/sign-in
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      // Some Clerk versions require a looser type to set publicMetadata
      await user.update({
        publicMetadata: {
          tenantName,
          plan, // 'free' | 'paid'
        },
      } as any)
      // Redirect by plan
      if (plan === 'free') {
        router.push('/welcome')
      } else {
        // paid flow uses existing payment page
        router.push('/signup/payment')
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Finish setting up your account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Franchise/Tenant</label>
          <input
            type="text"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plan</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="plan"
                value="paid"
                checked={plan === 'paid'}
                onChange={() => setPlan('paid')}
              />
              <span>Paid (recommended)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="plan"
                value="free"
                checked={plan === 'free'}
                onChange={() => setPlan('free')}
              />
              <span>Free</span>
            </label>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded"
        >
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </main>
  )
}
