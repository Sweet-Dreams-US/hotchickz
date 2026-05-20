import type { OrderChannel, OrderStatus } from '@/lib/types'

interface StatusMeta {
  label: string
  color: string
  bg: string
}

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  new: { label: 'New', color: '#FFC230', bg: 'rgba(255,194,48,0.14)' },
  cooking: { label: 'Cooking', color: '#FF6A14', bg: 'rgba(255,106,20,0.14)' },
  ready: { label: 'Ready', color: '#74B49A', bg: 'rgba(116,180,154,0.16)' },
  completed: { label: 'Completed', color: '#A2938A', bg: 'rgba(162,147,138,0.14)' },
  cancelled: { label: 'Cancelled', color: '#E4231B', bg: 'rgba(228,35,27,0.14)' },
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[10px] font-extrabold uppercase tracking-ember"
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  )
}

const CHANNEL_LABEL: Record<OrderChannel, string> = {
  web: 'Website',
  'in-store': 'In-Store',
  doordash: 'DoorDash',
  phone: 'Phone',
}

export function ChannelBadge({ channel }: { channel: OrderChannel }) {
  return (
    <span className="rounded-md bg-char px-2 py-0.5 font-heading text-[9px] font-bold uppercase tracking-ember text-smoke">
      {CHANNEL_LABEL[channel]}
    </span>
  )
}

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  new: 'cooking',
  cooking: 'ready',
  ready: 'completed',
}
const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  new: 'Start Cooking',
  cooking: 'Mark Ready',
  ready: 'Complete Order',
}

export function nextStatus(status: OrderStatus): OrderStatus | undefined {
  return NEXT[status]
}

export function nextStatusLabel(status: OrderStatus): string | undefined {
  return NEXT_LABEL[status]
}
