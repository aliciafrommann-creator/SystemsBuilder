'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATS = [
  { label:'Occupied rooms',    value:'34', sub:'of 42',          icon:'◎', color:'#2D4A3E' },
  { label:'Arrivals today',    value:'8',  sub:'guests expected', icon:'◇', color:'#9B7D5E' },
  { label:'Departures',        value:'5',  sub:'by 11:00',       icon:'◠', color:'#283040' },
  { label:'Wellness bookings', value:'19', sub:'today',          icon:'◯', color:'#4A6741' },
]
const HK = [
  { room:'101', guest:'Hoffmann', mode:'Eco Refresh',  priority:'Now',   status:'pending'    },
  { room:'204', guest:'Mayer',    mode:'Quiet Mode',   priority:'DND',   status:'dnd'        },
  { room:'308', guest:'Bauer',    mode:'Full Comfort', priority:'Now',   status:'inprogress' },
  { room:'412', guest:'Schneider',mode:'Alpine Reset', priority:'14:00', status:'scheduled'  },
  { room:'305', guest:'Fischer',  mode:'Eco Refresh',  priority:'Now',   status:'done'       },
]
const WEEK = [
  { day:'Mon',water:420,co2:7.2 }, { day:'Tue',water:380,co2:6.4 }, { day:'Wed',water:310,co2:5.2 },
  { day:'Thu',water:290,co2:4.9 }, { day:'Fri',water:350,co2:5.8 }, { day:'Sat',water:480,co2:8.1 }, { day:'Sun',water:390,co2:6.6 },
]
const ACTIVITY = [
  { time:'09:42', event:'Room 308 — Housekeeping started' },
  { time:'09:31', event:'New booking: Wellness Ritual, 14:00' },
  { time:'09:18', event:'Room 204 — DND activated by guest' },
  { time:'08:55', event:'5 check-outs processed' },
  { time:'08:30', event:'Sustainability report ready' },
]
const SC: Record<string,string> = { pending:'#9B7D5E', dnd:'#283040', inprogress:'#4A6741', scheduled:'#2D4A3E', done:'rgba(45,74,62,0.4)' }
const SL: Record<string,string> = { pending:'Pending', dnd:'Do Not Disturb', inprogress:'In Progress', scheduled:'Scheduled', done:'Done' }

