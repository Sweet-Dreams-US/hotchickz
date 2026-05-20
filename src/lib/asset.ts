/**
 * Resolve a path inside /public against Vite's base URL.
 * In production the site lives at /hotchickz/, so `asset('assets/x.png')`
 * becomes `/hotchickz/assets/x.png`.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL // "/hotchickz/"
  return `${base}${path.replace(/^\/+/, '')}`
}

/** Convenience: resolve a generated menu image by filename. */
export function menuImage(filename: string): string {
  return asset(`assets/menu/${filename}`)
}
