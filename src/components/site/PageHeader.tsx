import type { ReactNode } from 'react'
import { SmokeWisps } from '@/components/brand/SmokeWisps'
import { Eyebrow } from '@/components/ui/Eyebrow'

interface PageHeaderProps {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  /** Optional background photo — pass a resolved URL via asset(). */
  image?: string
  children?: ReactNode
}

/** Shared storefront page header — flame-lit, smoky, billboard type. */
export function PageHeader({ eyebrow, title, intro, image, children }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-bone/10 bg-coal px-4 pb-12 pt-32 sm:px-6">
      {image && (
        <div className="pointer-events-none absolute inset-0">
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-[0.38]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-coal/82 via-coal/68 to-coal" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-70" />
      <SmokeWisps count={5} />
      <div className="relative mx-auto max-w-7xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 font-display text-6xl leading-[0.82] text-bone sm:text-8xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-xl font-sans leading-relaxed text-smoke">
            {intro}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
