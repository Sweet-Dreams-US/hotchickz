import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Flame,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { MenuItemEditor } from '@/components/admin/MenuItemEditor'
import { Badge } from '@/components/ui/Badge'
import { FoodImage } from '@/components/site/FoodImage'
import { CATEGORIES, type CategoryKey, type MenuItem } from '@/data/menu'
import { type AdminMenuItem, useMenuState } from '@/lib/menuStore'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/cn'

function SoldOutToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      title={value ? 'Mark back in stock' : 'Mark sold out'}
      className={cn(
        'shrink-0 rounded-lg px-3 py-1.5 font-heading text-[10px] font-extrabold uppercase tracking-ember transition-colors',
        value
          ? 'bg-ember text-bone hover:bg-ember-bright'
          : 'bg-char text-smoke hover:bg-ash hover:text-bone',
      )}
    >
      {value ? '● Sold Out' : '○ In Stock'}
    </button>
  )
}

function IconButton({
  title,
  onClick,
  tone = 'default',
  children,
}: {
  title: string
  onClick: () => void
  tone?: 'default' | 'danger'
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        'grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-char text-smoke transition-colors',
        tone === 'danger'
          ? 'hover:bg-ember/10 hover:text-ember'
          : 'hover:bg-ash hover:text-bone',
      )}
    >
      {children}
    </button>
  )
}

interface ItemRowProps {
  item: AdminMenuItem
  onEdit: () => void
  onToggleSoldOut: () => void
  onRemove: () => void
  onRestore: () => void
}

function ItemRow({
  item,
  onEdit,
  onToggleSoldOut,
  onRemove,
  onRestore,
}: ItemRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-bone/8 bg-ash p-3 sm:gap-4 sm:p-4',
        item.hidden && 'opacity-55',
      )}
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-char sm:h-[68px] sm:w-[88px]">
        <FoodImage
          image={item.image}
          alt={item.name}
          className="h-full w-full"
        />
        {item.soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-char/75">
            <span className="font-heading text-[9px] font-extrabold uppercase tracking-ember text-bone">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate font-heading text-sm font-extrabold text-bone">
            {item.name}
          </p>
          {item.isCustom && <Badge variant="flare">Custom</Badge>}
          {item.hidden && <Badge variant="dark">Hidden</Badge>}
          {item.featured && !item.hidden && <Badge variant="dark">Featured</Badge>}
        </div>
        <p className="mt-1 truncate font-sans text-xs leading-snug text-smoke">
          <span className="font-display text-base text-flare">
            {formatPrice(item.price)}
          </span>
          {item.heatable && (
            <span className="ml-2 inline-flex items-center gap-1 align-middle text-ember">
              <Flame size={11} />
              Heatable
            </span>
          )}
          {item.badge && (
            <span className="ml-2 text-bone/70">· {item.badge}</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <SoldOutToggle value={item.soldOut} onChange={onToggleSoldOut} />
        <IconButton title="Edit item" onClick={onEdit}>
          <Pencil size={14} />
        </IconButton>
        {item.hidden ? (
          <IconButton title="Restore default" onClick={onRestore}>
            <RotateCcw size={14} />
          </IconButton>
        ) : (
          <IconButton
            title={item.isCustom ? 'Delete item' : 'Hide from menu'}
            tone="danger"
            onClick={onRemove}
          >
            <Trash2 size={14} />
          </IconButton>
        )}
      </div>
    </motion.div>
  )
}

export function MenuManagement() {
  const menu = useMenuState()
  const [activeCat, setActiveCat] = useState<CategoryKey>('meals')
  const [editing, setEditing] = useState<AdminMenuItem | null>(null)
  const [creating, setCreating] = useState(false)

  const items = useMemo(
    () => menu.adminByCategory(activeCat),
    // Recompute whenever the underlying state changes, not just the function ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menu.state, activeCat],
  )

  const liveCount = menu.effective.length
  const soldOutCount = menu.effective.filter((i) => i.soldOut).length
  const customCount = menu.state.customItems.length
  const hiddenCount = menu.state.hiddenIds.length

  function handleRemove(item: AdminMenuItem) {
    const noun = item.isCustom ? 'Delete' : 'Hide'
    if (
      window.confirm(
        `${noun} "${item.name}"?\n\n${item.isCustom ? 'This custom item will be permanently removed.' : 'Defaults stay restorable from this screen.'}`,
      )
    ) {
      menu.removeItem(item.id)
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Menu"
        subtitle={`${liveCount} live · ${soldOutCount} sold out · ${customCount} custom · ${hiddenCount} hidden`}
        actions={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ember px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
          >
            <Plus size={14} />
            New Item
          </button>
        }
      />

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const count = menu.adminByCategory(cat.key).length
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCat(cat.key)}
              className={cn(
                'shrink-0 rounded-lg px-3.5 py-2 font-heading text-xs font-extrabold uppercase tracking-ember transition-colors',
                activeCat === cat.key
                  ? 'bg-ember text-bone'
                  : 'bg-ash text-smoke hover:text-bone',
              )}
            >
              {cat.name}
              <span className="ml-1.5 text-[10px] opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bone/12 py-16 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-ember text-smoke">
            Nothing in this category yet
          </p>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-ember px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-ember text-bone transition-transform active:scale-95"
          >
            <Plus size={14} />
            Add the first one
          </button>
        </div>
      ) : (
        <motion.div layout className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onEdit={() => setEditing(item)}
                onToggleSoldOut={() => menu.toggleSoldOut(item.id)}
                onRemove={() => handleRemove(item)}
                onRestore={() => menu.restoreDefault(item.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {(editing || creating) && (
          <MenuItemEditor
            initial={editing}
            defaultCategory={activeCat}
            onSubmit={(patch) => {
              if (creating) {
                const next: MenuItem = {
                  id: `c-${Date.now().toString(36)}`,
                  name: patch.name ?? 'New Item',
                  description: patch.description ?? '',
                  price: patch.price ?? 0,
                  category: patch.category ?? activeCat,
                  heatable: patch.heatable ?? false,
                  image: patch.image ?? '',
                  badge: patch.badge,
                  featured: patch.featured,
                }
                menu.addItem(next)
              } else if (editing) {
                menu.updateItem(editing.id, patch)
              }
              setEditing(null)
              setCreating(false)
            }}
            onCancel={() => {
              setEditing(null)
              setCreating(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
