import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Clock, MapPin, Phone } from 'lucide-react'
import { FEATURED_ITEMS } from '@/data/menu'
import { HEAT_LEVELS } from '@/data/heatLevels'
import { CATERING_PACKAGES } from '@/data/catering'
import { BUSINESS, getOpenState } from '@/data/business'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { SmokeWisps } from '@/components/brand/SmokeWisps'
import { Flame } from '@/components/brand/Flame'
import { HeatMeter } from '@/components/brand/HeatMeter'
import { Marquee } from '@/components/ui/Marquee'
import { Reveal } from '@/components/ui/Reveal'
import { MenuItemCard } from '@/components/site/MenuItemCard'
import { HyperlapseVideo } from '@/components/site/HyperlapseVideo'
import { LemonadeShowcase } from '@/components/site/LemonadeShowcase'
import { ExperienceSection } from '@/components/site/ExperienceSection'
import { ComingSoon } from '@/components/site/ComingSoon'
import { buttonStyles } from '@/components/ui/Button'

/* ---- shared bits ---------------------------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-heading text-xs font-extrabold uppercase tracking-ember text-ember">
      <span className="h-px w-6 bg-ember" />
      {children}
    </span>
  )
}

function SauceDrips() {
  return (
    <span className="pointer-events-none absolute -bottom-3 left-0 flex w-full justify-around px-[12%]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="block w-2 rounded-b-full bg-ember animate-drip"
          style={{ height: 18 + (i % 2) * 12, animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </span>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

/* ---- hero ----------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-28">
      {/* photographic backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={asset('assets/photos/hero-wide.jpg')}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-char/85 via-char/72 to-char" />
      </div>
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-flame-radial" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ember/20 to-transparent" />
      <SmokeWisps count={7} />
      <span className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[42vw] leading-none text-bone/[0.03]">
        HC
      </span>

      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } } }}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>Fort Wayne, IN · 100% Halal · Cooked to Order</Eyebrow>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-5 font-display leading-[0.82] text-bone"
        >
          <span className="block text-[clamp(2.6rem,9vw,6rem)] tracking-billboard">
            TASTE THE
          </span>
          <span className="relative mt-1 block">
            <span className="block text-[clamp(5rem,21vw,15rem)] text-ember neon-ember">
              HEAT
            </span>
            <SauceDrips />
          </span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="mt-4 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-flare/40" />
          <span className="font-script text-4xl leading-none text-flare sm:text-5xl">
            Happy Tears
          </span>
          <span className="h-px w-8 bg-flare/40" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-smoke sm:text-lg"
        >
          Nashville-style hot chicken — hand-breaded and fired to order, dialed
          from a gentle No Spice to the eye-watering Reaper. Hot chicken done loud.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link to="/menu" className={buttonStyles('primary', 'lg')}>
            Order Now
            <ArrowRight size={18} />
          </Link>
          <Link to="/about" className={buttonStyles('ghost', 'lg')}>
            How We Do It
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-11 flex items-center gap-3 rounded-full border border-bone/10 bg-coal/60 px-5 py-2.5 backdrop-blur"
        >
          <HeatMeter level="reaper" size={16} />
          <span className="font-heading text-xs font-extrabold uppercase tracking-ember text-smoke">
            Five levels of fire
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <ChevronDown size={26} className="animate-bounce text-smoke" />
      </motion.div>
    </section>
  )
}

/* ---- heat ticker band ---------------------------------------------- */

function HeatBand() {
  return (
    <div className="border-y border-bone/10 bg-coal py-3.5">
      <Marquee>
        {HEAT_LEVELS.map((heat) => (
          <span key={heat.key} className="mx-6 inline-flex items-center gap-6">
            <span
              className="font-display text-3xl uppercase tracking-billboard"
              style={{ color: heat.color }}
            >
              {heat.name}
            </span>
            <Flame size={20} color={heat.color} />
          </span>
        ))}
      </Marquee>
    </div>
  )
}

/* ---- featured ------------------------------------------------------- */

