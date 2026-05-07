'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type StayMode = {
  id: 'eco' | 'quiet' | 'wellness' | 'explorer' | 'deep-rest' | 'alpine-reset'
  name: string
  line: string
  route: string
  image: string
}

const STAY_MODES: StayMode[] = [
  {
    id: 'eco',
    name: 'Eco Stay',
    line: 'Wake with mountain air and leave only soft traces.',
    route: '/guest/sustainability',
    image:
      "linear-gradient(180deg, rgba(10,16,14,0.18) 0%, rgba(10,16,14,0.72) 100%), url('/images/modes/eco-stay.svg')",
  },
  {
    id: 'quiet',
    name: 'Quiet Stay',
    line: 'Silence, warmth, and deep alpine stillness.',
    route: '/guest/housekeeping',
    image:
      "linear-gradient(180deg, rgba(10,16,14,0.16) 0%, rgba(10,16,14,0.72) 100%), url('/images/modes/quiet-stay.svg')",
  },
  {
    id: 'wellness',
    name: 'Wellness Stay',
    line: 'Water, breath, and movement tuned to your rhythm.',
    route: '/guest/wellness',
    image:
      "linear-gradient(180deg, rgba(10,16,14,0.18) 0%, rgba(10,16,14,0.72) 100%), url('/images/modes/wellness-stay.svg')",
  },
  {
    id: 'explorer',
    name: 'Explorer Stay',
    line: 'Follow forest paths into living alpine stories.',
    route: '/guest/discovery',
    image:
      "linear-gradient(180deg, rgba(10,16,14,0.16) 0%, rgba(10,16,14,0.72) 100%), url('/images/modes/explorer-stay.svg')",
  },
  {
    id: 'deep-rest',
    name: 'Deep Rest',
    line: 'Slow down completely and let the mountain hold you.',
    route: '/guest/housekeeping',
    image:
      "linear-gradient(180deg, rgba(10,16,14,0.16) 0%, rgba(10,16,14,0.74) 100%), url('/images/modes/deep-rest.svg')",
  },
  {
    id: 'alpine-reset',
    name: 'Alpine Reset',
    line: 'Cold peaks, warm light, and a full renewal cycle.',
    route: '/guest/discovery',
    image:
      "linear-gradient(180deg, rgba(10,16,14,0.16) 0%, rgba(10,16,14,0.7) 100%), url('/images/modes/alpine-reset.svg')",
  },
]

export default function GuestHub() {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState<StayMode['id'] | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  const selected = useMemo(
    () => STAY_MODES.find((mode) => mode.id === activeMode) ?? null,
    [activeMode]
  )

  const enterMode = (mode: StayMode) => {
    sessionStorage.setItem('alpineflow_mode', mode.id)
    sessionStorage.setItem('alpineflow_mode_name', mode.name)
    setTransitioning(true)
    window.setTimeout(() => {
      router.push(mode.route)
    }, 420)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-fog)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(151,174,187,0.26),transparent_60%),linear-gradient(180deg,var(--color-fog)_0%,var(--color-linen)_65%,var(--color-fog)_100%)]" />

      <header className="relative z-10 flex items-center justify-between px-8 py-8 md:px-12">
        <Link
          href="/"
          className="text-[var(--color-deep)] no-underline"
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.4rem' }}
        >
          AlpineFlow
        </Link>
        <p className="text-[var(--color-earth)] text-xs tracking-[0.14em] uppercase">Choose your stay mode</p>
      </header>

      <section className="relative z-10 px-8 pb-16 pt-8 md:px-12">
        <h1
          className="max-w-3xl text-[var(--color-deep)]"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            lineHeight: 1.08,
            marginBottom: '48px',
          }}
        >
          Enter the atmosphere that matches your mountain rhythm.
        </h1>

        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {STAY_MODES.map((mode) => {
            const isActive = activeMode === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onMouseEnter={() => setActiveMode(mode.id)}
                onFocus={() => setActiveMode(mode.id)}
                onClick={() => enterMode(mode)}
                className="group relative min-h-[340px] overflow-hidden rounded-3xl text-left"
                style={{
                  backgroundImage: mode.image,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'transform var(--duration-cinematic) var(--ease-cinematic), box-shadow var(--duration-cinematic) var(--ease-cinematic)',
                  boxShadow: isActive ? '0 20px 46px rgba(15,28,24,0.28)' : '0 8px 22px rgba(15,28,24,0.18)',
                }}
              >
                <div className="absolute inset-0 border border-[rgba(231,223,208,0.28)]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="mb-2 text-[var(--color-linen)]" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontStyle: 'italic' }}>
                    {mode.name}
                  </p>
                  <p className="text-[rgba(231,223,208,0.82)] text-sm leading-6">{mode.line}</p>
                  <span
                    className="mt-5 inline-block text-xs uppercase tracking-[0.12em] text-[rgba(231,223,208,0.74)]"
                    style={{ transition: 'opacity var(--duration-cinematic) var(--ease-cinematic)' }}
                  >
                    Enter mode →
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-16 flex items-center justify-center">
          {selected ? (
            <button
              type="button"
              onClick={() => enterMode(selected)}
              className="rounded-full bg-[var(--color-moss)] px-7 py-3 text-sm uppercase tracking-[0.1em] text-[var(--color-linen)]"
              style={{ transition: 'opacity var(--duration-cinematic) var(--ease-cinematic)' }}
            >
              Continue with {selected.name}
            </button>
          ) : (
            <p className="text-[var(--color-earth)] text-sm">Hover any card and step into your stay.</p>
          )}
        </div>
      </section>

      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          opacity: transitioning ? 1 : 0,
          transition: 'opacity var(--duration-cinematic) var(--ease-cinematic)',
          background: 'rgba(12,20,16,0.74)',
        }}
      />
    </main>
  )
}
