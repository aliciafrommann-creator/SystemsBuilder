'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useStay } from '@/lib/alpineflow/stay-context'

const MODES = [
  {
    id: 'eco', name: 'Eco Stay', subtitle: 'Light touch on the earth',
    color: '#1A2E28', light: '#2a4a38', accent: '#4a8a6a', text: 'rgba(210,235,220,0.9)', bg: '#111e1a', icon: '◇',
    desc: 'Solar-heated rooms, foraged breakfast, zero single-use plastics. Your stay leaves the forest exactly as you found it.',
    cta: { label: 'Explore nature →', href: '/guest/discovery' },
  },
  {
    id: 'quiet', name: 'Quiet Stay', subtitle: 'Deep rest, undisturbed',
    color: '#1E2638', light: '#283850', accent: '#5a82b8', text: 'rgba(205,218,238,0.9)', bg: '#131825', icon: '◎',
    desc: 'No calls, no notifications. Blackout rooms, curated library, and silent meditation paths through the pines.',
    cta: { label: 'Curated library →', href: '/guest/discovery' },
  },
  {
    id: 'wellness', name: 'Wellness Stay', subtitle: 'Renew body and mind',
    color: '#2C1E18', light: '#4a3228', accent: '#c9a96e', text: 'rgba(240,225,205,0.9)', bg: '#1a1210', icon: '◠',
    desc: 'Alpine spa, thermal pools, plant-based nourishment and sunrise movement sessions with mountain guides.',
    cta: { label: 'Explore wellness →', href: '/guest/wellness' },
  },
  {
    id: 'explorer', name: 'Explorer Stay', subtitle: 'Discover the region',
    color: '#1E2C18', light: '#2e4228', accent: '#a4b768', text: 'rgba(222,235,210,0.9)', bg: '#131c10', icon: '◈',
    desc: 'Local guides, e-bikes, hand-drawn maps to hidden trails and artisan villages. Off the beaten path, always.',
    cta: { label: 'Discover the region →', href: '/guest/discovery' },
  },
  {
    id: 'deep-rest', name: 'Deep Rest', subtitle: 'Nothing is required of you',
    color: '#221830', light: '#362850', accent: '#9b78c8', text: 'rgba(228,218,245,0.9)', bg: '#160f20', icon: '◡',
    desc: 'Floating breakfast, heated blankets, curated reading nooks. The only decision you make: when to sleep.',
    cta: { label: 'Room comforts →', href: '/guest/housekeeping' },
  },
  {
    id: 'alpine-reset', name: 'Alpine Reset', subtitle: 'The full mountain experience',
    color: '#18222E', light: '#243448', accent: '#7ba3a8', text: 'rgba(212,228,235,0.9)', bg: '#101820', icon: '◯',
    desc: 'Cold-plunge mornings, pine sauna evenings, fireside dinners, and star-gazing above the treeline.',
    cta: { label: 'Plan your reset →', href: '/guest/wellness' },
  },
]

type ServiceItem = { l: string; s: string; h: string; i: string; hint: string }

const SERVICES: ServiceItem[] = [
  { l: 'Housekeeping', s: 'Room preferences', h: '/guest/housekeeping', i: '◊', hint: 'Quiet mode on' },
  { l: 'Wellness',     s: 'Spa & movement',   h: '/guest/wellness',     i: '○', hint: '2 sessions left' },
  { l: 'Discover',     s: 'Local & regional', h: '/guest/discovery',    i: '◈', hint: '8 experiences' },
  { l: 'Impact',       s: 'Your footprint',   h: '/guest/sustainability',i: '◇', hint: '12 kg CO₂ saved' },
]

