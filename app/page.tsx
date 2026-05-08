'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'
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

const ALPINE_PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85&auto=format&fit=crop',
]

export default function AlpineFlowLobby() {
  const [loaded, setLoaded] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const preset = getCurrentPreset()
  const cycleRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    cycleRef.current = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setPhotoIdx(i => (i + 1) % ALPINE_PHOTOS.length)
        setFading(false)
      }, 1200)
    }, 10000)
    return () => clearInterval(cycleRef.current)
  }, [])

  return (
    <main style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1.15); }
          to   { transform: scale(1.0); }
        }
      `}</style>

      {/* Photo background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${scrollY * 0.3}px)` }}>
          <div
            key={photoIdx}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${ALPINE_PHOTOS[photoIdx]})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              animation: 'kenBurns 10s cubic-bezier(0.16,1,0.3,1) forwards',
              opacity: fading ? 0 : 1,
              transition: 'opacity 1.2s ease',
            }}
          />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)' }} />
      </div>

      {/* Three.js atmospheric overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.4, mixBlendMode: 'screen', pointerEvents: 'none' }}>
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
          color: 'rgba(250,250,247,0.9)',
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
                color: 'rgba(237,231,220,0.55)',
                cursor: 'pointer',
              }}>{n.l}</span>
            </Link>
          ))}
          <Link href="/hotel">
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 300,
              fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.65)',
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
          background: 'rgba(15,28,24,0.7)',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: 100, padding: '4px 14px', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: '0.6rem' }}>
            {preset.phase === 'dawn' ? '🌅' : preset.phase === 'morning' ? '🌄' : preset.phase === 'day' ? '☀️' : preset.phase === 'golden' ? '🌇' : preset.phase === 'dusk' ? '🌆' : '🌙'}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.08em', color: 'rgba(237,231,220,0.7)' }}>
            {preset.label}
          </span>
        </div>
      </div>

      {/* Demo CTA */}
      <div style={{
        position: 'fixed', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        opacity: loaded ? 1 : 0, transition: 'opacity 2s ease 1.8s',
      }}>
        <Link href="/guest?demo=true">
          <button
            style={{
              padding: '13px 32px', borderRadius: 100,
              background: 'rgba(45,74,62,0.85)',
              border: '1px solid rgba(201,169,110,0.35)',
              color: '#FAFAF7',
              fontFamily: 'var(--font-sans)', fontWeight: 300,
              fontSize: '0.88rem', letterSpacing: '0.08em',
              cursor: 'pointer',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,169,110,0.15)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = '#2D4A3E'
              b.style.boxShadow = '0 12px 40px rgba(45,74,62,0.6), 0 0 0 1px rgba(201,169,110,0.25)'
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = 'rgba(45,74,62,0.85)'
              b.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,169,110,0.15)'
            }}
          >
            Demo erleben →
          </button>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.4 }}>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)' }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(237,231,220,0.5)' }}>Scroll to explore</p>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)' }} />
        </div>
      </div>

    </main>
  )
}