export default function HotelDashboard() {
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState<'overview'|'housekeeping'|'sustainability'|'bookings'>('overview')
  const [time, setTime] = useState('')
  useEffect(() => {
    setTimeout(() => setLoaded(true), 80)
    const tick = () => setTime(new Date().toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'}))
    tick(); const iv = setInterval(tick,60000); return () => clearInterval(iv)
  }, [])
  const maxW = Math.max(...WEEK.map(d=>d.water))
  const TABS = [{id:'overview',l:'Overview',i:'◎'},{id:'housekeeping',l:'Housekeeping',i:'◊'},{id:'bookings',l:'Bookings',i:'◇'},{id:'sustainability',l:'Sustainability',i:'◈'}]

  return (
    <main className="min-h-screen" style={{ background:'var(--color-night)' }}>
      <div style={{ display:'flex', minHeight:'100vh' }}>
        {/* Sidebar */}
        <aside style={{ width:220, minHeight:'100vh', background:'rgba(15,28,24,0.98)', borderRight:'1px solid rgba(45,74,62,0.35)', padding:'2rem 1.5rem', display:'none' }} className="md:flex flex-col">
          <Link href="/"><div style={{ marginBottom:'3rem' }}>
            <p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.2rem', color:'rgba(250,250,247,0.8)' }}>AlpineFlow</p>
            <p style={{ fontSize:'0.65rem', color:'rgba(201,169,110,0.5)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Hotel Dashboard</p>
          </div></Link>
          <nav style={{ flex:1 }}>
            {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id as typeof tab)} style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', textAlign:'left', padding:'0.6rem 0.75rem', borderRadius:8, marginBottom:'0.25rem', background:tab===t.id?'rgba(45,74,62,0.35)':'transparent', border:tab===t.id?'1px solid rgba(45,74,62,0.5)':'1px solid transparent', color:tab===t.id?'rgba(250,250,247,0.9)':'rgba(237,231,220,0.45)', fontSize:'0.85rem', cursor:'pointer', fontFamily:'var(--font-sans)', fontWeight:300 }}><span style={{ opacity:0.7 }}>{t.i}</span>{t.l}</button>))}
          </nav>
          <div style={{ borderTop:'1px solid rgba(45,74,62,0.3)', paddingTop:'1.5rem' }}>
            <p style={{ fontSize:'0.7rem', color:'rgba(237,231,220,0.3)' }}>Today</p>
            <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.5rem', color:'rgba(250,250,247,0.6)', fontWeight:300 }}>{time}</p>
          </div>
        </aside>

        {/* Content */}
        <div style={{ flex:1, padding:'2rem', opacity:loaded?1:0, transition:'opacity 0.8s ease' }}>
          {/* Mobile tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', overflowX:'auto', paddingBottom:4 }} className="md:hidden">
            {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id as typeof tab)} style={{ padding:'0.5rem 1rem', borderRadius:100, background:tab===t.id?'rgba(45,74,62,0.5)':'rgba(45,74,62,0.15)', border:tab===t.id?'1px solid rgba(45,74,62,0.6)':'1px solid rgba(45,74,62,0.2)', color:tab===t.id?'#FAFAF7':'rgba(237,231,220,0.5)', fontSize:'0.8rem', cursor:'pointer', whiteSpace:'nowrap' }}>{t.l}</button>))}
          </div>

          {tab==='overview'&&<>
            <p className="text-label mb-1" style={{ color:'rgba(201,169,110,0.6)' }}>Hotel Operations</p>
            <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(1.8rem,3vw,2.5rem)', letterSpacing:'-0.02em', color:'rgba(250,250,247,0.9)', lineHeight:1.1, marginBottom:'2rem' }}>Good morning. A calm day ahead.</h1>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:24 }} className="lg:grid-cols-4">
              {STATS.map(s=>(<div key={s.label} style={{ background:'rgba(26,46,40,0.6)', border:'1px solid rgba(45,74,62,0.3)', borderRadius:'1rem', padding:'1.5rem' }}>
                <p style={{ fontSize:'1rem', color:s.color, marginBottom:'0.75rem', opacity:0.7 }}>{s.icon}</p>
                <p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'2.2rem', color:'rgba(250,250,247,0.9)', letterSpacing:'-0.03em', lineHeight:1, marginBottom:'0.25rem' }}>{s.value}</p>
                <p style={{ fontSize:'0.75rem', color:'rgba(237,231,220,0.4)', marginBottom:2 }}>{s.label}</p>
                <p style={{ fontSize:'0.65rem', color:'rgba(237,231,220,0.25)' }}>{s.sub}</p>
              </div>))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ background:'rgba(26,46,40,0.6)', border:'1px solid rgba(45,74,62,0.3)', borderRadius:'1rem', padding:'1.5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}><p style={{ fontWeight:400, fontSize:'0.875rem', color:'rgba(250,250,247,0.7)' }}>Housekeeping</p><button onClick={()=>setTab('housekeeping')} style={{ fontSize:'0.7rem', color:'rgba(201,169,110,0.6)', cursor:'pointer', background:'none', border:'none' }}>All →</button></div>
                {HK.slice(0,4).map(r=>(<div key={r.room} style={{ display:'flex', alignItems:'center', gap:12, padding:'0.5rem 0', borderBottom:'1px solid rgba(45,74,62,0.2)' }}><span style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', color:'rgba(250,250,247,0.6)', minWidth:36 }}>{r.room}</span><span style={{ flex:1, fontSize:'0.78rem', color:'rgba(237,231,220,0.5)' }}>{r.mode}</span><span style={{ fontSize:'0.65rem', color:SC[r.status], background:`${SC[r.status]}18`, border:`1px solid ${SC[r.status]}33`, borderRadius:100, padding:'2px 8px' }}>{SL[r.status]}</span></div>))}
              </div>
              <div style={{ background:'rgba(26,46,40,0.6)', border:'1px solid rgba(45,74,62,0.3)', borderRadius:'1rem', padding:'1.5rem' }}>
                <p style={{ fontWeight:400, fontSize:'0.875rem', color:'rgba(250,250,247,0.7)', marginBottom:20 }}>Activity</p>
                {ACTIVITY.map((a,i)=>(<div key={i} style={{ display:'flex', gap:12, padding:'0.5rem 0', borderBottom:'1px solid rgba(45,74,62,0.15)' }}><span style={{ fontSize:'0.7rem', color:'rgba(201,169,110,0.5)', minWidth:36, paddingTop:2 }}>{a.time}</span><span style={{ fontSize:'0.8rem', color:'rgba(237,231,220,0.55)', lineHeight:1.5 }}>{a.event}</span></div>))}
              </div>
            </div>
          </>}

          {tab==='housekeeping'&&<>
            <p className="text-label mb-2" style={{ color:'rgba(201,169,110,0.6)' }}>Housekeeping</p>
            <h2 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'2rem', color:'rgba(250,250,247,0.9)', letterSpacing:'-0.02em', marginBottom:'2rem' }}>Today’s room queue</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {HK.map(r=>(<div key={r.room} style={{ background:'rgba(26,46,40,0.6)', border:`1px solid ${SC[r.status]}22`, borderRadius:'1rem', padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:20 }}>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', color:'rgba(250,250,247,0.6)', fontWeight:300, minWidth:48 }}>{r.room}</p>
                <div style={{ width:1, height:36, background:'rgba(45,74,62,0.4)' }} />
                <div style={{ flex:1 }}><p style={{ fontSize:'0.9rem', color:'rgba(250,250,247,0.8)', marginBottom:3 }}>{r.guest}</p><p style={{ fontSize:'0.75rem', color:'rgba(237,231,220,0.4)' }}>{r.mode}</p></div>
                <div style={{ textAlign:'right' }}><span style={{ display:'inline-block', fontSize:'0.72rem', color:SC[r.status], background:`${SC[r.status]}18`, border:`1px solid ${SC[r.status]}33`, borderRadius:100, padding:'4px 12px' }}>{SL[r.status]}</span><p style={{ fontSize:'0.68rem', color:'rgba(237,231,220,0.3)', marginTop:4 }}>{r.priority}</p></div>
              </div>))}
            </div>
          </>}

          {tab==='sustainability'&&<>
            <p className="text-label mb-2" style={{ color:'rgba(201,169,110,0.6)' }}>Sustainability</p>
            <h2 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'2rem', color:'rgba(250,250,247,0.9)', letterSpacing:'-0.02em', marginBottom:'2rem' }}>Weekly impact</h2>
            <div style={{ background:'rgba(26,46,40,0.6)', border:'1px solid rgba(45,74,62,0.3)', borderRadius:'1rem', padding:'1.75rem', marginBottom:12 }}>
              <p style={{ fontSize:'0.8rem', color:'rgba(201,169,110,0.6)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:24 }}>Water saved (litres)</p>
              <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
                {WEEK.map(d=>(<div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:'100%', height:`${(d.water/maxW)*100}%`, background:'linear-gradient(to top, rgba(45,74,62,0.8), rgba(74,103,65,0.6))', borderRadius:'4px 4px 0 0', minHeight:4 }} />
                  <p style={{ fontSize:'0.65rem', color:'rgba(237,231,220,0.3)' }}>{d.day}</p>
                </div>))}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[{l:'Water saved',v:'2,620 L'},{l:'CO₂ avoided',v:'44.2 kg'},{l:'Eco stays chosen',v:'78%'},{l:'Local experiences',v:'34'}].map(m=>(<div key={m.l} style={{ background:'rgba(26,46,40,0.6)', border:'1px solid rgba(45,74,62,0.3)', borderRadius:'1rem', padding:'1.5rem' }}><p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.8rem', color:'rgba(250,250,247,0.9)', letterSpacing:'-0.02em', lineHeight:1, marginBottom:'0.4rem' }}>{m.v}</p><p style={{ fontSize:'0.75rem', color:'rgba(237,231,220,0.4)' }}>{m.l}</p></div>))}
            </div>
          </>}

          {tab==='bookings'&&<>
            <p className="text-label mb-2" style={{ color:'rgba(201,169,110,0.6)' }}>Bookings</p>
            <h2 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'2rem', color:'rgba(250,250,247,0.9)', letterSpacing:'-0.02em', marginBottom:'2rem' }}>Arrivals & Stays</h2>
            {[{r:'201',g:'Familie Hoffmann',a:'Today',d:'12 May',m:'Eco Stay',n:4},{r:'305',g:'J. Mayer',a:'Today',d:'10 May',m:'Deep Rest',n:2},{r:'110',g:'Dr. K. Bauer',a:'Tomorrow',d:'14 May',m:'Wellness Stay',n:6},{r:'402',g:'A. Schneider',a:'Tomorrow',d:'11 May',m:'Explorer Stay',n:3},{r:'218',g:'M. Fischer',a:'10 May',d:'15 May',m:'Alpine Reset',n:5}].map(b=>(
              <div key={b.r} style={{ background:'rgba(26,46,40,0.6)', border:'1px solid rgba(45,74,62,0.25)', borderRadius:'1rem', padding:'1.25rem 1.5rem', marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:20 }}>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.3rem', color:'rgba(201,169,110,0.5)', fontWeight:300, minWidth:44 }}>{b.r}</p>
                <div style={{ flex:1 }}><p style={{ fontSize:'0.9rem', color:'rgba(250,250,247,0.8)', marginBottom:3 }}>{b.g}</p><p style={{ fontSize:'0.72rem', color:'rgba(237,231,220,0.35)' }}>{b.a} → {b.d} · {b.n} nights</p></div>
                <span style={{ fontSize:'0.7rem', color:'rgba(201,169,110,0.7)', background:'rgba(201,169,110,0.08)', border:'1px solid rgba(201,169,110,0.15)', borderRadius:100, padding:'3px 10px' }}>{b.m}</span>
              </div>
            ))}
          </>}
        </div>
      </div>
    </main>
  )
}
