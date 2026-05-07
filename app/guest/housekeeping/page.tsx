'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const OPTIONS = [
  { id:'refresh', name:'Eco Refresh',   subtitle:'Fresh air, light touch',   description:'We air the room, replace towels only as needed, and leave your space undisturbed.', saves:{water:'48L',co2:'0.8kg',time:'22min'}, icon:'◇', color:'#2D4A3E' },
  { id:'quiet',   name:'Quiet Mode',    subtitle:'Complete privacy',          description:"Do not disturb. Your space remains exactly as you left it.", saves:{water:'80L',co2:'1.4kg',time:'35min'}, icon:'◎', color:'#2A3040' },
  { id:'full',    name:'Full Comfort',  subtitle:'Complete service',          description:'Full housekeeping with fresh linens, towels, and a completely refreshed room.', saves:{water:'0L',co2:'0kg',time:'0min'}, icon:'◠', color:'#9B7D5E' },
  { id:'alpine',  name:'Alpine Reset',  subtitle:'Mountain-fresh',            description:"Natural products, open windows, alpine herbs.", saves:{water:'30L',co2:'0.6kg',time:'15min'}, icon:'◯', color:'#283040' },
]

export default function HousekeepingPage() {
  const [selected, setSelected] = useState<string|null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setLoaded(true),80); return ()=>clearTimeout(t) },[])
  const choice = OPTIONS.find(r=>r.id===selected)

  return (
    <main className="min-h-screen" style={{ background:'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem', borderBottom:'1px solid rgba(200,184,154,0.2)' }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color:'var(--color-deep)', cursor:'pointer' }}>AlpineFlow</span></Link>
        <Link href="/guest"><span className="text-label" style={{ color:'var(--color-stone)', cursor:'pointer', fontSize:'0.7rem' }}>← Back</span></Link>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-20" style={{ opacity:loaded?1:0, transform:loaded?'none':'translateY(16px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <p className="text-label mb-4" style={{ color:'var(--color-stone)' }}>Room 204 · Tonight</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.2rem,5vw,3.5rem)', letterSpacing:'-0.025em', lineHeight:1.1, color:'var(--color-deep)', marginBottom:'0.75rem' }}>How shall we<br /><em style={{ fontStyle:'italic', color:'var(--color-forest)' }}>prepare your room?</em></h1>
        <p style={{ color:'var(--color-bark)', fontSize:'1rem', lineHeight:1.7, maxWidth:'42ch', marginBottom:'3.5rem' }}>Each choice shapes your comfort and our shared impact on this mountain.</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {OPTIONS.map(opt=>(
            <button key={opt.id} onClick={()=>setSelected(selected===opt.id?null:opt.id)} className="text-left p-7 rounded-2xl"
              style={{ background:selected===opt.id?`${opt.color}18`:'rgba(250,250,247,0.75)', border:selected===opt.id?`1px solid ${opt.color}44`:'1px solid rgba(200,184,154,0.22)', cursor:'pointer', transition:'all 400ms cubic-bezier(0.16,1,0.3,1)' }}>
              <span style={{ display:'block', fontSize:'1.1rem', color:opt.color, marginBottom:'0.6rem', opacity:0.8 }}>{opt.icon}</span>
              <h3 style={{ fontFamily:'var(--font-serif)', fontWeight:400, fontSize:'1.1rem', color:'var(--color-deep)', marginBottom:'0.2rem' }}>{opt.name}</h3>
              <p style={{ fontSize:'0.8rem', color:'var(--color-bark)', marginBottom:'0.75rem' }}>{opt.subtitle}</p>
              {selected===opt.id && <><p style={{ fontSize:'0.88rem', color:'var(--color-earth)', lineHeight:1.65, marginBottom:'1rem' }}>{opt.description}</p>
              {opt.id!=='full'&&<div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>{[{l:'Water saved',v:opt.saves.water},{l:'CO₂ avoided',v:opt.saves.co2},{l:'Time saved',v:opt.saves.time}].map(s=>(<div key={s.l} style={{ background:`${opt.color}12`, borderRadius:8, padding:'4px 10px', border:`1px solid ${opt.color}22` }}><span style={{ fontFamily:'var(--font-serif)', fontSize:'0.95rem', color:opt.color }}>{s.v}</span><span style={{ fontSize:'0.68rem', color:'var(--color-bark)', display:'block' }}>{s.l}</span></div>))}</div>}</> }
            </button>
          ))}
        </div>
        {selected&&!confirmed&&<button onClick={()=>setConfirmed(true)} className="btn-primary" style={{ background:choice?.color, fontSize:'0.9rem', padding:'0.875rem 2.5rem' }}>Confirm {choice?.name}</button>}
        {confirmed&&<div className="surface p-8 text-center" style={{ maxWidth:400 }}><p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{choice?.icon}</p><h3 style={{ fontFamily:'var(--font-serif)', fontWeight:400, fontSize:'1.5rem', color:'var(--color-deep)', marginBottom:'0.5rem' }}>Noted with care.</h3><p style={{ color:'var(--color-bark)', fontSize:'0.9rem', lineHeight:1.65 }}>Your room will be prepared as <strong>{choice?.name}</strong>.</p></div>}
      </div>
    </main>
  )
}
