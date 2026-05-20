/** Cross-cutting domain types: the cart and orders. */

import type { HeatKey } from '@/data/heatLevels'

export type FulfillmentType = 'pickup' | 'delivery'

export interface CartOptionSelection {
  groupId: string
  groupLabel: string
  choiceId: string
  choiceLabel: string
}

export interface CartLine {
  /** Stable identity: itemId + heat + chosen options. Same config => same line. */
  lineId: string
  itemId: string
  name: string
  image: string
  /** Base price plus any option deltas, per single unit. */
  unitPrice: number
  quantity: number
  heat?: HeatKey
  options: CartOptionSelection[]
}

export type OrderStatus = 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled'
export type OrderChannel = 'web' | 'in-store' | 'doordash' | 'phone'

export interface OrderLine {
  name: string
  quantity: number
  unitPrice: number
  heat?: HeatKey
  optionSummary?: string
}

export interface Order {
  /** Human-facing ticket number, e.g. "HC-1042". */
  id: string
  placedAt: string // ISO timestamp
  status: OrderStatus
  fulfillment: FulfillmentType
  channel: OrderChannel
  customer: {
    name: string
    phone: string
    email?: string
  }
  lines: OrderLine[]
  subtotal: number
  tax: number
  total: number
  note?: string
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'new',
  'cooking',
  'ready',
  'completed',
]

/** A catering request submitted from the storefront — surfaced in admin Events. */
export interface CateringInquiry {
  id: string
  submittedAt: string
  name: string
  phone: string
  email?: string
  eventDate: string
  headcount: number
  packageId: string
  note?: string
  status: 'new' | 'contacted' | 'booked'
}
