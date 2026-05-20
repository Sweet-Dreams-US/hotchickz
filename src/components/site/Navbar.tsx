import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { buttonStyles } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { getOpenState } from '@/data/business'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { to: '/menu', label: 'Menu' },
  { to: '/catering', label: 'Catering' },
  { to: '/about', label: 'About' },
  { to: '/find-us', label: 'Find Us' },
]

function OpenPill() {
  const { open } = getOpenState()
  return (
    <span className="inline-flex items-center gap-1.5 font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          open ? 'bg-heat-none animate-ember-pulse' : 'bg-ember',
        )}
      />
      {open ? 'Open Now' : 'Closed'}
    </span>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, openCart } = useCart()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-bone/10 bg-char/85 backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-char/70 to-transparent',
        )}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="Hot Chickz home">
            <Logo size={40} compact />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'relative font-heading text-sm font-bold uppercase tracking-ember transition-colors',
                    isActive ? 'text-bone' : 'text-smoke hover:text-bone',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-ember"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex">
              <OpenPill />
            </span>

            <Link
              to="/menu"
              className={cn(buttonStyles('primary', 'sm'), 'hidden sm:inline-flex')}
            >
              Order Now
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
              className="relative grid h-10 w-10 place-items-center rounded-xl bg-ash text-bone shadow-inset-ring transition-colors hover:bg-soot"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 font-heading text-[10px] font-extrabold text-bone"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-xl bg-ash text-bone shadow-inset-ring lg:hidden"
            >
              <MenuIcon size={19} />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] flex flex-col bg-char/97 backdrop-blur-lg lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-4">
              <Logo size={40} compact />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-xl bg-ash text-bone"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    className="block font-display text-5xl text-bone transition-colors hover:text-ember"
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="px-6 pb-10">
              <OpenPill />
              <Link
                to="/menu"
                className={cn(buttonStyles('primary', 'lg'), 'mt-3 w-full')}
              >
                Start an Order
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
