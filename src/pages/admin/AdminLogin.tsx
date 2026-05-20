import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { SmokeWisps } from '@/components/brand/SmokeWisps'
import { Button } from '@/components/ui/Button'

interface AdminLoginProps {
  onSignIn: () => void
}

const inputClass =
  'h-12 w-full rounded-xl border border-bone/12 bg-char px-4 font-sans text-bone placeholder:text-smoke/50 transition-colors focus:border-ember focus:outline-none'

export function AdminLogin({ onSignIn }: AdminLoginProps) {
  // Pre-filled demo credentials — this is a showcase build, not a real auth wall.
  const [user, setUser] = useState('manager')
  const [pass, setPass] = useState('hotchickz')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (user.trim() && pass.trim()) onSignIn()
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-char px-4">
      <div className="pointer-events-none absolute inset-0 bg-flame-radial" />
      <SmokeWisps count={5} />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Logo size={64} showWordmark={false} />
          <p className="mt-4 font-heading text-xs font-extrabold uppercase tracking-ember text-ember">
            Hot Chickz · Back of House
          </p>
          <h1 className="mt-1 font-display text-5xl text-bone">THE PASS</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4 rounded-2xl border border-bone/10 bg-ash p-6"
        >
          <label className="block">
            <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
              Username
            </span>
            <input
              className={`${inputClass} mt-1.5`}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke">
              Password
            </span>
            <input
              type="password"
              className={`${inputClass} mt-1.5`}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            <Lock size={16} />
            Sign In
            <ArrowRight size={16} />
          </Button>

          <p className="text-center font-sans text-xs text-smoke">
            Demo access — credentials are pre-filled for you.
          </p>
        </form>

        <Link
          to="/"
          className="mt-5 flex items-center justify-center gap-2 font-heading text-[11px] font-extrabold uppercase tracking-ember text-smoke transition-colors hover:text-bone"
        >
          <ArrowLeft size={13} />
          Back to Storefront
        </Link>
      </div>
    </div>
  )
}
