'use client'

import { useState } from 'react'
import { Bell, X } from 'lucide-react'

export default function PushPrompt() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  async function handleEnable() {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      setDismissed(true)
      // VAPID subscription wiring happens later — see handoff "WHAT IS NOT YET BUILT"
    }
  }

  return (
    <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-4 flex items-center gap-3">
      <Bell size={18} className="text-amber-400 shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-medium text-white">Enable alerts</div>
        <div className="text-xs text-[#666]">Get push notifications when POIs are triggered</div>
      </div>
      <button
        onClick={handleEnable}
        className="text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-lg shrink-0"
      >
        Enable
      </button>
      <button onClick={() => setDismissed(true)} className="text-[#444] shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}