import { Instagram, MapPin } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Flame } from '@/components/brand/Flame'
import { SmokeWisps } from '@/components/brand/SmokeWisps'
import { buttonStyles } from '@/components/ui/Button'
import { BUSINESS } from '@/data/business'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/cn'

/**
 * Second-location teaser.
 *
 * TO ADD THE REAL PHOTO: drop the image into public/assets/photos/ and set
 * COMING_SOON_PHOTO to its filename — the placeholder swaps out automatically.
 */
const COMING_SOON_PHOTO: string | null = null

export function ComingSoon() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-coal py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-50" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow>The next chapter</Eyebrow>
          <h2 className="mt-3 font-display text-6xl leading-[0.82] text-bone sm:text-8xl">
            LOCATION <span className="text-ember neon-ember">N&deg;2</span>
            <span className="block">COMING SOON</span>
          </h2>
          <p className="mt-4 max-w-md font-sans leading-relaxed text-smoke">
            One spot was never going to be enough. A second Hot Chickz is on the
            way — more hand-breaded heat, more{' '}
            <span className="font-script text-xl text-flare">happy tears</span>,
            for more of the city. The reveal drops soon.
          </p>
          <a
            href={BUSINESS.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonStyles('primary', 'md'), 'mt-6')}
          >
            <Instagram size={16} />
            Follow for the Reveal
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-bone/10">
            {COMING_SOON_PHOTO ? (
              <img
                src={asset(`assets/photos/${COMING_SOON_PHOTO}`)}
                alt="The new Hot Chickz location"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="relative grid h-full w-full place-items-center border-2 border-dashed border-ember/40 bg-gradient-to-br from-ash via-coal to-char">
                <SmokeWisps count={4} />
                <div className="relative flex flex-col items-center text-center">
                  <Flame size={56} />
                  <p className="mt-4 font-heading text-sm font-extrabold uppercase tracking-ember text-ember">
                    Location N&deg;2
                  </p>
                  <p className="mt-1 font-display text-3xl text-bone">
                    PHOTO DROPPING SOON
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 font-sans text-xs text-smoke">
                    <MapPin size={13} />
                    Reveal coming this week
                  </p>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
