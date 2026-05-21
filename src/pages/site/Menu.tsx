import { useEffect, useState } from 'react'
import { CATEGORIES, type CategoryKey, itemsByCategory } from '@/data/menu'
import { HEAT_LEVELS } from '@/data/heatLevels'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/cn'
import { SmokeWisps } from '@/components/brand/SmokeWisps'
import { Reveal } from '@/components/ui/Reveal'
import { MenuItemCard } from '@/components/site/MenuItemCard'
import { HeaderBackdrop } from '@/components/site/HeaderBackdrop'

const GRID_FOR: Record<CategoryKey, string> = {
  meals: 'sm:grid-cols-2 lg:grid-cols-4',
  platters: 'sm:grid-cols-2 lg:grid-cols-3',
  tenders: 'sm:grid-cols-2',
  sides: 'sm:grid-cols-2 lg:grid-cols-4',
  drinks: 'sm:grid-cols-2',
}

export function Menu() {
  const [active, setActive] = useState<CategoryKey>(CATEGORIES[0].key)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as CategoryKey)
        }
      },
      { rootMargin: '-180px 0px -64% 0px' },
    )
    for (const cat of CATEGORIES) {
      const el = document.getElementById(cat.key)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  function scrollTo(key: CategoryKey) {
    document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* header */}
      <header className="relative overflow-hidden border-b border-bone/10 bg-coal px-4 pb-12 pt-32 sm:px-6">
        <HeaderBackdrop
          video={asset('assets/headers/menu.mp4')}
          image={asset('assets/headers/menu.jpg')}
        />
        <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-70" />
        <SmokeWisps count={5} />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-heading text-xs font-extrabold uppercase tracking-ember text-ember">
            Order online · Pickup
          </p>
          <h1 className="mt-2 font-display text-6xl leading-[0.85] text-bone sm:text-8xl">
            THE <span className="text-ember neon-ember">MENU</span>
          </h1>
          <p className="mt-3 max-w-lg font-sans text-smoke">
            Tap your heat, tap add — your bag fills as you browse. Every item is
            100% halal and cooked fresh to order.
          </p>

          {/* heat legend */}
          <div className="mt-7 flex flex-wrap gap-2">
            {HEAT_LEVELS.map((heat) => (
              <span
                key={heat.key}
                className="inline-flex items-center gap-2 rounded-full border border-bone/10 bg-char/60 px-3 py-1.5"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: heat.color }}
                />
                <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-bone">
                  {heat.name}
                </span>
                <span className="font-sans text-[10px] text-smoke">{heat.scoville}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* sticky category nav */}
      <nav className="sticky top-[72px] z-30 border-b border-bone/10 bg-char/92 backdrop-blur-md">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => scrollTo(cat.key)}
              className={cn(
                'shrink-0 rounded-lg px-4 py-2 font-heading text-xs font-extrabold uppercase tracking-ember transition-colors',
                active === cat.key
                  ? 'bg-ember text-bone'
                  : 'bg-ash text-smoke hover:text-bone',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* category sections */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        {CATEGORIES.map((cat) => (
          <section
            key={cat.key}
            id={cat.key}
            className="scroll-mt-[150px] pt-14"
          >
            <Reveal>
              <div className="flex items-end gap-4">
                <h2 className="font-display text-4xl leading-none text-bone sm:text-5xl">
                  {cat.name}
                </h2>
                <span className="mb-1 h-px flex-1 bg-bone/10" />
              </div>
              <p className="mt-2 font-sans text-sm text-smoke">{cat.tagline}</p>
            </Reveal>

            <div className={cn('mt-7 grid gap-5', GRID_FOR[cat.key])}>
              {itemsByCategory(cat.key).map((item, i) => (
                <MenuItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
