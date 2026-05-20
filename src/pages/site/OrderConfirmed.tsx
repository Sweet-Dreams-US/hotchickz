import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react'
import { getWebOrders } from '@/lib/orders'
import { HEAT_BY_KEY } from '@/data/heatLevels'
import { BUSINESS } from '@/data/business'
import { formatPrice, formatTime } from '@/lib/format'
import { Flame } from '@/components/brand/Flame'
import { SmokeWisps } from '@/components/brand/SmokeWisps'
import { Button } from '@/components/ui/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export function OrderConfirmed() {
  const { id } = useParams<{ id: string }>()
  const order = useMemo(() => getWebOrders().find((o) => o.id === id), [id])

  if (!order) {
    return (
      <div className="grid min-h-screen place-items-center px-6 pb-24 pt-32 text-center">
        <div className="flex flex-col items-center">
          <Flame size={64} />
          <h1 className="mt-4 font-display text-5xl text-bone">Order not found</h1>
          <p className="mt-2 font-sans text-smoke">
            We couldn&apos;t track down that ticket. It may have been cleared.
          </p>
          <Link to="/menu" className="mt-6">
            <Button variant="primary">
              Start a New Order <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPickup = order.fulfillment === 'pickup'

  return (
    <div className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-flame-radial" />
      <SmokeWisps count={5} />

      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-xl flex-col items-center text-center"
      >
        {/* badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="relative grid h-28 w-28 place-items-center rounded-full bg-ember shadow-glow-ember"
        >
          <Flame size={52} animate />
          <span className="absolute -right-2 -top-1">
            <Flame size={26} color="#FFC230" delay={0.3} />
          </span>
          <span className="absolute -left-3 top-2">
            <Flame size={20} color="#FF6A14" delay={0.6} />
          </span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-7 font-heading text-xs font-extrabold uppercase tracking-ember text-ember"
        >
          Order #{order.id}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="mt-2 font-display text-6xl leading-[0.85] text-bone sm:text-8xl"
        >
          ORDER <span className="text-ember neon-ember">IN!</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-3 font-sans text-smoke">
          Thanks, <span className="text-bone">{order.customer.name}</span> — your
          ticket just hit the kitchen. We&apos;re firing it up.
        </motion.p>

        {/* ticket */}
        <motion.div
          variants={fadeUp}
          className="mt-8 w-full overflow-hidden rounded-2xl border border-bone/10 bg-coal text-left"
        >
          <div className="flex items-center justify-between border-b border-dashed border-bone/15 bg-ash px-5 py-3.5">
            <span className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-ember">
              Kitchen Ticket
            </span>
            <span className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
              {formatTime(order.placedAt)}
            </span>
          </div>

          <ul className="space-y-2.5 px-5 py-4">
            {order.lines.map((line, i) => (
              <li key={i} className="flex justify-between gap-3 font-sans text-sm">
                <span className="text-bone">
                  <span className="text-flare">{line.quantity}×</span> {line.name}
                  {line.heat && (
                    <span
                      className="ml-2 text-xs"
                      style={{ color: HEAT_BY_KEY[line.heat].color }}
                    >
                      {HEAT_BY_KEY[line.heat].name}
                    </span>
                  )}
                  {line.optionSummary && (
                    <span className="ml-1 text-xs text-smoke">
                      · {line.optionSummary}
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-heading font-bold text-bone">
                  {formatPrice(line.unitPrice * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between border-t border-dashed border-bone/15 px-5 py-3.5">
            <span className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
              Total Paid on {isPickup ? 'Pickup' : 'Delivery'}
            </span>
            <span className="font-display text-3xl text-flare">
              {formatPrice(order.total)}
            </span>
          </div>
        </motion.div>

        {/* logistics */}
        <motion.div
          variants={fadeUp}
          className="mt-5 w-full space-y-3 rounded-2xl border border-bone/10 bg-ash p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-char text-ember">
              <Clock size={16} />
            </span>
            <p className="font-sans text-sm text-bone">
              {isPickup
                ? 'Ready for pickup in about 15–20 minutes.'
                : 'On the way — about 30–40 minutes.'}
            </p>
          </div>
          {isPickup && (
            <a
              href={BUSINESS.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition-colors hover:text-flare"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-char text-ember">
                <MapPin size={16} />
              </span>
              <p className="font-sans text-sm text-bone">{BUSINESS.addressLine}</p>
            </a>
          )}
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-3 transition-colors hover:text-flare"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-char text-ember">
              <Phone size={16} />
            </span>
            <p className="font-sans text-sm text-bone">
              Questions? Call {BUSINESS.phone}
            </p>
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/menu">
            <Button variant="primary">
              Order More <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
