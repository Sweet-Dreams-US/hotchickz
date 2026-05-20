import { asset } from '@/lib/asset'
import { cn } from '@/lib/cn'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  compact?: boolean
  className?: string
}

/**
 * The Hot Chickz logo lockup. The brand mark is a red rooster on white,
 * so it sits inside an intentional coin/token disc with an ember ring —
 * which doubles as the circular badge motif from the original logo.
 */
export function Logo({ size = 46, showWordmark = true, compact = false, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className="relative grid shrink-0 place-items-center rounded-full bg-white shadow-glow-ember ring-2 ring-ember"
        style={{ width: size, height: size }}
      >
        <img
          src={asset('hotchickz-logo.jpg')}
          alt="Hot Chickz"
          className="rounded-full object-cover"
          style={{ width: size * 0.86, height: size * 0.86 }}
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            'font-display leading-[0.8] text-bone',
            compact ? 'text-lg' : 'text-2xl',
          )}
        >
          <span className="block tracking-billboard">HOT</span>
          <span className="block text-ember neon-ember">CHICKZ</span>
        </span>
      )}
    </span>
  )
}
