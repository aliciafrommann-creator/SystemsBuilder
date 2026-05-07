'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const WEATHER = { temp: 14, desc: 'Partly cloudy', wind: '12 km/h NW', icon: '⛅', uv: 3 }

const CATS = ['All', 'Nature', 'Culture', 'Wellness', 'Food', 'Mobility'] as const
type Cat = typeof CATS[number]

const ITEMS = [
  {
    id: 1, name: 'Alpenrosen Trail', type: 'Nature' as Cat,
    distance: '1.2 km', time: '45 min', difficulty: 'Easy',
    desc: 'A gentle mountain path through alpine rose meadows. Peak bloom June–August. The path winds through granite outcrops and opens to panoramic valley views.',
    mood: 'Still & vast', season: 'Summer',
    color: '#2D4A3E', skyColor: '#5a8a7a',
    bg: 'linear-gradient(160deg, #1a3028 0%, #2d4a3e 40%, #4a7a58 100%)',
    tags: ['Walking', 'Views', 'Alpine flora'],
    direction: 'NE', bearing: 48,
  },
  {
    id: 2, name: 'Sennalm Dairy', type: 'Food' as Cat,
    distance: '3.4 km', time: '2 h', difficulty: 'Moderate',
    desc: 'Traditional alpine dairy producing mountain cheese since 1847. Watch the morning process and taste directly from the wheel. A living piece of regional heritage.',
    mood: 'Warm & rooted', season: 'All year',
    color: '#7a5830', skyColor: '#c8a870',
    bg: 'linear-gradient(160deg, #3a2810 0%, #7a5830 50%, #b88840 100%)',
    tags: ['Local', 'Food', 'Heritage'],
    direction: 'E', bearing: 92,
  },
  {
    id: 3, name: 'Bergkirche Chapel', type: 'Culture' as Cat,
    distance: '0.8 km', time: '20 min', difficulty: 'Easy',
    desc: 'A 13th-century chapel perched above the valley with frescoes depicting alpine life. The bell rings at noon and at dusk. Stone steps worn smooth by seven centuries.',
    mood: 'Quiet & ancient', season: 'All year',
    color: '#5a4830', skyColor: '#a09070',
    bg: 'linear-gradient(160deg, #2a2018 0%, #5a4830 50%, #8a7050 100%)',
    tags: ['History', 'Architecture', 'Silence'],
    direction: 'W', bearing: 270,
  },
  {
    id: 4, name: 'Wildwasser Kneipp', type: 'Wellness' as Cat,
    distance: '0.4 km', time: '30 min', difficulty: 'Easy',
    desc: 'A natural cold-water Kneipp path fed directly by glacial melt. The water temperature is 7°C. A three-minute circuit activates circulation and calms the nervous system.',
    mood: 'Sharp & alive', season: 'May–Oct',
    color: '#1e3a58', skyColor: '#4a7aaa',
    bg: 'linear-gradient(160deg, #0e2038 0%, #1e3a58 50%, #3a6080 100%)',
    tags: ['Cold water', 'Wellness', 'Reset'],
    direction: 'N', bearing: 12,
  },
  {
    id: 5, name: 'Berggasthof Sonnwend', type: 'Food' as Cat,
    distance: '5.1 km', time: '3 h', difficulty: 'Moderate',
    desc: 'A mountain hut serving slow-cooked regional dishes — Kasspätzle, smoked trout, elderflower schnapps. Only 18 seats. Reservations via the concierge.',
    mood: 'Convivial & slow', season: 'Jun–Sep',
    color: '#4A6741', skyColor: '#8aaa60',
    bg: 'linear-gradient(160deg, #1e3018 0%, #4a6741 50%, #7a9a60 100%)',
    tags: ['Dining', 'Regional', 'Hike-to'],
    direction: 'SE', bearing: 135,
  },
  {
    id: 6, name: 'E-Bike Circuit Tal', type: 'Mobility' as Cat,
    distance: '18 km', time: '2.5 h', difficulty: 'Easy',
    desc: 'A zero-emission electric bike loop through the valley floor, past three mountain lakes and two hamlets. E-bikes charged via hotel solar. Maximum scenery, zero effort.',
    mood: 'Free & flowing', season: 'Apr–Oct',
    color: '#284850', skyColor: '#6aaabb',
    bg: 'linear-gradient(160deg, #0e2830 0%, #284850 50%, #4a7888 100%)',
    tags: ['E-Bike', 'Zero emission', 'Lakes'],
    direction: 'S', bearing: 185,
  },
  {
    id: 7, name: 'Käutergarten Harvest', type: 'Culture' as Cat,
    distance: '0.3 km', time: '45 min', difficulty: 'Easy',
    desc: "The hotel's own herb garden with 64 alpine species. Join the morning harvest at 7:30 am. Harvested herbs become your evening tea and tomorrow's breakfast garnish.",
    mood: 'Grounded & fragrant', season: 'Jun–Sep',
    color: '#3a5030', skyColor: '#7a9a60',
    bg: 'linear-gradient(160deg, #182010 0%, #3a5030 50%, #607840 100%)',
    tags: ['Garden', 'Culinary', 'Mindful'],
    direction: 'NW', bearing: 320,
  },
  {
    id: 8, name: 'Silbersee Sunrise', type: 'Nature' as Cat,
    distance: '2.2 km', time: '1.5 h', difficulty: 'Moderate',
    desc: 'A glacial lake at 1,840 m that mirrors the first light of morning. Depart at 5:30 am with the guide or alone. Bring the silence. The light only lasts 12 minutes.',
    mood: 'Awe & solitude', season: 'May–Oct',
    color: '#1a2a48', skyColor: '#3a5888',
    bg: 'linear-gradient(160deg, #0e1828 0%, #1a2a48 50%, #3a5888 100%)',
    tags: ['Sunrise', 'Glacial lake', 'Photography'],
    direction: 'NE', bearing: 65,
  },
]

