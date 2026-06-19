import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import POICard from '@/components/pois/POICard'
import { Plus, Target } from 'lucide-react'
import type { POI } from '@/lib/types'

export default async function POIsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('pois')
    .select('*, tags:poi_tags(tag:tags(*))')
    .order('updated_at', { ascending: false })

  const pois = (data ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    tags: ((p.tags as Array<{ tag: unknown }>) ?? []).map((t) => t.tag),
  })) as POI[]

  return (
    <div className="min-h-screen">
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Points of Interest</h1>
          <p className="text-sm text-[#666] mt-1">{pois.length} total</p>
        </div>
        <Link
          href="/pois/new"
          className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-3 py-2 rounded-xl"
        >
          <Plus size={14} /> New POI
        </Link>
      </div>

      <div className="px-4 py-4">
        {pois.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Target size={40} className="text-[#333] mb-4" />
            <div className="text-white font-medium mb-2">No POIs yet</div>
            <div className="text-sm text-[#444] max-w-xs mb-6">
              Create your first Point of Interest to start monitoring price zones.
            </div>
            <Link
              href="/pois/new"
              className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              Create first POI
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {pois.map(poi => <POICard key={poi.id} poi={poi} />)}
          </div>
        )}
      </div>
    </div>
  )
}