const MODE_SERVICES: Record<string, ServiceItem[]> = {
  eco: [
    { l: 'Nature Walk',  s: 'Guided foraging',   h: '/guest/discovery',    i: '◈', hint: 'Alpenrosen in bloom' },
    { l: 'Eco Room',     s: 'Zero-waste setup',  h: '/guest/housekeeping', i: '◊', hint: 'Solar heating on' },
    { l: 'Impact',       s: 'Your carbon offset',h: '/guest/sustainability',i: '◇', hint: '12 kg CO₂ saved' },
    { l: 'Herb Ritual',  s: 'Natural spa',       h: '/guest/wellness',     i: '○', hint: 'Organic ingredients' },
  ],
  quiet: [
    { l: 'Silent Room',  s: 'Sound dampening',   h: '/guest/housekeeping', i: '◎', hint: 'DND mode active' },
    { l: 'Library',      s: 'Curated reading',   h: '/guest/discovery',    i: '◊', hint: '120 titles' },
    { l: 'Meditation',   s: 'Guided sessions',   h: '/guest/wellness',     i: '○', hint: 'Daily at 07:00' },
    { l: 'Silent Dining',s: 'In-room service',   h: '/guest/housekeeping', i: '◡', hint: 'No disturbances' },
  ],
  wellness: [
    { l: 'Thermal Spa',  s: 'Alpine pools',      h: '/guest/wellness',     i: '○', hint: '2 sessions left' },
    { l: 'Movement',     s: 'Yoga & pilates',    h: '/guest/wellness',     i: '◠', hint: 'Daily 07:00 & 17:00' },
    { l: 'Nourishment',  s: 'Plant-based menu',  h: '/guest/wellness',     i: '◡', hint: 'Tonight: wild garlic' },
    { l: 'Wellbeing',    s: 'Your score',        h: '/guest/sustainability',i: '◇', hint: 'Up 18% this stay' },
  ],
  explorer: [
    { l: 'Trails',       s: 'Maps & guides',     h: '/guest/discovery',    i: '◈', hint: '8 routes available' },
    { l: 'E-Bikes',      s: 'Valley & summit',   h: '/guest/discovery',    i: '◈', hint: 'Free for Eco guests' },
    { l: 'Culture',      s: 'Local villages',    h: '/guest/discovery',    i: '◊', hint: 'Artisan market Sat' },
    { l: 'Food Trail',   s: 'Regional producers',h: '/guest/discovery',    i: '◡', hint: 'Cheese & wine tour' },
  ],
  'deep-rest': [
    { l: 'Room Comfort', s: 'Your preferences',  h: '/guest/housekeeping', i: '◎', hint: '19°C, blackout on' },
    { l: 'Library',      s: 'Reading corner',    h: '/guest/discovery',    i: '◊', hint: '120 curated titles' },
    { l: 'Sleep Spa',    s: 'Aromatherapy',      h: '/guest/wellness',     i: '○', hint: 'Ritual at 21:00' },
    { l: 'Breakfast',    s: 'Floating service',  h: '/guest/housekeeping', i: '◡', hint: 'Any time you choose' },
  ],
  'alpine-reset': [
    { l: 'Cold Plunge',  s: '8°C recovery pool', h: '/guest/wellness',     i: '◯', hint: 'Opens 06:30' },
    { l: 'Pine Sauna',   s: 'Panorama views',    h: '/guest/wellness',     i: '◠', hint: 'Evenings 17:00–22:00' },
    { l: 'Summit',       s: 'Guided peak hike',  h: '/guest/discovery',    i: '◈', hint: 'Tomorrow: Seekofel' },
    { l: 'Stargazing',   s: 'Alpine telescope',  h: '/guest/discovery',    i: '◇', hint: 'Tonight at 21:30' },
  ],
}

