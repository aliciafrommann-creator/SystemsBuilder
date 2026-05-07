'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { generateVoucherCode } from '@/lib/alpineflow/stripe-connect'

const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const WEATHER = { temp: 14, desc: 'Partly cloudy', wind: '12 km/h NW', icon: '⛅' }

const CATS = ['All', 'Nature', 'Culture', 'Wellness', 'Food', 'Mobility', 'Partners'] as const
type Cat = typeof CATS[number]

const ITEMS = [
  {
    id: 1, name: 'Alpenrosen Weg', type: 'Nature' as Cat,
    distance: '1.2 km', time: '45 min', difficulty: 'Easy',
    desc: 'A gentle path through alpine rose meadows above Obergurgl. Peak bloom June–August. Granite outcrops and panoramic Oetztal valley views at every turn.',
    mood: 'Still & vast', season: 'Summer',
    color: '#2D4A3E', bg: 'linear-gradient(160deg, #1a3028 0%, #2d4a3e 50%, #4a7a58 100%)',
    tags: ['Walking', 'Views', 'Alpine flora'], direction: 'NE', bearing: 48, isPartner: false,
    img: IMG('photo-1464822759023-fed622ff2c3b'),
  },
  {
    id: 2, name: 'Sennalm Längenfeld', type: 'Food' as Cat,
    distance: '3.4 km', time: '2 h', difficulty: 'Moderate',
    desc: 'Traditional alpine dairy producing Graukase and mountain butter since 1847. Watch the morning process and taste directly from the wheel.',
    mood: 'Warm & rooted', season: 'All year',
    color: '#7a5830', bg: 'linear-gradient(160deg, #3a2810 0%, #7a5830 50%, #b88840 100%)',
    tags: ['Local', 'Food', 'Heritage'], direction: 'E', bearing: 92, isPartner: true,
    partnerDiscount: { label: '15% guest discount', code: '', saving: '€4 off tasting' },
    img: IMG('photo-1452195100486-9cc7a768be89'),
  },
  {
    id: 3, name: 'Pestkapelle Sölden', type: 'Culture' as Cat,
    distance: '0.8 km', time: '20 min', difficulty: 'Easy',
    desc: 'A 14th-century plague chapel perched on a rocky outcrop above Sölden. Frescoes, silence, and a view unchanged since the medieval period.',
    mood: 'Quiet & ancient', season: 'All year',
    color: '#5a4830', bg: 'linear-gradient(160deg, #2a2018 0%, #5a4830 50%, #8a7050 100%)',
    tags: ['History', 'Architecture', 'Silence'], direction: 'W', bearing: 270, isPartner: false,
    img: IMG('photo-1548502499-ef49dcf78038'),
  },
  {
    id: 4, name: 'Wildwasser Kneipp', type: 'Wellness' as Cat,
    distance: '0.4 km', time: '30 min', difficulty: 'Easy',
    desc: 'A natural cold-water Kneipp path fed by glacial melt from the Oetztal glaciers. Water temperature: 7°C. Three circuits, full reset.',
    mood: 'Sharp & alive', season: 'May–Oct',
    color: '#1e3a58', bg: 'linear-gradient(160deg, #0e2038 0%, #1e3a58 50%, #3a6080 100%)',
    tags: ['Cold water', 'Wellness', 'Reset'], direction: 'N', bearing: 12, isPartner: false,
    img: IMG('photo-1520962880247-cfaf541d8354'),
  },
  {
    id: 5, name: 'Gasthof Schiefer Giebel', type: 'Food' as Cat,
    distance: '5.1 km', time: '3 h hike', difficulty: 'Moderate',
    desc: 'A mountain Gasthof at 2,100 m with Kasspatzln, smoked Oetztal trout, and Zirbenschnaps. 18 seats. Reserve via the hotel concierge.',
    mood: 'Convivial & slow', season: 'Jun–Sep',
    color: '#4A6741', bg: 'linear-gradient(160deg, #1e3018 0%, #4a6741 50%, #7a9a60 100%)',
    tags: ['Dining', 'Regional', 'Hike-to'], direction: 'SE', bearing: 135, isPartner: true,
    partnerDiscount: { label: 'Complimentary Zirbenschnaps', code: '', saving: 'welcome drink' },
    img: IMG('photo-1414235077428-338989a2e8c0'),
  },
  {
    id: 6, name: 'E-Bike Ötztal Circuit', type: 'Mobility' as Cat,
    distance: '38 km', time: '2.5 h', difficulty: 'Easy',
    desc: 'Solar-charged e-bike loop through the valley floor, past two glacial lakes and the villages of Längenfeld, Umhausen, and Haiming.',
    mood: 'Free & flowing', season: 'Apr–Oct',
    color: '#284850', bg: 'linear-gradient(160deg, #0e2830 0%, #284850 50%, #4a7888 100%)',
    tags: ['E-Bike', 'Zero emission', 'Lakes'], direction: 'S', bearing: 185, isPartner: false,
    img: IMG('photo-1471623432079-b009d30b6729'),
  },
  {
    id: 7, name: 'Aqua Dome Längenfeld', type: 'Partners' as Cat,
    distance: '4.2 km', time: 'Half day', difficulty: 'Easy',
    desc: 'The iconic thermal spa of the Ötztal. Three outdoor thermal pools at different temperatures, sauna world, and panoramic mountain views. AlpineFlow guests pay the local resident rate.',
    mood: 'Warm & vast', season: 'All year',
    color: '#1e3a58', bg: 'linear-gradient(160deg, #0e2038 0%, #1e3a58 50%, #4a6888 100%)',
    tags: ['Thermal', 'Premium', 'Spa'], direction: 'S', bearing: 195, isPartner: true,
    partnerDiscount: { label: '€18 off entry', code: '', saving: 'Standard: €38 → €20' },
    img: IMG('photo-1519817650390-64a9db95544b'),
  },
  {
    id: 8, name: 'Timmelsjoch Sunrise', type: 'Nature' as Cat,
    distance: '2.2 km', time: '1.5 h', difficulty: 'Moderate',
    desc: 'A glacial lake at 1,840 m on the path toward the Timmelsjoch pass. Depart at 5:30 am. The first light lasts 12 minutes. Nothing else like it.',
    mood: 'Awe & solitude', season: 'May–Oct',
    color: '#1a2a48', bg: 'linear-gradient(160deg, #0e1828 0%, #1a2a48 50%, #3a5888 100%)',
    tags: ['Sunrise', 'Glacial lake', 'Photography'], direction: 'NE', bearing: 65, isPartner: false,
    img: IMG('photo-1501854140801-50d01698950b'),
  },
]

