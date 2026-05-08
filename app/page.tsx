'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentPreset } from '@/lib/alpineflow/timeOfDay'

const AlpineCanvas = dynamic(
  () => import('@/components/alpineflow/three/AlpineLobbyCanvas').then(m => ({ default: m.AlpineLobbyCanvas })),
  { ssr: false, loading: () => <AlpineFallback /> }
)

function AlpineFallback() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #1A2E28 0%, #2D4A3E 50%, #0F1C18 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(201,169,110,0.12) 0%, transparent 65%)' }} />
    </div>
  )
}

export default function AlpineFlowLobby() {
  const [loaded, setLoaded] = useState(false)
  const preset = getCurrentPreset()

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>

      {/* 3D Canvas fills the viewport */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <AlpineCanvas />
      </div>

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.5rem 2rem', pointerEvents: 'none',
        opacity: loaded ? 1 : 0, transition: 'opacity 1.5s ease 0.5s',
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontWeight: 300,
          fontSize: '1.2rem', letterSpacing: '-0.01em',
          color: preset.uiDark ? 'rgba(250,250,247,0.8)' : 'rgba(26,46,40,0.8)',
          pointerEvents: 'all',
        }}>
          AlpineFlow
        </span>
        <nav style={{ display: 'flex', gap: '1.5rem', pointerEvents: 'all', alignItems: 'center' }}>
          {[{ l: 'Guest', h: '/guest' }, { l: 'Wellness', h: '/guest/wellness' }, { l: 'Discover', h: '/guest/discovery' }].map(n => (
            <Link key={n.l} href={n.h}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 300,
                fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: preset.uiDark ? 'rgba(237,231,220,0.5)' : 'rgba(45,74,62,0.6)',
                cursor: 'pointer',
              }}>{n.l}</span>
            </Link>
          ))}
          <Link href="/hotel">
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 300,
              fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: preset.uiDark ? 'rgba(201,169,110,0.6)' : 'rgba(155,125,94,0.7)',
              cursor: 'pointer',
            }}>Hotel</span>
          </Link>
        </nav>
      </header>

      {/* Time of day badge */}
      <div style={{
        position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, opacity: loaded ? 0.7 : 0, transition: 'opacity 2s ease 1s', pointerEvents: 'none',
      }}>
        <div style={{
          background: preset.uiDark ? 'rgba(15,28,24,0.7)' : 'rgba(247,244,239,0.7)',
          border: preset.uiDark ? '1px solid rgba(201,169,110,0.2)' : '1px solid rgba(200,184,154,0.3)',
          borderRadius: 100, padding: '4px 14px', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: '0.6rem' }}>
            {preset.phase === 'dawn' ? '🌅' : preset.phase === 'morning' ? '🌄' : preset.phase === 'day' ? '☀️' : preset.phase === 'golden' ? '🌇' : preset.phase === 'dusk' ? '🌆' : '🌙'}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.08em', color: preset.uiDark ? 'rgba(237,231,220,0.7)' : 'rgba(45,74,62,0.7)' }}>
            {preset.label}
          </span>
        </div>
      </div>

      {/* Demo CTA — bottom center */}
      <div style={{
        position: 'fixed', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        opacity: loaded ? 1 : 0, transition: 'opacity 2s ease 1.8s',
      }}>
        <Link href="/guest?demo=true">
          <button style={{
            padding: '13px 32px', borderRadius: 100,
            background: preset.uiDark ? 'rgba(45,74,62,0.85)' : 'rgba(45,74,62,0.9)',
            border: '1px solid rgba(201,169,110,0.35)',
            color: '#FAFAF7',
            fontFamily: 'var(--font-sans)', fontWeight: 300,
            fontSize: '0.88rem', letterSpacing: '0.08em',
            cursor: 'pointer',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,169,110,0.15)',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2D4A3E'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(45,74,62,0.6), 0 0 0 1px rgba(201,169,110,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = preset.uiDark ? 'rgba(45,74,62,0.85)' : 'rgba(45,74,62,0.9)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,169,110,0.15)' }}
          >
            Demo erleben →
          </button>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.4 }}>
          <div style={{ width: 1, height: 28, background: preset.uiDark ? 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)' : 'linear-gradient(to bottom, rgba(45,74,62,0.4), transparent)' }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: preset.uiDark ? 'rgba(237,231,220,0.5)' : 'rgba(45,74,62,0.4)' }}>Scroll to explore</p>
          <div style={{ width: 1, height: 28, background: preset.uiDark ? 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)' : 'linear-gradient(to bottom, rgba(45,74,62,0.4), transparent)' }} />
        </div>
      </div>

    </main>
  )
}
