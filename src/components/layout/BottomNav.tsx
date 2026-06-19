'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Target, Calendar, Clock, Bell, LayoutGrid } from 'lucide-react'

const navItems = [
  { href: '/dashboard',     label: 'Today',  icon: LayoutGrid },
  { href: '/pois',          label: 'POIs',   icon: Target },
  { href: '/timeline',      label: 'Timeline', icon: Clock },
  { href: '/calendar',      label: 'Calendar', icon: Calendar },
  { href: '/notifications', label: 'Alerts', icon: Bell },
]

export default function BottomNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c] border-t border-[#1a1a1a] px-2 py-2 flex justify-around z-50">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl relative ${
              active ? 'text-white' : 'text-[#555]'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
            {label === 'Alerts' && unreadCount > 0 && (
              <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}