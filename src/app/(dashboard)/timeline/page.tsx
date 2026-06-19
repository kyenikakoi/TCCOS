import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/layout/TopBar'
import POIStatusBadge from '@/components/pois/POIStatusBadge'
import { Clock } from 'lucide-react'
import type { POIStatus } from '@/lib/types'

export default async function TimelinePage() {
  const supabase = await createClient()

  const { data: pois } = await supabase
    .from('pois')
    .select('id, symbol, direction, status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen">
      <TopBar title="Timeline" subtitle="Chronological POI activity" />

      <div className="px-4 py-4">
        {(!pois || pois.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Clock size={40} className="text-[#333] mb-4" />
            <div className="text-white font-medium mb-2">No activity yet</div>
            <div className="text-sm text-[#444] max-w-xs">
              POI status changes will appear here as they happen.
            </div>
          </div>
        ) : (
          <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl divide-y divide-[#1a1a1a]">
            {pois.map(poi => (
              <div key={poi.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{poi.symbol}</span>
                    <span className="text-[10px] text-[#666] uppercase">{poi.direction}</span>
                  </div>
                  <div className="text-[10px] text-[#555] mt-0.5">
                    {new Date(poi.updated_at).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
                <POIStatusBadge status={poi.status as POIStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}