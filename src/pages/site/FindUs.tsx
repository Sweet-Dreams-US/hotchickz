import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react'
import { PageHeader } from '@/components/site/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { buttonStyles } from '@/components/ui/Button'
import { BUSINESS, getOpenState } from '@/data/business'
import { cn } from '@/lib/cn'

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  BUSINESS.addressLine,
)}&output=embed`

export function FindUs() {
  const { open, today } = getOpenState()

  return (
    <div>
      <PageHeader
        eyebrow="Find Us"
        title={
          <>
            COME GET <span className="text-ember neon-ember">IT</span>
          </>
        }
        intro="One location, all the heat. Order ahead and we'll have it boxed and ready."
      />

      {/* map + contact */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="overflow-hidden rounded-2xl border border-bone/10">
            <iframe
              title="Hot Chickz location"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[400px] w-full"
            />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-4">
            <div className="rounded-2xl border border-bone/10 bg-ash p-6">
              <span
                className={cn(
                  'inline-flex items-center gap-2 font-heading text-xs font-extrabold uppercase tracking-ember',
                  open ? 'text-heat-none' : 'text-ember',
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    open ? 'bg-heat-none animate-ember-pulse' : 'bg-ember',
                  )}
                />
                {open ? 'Open Now' : 'Currently Closed'}
              </span>
              <p className="mt-1 font-sans text-sm text-smoke">
                Today, {today.day}: {today.label}
              </p>

              <div className="mt-5 flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-ember" />
                <p className="font-sans text-bone">{BUSINESS.addressLine}</p>
              </div>
              <a
                href={BUSINESS.mapUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonStyles('primary', 'md'), 'mt-4 w-full')}
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </div>

            <div className="space-y-3 rounded-2xl border border-bone/10 bg-ash p-6">
              <h3 className="font-heading text-sm font-extrabold uppercase tracking-ember text-smoke">
                Call to Order
              </h3>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="flex items-center gap-3 font-sans text-bone transition-colors hover:text-flare"
              >
                <Phone size={16} className="shrink-0 text-ember" />
                {BUSINESS.phone}
              </a>
              <a
                href={`tel:${BUSINESS.altPhoneRaw}`}
                className="flex items-center gap-3 font-sans text-bone transition-colors hover:text-flare"
              >
                <Phone size={16} className="shrink-0 text-ember" />
                {BUSINESS.altPhone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-3 font-sans text-bone transition-colors hover:text-flare"
              >
                <Mail size={16} className="shrink-0 text-ember" />
                {BUSINESS.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* hours */}
      <section className="border-y border-bone/10 bg-coal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow>When we&apos;re cooking</Eyebrow>
            <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-6xl">
              WEEKLY <span className="text-ember">HOURS</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {BUSINESS.hours.map((h, i) => {
              const isToday = h.short === today.short
              return (
                <Reveal key={h.day} delay={i * 0.05}>
                  <div
                    className={cn(
                      'rounded-xl border p-4 text-center',
                      isToday
                        ? 'border-ember bg-ember/10'
                        : 'border-bone/8 bg-ash',
                    )}
                  >
                    <p
                      className={cn(
                        'font-display text-2xl',
                        isToday ? 'text-ember' : 'text-bone',
                      )}
                    >
                      {h.short}
                    </p>
                    <p className="mt-1 font-sans text-xs text-smoke">{h.label}</p>
                    {isToday && (
                      <p className="mt-1.5 font-heading text-[9px] font-extrabold uppercase tracking-ember text-ember">
                        Today
                      </p>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* socials + cta */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <Reveal>
          <Eyebrow className="justify-center">Follow the flame</Eyebrow>
          <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">
            SEE WHAT&apos;S COOKING
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={BUSINESS.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-ash px-5 py-3 font-heading text-sm font-bold uppercase tracking-ember text-bone transition-colors hover:bg-ember"
            >
              <Instagram size={18} />
              Instagram
            </a>
            <a
              href={BUSINESS.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-ash px-5 py-3 font-heading text-sm font-bold uppercase tracking-ember text-bone transition-colors hover:bg-ember"
            >
              <Facebook size={18} />
              Facebook
            </a>
            <a
              href={BUSINESS.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-ash px-5 py-3 font-heading text-sm font-bold uppercase tracking-ember text-bone transition-colors hover:bg-ember"
            >
              TikTok
            </a>
          </div>
          <Link to="/menu" className={cn(buttonStyles('primary', 'lg'), 'mt-8')}>
            Order Ahead Now
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
