'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { postMockPay, postStatus } from '../../../lib/api'

export default function PaymentPage() {
  const params = useSearchParams()
  const router = useRouter()
  const memberId = params.get('memberId') ?? ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'PENDING' | 'ACTIVE'>('PENDING')

  useEffect(() => {
    let mounted = true
    async function check() {
      if (!memberId) return
      try {
        const res = await postStatus(memberId)
        if (!mounted) return
        setStatus(res.status)
      } catch {}
    }
    check()
    const id = setInterval(check, 2000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [memberId])

  // If already ACTIVE, do not allow viewing payment page
  useEffect(() => {
    if (status === 'ACTIVE') {
      router.replace('/welcome')
    }
  }, [status, router])

  async function onPay() {
    setLoading(true)
    setError(null)
    try {
      const res = await postMockPay(memberId)
      if (res.status === 'ACTIVE') {
        router.push('/welcome')
      }
    } catch (e: any) {
      setError(e?.message ?? 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Activate Membership</h1>
      <p className="text-gray-600 mb-6">Plan: Starter — $29/mo</p>
      {memberId && (
        <p className="text-xs text-gray-500 mb-4">Member ID: {memberId}</p>
      )}
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <button
        onClick={onPay}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded"
      >
        {loading ? 'Processing…' : 'Pay & Activate'}
      </button>
      <div className="mt-6 text-sm text-gray-700">
        Current status: <span className={status === 'ACTIVE' ? 'text-emerald-700' : 'text-amber-700'}>{status}</span>
      </div>
    </main>
  )
}
