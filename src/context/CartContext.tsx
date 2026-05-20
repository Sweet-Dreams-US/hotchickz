import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { MenuItem } from '@/data/menu'
import { DEFAULT_HEAT, type HeatKey } from '@/data/heatLevels'
import type { CartLine, CartOptionSelection } from '@/lib/types'
import { round2 } from '@/lib/format'
import { loadJSON, saveJSON, STORAGE_KEYS } from '@/lib/store'

/* ------------------------------------------------------------------ */
/* Line identity                                                       */
/* ------------------------------------------------------------------ */

function makeLineId(
  itemId: string,
  heat: HeatKey | undefined,
  options: CartOptionSelection[],
): string {
  const opt = options
    .map((o) => `${o.groupId}:${o.choiceId}`)
    .sort()
    .join('|')
  return `${itemId}#${heat ?? '-'}#${opt}`
}

/* ------------------------------------------------------------------ */
/* State + reducer                                                     */
/* ------------------------------------------------------------------ */

interface JustAdded {
  name: string
  lineId: string
  at: number
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
  justAdded: JustAdded | null
}

type CartAction =
  | { type: 'add'; line: CartLine }
  | { type: 'setQty'; lineId: string; quantity: number }
  | { type: 'remove'; lineId: string }
  | { type: 'setHeat'; lineId: string; heat: HeatKey }
  | { type: 'clear' }
  | { type: 'open' }
  | { type: 'close' }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) => l.lineId === action.line.lineId)
      const lines = existing
        ? state.lines.map((l) =>
            l.lineId === action.line.lineId
              ? { ...l, quantity: l.quantity + action.line.quantity }
              : l,
          )
        : [...state.lines, action.line]
      return {
        ...state,
        lines,
        justAdded: { name: action.line.name, lineId: action.line.lineId, at: Date.now() },
      }
    }
    case 'setQty': {
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.lineId !== action.lineId) }
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.lineId === action.lineId ? { ...l, quantity: action.quantity } : l,
        ),
      }
    }
    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.lineId !== action.lineId) }
    case 'setHeat': {
      const target = state.lines.find((l) => l.lineId === action.lineId)
      if (!target || target.heat === action.heat) return state
      const newLineId = makeLineId(target.itemId, action.heat, target.options)
      const collision = state.lines.some((l) => l.lineId === newLineId)
      if (collision) {
        // Merge the re-heated line into the existing same-config line.
        return {
          ...state,
          lines: state.lines
            .filter((l) => l.lineId !== action.lineId)
            .map((l) =>
              l.lineId === newLineId
                ? { ...l, quantity: l.quantity + target.quantity }
                : l,
            ),
        }
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.lineId === action.lineId
            ? { ...l, heat: action.heat, lineId: newLineId }
            : l,
        ),
      }
    }
    case 'clear':
      return { ...state, lines: [], justAdded: null }
    case 'open':
      return { ...state, isOpen: true }
    case 'close':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

interface AddOptions {
  heat?: HeatKey
  /** Map of optionGroup id -> chosen choice id. Missing groups default to choice 0. */
  selections?: Record<string, string>
  quantity?: number
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  justAdded: JustAdded | null
  addItem: (item: MenuItem, options?: AddOptions) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  setHeat: (lineId: string, heat: HeatKey) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    lines: loadJSON<CartLine[]>(STORAGE_KEYS.cart, []),
    isOpen: false,
    justAdded: null,
  }))

  // localStorage IS the database — persist every cart mutation.
  useEffect(() => {
    saveJSON(STORAGE_KEYS.cart, state.lines)
  }, [state.lines])

  const addItem = useCallback((item: MenuItem, opts: AddOptions = {}) => {
    const selections = opts.selections ?? {}
    const heat = item.heatable ? (opts.heat ?? DEFAULT_HEAT) : undefined
    const quantity = Math.max(1, opts.quantity ?? 1)

    const optionSelections: CartOptionSelection[] = []
    let delta = 0
    for (const group of item.options ?? []) {
      const choiceId = selections[group.id] ?? group.choices[0]?.id
      const choice =
        group.choices.find((c) => c.id === choiceId) ?? group.choices[0]
      if (!choice) continue
      delta += choice.priceDelta ?? 0
      optionSelections.push({
        groupId: group.id,
        groupLabel: group.label,
        choiceId: choice.id,
        choiceLabel: choice.label,
      })
    }

    const line: CartLine = {
      lineId: makeLineId(item.id, heat, optionSelections),
      itemId: item.id,
      name: item.name,
      image: item.image,
      unitPrice: round2(item.price + delta),
      quantity,
      heat,
      options: optionSelections,
    }
    dispatch({ type: 'add', line })
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((sum, l) => sum + l.quantity, 0)
    const subtotal = round2(
      state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    )
    return {
      lines: state.lines,
      count,
      subtotal,
      isOpen: state.isOpen,
      justAdded: state.justAdded,
      addItem,
      setQuantity: (lineId, quantity) => dispatch({ type: 'setQty', lineId, quantity }),
      removeLine: (lineId) => dispatch({ type: 'remove', lineId }),
      setHeat: (lineId, heat) => dispatch({ type: 'setHeat', lineId, heat }),
      clear: () => dispatch({ type: 'clear' }),
      openCart: () => dispatch({ type: 'open' }),
      closeCart: () => dispatch({ type: 'close' }),
    }
  }, [state, addItem])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
