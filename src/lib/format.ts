/** Formatting helpers shared across the storefront and admin suite. */

/** Round to 2 decimal places — use for all money math to dodge float drift. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/** "$7.99" */
export function formatPrice(value: number): string {
  return `$${round2(value).toFixed(2)}`
}

/** "1,240" */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

/** "12.4K" / "1.2M" — compact counts for socials + analytics. */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${round2(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${round2(value / 1_000).toFixed(1)}K`
  return String(value)
}

function toDate(input: Date | string | number): Date {
  return input instanceof Date ? input : new Date(input)
}

/** "May 20" or "May 20, 2026" when the year differs from now. */
export function formatDate(input: Date | string | number): string {
  const date = toDate(input)
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/** "2:45 PM" */
export function formatTime(input: Date | string | number): string {
  return toDate(input).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** "May 20, 2:45 PM" */
export function formatDateTime(input: Date | string | number): string {
  return `${formatDate(input)}, ${formatTime(input)}`
}

/** "just now" / "8m ago" / "3h ago" / "2d ago" — for order feeds. */
export function relativeTime(input: Date | string | number): string {
  const diffMs = Date.now() - toDate(input).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

/** "+12.4%" / "-3.1%" with an explicit sign. */
export function formatDelta(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${round2(value).toFixed(1)}%`
}
