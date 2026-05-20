import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { ScrollToTop } from '@/components/site/ScrollToTop'
import { AdminSidebar } from './AdminSidebar'

interface AdminLayoutProps {
  onSignOut: () => void
}

export function AdminLayout({ onSignOut }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-char">
      <ScrollToTop />
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSignOut={onSignOut}
      />

      <div className="lg:pl-64">
        <div className="flex items-center justify-between border-b border-bone/10 bg-coal px-4 py-3 lg:hidden">
          <Logo size={34} compact />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-xl bg-ash text-bone"
          >
            <Menu size={20} />
          </button>
        </div>

        <main className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
