import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { CATEGORIES, type CategoryKey, type MenuItem } from '@/data/menu'
import { cn } from '@/lib/cn'

interface MenuItemEditorProps {
  /** Existing item to edit, or null when creating. */
  initial: MenuItem | null
  /** Category to preselect when creating. */
  defaultCategory: CategoryKey
  /**
   * Save callback. Receives a Partial<MenuItem> — the parent decides whether
   * to create (generate id) or update (preserve id).
   */
  onSubmit: (patch: Partial<MenuItem>) => void
  onCancel: () => void
}

const inputBase =
  'h-11 w-full rounded-xl border border-bone/12 bg-char px-3.5 font-sans text-sm text-bone placeholder:text-smoke/50 transition-colors focus:border-ember focus:outline-none'

function Field({
  label,
  hint,
  children,
  span = 1,
}: {
  label: string
  hint?: string
  children: ReactNode
  span?: 1 | 2
}) {
  return (
    <label className={cn('block', span === 2 && 'sm:col-span-2')}>
      <span className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 font-sans text-[11px] text-smoke/70">{hint}</p>}
    </label>
  )
}

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 transition-colors',
        value
          ? 'border-ember bg-ember/10 text-bone'
          : 'border-bone/12 bg-char text-smoke hover:text-bone',
      )}
    >
      <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember">
        {label}
      </span>
      <span
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          value ? 'bg-ember' : 'bg-bone/15',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-bone transition-transform',
            value ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  )
}

/**
 * The menu item editor modal. Used for both creating and editing — the only
 * difference is the title and whether `initial` is null.
 *
 * The `options` field is intentionally NOT editable here; the existing
 * choices are preserved as-is (the editor just shows a read-only summary).
 */
export function MenuItemEditor({
  initial,
  defaultCategory,
  onSubmit,
  onCancel,
}: MenuItemEditorProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(initial?.price.toString() ?? '')
  const [category, setCategory] = useState<CategoryKey>(
    initial?.category ?? defaultCategory,
  )
  const [heatable, setHeatable] = useState(initial?.heatable ?? false)
  const [image, setImage] = useState(initial?.image ?? '')
  const [badge, setBadge] = useState(initial?.badge ?? '')
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [error, setError] = useState('')

  // Escape closes — small QOL.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    const parsedPrice = Number(price)
    if (!trimmedName) {
      setError('Give the item a name.')
      return
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a number, 0 or higher.')
      return
    }
    if (!image.trim()) {
      setError('Drop an image in public/assets/menu/ and enter its filename.')
      return
    }
    onSubmit({
      name: trimmedName,
      description: description.trim(),
      price: parsedPrice,
      category,
      heatable,
      image: image.trim(),
      badge: badge.trim() || undefined,
      featured: featured || undefined,
    })
  }

  const isCreating = initial === null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 grid place-items-center bg-char/85 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-bone/10 bg-coal shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b border-bone/10 px-6 py-4">
            <div>
              <p className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
                {isCreating ? 'New menu item' : 'Edit menu item'}
              </p>
              <h2 className="mt-0.5 font-display text-3xl leading-none text-bone">
                {isCreating ? 'CREATE' : name || initial?.name || 'EDIT'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-xl bg-ash text-smoke transition-colors hover:bg-char hover:text-bone"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" span={2}>
                <input
                  className={inputBase}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Double Slider Meal"
                  autoFocus
                />
              </Field>
              <Field label="Description" span={2}>
                <textarea
                  className={cn(inputBase, 'h-24 resize-none py-2.5 leading-snug')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Two stacked sliders — double the dill, double the crunch — with fries and sauce."
                />
              </Field>
              <Field label="Price" hint="Dollars. Example: 9.99">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-base text-smoke">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={cn(inputBase, 'pl-7')}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="9.99"
                  />
                </div>
              </Field>
              <Field label="Category">
                <select
                  className={inputBase}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryKey)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key} className="bg-char">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Image filename"
                hint="Drop the file in public/assets/menu/ and enter the filename only (e.g. double-slider-meal.jpg)."
                span={2}
              >
                <input
                  className={inputBase}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="double-slider-meal.jpg"
                />
              </Field>
              <Field label="Badge" hint="Optional. E.g. 'Crowd Favorite'.">
                <input
                  className={inputBase}
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="(none)"
                />
              </Field>
              <Field label="Flags">
                <div className="space-y-2">
                  <Toggle
                    value={heatable}
                    onChange={setHeatable}
                    label="Heatable"
                  />
                  <Toggle
                    value={featured}
                    onChange={setFeatured}
                    label="Featured on Home"
                  />
                </div>
              </Field>
            </div>

            {initial?.options && initial.options.length > 0 && (
              <div className="rounded-xl border border-bone/10 bg-ash p-3.5">
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
                  Options preserved
                </p>
                <p className="mt-1 font-sans text-xs leading-snug text-smoke">
                  {initial.options
                    .map(
                      (g) =>
                        `${g.label} (${g.choices.map((c) => c.label).join(' / ')})`,
                    )
                    .join(' · ')}
                </p>
                <p className="mt-1.5 font-sans text-[11px] text-smoke/70">
                  Editing option groups isn&apos;t in the admin yet — the
                  existing choices stay intact.
                </p>
              </div>
            )}

            {error && (
              <p className="font-sans text-sm text-ember">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2.5 border-t border-bone/10 bg-coal px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl bg-ash px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-ember text-smoke transition-colors hover:text-bone"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-ember px-5 py-2.5 font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
            >
              {isCreating ? 'Create Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
