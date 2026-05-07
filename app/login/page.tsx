'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'guest' | 'staff'>('guest')

  // Guest state
  const [guestCode, setGuestCode] = useState('')
  const [guestError, setGuestError] = useState('')
  const [guestLoading, setGuestLoading] = useState(false)

  // Staff state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [staffError, setStaffError] = useState('')
  const [staffLoading, setStaffLoading] = useState(false)

  async function handleGuestLogin(e: React.FormEvent) {
    e.preventDefault()
    setGuestLoading(true)
    setGuestError('')

    const code = guestCode.trim().toUpperCase()
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('stays')
      .select('*')
      .eq('code', code)
      .lte('check_in', today)
      .gte('check_out', today)
      .single()

    if (error || !data) {
      setGuestError('Code not found or stay has expired. Please check your code.')
      setGuestLoading(false)
      return
    }

    // Store stay session in sessionStorage
    sessionStorage.setItem('alpineflow_stay', JSON.stringify(data))
    router.push('/guest')
  }

  async function handleStaffLogin(e: React.FormEvent) {
    e.preventDefault()
    setStaffLoading(true)
    setStaffError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setStaffError('Invalid email or password.')
      setStaffLoading(false)
      return
    }

    router.push('/hotel')
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[var(--color-night)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(151,174,187,0.12),transparent_55%),radial-gradient(ellipse_at_50%_80%,rgba(26,46,40,0.65),rgba(15,28,24,0.98))]" />
      <div className="relative w-full max-w-md rounded-3xl border border-[rgba(231,223,208,0.14)] bg-[rgba(15,28,24,0.62)] p-8 md:p-10 backdrop-blur-xl">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif italic text-4xl text-[var(--color-linen)] tracking-tight">
            AlpineFlow
          </h1>
          <p className="text-[rgba(231,223,208,0.55)] text-sm mt-2">
            Sustainable Alpine Hospitality
          </p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-full bg-[rgba(231,223,208,0.08)] p-1 mb-8 border border-[rgba(231,223,208,0.12)]">
          <button
            onClick={() => setMode('guest')}
            className={`flex-1 py-2 rounded-full text-xs tracking-[0.08em] uppercase transition-all duration-[var(--duration-cinematic)] ease-[var(--ease-cinematic)] ${
              mode === 'guest'
                ? 'bg-[rgba(231,223,208,0.2)] text-[var(--color-linen)]'
                : 'text-[rgba(231,223,208,0.45)] hover:text-[rgba(231,223,208,0.72)]'
            }`}
          >
            Guest
          </button>
          <button
            onClick={() => setMode('staff')}
            className={`flex-1 py-2 rounded-full text-xs tracking-[0.08em] uppercase transition-all duration-[var(--duration-cinematic)] ease-[var(--ease-cinematic)] ${
              mode === 'staff'
                ? 'bg-[rgba(231,223,208,0.2)] text-[var(--color-linen)]'
                : 'text-[rgba(231,223,208,0.45)] hover:text-[rgba(231,223,208,0.72)]'
            }`}
          >
            Hotel Staff
          </button>
        </div>

        {/* Guest Login */}
        {mode === 'guest' && (
          <form onSubmit={handleGuestLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-[rgba(231,223,208,0.72)] mb-3 text-center">
                Your stay code
              </label>
              <input
                type="text"
                value={guestCode}
                onChange={e => setGuestCode(e.target.value)}
                placeholder="ALPIN-XXXX"
                className="w-full px-6 py-5 rounded-2xl border border-[rgba(151,174,187,0.34)] bg-[rgba(15,28,24,0.8)] text-[var(--color-linen)] placeholder:text-[rgba(231,223,208,0.45)] focus:outline-none focus:ring-2 focus:ring-[var(--color-glacier)] text-center tracking-[0.22em] text-2xl font-mono uppercase"
                required
              />
              <p className="text-xs text-[rgba(231,223,208,0.45)] mt-3 text-center">
                You received this code from your hotel at check-in.
              </p>
            </div>
            {guestError && (
              <p className="text-sm text-red-500 text-center">{guestError}</p>
            )}
            <button
              type="submit"
              disabled={guestLoading}
              className="w-full py-3.5 rounded-xl bg-[var(--color-moss)] text-[var(--color-linen)] font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {guestLoading ? 'Checking...' : 'Enter my stay →'}
            </button>
          </form>
        )}

        {/* Staff Login */}
        {mode === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-[rgba(231,223,208,0.72)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="staff@hotel.com"
                className="w-full px-4 py-3 rounded-xl border border-[rgba(231,223,208,0.24)] bg-[rgba(15,28,24,0.72)] text-[var(--color-linen)] placeholder:text-[rgba(231,223,208,0.45)] focus:outline-none focus:ring-2 focus:ring-[var(--color-glacier)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[rgba(231,223,208,0.72)] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[rgba(231,223,208,0.24)] bg-[rgba(15,28,24,0.72)] text-[var(--color-linen)] placeholder:text-[rgba(231,223,208,0.45)] focus:outline-none focus:ring-2 focus:ring-[var(--color-glacier)]"
                required
              />
            </div>
            {staffError && (
              <p className="text-sm text-red-500 text-center">{staffError}</p>
            )}
            <button
              type="submit"
              disabled={staffLoading}
              className="w-full py-3 rounded-xl bg-[var(--color-stone-800)] text-[var(--color-linen)] font-medium text-sm hover:bg-[var(--color-stone-700)] transition-colors disabled:opacity-50"
            >
              {staffLoading ? 'Signing in...' : 'Sign in to dashboard →'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
