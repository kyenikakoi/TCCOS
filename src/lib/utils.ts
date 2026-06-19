export function formatEventTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
}

export function formatPrice(price: number, symbol: string): string {
  const decimals = symbol.includes('JPY') ? 3 : 5
  return price.toFixed(decimals)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}