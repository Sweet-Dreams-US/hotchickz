import { DollarSign, Flame, Receipt, TrendingUp } from 'lucide-react'
import { useAdminData } from '@/context/AdminDataContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminCard } from '@/components/admin/AdminCard'
import { StatCard } from '@/components/admin/StatCard'
import { AreaChart } from '@/components/admin/charts/AreaChart'
import { DonutChart } from '@/components/admin/charts/DonutChart'
import { StatusBadge } from '@/components/admin/OrderBits'
import {
  activeOrderCount,
  channelMix,
  dayStats,
  ordersByDay,
  revenueByDay,
  topItems,
} from '@/lib/adminMetrics'
import { formatPrice, relativeTime } from '@/lib/format'

export function Dashboard() {
  const { data } = useAdminData()
  const { orders } = data

  const today = dayStats(orders, 0)
  const revenue14 = revenueByDay(orders, 14)
  const revenueSpark = revenueByDay(orders, 8).map((p) => p.value)
  const orderSpark = ordersByDay(orders, 8).map((p) => p.value)
  const channels = channelMix(orders)
  const items = topItems(orders, 5)
  const recent = orders.slice(0, 6)
  const active = activeOrderCount(orders)

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle={todayLabel}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-bone/10 bg-ash px-3 py-1.5 font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
            <span className="h-1.5 w-1.5 rounded-full bg-heat-none animate-ember-pulse" />
            Live
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's Revenue"
          value={formatPrice(today.revenue)}
          icon={DollarSign}
          accent="#FFC230"
          spark={revenueSpark}
        />
        <StatCard
          label="Today's Orders"
          value={String(today.orders)}
          icon={Receipt}
          accent="#FF6A14"
          spark={orderSpark}
        />
        <StatCard
          label="Avg Ticket"
          value={formatPrice(today.avgTicket)}
          icon={TrendingUp}
          accent="#74B49A"
        />
        <StatCard
          label="Active Orders"
          value={String(active)}
          icon={Flame}
          accent="#E4231B"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <AdminCard
          title="Revenue — Last 14 Days"
          className="lg:col-span-2"
          subtitle="Daily takings across every channel"
        >
          <AreaChart
            data={revenue14}
            color="#FF6A14"
            format={(v) => `$${Math.round(v).toLocaleString()}`}
          />
        </AdminCard>

        <AdminCard title="Channel Mix" subtitle="Where orders come from">
          <div className="py-2">
            <DonutChart
              data={channels}
              centerValue={String(orders.length)}
              centerLabel="Orders"
            />
          </div>
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Top Sellers" subtitle="By units sold">
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li
                key={item.name}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-char/50"
              >
                <span className="font-display text-xl text-ember/40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-heading text-sm font-bold text-bone">
                  {item.name}
                </span>
                <span className="font-sans text-xs text-smoke">
                  {item.quantity} sold
                </span>
                <span className="w-20 text-right font-heading text-sm font-extrabold text-flare">
                  {formatPrice(item.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard title="Recent Orders" subtitle="Latest tickets in">
          <ul className="space-y-1">
            {recent.map((order) => (
              <li
                key={order.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-char/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-bold text-bone">
                    {order.id}{' '}
                    <span className="text-smoke">· {order.customer.name}</span>
                  </p>
                  <p className="font-sans text-xs text-smoke">
                    {relativeTime(order.placedAt)}
                  </p>
                </div>
                <span className="font-heading text-sm font-extrabold text-bone">
                  {formatPrice(order.total)}
                </span>
                <StatusBadge status={order.status} />
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  )
}
