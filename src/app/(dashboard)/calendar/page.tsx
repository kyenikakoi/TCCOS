import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/layout/TopBar'
import { formatEventTime } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'

const impactColor: Record<string, string> = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#666',
}

export default async function CalendarPage() {
  const supabase = await createClient()

  const now = new Date()
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data: events } = await supabase
    .from('market_events')
    .select('*')
    .gte('event_date', now.toISOString())
    .lte('event_date', weekAhead.toISOString())
    .order('event_date')

  return (
    <div className="min-h-screen">
      <TopBar title="Calendar" subtitle="Economic events — next 7 days" />

      <div className="px-4 py-4">
        {(!events || events.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarIcon size={40} className="text-[#333] mb-4" />
            <div className="text-white font-medium mb-2">No events loaded</div>
            <div className="text-sm text-[#444] max-w-xs">
              Economic calendar syncs once the worker is deployed.
            </div>
          </div>
        ) : (
          <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl divide-y divide-[#1a1a1a]">
            {events.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-mono text-[#666] w-12 shrink-0">
                  {formatEventTime(ev.event_date)}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: impactColor[ev.impact] }}
                />
                <span className="text-xs font-bold text-white w-8 shrink-0">{ev.currency}</span>
                <span className="text-xs text-[#ccc] flex-1 truncate">{ev.title}</span>
                {ev.forecast && (
                  <span className="text-[10px] text-[#444] shrink-0">F: {ev.forecast}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}