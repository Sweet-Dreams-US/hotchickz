/**
 * Order persistence. Orders placed on the storefront are written to
 * localStorage and read back by the admin Orders module — the seam that
 * makes this static demo behave like one connected system.
 */

import type { Order, OrderStatus } from './types'
import { loadJSON, saveJSON, STORAGE_KEYS } from './store'

/** Indiana sales tax — applied at checkout. */
export const TAX_RATE = 0.07

export function getWebOrders(): Order[] {
  return loadJSON<Order[]>(STORAGE_KEYS.orders, [])
}

export function saveWebOrders(orders: Order[]): void {
  saveJSON(STORAGE_KEYS.orders, orders)
}

/**
 * Web order numbers start above 2000 so they never collide with the
 * seeded historical orders (which live in the 1000s).
 */
export function nextOrderId(): string {
  const nums = getWebOrders()
    .map((o) => Number.parseInt(o.id.replace(/\D/g, ''), 10))
    .filter((n) => Number.isFinite(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `HC-${Math.max(max, 2000) + 1}`
}

/** Prepend a freshly placed order. */
export function placeOrder(order: Order): void {
  saveWebOrders([order, ...getWebOrders()])
}

export function updateWebOrderStatus(id: string, status: OrderStatus): void {
  saveWebOrders(getWebOrders().map((o) => (o.id === id ? { ...o, status } : o)))
}
