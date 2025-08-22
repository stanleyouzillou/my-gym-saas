'use client'

import Link from 'next/link'

export default function WelcomePage() {
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome aboard! 🎉</h1>
      <p className="text-gray-700 mb-6">
        Your membership is active. You can now browse and book upcoming training sessions.
      </p>
      <Link
        href="/sessions"
        className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded"
      >
        Go to Sessions
      </Link>
    </main>
  )
}
