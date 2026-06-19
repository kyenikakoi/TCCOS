'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, Clock } from 'lucide-react'
import type { Notification } from '@/lib/types'

export default function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter()
  const supabase = createClient()

  async function markRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    router.refresh()
  }

  async function snooze(id: string) {
    const until = new Date(Date.now() + 60 * 60 * 1000).toISOString() // +1h
    await supabase.from('notifications').update({ snoozed_until: until }).eq('id', id)
    router.refresh()
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Bell size={40} className="text-[#333] mb-4" />
        <div className="text-white font-medium mb-2">No alerts</div>
        <div className="text-sm text-[#444] max-w-xs">
          You&apos;ll see POI trigger notifications here.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`bg-[#101010] border rounded-2xl p-4 ${
            n.read ? 'border-[#1a1a1a] opacity-50' : 'border-[#2a2a2a]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">{n.title}</div>
              <div className="text-xs text-[#888] mt-1">{n.body}</div>
              <div className="text-[10px] text-[#555] mt-2">
                {new Date(n.created_at).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {!n.read && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => markRead(n.id)}
                className="text-[11px] font-semibold text-white bg-[#1e1e1e] px-3 py-1.5 rounded-lg"
              >
                Mark read
              </button>
              <button
                onClick={() => snooze(n.id)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#888] bg-[#161616] px-3 py-1.5 rounded-lg"
              >
                <Clock size={11} /> Snooze 1h
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}