import { Link } from 'react-router-dom'
import { ArrowUpRight, Facebook, Instagram, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Marquee } from '@/components/ui/Marquee'
import { buttonStyles } from '@/components/ui/Button'
import { BUSINESS, getOpenState } from '@/data/business'
import { cn } from '@/lib/cn'

function TikTokGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.35 2.06 1.5 3.62 3.5 3.9v3.13c-1.42.02-2.72-.4-3.83-1.13v6.43c0 3.2-2.6 5.74-5.79 5.74-3.2 0-5.79-2.55-5.79-5.74 0-3.13 2.5-5.69 5.6-5.74v3.22c-1.4.1-2.46 1.22-2.46 2.52 0 1.4 1.13 2.53 2.53 2.53s2.53-1.13 2.53-2.53V3h3.7z" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'Instagram', href: BUSINESS.socials.instagram, Icon: Instagram },
  { label: 'Facebook', href: BUSINESS.socials.facebook, Icon: Facebook },
  { label: 'TikTok', href: BUSINESS.socials.tiktok, Icon: TikTokGlyph },
]

const EXPLORE = [
  { to: '/menu', label: 'Full Menu' },
  { to: '/catering', label: 'Catering' },
  { to: '/about', label: 'Our Story' },
  { to: '/find-us', label: 'Find Us' },
]

const TICKER = ['Halal', 'Hand-Breaded', 'Cooked to Order', 'Five Heat Levels', 'Fort Wayne']

export function Footer() {
  const todayShort = getOpenState().today.short
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-bone/10 bg-coal">
      {/* ticker */}
      <div className="border-b border-bone/10 bg-ember py-2.5">
        <Marquee>
          {TICKER.map((word) => (
            <span
              key={word}
              className="mx-5 inline-flex items-center gap-5 font-heading text-sm font-extrabold uppercase tracking-ember text-bone"
            >
              {word}
              <span className="text-flare">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* closing CTA */}
      <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
        <p className="font-heading text-xs font-extrabold uppercase tracking-ember text-ember">
          Still hungry?
        </p>
        <h2 className="mt-2 font-display text-5xl text-bone sm:text-7xl">
          BRING THE <span className="text-ember neon-ember">HEAT</span> HOME
        </h2>
        <Link to="/menu" className={cn(buttonStyles('primary', 'lg'), 'mt-6')}>
          Start an Order
          <ArrowUpRight size={18} />
        </Link>
      </div>

      {/* columns */}
      <div className="mx-auto grid max-w-7xl gap-10 border-t border-bone/10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1.3fr]">
        <div>
          <Logo size={52} />
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-smoke">
            {BUSINESS.blurb}
          </p>
          <div className="mt-5 flex gap-2.5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl bg-ash text-bone shadow-inset-ring transition-all hover:bg-ember hover:text-bone"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-xs font-extrabold uppercase tracking-ember text-smoke">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="font-heading text-lg font-bold text-bone transition-colors hover:text-ember"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-xs font-extrabold uppercase tracking-ember text-smoke">
            Visit / Order
          </h3>
          <a
            href={BUSINESS.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-start gap-2 font-sans text-sm text-bone transition-colors hover:text-flare"
          >
            <MapPin size={16} className="mt-0.5 shrink-0 text-ember" />
            {BUSINESS.addressLine}
          </a>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="mt-2 flex items-center gap-2 font-sans text-sm text-bone transition-colors hover:text-flare"
          >
            <Phone size={16} className="shrink-0 text-ember" />
            {BUSINESS.phone}
          </a>
          <ul className="mt-4 space-y-1">
            {BUSINESS.hours.map((h) => {
              const today = h.short === todayShort
              return (
                <li
                  key={h.day}
                  className={cn(
                    'flex justify-between font-sans text-xs',
                    today ? 'text-bone' : 'text-smoke',
                  )}
                >
                  <span className={cn(today && 'font-bold text-flare')}>{h.day}</span>
                  <span className={cn(today && 'font-bold text-flare')}>{h.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-bone/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="font-sans text-xs text-smoke">
            © {year} {BUSINESS.legalName}. All heat reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-heat-none">
              ● 100% Halal
            </span>
            <Link
              to="/admin"
              className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke transition-colors hover:text-bone"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
