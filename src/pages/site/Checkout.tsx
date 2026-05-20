import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Store, Truck } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { HEAT_BY_KEY } from '@/data/heatLevels'
import { BUSINESS } from '@/data/business'
import type { FulfillmentType, Order } from '@/lib/types'
import { nextOrderId, placeOrder, TAX_RATE } from '@/lib/orders'
import { formatPrice, round2 } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Flame } from '@/components/brand/Flame'

const DELIVERY_FEE = 2.99

const PICKUP_TIMES = [
  'ASAP — 15-20 min',
  'In 30 minutes',
  'In 45 minutes',
  'In 1 hour',
]

interface FormState {
  fulfillment: FulfillmentType
  name: string
  phone: string
  email: string
  address: string
  pickupTime: string
  note: string
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 font-sans text-xs text-ember">{error}</p>}
    </label>
  )
}

const inputClass =
  'h-12 w-full rounded-xl border border-bone/12 bg-ash px-4 font-sans text-bone placeholder:text-smoke/50 transition-colors focus:border-ember focus:outline-none'

export function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    fulfillment: 'pickup',
    name: '',
    phone: '',
    email: '',
    address: '',
    pickupTime: PICKUP_TIMES[0],
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [placing, setPlacing] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const deliveryFee = form.fulfillment === 'delivery' ? DELIVERY_FEE : 0
  const tax = round2(subtotal * TAX_RATE)
  const total = round2(subtotal + tax + deliveryFee)

  /* empty bag guard */
  if (lines.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center px-6 pb-24 pt-32 text-center">
        <div className="flex flex-col items-center">
          <Flame size={64} />
          <h1 className="mt-4 font-display text-5xl text-bone">Nothing to check out</h1>
          <p className="mt-2 font-sans text-smoke">Your bag is empty — go grab some heat.</p>
          <Link to="/menu" className="mt-6">
            <Button variant="primary">
              See the Menu <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'We need a name for the order.'
    if (form.phone.replace(/\D/g, '').length < 7)
      next.phone = 'Add a phone number we can reach.'
    if (form.fulfillment === 'delivery' && !form.address.trim())
      next.address = 'Where are we delivering?'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handlePlaceOrder() {
    if (!validate() || placing) return
    setPlacing(true)
    const order: Order = {
      id: nextOrderId(),
      placedAt: new Date().toISOString(),
      status: 'new',
      fulfillment: form.fulfillment,
      channel: 'web',
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      },
      lines: lines.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        heat: l.heat,
        optionSummary: l.options.map((o) => o.choiceLabel).join(', ') || undefined,
      })),
      subtotal,
      tax: round2(tax + deliveryFee),
      total,
      note: form.note.trim() || undefined,
    }
    // Brief beat so placing the order feels deliberate.
    window.setTimeout(() => {
      placeOrder(order)
      clear()
      navigate(`/order/${order.id}`)
    }, 700)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="font-heading text-xs font-extrabold uppercase tracking-ember text-ember">
        Almost there
      </p>
      <h1 className="mt-2 font-display text-6xl leading-[0.85] text-bone sm:text-7xl">
        CHECK<span className="text-ember">OUT</span>
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* ---- form ---- */}
        <div className="space-y-7">
          {/* fulfillment */}
          <section>
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
              How are you getting it?
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  { key: 'pickup', label: 'Pickup', Icon: Store, note: 'Free · Fastest' },
                  { key: 'delivery', label: 'Delivery', Icon: Truck, note: `+${formatPrice(DELIVERY_FEE)}` },
                ] as const
              ).map(({ key, label, Icon, note }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('fulfillment', key)}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors',
                    form.fulfillment === key
                      ? 'border-ember bg-ember/10'
                      : 'border-bone/12 bg-ash hover:border-bone/30',
                  )}
                >
                  <Icon size={20} className="text-ember" />
                  <span className="font-heading text-base font-extrabold text-bone">
                    {label}
                  </span>
                  <span className="font-sans text-xs text-smoke">{note}</span>
                </button>
              ))}
            </div>
          </section>

          {/* contact */}
          <section className="space-y-4">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
              Your details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Jordan A."
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="(260) 555-0142"
                  inputMode="tel"
                />
              </Field>
            </div>
            <Field label="Email (optional)">
              <input
                className={inputClass}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@email.com"
                inputMode="email"
              />
            </Field>
            {form.fulfillment === 'delivery' ? (
              <Field label="Delivery address" error={errors.address}>
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Street, city, ZIP"
                />
              </Field>
            ) : (
              <Field label="Pickup time">
                <select
                  className={inputClass}
                  value={form.pickupTime}
                  onChange={(e) => set('pickupTime', e.target.value)}
                >
                  {PICKUP_TIMES.map((t) => (
                    <option key={t} value={t} className="bg-ash">
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Order notes (optional)">
              <textarea
                className={cn(inputClass, 'h-24 resize-none py-3')}
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
                placeholder="Allergies, extra sauce, ring twice…"
              />
            </Field>
          </section>

          {/* payment note */}
          <section className="rounded-xl border border-bone/10 bg-ash p-4">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
              Payment
            </h2>
            <p className="mt-1.5 font-sans text-sm text-smoke">
              Order ahead now, pay when you{' '}
              {form.fulfillment === 'delivery' ? 'receive it' : 'grab it'} —
              cash or card. We&apos;ll start cooking the moment you place this.
            </p>
          </section>
        </div>

        {/* ---- order ticket ---- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-bone/10 bg-coal">
            <div className="border-b border-dashed border-bone/15 bg-ash px-5 py-4">
              <p className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-ember">
                Hot Chickz · Order Ticket
              </p>
              <h2 className="font-display text-2xl text-bone">Your Order</h2>
            </div>

            <ul className="space-y-3 px-5 py-4">
              {lines.map((line) => (
                <li key={line.lineId} className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-bone">
                      <span className="text-flare">{line.quantity}×</span>{' '}
                      {line.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 font-sans text-xs text-smoke">
                      {line.heat && (
                        <span
                          className="inline-flex items-center gap-1"
                          style={{ color: HEAT_BY_KEY[line.heat].color }}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: HEAT_BY_KEY[line.heat].color }}
                          />
                          {HEAT_BY_KEY[line.heat].name}
                        </span>
                      )}
                      {line.options.map((o) => (
                        <span key={o.groupId}>{o.choiceLabel}</span>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 font-heading text-sm font-bold text-bone">
                    {formatPrice(line.unitPrice * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-1.5 border-t border-dashed border-bone/15 px-5 py-4 font-sans text-sm">
              <div className="flex justify-between text-smoke">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-smoke">
                  <span>Delivery</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-smoke">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="font-heading text-sm font-extrabold uppercase tracking-ember text-bone">
                  Total
                </span>
                <span className="font-display text-3xl text-flare">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="px-5 pb-5">
              <Button
                variant="primary"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full"
              >
                <ShoppingBag size={17} />
                {placing ? 'Placing Order…' : 'Place Order'}
              </Button>
              <p className="mt-2.5 text-center font-sans text-xs text-smoke">
                {form.fulfillment === 'pickup'
                  ? `Pickup at ${BUSINESS.address.street}`
                  : 'Delivered to your door'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
