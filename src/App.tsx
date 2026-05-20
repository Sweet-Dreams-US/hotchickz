import { HashRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/site/SiteLayout'
import { Home } from '@/pages/site/Home'
import { Menu } from '@/pages/site/Menu'
import { Catering } from '@/pages/site/Catering'
import { About } from '@/pages/site/About'
import { FindUs } from '@/pages/site/FindUs'
import { Checkout } from '@/pages/site/Checkout'
import { OrderConfirmed } from '@/pages/site/OrderConfirmed'
import { NotFound } from '@/pages/site/NotFound'
import { AdminApp } from '@/pages/admin/AdminApp'

/**
 * HashRouter is deliberate: GitHub Pages has no server to rewrite deep
 * links, and hash routing makes every route refresh-safe with zero config.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="catering" element={<Catering />} />
          <Route path="about" element={<About />} />
          <Route path="find-us" element={<FindUs />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:id" element={<OrderConfirmed />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </HashRouter>
  )
}
