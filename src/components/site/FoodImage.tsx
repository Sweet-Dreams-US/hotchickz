import { useState } from 'react'
import { Flame } from '@/components/brand/Flame'
import { menuImage } from '@/lib/asset'
import { cn } from '@/lib/cn'

interface FoodImageProps {
  /** Filename within public/assets/menu/ */
  image: string
  alt: string
  className?: string
}

/**
 * Menu photography with a graceful, on-brand fallback. If the generated
 * image is missing, the slot renders a charred gradient + flame instead of
 * a broken-image icon — so the site looks intentional with or without art.
 */
export function FoodImage({ image, alt, className }: FoodImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={cn(
          'grid place-items-center bg-gradient-to-br from-soot via-coal to-char',
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <Flame size={40} animate />
      </div>
    )
  }

  return (
    <img
      src={menuImage(image)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  )
}
