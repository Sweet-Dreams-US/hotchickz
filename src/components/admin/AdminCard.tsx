import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface AdminCardProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  /** Set false to remove body padding (e.g. for flush tables). */
  bodyPadding?: boolean
}

/** Standard panel for the admin suite — header bar optional. */
export function AdminCard({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyPadding = true,
}: AdminCardProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-bone/8 bg-ash',
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-bone/8 px-5 py-4">
          <div>
            {title && (
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 font-sans text-xs text-smoke">{subtitle}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      <div className={cn(bodyPadding && 'p-5')}>{children}</div>
    </section>
  )
}
