import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Flame as FlameIcon, UtensilsCrossed } from 'lucide-react'
import { PageHeader } from '@/components/site/PageHeader'
import { asset } from '@/lib/asset'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CATERING_NOTE, CATERING_PACKAGES, CATERING_TRAYS } from '@/data/catering'
import type { CateringInquiry } from '@/lib/types'
import { loadJSON, saveJSON, STORAGE_KEYS } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/cn'

const STEPS = [
  { Icon: UtensilsCrossed, title: 'Pick a Package', copy: 'Warm-Up, Cookout, or Block Party — sized to your crowd.' },
  { Icon: FlameIcon, title: 'Choose Your Trays', copy: 'Mix and match sliders, tenders and chicken over fries.' },
  { Icon: Clock, title: 'Give Us 2 Hours', copy: 'Order ahead and we will have it hot, ready and on time.' },
]

const inputClass =
  'h-12 w-full rounded-xl border border-bone/12 bg-char px-4 font-sans text-bone placeholder:text-smoke/50 transition-colors focus:border-ember focus:outline-none'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

export function Catering() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    headcount: '',
    packageId: CATERING_PACKAGES[1].id,
    note: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 7 || !form.eventDate) {
      setError('Add your name, a phone number and an event date so we can plan it.')
      return
    }
    const inquiry: CateringInquiry = {
      id: `CI-${Date.now().toString(36).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      eventDate: form.eventDate,
      headcount: Number(form.headcount) || 0,
      packageId: form.packageId,
      note: form.note.trim() || undefined,
      status: 'new',
    }
    const existing = loadJSON<CateringInquiry[]>(STORAGE_KEYS.cateringInquiries, [])
    saveJSON(STORAGE_KEYS.cateringInquiries, [inquiry, ...existing])
    setSubmitted(true)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catering"
        title={
          <>
            FEED THE <span className="text-ember neon-ember">CREW</span>
          </>
        }
        intro="Mix-and-match trays of hand-breaded heat for parties, offices and block parties of every size."
        image={asset('assets/photos/header-dipping.jpg')}
      />

      {/* note */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <Reveal>
          <div className="flex items-start gap-3 rounded-2xl border border-flare/25 bg-ash p-5">
            <Clock size={20} className="mt-0.5 shrink-0 text-flare" />
            <p className="font-sans text-sm leading-relaxed text-smoke">{CATERING_NOTE}</p>
          </div>
        </Reveal>
      </section>

      {/* packages */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <Eyebrow>Choose your size</Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-6xl">
            THE <span className="text-ember">PACKAGES</span>
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {CATERING_PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.08}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-2xl border p-6',
                  pkg.popular
                    ? 'border-ember bg-ash shadow-glow-ember'
                    : 'border-bone/8 bg-ash',
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-bone">
                    {pkg.name}
                  </h3>
                  {pkg.popular && <Badge variant="ember">Most Booked</Badge>}
                </div>
                <p className="mt-3 font-display text-5xl leading-none text-flare">
                  {formatPrice(pkg.price)}
                </p>
                <p className="mt-2 font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
                  {pkg.feeds}
                </p>
                <p className="mt-3 font-sans text-sm leading-snug text-smoke">
                  {pkg.blurb}
                </p>
                <div className="mt-4 space-y-1.5 border-t border-bone/8 pt-4">
                  {[`${pkg.trays} trays of your choice`, `${pkg.sides} sides included`].map(
                    (line) => (
                      <p
                        key={line}
                        className="flex items-center gap-2 font-sans text-sm text-bone"
                      >
                        <Check size={15} className="text-ember" />
                        {line}
                      </p>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* trays */}
      <section className="border-y border-bone/10 bg-coal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow>Build your spread</Eyebrow>
            <h2 className="mt-3 font-display text-5xl leading-[0.9] text-bone sm:text-6xl">
              THE <span className="text-ember">TRAYS</span>
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {CATERING_TRAYS.map((tray, i) => (
              <Reveal key={tray.id} delay={i * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-bone/8 bg-ash">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={asset(tray.image)}
                      alt={tray.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ash/70 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3">
                      <Badge variant="dark">{tray.serves}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-lg font-extrabold text-bone">
                      {tray.name}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-snug text-smoke">
                      {tray.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
        </Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-bone/8 bg-ash p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ember/15 text-ember">
                  <step.Icon size={22} />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-snug text-smoke">
                    {step.copy}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* request form */}
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-bone/10 bg-ash">
            <div className="border-b border-bone/10 bg-coal px-6 py-5">
              <h2 className="font-display text-4xl text-bone">REQUEST CATERING</h2>
              <p className="mt-1 font-sans text-sm text-smoke">
                Send the details — we&apos;ll call you back to lock it in.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center px-6 py-14 text-center"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-heat-none/20">
                  <Check size={32} style={{ color: '#74B49A' }} />
                </span>
                <h3 className="mt-4 font-display text-3xl text-bone">Request received!</h3>
                <p className="mt-2 max-w-sm font-sans text-smoke">
                  Thanks, {form.name.split(' ')[0]} — our team will call{' '}
                  {form.phone} shortly to confirm your trays and timing.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      className={inputClass}
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="(260) 555-0142"
                      inputMode="tel"
                    />
                  </Field>
                  <Field label="Event date">
                    <input
                      type="date"
                      className={inputClass}
                      value={form.eventDate}
                      onChange={(e) => set('eventDate', e.target.value)}
                    />
                  </Field>
                  <Field label="Headcount">
                    <input
                      type="number"
                      min={1}
                      className={inputClass}
                      value={form.headcount}
                      onChange={(e) => set('headcount', e.target.value)}
                      placeholder="25"
                    />
                  </Field>
                </div>
                <Field label="Package">
                  <select
                    className={inputClass}
                    value={form.packageId}
                    onChange={(e) => set('packageId', e.target.value)}
                  >
                    {CATERING_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id} className="bg-char">
                        {pkg.name} — {formatPrice(pkg.price)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Anything else?">
                  <textarea
                    className={cn(inputClass, 'h-24 resize-none py-3')}
                    value={form.note}
                    onChange={(e) => set('note', e.target.value)}
                    placeholder="Heat preferences, drop-off details, dietary notes…"
                  />
                </Field>
                {error && <p className="font-sans text-sm text-ember">{error}</p>}
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Send Catering Request
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  )
}
