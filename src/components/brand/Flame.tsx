import { cn } from '@/lib/cn'

interface FlameProps {
  size?: number
  /** Lit flames glow with `color`; unlit render as a dim husk outline. */
  lit?: boolean
  color?: string
  /** Idle flicker/dance animation. */
  animate?: boolean
  /** Stagger delay in seconds. */
  delay?: number
  className?: string
}

/**
 * The atomic brand shape. Two stacked paths — an outer body and a bright
 * inner core — so any heat color reads correctly (cores always run hot).
 */
export function Flame({
  size = 28,
  lit = true,
  color = '#FF6A14',
  animate = true,
  delay = 0,
  className,
}: FlameProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.3)}
      viewBox="0 0 24 32"
      fill="none"
      className={cn(animate && lit && 'animate-flame-dance', className)}
      style={{ animationDelay: `${delay}s`, transformOrigin: 'center bottom' }}
      aria-hidden="true"
    >
      <path
        d="M12 31C5 28.2 1.6 21.2 5.4 13.4C6.7 16 9 16.3 9 12.9C9 6.9 12.6 2.4 16.2 1C14.5 6.1 17.7 8.6 17 13.6C18.7 12.5 19.5 10.7 19.7 8.8C23 13.9 21.7 26.2 12 31Z"
        fill={lit ? color : 'transparent'}
        stroke={lit ? 'none' : 'rgba(162,147,138,0.45)'}
        strokeWidth={lit ? 0 : 1.5}
      />
      {lit && (
        <path
          d="M12 27.6C8.4 25.7 6.9 21.4 9 17C9.7 18.8 11.1 19.3 11.6 16.8C12.5 19.5 14.5 20.5 14.3 23.9C15.8 22.7 16.1 21.1 16.1 21.1C17.7 24.7 16 29.5 12 27.6Z"
          fill="#FFD45A"
          opacity={0.92}
        />
      )}
    </svg>
  )
}
