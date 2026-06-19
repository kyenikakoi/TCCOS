import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/layout/TopBar'
import POICard from '@/components/pois/POICard'
import SessionIndicator from '@/components/dashboard/SessionIndicator'
import PushPrompt from '@/components/dashboard/PushPrompt'
import { formatEventTime } from '@/lib/utils'
import { Bell, Zap } from 'lucide-react'
import type { POI, MarketEvent } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: nearPOIs } = await supabase
    .from('pois')
    .select('*, tags:poi_tags(tag:tags(*))')
    .in('status', ['approaching', 'triggered'])
    .order('updated_at', { ascending: false })

  const { data: activePOIs } = await supabase
    .from('pois')
    .select('*, tags:poi_tags(tag:tags(*))')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(5)

  const now = new Date()
  const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000)

  const { data: upcomingEvents } = await supabase
    .from('market_events')
    .select('*')
    .gte('event_date', now.toISOString())
    .lte('event_date', sixHoursLater.toISOString())
    .eq('impact', 'high')
    .order('event_date')
    .limit(5)

  function normalizePOI(p: Record<string, unknown>): POI {
    return {
      ...p,
      tags: ((p.tags as Array<{ tag: unknown }>) ?? []).map((t) => t.tag),
    } as POI
  }

  const near   = (nearPOIs   ?? []).map(normalizePOI)
  const active = (activePOIs ?? []).map(normalizePOI)

  return (
    <div className="min-h-screen">
      <TopBar
        title="Today"
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      />

      <div className="px-4 py-4 space-y-6">
        <PushPrompt />
        <SessionIndicator />

        {near.length > 0 && (
          <section>
            <SectionHeader icon={<Zap size={14} className="text-amber-400" />} title="In Play" />
            <div className="space-y-3">
              {near.map(poi => <POICard key={poi.id} poi={poi} />)}
            </div>
          </section>
        )}

        {(upcomingEvents ?? []).length > 0 && (
          <section>
            <SectionHeader icon={<Bell size={14} className="text-red-400" />} title="High Impact — Next 6h" />
            <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl overflow-hidden">
              {(upcomingEvents as MarketEvent[]).map((ev, i) => (
                <div
                  key={ev.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[#161616]' : ''}`}
                >
                  <span className="text-xs font-mono text-[#666] w-10 shrink-0">
                    {formatEventTime(ev.event_date)}
                  </span>
                  <span className="text-xs font-bold text-red-400 w-8 shrink-0">{ev.currency}</span>
                  <span className="text-xs text-white flex-1 truncate">{ev.title}</span>
                  {ev.forecast && (
                    <span className="text-[10px] text-[#444] shrink-0">F: {ev.forecast}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {active.length > 0 && (
          <section>
            <SectionHeader title="Watching" />
            <div className="space-y-3">
              {active.map(poi => <POICard key={poi.id} poi={poi} />)}
            </div>
          </section>
        )}

        {near.length === 0 && active.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-white font-medium mb-2">No active POIs</div>
            <div className="text-sm text-[#444] max-w-xs">
              Create a POI and set its status to Active to start monitoring.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[#444]">{title}</h2>
    </div>
  )
}