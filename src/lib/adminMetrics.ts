/** Pure derivations over orders — powers the Dashboard, Analytics & Accounting. */

import type { Order, OrderStatus } from './types'
import type { ChartPoint } from '@/components/admin/charts/AreaChart'
import type { DonutSlice } from '@/components/admin/charts/DonutChart'
import { HEAT_BY_KEY, HEAT_LEVELS } from '@/data/heatLevels'
import { round2 } from './format'

const DAY = 86_400_000

/** Cancelled orders never count toward revenue. */
const counts = (o: Order) => o.status !== 'cancelled'

const shortDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/* ---- time series ---------------------------------------------------- */

export function revenueByDay(orders: Order[], days: number): ChartPoint[] {
  const now = new Date()
  const series: ChartPoint[] = []
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(now)
    day.setDate(now.getDate() - d)
    const key = day.toDateString()
    const total = orders
      .filter((o) => counts(o) && new Date(o.placedAt).toDateString() === key)
      .reduce((s, o) => s + o.total, 0)
    series.push({ label: shortDate(day), value: round2(total) })
  }
  return series
}

export function ordersByDay(orders: Order[], days: number): ChartPoint[] {
  const now = new Date()
  const series: ChartPoint[] = []
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(now)
    day.setDate(now.getDate() - d)
    const key = day.toDateString()
    series.push({
      label: shortDate(day),
      value: orders.filter((o) => new Date(o.placedAt).toDateString() === key)
        .length,
    })
  }
  return series
}

/* ---- aggregate stats ------------------------------------------------ */

export interface RangeStats {
  revenue: number
  orders: number
  avgTicket: number
}

/** Stats for the window [now - days, now]. */
export function rangeStats(orders: Order[], days: number): RangeStats {
  const cutoff = Date.now() - days * DAY
  const inRange = orders.filter(
    (o) => counts(o) && new Date(o.placedAt).getTime() >= cutoff,
  )
  const revenue = round2(inRange.reduce((s, o) => s + o.total, 0))
  return {
    revenue,
    orders: inRange.length,
    avgTicket: inRange.length ? round2(revenue / inRange.length) : 0,
  }
}

/** Revenue + order count for a single calendar day, `daysAgo` back. */
export function dayStats(orders: Order[], daysAgo: number): RangeStats {
  const day = new Date()
  day.setDate(day.getDate() - daysAgo)
  const key = day.toDateString()
  const onDay = orders.filter(
    (o) => counts(o) && new Date(o.placedAt).toDateString() === key,
  )
  const revenue = round2(onDay.reduce((s, o) => s + o.total, 0))
  return {
    revenue,
    orders: onDay.length,
    avgTicket: onDay.length ? round2(revenue / onDay.length) : 0,
  }
}

export function activeOrderCount(orders: Order[]): number {
  return orders.filter(
    (o) => o.status === 'new' || o.status === 'cooking' || o.status === 'ready',
  ).length
}

export function statusCounts(orders: Order[]): Record<OrderStatus, number> {
  const base: Record<OrderStatus, number> = {
    new: 0,
    cooking: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
  }
  for (const o of orders) base[o.status] += 1
  return base
}

/** Percent change between two numbers, for delta pills. */
export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return round2(((current - previous) / previous) * 100)
}

/* ---- breakdowns ----------------------------------------------------- */

const CHANNEL_COLOR: Record<string, string> = {
  web: '#FF6A14',
  'in-store': '#FFC230',
  doordash: '#E4231B',
  phone: '#74B49A',
}
const CHANNEL_NAME: Record<string, string> = {
  web: 'Website',
  'in-store': 'In-Store',
  doordash: 'DoorDash',
  phone: 'Phone',
}

export function channelMix(orders: Order[]): DonutSlice[] {
  const totals: Record<string, number> = {}
  for (const o of orders) {
    if (!counts(o)) continue
    totals[o.channel] = (totals[o.channel] ?? 0) + o.total
  }
  return Object.entries(totals).map(([key, value]) => ({
    label: CHANNEL_NAME[key] ?? key,
    value: round2(value),
    color: CHANNEL_COLOR[key] ?? '#A2938A',
  }))
}

export function heatMix(orders: Order[]): DonutSlice[] {
  const totals: Record<string, number> = {}
  for (const o of orders) {
    if (!counts(o)) continue
    for (const line of o.lines) {
      if (!line.heat) continue
      totals[line.heat] = (totals[line.heat] ?? 0) + line.quantity
    }
  }
  return HEAT_LEVELS.filter((h) => totals[h.key]).map((h) => ({
    label: h.name,
    value: totals[h.key],
    color: h.color,
  }))
}

export interface ItemStat {
  name: string
  quantity: number
  revenue: number
}

export function topItems(orders: Order[], limit = 6): ItemStat[] {
  const map = new Map<string, ItemStat>()
  for (const o of orders) {
    if (!counts(o)) continue
    for (const line of o.lines) {
      const stat = map.get(line.name) ?? { name: line.name, quantity: 0, revenue: 0 }
      stat.quantity += line.quantity
      stat.revenue = round2(stat.revenue + line.unitPrice * line.quantity)
      map.set(line.name, stat)
    }
  }
  return [...map.values()].sort((a, b) => b.quantity - a.quantity).slice(0, limit)
}

/** Order counts bucketed by hour of day, across open hours. */
export function peakHours(orders: Order[]): ChartPoint[] {
  const buckets = new Array(24).fill(0)
  for (const o of orders) buckets[new Date(o.placedAt).getHours()] += 1
  const series: ChartPoint[] = []
  for (let h = 11; h <= 22; h++) {
    const suffix = h < 12 ? 'a' : 'p'
    const display = h % 12 === 0 ? 12 : h % 12
    series.push({ label: `${display}${suffix}`, value: buckets[h] })
  }
  return series
}

export { HEAT_BY_KEY }
