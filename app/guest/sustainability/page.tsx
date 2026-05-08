'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useMode } from '@/lib/alpineflow/mode-context'

const METRICS = {
  water:   { saved:142, unit:'L',      label:'Water preserved',   icon:'◡', color:'#283040', bar:0.71 },
  co2:     { saved:2.8, unit:'kg',     label:'CO₂ avoided',  icon:'◇', color:'#2D4A3E', bar:0.56 },
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
  const { mode } = useMode()
  const isDark = !!mode
  useEffect(()=>{ const t=setTimeout(()=>setLoaded(true),100); return ()=>clearTimeout(t) },[])

  const mainBg     = isDark ? `radial-gradient(ellipse at 40% 30%, ${mode.light}45 0%, ${mode.bg} 65%)` : 'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)'
  const headerBg   = isDark ? 'rgba(0,0,0,0.18)' : 'transparent'
  const headerBdr  = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(200,184,154,0.2)'
  const brandCol   = isDark ? 'rgba(250,250,247,0.92)' : 'var(--color-deep)'
  const titleCol   = isDark ? '#FAFAF7' : 'var(--color-deep)'
  const forestCol  = isDark ? mode.accent : 'var(--color-forest)'
  const stoneCol   = isDark ? 'rgba(237,231,220,0.45)' : 'var(--color-stone)'
  const bodyCol    = isDark ? mode.text : 'var(--color-bark)'
  const cardBg     = isDark ? 'rgba(255,255,255,0.05)' : undefined
  const cardBdr    = isDark ? '1px solid rgba(255,255,255,0.09)' : undefined
  const deepCol    = isDark ? '#FAFAF7' : 'var(--color-deep)'

  return (
    <main style={{ minHeight: '100vh', background: mainBg, transition: 'background 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem', borderBottom: headerBdr, background: headerBg, backdropFilter: isDark ? 'blur(20px)' : 'none', position: isDark ? 'sticky' : 'relative', top: 0, zIndex: 10 }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color: brandCol, cursor:'pointer' }}>AlpineFlow</span></Link>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          {mode && <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.65rem', letterSpacing:'0.14em', textTransform:'uppercase', color: mode.accent }}>{mode.name}</span>}
        </div>
        <Link href="/guest"><span style={{ fontFamily:'var(--font-sans)', fontWeight:300, color: stoneCol, cursor:'pointer', fontSize:'0.7rem' }}>← Back</span></Link>
      </header>
      <div style={{ maxWidth:'42rem', margin:'0 auto', padding:'5rem 1.5rem 5rem', opacity:loaded?1:0, transform:loaded?'none':'translateY(16px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', letterSpacing:'0.18em', textTransform:'uppercase', color: stoneCol, marginBottom:'1rem' }}>Your Impact &middot; This Stay</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.2rem,5vw,3.5rem)', letterSpacing:'-0.025em', lineHeight:1.1, color: titleCol, marginBottom:'0.75rem' }}>
          Your choices<br /><em style={{ fontStyle:'italic', color: forestCol }}>matter here.</em>
        </h1>
        <p style={{ color: bodyCol, maxWidth:'40ch', lineHeight:1.7, marginBottom:'3.5rem' }}>Every decision shapes the mountain you are visiting.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'3rem' }}>
          {Object.entries(METRICS).map(([k,m],i)=>(
            <div key={k} style={{ borderRadius:'1rem', padding:'1.75rem', background: cardBg ?? 'rgba(255,255,255,0.65)', border: cardBdr ?? '1px solid rgba(200,184,154,0.2)', backdropFilter:'blur(12px)' }}>
              <p style={{ fontSize:'1.1rem', color: isDark ? mode.accent : m.color, marginBottom:'0.75rem', opacity:0.8 }}>{m.icon}</p>
              <p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(1.8rem,4vw,2.5rem)', letterSpacing:'-0.03em', color: deepCol, lineHeight:1, marginBottom:'0.2rem' }}>{m.saved}<span style={{ fontSize:'0.45em', marginLeft:4, color: stoneCol }}>{m.unit}</span></p>
              <p style={{ fontSize:'0.78rem', color: bodyCol, marginBottom:'0.75rem' }}>{m.label}</p>
              <Bar pct={m.bar} color={isDark ? mode.accent : m.color} delay={400+i*150} />
            </div>
          ))}
        </div>
        <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', letterSpacing:'0.18em', textTransform:'uppercase', color: stoneCol, marginBottom:'1.5rem' }}>Day by day</p>
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:'3rem' }}>
          {TIMELINE.map((d,i)=>(
            <div key={d.day} style={{ display:'flex', alignItems:'center', gap:20, padding:'1.25rem 1.5rem', borderRadius:'1rem', background: cardBg ?? 'rgba(255,255,255,0.65)', border: cardBdr ?? '1px solid rgba(200,184,154,0.2)', backdropFilter:'blur(12px)', opacity:loaded?1:0, transition:`opacity 0.8s ease ${0.2+i*0.1}s` }}>
              <p style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', color: stoneCol, minWidth:32, fontWeight:300 }}>{d.day}</p>
              <div style={{ width:1, height:28, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,184,154,0.3)' }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'0.85rem', color: deepCol, fontWeight:400, marginBottom:2 }}>{d.action}</p>
                <p style={{ fontSize:'0.72rem', color: stoneCol }}>{d.water}L water &middot; {d.co2}kg CO₂</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', color: forestCol, fontWeight:300 }}>+{d.water}L</p>
                <p style={{ fontSize:'0.65rem', color: stoneCol }}>saved</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:'linear-gradient(135deg, var(--color-forest), var(--color-deep))', borderRadius:'1.5rem', padding:'2.5rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,169,110,0.1) 0%, transparent 60%)' }} />
          <div style={{ position:'relative', zIndex:10 }}>
            <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(201,169,110,0.7)', marginBottom:'1.5rem' }}>This month at AlpineFlow</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              {[{l:'Guests this month',v:'312'},{l:'Water saved total',v:'44,200 L'},{l:'Local businesses',v:'18'},{l:'CO₂ avoided',v:'874 kg'}].map(c=>(
                <div key={c.l}>
                  <p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(1.4rem,3vw,2rem)', color:'#FAFAF7', letterSpacing:'-0.02em', lineHeight:1, marginBottom:'0.3rem' }}>{c.v}</p>
                  <p style={{ fontSize:'0.75rem', color:'rgba(237,231,220,0.5)' }}>{c.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
