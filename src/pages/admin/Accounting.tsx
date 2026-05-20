import { Percent, PiggyBank, TrendingDown, Wallet } from 'lucide-react'
import { useAdminData } from '@/context/AdminDataContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminCard } from '@/components/admin/AdminCard'
import { StatCard } from '@/components/admin/StatCard'
import { DonutChart } from '@/components/admin/charts/DonutChart'
import { EXPENSE_CATEGORIES } from '@/data/seed/adminTypes'
import { formatDate, formatPrice, round2 } from '@/lib/format'

const CATEGORY_COLOR: Record<string, string> = {
  'Food & Supplies': '#FF6A14',
  Labor: '#E4231B',
  Rent: '#FFC230',
  Utilities: '#74B49A',
  Marketing: '#FF2E88',
  Equipment: '#A2938A',
}

export function Accounting() {
  const { data } = useAdminData()

  const revenue = round2(
    data.orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((s, o) => s + o.total, 0),
  )

  const byCategory = EXPENSE_CATEGORIES.map((category) => ({
    category,
    amount: round2(
      data.expenses
        .filter((e) => e.category === category)
        .reduce((s, e) => s + e.amount, 0),
    ),
  }))

  const totalExpenses = round2(byCategory.reduce((s, c) => s + c.amount, 0))
  const net = round2(revenue - totalExpenses)
  const margin = revenue ? round2((net / revenue) * 100) : 0

  const donutData = byCategory
    .filter((c) => c.amount > 0)
    .map((c) => ({
      label: c.category,
      value: c.amount,
      color: CATEGORY_COLOR[c.category] ?? '#A2938A',
    }))

  const ledger = [...data.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div>
      <AdminPageHeader
        title="Accounting"
        subtitle="Profit & loss across the trailing period"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Gross Revenue"
          value={formatPrice(revenue)}
          icon={Wallet}
          accent="#FFC230"
        />
        <StatCard
          label="Total Expenses"
          value={formatPrice(totalExpenses)}
          icon={TrendingDown}
          accent="#E4231B"
        />
        <StatCard
          label="Net Profit"
          value={formatPrice(net)}
          icon={PiggyBank}
          accent="#74B49A"
        />
        <StatCard
          label="Profit Margin"
          value={`${margin}%`}
          icon={Percent}
          accent="#FF6A14"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* P&L statement */}
        <AdminCard title="Profit & Loss" subtitle="The bottom line">
          <div className="space-y-2.5 font-sans text-sm">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold uppercase tracking-ember text-bone">
                Gross Revenue
              </span>
              <span className="font-heading text-lg font-extrabold text-heat-none">
                {formatPrice(revenue)}
              </span>
            </div>
            <div className="space-y-1.5 border-t border-dashed border-bone/12 pt-2.5">
              {byCategory.map((c) => (
                <div key={c.category} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-smoke">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: CATEGORY_COLOR[c.category] }}
                    />
                    {c.category}
                  </span>
                  <span className="text-bone">−{formatPrice(c.amount)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-bone/12 pt-2.5">
              <span className="font-heading font-bold uppercase tracking-ember text-smoke">
                Total Expenses
              </span>
              <span className="font-heading text-lg font-extrabold text-ember">
                −{formatPrice(totalExpenses)}
              </span>
            </div>
            <div className="flex items-baseline justify-between rounded-xl bg-char px-4 py-3">
              <span className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
                Net Profit
              </span>
              <span className="font-display text-3xl text-flare">
                {formatPrice(net)}
              </span>
            </div>
          </div>
        </AdminCard>

        {/* expenses donut */}
        <AdminCard title="Expense Breakdown" subtitle="Where the money goes">
          <div className="py-2">
            <DonutChart
              data={donutData}
              centerValue={formatPrice(totalExpenses).replace('.00', '')}
              centerLabel="Spent"
            />
          </div>
        </AdminCard>
      </div>

      {/* ledger */}
      <div className="mt-4">
        <AdminCard title="Expense Ledger" subtitle="Recent transactions" bodyPadding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-bone/8">
                  {['Date', 'Vendor', 'Category', 'Amount'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledger.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-bone/5 transition-colors hover:bg-char/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3 font-sans text-sm text-smoke">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-5 py-3 font-heading text-sm font-bold text-bone">
                      {expense.vendor}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-heading text-[10px] font-bold uppercase tracking-ember"
                        style={{
                          color: CATEGORY_COLOR[expense.category],
                          backgroundColor: `${CATEGORY_COLOR[expense.category]}22`,
                        }}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-heading text-sm font-extrabold text-bone">
                      {formatPrice(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </div>
  )
}
