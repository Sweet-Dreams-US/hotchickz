import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Flame } from '@/components/brand/Flame'

/** Lightweight "added to your bag" confirmation — no page jump, no detour. */
export function CartToast() {
  const { justAdded, openCart } = useCart()
  const [shown, setShown] = useState(false)
  const lastAt = useRef(0)

  useEffect(() => {
    if (justAdded && justAdded.at !== lastAt.current) {
      lastAt.current = justAdded.at
      setShown(true)
      const timer = setTimeout(() => setShown(false), 3400)
      return () => clearTimeout(timer)
    }
  }, [justAdded])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
      <AnimatePresence>
        {shown && justAdded && (
          <motion.div
            initial={{ y: 44, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-ember/40 bg-coal/95 py-2.5 pl-3 pr-2.5 shadow-plate backdrop-blur"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ember/15">
              <Flame size={20} />
            </span>
            <p className="font-sans text-sm text-bone">
              <span className="font-bold text-flare">{justAdded.name}</span>
              <span className="text-smoke"> dropped in the bag</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setShown(false)
                openCart()
              }}
              className="ml-1 inline-flex items-center gap-1 rounded-xl bg-ember px-3 py-2 font-heading text-[11px] font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
            >
              View Bag
              <ArrowRight size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
