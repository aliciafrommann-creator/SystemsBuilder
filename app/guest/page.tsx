'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STAY_MODES = [
  { id: 'eco',         name: 'Eco Stay',      subtitle: 'Light touch on the earth',      color: '#2D4A3E', accent: 'rgba(74,103,65,0.8)',   bg: 'linear-gradient(135deg, #1A2E28 0%, #2D4A3E 100%)', icon: '◇', description: 'Minimal footprint, maximum connection to nature.' },
  { id: 'quiet',       name: 'Quiet Stay',    subtitle: 'Deep rest, undisturbed',        color: '#2A3040', accent: 'rgba(100,116,139,0.8)', bg: 'linear-gradient(135deg, #1E2638 0%, #2A3040 100%)', icon: '◎', description: 'Privacy, silence, and complete restoration.' },
  { id: 'wellness',    name: 'Wellness Stay', subtitle: 'Renew body and mind',           color: '#3D2E28', accent: 'rgba(201,169,110,0.8)', bg: 'linear-gradient(135deg, #2C1E18 0%, #3D2E28 100%)', icon: '◠', description: 'Spa access, movement, and nourishment aligned.' },
  { id: 'explorer',    name: 'Explorer Stay', subtitle: 'Discover the region',           color: '#2D3A28', accent: 'rgba(164,183,104,0.8)', bg: 'linear-gradient(135deg, #1E2C18 0%, #2D3A28 100%)', icon: '◈', description: 'Guided by local wisdom, off the beaten path.' },
  { id: 'deep-rest',   name: 'Deep Rest',     subtitle: 'Nothing is required of you',   color: '#302838', accent: 'rgba(139,116,160,0.8)', bg: 'linear-gradient(135deg, #221830 0%, #302838 100%)', icon: '◡', description: 'Maximum comfort, zero decisions, pure presence.' },
  { id: 'alpine-reset',name: 'Alpine Reset',  subtitle: 'The full mountain experience', color: '#283040', accent: 'rgba(123,163,168,0.8)', bg: 'linear-gradient(135deg, #18222E 0%, #283040 100%)', icon: '◯', description: 'Cold air, warm fires, and the rhythm of the mountain.' },
]

