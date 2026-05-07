'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const CATS = ['All','Nature','Culture','Wellness','Food','Mobility']
const ITEMS = [
  { id:1,name:'Alpenrosen Trail',type:'Nature',distance:'1.2 km',description:'A gentle mountain path through alpine rose meadows. Peak bloom June–August.',time:'45 min',difficulty:'Easy',color:'#2D4A3E',icon:'◇',tags:['Walking','Views','Seasonal'] },
  { id:2,name:'Sennalm Dairy',type:'Food',distance:'3.4 km',description:'Traditional alpine dairy producing mountain cheese since 1847.',time:'2 h',difficulty:'Moderate',color:'#9B7D5E',icon:'◎',tags:['Local','Food','Heritage'] },
  { id:3,name:'Bergkirche Chapel',type:'Culture',distance:'0.8 km',description:'A 13th-century chapel perched above the valley.',time:'20 min',difficulty:'Easy',color:'#6B5240',icon:'◠',tags:['History','Architecture','Quiet'] },
  { id:4,name:'Wildwasser Kneipp',type:'Wellness',distance:'0.4 km',description:'A natural cold-water Kneipp path fed by a glacial stream.',time:'30 min',difficulty:'Easy',color:'#283040',icon:'◡',tags:['Cold Water','Wellness','Nature'] },
  { id:5,name:'Berggasthof Sonnwend',type:'Food',distance:'5.1 km',description:'A mountain hut serving slow-cooked regional dishes.',time:'3 h',difficulty:'Moderate',color:'#4A6741',icon:'◈',tags:['Dining','Local','Hiking'] },
  { id:6,name:'E-Bike Circuit Tal',type:'Mobility',distance:'18 km',description:'An electric bike loop through the valley. Zero-emission, maximum scenery.',time:'2.5 h',difficulty:'Easy',color:'#2A3040',icon:'◯',tags:['E-Bike','Sustainable','Views'] },
  { id:7,name:'Kräutergarten',type:'Culture',distance:'0.3 km',description:"The hotel's own herb garden. Join the morning harvest.",time:'45 min',difficulty:'Easy',color:'#4A6741',icon:'◇',tags:['Garden','Culinary','Mindful'] },
  { id:8,name:'Silber Lake Sunrise',type:'Nature',distance:'2.2 km',description:'A glacial lake that reflects the first light of morning.',time:'1.5 h',difficulty:'Moderate',color:'#283040',icon:'◠',tags:['Sunrise','Photography','Nature'] },
]

export default function DiscoveryPage() {
  const [filter, setFilter] = useState('All')
  const [saved, setSaved] = useState<number[]>([])
  const [expanded, setExpanded] = useState<number|null>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setLoaded(true),80); return ()=>clearTimeout(t) },[])
  const visible = filter==='All' ? ITEMS : ITEMS.filter(d=>d.type===filter)

  return (
    <main className="min-h-screen" style={{ background:'linear-gradient(160deg, #F7F4EF 0%, #EDE7DC 100%)' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem', borderBottom:'1px solid rgba(200,184,154,0.2)' }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color:'var(--color-deep)', cursor:'pointer' }}>AlpineFlow</span></Link>
        <Link href="/guest"><span className="text-label" style={{ color:'var(--color-stone)', cursor:'pointer', fontSize:'0.7rem' }}>← Back</span></Link>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-20" style={{ opacity:loaded?1:0, transform:loaded?'none':'translateY(16px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <p className="text-label mb-4" style={{ color:'var(--color-stone)' }}>Regional Discovery</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.2rem,5vw,3.5rem)', letterSpacing:'-0.025em', lineHeight:1.1, color:'var(--color-deep)', marginBottom:'0.75rem' }}>The mountain<br /><em style={{ fontStyle:'italic', color:'var(--color-forest)' }}>is alive with stories.</em></h1>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'2.5rem' }}>
          {CATS.map(c=>(<button key={c} onClick={()=>setFilter(c)} style={{ background:filter===c?'var(--color-forest)':'rgba(250,250,247,0.7)', color:filter===c?'#FAFAF7':'var(--color-earth)', border:filter===c?'1px solid var(--color-forest)':'1px solid rgba(200,184,154,0.3)', padding:'0.45rem 1.1rem', borderRadius:100, fontSize:'0.82rem', cursor:'pointer', transition:'all 300ms ease', fontFamily:'var(--font-sans)', fontWeight:300 }}>{c}</button>))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {visible.map(d=>(
            <div key={d.id} className="surface overflow-hidden" style={{ border:expanded===d.id?`1px solid ${d.color}33`:undefined, cursor:'pointer', transition:'all 400ms ease' }} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
              <div style={{ height:100, position:'relative', background:`linear-gradient(135deg, ${d.color}18 0%, ${d.color}08 100%)`, overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'2.5rem', color:d.color, opacity:0.2 }}>{d.icon}</div>
                <div style={{ position:'absolute', top:14, left:16, display:'flex', gap:6, flexWrap:'wrap' }}>
                  {d.tags.map(tag=>(<span key={tag} style={{ background:'rgba(247,244,239,0.85)', borderRadius:100, padding:'2px 8px', fontSize:'0.65rem', color:d.color, letterSpacing:'0.04em' }}>{tag}</span>))}
                </div>
                <button onClick={e=>{e.stopPropagation();setSaved(s=>s.includes(d.id)?s.filter(x=>x!==d.id):[...s,d.id])}} style={{ position:'absolute', top:12, right:14, background:saved.includes(d.id)?d.color:'rgba(247,244,239,0.8)', color:saved.includes(d.id)?'#FAFAF7':'var(--color-bark)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', fontSize:'0.75rem', display:'flex', alignItems:'center', justifyContent:'center' }}>{saved.includes(d.id)?'♥':'♡'}</button>
              </div>
              <div style={{ padding:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><h3 style={{ fontFamily:'var(--font-serif)', fontWeight:400, fontSize:'1.05rem', color:'var(--color-deep)' }}>{d.name}</h3><span style={{ fontSize:'0.72rem', color:d.color }}>{d.type}</span></div>
                <div style={{ display:'flex', gap:16, marginBottom:6 }}><span style={{ fontSize:'0.75rem', color:'var(--color-stone)' }}>{d.distance}</span><span style={{ fontSize:'0.75rem', color:'var(--color-stone)' }}>{d.time}</span><span style={{ fontSize:'0.75rem', color:'var(--color-stone)' }}>{d.difficulty}</span></div>
                {expanded===d.id&&<p style={{ fontSize:'0.875rem', color:'var(--color-earth)', lineHeight:1.65, marginTop:8 }}>{d.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
