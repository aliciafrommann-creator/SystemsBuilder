'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const MODES = [
  {
    id: 'eco', name: 'Eco Stay', subtitle: 'Light touch on the earth',
    color: '#1A2E28', light: '#2a4a38', accent: '#4a8a6a',
    text: 'rgba(210,235,220,0.9)', bg: '#111e1a',
    icon: '◇',
    desc: 'Solar-heated rooms, foraged breakfast, zero single-use plastics. Your stay leaves the forest exactly as you found it.',
  },
  {
    id: 'quiet', name: 'Quiet Stay', subtitle: 'Deep rest, undisturbed',
    color: '#1E2638', light: '#283850', accent: '#5a82b8',
    text: 'rgba(205,218,238,0.9)', bg: '#131825',
    icon: '◎',
    desc: 'No calls, no notifications. Blackout rooms, curated library, and silent meditation paths through the pines.',
  },
  {
    id: 'wellness', name: 'Wellness Stay', subtitle: 'Renew body and mind',
    color: '#2C1E18', light: '#4a3228', accent: '#c9a96e',
    text: 'rgba(240,225,205,0.9)', bg: '#1a1210',
    icon: '◠',
    desc: 'Alpine spa, thermal pools, plant-based nourishment and sunrise movement sessions with mountain guides.',
  },
  {
    id: 'explorer', name: 'Explorer Stay', subtitle: 'Discover the region',
    color: '#1E2C18', light: '#2e4228', accent: '#a4b768',
    text: 'rgba(222,235,210,0.9)', bg: '#131c10',
    icon: '◈',
    desc: 'Local guides, e-bikes, hand-drawn maps to hidden trails and artisan villages. Off the beaten path, always.',
  },
  {
    id: 'deep-rest', name: 'Deep Rest', subtitle: 'Nothing is required of you',
    color: '#221830', light: '#362850', accent: '#9b78c8',
    text: 'rgba(228,218,245,0.9)', bg: '#160f20',
    icon: '◡',
    desc: 'Floating breakfast, heated blankets, curated reading nooks. The only decision you make: when to sleep.',
  },
  {
    id: 'alpine-reset', name: 'Alpine Reset', subtitle: 'The full mountain experience',
    color: '#18222E', light: '#243448', accent: '#7ba3a8',
    text: 'rgba(212,228,235,0.9)', bg: '#101820',
    icon: '◯',
    desc: 'Cold-plunge mornings, pine sauna evenings, fireside dinners, and star-gazing above the treeline.',
  },
]

const SERVICES = [
  { l: 'Housekeeping', s: 'Room preferences', h: '/guest/housekeeping', i: '◊', hint: 'Quiet mode on' },
  { l: 'Wellness',     s: 'Spa & movement',   h: '/guest/wellness',     i: '○', hint: '2 sessions left' },
  { l: 'Discover',     s: 'Local & regional', h: '/guest/discovery',    i: '◈', hint: '8 experiences' },
  { l: 'Impact',       s: 'Your footprint',   h: '/guest/sustainability',i: '◇', hint: '12 kg CO₂ saved' },
]

