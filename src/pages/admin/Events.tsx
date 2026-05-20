import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  CalendarPlus,
  Megaphone,
  Plus,
  Trash2,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAdminData } from '@/context/AdminDataContext'
import type { AdminEvent, EventStatus, EventType } from '@/data/seed/adminTypes'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'

const TYPE_META: Record<EventType, { label: string; color: string; Icon: LucideIcon }> = {
  promo: { label: 'Promo', color: '#FFC230', Icon: Megaphone },
  catering: { label: 'Catering', color: '#FF6A14', Icon: UtensilsCrossed },
  community: { label: 'Community', color: '#25E0D8', Icon: Users },
}

const STATUSES: EventStatus[] = ['inquiry', 'upcoming', 'confirmed', 'completed']
const FILTERS: Array<EventType | 'all'> = ['all', 'promo', 'catering', 'community']

const inputClass =
  'h-11 w-full rounded-lg border border-bone/12 bg-char px-3 font-sans text-sm text-bone placeholder:text-smoke/50 focus:border-ember focus:outline-none'

export function Events() {
  const { data, addEvent, updateEvent, removeEvent } = useAdminData()
  const [filter, setFilter] = useState<EventType | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: 'promo' as EventType,
    date: '',
    time: '',
    notes: '',
  })

  const now = Date.now()
  const openCount = data.events.filter((e) => e.status !== 'completed').length
  const cateringCount = data.events.filter((e) => e.type === 'catering').length
  const thisWeek = data.events.filter((e) => {
    const t = new Date(e.date).getTime()
    return t >= now - 86_400_000 && t <= now + 7 * 86_400_000
  }).length
  const confirmed = data.events.filter((e) => e.status === 'confirmed').length

  const visible = (filter === 'all'
    ? data.events
    : data.events.filter((e) => e.type === filter)
  )
    .slice()
    .sort((a, b) => {
      const rank = (e: AdminEvent) => (e.status === 'completed' ? 1 : 0)
      return (
        rank(a) - rank(b) ||
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    const event: AdminEvent = {
      id: `e-${Date.now().toString(36)}`,
      title: form.title.trim(),
      type: form.type,
      date: new Date(form.date).toISOString(),
      time: form.time.trim() || undefined,
      status: 'upcoming',
      notes: form.notes.trim() || undefined,
    }
    addEvent(event)
    setForm({ title: '', type: 'promo', date: '', time: '', notes: '' })
    setShowAdd(false)
  }

  return (
    <div>
      <AdminPageHeader
        title="Events"
        subtitle="Promotions, catering bookings and community appearances"
        actions={
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
          >
            {showAdd ? <X size={15} /> : <Plus size={15} />}
            {showAdd ? 'Cancel' : 'New Event'}
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Events" value={String(openCount)} icon={CalendarDays} accent="#FF6A14" />
        <StatCard label="Catering Requests" value={String(cateringCount)} icon={UtensilsCrossed} accent="#FFC230" />
        <StatCard label="This Week" value={String(thisWeek)} icon={CalendarPlus} accent="#FF2E88" />
        <StatCard label="Confirmed" value={String(confirmed)} icon={CalendarDays} accent="#74B49A" />
      </div>

      {/* add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="mt-4 overflow-hidden"
          >
            <div className="grid gap-3 rounded-2xl border border-ember/30 bg-ash p-5 sm:grid-cols-2">
              <input
                className={inputClass}
                placeholder="Event title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as EventType })
                }
              >
                {(Object.keys(TYPE_META) as EventType[]).map((t) => (
                  <option key={t} value={t} className="bg-char">
                    {TYPE_META[t].label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className={inputClass}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Time (e.g. 6:00 PM)"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
              <input
                className={cn(inputClass, 'sm:col-span-2')}
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <button
                type="submit"
                className="h-11 rounded-lg bg-ember font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95 sm:col-span-2"
              >
                Create Event
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-3.5 py-2 font-heading text-xs font-extrabold uppercase tracking-ember transition-colors',
              filter === f ? 'bg-ember text-bone' : 'bg-ash text-smoke hover:text-bone',
            )}
          >
            {f === 'all' ? 'All' : TYPE_META[f].label}
          </button>
        ))}
      </div>

      {/* event cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {visible.map((event) => {
          const meta = TYPE_META[event.type]
          return (
            <div
              key={event.id}
              className={cn(
                'rounded-2xl border border-bone/8 bg-ash p-5',
                event.status === 'completed' && 'opacity-60',
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-heading text-[10px] font-extrabold uppercase tracking-ember"
                  style={{ color: meta.color, backgroundColor: `${meta.color}22` }}
                >
                  <meta.Icon size={12} />
                  {meta.label}
                </span>
                <select
                  value={event.status}
                  onChange={(e) =>
                    updateEvent(event.id, {
                      status: e.target.value as EventStatus,
                    })
                  }
                  className="rounded-md border border-bone/12 bg-char px-2 py-1 font-heading text-[10px] font-extrabold uppercase tracking-ember text-bone focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-char">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <h3 className="mt-3 font-heading text-lg font-extrabold leading-tight text-bone">
                {event.title}
              </h3>
              <p className="mt-1 font-sans text-sm text-flare">
                {formatDate(event.date)}
                {event.time ? ` · ${event.time}` : ''}
              </p>

              {(event.headcount || event.contact) && (
                <p className="mt-1 font-sans text-xs text-smoke">
                  {event.headcount ? `${event.headcount} guests` : ''}
                  {event.headcount && event.contact ? ' · ' : ''}
                  {event.contact ?? ''}
                </p>
              )}

              {event.notes && (
                <p className="mt-3 border-t border-bone/8 pt-3 font-sans text-sm leading-snug text-smoke">
                  {event.notes}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${event.title}"?`))
                    removeEvent(event.id)
                }}
                className="mt-3 inline-flex items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-ember text-smoke transition-colors hover:text-ember"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
