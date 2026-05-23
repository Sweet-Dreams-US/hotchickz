/**
 * The "factory defaults + admin diff" layer for the menu.
 *
 * The static `MENU` in `data/menu.ts` is the seed: that file ships with the
 * build and never mutates. Admin edits land in a sparse `MenuState` blob in
 * localStorage — overrides on default items, custom-added items, hidden
 * defaults, and a sold-out set. `mergeMenu()` projects all of that into the
 * effective `MenuItem[]` the storefront actually renders.
 *
 * Why this shape rather than persisting the full menu? Three reasons:
 *  - "Reset demo" is a one-line `removeKey` — defaults reappear instantly.
 *  - The diff is tiny in storage (a few hundred bytes vs. multiple kilobytes).
 *  - Future menu.ts edits (copy fixes, new defaults) flow through to live
 *    state without overwriting any of the admin's tweaks.
 */

import { useEffect, useMemo, useState } from 'react'
import {
  CATEGORIES,
  MENU,
  type CategoryKey,
  type MenuItem,
} from '@/data/menu'
import { loadJSON, saveJSON, STORAGE_KEYS } from '@/lib/store'

export interface MenuState {
  /** Partial patch applied on top of a default item, keyed by item id. */
  overrides: Record<string, Partial<MenuItem>>
  /** Brand-new items added by the admin (full shape, unique ids). */
  customItems: MenuItem[]
  /** Default item ids the admin removed (recoverable; not in `effective`). */
  hiddenIds: string[]
  /** Item ids marked unavailable — shown but un-orderable on the storefront. */
  soldOutIds: string[]
}

const EMPTY_STATE: MenuState = {
  overrides: {},
  customItems: [],
  hiddenIds: [],
  soldOutIds: [],
}

/** Storefront-visible item plus the soldOut flag the card consumes. */
export type EffectiveMenuItem = MenuItem & { soldOut?: boolean }

/** Admin-only extended view that also exposes hidden + isCustom metadata. */
export interface AdminMenuItem extends MenuItem {
  soldOut: boolean
  hidden: boolean
  isCustom: boolean
}

function loadMenuState(): MenuState {
  return loadJSON<MenuState>(STORAGE_KEYS.menu, EMPTY_STATE)
}

/** Merge factory defaults + admin diff into the storefront-visible list. */
export function mergeMenu(state: MenuState): EffectiveMenuItem[] {
  const hidden = new Set(state.hiddenIds)
  const soldOut = new Set(state.soldOutIds)
  const defaults: EffectiveMenuItem[] = MENU
    .filter((item) => !hidden.has(item.id))
    .map((item) => ({
      ...item,
      ...(state.overrides[item.id] ?? {}),
      soldOut: soldOut.has(item.id),
    }))
  const customs: EffectiveMenuItem[] = state.customItems.map((item) => ({
    ...item,
    soldOut: soldOut.has(item.id),
  }))
  return [...defaults, ...customs]
}

/**
 * Live menu state — admin edits flow through here, the storefront reads from
 * here, and changes in another tab propagate via the `storage` event. The
 * mutators handle the default-vs-custom dispatch (`updateItem` writes to
 * `overrides` for defaults, into `customItems` for customs).
 */
export function useMenuState() {
  const [state, setState] = useState<MenuState>(loadMenuState)

  // Cross-tab sync — admin in one tab, storefront in another stays in sync.
  // `storage` events only fire in OTHER tabs (never the writing tab), so the
  // same-tab path is already covered by the persist() setState below.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'hotchickz:' + STORAGE_KEYS.menu) {
        setState(loadMenuState())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function persist(next: MenuState) {
    setState(next)
    saveJSON(STORAGE_KEYS.menu, next)
  }

  const effective = useMemo<EffectiveMenuItem[]>(() => mergeMenu(state), [state])

  const adminItems = useMemo<AdminMenuItem[]>(() => {
    const list: AdminMenuItem[] = []
    for (const item of MENU) {
      list.push({
        ...item,
        ...(state.overrides[item.id] ?? {}),
        soldOut: state.soldOutIds.includes(item.id),
        hidden: state.hiddenIds.includes(item.id),
        isCustom: false,
      })
    }
    for (const item of state.customItems) {
      list.push({
        ...item,
        soldOut: state.soldOutIds.includes(item.id),
        hidden: false,
        isCustom: true,
      })
    }
    return list
  }, [state])

  function isDefault(id: string): boolean {
    return MENU.some((item) => item.id === id)
  }

  return {
    /** Raw state — rarely needed outside the hook. */
    state,
    /** Storefront-visible list (hidden defaults filtered out). */
    effective,
    /** Admin-visible list (everything, with hidden/isCustom metadata). */
    adminItems,
    /** `MENU_CATEGORIES`-compatible categories array, re-exported for convenience. */
    categories: CATEGORIES,

    /** Storefront helper: only visible items in the given category. */
    byCategory: (cat: CategoryKey) =>
      effective.filter((item) => item.category === cat),
    /** Admin helper: ALL items in the category, including hidden ones. */
    adminByCategory: (cat: CategoryKey) =>
      adminItems.filter((item) => item.category === cat),

    isDefault,

    /** Toggle the sold-out flag. Affects defaults and customs alike. */
    toggleSoldOut(id: string) {
      const next = state.soldOutIds.includes(id)
        ? state.soldOutIds.filter((x) => x !== id)
        : [...state.soldOutIds, id]
      persist({ ...state, soldOutIds: next })
    },

    /** Patch any item. Routes to overrides for defaults, customItems for customs. */
    updateItem(id: string, patch: Partial<MenuItem>) {
      if (isDefault(id)) {
        persist({
          ...state,
          overrides: {
            ...state.overrides,
            [id]: { ...(state.overrides[id] ?? {}), ...patch },
          },
        })
      } else {
        persist({
          ...state,
          customItems: state.customItems.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        })
      }
    },

    /** Add a brand-new custom item. Caller must supply a unique id. */
    addItem(item: MenuItem) {
      persist({ ...state, customItems: [...state.customItems, item] })
    },

    /**
     * "Remove" an item. Defaults are hidden (recoverable); customs are
     * truly removed from the diff. Also drops the item from the sold-out set
     * so resurrecting it later doesn't leave a stale flag.
     */
    removeItem(id: string) {
      const soldOutIds = state.soldOutIds.filter((x) => x !== id)
      if (isDefault(id)) {
        persist({
          ...state,
          soldOutIds,
          hiddenIds: state.hiddenIds.includes(id)
            ? state.hiddenIds
            : [...state.hiddenIds, id],
        })
      } else {
        persist({
          ...state,
          soldOutIds,
          customItems: state.customItems.filter((item) => item.id !== id),
        })
      }
    },

    /** Bring a hidden default back into the live menu, dropping its override. */
    restoreDefault(id: string) {
      const { [id]: _dropped, ...remainingOverrides } = state.overrides
      void _dropped
      persist({
        ...state,
        hiddenIds: state.hiddenIds.filter((x) => x !== id),
        overrides: remainingOverrides,
      })
    },

    /** Reset all admin menu changes — factory defaults return. */
    resetAll() {
      persist(EMPTY_STATE)
    },
  }
}
