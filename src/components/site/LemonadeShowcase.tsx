import { Link } from 'react-router-dom'
import { ArrowRight, Sun } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { buttonStyles } from '@/components/ui/Button'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/cn'

const FLAVORS = [
  { name: 'Original', color: '#FFC230' },
  { name: 'Blue Raspberry', color: '#3DA5FF' },
  { name: 'Cherry', color: '#E4231B' },
  { name: 'Watermelon', color: '#FF5C8A' },
  { name: 'Mix It Up', color: '#FF6A14' },
]

/** Summer seasonal feature — the house lemonade lineup. */
export function LemonadeShowcase() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-coal py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-50" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <Reveal className="overflow-hidden rounded-3xl border border-bone/10 shadow-plate">
          <img
            src={asset('assets/photos/lemonades-wide.jpg')}
            alt="The Hot Chickz lemonade lineup"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow>
            <Sun size={13} className="text-flare" /> Summer at Hot Chickz
          </Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.88] text-bone sm:text-7xl">
            ICE-COLD <span className="text-flare neon-flare">LEMONADE</span>
          </h2>
          <p className="mt-4 max-w-md font-sans leading-relaxed text-smoke">
            When the heat&apos;s got you in <span className="font-script text-xl text-flare">happy tears</span>,
            our house lemonade is the rescue. Five flavors, shaken ice-cold —
            the official drink of summer.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {FLAVORS.map((flavor) => (
              <span
                key={flavor.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-bone/12 bg-char/60 px-3 py-1.5"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: flavor.color }}
                />
                <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-bone">
                  {flavor.name}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-5">
            <span className="font-display text-4xl text-flare">$2.49</span>
            <Link to="/menu" className={cn(buttonStyles('flare', 'md'))}>
              Add a Lemonade
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
