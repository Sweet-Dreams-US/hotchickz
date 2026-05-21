import type { ReactNode } from 'react'
import { SmokeWisps } from '@/components/brand/SmokeWisps'
import { HeaderBackdrop } from '@/components/site/HeaderBackdrop'
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
      <HeaderBackdrop image={image} />
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
