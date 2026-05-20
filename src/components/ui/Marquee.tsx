import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  /** Pause the scroll while hovered. */
  pauseOnHover?: boolean
  className?: string
}

/**
 * Seamless infinite ticker. The track holds two identical copies of the
 * content so the -50% keyframe loops with no visible seam.
 */
export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  className,
}: MarqueeProps) {
  return (
    <div className={cn('mask-fade-x flex overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max shrink-0',
          reverse ? 'animate-marquee-rev' : 'animate-marquee',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
