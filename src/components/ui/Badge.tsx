import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'ember' | 'flare' | 'neon' | 'ghost' | 'dark'

const variants: Record<BadgeVariant, string> = {
  ember: 'bg-ember text-bone',
  flare: 'bg-flare text-char',
  neon: 'bg-neon text-bone',
  ghost: 'border border-bone/25 text-bone',
  dark: 'bg-char/80 text-bone ring-1 ring-bone/10',
}

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: ReactNode
}

export function Badge({ variant = 'ember', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-heading text-[10px] font-extrabold uppercase leading-none tracking-ember',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
