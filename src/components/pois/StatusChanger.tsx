'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { POIStatus } from '@/lib/types'

const statuses: POIStatus[] = ['draft', 'active', 'approaching', 'triggered', 'fulfilled', 'invalidated']

export default function StatusChanger({ poiId, current }: { poiId: string; current: POIStatus }) {
  const router = useRouter()
  const supabase = createClient()
  const [updating, setUpdating] = useState(false)

  async function changeStatus(status: POIStatus) {
    if (status === current) return
    setUpdating(true)
    await supabase.from('pois').update({ status }).eq('id', poiId)
    setUpdating(false)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map(s => (
        <button
          key={s}
          onClick={() => changeStatus(s)}
          disabled={updating}
          className={`text-[11px] font-semibold uppercase px-3 py-1.5 rounded-lg disabled:opacity-40 ${
            s === current ? 'bg-white text-black' : 'bg-[#161616] text-[#666] border border-[#2a2a2a]'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}