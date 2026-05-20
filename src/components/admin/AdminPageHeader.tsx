import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl leading-none text-bone sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 font-sans text-sm text-smoke">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