function CompassDot({ bearing, color }: { bearing: number; color: string }) {
  const r = 36
  const rad = (bearing - 90) * (Math.PI / 180)
  const x = 50 + r * Math.cos(rad)
  const y = 50 + r * Math.sin(rad)
  return (
    <svg width="90" height="90" viewBox="0 0 100 100" style={{ display:'block' }}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(200,184,154,0.25)" strokeWidth="1" />
      <circle cx="50" cy="50" r="3" fill="rgba(200,184,154,0.5)" />
      {['N','E','S','W'].map((d,i) => {
        const a = i * 90 - 90
        const cr = (a) * Math.PI / 180
        const dx = 50 + 38 * Math.cos(cr)
        const dy = 50 + 38 * Math.sin(cr)
        return <text key={d} x={dx} y={dy + 4} textAnchor="middle" fontSize="9" fill="rgba(180,160,130,0.6)" fontFamily="sans-serif">{d}</text>
      })}
      <circle cx={x} cy={y} r="5" fill={color} opacity="0.9" />
      <line x1="50" y1="50" x2={x} y2={y} stroke={color} strokeWidth="1.5" opacity="0.5" strokeDasharray="3 2" />
    </svg>
  )
}

export default function DiscoveryPage() {
  const [filter, setFilter]     = useState<Cat>('All')
  const [saved, setSaved]       = useState<number[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loaded, setLoaded]     = useState(false)

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])

  const visible = filter === 'All' ? ITEMS : ITEMS.filter(d => d.type === filter)
  const hero = expanded ? ITEMS.find(d => d.id === expanded) : null

  return (
    <main style={{ minHeight:'100vh', background: hero ? hero.bg : 'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)', transition:'background 1.5s cubic-bezier(0.16,1,0.3,1)' }}>

      {/* Sticky header */}
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.35rem 2rem', position:'sticky', top:0, zIndex:20, background: hero ? 'rgba(0,0,0,0.15)' : 'rgba(247,244,239,0.9)', backdropFilter:'blur(22px)', borderBottom: hero ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(200,184,154,0.18)', transition:'all 1s ease' }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color: hero ? 'rgba(250,250,247,0.9)' : 'var(--color-deep)', cursor:'pointer', transition:'color 1s ease' }}>AlpineFlow</span></Link>

        {/* Weather strip */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontSize:'1.1rem' }}>{WEATHER.icon}</span>
          <div style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', color: hero ? 'rgba(237,231,220,0.6)' : 'var(--color-stone)', transition:'color 1s ease' }}>
            {WEATHER.temp}°C &middot; {WEATHER.desc} &middot; {WEATHER.wind}
          </div>
        </div>

        <Link href="/guest"><span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.7rem', letterSpacing:'0.08em', color: hero ? 'rgba(237,231,220,0.5)' : 'var(--color-stone)', cursor:'pointer', transition:'color 1s ease' }}>Back to Stay</span></Link>
      </header>

      {/* Expanded hero view */}
      {hero && (
        <div style={{ padding:'3rem 2rem 2rem', maxWidth:900, margin:'0 auto' }}>
          <button onClick={() => setExpanded(null)} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', color:'rgba(237,231,220,0.7)', borderRadius:100, padding:'6px 16px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.75rem', cursor:'pointer', marginBottom:'2rem', backdropFilter:'blur(12px)' }}>Back to all</button>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'start' }}>
            <div>
              <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(201,169,110,0.7)', marginBottom:'0.6rem' }}>{hero.type} &middot; {hero.distance} from hotel</p>
              <h2 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.025em', lineHeight:1.05, color:'#FAFAF7', marginBottom:'1rem' }}>{hero.name}</h2>
              <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.95rem', color:'rgba(237,231,220,0.75)', lineHeight:1.75, marginBottom:'1.5rem', maxWidth:'46ch' }}>{hero.desc}</p>
              <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginBottom:'1.8rem' }}>
                {hero.tags.map(t => (
                  <span key={t} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:100, padding:'4px 12px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', color:'rgba(237,231,220,0.7)', letterSpacing:'0.04em' }}>{t}</span>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.6rem', marginBottom:'2rem' }}>
                {[{l:'Distance',v:hero.distance},{l:'Duration',v:hero.time},{l:'Difficulty',v:hero.difficulty}].map(s=>(
                  <div key={s.l} style={{ padding:'0.8rem', borderRadius:12, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.1rem', color:'#FAFAF7', marginBottom:2 }}>{s.v}</div>
                    <div style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.65rem', color:'rgba(237,231,220,0.5)', letterSpacing:'0.06em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(250,250,247,0.9)', borderRadius:100, padding:'10px 22px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.82rem', letterSpacing:'0.05em', cursor:'pointer', backdropFilter:'blur(12px)' }}>Book with concierge</button>
                <button
                  onClick={() => setSaved(s => s.includes(hero.id) ? s.filter(x => x !== hero.id) : [...s, hero.id])}
                  style={{ background: saved.includes(hero.id) ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.08)', border: saved.includes(hero.id) ? '1px solid rgba(201,169,110,0.4)' : '1px solid rgba(255,255,255,0.12)', color:'rgba(237,231,220,0.7)', borderRadius:100, padding:'10px 18px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.82rem', cursor:'pointer' }}>
                  {saved.includes(hero.id) ? '♥ Saved' : '♡ Save'}
                </button>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', alignItems:'center' }}>
              <div style={{ borderRadius:20, background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.1)', padding:'1.5rem', width:'100%', backdropFilter:'blur(12px)' }}>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.65rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(201,169,110,0.6)', marginBottom:'1rem' }}>Direction from hotel</p>
                <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
                  <CompassDot bearing={hero.bearing} color={hero.skyColor} />
                  <div>
                    <div style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.8rem', color:'#FAFAF7', lineHeight:1 }}>{hero.direction}</div>
                    <div style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.7rem', color:'rgba(237,231,220,0.5)', marginTop:4 }}>{hero.distance} from here</div>
                    <div style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.7rem', color:'rgba(237,231,220,0.4)', marginTop:2 }}>{hero.season}</div>
                  </div>
                </div>
              </div>
              <div style={{ borderRadius:16, background:'rgba(0,0,0,0.15)', border:'1px solid rgba(255,255,255,0.08)', padding:'1.2rem', width:'100%' }}>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.65rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(201,169,110,0.5)', marginBottom:'0.6rem' }}>Atmosphere</p>
                <p style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:300, fontSize:'1.1rem', color:'rgba(237,231,220,0.65)' }}>{hero.mood}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Browse view */}
      {!hero && (
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'3.5rem 2rem 5rem', opacity:loaded?1:0, transform:loaded?'none':'translateY(18px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--color-stone)', marginBottom:'0.75rem' }}>Regional Discovery</p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.2rem,4.8vw,3.6rem)', letterSpacing:'-0.03em', lineHeight:1.08, color:'var(--color-deep)', marginBottom:'2.5rem' }}>
            The mountain<br /><em style={{ fontStyle:'italic', color:'var(--color-forest)' }}>is alive with stories.</em>
          </h1>

          {/* Category filters */}
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:'2.5rem' }}>
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  background: filter===c ? 'var(--color-forest)' : 'rgba(250,250,247,0.75)',
                  color: filter===c ? '#FAFAF7' : 'var(--color-earth)',
                  border: filter===c ? '1px solid var(--color-forest)' : '1px solid rgba(200,184,154,0.28)',
                  padding:'6px 16px', borderRadius:100, fontSize:'0.8rem',
                  cursor:'pointer', transition:'all 0.3s ease',
                  fontFamily:'var(--font-sans)', fontWeight:300, letterSpacing:'0.02em',
                }}
              >{c}</button>
            ))}
          </div>

          {/* Experience cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1rem' }}>
            {visible.map((d, idx) => (
              <div
                key={d.id}
                onClick={() => setExpanded(d.id)}
                style={{
                  borderRadius:18, overflow:'hidden', cursor:'pointer',
                  background: 'rgba(250,248,244,0.8)',
                  border:'1px solid rgba(200,184,154,0.2)',
                  transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'none' : `translateY(${12 + idx * 5}px)`,
                  transitionDelay: loaded ? '0ms' : `${idx * 45}ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-4px) scale(1.015)'
                  el.style.boxShadow = `0 16px 48px ${d.color}30`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'none'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Atmospheric header */}
                <div style={{ height:120, background: d.bg, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)' }} />
                  <div style={{ position:'absolute', top:14, left:16, display:'flex', gap:5, flexWrap:'wrap' }}>
                    {d.tags.map(tag => (
                      <span key={tag} style={{ background:'rgba(0,0,0,0.3)', borderRadius:100, padding:'2px 9px', fontSize:'0.62rem', color:'rgba(237,231,220,0.85)', letterSpacing:'0.04em', backdropFilter:'blur(8px)' }}>{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setSaved(s => s.includes(d.id) ? s.filter(x => x !== d.id) : [...s, d.id]) }}
                    style={{ position:'absolute', top:12, right:13, background:'rgba(0,0,0,0.25)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', color: saved.includes(d.id) ? '#f5d080' : 'rgba(237,231,220,0.7)', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}
                  >
                    {saved.includes(d.id) ? '♥' : '♡'}
                  </button>
                  <div style={{ position:'absolute', bottom:12, right:14, fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:300, fontSize:'0.72rem', color:'rgba(237,231,220,0.55)' }}>{d.mood}</div>
                </div>

                {/* Card body */}
                <div style={{ padding:'1.1rem 1.2rem 1.3rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.3rem' }}>
                    <h3 style={{ fontFamily:'var(--font-serif)', fontWeight:400, fontSize:'1.05rem', color:'var(--color-deep)', lineHeight:1.2 }}>{d.name}</h3>
                    <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.65rem', color: d.color, letterSpacing:'0.04em', marginTop:2, whiteSpace:'nowrap', marginLeft:8 }}>{d.type}</span>
                  </div>
                  <div style={{ display:'flex', gap:12, marginTop:4 }}>
                    <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', color:'var(--color-stone)' }}>{d.distance}</span>
                    <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', color:'var(--color-stone)' }}>{d.time}</span>
                    <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', color:'var(--color-stone)' }}>{d.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
