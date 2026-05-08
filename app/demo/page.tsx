'use client'
import { useEffect } from 'react'
import Link from 'next/link'

const ROUTES = [
  { label: 'Lobby',          sub: 'Cinematic 3D Eingang',        href: '/?demo=true',                   icon: '◯' },
  { label: 'Guest Hub',      sub: 'Stay-Modus + Services',        href: '/guest?demo=true',              icon: '◇' },
  { label: 'Housekeeping',   sub: 'Zimmer & Wünsche',             href: '/guest/housekeeping?demo=true', icon: '◊' },
  { label: 'Wellness',       sub: 'Buchung & Erlebnis',           href: '/guest/wellness?demo=true',     icon: '○' },
  { label: 'Discovery',      sub: 'Lokale Orte & Karte',          href: '/guest/discovery?demo=true',    icon: '◈' },
  { label: 'Impact',         sub: 'Regionale Produzenten',        href: '/guest/sustainability?demo=true',icon: '◠' },
  { label: 'Staff View',     sub: 'Echtzeit-Dashboard',           href: '/staff',                        icon: '▦' },
  { label: 'Platform Vision',sub: 'Das Netzwerk',                 href: '/vision',                       icon: '◎' },
]

export default function DemoPage() {
  useEffect(() => {
    localStorage.setItem('af_demo', 'true')
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060d0a,#0d1c14 55%,#060d0a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.45)', marginBottom: '0.8rem' }}>Demo · Berghotel Sonnwend</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#FAFAF7', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-0.02em' }}>AlpineFlow</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', color: 'rgba(237,231,220,0.35)', marginBottom: '3rem', textAlign: 'center' }}>Maria Gruber · Zimmer 201 · Ötztal, Tirol</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.75rem', width: '100%', maxWidth: 720 }}>
        {ROUTES.map(r => (
          <Link key={r.href} href={r.href}>
            <div style={{ borderRadius: 16, padding: '1.2rem 1.4rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.transform = 'translateY(-3px)'; el.style.borderColor = 'rgba(201,169,110,0.25)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(255,255,255,0.03)'; el.style.transform = 'none'; el.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >
              <p style={{ fontSize: '1.1rem', color: 'rgba(201,169,110,0.6)', marginBottom: '0.5rem' }}>{r.icon}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.88rem', color: '#FAFAF7', marginBottom: '0.2rem' }}>{r.label}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(237,231,220,0.32)' }}>{r.sub}</p>
            </div>
          </Link>
        ))}
      </div>
      <p style={{ marginTop: '2.5rem', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.18)', letterSpacing: '0.06em' }}>Demo-Modus aktiv · Keine echten Daten</p>
    </main>
  )
}
