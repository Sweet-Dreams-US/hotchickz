import { cn } from '@/lib/cn'

interface SmokeWispsProps {
  count?: number
  className?: string
}

/** Drifting smoke — purely atmospheric, never interactive. */
export function SmokeWisps({ count = 5, className }: SmokeWispsProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const dim = 60 + (i % 3) * 34
        return (
          <span
            key={i}
            className="absolute bottom-[-40px] block rounded-full bg-smoke/20 blur-2xl animate-smoke"
            style={{
              left: `${6 + (i * 88) / Math.max(count - 1, 1)}%`,
              width: dim,
              height: dim,
              animationDelay: `${i * 1.35}s`,
              animationDuration: `${6 + (i % 4)}s`,
            }}
          />
        )
      })}
    </div>
  )
}
