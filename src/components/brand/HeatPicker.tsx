import { HEAT_LEVELS, type HeatKey } from '@/data/heatLevels'
import { cn } from '@/lib/cn'

interface HeatPickerProps {
  value: HeatKey
  onChange: (heat: HeatKey) => void
  size?: 'sm' | 'md'
  className?: string
}

/** Segmented heat selector — lit on menu cards and inside the cart drawer. */
export function HeatPicker({ value, onChange, size = 'md', className }: HeatPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Heat level"
      className={cn('flex gap-1', className)}
    >
      {HEAT_LEVELS.map((heat) => {
        const active = heat.key === value
        return (
          <button
            key={heat.key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={heat.name}
            onClick={() => onChange(heat.key)}
            className={cn(
              'flex flex-1 items-center justify-center whitespace-nowrap rounded-md border text-center font-heading font-extrabold uppercase leading-none tracking-[0.06em] transition-all duration-200',
              size === 'sm' ? 'h-7 px-1 text-[8px]' : 'h-9 px-1.5 text-[10px]',
              active
                ? 'text-char'
                : 'border-bone/15 bg-char/50 text-smoke hover:border-bone/35 hover:text-bone',
            )}
            style={
              active
                ? {
                    backgroundColor: heat.color,
                    borderColor: heat.color,
                    boxShadow: `0 0 16px -3px ${heat.color}`,
                  }
                : undefined
            }
          >
            {heat.name}
          </button>
        )
      })}
    </div>
  )
}
