import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Phone, Plus, Trash2, UserCheck, Users, Wallet, X } from 'lucide-react'
import { useAdminData } from '@/context/AdminDataContext'
import type { StaffMember } from '@/data/seed/adminTypes'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/cn'

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const inputClass =
  'h-11 w-full rounded-lg border border-bone/12 bg-char px-3 font-sans text-sm text-bone placeholder:text-smoke/50 focus:border-ember focus:outline-none'

const EMPTY_FORM = { name: '', role: '', phone: '', email: '', payRate: '' }

export function Staff() {
  const { data, addStaff, updateStaff, removeStaff } = useAdminData()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const active = data.staff.filter((s) => s.status === 'active').length
  const paid = data.staff.filter((s) => s.payRate > 0)
  const avgPay = paid.length
    ? paid.reduce((s, m) => s + m.payRate, 0) / paid.length
    : 0
  const roleCount = new Set(data.staff.map((s) => s.role)).size

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim()) return
    const member: StaffMember = {
      id: `s-${Date.now().toString(36)}`,
      name: form.name.trim(),
      role: form.role.trim(),
      phone: form.phone.trim() || '—',
      email: form.email.trim() || '—',
      payRate: Number(form.payRate) || 0,
      status: 'active',
      startedAt: new Date().toISOString().slice(0, 10),
    }
    addStaff(member)
    setForm(EMPTY_FORM)
    setShowAdd(false)
  }

  return (
    <div>
      <AdminPageHeader
        title="Staff"
        subtitle={`${data.staff.length} team members · ${active} on the active roster`}
        actions={
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
          >
            {showAdd ? <X size={15} /> : <Plus size={15} />}
            {showAdd ? 'Cancel' : 'Add Member'}
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Staff" value={String(data.staff.length)} icon={Users} accent="#FF6A14" />
        <StatCard label="On Roster" value={String(active)} icon={UserCheck} accent="#74B49A" />
        <StatCard label="Avg Pay Rate" value={`${formatPrice(avgPay)}/hr`} icon={Wallet} accent="#FFC230" />
        <StatCard label="Roles" value={String(roleCount)} icon={Users} accent="#FF2E88" />
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
            <div className="rounded-2xl border border-ember/30 bg-ash p-5">
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
                New Team Member
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  className={inputClass}
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Role (e.g. Cook)"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Pay rate ($/hr)"
                  type="number"
                  value={form.payRate}
                  onChange={(e) => setForm({ ...form, payRate: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <button
                  type="submit"
                  className="h-11 rounded-lg bg-ember font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
                >
                  Add to Roster
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* roster */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.staff.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-bone/8 bg-ash p-5"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ember to-molten font-display text-lg text-bone">
                {initials(member.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-extrabold text-bone">
                  {member.name}
                </p>
                <p className="font-sans text-xs text-ember">{member.role}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Remove ${member.name} from the roster?`))
                    removeStaff(member.id)
                }}
                aria-label={`Remove ${member.name}`}
                className="text-smoke transition-colors hover:text-ember"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-bone/8 pt-3 font-sans text-xs text-smoke">
              <p className="flex items-center gap-2">
                <Phone size={13} className="shrink-0" />
                {member.phone}
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail size={13} className="shrink-0" />
                {member.email}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-heading text-sm font-extrabold text-flare">
                {member.payRate > 0 ? `${formatPrice(member.payRate)}/hr` : 'Owner'}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateStaff(member.id, {
                    status: member.status === 'active' ? 'off' : 'active',
                  })
                }
                className={cn(
                  'rounded-full px-3 py-1 font-heading text-[10px] font-extrabold uppercase tracking-ember transition-colors',
                  member.status === 'active'
                    ? 'bg-heat-none/15 text-heat-none'
                    : 'bg-char text-smoke',
                )}
              >
                {member.status === 'active' ? '● On Roster' : '○ Off'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
