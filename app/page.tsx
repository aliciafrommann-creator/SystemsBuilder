'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { getCurrentPreset } from '@/lib/alpineflow/timeOfDay'

const AlpineCanvas = dynamic(
  () => import('@/components/alpineflow/three/AlpineLobbyCanvas').then(m => ({ default: m.AlpineLobbyCanvas })),
  { ssr: false }
)

// nature → hotel exterior → hotel spa → hotel lobby (fly-in sequence)
const ALPINE_PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
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
          from { transform: scale(1.12); }
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
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'kenBurns 10s cubic-bezier(0.16,1,0.3,1) forwards',
              opacity: fading ? 0 : 1,
              transition: 'opacity 1.2s ease',
            }}
          />
        </div>
        {/* Gradient overlay: light at top, stronger at bottom for CTA readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.5) 100%)',
        }} />
      </div>

      {/* Three.js — nearly invisible atmospheric particle layer */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        opacity: 0.06, mixBlendMode: 'screen', pointerEvents: 'none',
      }}>
        <AlpineCanvas />
      </div>

      {/* Top nav */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        padding: '1.5rem 2rem', pointerEvents: 'none',
        opacity: loaded ? 1 : 0, transition: 'opacity 1.5s ease 0.5s',
      }}>
        <nav style={{ display: 'flex', gap: '1.8rem', pointerEvents: 'all', alignItems: 'center' }}>
          {[{ l: 'Guest', h: '/guest' }, { l: 'Wellness', h: '/guest/wellness' }, { l: 'Discover', h: '/guest/discovery' }].map(n => (
            <Link key={n.l} href={n.h}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 300,
                fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                textShadow: '0 1px 8px rgba(0,0,0,0.4)',
              }}>{n.l}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Time of day badge */}
      <div style={{
        position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, opacity: loaded ? 0.65 : 0, transition: 'opacity 2s ease 1s', pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 100, padding: '4px 14px', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: '0.6rem' }}>
            {preset.phase === 'dawn' ? '🌅' : preset.phase === 'morning' ? '🌄' : preset.phase === 'day' ? '☀️' : preset.phase === 'golden' ? '🌇' : preset.phase === 'dusk' ? '🌆' : '🌙'}
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)', fontWeight: 300,
            fontSize: '0.62rem', letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.65)',
          }}>
            {preset.label}
          </span>
        </div>
      </div>

      {/* Center hero */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        marginTop: '-4vh',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'none' : 'translateY(12px)',
        transition: 'opacity 2s ease 0.8s, transform 2s ease 0.8s',
        pointerEvents: 'none',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 300,
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          letterSpacing: '0.15em',
          color: '#ffffff',
          margin: 0,
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          lineHeight: 1,
        }}>
          AlpineFlow
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 300,
          fontSize: '0.9rem',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.75)',
          margin: '1.1rem 0 0',
          textShadow: '0 1px 12px rgba(0,0,0,0.3)',
          textTransform: 'uppercase',
        }}>
          Digitale Atmosphäre für nachhaltiges Reisen
        </p>
      </div>

      {/* Demo CTA — bottom center */}
      <div style={{
        position: 'fixed', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        opacity: loaded ? 1 : 0, transition: 'opacity 2s ease 2s',
      }}>
        <Link href="/guest?demo=true">
          <button
            style={{
              padding: '13px 36px', borderRadius: 100,
              background: 'rgba(45,74,62,0.88)',
              border: '1px solid rgba(201,169,110,0.4)',
              color: '#FAFAF7',
              fontFamily: 'var(--font-sans)', fontWeight: 300,
              fontSize: '0.88rem', letterSpacing: '0.1em',
              cursor: 'pointer',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.15)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = '#2D4A3E'
              b.style.boxShadow = '0 12px 40px rgba(45,74,62,0.6), 0 0 0 1px rgba(201,169,110,0.3)'
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = 'rgba(45,74,62,0.88)'
              b.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.15)'
            }}
          >
            Demo erleben →
          </button>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: 0.35 }}>
          <div style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }} />
          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 300,
            fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}>Scroll to explore</p>
          <div style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }} />
        </div>
      </div>

    </main>
  )
}
