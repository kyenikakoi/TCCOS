import Link from 'next/link'
import type { POI } from '@/lib/types'
import POIStatusBadge from './POIStatusBadge'
import { formatPrice } from '@/lib/utils'

export default function POICard({ poi }: { poi: POI }) {
  return (
    <Link
      href={`/pois/${poi.id}`}
      className="block bg-[#101010] border border-[#1e1e1e] rounded-2xl p-4 active:bg-[#141414]"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">{poi.symbol}</span>
          <span
            className={`text-[10px] font-semibold uppercase ${
              poi.direction === 'long' ? 'text-green-400' : poi.direction === 'short' ? 'text-red-400' : 'text-[#666]'
            }`}
          >
            {poi.direction}
          </span>
        </div>
        <POIStatusBadge status={poi.status} />
      </div>

      <div className="text-xs text-[#666] font-mono">
        {formatPrice(poi.zone_low, poi.symbol)} – {formatPrice(poi.zone_high, poi.symbol)}
      </div>

      {poi.tags && poi.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {poi.tags.map(tag => (
            <span
              key={tag.id}
              className="text-[10px] px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${tag.color}1a`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}