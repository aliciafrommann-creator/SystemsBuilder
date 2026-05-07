'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function QREntry() {
  const params = useParams()
  const router = useRouter()
  const [phase, setPhase] = useState<'loading'|'greeting'|'entering'>('loading')
  const hotelName = 'Hotel Alpenblick'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('greeting'), 600)
    const t2 = setTimeout(() => setPhase('entering'), 2600)
    const t3 = setTimeout(() => router.push('/guest'), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [router])

  return (
    <main style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg, #1A2E28 0%, #2D4A3E 100%)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(201,169,110,0.12) 0%, transparent 65%)' }} />
      <div className="texture-noise" />
      <div style={{ textAlign:'center', position:'relative', zIndex:10 }}>
        {phase==='loading' && <div style={{ width:48, height:48, border:'1px solid rgba(201,169,110,0.3)', borderTop:'1px solid rgba(201,169,110,0.8)', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto' }} />}
        {phase==='greeting' && <div style={{ animation:'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards' }}><p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2rem,6vw,3.5rem)', color:'#FAFAF7', letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:'1rem' }}>Welcome to<br /><em style={{ fontStyle:'italic', color:'rgba(201,169,110,0.9)' }}>{hotelName}</em></p><p style={{ color:'rgba(237,231,220,0.5)', fontSize:'0.95rem' }}>Your experience is being prepared…</p></div>}
        {phase==='entering' && <div style={{ animation:'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}><p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2.5rem,7vw,4.5rem)', color:'#FAFAF7', letterSpacing:'-0.03em' }}>AlpineFlow</p><p style={{ marginTop:'0.75rem', color:'rgba(201,169,110,0.7)', letterSpacing:'0.15em', fontSize:'0.75rem', textTransform:'uppercase' }}>Entering your stay…</p></div>}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </main>
  )
}