function Featured() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Straight off the press</Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-7xl">
            THE HEAVY <span className="text-ember">HITTERS</span>
          </h2>
        </div>
        <Link
          to="/menu"
          className="group inline-flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-ember text-smoke transition-colors hover:text-bone"
        >
          See the full menu
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_ITEMS.map((item, i) => (
          <MenuItemCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ---- heat ladder ---------------------------------------------------- */

function HeatLadder() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-coal py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <Eyebrow>Choose your fighter</Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-7xl">
            PICK YOUR <span className="text-ember neon-ember">PAIN</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-smoke">
            Every bird gets dialed to your tolerance. Pick a side — there are no
            wrong answers, only brave ones.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {HEAT_LEVELS.map((heat, i) => (
            <Reveal key={heat.key} delay={i * 0.07}>
              <div
                className="group h-full rounded-2xl border border-bone/8 bg-ash/80 p-5 transition-all duration-300 hover:-translate-y-1.5"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(247,238,221,0.05)' }}
              >
                <HeatMeter level={heat.key} size={18} />
                <h3
                  className="mt-4 font-display text-3xl leading-none"
                  style={{ color: heat.color }}
                >
                  {heat.name}
                </h3>
                <p className="mt-2 font-sans text-sm leading-snug text-smoke">
                  {heat.blurb}
                </p>
                <p className="mt-4 font-heading text-[11px] font-extrabold uppercase tracking-ember text-bone/40">
                  {heat.scoville}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- story strip ---------------------------------------------------- */

const STORY_POINTS = [
  { n: '01', title: 'Hand-Breaded', copy: 'Every piece dredged and breaded by hand, all day, every day.' },
  { n: '02', title: 'Cooked to Order', copy: 'Nothing sits. Your bird hits the oil when your ticket prints.' },
  { n: '03', title: '100% Halal', copy: 'Every cut on the menu is fully halal-certified. No exceptions.' },
]

function StoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <Eyebrow>Born in Fort Wayne</Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-6xl">
            A LITTLE SPOT WITH A <span className="text-ember">BIG MOUTH</span>
          </h2>
          <p className="mt-5 font-sans leading-relaxed text-smoke">
            Hot Chickz started with one idea: Nashville-style hot chicken,
            done properly, done halal, done in Fort Wayne. No shortcuts, no
            heat-lamp leftovers — just craggy, crackly, cooked-to-order chicken
            and a heat ladder that goes from friendly to feral.
          </p>
          <Link
            to="/about"
            className={cn(buttonStyles('ghost', 'md'), 'mt-7')}
          >
            Read Our Story
            <ArrowRight size={16} />
          </Link>
        </Reveal>

        <div className="grid gap-4">
          {STORY_POINTS.map((point, i) => (
            <Reveal key={point.n} delay={i * 0.1}>
              <div className="flex items-start gap-5 rounded-2xl border border-bone/8 bg-ash p-5">
                <span className="font-display text-5xl leading-none text-ember/30">
                  {point.n}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-bone">
                    {point.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-snug text-smoke">
                    {point.copy}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- catering teaser ----------------------------------------------- */

function CateringTeaser() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-ember">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.12]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <Reveal>
          <p className="font-heading text-xs font-extrabold uppercase tracking-ember text-char/70">
            Catering
          </p>
          <h2 className="mt-2 font-display text-5xl leading-[0.88] text-bone sm:text-7xl">
            FEEDING A <span className="text-char">CROWD?</span>
          </h2>
          <p className="mt-4 max-w-md font-sans text-bone/90">
            Mix-and-match trays of sliders, tenders and chopped chicken. Pick
            your package, pick your trays — we&apos;ll have it hot and ready.
          </p>
          <Link to="/catering" className={cn(buttonStyles('dark', 'lg'), 'mt-6')}>
            Plan Catering
            <ArrowRight size={18} />
          </Link>
        </Reveal>

        <Reveal delay={0.12} className="grid gap-3">
          {CATERING_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between rounded-xl bg-char/85 px-5 py-3.5"
            >
              <div>
                <p className="font-heading text-lg font-extrabold text-bone">
                  {pkg.name}
                </p>
                <p className="font-sans text-xs text-smoke">{pkg.feeds}</p>
              </div>
              <span className="font-display text-3xl text-flare">
                {formatPrice(pkg.price)}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ---- find us -------------------------------------------------------- */

function FindUsStrip() {
  const { open, today } = getOpenState()
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <Eyebrow>Come get it</Eyebrow>
        <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-7xl">
          FIND THE <span className="text-ember">FLAME</span>
        </h2>
      </Reveal>

      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* live hyperlapse of the storefront */}
        <Reveal className="overflow-hidden rounded-3xl border border-bone/10 shadow-plate">
          <div className="relative aspect-[3/4]">
            <HyperlapseVideo />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-char via-char/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-flare">
                Pull up
              </p>
              <p className="font-display text-2xl leading-tight text-bone">
                {BUSINESS.address.street}
              </p>
              <p className="font-sans text-sm text-smoke">
                {BUSINESS.address.city}, {BUSINESS.address.state}
              </p>
            </div>
          </div>
        </Reveal>

        {/* contact + hours */}
        <Reveal delay={0.1} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={BUSINESS.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-bone/8 bg-ash p-4 transition-colors hover:border-ember/40"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-char text-ember">
                <MapPin size={16} />
              </span>
              <span className="font-sans text-sm text-bone">
                {BUSINESS.addressLine}
              </span>
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="flex items-start gap-3 rounded-2xl border border-bone/8 bg-ash p-4 transition-colors hover:border-ember/40"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-char text-ember">
                <Phone size={16} />
              </span>
              <span className="font-sans text-sm text-bone">{BUSINESS.phone}</span>
            </a>
          </div>
          <div className="flex-1 rounded-2xl border border-bone/8 bg-ash p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-extrabold uppercase tracking-ember text-smoke">
                Weekly Hours
              </h3>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 font-heading text-[10px] font-extrabold uppercase tracking-ember',
                  open ? 'text-heat-none' : 'text-ember',
                )}
              >
                <Clock size={12} />
                {open ? 'Open now' : 'Closed'}
              </span>
            </div>
            <ul className="mt-3 divide-y divide-bone/8">
              {BUSINESS.hours.map((h) => {
                const isToday = h.short === today.short
                return (
                  <li
                    key={h.day}
                    className={cn(
                      'flex items-center justify-between py-2 font-sans text-sm',
                      isToday ? 'text-bone' : 'text-smoke',
                    )}
                  >
                    <span
                      className={cn(
                        'font-heading font-bold uppercase tracking-ember',
                        isToday && 'text-flare',
                      )}
                    >
                      {h.day}
                    </span>
                    <span className={cn(isToday && 'font-bold text-flare')}>
                      {h.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---- page ----------------------------------------------------------- */

export function Home() {
  return (
    <>
      <Hero />
      <HeatBand />
      <Featured />
      <LemonadeShowcase />
      <HeatLadder />
      <ExperienceSection />
      <StoryStrip />
      <ComingSoon />
      <CateringTeaser />
      <FindUsStrip />
    </>
  )
}
