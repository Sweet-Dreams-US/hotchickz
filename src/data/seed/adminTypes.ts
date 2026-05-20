/** Domain types for the Hot Chickz admin suite. */

import type { Order } from '@/lib/types'

export interface StaffMember {
  id: string
  name: string
  role: string
  phone: string
  email: string
  /** Hourly pay in dollars. */
  payRate: number
  status: 'active' | 'off'
  startedAt: string
}

export interface Shift {
  id: string
  staffId: string
  /** 0 = Monday … 6 = Sunday. */
  day: number
  start: string
  end: string
}

export type EventType = 'promo' | 'catering' | 'community'
export type EventStatus = 'inquiry' | 'upcoming' | 'confirmed' | 'completed'

export interface AdminEvent {
  id: string
  title: string
  type: EventType
  date: string
  time?: string
  location?: string
  status: EventStatus
  headcount?: number
  contact?: string
  notes?: string
}

export interface ExpenseItem {
  id: string
  category: string
  vendor: string
  amount: number
  date: string
}

export type SocialPlatformKey = 'instagram' | 'facebook' | 'tiktok'

export interface SocialPlatform {
  key: SocialPlatformKey
  name: string
  handle: string
  followers: number
  growthPct: number
  engagementPct: number
  reach30d: number
}

export interface SocialPost {
  id: string
  platform: SocialPlatformKey
  caption: string
  date: string
  likes: number
  comments: number
  reach: number
}

/** A single point on a time-series chart. */
export interface DayPoint {
  date: string
  label: string
  value: number
}

export interface AdminData {
  orders: Order[]
  staff: StaffMember[]
  shifts: Shift[]
  events: AdminEvent[]
  expenses: ExpenseItem[]
  socials: SocialPlatform[]
  posts: SocialPost[]
  traffic: DayPoint[]
  followerTrend: DayPoint[]
  generatedAt: string
}

export const EXPENSE_CATEGORIES = [
  'Food & Supplies',
  'Labor',
  'Rent',
  'Utilities',
  'Marketing',
  'Equipment',
] as const
