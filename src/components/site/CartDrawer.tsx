import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import type { CartLine } from '@/lib/types'
import type { HeatKey } from '@/data/heatLevels'
import { formatPrice } from '@/lib/format'
import { FoodImage } from './FoodImage'
import { HeatPicker } from '@/components/brand/HeatPicker'
import { Flame } from '@/components/brand/Flame'
import { Button } from '@/components/ui/Button'

/* ---- single bag line ------------------------------------------------ */

interface CartLineRowProps {
  line: CartLine
  onQty: (lineId: string, qty: number) => void
  onRemove: (lineId: string) => void
  onHeat: (lineId: string, heat: HeatKey) => void
}

function CartLineRow({ line, onQty, onRemove, onHeat }: CartLineRowProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3 border-b border-dashed border-bone/12 pb-4"
    >
      <FoodImage
        image={line.image}
        alt={line.name}
        className="h-[68px] w-[68px] shrink-0 rounded-xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-heading text-sm font-extrabold leading-tight text-bone">
            {line.name}
          </p>
          <button
            type="button"
            onClick={() => onRemove(line.lineId)}
            aria-label={`Remove ${line.name}`}
            className="shrink-0 text-smoke transition-colors hover:text-ember"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {line.options.length > 0 && (
          <p className="mt-0.5 truncate font-sans text-xs text-smoke">
            {line.options.map((o) => o.choiceLabel).join('  ·  ')}
          </p>
        )}

        {line.heat && (
          <HeatPicker
            value={line.heat}
            onChange={(heat) => onHeat(line.lineId, heat)}
            size="sm"
            className="mt-2"
          />
        )}

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onQty(line.lineId, line.quantity - 1)}
              disabled={line.quantity <= 1}
              aria-label="Decrease quantity"
              className="grid h-7 w-7 place-items-center rounded-lg bg-ash text-bone transition-colors hover:bg-soot disabled:opacity-35"
            >
              <Minus size={13} />
            </button>
            <span className="w-5 text-center font-heading text-sm font-extrabold text-bone">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQty(line.lineId, line.quantity + 1)}
              aria-label="Increase quantity"
              className="grid h-7 w-7 place-items-center rounded-lg bg-ash text-bone transition-colors hover:bg-soot"
            >
              <Plus size={13} />
            </button>
          </div>
          <span className="font-heading text-sm font-extrabold text-flare">
            {formatPrice(line.unitPrice * line.quantity)}
          </span>
        </div>
      </div>
    </motion.li>
  )
}

/* ---- the drawer ----------------------------------------------------- */

export function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, setQuantity, removeLine, setHeat } =
    useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeCart])

  function goToCheckout() {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[55] bg-char/80 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col bg-coal sm:w-[430px]"
            role="dialog"
            aria-label="Your bag"
          >
            {/* ticket header */}
            <header className="relative shrink-0 border-b border-dashed border-bone/15 bg-ash px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-ember">
                    Hot Chickz · Order Ticket
                  </p>
                  <h2 className="font-display text-2xl text-bone">
                    Your Bag{' '}
                    <span className="text-smoke">
                      {count > 0 ? `(${count})` : ''}
                    </span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close bag"
                  className="grid h-9 w-9 place-items-center rounded-xl bg-char text-bone transition-colors hover:bg-soot"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <Flame size={56} />
                <div>
                  <p className="font-display text-2xl text-bone">Your bag&apos;s empty</p>
                  <p className="mt-1 font-sans text-sm text-smoke">
                    No heat in here yet. Let&apos;s fix that.
                  </p>
                </div>
                <Link to="/menu" onClick={closeCart}>
                  <Button variant="primary">
                    See the Menu
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <CartLineRow
                        key={line.lineId}
                        line={line}
                        onQty={setQuantity}
                        onRemove={removeLine}
                        onHeat={setHeat}
                      />
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="shrink-0 border-t border-dashed border-bone/15 bg-ash px-5 py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-heading text-sm font-bold uppercase tracking-ember text-smoke">
                      Subtotal
                    </span>
                    <span className="font-display text-3xl text-bone">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-xs text-smoke">
                    Taxes &amp; pickup details on the next step.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={goToCheckout}
                    className="mt-3 w-full"
                  >
                    <ShoppingBag size={17} />
                    Checkout
                    <ArrowRight size={17} />
                  </Button>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 w-full py-1.5 font-heading text-[11px] font-bold uppercase tracking-ember text-smoke transition-colors hover:text-bone"
                  >
                    Keep Adding Heat
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
