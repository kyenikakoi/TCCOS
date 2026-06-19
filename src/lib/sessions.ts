export type TradingSession = 'Asia' | 'London' | 'New York' | 'Off'

export function getCurrentSession(): TradingSession {
  const now = new Date()
  const hour = now.getUTCHours()

  if (hour >= 0 && hour < 3) return 'Asia'
  if (hour >= 3 && hour < 8) return 'Off'
  if (hour >= 7 && hour < 12) return 'London'
  if (hour >= 12 && hour < 21) return 'New York'
  return 'Off'
}

export function getSessionColor(session: TradingSession): string {
  switch (session) {
    case 'Asia':     return '#3b82f6'
    case 'London':   return '#22c55e'
    case 'New York': return '#f59e0b'
    default:         return '#444'
  }
}