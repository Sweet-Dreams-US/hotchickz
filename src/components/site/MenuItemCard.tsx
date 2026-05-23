import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import type { MenuItem } from '@/data/menu'
import { DEFAULT_HEAT, type HeatKey } from '@/data/heatLevels'
import { useCart } from '@/context/CartContext'
import { formatPrice, round2 } from '@/lib/format'
import { cn } from '@/lib/cn'
import { FoodImage } from './FoodImage'
import { HeatPicker } from '@/components/brand/HeatPicker'
import { Badge } from '@/components/ui/Badge'

interface MenuItemCardProps {
  item: MenuItem
  index?: number
}

/**
 * The whole ordering experience in one card: choose heat + options inline,
 * then a single "Add to Bag" tap. No detail page, no detour.
 */
export function MenuItemCard({ item, index = 0 }: MenuItemCardProps) {
  const { addItem } = useCart()
  const [heat, setHeat] = useState<HeatKey>(DEFAULT_HEAT)
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const group of item.options ?? []) {
      const first = group.choices[0]
      if (first) initial[group.id] = first.id
    }
    return initial
  })
  const [added, setAdded] = useState(false)

  const delta = (item.options ?? []).reduce((sum, group) => {
    const choice = group.choices.find((c) => c.id === selections[group.id])
    return sum + (choice?.priceDelta ?? 0)
  }, 0)
  const price = round2(item.price + delta)
  const isSoldOut = item.soldOut === true

  function handleAdd() {
    addItem(item, { heat, selections })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-bone/8 bg-ash shadow-lift transition-shadow duration-300 hover:shadow-glow-ember"
    >
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden',
          isSoldOut && 'grayscale',
        )}
      >
        <FoodImage
          image={item.image}
          alt={item.name}
          className={cn(
            'h-full w-full transition-transform duration-500 group-hover:scale-[1.06]',
            isSoldOut && 'opacity-60',
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ash via-ash/10 to-transparent" />
        {item.badge && !isSoldOut && (
          <div className="absolute left-3 top-3">
            <Badge variant="flare">{item.badge}</Badge>
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="rounded-md bg-char/85 px-4 py-1.5 font-heading text-[11px] font-extrabold uppercase tracking-ember text-bone backdrop-blur-sm">
              Sold Out Today
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-extrabold leading-tight text-bone">
            {item.name}
          </h3>
          <span className="shrink-0 font-display text-2xl leading-none text-flare">
            {formatPrice(price)}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 font-sans text-sm leading-snug text-smoke">
          {item.description}
        </p>

        <div className="mt-3 flex-1 space-y-3">
          {item.heatable && (
            <div>
              <p className="mb-1.5 font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
                Heat Level
              </p>
              <HeatPicker value={heat} onChange={setHeat} size="sm" />
            </div>
          )}

          {(item.options ?? []).map((group) => (
            <div key={group.id}>
              <p className="mb-1.5 font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.choices.map((choice) => {
                  const active = selections[group.id] === choice.id
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({ ...s, [group.id]: choice.id }))
                      }
                      className={cn(
                        'rounded-md border px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-ember transition-colors',
                        active
                          ? 'border-flare bg-flare text-char'
                          : 'border-bone/15 bg-char/40 text-smoke hover:text-bone',
                      )}
                    >
                      {choice.label}
                      {choice.priceDelta
                        ? ` +$${choice.priceDelta.toFixed(2)}`
                        : ''}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={isSoldOut}
          className={cn(
            'mt-4 flex h-11 items-center justify-center gap-2 rounded-xl font-heading text-sm font-extrabold uppercase tracking-ember transition-all duration-200',
            isSoldOut
              ? 'cursor-not-allowed bg-ash text-smoke'
              : added
                ? 'bg-heat-none text-char active:scale-[0.98]'
                : 'bg-ember text-bone hover:bg-ember-bright hover:shadow-glow-ember active:scale-[0.98]',
          )}
        >
          {isSoldOut ? (
            'Sold Out'
          ) : added ? (
            <>
              <Check size={16} />
              In the Bag
            </>
          ) : (
            <>
              <Plus size={16} />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </motion.article>
  )
}
