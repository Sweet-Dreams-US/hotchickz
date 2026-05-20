import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAdminData } from '@/context/AdminDataContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  ChannelBadge,
  nextStatus,
  nextStatusLabel,
  StatusBadge,
} from '@/components/admin/OrderBits'
import { HEAT_BY_KEY } from '@/data/heatLevels'
import type { Order, OrderStatus } from '@/lib/types'
import { activeOrderCount } from '@/lib/adminMetrics'
import { formatPrice, relativeTime } from '@/lib/format'
import { cn } from '@/lib/cn'

const TABS: Array<{ key: OrderStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'cooking', label: 'Cooking' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

interface OrderTicketProps {
  order: Order
  onAdvance: (order: Order) => void
  onCancel: (id: string) => void
}

function OrderTicket({ order, onAdvance, onCancel }: OrderTicketProps) {
  const advanceLabel = nextStatusLabel(order.status)
  const canCancel =
    order.status === 'new' ||
    order.status === 'cooking' ||
    order.status === 'ready'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-bone/8 bg-ash"
    >
      <div className="flex items-center justify-between border-b border-dashed border-bone/12 px-4 py-3">
        <div>
          <p className="font-heading text-sm font-extrabold text-bone">
            {order.id}
          </p>
          <p className="font-sans text-xs text-smoke">
            {relativeTime(order.placedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ChannelBadge channel={order.channel} />
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="font-heading text-sm font-bold text-bone">
          {order.customer.name}
        </p>
        <p className="font-sans text-xs capitalize text-smoke">
          {order.customer.phone} · {order.fulfillment}
        </p>
        <ul className="mt-3 space-y-1.5">
          {order.lines.map((line, i) => (
            <li
              key={i}
              className="flex items-baseline justify-between gap-2 font-sans text-sm"
            >
              <span className="text-bone">
                <span className="text-flare">{line.quantity}×</span> {line.name}
                {line.heat && (
                  <span
                    className="ml-1.5 text-xs"
                    style={{ color: HEAT_BY_KEY[line.heat].color }}
                  >
                    · {HEAT_BY_KEY[line.heat].name}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-smoke">
                {formatPrice(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-dashed border-bone/12 px-4 py-3">
        <span className="font-display text-2xl text-bone">
          {formatPrice(order.total)}
        </span>
        <div className="flex gap-2">
          {canCancel && (
            <button
              type="button"
              onClick={() => onCancel(order.id)}
              className="rounded-lg bg-char px-3 py-2 font-heading text-[11px] font-bold uppercase tracking-ember text-smoke transition-colors hover:text-ember"
            >
              Cancel
            </button>
          )}
          {advanceLabel && (
            <button
              type="button"
              onClick={() => onAdvance(order)}
              className="rounded-lg bg-ember px-3 py-2 font-heading text-[11px] font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
            >
              {advanceLabel}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function Orders() {
  const { data, setOrderStatus } = useAdminData()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  // A kitchen pass shows the current rush, not the whole archive.
  const recent = useMemo(() => data.orders.slice(0, 40), [data.orders])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: recent.length }
    for (const o of recent) map[o.status] = (map[o.status] ?? 0) + 1
    return map
  }, [recent])

  const filtered =
    filter === 'all' ? recent : recent.filter((o) => o.status === filter)

  function advance(order: Order) {
    const next = nextStatus(order.status)
    if (next) setOrderStatus(order.id, next)
  }

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        subtitle={`Recent tickets · ${activeOrderCount(data.orders)} active in the kitchen`}
      />

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              'shrink-0 rounded-lg px-3.5 py-2 font-heading text-xs font-extrabold uppercase tracking-ember transition-colors',
              filter === tab.key
                ? 'bg-ember text-bone'
                : 'bg-ash text-smoke hover:text-bone',
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] opacity-70">
              {counts[tab.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bone/12 py-16 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-ember text-smoke">
            No {filter === 'all' ? '' : filter} orders
          </p>
        </div>
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                onAdvance={advance}
                onCancel={(id) => setOrderStatus(id, 'cancelled')}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
