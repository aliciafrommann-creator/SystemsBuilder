'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const METRICS = {
  water:   { saved:142, unit:'L',      label:'Water preserved',   icon:'◡', color:'#283040', bar:0.71 },
  co2:     { saved:2.8, unit:'kg',     label:'CO₂ avoided',       icon:'◇', color:'#2D4A3E', bar:0.56 },
  laundry: { saved:3,   unit:'cycles', label:'Laundry saved',     icon:'◎', color:'#9B7D5E', bar:0.75 },
  local:   { saved:4,   unit:'visits', label:'Local businesses',  icon:'◈', color:'#4A6741', bar:0.80 },
}
const TIMELINE = [
  { day:'Mon', water:48, co2:0.8, action:'Eco Refresh' },
  { day:'Tue', water:38, co2:0.6, action:'Quiet Mode' },
  { day:'Wed', water:28, co2:0.9, action:'Eco Refresh' },
  { day:'Thu', water:28, co2:0.5, action:'Alpine Reset' },
]

function Bar({ pct, color, delay }: { pct:number; color:string; delay:number }) {
  const [w, setW] = useState(0)
  useEffect(()=>{ const t=setTimeout(()=>setW(pct*100),delay); return ()=>clearTimeout(t) },[pct,delay])
  return <div style={{ height:6, background:'rgba(200,184,154,0.2)', borderRadius:3, overflow:'hidden', flex:1 }}><div style={{ height:'100%', borderRadius:3, background:color, width:`${w}%`, transition:'width 1.4s cubic-bezier(0.16,1,0.3,1)', opacity:0.75 }} /></div>
}

export default function SustainabilityPage() {
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setLoaded(true),100); return ()=>clearTimeout(t) },[])

  return (
    <main className="min-h-screen" style={{ background:'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem', borderBottom:'1px solid rgba(200,184,154,0.2)' }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color:'var(--color-deep)', cursor:'pointer' }}>AlpineFlow</span></Link>
        <Link href="/guest"><span className="text-label" style={{ color:'var(--color-stone)', cursor:'pointer', fontSize:'0.7rem' }}>← Back</span></Link>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-20" style={{ opacity:loaded?1:0, transform:loaded?'none':'translateY(16px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <p className="text-label mb-4" style={{ color:'var(--color-stone)' }}>Your Impact · This Stay</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.2rem,5vw,3.5rem)', letterSpacing:'-0.025em', lineHeight:1.1, color:'var(--color-deep)', marginBottom:'0.75rem' }}>Your choices<br /><em style={{ fontStyle:'italic', color:'var(--color-forest)' }}>matter here.</em></h1>
        <p style={{ color:'var(--color-bark)', maxWidth:'40ch', lineHeight:1.7, marginBottom:'3.5rem' }}>Every decision shapes the mountain you are visiting.</p>
        <div className="grid grid-cols-2 gap-4 mb-12">
          {Object.entries(METRICS).map(([k,m],i)=>(
            <div key={k} className="surface p-7">
              <p style={{ fontSize:'1.1rem', color:m.color, marginBottom:'0.75rem', opacity:0.7 }}>{m.icon}</p>
              <p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(1.8rem,4vw,2.5rem)', letterSpacing:'-0.03em', color:'var(--color-deep)', lineHeight:1, marginBottom:'0.2rem' }}>{m.saved}<span style={{ fontSize:'0.45em', marginLeft:4, color:'var(--color-stone)' }}>{m.unit}</span></p>
              <p style={{ fontSize:'0.78rem', color:'var(--color-bark)', marginBottom:'0.75rem' }}>{m.label}</p>
              <Bar pct={m.bar} color={m.color} delay={400+i*150} />
            </div>
          ))}
        </div>
        <p className="text-label mb-6" style={{ color:'var(--color-stone)' }}>Day by day</p>
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:'3rem' }}>
          {TIMELINE.map((d,i)=>(
            <div key={d.day} className="surface" style={{ display:'flex', alignItems:'center', gap:20, padding:'1.25rem 1.5rem', opacity:loaded?1:0, transition:`opacity 0.8s ease ${0.2+i*0.1}s` }}>
              <p style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', color:'var(--color-stone)', minWidth:32, fontWeight:300 }}>{d.day}</p>
              <div style={{ width:1, height:28, background:'rgba(200,184,154,0.3)' }} />
              <div style={{ flex:1 }}><p style={{ fontSize:'0.85rem', color:'var(--color-deep)', fontWeight:400, marginBottom:2 }}>{d.action}</p><p style={{ fontSize:'0.72rem', color:'var(--color-stone)' }}>{d.water}L water · {d.co2}kg CO₂</p></div>
              <div style={{ textAlign:'right' }}><p style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', color:'var(--color-forest)', fontWeight:300 }}>+{d.water}L</p><p style={{ fontSize:'0.65rem', color:'var(--color-stone)' }}>saved</p></div>
            </div>
          ))}
        </div>
        <div style={{ background:'linear-gradient(135deg, var(--color-forest), var(--color-deep))', borderRadius:'1.5rem', padding:'2.5rem', position:'relative', overflow:'hidden' }}>
          <div className="texture-noise" />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,169,110,0.1) 0%, transparent 60%)' }} />
          <div style={{ position:'relative', zIndex:10 }}>
            <p className="text-label mb-6" style={{ color:'rgba(201,169,110,0.7)' }}>This month at AlpineFlow</p>
            <div className="grid grid-cols-2 gap-4">
              {[{l:'Guests this month',v:'312'},{l:'Water saved total',v:'44,200 L'},{l:'Local businesses',v:'18'},{l:'CO₂ avoided',v:'874 kg'}].map(c=>(
                <div key={c.l}><p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(1.4rem,3vw,2rem)', color:'#FAFAF7', letterSpacing:'-0.02em', lineHeight:1, marginBottom:'0.3rem' }}>{c.v}</p><p style={{ fontSize:'0.75rem', color:'rgba(237,231,220,0.5)' }}>{c.l}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
