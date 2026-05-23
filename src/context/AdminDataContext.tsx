import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { buildSeed } from '@/data/seed/adminSeed'
import type {
  AdminData,
  AdminEvent,
  Shift,
  StaffMember,
} from '@/data/seed/adminTypes'
import type { CateringInquiry, Order, OrderStatus } from '@/lib/types'
import { loadJSON, removeKey, saveJSON, STORAGE_KEYS } from '@/lib/store'

/* ---- merge storefront activity into the admin dataset --------------- */

function inquiryToEvent(inquiry: CateringInquiry): AdminEvent {
  return {
    id: `inq-${inquiry.id}`,
    title: `Catering — ${inquiry.name}`,
    type: 'catering',
    date: new Date(inquiry.eventDate).toISOString(),
    status:
      inquiry.status === 'new'
        ? 'inquiry'
        : inquiry.status === 'contacted'
          ? 'upcoming'
          : 'confirmed',
    headcount: inquiry.headcount,
    contact: `${inquiry.name} · ${inquiry.phone}`,
    notes: inquiry.note,
  }
}

function byPlacedDesc(a: Order, b: Order): number {
  return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
}

/** Load persisted admin data (or build it), then fold in live storefront activity. */
function initAdminData(): AdminData {
  let data = loadJSON<AdminData | null>(STORAGE_KEYS.adminData, null) ?? buildSeed()

  // Orders placed on the storefront flow into the admin order list.
  const webOrders = loadJSON<Order[]>(STORAGE_KEYS.orders, [])
  const knownOrderIds = new Set(data.orders.map((o) => o.id))
  const freshOrders = webOrders.filter((o) => !knownOrderIds.has(o.id))
  if (freshOrders.length > 0) {
    data = {
      ...data,
      orders: [...freshOrders, ...data.orders].sort(byPlacedDesc),
    }
  }

  // Catering requests from the storefront become admin events.
  const inquiries = loadJSON<CateringInquiry[]>(
    STORAGE_KEYS.cateringInquiries,
    [],
  )
  const knownEventIds = new Set(data.events.map((e) => e.id))
  const freshEvents = inquiries
    .filter((q) => !knownEventIds.has(`inq-${q.id}`))
    .map(inquiryToEvent)
  if (freshEvents.length > 0) {
    data = { ...data, events: [...freshEvents, ...data.events] }
  }

  saveJSON(STORAGE_KEYS.adminData, data)
  return data
}

/* ---- context -------------------------------------------------------- */

interface AdminDataValue {
  data: AdminData
  setOrderStatus: (id: string, status: OrderStatus) => void
  addStaff: (member: StaffMember) => void
  updateStaff: (id: string, patch: Partial<StaffMember>) => void
  removeStaff: (id: string) => void
  addEvent: (event: AdminEvent) => void
  updateEvent: (id: string, patch: Partial<AdminEvent>) => void
  removeEvent: (id: string) => void
  addShift: (shift: Shift) => void
  removeShift: (id: string) => void
  resetData: () => void
}

const AdminDataContext = createContext<AdminDataValue | null>(null)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(initAdminData)

  const value = useMemo<AdminDataValue>(() => {
    const mutate = (fn: (d: AdminData) => AdminData) =>
      setData((prev) => {
        const next = fn(prev)
        saveJSON(STORAGE_KEYS.adminData, next)
        return next
      })

    return {
      data,
      setOrderStatus: (id, status) =>
        mutate((d) => ({
          ...d,
          orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      addStaff: (member) =>
        mutate((d) => ({ ...d, staff: [member, ...d.staff] })),
      updateStaff: (id, patch) =>
        mutate((d) => ({
          ...d,
          staff: d.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      removeStaff: (id) =>
        mutate((d) => ({ ...d, staff: d.staff.filter((s) => s.id !== id) })),
      addEvent: (event) =>
        mutate((d) => ({ ...d, events: [event, ...d.events] })),
      updateEvent: (id, patch) =>
        mutate((d) => ({
          ...d,
          events: d.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      removeEvent: (id) =>
        mutate((d) => ({ ...d, events: d.events.filter((e) => e.id !== id) })),
      addShift: (shift) =>
        mutate((d) => ({ ...d, shifts: [...d.shifts, shift] })),
      removeShift: (id) =>
        mutate((d) => ({ ...d, shifts: d.shifts.filter((s) => s.id !== id) })),
      resetData: () => {
        const fresh = buildSeed()
        saveJSON(STORAGE_KEYS.adminData, fresh)
        // Wipe the menu diff too so factory defaults return cleanly.
        removeKey(STORAGE_KEYS.menu)
        setData(fresh)
      },
    }
  }, [data])

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within an AdminDataProvider')
  return ctx
}
