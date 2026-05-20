import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'flare' | 'ghost' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center overflow-hidden font-heading font-extrabold uppercase tracking-ember transition-[transform,box-shadow,background-color,border-color] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ember text-bone shadow-glow-ember hover:shadow-[0_0_44px_-4px_rgba(228,35,27,0.85)]',
  flare:
    'bg-flare text-char shadow-glow-flare hover:shadow-[0_0_44px_-4px_rgba(255,194,48,0.85)]',
  ghost:
    'border border-ember/45 bg-transparent text-bone hover:border-ember hover:bg-ember/10',
  dark: 'bg-ash text-bone shadow-inset-ring hover:bg-soot',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-3.5 text-[11px] gap-1.5',
  md: 'h-12 rounded-xl px-6 text-sm gap-2',
  lg: 'h-14 rounded-2xl px-8 text-base gap-2.5',
}

/** Shared class string — lets <Link> elements wear the same skin. */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
): string {
  return cn(base, variants[variant], sizes[size])
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Diagonal light sweep on hover. */
  sheen?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', sheen = true, className, children, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cn(buttonStyles(variant, size), className)} {...rest}>
      {sheen && (
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 -translate-x-[220%] bg-white/25 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[440%]" />
      )}
      <span className="relative z-10 inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </button>
  )
})
