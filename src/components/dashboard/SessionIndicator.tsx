'use client'

import { useEffect, useState } from 'react'
import { getCurrentSession, getSessionColor, type TradingSession } from '@/lib/sessions'

export default function SessionIndicator() {
  const [session, setSession] = useState<TradingSession>('Off')

  useEffect(() => {
    setSession(getCurrentSession())
    const interval = setInterval(() => setSession(getCurrentSession()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl px-4 py-3 flex items-center justify-between">
      <span className="text-xs text-[#666] uppercase tracking-wider">Session</span>
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getSessionColor(session) }}
        />
        <span className="text-sm font-semibold text-white">{session}</span>
      </div>
    </div>
  )
}