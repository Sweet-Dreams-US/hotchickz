import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Sparkline } from './charts/Sparkline'

interface StatCardProps {
  label: string
  value: string
  /** e.g. "+12.4%" */
  delta?: string
  deltaUp?: boolean
  icon?: LucideIcon
  spark?: number[]
  accent?: string
}

export function StatCard({
  label,
  value,
  delta,
  deltaUp = true,
  icon: Icon,
  spark,
  accent = '#FF6A14',
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-bone/8 bg-ash p-5">
      <div className="flex items-start justify-between">
        <p className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
          {label}
        </p>
        {Icon && (
          <span
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            <Icon size={15} />
          </span>
        )}
      </div>

      <p className="mt-3 font-display text-4xl leading-none text-bone">{value}</p>

      <div className="mt-3 flex items-end justify-between">
        {delta && (
          <span
            className={cn(
              'font-heading text-xs font-extrabold',
              deltaUp ? 'text-heat-none' : 'text-ember',
            )}
          >
            {deltaUp ? '▲' : '▼'} {delta}
          </span>
        )}
        {spark && <Sparkline data={spark} color={accent} />}
      </div>
    </div>
  )
}
