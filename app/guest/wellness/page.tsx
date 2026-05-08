'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useStay } from '@/lib/alpineflow/stay-context'
import { useMode } from '@/lib/alpineflow/mode-context'

const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const CATS = [
  {
    id: 'spa', name: 'Spa & Thermal', icon: '◠', color: '#9B7D5E',
    headerImg: IMG('photo-1544161515-4ab6ce6db874'),
    sessions: [
      { time: '08:00', label: 'Alpine Stone Ritual',  duration: '90 min', price: 120, avail: true,  img: IMG('photo-1544161515-4ab6ce6db874'), desc: 'Heated Tyrolean granite stones, local pine oil, mountain herb compress. The signature treatment of Berghotel Sonnwend.' },
      { time: '10:30', label: 'Deep Tissue Massage',  duration: '60 min', price: 85,  avail: true,  img: IMG('photo-1600334129128-685c5582fd35'), desc: 'Targeted deep tissue work with certified alpine therapists. Loosens the legs after mountain trails.' },
      { time: '14:00', label: 'Thermal Bath & Rest',  duration: '120 min',price: 65,  avail: false, img: IMG('photo-1519817650390-64a9db95544b'), desc: 'Alpine thermal pools, Finnish sauna, salt steam room, and silent relaxation lounge.' },
      { time: '16:30', label: 'Evening Aromatherapy', duration: '75 min', price: 95,  avail: true,  img: IMG('photo-1540555700478-4be289fbecef'), desc: 'Alpine essential oils — pine, arnica, edelweiss — in a candlelit evening ritual.' },
    ],
  },
  {
    id: 'movement', name: 'Movement', icon: '◯', color: '#2D4A3E',
    headerImg: IMG('photo-1506126613408-eca07ce68773'),
    sessions: [
      { time: '07:00', label: 'Sunrise Yoga Terrace',   duration: '60 min', price: 45, avail: true,  img: IMG('photo-1506126613408-eca07ce68773'),  desc: 'Guided yoga on the Sonnwend terrace as the Oetztal valley fills with morning light. All levels.' },
      { time: '09:00', label: 'Alpine Meditation Walk', duration: '90 min', price: 55, avail: true,  img: IMG('photo-1441974231531-c6227db76b6e'),  desc: 'Silent guided walk into the Oetztal forest. The guide speaks only to point. You lead the pace.' },
      { time: '11:00', label: 'Pilates Studio',         duration: '50 min', price: 42, avail: false, img: IMG('photo-1518611012118-696072aa579a'),  desc: 'Small-group reformer pilates in the hotel studio. Maximum 6 guests.' },
      { time: '17:00', label: 'Forest Breathwork',      duration: '45 min', price: 38, avail: true,  img: IMG('photo-1503435980610-a51f3ddfee50'),  desc: 'Cold morning pine air and the Wim Hof method in the Oetztal forest. Complete nervous system reset.' },
    ],
  },
  {
    id: 'nourish', name: 'Nourishment', icon: '◈', color: '#4A6741',
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
  const { stay } = useStay()
  const { mode } = useMode()
  const isDark = !!mode
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
    if (stay && booking) {
      await supabase.from('bookings').insert({
        stay_id: stay.id,
        hotel_id: stay.hotel_id,
        session_label: booking.session.label,
        session_time: booking.session.time,
        duration: booking.session.duration,
        price_cents: booking.session.price * 100,
        payment_method: method,
        status: 'confirmed',
      })
    }
    await new Promise(r => setTimeout(r, 900))
    setPayStep('done')
  }

  const mainBg = isDark
    ? `radial-gradient(ellipse at 30% 40%, ${mode.light}55 0%, ${mode.bg} 65%)`
    : 'linear-gradient(160deg, #F0EBE3 0%, #E8E0D4 100%)'

  const headerBg     = isDark ? 'rgba(0,0,0,0.18)' : 'rgba(247,244,239,0.9)'
  const headerBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(200,184,154,0.18)'
  const brandCol     = isDark ? 'rgba(250,250,247,0.92)' : 'var(--color-deep)'
  const stoneCol     = isDark ? 'rgba(237,231,220,0.45)' : 'var(--color-stone)'
  const catBtnBase   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(250,250,247,0.8)'
  const catBtnBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(200,184,154,0.28)'
  const catBtnText   = isDark ? 'rgba(237,231,220,0.7)' : 'var(--color-earth)'

  return (
    <main style={{ minHeight: '100vh', background: mainBg, transition: 'background 1.2s cubic-bezier(0.16,1,0.3,1)' }}>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.35rem 2rem', position: 'sticky', top: 0, zIndex: 20, background: headerBg, backdropFilter: 'blur(22px)', borderBottom: headerBorder, transition: 'all 1s ease' }}>
        <Link href="/"><span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.25rem', color: brandCol, cursor: 'pointer' }}>AlpineFlow</span></Link>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.1em', color: stoneCol }}>
          Berghotel Sonnwend &middot; Ötztal
          {mode && <span style={{ color: mode.accent, marginLeft: '0.5rem' }}>&middot; {mode.name}</span>}
        </span>
        <Link href="/guest"><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.08em', color: stoneCol, cursor: 'pointer' }}>Back to stay</span></Link>
      </header>

      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img src={current.headerImg} alt={current.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.8s ease' }} key={current.id} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(15,20,18,0.65) 100%)' }} />
        {isDark && <div style={{ position: 'absolute', inset: 0, background: `${mode.color}40`, mixBlendMode: 'color', pointerEvents: 'none' }} />}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(14px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,231,220,0.6)', marginBottom: '0.5rem' }}>Wellness</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem,4.5vw,3.2rem)', letterSpacing: '-0.025em', lineHeight: 1.05, color: '#FAFAF7' }}>
            Restore.<br /><em style={{ fontStyle: 'italic', color: isDark ? mode.accent : 'rgba(201,169,110,0.9)' }}>Deeply.</em>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem 5rem', opacity: loaded ? 1 : 0, transition: 'opacity 1s ease' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ background: cat === c.id ? (isDark ? mode.accent : c.color) : catBtnBase, color: cat === c.id ? '#FAFAF7' : catBtnText, border: cat === c.id ? 'none' : catBtnBorder, padding: '8px 20px', borderRadius: 100, fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', letterSpacing: '0.02em', cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow: cat === c.id ? `0 4px 18px ${isDark ? mode.accent : c.color}40` : 'none' }}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {current.sessions.map((s) => (
            <div
              key={s.time}
              style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', height: 140, cursor: s.avail ? 'pointer' : 'default', opacity: s.avail ? 1 : 0.5, transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
              onClick={() => s.avail && openBooking(s)}
              onMouseEnter={e => { if (s.avail) { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.012)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${isDark ? mode.accent : current.color}30` } }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)' }}
            >
              <img src={s.img} alt={s.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.55) 100%)' }} />
              <div style={{ position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '0.85rem', color: isDark ? mode.accent : 'rgba(201,169,110,0.85)', marginBottom: 4, letterSpacing: '0.04em' }}>{s.time} &middot; {s.duration}</p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.15rem', color: '#FAFAF7', marginBottom: 5, lineHeight: 1.2 }}>{s.label}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(237,231,220,0.6)', lineHeight: 1.5, maxWidth: '38ch' }}>{s.desc.split('.')[0]}.</p>
              </div>
              <div style={{ position: 'absolute', right: '1.4rem', top: '50%', transform: 'translateY(-50%)', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.5rem', color: '#FAFAF7', lineHeight: 1 }}>€{s.price}</span>
                {s.avail ? (
                  <button onClick={e => { e.stopPropagation(); openBooking(s) }} style={{ background: isDark ? mode.accent : current.color, color: '#FAFAF7', borderRadius: 100, padding: '7px 20px', fontSize: '0.75rem', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 300, letterSpacing: '0.05em', boxShadow: `0 4px 16px ${isDark ? mode.accent : current.color}50`, whiteSpace: 'nowrap' }}>Book</button>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'rgba(237,231,220,0.5)', fontFamily: 'var(--font-sans)' }}>Full today</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {booking && (
        <div onClick={e => { if (e.target === e.currentTarget) setBooking(null) }} style={{ position: 'fixed', inset: 0, background: 'rgba(10,12,10,0.72)', backdropFilter: 'blur(10px)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 560, borderRadius: '22px 22px 0 0', background: '#FAFAF7', overflow: 'hidden', boxShadow: '0 -12px 60px rgba(0,0,0,0.28)' }}>
            {payStep === 'choose' && (
              <>
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                  <img src={booking.session.img} alt={booking.session.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'kenBurns 9s ease-in-out infinite alternate' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.68) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '1.4rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: isDark ? mode.accent : 'rgba(201,169,110,0.75)', marginBottom: 4 }}>{booking.cat.name}</p>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.45rem', color: '#FAFAF7', lineHeight: 1.15 }}>{booking.session.label}</h3>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(237,231,220,0.6)', marginTop: 4 }}>{booking.session.time} &middot; {booking.session.duration}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '2.2rem', color: '#FAFAF7', lineHeight: 1 }}>€{booking.session.price}</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', color: 'rgba(237,231,220,0.45)', marginTop: 2 }}>incl. VAT</p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.85rem', color: 'var(--color-earth)', lineHeight: 1.65, marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(200,184,154,0.2)' }}>{booking.session.desc}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: '0.875rem' }}>How would you like to pay?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                    <button onClick={() => handlePay('online')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 14, background: isDark ? mode.accent : booking.cat.color, border: 'none', cursor: 'pointer', boxShadow: `0 4px 20px ${isDark ? mode.accent : booking.cat.color}40` }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.88rem', color: '#FAFAF7', marginBottom: 2 }}>Pay now online</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(237,231,220,0.65)' }}>Secure payment &middot; directly to hotel</p>
                      </div>
                      <span style={{ color: 'rgba(237,231,220,0.8)', fontSize: '1.1rem' }}>&#8594;</span>
                    </button>
                    <button onClick={() => handlePay('room')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 14, background: 'rgba(250,248,244,0.9)', border: '1px solid rgba(200,184,154,0.28)', cursor: 'pointer' }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.88rem', color: 'var(--color-deep)', marginBottom: 2 }}>Charge to room bill</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'var(--color-stone)' }}>Room {stay?.room_number ?? '201'} &middot; settle at checkout</p>
                      </div>
                      <span style={{ color: 'var(--color-stone)', fontSize: '1.1rem' }}>&#8594;</span>
                    </button>
                  </div>
                  <button onClick={() => setBooking(null)} style={{ background: 'none', border: 'none', color: 'var(--color-stone)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.78rem', cursor: 'pointer', width: '100%', padding: '0.5rem' }}>Cancel</button>
                </div>
              </>
            )}
            {payStep === 'processing' && (
              <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${isDark ? mode.accent : booking.cat.color}30`, borderTopColor: isDark ? mode.accent : booking.cat.color, margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.2rem', color: 'var(--color-deep)' }}>Confirming your booking&#8230;</p>
              </div>
            )}
            {payStep === 'done' && (
              <div style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${isDark ? mode.accent : booking.cat.color}15`, border: `1.5px solid ${isDark ? mode.accent : booking.cat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', color: isDark ? mode.accent : booking.cat.color }}>&#10003;</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.4rem', color: 'var(--color-deep)', marginBottom: '0.5rem' }}>Booked.</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', color: 'var(--color-bark)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {booking.session.label} at {booking.session.time}.<br />Added to your stay at Berghotel Sonnwend.
                </p>
                <button onClick={() => setBooking(null)} style={{ background: isDark ? mode.accent : booking.cat.color, color: '#FAFAF7', border: 'none', borderRadius: 100, padding: '10px 28px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.04em' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes kenBurns {
          from { transform: scale(1.0) translate(0%, 0%); }
          to   { transform: scale(1.12) translate(-2%, -1%); }
        }
      `}</style>
    </main>
  )
}
