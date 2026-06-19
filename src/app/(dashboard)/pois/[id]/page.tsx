import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/layout/TopBar'
import POIStatusBadge from '@/components/pois/POIStatusBadge'
import StatusChanger from '@/components/pois/StatusChanger'
import DeletePOIButton from '@/components/pois/DeletePOIButton'
import { formatPrice } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import type { POI } from '@/lib/types'

export default async function POIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('pois')
    .select('*, tags:poi_tags(tag:tags(*)), rules:poi_rules(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const poi = {
    ...data,
    tags: ((data.tags as Array<{ tag: unknown }>) ?? []).map((t) => t.tag),
  } as POI

  return (
    <div className="min-h-screen">
      <TopBar title={poi.symbol} subtitle={poi.direction.toUpperCase()} />

      <div className="px-4 py-4 space-y-5">
        <div className="flex items-center justify-between">
          <POIStatusBadge status={poi.status} />
          <Link
            href={`/pois/${poi.id}/edit`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#888] bg-[#161616] px-3 py-2 rounded-lg"
          >
            <Pencil size={13} /> Edit
          </Link>
        </div>

        <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-4">
          <div className="text-xs text-[#666] uppercase tracking-wider mb-1">Zone</div>
          <div className="text-lg font-mono text-white">
            {formatPrice(poi.zone_low, poi.symbol)} – {formatPrice(poi.zone_high, poi.symbol)}
          </div>
        </div>

        {poi.rules && poi.rules.length > 0 && (
          <div>
            <div className="text-xs text-[#666] uppercase tracking-wider mb-2">Conditions</div>
            <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl divide-y divide-[#1a1a1a]">
              {poi.rules.map(r => (
                <div key={r.id} className="px-4 py-3 text-sm text-white">
                  {r.rule_type.replace(/_/g, ' ')} {r.value !== 0 ? r.value : ''} {r.timeframe ?? ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {poi.notes && (
          <div>
            <div className="text-xs text-[#666] uppercase tracking-wider mb-2">Notes</div>
            <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-4 text-sm text-[#ccc]">
              {poi.notes}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs text-[#666] uppercase tracking-wider mb-2">Change status</div>
          <StatusChanger poiId={poi.id} current={poi.status} />
        </div>

        <div className="pt-4">
          <DeletePOIButton poiId={poi.id} />
        </div>
      </div>
    </div>
  )
}