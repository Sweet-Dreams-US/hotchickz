import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Receipt, Target, Users } from 'lucide-react'
import { useAdminData } from '@/context/AdminDataContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminCard } from '@/components/admin/AdminCard'
import { StatCard } from '@/components/admin/StatCard'
import { AreaChart } from '@/components/admin/charts/AreaChart'
import { BarChart } from '@/components/admin/charts/BarChart'
import { DonutChart } from '@/components/admin/charts/DonutChart'
import {
  channelMix,
  heatMix,
  ordersByDay,
  peakHours,
  revenueByDay,
  topItems,
} from '@/lib/adminMetrics'
import { formatDelta, formatNumber, formatPrice, round2 } from '@/lib/format'
import { cn } from '@/lib/cn'

const sum = (nums: number[]) => nums.reduce((s, n) => s + n, 0)
const pct = (curr: number, prev: number) =>
  prev === 0 ? 0 : round2(((curr - prev) / prev) * 100)

export function Analytics() {
  const { data } = useAdminData()
  const [period, setPeriod] = useState<7 | 14>(14)

  // Two periods deep so we can show period-over-period deltas.
  const revenueSeries = revenueByDay(data.orders, period * 2)
  const ordersSeries = ordersByDay(data.orders, period * 2)
  const curRevenue = sum(revenueSeries.slice(period).map((p) => p.value))
  const prevRevenue = sum(revenueSeries.slice(0, period).map((p) => p.value))
  const curOrders = sum(ordersSeries.slice(period).map((p) => p.value))
  const prevOrders = sum(ordersSeries.slice(0, period).map((p) => p.value))

  const trafficWindow = data.traffic.slice(-period)
  const curTraffic = sum(trafficWindow.map((p) => p.value))
  const prevTraffic = sum(
    data.traffic.slice(-period * 2, -period).map((p) => p.value),
  )

  const avgTicket = curOrders ? round2(curRevenue / curOrders) : 0
  const conversion = curTraffic ? round2((curOrders / curTraffic) * 100) : 0
  const prevConversion = prevTraffic
    ? round2((prevOrders / prevTraffic) * 100)
    : 0

  const items = topItems(data.orders, 6)
  const maxQty = Math.max(...items.map((i) => i.quantity), 1)

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        subtitle="Sales performance and customer behavior"
        actions={
          <div className="flex gap-1 rounded-xl bg-ash p-1">
            {([7, 14] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  'rounded-lg px-3 py-1.5 font-heading text-xs font-extrabold uppercase tracking-ember transition-colors',
                  period === p ? 'bg-ember text-bone' : 'text-smoke',
                )}
              >
                {p}D
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={`Revenue · ${period}d`}
          value={formatPrice(curRevenue)}
          delta={formatDelta(pct(curRevenue, prevRevenue))}
          deltaUp={curRevenue >= prevRevenue}
          icon={DollarSign}
          accent="#FFC230"
        />
        <StatCard
          label={`Orders · ${period}d`}
          value={formatNumber(curOrders)}
          delta={formatDelta(pct(curOrders, prevOrders))}
          deltaUp={curOrders >= prevOrders}
          icon={Receipt}
          accent="#FF6A14"
        />
        <StatCard
          label="Avg Ticket"
          value={formatPrice(avgTicket)}
          icon={Target}
          accent="#74B49A"
        />
        <StatCard
          label="Conversion"
          value={`${conversion}%`}
          delta={formatDelta(pct(conversion, prevConversion))}
          deltaUp={conversion >= prevConversion}
          icon={Users}
          accent="#FF2E88"
        />
      </div>

      <div className="mt-4">
        <AdminCard
          title={`Revenue — Last ${period} Days`}
          subtitle="Daily takings"
        >
          <AreaChart
            data={revenueSeries.slice(period)}
            color="#FF6A14"
            format={(v) => `$${Math.round(v).toLocaleString()}`}
          />
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Orders per Day">
          <BarChart data={ordersSeries.slice(period)} color="#E4231B" />
        </AdminCard>
        <AdminCard title="Site Traffic" subtitle="Daily visits">
          <AreaChart
            data={trafficWindow}
            color="#FFC230"
            format={(v) => `${formatNumber(Math.round(v))} visits`}
          />
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Top Sellers" subtitle="Units sold, all-time">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-heading text-sm font-bold text-bone">
                    {item.name}
                  </span>
                  <span className="font-heading text-xs font-extrabold text-smoke">
                    {item.quantity} · {formatPrice(item.revenue)}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-char">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-ember to-molten"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(item.quantity / maxQty) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard title="Peak Hours" subtitle="Orders by time of day">
          <BarChart data={peakHours(data.orders)} color="#FF6A14" />
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Heat Level Mix" subtitle="What spice levels sell">
          <DonutChart data={heatMix(data.orders)} centerLabel="Items" />
        </AdminCard>
        <AdminCard title="Channel Mix" subtitle="Revenue by order source">
          <DonutChart data={channelMix(data.orders)} centerLabel="Revenue" />
        </AdminCard>
      </div>
    </div>
  )
}