export default function GuestHub() {
  const [activeMode, setActiveMode] = useState<string | null>(null)
  const [loaded, setLoaded]         = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2
    const ny = (e.clientY / window.innerHeight - 0.5) * 2
    mouseRef.current = { x: nx, y: ny }
    setMouse({ x: nx, y: ny })
  }, [])
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [onMouseMove])

  const selected = MODES.find(m => m.id === activeMode)
  const hour = new Date().getHours()
  const greeting = hour < 5 ? 'Late night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const tilt = (id: string): string => {
    if (hoveredCard !== id) return 'none'
    return `perspective(900px) rotateX(${-mouse.y * 6}deg) rotateY(${mouse.x * 6}deg) translateZ(8px)`
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: selected
        ? `radial-gradient(ellipse at 28% 38%, ${selected.light}90 0%, ${selected.bg} 65%)`
        : 'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 55%, #E4DDD3 100%)',
      transition: 'background 1.5s cubic-bezier(0.16,1,0.3,1)',
      overflowX: 'hidden',
    }}>

      {/* Ambient parallax orbs */}
      {selected && (
        <>
          <div style={{
            position: 'fixed', top: '-25vh', right: '-25vw',
            width: '65vw', height: '65vw', borderRadius: '50%',
            background: `radial-gradient(circle, ${selected.accent}15 0%, transparent 68%)`,
            pointerEvents: 'none', zIndex: 0,
            transform: `translate(${mouse.x * -18}px, ${mouse.y * -12}px)`,
            transition: 'transform 0.8s ease, background 1.5s ease',
          }} />
          <div style={{
            position: 'fixed', bottom: '-15vh', left: '-18vw',
            width: '50vw', height: '50vw', borderRadius: '50%',
            background: `radial-gradient(circle, ${selected.color}35 0%, transparent 65%)`,
            pointerEvents: 'none', zIndex: 0,
            transform: `translate(${mouse.x * 12}px, ${mouse.y * 9}px)`,
            transition: 'transform 0.8s ease, background 1.5s ease',
          }} />
        </>
      )}

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.35rem 2rem', position: 'sticky', top: 0, zIndex: 20,
        background: selected ? 'rgba(0,0,0,0.12)' : 'rgba(247,244,239,0.88)',
        backdropFilter: 'blur(22px)',
        borderBottom: selected ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(200,184,154,0.18)',
        transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <Link href="/">
          <span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.3rem', color: selected ? 'rgba(250,250,247,0.92)' : 'var(--color-deep)', cursor:'pointer', transition:'color 1s ease' }}>AlpineFlow</span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background: selected ? selected.accent : '#4a8a6a', boxShadow: selected ? `0 0 10px ${selected.accent}80` : 'none', transition:'all 0.6s ease' }} />
          <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.7rem', letterSpacing:'0.1em', color: selected ? selected.text : 'var(--color-bark)', transition:'color 1s ease' }}>Room 214</span>
        </div>
        <nav style={{ display:'flex', gap:'1.5rem' }}>
          {[{l:'Stay',h:'/guest'},{l:'Wellness',h:'/guest/wellness'},{l:'Discover',h:'/guest/discovery'},{l:'Impact',h:'/guest/sustainability'}].map(n=>(
            <Link key={n.l} href={n.h}>
              <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.7rem', letterSpacing:'0.07em', color: selected ? 'rgba(237,231,220,0.5)' : 'var(--color-bark)', transition:'color 1s ease', cursor:'pointer' }}>{n.l}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <div style={{
        maxWidth: 1080, margin: '0 auto', padding: '4rem 2rem 5rem',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'none' : 'translateY(22px)',
        transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative', zIndex: 1,
      }}>

        {/* Greeting */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.75rem', letterSpacing:'0.18em', textTransform:'uppercase', color: selected ? 'rgba(201,169,110,0.65)' : 'var(--color-stone)', marginBottom:'0.8rem', transition:'color 1s ease' }}>{greeting}</p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.4rem,4.8vw,4.2rem)', letterSpacing:'-0.03em', lineHeight:1.08, color: selected ? '#FAFAF7' : 'var(--color-deep)', transition:'color 1s ease', marginBottom:'0.8rem' }}>
            {selected
              ? <><em style={{ fontStyle:'italic', color: selected.accent }}>{selected.name}</em><br />selected for your stay</>  
              : <>How would you like<br /><em style={{ fontStyle:'italic', color:'var(--color-forest)' }}>to experience your stay?</em></>
            }
          </h1>
          {selected && (
            <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.98rem', lineHeight:1.72, color: selected.text, maxWidth:'50ch', marginTop:'1rem', transition:'all 0.9s ease' }}>{selected.desc}</p>
          )}
        </div>

        {/* Stay mode cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(272px, 1fr))',
          gap: '0.9rem',
          marginBottom: '3.5rem',
        }}>
          {MODES.map((mode, idx) => {
            const isActive  = activeMode === mode.id
            const isHovered = hoveredCard === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(activeMode === mode.id ? null : mode.id)}
                onMouseEnter={() => setHoveredCard(mode.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  textAlign: 'left',
                  padding: isActive ? '1.8rem' : '1.4rem',
                  borderRadius: '18px',
                  border: isActive
                    ? `1.5px solid ${mode.accent}70`
                    : selected
                    ? '1px solid rgba(255,255,255,0.07)'
                    : '1px solid rgba(200,184,154,0.22)',
                  background: isActive
                    ? `linear-gradient(135deg, ${mode.color}f2 0%, ${mode.light}dd 100%)`
                    : isHovered && !selected
                    ? 'rgba(255,255,255,0.92)'
                    : selected
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(250,250,247,0.68)',
                  cursor: 'pointer',
                  transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: isActive
                    ? `0 16px 56px ${mode.color}70, 0 0 0 0.5px ${mode.accent}35`
                    : isHovered
                    ? '0 8px 32px rgba(0,0,0,0.1)'
                    : 'none',
                  backdropFilter: 'blur(18px)',
                  opacity: loaded ? 1 : 0,
                  transform: (() => {
                    const parts: string[] = []
                    if (!loaded) parts.push(`translateY(${14 + idx * 4}px)`)
                    if (isActive) parts.push('scale(1.015)')
                    if (isHovered && !isActive) parts.push(tilt(mode.id))
                    return parts.length ? parts.join(' ') : 'none'
                  })(),
                  transitionDelay: loaded ? '0ms' : `${idx * 55}ms`,
                }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.9rem' }}>
                  <span style={{ fontSize:'1.35rem', color: isActive ? mode.accent : selected ? 'rgba(201,169,110,0.55)' : 'var(--color-forest)', transition:'all 0.4s ease' }}>{mode.icon}</span>
                  {isActive && <div style={{ width:7, height:7, borderRadius:'50%', background: mode.accent, boxShadow:`0 0 14px ${mode.accent}aa`, marginTop:4 }} />}
                </div>
                <h3 style={{ fontFamily:'var(--font-serif)', fontWeight:400, fontSize:'1.12rem', color: isActive ? '#FAFAF7' : selected ? 'rgba(250,250,247,0.82)' : 'var(--color-deep)', marginBottom:'0.3rem', transition:'color 0.8s ease' }}>{mode.name}</h3>
                <p style={{ fontSize:'0.78rem', letterSpacing:'0.015em', color: isActive ? mode.text : selected ? 'rgba(237,231,220,0.42)' : 'var(--color-bark)', transition:'color 0.8s ease' }}>{mode.subtitle}</p>
                {isActive && (
                  <div style={{ marginTop:'1.15rem', paddingTop:'1.15rem', borderTop:`1px solid ${mode.accent}28` }}>
                    <p style={{ fontSize:'0.86rem', color: mode.text, lineHeight:1.68, fontFamily:'var(--font-sans)', fontWeight:300, marginBottom:'1.1rem' }}>{mode.desc}</p>
                    <Link href="/guest">
                      <button style={{ background: mode.accent, color:'#fff', border:'none', borderRadius:100, padding:'8px 22px', fontSize:'0.78rem', fontFamily:'var(--font-sans)', fontWeight:400, cursor:'pointer', letterSpacing:'0.05em', boxShadow:`0 4px 18px ${mode.accent}50` }}>Enter Stay</button>
                    </Link>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Service tiles */}
        <div style={{ borderTop: selected ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(200,184,154,0.18)', paddingTop:'2.8rem', transition:'border-color 1s ease' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.68rem', letterSpacing:'0.2em', textTransform:'uppercase', color: selected ? 'rgba(237,231,220,0.32)' : 'var(--color-stone)', marginBottom:'1.4rem', transition:'color 1s ease' }}>Your stay</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.8rem' }}>
            {SERVICES.map(a => (
              <Link key={a.l} href={a.h}>
                <div
                  style={{
                    borderRadius:'14px', padding:'1.15rem 1rem', cursor:'pointer',
                    background: selected ? 'rgba(255,255,255,0.045)' : 'rgba(250,250,247,0.72)',
                    border: selected ? '1px solid rgba(255,255,255,0.065)' : '1px solid rgba(200,184,154,0.18)',
                    transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(-4px) scale(1.025)'
                    el.style.boxShadow = selected ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'
                    el.style.background = selected ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.95)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'none'
                    el.style.boxShadow = 'none'
                    el.style.background = selected ? 'rgba(255,255,255,0.045)' : 'rgba(250,250,247,0.72)'
                  }}
                >
                  <p style={{ fontSize:'1rem', marginBottom:'0.45rem', color: selected ? 'rgba(201,169,110,0.65)' : 'var(--color-forest)', transition:'color 1s ease' }}>{a.i}</p>
                  <p style={{ fontWeight:400, fontSize:'0.86rem', fontFamily:'var(--font-sans)', color: selected ? '#FAFAF7' : 'var(--color-deep)', marginBottom:'0.25rem', transition:'color 1s ease' }}>{a.l}</p>
                  <p style={{ fontSize:'0.7rem', color: selected ? 'rgba(237,231,220,0.38)' : 'var(--color-bark)', transition:'color 1s ease' }}>{a.hint}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
