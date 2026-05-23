import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminDataProvider } from '@/context/AdminDataContext'
import { loadJSON, removeKey, saveJSON, STORAGE_KEYS } from '@/lib/store'
import { AdminLogin } from './AdminLogin'
import { AdminLayout } from './AdminLayout'
import { Dashboard } from './Dashboard'
import { Orders } from './Orders'
import { MenuManagement } from './MenuManagement'
import { Analytics } from './Analytics'
import { Accounting } from './Accounting'
import { Socials } from './Socials'
import { Staff } from './Staff'
import { Schedule } from './Schedule'
import { Events } from './Events'

/**
 * Self-contained admin app mounted at /admin/*. Holds the demo auth gate
 * and its own nested routes, wrapped in the AdminDataProvider.
 */
export function AdminApp() {
  const [authed, setAuthed] = useState(() =>
    loadJSON<boolean>(STORAGE_KEYS.adminAuth, false),
  )

  function signIn() {
    saveJSON(STORAGE_KEYS.adminAuth, true)
    setAuthed(true)
  }

  function signOut() {
    removeKey(STORAGE_KEYS.adminAuth)
    setAuthed(false)
  }

  if (!authed) return <AdminLogin onSignIn={signIn} />

  return (
    <AdminDataProvider>
      <Routes>
        <Route element={<AdminLayout onSignOut={signOut} />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="socials" element={<Socials />} />
          <Route path="staff" element={<Staff />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="events" element={<Events />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminDataProvider>
  )
}
