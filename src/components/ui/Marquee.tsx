import type { ReactNode } from 'react'
import { useMeasure } from '@/lib/useMeasure'
import { cn } from '@/lib/cn'

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  /** Pause the scroll while hovered. */
  pauseOnHover?: boolean
  /** Scroll speed in pixels per second — keeps pace constant at any width. */
  speed?: number
  className?: string
}

/**
 * Seamless infinite ticker.
 *
 * The content is repeated into a "lane" wide enough to overflow the viewport,
 * then the lane is duplicated so the `-50%` scroll loops with no seam AND no
 * blank gap — at any screen width. Duration scales with the lane width so the
 * scroll speed stays constant whether the viewport is a phone or an ultrawide.
 */
export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  speed = 40,
  className,
}: MarqueeProps) {
  const [viewportRef, viewportWidth] = useMeasure<HTMLDivElement>()
  const [unitRef, unitWidth] = useMeasure<HTMLDivElement>()

  // Repeat the content enough times that one lane always overflows the
  // viewport (+1 spare copy), so the track never reveals empty space.
  const repeat =
    unitWidth > 0
      ? Math.max(2, Math.ceil(viewportWidth / unitWidth) + 1)
      : 4
  const laneWidth = unitWidth * repeat
  const duration = laneWidth > 0 ? laneWidth / speed : 32

  const lane = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          ref={!hidden && i === 0 ? unitRef : undefined}
          className="flex shrink-0 items-center"
        >
          {children}
        </div>
      ))}
    </div>
  )

  return (
    <div ref={viewportRef} className={cn('mask-fade-x flex overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max shrink-0',
          reverse ? 'animate-marquee-rev' : 'animate-marquee',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {lane(false)}
        {lane(true)}
      </div>
    </div>
  )
}
