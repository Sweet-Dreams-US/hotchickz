import { Outlet } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { CartToast } from './CartToast'
import { ScrollToTop } from './ScrollToTop'

/**
 * Shell for every storefront page. The CartProvider is scoped here, so the
 * cart only exists for the public site — the admin suite stays separate.
 */
export function SiteLayout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-char">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <CartToast />
      </div>
    </CartProvider>
  )
}
