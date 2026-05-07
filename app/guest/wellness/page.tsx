'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const CATS = [
  {
    id: 'spa',
    name: 'Spa & Thermal',
    icon: '◠',
    color: '#9B7D5E',
    headerImg: IMG('photo-1544161515-4ab6ce6db874'),
    sessions: [
      { time: '08:00', label: 'Alpine Stone Ritual',   duration: '90 min', price: 120, avail: true,  img: IMG('photo-1544161515-4ab6ce6db874'), desc: 'Heated Tyrolean granite stones, local pine oil, mountain herb compress. The signature treatment of Berghotel Sonnwend.' },
      { time: '10:30', label: 'Deep Tissue Massage',   duration: '60 min', price: 85,  avail: true,  img: IMG('photo-1600334129128-685c5582fd35'), desc: 'Targeted deep tissue work with certified alpine therapists. Loosens the legs after mountain trails.' },
      { time: '14:00', label: 'Thermal Bath & Rest',   duration: '120 min',price: 65,  avail: false, img: IMG('photo-1519817650390-64a9db95544b'), desc: 'Alpine thermal pools, Finnish sauna, salt steam room, and silent relaxation lounge.' },
      { time: '16:30', label: 'Evening Aromatherapy',  duration: '75 min', price: 95,  avail: true,  img: IMG('photo-1540555700478-4be289fbecef'), desc: 'Alpine essential oils — pine, arnica, edelweiss — in a candlelit evening ritual.' },
    ],
  },
  {
    id: 'movement',
    name: 'Movement',
    icon: '◯',
    color: '#2D4A3E',
    headerImg: IMG('photo-1506126613408-eca07ce68773'),
    sessions: [
      { time: '07:00', label: 'Sunrise Yoga Terrace',   duration: '60 min', price: 45, avail: true,  img: IMG('photo-1506126613408-eca07ce68773'),  desc: 'Guided yoga on the Sonnwend terrace as the Oetztal valley fills with morning light. All levels.' },
      { time: '09:00', label: 'Alpine Meditation Walk', duration: '90 min', price: 55, avail: true,  img: IMG('photo-1441974231531-c6227db76b6e'),  desc: 'Silent guided walk into the Oetztal forest. The guide speaks only to point. You lead the pace.' },
      { time: '11:00', label: 'Pilates Studio',         duration: '50 min', price: 42, avail: false, img: IMG('photo-1518611012118-696072aa579a'),  desc: 'Small-group reformer pilates in the hotel studio. Maximum 6 guests.' },
      { time: '17:00', label: 'Forest Breathwork',      duration: '45 min', price: 38, avail: true,  img: IMG('photo-1503435980610-a51f3ddfee50'),  desc: 'Cold morning pine air and the Wim Hof method in the Oetztal forest. Complete nervous system reset.' },
    ],
  },
  {
    id: 'nourish',
    name: 'Nourishment',
    icon: '◈',
    color: '#4A6741',
    headerImg: IMG('photo-1414235077428-338989a2e8c0'),
    sessions: [
      { time: '07:30', label: 'Morning Juice Ritual',   duration: '20 min', price: 18, avail: true,  img: IMG('photo-1610832958506-aa56368176cf'),  desc: 'Cold-pressed alpine herb juices prepared from the hotel garden. Daily seasonal blend.' },
      { time: '12:30', label: 'Herb Garden Lunch',      duration: '60 min', price: 45, avail: true,  img: IMG('photo-1416879595882-3373a0480b5b'),  desc: "A curated lunch from the hotel's own käutergarten: soups, salads, Tyrolean bread." },
      { time: '15:00', label: 'Alpine Tea Ceremony',    duration: '30 min', price: 22, avail: true,  img: IMG('photo-1544787219-7f47ccb76574'),  desc: 'Six alpine herb teas, explained by the host. Lemon balm, arnica, mountain thyme, gentian.' },
      { time: '19:00', label: 'Forest-to-Table Dinner', duration: '90 min', price: 85, avail: true,  img: IMG('photo-1414235077428-338989a2e8c0'),  desc: '6-course dinner, all ingredients sourced within 40 km. Paired with Austrian natural wines.' },
    ],
  },
]

type Session = typeof CATS[0]['sessions'][0]
type Cat = typeof CATS[0]

