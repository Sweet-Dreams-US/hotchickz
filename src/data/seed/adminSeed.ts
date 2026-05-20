/**
 * Demo seed for the admin suite. Built once on first load, then persisted —
 * after that, every status change and edit the user makes sticks.
 *
 * Order dates are relative to "now" so the dashboard always looks current.
 */

import { MENU } from '@/data/menu'
import type { HeatKey } from '@/data/heatLevels'
import { round2 } from '@/lib/format'
import { TAX_RATE } from '@/lib/orders'
import type {
  Order,
  OrderChannel,
  OrderLine,
  OrderStatus,
} from '@/lib/types'
import type {
  AdminData,
  AdminEvent,
  DayPoint,
  ExpenseItem,
  Shift,
  SocialPost,
  SocialPlatform,
  StaffMember,
} from './adminTypes'

/* ---- helpers -------------------------------------------------------- */

const rand = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1))
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

function dayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
}

function dateFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

const NAMES = [
  'Jordan A.', 'Maya R.', 'Devin O.', 'Aisha K.', 'Tyler M.', 'Sofia L.',
  'Marcus P.', 'Nadia H.', 'Cole W.', 'Bria T.', 'Omar S.', 'Hannah G.',
  'Isaiah B.', 'Lena V.', 'Caleb D.', 'Priya N.', 'Andre C.', 'Zoe F.',
  'Malik J.', 'Grace E.', 'Hassan Q.', 'Ruby C.', 'Trey L.', 'Ivy M.',
]

const HEAT_KEYS: HeatKey[] = ['none', 'mild', 'hot', 'blaze', 'reaper']

function randomPhone(): string {
  return `(260) 555-0${rand(100, 199)}`
}

function pickChannel(): OrderChannel {
  const r = Math.random()
  if (r < 0.42) return 'web'
  if (r < 0.75) return 'in-store'
  if (r < 0.9) return 'doordash'
  return 'phone'
}

/* ---- orders --------------------------------------------------------- */

function makeOrder(id: string, placed: Date, daysAgo: number): Order {
  const lineCount = rand(1, 3)
  const lines: OrderLine[] = []
  for (let i = 0; i < lineCount; i++) {
    const item = pick(MENU)
    const quantity = rand(1, 2)
    lines.push({
      name: item.name,
      quantity,
      unitPrice: item.price,
      heat: item.heatable ? pick(HEAT_KEYS) : undefined,
    })
  }
  const subtotal = round2(lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0))
  const tax = round2(subtotal * TAX_RATE)

  let status: OrderStatus
  if (Math.random() < 0.04) {
    status = 'cancelled'
  } else if (daysAgo === 0) {
    const minsAgo = (Date.now() - placed.getTime()) / 60000
    if (minsAgo < 12) status = 'new'
    else if (minsAgo < 32) status = 'cooking'
    else if (minsAgo < 58) status = 'ready'
    else status = 'completed'
  } else {
    status = 'completed'
  }

  return {
    id,
    placedAt: placed.toISOString(),
    status,
    fulfillment: Math.random() < 0.24 ? 'delivery' : 'pickup',
    channel: pickChannel(),
    customer: { name: pick(NAMES), phone: randomPhone() },
    lines,
    subtotal,
    tax,
    total: round2(subtotal + tax),
  }
}

function buildOrders(): Order[] {
  const orders: Order[] = []
  let counter = 1000
  const now = new Date()
  for (let d = 29; d >= 0; d--) {
    const day = new Date(now)
    day.setDate(now.getDate() - d)
    const dow = day.getDay()
    const weekend = dow === 0 || dow === 5 || dow === 6
    const count = weekend ? rand(34, 50) : rand(20, 30)
    for (let i = 0; i < count; i++) {
      const placed = new Date(day)
      placed.setHours(rand(11, 21), rand(0, 59), 0, 0)
      if (placed.getTime() > now.getTime()) continue
      counter += 1
      orders.push(makeOrder(`HC-${counter}`, placed, d))
    }
  }
  return orders.sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  )
}

/* ---- staff ---------------------------------------------------------- */

