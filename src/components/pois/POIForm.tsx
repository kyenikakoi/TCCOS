'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RuleBuilder, { type RuleDraft } from './RuleBuilder'
import type { POI, POIDirection, POIStatus } from '@/lib/types'

const WATCHLIST = ['EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY', 'XAUUSD', 'NAS100', 'US30']

export default function POIForm({ existing }: { existing?: POI }) {
  const router = useRouter()
  const supabase = createClient()

  const [symbol, setSymbol]       = useState(existing?.symbol ?? WATCHLIST[0])
  const [direction, setDirection] = useState<POIDirection>(existing?.direction ?? 'long')
  const [zoneHigh, setZoneHigh]   = useState(existing?.zone_high?.toString() ?? '')
  const [zoneLow, setZoneLow]     = useState(existing?.zone_low?.toString() ?? '')
  const [status, setStatus]       = useState<POIStatus>(existing?.status ?? 'draft')
  const [notes, setNotes]         = useState(existing?.notes ?? '')
  const [rules, setRules]         = useState<RuleDraft[]>(
    existing?.rules?.map(r => ({
      id: r.id, rule_type: r.rule_type, value: r.value, timeframe: r.timeframe, logic: r.logic,
    })) ?? []
  )
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      symbol,
      direction,
      zone_high: parseFloat(zoneHigh),
      zone_low: parseFloat(zoneLow),
      status,
      notes,
      ...(user ? { user_id: user.id } : {}),
    }

    let poiId = existing?.id

    if (existing) {
      const { error: updateErr } = await supabase.from('pois').update(payload).eq('id', existing.id)
      if (updateErr) { setError(updateErr.message); setSaving(false); return }
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from('pois').insert(payload).select().single()
      if (insertErr) { setError(insertErr.message); setSaving(false); return }
      poiId = inserted.id
    }

    // Replace rules
    if (poiId) {
      await supabase.from('poi_rules').delete().eq('poi_id', poiId)
      if (rules.length > 0) {
        await supabase.from('poi_rules').insert(
          rules.map((r, i) => ({
            poi_id: poiId,
            rule_type: r.rule_type,
            value: r.value,
            timeframe: r.timeframe,
            logic: r.logic,
            order_index: i,
          }))
        )
      }
    }

    setSaving(false)
    router.push(`/pois/${poiId}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-4 py-4">
      <div>
        <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Symbol</label>
        <select
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
        >
          {WATCHLIST.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Direction</label>
        <div className="flex gap-2">
          {(['long', 'short', 'both'] as POIDirection[]).map(d => (
            <button
              key={d} type="button" onClick={() => setDirection(d)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase ${
                direction === d ? 'bg-white text-black' : 'bg-[#161616] text-[#666] border border-[#2a2a2a]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Zone Low</label>
          <input
            type="number" step="0.00001" value={zoneLow} required
            onChange={e => setZoneLow(e.target.value)}
            className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Zone High</label>
          <input
            type="number" step="0.00001" value={zoneHigh} required
            onChange={e => setZoneHigh(e.target.value)}
            className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as POIStatus)}
          className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
        >
          {(['draft', 'active', 'approaching', 'triggered', 'fulfilled', 'invalidated'] as POIStatus[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Conditions</label>
        <RuleBuilder rules={rules} onChange={setRules} />
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Notes</label>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm resize-none"
        />
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</div>
      )}

      <button
        type="submit" disabled={saving}
        className="w-full py-3 bg-white text-black text-sm font-semibold rounded-xl disabled:opacity-40"
      >
        {saving ? 'Saving…' : existing ? 'Save changes' : 'Create POI'}
      </button>
    </form>
  )
}