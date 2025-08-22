'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export function SyncUser() {
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function run() {
      if (!isSignedIn || !user || done) return

      const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress
      const firstName = user.firstName || undefined
      const lastName = user.lastName || undefined
      const tenantName = (user.publicMetadata?.tenantName as string) || 'DefaultFranchise'
      const plan = (user.publicMetadata?.plan as 'free' | 'paid' | undefined) ?? 'paid'
      const status = plan === 'free' ? 'ACTIVE' : 'PENDING'
      const clerkUserId = user.id
      const phone = user.primaryPhoneNumber?.phoneNumber || undefined

      let memberId: string | undefined
      let apiStatus: 'ACTIVE' | 'PENDING' | undefined
      try {
        const res = await fetch(`${API_URL}/api/memberships/sync-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, firstName, lastName, tenantName, role: 'member', clerkUserId, phone, status }),
        })
        const data = await res.json().catch(() => ({} as any))
        if (res.ok && data?.ok && data?.member?.id) {
          memberId = data.member.id as string
          apiStatus = data.member.status as 'ACTIVE' | 'PENDING' | undefined
        }
      } catch (e) {
        // swallow in UI; server logs handle failures
      } finally {
        setDone(true)
        // Simple client-side routing: paid → payment; free → welcome/sessions
        const effectiveStatus = apiStatus ?? status
        if (plan === 'paid' && effectiveStatus !== 'ACTIVE') {
          const q = memberId ? `?memberId=${encodeURIComponent(memberId)}` : ''
          router.replace(`/signup/payment${q}`)
        } else {
          // prefer welcome; fallback sessions
          router.replace('/welcome')
        }
      }
    }
    run()
  }, [isSignedIn, user, done, router])

  return null
}