const STAFF: StaffMember[] = [
  { id: 's1', name: 'Marcus Webb', role: 'Owner', phone: '(260) 555-0110', email: 'marcus@hotchickz.com', payRate: 0, status: 'active', startedAt: '2024-01-15' },
  { id: 's2', name: 'Tasha Holloway', role: 'General Manager', phone: '(260) 555-0112', email: 'tasha@hotchickz.com', payRate: 24, status: 'active', startedAt: '2024-02-01' },
  { id: 's3', name: 'Andre Cole', role: 'Lead Cook', phone: '(260) 555-0118', email: 'andre@hotchickz.com', payRate: 21, status: 'active', startedAt: '2024-02-10' },
  { id: 's4', name: 'Priya Nair', role: 'Cook', phone: '(260) 555-0124', email: 'priya@hotchickz.com', payRate: 18, status: 'active', startedAt: '2024-05-06' },
  { id: 's5', name: 'Devon Pierce', role: 'Cook', phone: '(260) 555-0131', email: 'devon@hotchickz.com', payRate: 17.5, status: 'active', startedAt: '2024-07-22' },
  { id: 's6', name: 'Jordan Reyes', role: 'Cashier', phone: '(260) 555-0140', email: 'jordan@hotchickz.com', payRate: 15, status: 'active', startedAt: '2024-09-03' },
  { id: 's7', name: 'Sam Whitfield', role: 'Prep / Cashier', phone: '(260) 555-0147', email: 'sam@hotchickz.com', payRate: 15, status: 'off', startedAt: '2025-01-14' },
  { id: 's8', name: 'Lena Brooks', role: 'Delivery Driver', phone: '(260) 555-0153', email: 'lena@hotchickz.com', payRate: 14 + 0, status: 'active', startedAt: '2025-02-18' },
]

function buildShifts(): Shift[] {
  const shifts: Shift[] = []
  // [staffId, start, end] templates assigned across the week
  const templates: Array<[string, string, string]> = [
    ['s2', '10:30', '18:30'],
    ['s3', '10:00', '18:00'],
    ['s4', '12:00', '22:00'],
    ['s6', '11:00', '19:00'],
    ['s8', '15:00', '23:00'],
  ]
  let n = 0
  for (let day = 0; day < 7; day++) {
    const crew = day >= 4 ? templates : templates.slice(0, 4)
    for (const [staffId, start, end] of crew) {
      n += 1
      shifts.push({ id: `sh${n}`, staffId, day, start, end })
    }
    // extra cook on Fri/Sat
    if (day === 4 || day === 5) {
      n += 1
      shifts.push({ id: `sh${n}`, staffId: 's5', day, start: '14:00', end: '23:00' })
    }
  }
  return shifts
}

/* ---- events --------------------------------------------------------- */

const EVENTS: AdminEvent[] = [
  { id: 'e1', title: 'Reaper Challenge Night', type: 'promo', date: dateFromNow(4), time: '6:00 PM', location: 'In-store', status: 'confirmed', notes: 'Finish a Reaper 6-Tender Box, get it free + wall of fame.' },
  { id: 'e2', title: 'Northside Office Party', type: 'catering', date: dateFromNow(2), time: '12:30 PM', status: 'confirmed', headcount: 40, contact: 'Renee D. · (260) 555-0188', notes: 'Cookout package, 2 Reaper trays, drop-off.' },
  { id: 'e3', title: 'Free Slider Friday', type: 'promo', date: dateFromNow(9), time: 'All day', location: 'In-store', status: 'upcoming', notes: 'Free slider with any meal — push on socials Wed.' },
  { id: 'e4', title: 'Fort Wayne Halal Food Fest', type: 'community', date: dateFromNow(16), time: '11:00 AM', location: 'Headwaters Park', status: 'upcoming', notes: 'Booth + tender boxes. Need pop-up tent + 2 staff.' },
  { id: 'e5', title: 'Wedding Rehearsal Dinner', type: 'catering', date: dateFromNow(-3), time: '5:00 PM', status: 'completed', headcount: 25, contact: 'Hassan Q.', notes: 'Block Party package. Went great — ask for review.' },
  { id: 'e6', title: '1-Year Anniversary Bash', type: 'community', date: dateFromNow(21), time: '2:00 PM', location: 'In-store', status: 'upcoming', notes: 'Live music, giveaways. Planning meeting needed.' },
]

/* ---- expenses ------------------------------------------------------- */