export default function GuestHub() {
  const { stay, hotel, loading: stayLoading, enterStay } = useStay()
  const [activeMode, setActiveMode]   = useState<string | null>(null)
  const [loaded, setLoaded]           = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [codeInput, setCodeInput]     = useState('')
  const [codeErr, setCodeErr]         = useState(false)
  const [codeBusy, setCodeBusy]       = useState(false)
  const [skipped, setSkipped]         = useState(false)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [mouse, setMouse]             = useState({ x: 0, y: 0 })

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    const savedMode = localStorage.getItem('af_stay_mode')
    if (savedMode) setActiveMode(savedMode)
    return () => clearTimeout(t)
  }, [])

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

  const submitCode = async () => {
    if (!codeInput.trim() || codeBusy) return
    setCodeBusy(true); setCodeErr(false)
    const ok = await enterStay(codeInput.trim())
    if (!ok) setCodeErr(true)
    setCodeBusy(false)
  }

  const selectMode = (id: string) => {
    const newMode = activeMode === id ? null : id
    setActiveMode(newMode)
    if (newMode) localStorage.setItem('af_stay_mode', newMode)
    else localStorage.removeItem('af_stay_mode')
  }

  const selected  = MODES.find(m => m.id === activeMode)
  const hour      = new Date().getHours()
  const greeting  = hour < 5 ? 'Late night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const roomNum   = stay?.room_number ?? '214'
  const firstName = stay?.guest_name?.split(' ')[0]
  const hotelName = hotel?.name

  const tilt = (id: string): string => {
    if (hoveredCard !== id) return 'none'
    return `perspective(900px) rotateX(${-mouse.y * 6}deg) rotateY(${mouse.x * 6}deg) translateZ(8px)`
  }

  const activeServices = activeMode && MODE_SERVICES[activeMode] ? MODE_SERVICES[activeMode] : SERVICES

  if (stayLoading) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F7F4EF, #EDE7DC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1rem', color: 'var(--color-stone)' }}>Preparing your stay…</p>
    </main>
  )

  if (!stay && !skipped) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a1410 0%, #182820 55%, #0d1c18 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.55)', marginBottom: '2rem' }}>AlpineFlow</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,2.8rem)', color: '#FAFAF7', lineHeight: 1.12, marginBottom: '0.75rem' }}>
          Welcome to your<br /><em style={{ fontStyle: 'italic', color: 'rgba(201,169,110,0.85)' }}>alpine stay</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', color: 'rgba(237,231,220,0.42)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '32ch', margin: '0 auto 2.5rem' }}>Enter the stay code from your booking confirmation to personalise your experience.</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '2rem', backdropFilter: 'blur(24px)' }}>
          <input
            value={codeInput}
            onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeErr(false) }}
            onKeyDown={e => e.key === 'Enter' && submitCode()}
            placeholder="ALPIN-2847"
            maxLength={16}
            style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: codeErr ? '1px solid rgba(220,80,80,0.45)' : '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '1.1rem', color: '#FAFAF7', letterSpacing: '0.12em', textAlign: 'center', outline: 'none', marginBottom: codeErr ? '0.5rem' : '1.25rem', transition: 'border 0.2s ease', boxSizing: 'border-box' }}
          />
          {codeErr && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.78rem', color: 'rgba(220,120,80,0.85)', marginBottom: '1rem', textAlign: 'center' }}>Stay not found. Please check your code.</p>}
          <button
            onClick={submitCode}
            disabled={!codeInput.trim() || codeBusy}
            style={{ width: '100%', padding: '13px', borderRadius: 12, background: codeInput.trim() ? '#2D4A3E' : 'rgba(45,74,62,0.25)', border: 'none', color: '#FAFAF7', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', letterSpacing: '0.06em', cursor: codeInput.trim() ? 'pointer' : 'default', transition: 'all 0.3s ease', boxShadow: codeInput.trim() ? '0 6px 24px rgba(45,74,62,0.5)' : 'none', marginBottom: '1rem' }}
          >
            {codeBusy ? 'Loading your stay…' : 'Enter stay'}
          </button>
          <button onClick={() => setSkipped(true)} style={{ background: 'none', border: 'none', color: 'rgba(237,231,220,0.28)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.04em' }}>Explore without code →</button>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.65rem', color: 'rgba(237,231,220,0.2)', marginTop: '2rem', letterSpacing: '0.04em' }}>Demo code: ALPIN-2847</p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: selected ? `radial-gradient(ellipse at 28% 38%, ${selected.light}90 0%, ${selected.bg} 65%)` : 'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 55%, #E4DDD3 100%)', transition: 'background 1.5s cubic-bezier(0.16,1,0.3,1)', overflowX: 'hidden' }}>

      {selected && (
        <>
          <div style={{ position: 'fixed', top: '-25vh', right: '-25vw', width: '65vw', height: '65vw', borderRadius: '50%', background: `radial-gradient(circle, ${selected.accent}15 0%, transparent 68%)`, pointerEvents: 'none', zIndex: 0, transform: `translate(${mouse.x * -18}px, ${mouse.y * -12}px)`, transition: 'transform 0.8s ease' }} />
          <div style={{ position: 'fixed', bottom: '-15vh', left: '-18vw', width: '50vw', height: '50vw', borderRadius: '50%', background: `radial-gradient(circle, ${selected.color}35 0%, transparent 65%)`, pointerEvents: 'none', zIndex: 0, transform: `translate(${mouse.x * 12}px, ${mouse.y * 9}px)`, transition: 'transform 0.8s ease' }} />
        </>
      )}

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.35rem 2rem', position: 'sticky', top: 0, zIndex: 20, background: selected ? 'rgba(0,0,0,0.12)' : 'rgba(247,244,239,0.88)', backdropFilter: 'blur(22px)', borderBottom: selected ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(200,184,154,0.18)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
        <Link href="/"><span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.3rem', color: selected ? 'rgba(250,250,247,0.92)' : 'var(--color-deep)', cursor: 'pointer', transition: 'color 1s ease' }}>AlpineFlow</span></Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: selected ? selected.accent : '#4a8a6a', boxShadow: selected ? `0 0 10px ${selected.accent}80` : 'none', transition: 'all 0.6s ease' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.1em', color: selected ? selected.text : 'var(--color-bark)', transition: 'color 1s ease' }}>Room {roomNum}</span>
          </div>
          {hotelName && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.06em', color: selected ? 'rgba(237,231,220,0.3)' : 'var(--color-stone)', transition: 'color 1s ease' }}>{hotelName}</span>}
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {[{ l: 'Wellness', h: '/guest/wellness' }, { l: 'Discover', h: '/guest/discovery' }, { l: 'Impact', h: '/guest/sustainability' }].map(n => (
            <Link key={n.l} href={n.h}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.07em', color: selected ? 'rgba(237,231,220,0.45)' : 'var(--color-bark)', transition: 'color 1s ease', cursor: 'pointer' }}>{n.l}</span></Link>
          ))}
        </nav>
      </header>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '4rem 2rem 5rem', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(22px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)', position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: selected ? 'rgba(201,169,110,0.65)' : 'var(--color-stone)', marginBottom: '0.8rem', transition: 'color 1s ease' }}>
            {greeting}{firstName ? `, ${firstName}` : ''}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2.4rem,4.8vw,4.2rem)', letterSpacing: '-0.03em', lineHeight: 1.08, color: selected ? '#FAFAF7' : 'var(--color-deep)', transition: 'color 1s ease', marginBottom: '0.8rem' }}>
            {selected
              ? <><em style={{ fontStyle: 'italic', color: selected.accent }}>{selected.name}</em><br />selected for your stay</>
              : <>How would you like<br /><em style={{ fontStyle: 'italic', color: 'var(--color-forest)' }}>to experience your stay?</em></>
            }
          </h1>
          {selected && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.98rem', lineHeight: 1.72, color: selected.text, maxWidth: '50ch', marginTop: '1rem', transition: 'all 0.9s ease' }}>{selected.desc}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(272px, 1fr))', gap: '0.9rem', marginBottom: '3.5rem' }}>
          {MODES.map((mode, idx) => {
            const isActive  = activeMode === mode.id
            const isHovered = hoveredCard === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => selectMode(mode.id)}
                onMouseEnter={() => setHoveredCard(mode.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ textAlign: 'left', padding: isActive ? '1.8rem' : '1.4rem', borderRadius: '18px', border: isActive ? `1.5px solid ${mode.accent}70` : selected ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(200,184,154,0.22)', background: isActive ? `linear-gradient(135deg, ${mode.color}f2 0%, ${mode.light}dd 100%)` : isHovered && !selected ? 'rgba(255,255,255,0.92)' : selected ? 'rgba(255,255,255,0.04)' : 'rgba(250,250,247,0.68)', cursor: 'pointer', transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)', boxShadow: isActive ? `0 16px 56px ${mode.color}70, 0 0 0 0.5px ${mode.accent}35` : isHovered ? '0 8px 32px rgba(0,0,0,0.1)' : 'none', backdropFilter: 'blur(18px)', opacity: loaded ? 1 : 0, transform: (() => { const p: string[] = []; if (!loaded) p.push(`translateY(${14 + idx * 4}px)`); if (isActive) p.push('scale(1.015)'); if (isHovered && !isActive) p.push(tilt(mode.id)); return p.length ? p.join(' ') : 'none' })(), transitionDelay: loaded ? '0ms' : `${idx * 55}ms` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.9rem' }}>
                  <span style={{ fontSize: '1.35rem', color: isActive ? mode.accent : selected ? 'rgba(201,169,110,0.55)' : 'var(--color-forest)', transition: 'all 0.4s ease' }}>{mode.icon}</span>
                  {isActive && <div style={{ width: 7, height: 7, borderRadius: '50%', background: mode.accent, boxShadow: `0 0 14px ${mode.accent}aa`, marginTop: 4 }} />}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.12rem', color: isActive ? '#FAFAF7' : selected ? 'rgba(250,250,247,0.82)' : 'var(--color-deep)', marginBottom: '0.3rem', transition: 'color 0.8s ease' }}>{mode.name}</h3>
                <p style={{ fontSize: '0.78rem', letterSpacing: '0.015em', color: isActive ? mode.text : selected ? 'rgba(237,231,220,0.42)' : 'var(--color-bark)', transition: 'color 0.8s ease' }}>{mode.subtitle}</p>
                {isActive && (
                  <div style={{ marginTop: '1.15rem', paddingTop: '1.15rem', borderTop: `1px solid ${mode.accent}28` }}>
                    <p style={{ fontSize: '0.86rem', color: mode.text, lineHeight: 1.68, fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: '1.1rem' }}>{mode.desc}</p>
                    <Link href={mode.cta.href}>
                      <button style={{ background: mode.accent, color: '#fff', border: 'none', borderRadius: 100, padding: '8px 22px', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 400, cursor: 'pointer', letterSpacing: '0.05em', boxShadow: `0 4px 18px ${mode.accent}50` }}>
                        {mode.cta.label}
                      </button>
                    </Link>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div style={{ borderTop: selected ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(200,184,154,0.18)', paddingTop: '2.8rem', transition: 'border-color 1s ease' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: selected ? 'rgba(237,231,220,0.32)' : 'var(--color-stone)', marginBottom: '1.4rem', transition: 'color 1s ease' }}>
            {stay ? `${hotelName ?? 'Your stay'} · ${new Date(stay.check_in).toLocaleDateString('en', { month: 'short', day: 'numeric' })}–${new Date(stay.check_out).toLocaleDateString('en', { month: 'short', day: 'numeric' })}` : 'Your stay'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.8rem' }}>
            {activeServices.map(a => (
              <Link key={a.l} href={a.h}>
                <div
                  style={{ borderRadius: '14px', padding: '1.15rem 1rem', cursor: 'pointer', background: selected ? 'rgba(255,255,255,0.045)' : 'rgba(250,250,247,0.72)', border: selected ? '1px solid rgba(255,255,255,0.065)' : '1px solid rgba(200,184,154,0.18)', transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px) scale(1.025)'; el.style.boxShadow = selected ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'; el.style.background = selected ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.95)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'none'; el.style.boxShadow = 'none'; el.style.background = selected ? 'rgba(255,255,255,0.045)' : 'rgba(250,250,247,0.72)' }}
                >
                  <p style={{ fontSize: '1rem', marginBottom: '0.45rem', color: selected ? (selected.accent) : 'var(--color-forest)', transition: 'color 1s ease' }}>{a.i}</p>
                  <p style={{ fontWeight: 400, fontSize: '0.86rem', fontFamily: 'var(--font-sans)', color: selected ? '#FAFAF7' : 'var(--color-deep)', marginBottom: '0.25rem', transition: 'color 1s ease' }}>{a.l}</p>
                  <p style={{ fontSize: '0.7rem', color: selected ? 'rgba(237,231,220,0.38)' : 'var(--color-bark)', transition: 'color 1s ease' }}>{a.hint}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