export default function GuestHub() {
  const [activeMode, setActiveMode] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])
  const selected = STAY_MODES.find(m => m.id === activeMode)

  return (
    <main style={{ minHeight: '100vh', background: selected ? selected.bg : 'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)', transition: 'background 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem', borderBottom: selected ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(200,184,154,0.2)' }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color: selected ? 'rgba(250,250,247,0.8)' : 'var(--color-deep)', cursor:'pointer', transition:'color 1s ease' }}>AlpineFlow</span></Link>
        <nav style={{ display:'flex', gap:'1.5rem' }}>
          {[{l:'Stay',h:'/guest'},{l:'Wellness',h:'/guest/wellness'},{l:'Discover',h:'/guest/discovery'},{l:'Impact',h:'/guest/sustainability'}].map(n=>(
            <Link key={n.l} href={n.h}><span className="text-label" style={{ color: selected ? 'rgba(237,231,220,0.55)' : 'var(--color-bark)', transition:'color 1s ease', fontSize:'0.72rem', cursor:'pointer' }}>{n.l}</span></Link>
          ))}
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-20" style={{ opacity: loaded?1:0, transform: loaded?'none':'translateY(16px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <p className="text-label mb-3" style={{ color: selected ? 'rgba(201,169,110,0.7)' : 'var(--color-stone)', transition:'color 1s ease' }}>Good evening</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.5rem,5vw,4rem)', letterSpacing:'-0.025em', lineHeight:1.1, color: selected?'#FAFAF7':'var(--color-deep)', transition:'color 1s ease', marginBottom:'2.5rem' }}>
          How would you like
          <br /><em style={{ fontStyle:'italic', color: selected?'rgba(201,169,110,0.9)':'var(--color-forest)' }}>to experience your stay?</em>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {STAY_MODES.map(mode => (
            <button key={mode.id} onClick={() => setActiveMode(activeMode===mode.id?null:mode.id)}
              className="relative text-left overflow-hidden rounded-2xl p-6"
              style={{ background: activeMode===mode.id ? 'rgba(255,255,255,0.12)' : selected ? 'rgba(255,255,255,0.05)' : 'rgba(250,250,247,0.7)', border: activeMode===mode.id ? `1px solid ${mode.accent}` : selected ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(200,184,154,0.25)', transition:'all 500ms cubic-bezier(0.16,1,0.3,1)', cursor:'pointer', boxShadow: activeMode===mode.id ? '0 8px 40px rgba(0,0,0,0.25)' : 'none' }}>
              <span style={{ display:'block', fontSize:'1.25rem', marginBottom:'0.75rem', color:mode.accent, transition:'all 400ms ease' }}>{mode.icon}</span>
              <h3 style={{ fontFamily:'var(--font-serif)', fontWeight:400, fontSize:'1.1rem', color:selected?'#FAFAF7':'var(--color-deep)', marginBottom:'0.25rem', transition:'color 1s ease' }}>{mode.name}</h3>
              <p style={{ fontSize:'0.78rem', color:selected?'rgba(237,231,220,0.5)':'var(--color-bark)', transition:'color 1s ease' }}>{mode.subtitle}</p>
              {activeMode===mode.id && <p style={{ fontSize:'0.85rem', color:'rgba(237,231,220,0.7)', lineHeight:1.6, marginTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'1rem' }}>{mode.description}</p>}
            </button>
          ))}
        </div>

        {activeMode && (
          <div className="flex gap-4 mb-16">
            <button className="btn-primary" style={{ background:selected?.accent.replace('0.8','1')??'var(--color-forest)', fontSize:'0.9rem', padding:'0.875rem 2.5rem' }}>Set {selected?.name}</button>
            <button onClick={()=>setActiveMode(null)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(237,231,220,0.6)', padding:'0.875rem 1.75rem', borderRadius:100, fontSize:'0.875rem', cursor:'pointer' }}>Clear</button>
          </div>
        )}

        <div style={{ borderTop: selected?'1px solid rgba(255,255,255,0.08)':'1px solid rgba(200,184,154,0.2)', paddingTop:'3rem', transition:'border-color 1s ease' }}>
          <p className="text-label mb-8" style={{ color:selected?'rgba(237,231,220,0.4)':'var(--color-stone)', transition:'color 1s ease' }}>Your stay</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{l:'Housekeeping',s:'Room preferences',h:'/guest/housekeeping',i:'◊'},{l:'Wellness',s:'Spa & movement',h:'/guest/wellness',i:'○'},{l:'Discover',s:'Local & regional',h:'/guest/discovery',i:'◈'},{l:'Impact',s:'Your footprint',h:'/guest/sustainability',i:'◇'}].map(a=>(
              <Link key={a.l} href={a.h}>
                <div className="rounded-xl p-5 cursor-pointer" style={{ background:selected?'rgba(255,255,255,0.05)':'rgba(250,250,247,0.7)', border:selected?'1px solid rgba(255,255,255,0.07)':'1px solid rgba(200,184,154,0.2)', transition:'all 400ms ease' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='none'}}>
                  <p style={{ fontSize:'1rem', marginBottom:'0.5rem', color:selected?'rgba(201,169,110,0.7)':'var(--color-forest)', transition:'color 1s ease' }}>{a.i}</p>
                  <p style={{ fontWeight:400, fontSize:'0.9rem', color:selected?'#FAFAF7':'var(--color-deep)', marginBottom:'0.2rem', transition:'color 1s ease' }}>{a.l}</p>
                  <p style={{ fontSize:'0.75rem', color:selected?'rgba(237,231,220,0.4)':'var(--color-bark)', transition:'color 1s ease' }}>{a.s}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
