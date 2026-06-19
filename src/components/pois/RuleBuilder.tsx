'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { RuleType, RuleLogic } from '@/lib/types'

export interface RuleDraft {
  id: string
  rule_type: RuleType
  value: number
  timeframe?: string
  logic: RuleLogic
}

const ruleTypeLabels: Record<RuleType, string> = {
  price_above:        'Price above',
  price_below:        'Price below',
  price_touch:        'Price touches',
  candle_close_above: 'Candle closes above',
  candle_close_below: 'Candle closes below',
  time_reached:       'Time reached',
}

const needsTimeframe = (type: RuleType) =>
  type === 'candle_close_above' || type === 'candle_close_below'

export default function RuleBuilder({
  rules,
  onChange,
}: {
  rules: RuleDraft[]
  onChange: (rules: RuleDraft[]) => void
}) {
  function addRule() {
    onChange([
      ...rules,
      { id: crypto.randomUUID(), rule_type: 'price_above', value: 0, logic: 'AND' },
    ])
  }

  function updateRule(id: string, patch: Partial<RuleDraft>) {
    onChange(rules.map(r => (r.id === id ? { ...r, ...patch } : r)))
  }

  function removeRule(id: string) {
    onChange(rules.filter(r => r.id !== id))
  }

  return (
    <div className="space-y-3">
      {rules.map((rule, i) => (
        <div key={rule.id} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3">
          {i > 0 && (
            <div className="flex gap-2 mb-2">
              {(['AND', 'OR'] as RuleLogic[]).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => updateRule(rule.id, { logic: l })}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                    rule.logic === l ? 'bg-white text-black' : 'bg-[#1e1e1e] text-[#666]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <select
              value={rule.rule_type}
              onChange={e => updateRule(rule.id, { rule_type: e.target.value as RuleType })}
              className="flex-1 bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg px-2 py-2 text-xs text-white"
            >
              {Object.entries(ruleTypeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>

            {rule.rule_type !== 'time_reached' && (
              <input
                type="number"
                step="0.00001"
                value={rule.value}
                onChange={e => updateRule(rule.id, { value: parseFloat(e.target.value) || 0 })}
                placeholder="Value"
                className="w-24 bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg px-2 py-2 text-xs text-white font-mono"
              />
            )}

            <button
              type="button"
              onClick={() => removeRule(rule.id)}
              className="text-[#555] shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {needsTimeframe(rule.rule_type) && (
            <select
              value={rule.timeframe ?? 'H1'}
              onChange={e => updateRule(rule.id, { timeframe: e.target.value })}
              className="w-full mt-2 bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg px-2 py-2 text-xs text-white"
            >
              {['M1', 'M5', 'M15', 'H1', 'H4', 'D1'].map(tf => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addRule}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#888] border border-dashed border-[#2a2a2a] rounded-xl py-2.5"
      >
        <Plus size={14} /> Add condition
      </button>
    </div>
  )
}