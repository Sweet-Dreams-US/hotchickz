import { Link } from 'react-router-dom'
import { Flame } from '@/components/brand/Flame'
import { buttonStyles } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 pb-24 pt-32 text-center">
      <div className="flex flex-col items-center">
        <Flame size={72} />
        <h1 className="mt-4 font-display text-8xl text-bone">404</h1>
        <p className="mt-2 font-heading text-lg font-bold uppercase tracking-ember text-ember">
          This page got torched
        </p>
        <p className="mt-2 max-w-sm font-sans text-smoke">
          The page you&apos;re after isn&apos;t on the menu. Let&apos;s get you
          back to the good stuff.
        </p>
        <Link to="/" className={`${buttonStyles('primary', 'md')} mt-6`}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
