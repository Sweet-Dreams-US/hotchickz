import { NavLink } from 'react-router-dom'
import {
  CalendarDays,
  ChefHat,
  LayoutDashboard,
  LogOut,
  PartyPopper,
  Receipt,
  RotateCcw,
  Share2,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useAdminData } from '@/context/AdminDataContext'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', Icon: Receipt, end: false },
  { to: '/admin/menu', label: 'Menu', Icon: ChefHat, end: false },
  { to: '/admin/analytics', label: 'Analytics', Icon: TrendingUp, end: false },
  { to: '/admin/accounting', label: 'Accounting', Icon: Wallet, end: false },
  { to: '/admin/socials', label: 'Socials', Icon: Share2, end: false },
  { to: '/admin/staff', label: 'Staff', Icon: Users, end: false },
  { to: '/admin/schedule', label: 'Schedule', Icon: CalendarDays, end: false },
  { to: '/admin/events', label: 'Events', Icon: PartyPopper, end: false },
]

interface AdminSidebarProps {
  mobileOpen: boolean
  onClose: () => void
  onSignOut: () => void
}

export function AdminSidebar({ mobileOpen, onClose, onSignOut }: AdminSidebarProps) {
  const { resetData } = useAdminData()

  function handleReset() {
    if (window.confirm('Reset all demo data back to its seeded state?')) {
      resetData()
    }
  }

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-char/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-bone/10 bg-coal transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-b border-bone/10 px-5 py-5">
          <Logo size={40} compact />
          <p className="mt-3 font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
            Back of House
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-sm font-bold uppercase tracking-ember transition-colors',
                  isActive
                    ? 'bg-ember text-bone'
                    : 'text-smoke hover:bg-ash hover:text-bone',
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-bone/10 p-3">
          <a
            href="#/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-xs font-bold uppercase tracking-ember text-smoke transition-colors hover:bg-ash hover:text-bone"
          >
            <Store size={16} />
            Open Storefront
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-xs font-bold uppercase tracking-ember text-smoke transition-colors hover:bg-ash hover:text-bone"
          >
            <RotateCcw size={16} />
            Reset Demo Data
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-xs font-bold uppercase tracking-ember text-ember transition-colors hover:bg-ember/10"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
