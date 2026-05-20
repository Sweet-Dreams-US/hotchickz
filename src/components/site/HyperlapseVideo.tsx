import { asset } from '@/lib/asset'
import { cn } from '@/lib/cn'

/**
 * The storefront hyperlapse — autoplays, loops, muted, no controls.
 * `muted` + `playsInline` are required for reliable autoplay across browsers.
 */
export function HyperlapseVideo({ className }: { className?: string }) {
  return (
    <video
      className={cn('block h-full w-full object-cover', className)}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={asset('assets/hotchickz-hyperlapse.mp4')} type="video/mp4" />
    </video>
  )
}
