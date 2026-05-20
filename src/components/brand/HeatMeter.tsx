import { HEAT_BY_KEY, type HeatKey } from '@/data/heatLevels'
import { cn } from '@/lib/cn'
import { Flame } from './Flame'

interface HeatMeterProps {
  level: HeatKey
  size?: number
  showLabel?: boolean
  className?: string
}

/**
 * The signature heat motif: five flame slots, lit to match the level.
 * Recurs on menu cards, the heat showcase, cart lines and order tickets.
 */
export function HeatMeter({ level, size = 18, showLabel = false, className }: HeatMeterProps) {
  const heat = HEAT_BY_KEY[level]

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="inline-flex items-end gap-[3px]">
        {Array.from({ length: 5 }).map((_, i) => {
          const lit = i < heat.flames
          return (
            <Flame
              key={i}
              size={size}
              lit={lit}
              color={heat.color}
              animate={lit}
              delay={i * 0.12}
            />
          )
        })}
      </span>
      {showLabel && (
        <span
          className="font-heading text-xs font-extrabold uppercase tracking-ember"
          style={{ color: heat.color }}
        >
          {heat.name}
        </span>
      )}
    </span>
  )
}
