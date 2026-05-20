import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, Clock, Plus, Users, X } from 'lucide-react'
import { useAdminData } from '@/context/AdminDataContext'
import type { Shift } from '@/data/seed/adminTypes'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { round2 } from '@/lib/format'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/** Hours between two "HH:MM" strings. */
function shiftHours(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60)
}

function fmtTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const suffix = h < 12 ? 'am' : 'pm'
  const display = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${display}${suffix}` : `${display}:${String(m).padStart(2, '0')}${suffix}`
}

const inputClass =
  'h-11 w-full rounded-lg border border-bone/12 bg-char px-3 font-sans text-sm text-bone focus:border-ember focus:outline-none'

export function Schedule() {
  const { data, addShift, removeShift } = useAdminData()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    staffId: data.staff[0]?.id ?? '',
    day: 0,
    start: '11:00',
    end: '19:00',
  })

  const staffName = (id: string) =>
    data.staff.find((s) => s.id === id)?.name ?? 'Unknown'
  const staffRole = (id: string) =>
    data.staff.find((s) => s.id === id)?.role ?? ''

  const totalHours = round2(
    data.shifts.reduce((s, sh) => s + shiftHours(sh.start, sh.end), 0),
  )
  const perDay = DAYS.map(
    (_, i) => data.shifts.filter((s) => s.day === i).length,
  )
  const busiestIdx = perDay.indexOf(Math.max(...perDay))
  const scheduledStaff = new Set(data.shifts.map((s) => s.staffId)).size

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.staffId) return
    const shift: Shift = {
      id: `sh-${Date.now().toString(36)}`,
      staffId: form.staffId,
      day: form.day,
      start: form.start,
      end: form.end,
    }
    addShift(shift)
    setShowAdd(false)
  }

  return (
    <div>
      <AdminPageHeader
        title="Schedule"
        subtitle="This week's shift coverage"
        actions={
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
          >
            {showAdd ? <X size={15} /> : <Plus size={15} />}
            {showAdd ? 'Cancel' : 'Add Shift'}
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Shifts" value={String(data.shifts.length)} icon={CalendarClock} accent="#FF6A14" />
        <StatCard label="Staffed Hours" value={`${totalHours}h`} icon={Clock} accent="#FFC230" />
        <StatCard label="Busiest Day" value={DAYS[busiestIdx].slice(0, 3)} icon={CalendarClock} accent="#E4231B" />
        <StatCard label="Staff Scheduled" value={String(scheduledStaff)} icon={Users} accent="#74B49A" />
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
            <div className="grid gap-3 rounded-2xl border border-ember/30 bg-ash p-5 sm:grid-cols-2 lg:grid-cols-5">
              <select
                className={inputClass}
                value={form.staffId}
                onChange={(e) => setForm({ ...form, staffId: e.target.value })}
              >
                {data.staff.map((s) => (
                  <option key={s.id} value={s.id} className="bg-char">
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={form.day}
                onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
              >
                {DAYS.map((d, i) => (
                  <option key={d} value={i} className="bg-char">
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="time"
                className={inputClass}
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              />
              <input
                type="time"
                className={inputClass}
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
              />
              <button
                type="submit"
                className="h-11 rounded-lg bg-ember font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
              >
                Add Shift
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* week grid */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {DAYS.map((day, i) => {
          const dayShifts = data.shifts
            .filter((s) => s.day === i)
            .sort((a, b) => a.start.localeCompare(b.start))
          return (
            <div
              key={day}
              className="rounded-2xl border border-bone/8 bg-ash p-3"
            >
              <div className="flex items-center justify-between px-1 pb-2">
                <span className="font-heading text-xs font-extrabold uppercase tracking-ember text-bone">
                  {day.slice(0, 3)}
                </span>
                <span className="font-sans text-[10px] text-smoke">
                  {dayShifts.length}
                </span>
              </div>
              <div className="space-y-2">
                {dayShifts.length === 0 && (
                  <p className="px-1 py-3 font-sans text-xs text-smoke/60">
                    No shifts
                  </p>
                )}
                {dayShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="group rounded-lg border-l-2 border-ember bg-char/60 px-2.5 py-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-heading text-xs font-bold text-bone">
                        {staffName(shift.staffId)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeShift(shift.id)}
                        aria-label="Remove shift"
                        className="text-smoke opacity-0 transition-opacity hover:text-ember group-hover:opacity-100"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <p className="font-sans text-[10px] text-ember">
                      {staffRole(shift.staffId)}
                    </p>
                    <p className="mt-1 font-sans text-[11px] text-smoke">
                      {fmtTime(shift.start)} – {fmtTime(shift.end)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