const EXPENSES: ExpenseItem[] = [
  { id: 'x1', category: 'Food & Supplies', vendor: 'US Foods', amount: 1180.4, date: dateFromNow(-2) },
  { id: 'x2', category: 'Food & Supplies', vendor: 'Allen County Poultry', amount: 968.0, date: dateFromNow(-6) },
  { id: 'x3', category: 'Food & Supplies', vendor: 'Restaurant Depot', amount: 512.75, date: dateFromNow(-10) },
  { id: 'x4', category: 'Food & Supplies', vendor: 'US Foods', amount: 1094.2, date: dateFromNow(-16) },
  { id: 'x5', category: 'Food & Supplies', vendor: 'Sysco', amount: 642.4, date: dateFromNow(-23) },
  { id: 'x6', category: 'Labor', vendor: 'Payroll — Period 1', amount: 2460.0, date: dateFromNow(-1) },
  { id: 'x7', category: 'Labor', vendor: 'Payroll — Period 2', amount: 2420.0, date: dateFromNow(-15) },
  { id: 'x8', category: 'Rent', vendor: 'Pontiac St. Property LLC', amount: 2450.0, date: dateFromNow(-7) },
  { id: 'x9', category: 'Utilities', vendor: 'Indiana Michigan Power', amount: 486.3, date: dateFromNow(-6) },
  { id: 'x10', category: 'Utilities', vendor: 'Fort Wayne City Utilities', amount: 274.15, date: dateFromNow(-12) },
  { id: 'x11', category: 'Utilities', vendor: 'Comcast Business', amount: 139.99, date: dateFromNow(-11) },
  { id: 'x12', category: 'Marketing', vendor: 'Meta Ads', amount: 320.0, date: dateFromNow(-4) },
  { id: 'x13', category: 'Marketing', vendor: 'TikTok Promote', amount: 180.0, date: dateFromNow(-9) },
  { id: 'x14', category: 'Marketing', vendor: 'Local Print Run', amount: 140.0, date: dateFromNow(-20) },
  { id: 'x15', category: 'Equipment', vendor: 'WebstaurantStore', amount: 642.99, date: dateFromNow(-13) },
]

/* ---- socials -------------------------------------------------------- */

const SOCIALS: SocialPlatform[] = [
  { key: 'instagram', name: 'Instagram', handle: '@hotchickz.chicken', followers: 4287, growthPct: 6.4, engagementPct: 5.2, reach30d: 38400 },
  { key: 'facebook', name: 'Facebook', handle: 'Hot Chickz', followers: 1842, growthPct: 2.1, engagementPct: 3.1, reach30d: 14200 },
  { key: 'tiktok', name: 'TikTok', handle: '@hotchickz.chicken', followers: 9613, growthPct: 18.7, engagementPct: 9.8, reach30d: 214000 },
]

const POSTS: SocialPost[] = [
  { id: 'p1', platform: 'tiktok', caption: 'Reaper level… do you have what it takes? 🌶️🔥', date: dateFromNow(-1), likes: 14200, comments: 612, reach: 98000 },
  { id: 'p2', platform: 'instagram', caption: 'Chicken over rice hits different. White sauce + hot sauce.', date: dateFromNow(-2), likes: 842, comments: 47, reach: 6100 },
  { id: 'p3', platform: 'tiktok', caption: 'POV: the crust crunch ASMR you needed today', date: dateFromNow(-4), likes: 22800, comments: 905, reach: 167000 },
  { id: 'p4', platform: 'instagram', caption: 'Loaded Platter. Mac, slaw, fries, all the heat. 🍗', date: dateFromNow(-5), likes: 1106, comments: 73, reach: 8400 },
  { id: 'p5', platform: 'facebook', caption: 'Catering for the whole crew — book 2 hours ahead!', date: dateFromNow(-6), likes: 218, comments: 31, reach: 4900 },
  { id: 'p6', platform: 'instagram', caption: 'Free Slider Friday is BACK this week. Tag a friend 👀', date: dateFromNow(-8), likes: 1340, comments: 158, reach: 11200 },
]

/* ---- time series ---------------------------------------------------- */

function buildTraffic(): DayPoint[] {
  const points: DayPoint[] = []
  const now = new Date()
  for (let d = 29; d >= 0; d--) {
    const day = new Date(now)
    day.setDate(now.getDate() - d)
    const dow = day.getDay()
    const weekend = dow === 0 || dow === 5 || dow === 6
    points.push({
      date: day.toISOString(),
      label: dayLabel(day),
      value: (weekend ? rand(420, 680) : rand(220, 460)) + (29 - d) * 4,
    })
  }
  return points
}

function buildFollowerTrend(): DayPoint[] {
  const points: DayPoint[] = []
  const now = new Date()
  let total = 13200
  for (let d = 29; d >= 0; d--) {
    const day = new Date(now)
    day.setDate(now.getDate() - d)
    total += rand(28, 132)
    points.push({ date: day.toISOString(), label: dayLabel(day), value: total })
  }
  return points
}

/* ---- compose -------------------------------------------------------- */

export function buildSeed(): AdminData {
  return {
    orders: buildOrders(),
    staff: STAFF,
    shifts: buildShifts(),
    events: EVENTS,
    expenses: EXPENSES,
    socials: SOCIALS,
    posts: POSTS,
    traffic: buildTraffic(),
    followerTrend: buildFollowerTrend(),
    generatedAt: new Date().toISOString(),
  }
}
