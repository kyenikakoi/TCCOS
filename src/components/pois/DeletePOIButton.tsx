'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeletePOIButton({ poiId }: { poiId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting]     = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await supabase.from('pois').delete().eq('id', poiId)
    router.push('/pois')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 text-xs font-semibold text-white bg-red-500/90 px-3 py-2 rounded-lg disabled:opacity-40"
        >
          {deleting ? 'Deleting…' : 'Confirm delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-semibold text-[#888] bg-[#161616] px-3 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-400/10 px-3 py-2 rounded-lg"
    >
      <Trash2 size={13} /> Delete POI
    </button>
  )
}