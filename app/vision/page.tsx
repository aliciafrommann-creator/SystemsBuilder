'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const CX = 400, CY = 265

const HOTELS = [
  { id: 'h1', label: 'Berghotel Sonnwend', x: 270, y: 150 },
  { id: 'h2', label: 'Alpenrose Sölden',   x: 530, y: 130 },
  { id: 'h3', label: 'Hotel Edelweiss',    x: 560, y: 375 },
  { id: 'h4', label: 'Gasthof Tyrolia',    x: 240, y: 390 },
]

const PARTNERS = [
  { id: 'p1', label: 'Hof Unterberger',       icon: '🧀', x: 120, y: 265 },
  { id: 'p2', label: 'E-Bike Ötztal',         icon: '🚲', x: 400, y: 58 },
  { id: 'p3', label: 'Alpenthermen',          icon: '♨️', x: 680, y: 250 },
  { id: 'p4', label: 'Bäckerei Tiefenbacher', icon: '🍞', x: 400, y: 472 },
]

type Dot = { id: number; fx: number; fy: number; tx: number; ty: number; t: number }

export default function VisionPage() {
  const [phase, setPhase] = useState(0)
  const [dots, setDots]   = useState<Dot[]>([])
  const dotId = useRef(0)
  const tick  = useRef(0)

  useEffect(() => {
    const T = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2900),
      setTimeout(() => setPhase(4), 4400),
      setTimeout(() => setPhase(5), 6000),
    ]
    return () => T.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (phase < 4) return
    const nodes = [...HOTELS, ...PARTNERS]
    const spawn = setInterval(() => {
      const src = nodes[tick.current % nodes.length]
      tick.current++
      setDots(d => [...d.slice(-20), { id: dotId.current++, fx: src.x, fy: src.y, tx: CX, ty: CY, t: 0 }])
    }, 300)
    const move = setInterval(() => {
      setDots(d => d.map(o => ({ ...o, t: o.t + 0.022 })).filter(o => o.t < 1))
    }, 16)
    return () => { clearInterval(spawn); clearInterval(move) }
  }, [phase])

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#04090700,#060d0a 40%,#04090700)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', overflow: 'hidden' }}>

      <style>{`@keyframes glowHub{0%,100%{opacity:0.55;}50%{opacity:1;}}`}</style>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: phase >= 5 ? 1 : 0, transition: 'opacity 1.4s ease', maxWidth: 560 }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.45)', marginBottom: '1rem' }}>AlpineFlow · Netzwerk</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', color: '#FAFAF7', lineHeight: 1.2, marginBottom: '0.7rem' }}>
          Ein einzelnes Hotel kann<br />Software kaufen.
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.95rem', color: 'rgba(237,231,220,0.38)', lineHeight: 1.75 }}>
          Aber kein nachhaltiges Hospitality-Ecosystem alleine aufbauen.
        </p>
      </div>

      <svg viewBox="0 0 800 530" style={{ width: '100%', maxWidth: 720, height: 'auto' }}>

        {HOTELS.map(h => (
          <line key={h.id} x1={CX} y1={CY} x2={h.x} y2={h.y}
            stroke="rgba(201,169,110,0.2)" strokeWidth={1}
            style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 1s ease' }} />
        ))}

        {PARTNERS.map(p => (
          <line key={p.id} x1={CX} y1={CY} x2={p.x} y2={p.y}
            stroke="rgba(74,138,106,0.15)" strokeWidth={1}
            style={{ opacity: phase >= 3 ? 1 : 0, transition: 'opacity 1s ease' }} />
        ))}

        {dots.map(d => (
          <circle key={d.id}
            cx={d.fx + (d.tx - d.fx) * d.t}
            cy={d.fy + (d.ty - d.fy) * d.t}
            r={2.2} fill="#C9A96E" opacity={Math.sin(d.t * Math.PI) * 0.75} />
        ))}

        {HOTELS.map((h, i) => (
          <g key={h.id} style={{ opacity: phase >= 2 ? 1 : 0, transition: `opacity 0.7s ease ${i * 0.15}s` }}>
            <circle cx={h.x} cy={h.y} r={20} fill="rgba(45,74,62,0.28)" stroke="rgba(201,169,110,0.28)" strokeWidth={1} />
            <circle cx={h.x} cy={h.y} r={7}  fill="#2D4A3E" />
            {phase >= 5 && <text x={h.x} y={h.y + 33} textAnchor="middle" fill="rgba(201,169,110,0.55)" fontSize={8.5} fontFamily="sans-serif">{h.label}</text>}
          </g>
        ))}

        {PARTNERS.map((p, i) => (
          <g key={p.id} style={{ opacity: phase >= 3 ? 1 : 0, transition: `opacity 0.7s ease ${i * 0.15}s` }}>
            <circle cx={p.x} cy={p.y} r={17} fill="rgba(20,36,18,0.5)" stroke="rgba(74,138,106,0.28)" strokeWidth={1} />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={12}>{p.icon}</text>
            {phase >= 5 && <text x={p.x} y={p.y + 28} textAnchor="middle" fill="rgba(74,138,106,0.55)" fontSize={7.5} fontFamily="sans-serif">{p.label}</text>}
          </g>
        ))}

        {phase >= 1 && (
          <g>
            <circle cx={CX} cy={CY} r={42} fill="rgba(45,74,62,0.08)" stroke="rgba(201,169,110,0.2)" strokeWidth={1}
              style={{ animation: 'glowHub 3.5s ease-in-out infinite' }} />
            <circle cx={CX} cy={CY} r={26} fill="rgba(45,74,62,0.6)" stroke="rgba(201,169,110,0.4)" strokeWidth={1.5} />
            <text x={CX} y={CY + 4} textAnchor="middle" fill="rgba(201,169,110,0.88)" fontSize={9} fontFamily="sans-serif" letterSpacing="1.5">AF</text>
          </g>
        )}
      </svg>

      <div style={{ display: 'flex', gap: '0.9rem', marginTop: '1.8rem', flexWrap: 'wrap', justifyContent: 'center', opacity: phase >= 5 ? 1 : 0, transition: 'opacity 1.2s ease 0.4s' }}>
        <Link href="/guest?demo=true">
          <button style={{ padding: '12px 28px', borderRadius: 100, background: '#2D4A3E', border: '1px solid rgba(201,169,110,0.28)', color: '#FAFAF7', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.86rem', letterSpacing: '0.06em', cursor: 'pointer', boxShadow: '0 6px 24px rgba(45,74,62,0.45)' }}>Demo starten →</button>
        </Link>
        <Link href="/staff">
          <button style={{ padding: '12px 28px', borderRadius: 100, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(237,231,220,0.55)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.86rem', letterSpacing: '0.06em', cursor: 'pointer' }}>Staff View</button>
        </Link>
      </div>

    </main>
  )
}
