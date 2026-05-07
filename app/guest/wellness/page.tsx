'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const CATS = [
  { id:'spa',      name:'Spa & Thermal', icon:'◠', color:'#9B7D5E', sessions:[{time:'08:00',label:'Alpine Stone Ritual',duration:'90 min',avail:true},{time:'10:30',label:'Deep Tissue Massage',duration:'60 min',avail:true},{time:'14:00',label:'Thermal Bath & Rest',duration:'120 min',avail:false},{time:'16:30',label:'Evening Aromatherapy',duration:'75 min',avail:true}] },
  { id:'movement', name:'Movement',      icon:'◯', color:'#2D4A3E', sessions:[{time:'07:00',label:'Sunrise Yoga Terrace',duration:'60 min',avail:true},{time:'09:00',label:'Alpine Meditation Walk',duration:'90 min',avail:true},{time:'11:00',label:'Pilates Studio',duration:'50 min',avail:false},{time:'17:00',label:'Forest Breathwork',duration:'45 min',avail:true}] },
  { id:'nourish',  name:'Nourishment',   icon:'◈', color:'#4A6741', sessions:[{time:'07:30',label:'Morning Juice Ritual',duration:'20 min',avail:true},{time:'12:30',label:'Herb Garden Lunch',duration:'60 min',avail:true},{time:'15:00',label:'Alpine Tea Ceremony',duration:'30 min',avail:true},{time:'19:00',label:'Forest-to-Table Dinner',duration:'90 min',avail:true}] },
]

export default function WellnessPage() {
  const [cat, setCat] = useState('spa')
  const [booked, setBooked] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setLoaded(true),80); return ()=>clearTimeout(t) },[])
  const current = CATS.find(c=>c.id===cat)!

  return (
    <main className="min-h-screen" style={{ background:'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem', borderBottom:'1px solid rgba(200,184,154,0.2)' }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color:'var(--color-deep)', cursor:'pointer' }}>AlpineFlow</span></Link>
        <Link href="/guest"><span className="text-label" style={{ color:'var(--color-stone)', cursor:'pointer', fontSize:'0.7rem' }}>← Back</span></Link>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-20" style={{ opacity:loaded?1:0, transform:loaded?'none':'translateY(16px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <p className="text-label mb-4" style={{ color:'var(--color-stone)' }}>Wellness</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.2rem,5vw,3.5rem)', letterSpacing:'-0.025em', lineHeight:1.1, color:'var(--color-deep)', marginBottom:'0.75rem' }}>Restore.<br /><em style={{ fontStyle:'italic', color:'var(--color-forest)' }}>Deeply.</em></h1>
        <p style={{ color:'var(--color-bark)', maxWidth:'38ch', lineHeight:1.7, marginBottom:'3.5rem' }}>Each session is curated to the rhythm of the mountain and the season.</p>
        <div style={{ display:'flex', gap:10, marginBottom:'2.5rem', flexWrap:'wrap' }}>
          {CATS.map(c=>(<button key={c.id} onClick={()=>setCat(c.id)} style={{ background:cat===c.id?c.color:'rgba(250,250,247,0.7)', color:cat===c.id?'#FAFAF7':'var(--color-earth)', border:cat===c.id?`1px solid ${c.color}`:'1px solid rgba(200,184,154,0.3)', padding:'0.5rem 1.25rem', borderRadius:100, fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.85rem', cursor:'pointer', transition:'all 400ms ease' }}>{c.icon} {c.name}</button>))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {current.sessions.map(s=>(
            <div key={s.time} className="surface" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', opacity:s.avail?1:0.45 }}>
              <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', color:current.color, minWidth:44, fontWeight:300 }}>{s.time}</p>
                <div style={{ width:1, height:32, background:'rgba(200,184,154,0.3)' }} />
                <div><p style={{ fontWeight:400, fontSize:'0.95rem', color:'var(--color-deep)', marginBottom:2 }}>{s.label}</p><p style={{ fontSize:'0.75rem', color:'var(--color-stone)' }}>{s.duration}</p></div>
              </div>
              {s.avail ? (booked.includes(`${cat}-${s.time}`) ? <span style={{ background:`${current.color}15`, color:current.color, borderRadius:100, padding:'0.4rem 1rem', fontSize:'0.75rem', border:`1px solid ${current.color}30` }}>Reserved</span> : <button onClick={()=>setBooked(b=>[...b,`${cat}-${s.time}`])} style={{ background:current.color, color:'#FAFAF7', borderRadius:100, padding:'0.4rem 1.25rem', fontSize:'0.78rem', border:'none', cursor:'pointer', boxShadow:`0 4px 16px ${current.color}33` }}>Reserve</button>) : <span style={{ fontSize:'0.72rem', color:'var(--color-stone)' }}>Full</span>}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
