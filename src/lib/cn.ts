import { clsx, type ClassValue } from 'clsx'

/** Conditional className joiner used across every component. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
