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
    <main className="min-h-screen bg-[var(--color-linen)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-[var(--color-stone-900)] tracking-tight">
            AlpineFlow
          </h1>
          <p className="text-[var(--color-stone-500)] text-sm mt-1">
            Sustainable Alpine Hospitality
          </p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-xl bg-[var(--color-stone-100)] p-1 mb-8">
          <button
            onClick={() => setMode('guest')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'guest'
                ? 'bg-white text-[var(--color-stone-900)] shadow-sm'
                : 'text-[var(--color-stone-500)] hover:text-[var(--color-stone-700)]'
            }`}
          >
            Guest
          </button>
          <button
            onClick={() => setMode('staff')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'staff'
                ? 'bg-white text-[var(--color-stone-900)] shadow-sm'
                : 'text-[var(--color-stone-500)] hover:text-[var(--color-stone-700)]'
            }`}
          >
            Hotel Staff
          </button>
        </div>

        {/* Guest Login */}
        {mode === 'guest' && (
          <form onSubmit={handleGuestLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--color-stone-600)] mb-2">
                Your stay code
              </label>
              <input
                type="text"
                value={guestCode}
                onChange={e => setGuestCode(e.target.value)}
                placeholder="e.g. ALPIN-2847"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-stone-200)] bg-white text-[var(--color-stone-900)] placeholder:text-[var(--color-stone-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-moss)] text-center tracking-widest text-lg font-mono uppercase"
                required
              />
              <p className="text-xs text-[var(--color-stone-400)] mt-2 text-center">
                You received this code from your hotel at check-in.
              </p>
            </div>
            {guestError && (
              <p className="text-sm text-red-500 text-center">{guestError}</p>
            )}
            <button
              type="submit"
              disabled={guestLoading}
              className="w-full py-3 rounded-xl bg-[var(--color-moss)] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {guestLoading ? 'Checking...' : 'Enter my stay →'}
            </button>
          </form>
        )}

        {/* Staff Login */}
        {mode === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--color-stone-600)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="staff@hotel.com"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-stone-200)] bg-white text-[var(--color-stone-900)] placeholder:text-[var(--color-stone-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-moss)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-stone-600)] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-stone-200)] bg-white text-[var(--color-stone-900)] placeholder:text-[var(--color-stone-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-moss)]"
                required
              />
            </div>
            {staffError && (
              <p className="text-sm text-red-500 text-center">{staffError}</p>
            )}
            <button
              type="submit"
              disabled={staffLoading}
              className="w-full py-3 rounded-xl bg-[var(--color-stone-900)] text-white font-medium text-sm hover:bg-[var(--color-stone-700)] transition-colors disabled:opacity-50"
            >
              {staffLoading ? 'Signing in...' : 'Sign in to dashboard →'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