export default function WellnessPage() {
  const [cat, setCat]         = useState('spa')
  const [booking, setBooking] = useState<{ session: Session; cat: Cat } | null>(null)
  const [payStep, setPayStep] = useState<'choose' | 'processing' | 'done'>('choose')
  const [loaded, setLoaded]   = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])

  const current = CATS.find(c => c.id === cat)!

  const openBooking = (session: Session) => {
    setBooking({ session, cat: current })
    setPayStep('choose')
  }

  const handlePay = async (method: 'online' | 'room') => {
    setPayStep('processing')
    // Simulate API call / Stripe redirect
    await new Promise(r => setTimeout(r, 1400))
    if (method === 'online') {
      // In production: POST /api/checkout then redirect to session.url
      // The hotel's Stripe account receives the payment directly
      setPayStep('done')
    } else {
      setPayStep('done')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F0EBE3 0%, #E8E0D4 100%)' }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.35rem 2rem', position: 'sticky', top: 0, zIndex: 20, background: 'rgba(247,244,239,0.9)', backdropFilter: 'blur(22px)', borderBottom: '1px solid rgba(200,184,154,0.18)' }}>
        <Link href="/"><span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.25rem', color: 'var(--color-deep)', cursor: 'pointer' }}>AlpineFlow</span></Link>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--color-stone)' }}>Berghotel Sonnwend &middot; Ötztal</span>
        <Link href="/guest"><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--color-stone)', cursor: 'pointer' }}>Back to stay</span></Link>
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img
          src={current.headerImg}
          alt={current.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.8s ease' }}
          key={current.id}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(15,20,18,0.65) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(14px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,231,220,0.6)', marginBottom: '0.5rem' }}>Wellness</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem,4.5vw,3.2rem)', letterSpacing: '-0.025em', lineHeight: 1.05, color: '#FAFAF7', marginBottom: 0 }}>
            Restore.<br /><em style={{ fontStyle: 'italic', color: 'rgba(201,169,110,0.9)' }}>Deeply.</em>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 2rem 5rem', opacity: loaded ? 1 : 0, transition: 'opacity 1s ease' }}>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ background: cat === c.id ? c.color : 'rgba(250,250,247,0.8)', color: cat === c.id ? '#FAFAF7' : 'var(--color-earth)', border: cat === c.id ? `1px solid ${c.color}` : '1px solid rgba(200,184,154,0.28)', padding: '8px 20px', borderRadius: 100, fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', letterSpacing: '0.02em', cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow: cat === c.id ? `0 4px 18px ${c.color}40` : 'none' }}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {current.sessions.map((s, i) => (
            <div
              key={s.time}
              style={{
                display: 'flex', borderRadius: 16, overflow: 'hidden',
                background: 'rgba(250,248,244,0.85)',
                border: '1px solid rgba(200,184,154,0.2)',
                opacity: s.avail ? 1 : 0.48,
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { if (s.avail) (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${current.color}18` }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Session image */}
              <div style={{ width: 100, flexShrink: 0, overflow: 'hidden' }}>
                <img src={s.img} alt={s.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              {/* Content */}
              <div style={{ flex: 1, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ minWidth: 44 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: current.color, fontWeight: 300, lineHeight: 1 }}>{s.time}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-stone)', marginTop: 2 }}>{s.duration}</p>
                </div>
                <div style={{ width: 1, height: 32, background: 'rgba(200,184,154,0.25)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1rem', color: 'var(--color-deep)', marginBottom: 3 }}>{s.label}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.75rem', color: 'var(--color-stone)', lineHeight: 1.5 }}>{s.desc.split('.')[0]}.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.1rem', color: current.color }}>€{s.price}</span>
                  {s.avail ? (
                    <button onClick={() => openBooking(s)} style={{ background: current.color, color: '#FAFAF7', borderRadius: 100, padding: '6px 18px', fontSize: '0.75rem', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 300, letterSpacing: '0.04em', boxShadow: `0 4px 16px ${current.color}35`, whiteSpace: 'nowrap' }}>Book</button>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-stone)' }}>Full today</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking modal */}
      {booking && (
        <div
          onClick={e => { if (e.target === e.currentTarget) { setBooking(null) } }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,18,0.6)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div style={{ width: '100%', maxWidth: 560, borderRadius: '20px 20px 0 0', background: '#FAFAF7', padding: '2rem', boxShadow: '0 -8px 48px rgba(0,0,0,0.2)' }}>

            {payStep === 'choose' && (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <img src={booking.session.img} alt={booking.session.label} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: booking.cat.color, marginBottom: 4 }}>{booking.cat.name}</p>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.25rem', color: 'var(--color-deep)', marginBottom: 2 }}>{booking.session.label}</h3>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.78rem', color: 'var(--color-stone)' }}>{booking.session.time} &middot; {booking.session.duration}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.8rem', color: booking.cat.color, lineHeight: 1 }}>€{booking.session.price}</p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.65rem', color: 'var(--color-stone)', marginTop: 2 }}>incl. VAT</p>
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.85rem', color: 'var(--color-earth)', lineHeight: 1.65, marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(200,184,154,0.2)' }}>{booking.session.desc}</p>

                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: '0.875rem' }}>How would you like to pay?</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => handlePay('online')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 14, background: booking.cat.color, border: 'none', cursor: 'pointer', boxShadow: `0 4px 20px ${booking.cat.color}40` }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.88rem', color: '#FAFAF7', marginBottom: 2 }}>Pay now online</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(237,231,220,0.65)' }}>Secure payment &middot; directly to hotel</p>
                    </div>
                    <span style={{ color: 'rgba(237,231,220,0.8)', fontSize: '1.1rem' }}>&#8594;</span>
                  </button>

                  <button
                    onClick={() => handlePay('room')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 14, background: 'rgba(250,248,244,0.9)', border: '1px solid rgba(200,184,154,0.28)', cursor: 'pointer' }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.88rem', color: 'var(--color-deep)', marginBottom: 2 }}>Charge to room bill</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'var(--color-stone)' }}>Room 214 &middot; settle at checkout</p>
                    </div>
                    <span style={{ color: 'var(--color-stone)', fontSize: '1.1rem' }}>&#8594;</span>
                  </button>
                </div>

                <button onClick={() => setBooking(null)} style={{ background: 'none', border: 'none', color: 'var(--color-stone)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.78rem', cursor: 'pointer', width: '100%', padding: '0.5rem' }}>Cancel</button>
              </>
            )}

            {payStep === 'processing' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${booking.cat.color}30`, borderTopColor: booking.cat.color, margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.2rem', color: 'var(--color-deep)' }}>Confirming your booking&hellip;</p>
              </div>
            )}

            {payStep === 'done' && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${booking.cat.color}15`, border: `1.5px solid ${booking.cat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', color: booking.cat.color }}>✓</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.4rem', color: 'var(--color-deep)', marginBottom: '0.5rem' }}>Booked.</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', color: 'var(--color-bark)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {booking.session.label} at {booking.session.time}.<br />Added to your stay at Berghotel Sonnwend.
                </p>
                <button onClick={() => setBooking(null)} style={{ background: booking.cat.color, color: '#FAFAF7', border: 'none', borderRadius: 100, padding: '10px 28px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.04em' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )
}