function Compass({ bearing, color }: { bearing: number; color: string }) {
  const r = 36, rad = (bearing - 90) * (Math.PI / 180)
  const x = 50 + r * Math.cos(rad), y = 50 + r * Math.sin(rad)
  return (
    <svg width="90" height="90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(200,184,154,0.2)" strokeWidth="1" />
      <circle cx="50" cy="50" r="2.5" fill="rgba(200,184,154,0.4)" />
      {['N','E','S','W'].map((d,i)=>{ const a=(i*90-90)*Math.PI/180; return <text key={d} x={50+38*Math.cos(a)} y={50+38*Math.sin(a)+4} textAnchor="middle" fontSize="8" fill="rgba(200,180,150,0.55)" fontFamily="sans-serif">{d}</text>})}
      <circle cx={x} cy={y} r="5" fill={color} opacity="0.9"/>
      <line x1="50" y1="50" x2={x} y2={y} stroke={color} strokeWidth="1.5" opacity="0.45" strokeDasharray="3 2"/>
    </svg>
  )
}

export default function DiscoveryPage() {
  const [filter, setFilter]   = useState<Cat>('All')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [vouchers, setVouchers] = useState<Record<number, string>>({})
  const [loaded, setLoaded]   = useState(false)
  const [saved, setSaved]     = useState<number[]>([])
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])

  const visible = filter === 'All' ? ITEMS : ITEMS.filter(d => d.type === filter)
  const hero = expanded ? ITEMS.find(d => d.id === expanded) : null

  const getVoucher = (item: typeof ITEMS[0]) => {
    if (vouchers[item.id]) return
    const prefix = item.name.split(' ')[0].toUpperCase().slice(0, 4)
    setVouchers(v => ({ ...v, [item.id]: generateVoucherCode(prefix) }))
  }

  return (
    <main style={{ minHeight: '100vh', background: hero ? hero.bg : 'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)', transition: 'background 1.5s cubic-bezier(0.16,1,0.3,1)' }}>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.35rem 2rem', position: 'sticky', top: 0, zIndex: 20, background: hero ? 'rgba(0,0,0,0.15)' : 'rgba(247,244,239,0.9)', backdropFilter: 'blur(22px)', borderBottom: hero ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(200,184,154,0.18)', transition: 'all 1s ease' }}>
        <Link href="/"><span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.25rem', color: hero ? 'rgba(250,250,247,0.92)' : 'var(--color-deep)', cursor: 'pointer', transition: 'color 1s ease' }}>AlpineFlow</span></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1rem' }}>{WEATHER.icon}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: hero ? 'rgba(237,231,220,0.55)' : 'var(--color-stone)', transition: 'color 1s ease' }}>{WEATHER.temp}°C &middot; {WEATHER.desc}</span>
        </div>
        <Link href="/guest"><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.08em', color: hero ? 'rgba(237,231,220,0.5)' : 'var(--color-stone)', cursor: 'pointer', transition: 'color 1s ease' }}>Back to stay</span></Link>
      </header>

      {/* Expanded hero */}
      {hero && (
        <div style={{ padding: '3rem 2rem 2rem', maxWidth: 920, margin: '0 auto' }}>
          <button onClick={() => setExpanded(null)} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(237,231,220,0.75)', borderRadius: 100, padding: '6px 16px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.75rem', cursor: 'pointer', marginBottom: '2rem', backdropFilter: 'blur(12px)' }}>← Back</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
              <img src={hero.img} alt={hero.name} style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 16, marginBottom: '1.5rem' }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', marginBottom: '0.5rem' }}>{hero.type} &middot; {hero.distance}</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', letterSpacing: '-0.025em', lineHeight: 1.08, color: '#FAFAF7', marginBottom: '1rem' }}>{hero.name}</h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.95rem', color: 'rgba(237,231,220,0.75)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '46ch' }}>{hero.desc}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {hero.tags.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 100, padding: '3px 11px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.7)', letterSpacing: '0.03em' }}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(250,250,247,0.9)', borderRadius: 100, padding: '9px 20px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', letterSpacing: '0.04em', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>Ask concierge</button>
                {hero.isPartner && hero.partnerDiscount && (
                  <button
                    onClick={() => getVoucher(hero)}
                    style={{ background: vouchers[hero.id] ? 'rgba(201,169,110,0.25)' : 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.4)', color: 'rgba(237,231,220,0.9)', borderRadius: 100, padding: '9px 20px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>
                    {vouchers[hero.id] ? `Code: ${vouchers[hero.id]}` : 'Get guest voucher'}
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderRadius: 18, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.09)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.6)', marginBottom: '1rem' }}>From Berghotel Sonnwend</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <Compass bearing={hero.bearing} color={hero.color} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '2rem', color: '#FAFAF7', lineHeight: 1 }}>{hero.direction}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.5)', marginTop: 4 }}>{hero.distance} from hotel</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.4)', marginTop: 2 }}>{hero.season}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem' }}>
                {[{l:'Distance',v:hero.distance},{l:'Duration',v:hero.time},{l:'Difficulty',v:hero.difficulty}].map(s=>(
                  <div key={s.l} style={{ padding: '0.8rem', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '0.95rem', color: '#FAFAF7', marginBottom: 2 }}>{s.v}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.6rem', color: 'rgba(237,231,220,0.45)', letterSpacing: '0.06em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {hero.isPartner && hero.partnerDiscount && (
                <div style={{ borderRadius: 14, background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', padding: '1.2rem' }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', marginBottom: '0.5rem' }}>AlpineFlow guest benefit</p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.1rem', color: '#FAFAF7', marginBottom: 4 }}>{hero.partnerDiscount.label}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.75rem', color: 'rgba(237,231,220,0.55)' }}>{hero.partnerDiscount.saving}</p>
                  {vouchers[hero.id] && (
                    <div style={{ marginTop: '0.875rem', padding: '0.6rem 1rem', borderRadius: 8, background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)', fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '1rem', letterSpacing: '0.12em', color: 'rgba(237,231,220,0.9)', textAlign: 'center' }}>{vouchers[hero.id]}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Browse */}
      {!hero && (
        <div style={{ maxWidth: 1020, margin: '0 auto', padding: '3.5rem 2rem 5rem', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(18px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: '0.75rem' }}>Ötztal &middot; Regional Discovery</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem,4.5vw,3.4rem)', letterSpacing: '-0.03em', lineHeight: 1.08, color: 'var(--color-deep)', marginBottom: '2.5rem' }}>The mountain<br /><em style={{ fontStyle: 'italic', color: 'var(--color-forest)' }}>is alive with stories.</em></h1>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ background: filter===c ? 'var(--color-forest)' : c === 'Partners' ? 'rgba(201,169,110,0.12)' : 'rgba(250,250,247,0.78)', color: filter===c ? '#FAFAF7' : c === 'Partners' ? 'rgba(155,120,60,0.9)' : 'var(--color-earth)', border: filter===c ? '1px solid var(--color-forest)' : c === 'Partners' ? '1px solid rgba(201,169,110,0.35)' : '1px solid rgba(200,184,154,0.25)', padding: '6px 16px', borderRadius: 100, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'var(--font-sans)', fontWeight: 300, letterSpacing: '0.02em' }}>{c === 'Partners' ? '★ Partners' : c}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1rem' }}>
            {visible.map((d, idx) => (
              <div key={d.id} onClick={() => setExpanded(d.id)} style={{ borderRadius: 18, overflow: 'hidden', cursor: 'pointer', background: 'rgba(250,248,244,0.82)', border: '1px solid rgba(200,184,154,0.2)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : `translateY(${10+idx*4}px)`, transitionDelay: loaded ? '0ms' : `${idx * 40}ms` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='translateY(-4px) scale(1.015)'; el.style.boxShadow=`0 16px 48px ${d.color}28` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='none'; el.style.boxShadow='none' }}
              >
                <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
                  <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)' }} />
                  {d.isPartner && (
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(201,169,110,0.9)', borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.62rem', color: '#fff', letterSpacing: '0.06em' }}>PARTNER DISCOUNT</div>
                  )}
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <button onClick={e => { e.stopPropagation(); setSaved(s => s.includes(d.id) ? s.filter(x => x !== d.id) : [...s, d.id]) }} style={{ background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: saved.includes(d.id) ? '#f5d080' : 'rgba(237,231,220,0.75)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>{saved.includes(d.id) ? '♥' : '♡'}</button>
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, right: 12, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.55)' }}>{d.mood}</div>
                </div>
                <div style={{ padding: '1rem 1.15rem 1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.02rem', color: 'var(--color-deep)', lineHeight: 1.2 }}>{d.name}</h3>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', color: d.color, letterSpacing: '0.04em', marginLeft: 8, whiteSpace: 'nowrap', marginTop: 2 }}>{d.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    {[d.distance, d.time, d.difficulty].map(v => <span key={v} style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'var(--color-stone)' }}>{v}</span>)}
                  </div>
                  {d.isPartner && d.partnerDiscount && (
                    <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(155,120,60,0.85)' }}>★ {d.partnerDiscount.label}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
