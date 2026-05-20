import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Small uppercase label with an ember tick — sits above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-heading text-xs font-extrabold uppercase tracking-ember text-ember',
        className,
      )}
    >
      <span className="h-px w-6 bg-ember" />
      {children}
    </span>
  )
}
