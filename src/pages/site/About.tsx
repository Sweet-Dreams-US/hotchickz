import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/site/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Flame } from '@/components/brand/Flame'
import { buttonStyles } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const STATS = [
  { value: '5', label: 'Heat Levels' },
  { value: '100%', label: 'Halal' },
  { value: 'To Order', label: 'Always Cooked' },
  { value: 'Fort Wayne', label: 'Proudly From' },
]

const VALUES = [
  {
    n: '01',
    title: 'Hand-Breaded',
    copy: 'Every piece is dredged and breaded by hand — that craggy, shattering crust does not come from a machine.',
  },
  {
    n: '02',
    title: 'Cooked to Order',
    copy: 'Nothing sits under a heat lamp. Your chicken hits the oil the moment your ticket prints.',
  },
  {
    n: '03',
    title: 'The Heat Ladder',
    copy: 'Five honest levels, from a crunchy No Spice to the eye-watering Reaper. The choice is yours — choose wisely.',
  },
  {
    n: '04',
    title: '100% Halal',
    copy: 'Every cut on the menu is fully halal-certified. No asterisks, no exceptions, no compromise.',
  },
]

export function About() {
  return (
    <div>
      <PageHeader
        eyebrow="Our Story"
        title={
          <>
            OUR <span className="text-ember neon-ember">STORY</span>
          </>
        }
        intro="Hot Chickz is a small Fort Wayne spot with a loud idea — Nashville-style hot chicken, done properly, done halal."
      />

      {/* origin */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <Reveal>
            <Eyebrow>It started with a craving</Eyebrow>
            <h2 className="mt-3 font-display text-4xl leading-[0.95] text-bone sm:text-5xl">
              GOOD HOT CHICKEN SHOULDN&apos;T BE HARD TO FIND
            </h2>
            <div className="mt-5 space-y-4 font-sans leading-relaxed text-smoke">
              <p>
                We wanted the real thing — that Nashville-style crust that
                crackles, that slow-building burn, that chicken so fresh it
                practically steams when you open the box. And we wanted it
                halal, so everyone at the table could dig in.
              </p>
              <p>
                So we built it ourselves. Hot Chickz is hand-breaded, fired to
                order, and dialed to whatever heat you can handle. Sliders,
                tenders, chicken over rice — loud flavor, zero shortcuts.
              </p>
            </div>
            <Link to="/menu" className={cn(buttonStyles('primary', 'md'), 'mt-7')}>
              See What We Cook
              <ArrowRight size={16} />
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-2xl border border-bone/8 bg-ash p-7">
              <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-50" />
              <div className="relative grid grid-cols-2 gap-5">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-4xl leading-none text-flare">
                      {stat.value}
                    </p>
                    <p className="mt-1 font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative mt-6 flex items-center gap-2 border-t border-bone/8 pt-5">
                <Flame size={26} />
                <p className="font-heading text-sm font-bold uppercase tracking-ember text-bone">
                  Hot chicken done loud
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* values */}
      <section className="border-y border-bone/10 bg-coal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow>How we do it</Eyebrow>
            <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-6xl">
              THE HOT CHICKZ <span className="text-ember">WAY</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.n} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-bone/8 bg-ash p-6">
                  <span className="font-display text-5xl leading-none text-ember/30">
                    {value.n}
                  </span>
                  <h3 className="mt-3 font-heading text-xl font-extrabold text-bone">
                    {value.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-snug text-smoke">
                    {value.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* halal band */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-heat-none/30 bg-ash px-6 py-12 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08]" />
            <p
              className="relative font-heading text-sm font-extrabold uppercase tracking-ember"
              style={{ color: '#74B49A' }}
            >
              ● Certified
            </p>
            <h2 className="relative mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-7xl">
              100% <span style={{ color: '#74B49A' }}>HALAL</span>, ALWAYS
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl font-sans text-smoke">
              Every single item on the Hot Chickz menu is fully halal. It is not
              a sometimes thing or a special-request thing — it is simply how we
              cook, so everyone gets to share the heat.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
