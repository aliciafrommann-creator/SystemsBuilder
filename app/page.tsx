'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const AlpineLobby = dynamic(
  () => import('@/components/alpineflow/three/AlpineLobby').then((m) => ({ default: m.AlpineLobby })),
  { ssr: false }
)

export default function Page() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <AlpineLobby />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(10,16,14,0.6) 0%, rgba(10,16,14,0.2) 35%, rgba(10,16,14,0.55) 100%)',
        }}
      />

      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 20 }}>
        <span
          style={{
            color: 'rgba(231,223,208,0.72)',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.35rem',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 16px rgba(0,0,0,0.22)',
          }}
        >
          AlpineFlow
        </span>
      </div>

      <div style={{ position: 'absolute', left: '50%', bottom: '2.25rem', transform: 'translateX(-50%)', zIndex: 20 }}>
        <Link
          href="/login"
          style={{
            color: 'rgba(231,223,208,0.68)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '0.7rem 1.05rem',
            borderRadius: '999px',
            background: 'rgba(15,28,24,0.22)',
            border: '1px solid rgba(231,223,208,0.2)',
            transition: 'all var(--duration-cinematic) var(--ease-cinematic)',
          }}
        >
          Enter your stay →
        </Link>
      </div>
    </main>
  )
}
