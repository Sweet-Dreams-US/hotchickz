import { Link } from 'react-router-dom'
import { ArrowRight, Sun } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { buttonStyles } from '@/components/ui/Button'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/cn'

/** The five house lemonades — order mirrors the menu flavor picker. */
const FLAVORS = [
  {
    name: 'Original',
    color: '#FFC230',
    image: 'assets/photos/lemonade-flavors/original.jpg',
    note: 'The classic — fresh-squeezed and tart.',
  },
  {
    name: 'Watermelon',
    color: '#FF5C8A',
    image: 'assets/photos/lemonade-flavors/watermelon.jpg',
    note: 'Juicy summer melon, ice-cold.',
  },
  {
    name: 'Blue Raspberry',
    color: '#3DA5FF',
    image: 'assets/photos/lemonade-flavors/blue.jpg',
    note: 'Electric blue, candy-sweet.',
  },
  {
    name: 'Cherry',
    color: '#E4231B',
    image: 'assets/photos/lemonade-flavors/cherry.jpg',
    note: 'Bright, bold and berry-sweet.',
  },
  {
    name: 'Mix It Up',
    color: '#FF6A14',
    image: 'assets/photos/lemonade-flavors/mix.jpg',
    note: 'Can’t choose? Get every flavor at once.',
  },
]

/** Summer seasonal feature — the house lemonade lineup, flavor by flavor. */
export function LemonadeShowcase() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-coal py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">
            <Sun size={13} className="text-flare" /> Summer at Hot Chickz
          </Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.88] text-bone sm:text-7xl">
            ICE-COLD <span className="text-flare neon-flare">LEMONADE</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans leading-relaxed text-smoke">
            When the heat&apos;s got you in{' '}
            <span className="font-script text-xl text-flare">happy tears</span>, our
            house lemonade is the rescue. Five flavors, shaken ice-cold — the
            official drink of summer.
          </p>
        </Reveal>

        {/* flavor lineup */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FLAVORS.map((flavor, i) => (
            <Reveal key={flavor.name} delay={i * 0.08}>
              <figure className="group relative h-full overflow-hidden rounded-2xl border border-bone/10 bg-char shadow-plate">
                <img
                  src={asset(flavor.image)}
                  alt={`Hot Chickz ${flavor.name} lemonade`}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: flavor.color }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char via-char/90 to-transparent px-3 pb-3 pt-12">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: flavor.color }}
                    />
                    <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-bone">
                      {flavor.name}
                    </span>
                  </span>
                  <span className="mt-1 block font-sans text-[11px] leading-snug text-smoke">
                    {flavor.note}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* price + cta */}
        <Reveal delay={0.12}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
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
