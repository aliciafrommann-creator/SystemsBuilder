'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BookingSuccess() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 120); return () => clearTimeout(t) }, [])

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '2rem', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(45,74,62,0.1)', border: '1.5px solid rgba(45,74,62,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '1.5rem' }}>
          ✓
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: '0.75rem' }}>Booking confirmed</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--color-deep)', marginBottom: '1rem' }}>
          We look forward<br /><em style={{ fontStyle: 'italic', color: 'var(--color-forest)' }}>to seeing you.</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.95rem', color: 'var(--color-bark)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '36ch', margin: '0 auto 2.5rem' }}>
          Your booking is confirmed. A receipt has been sent and added to your stay at Berghotel Sonnwend.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link href="/guest/wellness">
            <button style={{ background: '#2D4A3E', color: '#FAFAF7', border: 'none', borderRadius: 100, padding: '10px 24px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', letterSpacing: '0.05em', cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,74,62,0.3)' }}>More sessions</button>
          </Link>
          <Link href="/guest">
            <button style={{ background: 'transparent', border: '1px solid rgba(200,184,154,0.35)', color: 'var(--color-earth)', borderRadius: 100, padding: '10px 20px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', cursor: 'pointer' }}>Back to stay</button>
          </Link>
        </div>
      </div>
    </main>
  )
}
