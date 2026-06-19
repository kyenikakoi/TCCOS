import type { POIStatus } from '@/lib/types'

const statusConfig: Record<POIStatus, { label: string; color: string; bg: string }> = {
  draft:        { label: 'Draft',       color: '#888', bg: '#1a1a1a' },
  active:       { label: 'Active',      color: '#22c55e', bg: '#22c55e1a' },
  approaching:  { label: 'Approaching', color: '#f59e0b', bg: '#f59e0b1a' },
  triggered:    { label: 'Triggered',   color: '#ef4444', bg: '#ef44441a' },
  fulfilled:    { label: 'Fulfilled',   color: '#3b82f6', bg: '#3b82f61a' },
  invalidated:  { label: 'Invalidated', color: '#666', bg: '#1a1a1a' },
}

export default function POIStatusBadge({ status }: { status: POIStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  )
}