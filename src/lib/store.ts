/**
 * Tiny localStorage wrapper. Because this demo deploys to GitHub Pages
 * (static hosting, no server), localStorage IS the database — the cart and
 * every order placed on the storefront persist here and are read back by
 * the admin suite.
 *
 * All keys are namespaced under `hotchickz:`.
 */

const PREFIX = 'hotchickz:'

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    // Storage unavailable (private mode) or corrupt value — fall back cleanly.
    return fallback
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage unavailable or over quota. The demo continues with in-memory
    // React state for this session; nothing is lost mid-session.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* no-op */
  }
}

/** Storage keys used across the app — one place to keep them honest. */
export const STORAGE_KEYS = {
  cart: 'cart',
  orders: 'orders',
  cateringInquiries: 'catering-inquiries',
  adminAuth: 'admin-auth',
  adminData: 'admin-data',
} as const
