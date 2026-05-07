'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type Mode = 'refresh' | 'quiet' | 'full' | 'alpine' | null
type Zone = 'bed' | 'towels' | 'window' | 'minibar' | 'bath' | null

const MODES = [
  {
    id: 'refresh' as const,
    name: 'Eco Refresh',
    desc: 'Fresh air, light touch on your space.',
    color: '#2D4A3E',
    light: 'rgba(45,74,62,0.06)',
    saves: { water: '48L', co2: '0.8 kg', time: '22 min', trees: '0.04' },
    glow: 'rgba(74,138,106,0.18)',
  },
  {
    id: 'quiet' as const,
    name: 'Quiet Mode',
    desc: 'Complete privacy. No entry today.',
    color: '#283048',
    light: 'rgba(40,48,72,0.07)',
    saves: { water: '80L', co2: '1.4 kg', time: '35 min', trees: '0.07' },
    glow: 'rgba(80,100,160,0.18)',
  },
  {
    id: 'full' as const,
    name: 'Full Comfort',
    desc: 'Complete service, fresh everything.',
    color: '#9B7D5E',
    light: 'rgba(155,125,94,0.07)',
    saves: { water: '0L', co2: '0 kg', time: '0 min', trees: '0' },
    glow: 'rgba(155,125,94,0.18)',
  },
  {
    id: 'alpine' as const,
    name: 'Alpine Reset',
    desc: 'Natural products, mountain air, herbs.',
    color: '#3A5838',
    light: 'rgba(58,88,56,0.07)',
    saves: { water: '30L', co2: '0.6 kg', time: '15 min', trees: '0.03' },
    glow: 'rgba(90,138,86,0.18)',
  },
]

const ZONES = {
  bed: {
    label: 'Linen & Bed',
    options: ['Change full linen', 'Keep for tomorrow', 'Top sheet only'],
    icon: '▭',
    desc: 'Fresh mountain cotton or leave perfectly undisturbed.',
  },
  towels: {
    label: 'Towels',
    options: ['Replace all', 'Replace used only', 'Keep all'],
    icon: '≋',
    desc: 'Towels on the floor are replaced. On the rail, kept.',
  },
  window: {
    label: 'Air & Light',
    options: ['Open window before service', 'Keep closed', 'Air only, no service'],
    icon: '◫',
    desc: 'Morning alpine air is the finest welcome.',
  },
  minibar: {
    label: 'Minibar',
    options: ['Restock regional only', 'Restock full', 'Skip today'],
    icon: '◻',
    desc: 'Local producers, seasonal selections.',
  },
  bath: {
    label: 'Bathroom',
    options: ['Full clean', 'Light clean', 'Skip today'],
    icon: '◯',
    desc: 'Natural alpine-herb cleaning products.',
  },
}

export default function HousekeepingPage() {
  const [mode, setMode]           = useState<Mode>(null)
  const [activeZone, setActiveZone] = useState<Zone>(null)
  const [choices, setChoices]     = useState<Partial<Record<string, string>>>({})
  const [confirmed, setConfirmed] = useState(false)
  const [loaded, setLoaded]       = useState(false)
  const [pulse, setPulse]         = useState(false)
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    pulseRef.current = setInterval(() => setPulse(p => !p), 2400)
    return () => { if (pulseRef.current) clearInterval(pulseRef.current) }
  }, [])

  const selectedMode = MODES.find(m => m.id === mode)
  const modeColor    = selectedMode?.color ?? '#2D4A3E'
  const modeGlow     = selectedMode?.glow  ?? 'rgba(45,74,62,0.12)'
  const modeLight    = selectedMode?.light ?? 'transparent'

  const setZoneChoice = (zone: string, option: string) => {
    setChoices(prev => ({ ...prev, [zone]: option }))
    setActiveZone(null)
  }

  const zoneStyle = (id: Zone): React.CSSProperties => ({
    position: 'absolute',
    cursor: 'pointer',
    borderRadius: 10,
    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
    border: choices[id ?? ''] ? `1.5px solid ${modeColor}50` : '1.5px solid rgba(200,184,154,0.3)',
    background: choices[id ?? '']
      ? `${modeGlow}`
      : activeZone === id
      ? 'rgba(255,255,255,0.65)'
      : 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(8px)',
    boxShadow: activeZone === id
      ? `0 6px 24px ${modeGlow}, 0 0 0 2px ${modeColor}30`
      : '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  })

  return (
    <main style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 50% 30%, ${modeGlow} 0%, #F0EBE3 60%, #E8E0D4 100%)`,
      transition: 'background 1.2s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.4rem 2rem', position:'sticky', top:0, background:'rgba(247,244,239,0.88)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(200,184,154,0.18)', zIndex:10 }}>
        <Link href="/"><span style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.25rem', color:'var(--color-deep)', cursor:'pointer' }}>AlpineFlow</span></Link>
        <Link href="/guest"><span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.7rem', letterSpacing:'0.08em', color:'var(--color-stone)', cursor:'pointer' }}>Back to Stay</span></Link>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '3.5rem 2rem 5rem', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(18px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* Heading */}
        <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.72rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--color-stone)', marginBottom:'0.8rem' }}>Room 214 &middot; Tonight</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(2rem,4.5vw,3.4rem)', letterSpacing:'-0.025em', lineHeight:1.08, color:'var(--color-deep)', marginBottom:'0.6rem' }}>
          How shall we<br /><em style={{ fontStyle:'italic', color: modeColor }}>prepare your room?</em>
        </h1>
        <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.95rem', color:'var(--color-bark)', lineHeight:1.7, maxWidth:'44ch', marginBottom:'3rem' }}>Touch each element in your room to personalise your evening service.</p>

        {/* Mode selector pills */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'3.5rem' }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(mode === m.id ? null : m.id)}
              style={{
                fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.8rem',
                letterSpacing:'0.03em',
                padding:'8px 18px', borderRadius:100, cursor:'pointer',
                background: mode === m.id ? m.color : 'rgba(250,250,247,0.8)',
                color: mode === m.id ? '#FAFAF7' : 'var(--color-earth)',
                border: mode === m.id ? `1px solid ${m.color}` : '1px solid rgba(200,184,154,0.28)',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: mode === m.id ? `0 4px 18px ${m.glow}` : 'none',
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'start' }}>

          {/* Room scene */}
          <div>
            <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.68rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--color-stone)', marginBottom:'1rem' }}>Your room &middot; touch to customise</p>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '70%',
              borderRadius: 20,
              overflow: 'hidden',
              background: `linear-gradient(160deg, #f5ede2 0%, #ede0d0 100%)`,
              boxShadow: `0 8px 48px ${modeGlow}, 0 2px 16px rgba(0,0,0,0.06)`,
              transition: 'box-shadow 1s ease',
              border: '1px solid rgba(200,184,154,0.3)',
            }}>
              {/* Floor texture */}
              <div style={{
                position:'absolute', inset:0,
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(180,150,110,0.06) 0px, rgba(180,150,110,0.06) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(0deg, rgba(180,150,110,0.06) 0px, rgba(180,150,110,0.06) 1px, transparent 1px, transparent 32px)',
              }} />

              {/* Ambient mode light */}
              <div style={{
                position:'absolute', inset:0,
                background: `radial-gradient(ellipse at 50% 20%, ${modeLight} 0%, transparent 70%)`,
                transition: 'background 1s ease',
                pointerEvents: 'none',
              }} />

              {/* Window — top right */}
              <div
                onClick={() => setActiveZone(activeZone === 'window' ? null : 'window')}
                style={{ ...zoneStyle('window'), top:'8%', right:'6%', width:'22%', height:'22%' }}
              >
                <div style={{ fontSize:'1.2rem', opacity:0.5 }}>{ZONES.window.icon}</div>
                <span style={{ fontSize:'0.6rem', fontFamily:'var(--font-sans)', color: modeColor, letterSpacing:'0.06em', textAlign:'center', lineHeight:1.2 }}>
                  {choices.window ? choices.window.split(' ').slice(0,2).join(' ') : ZONES.window.label}
                </span>
                {!choices.window && (
                  <div style={{ width:6, height:6, borderRadius:'50%', background: pulse ? modeColor : 'transparent', transition:'background 0.6s ease', position:'absolute', top:6, right:6 }} />
                )}
              </div>

              {/* Bed — center */}
              <div
                onClick={() => setActiveZone(activeZone === 'bed' ? null : 'bed')}
                style={{ ...zoneStyle('bed'), top:'20%', left:'12%', width:'52%', height:'38%' }}
              >
                {/* Pillow details */}
                <div style={{ display:'flex', gap:6, marginBottom:4 }}>
                  {[0,1].map(i=>(
                    <div key={i} style={{ width:28, height:18, borderRadius:6, background:'rgba(250,248,244,0.9)', border:'1px solid rgba(200,184,154,0.3)', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }} />
                  ))}
                </div>
                <div style={{ width:'78%', height:22, borderRadius:6, background:'rgba(245,240,232,0.85)', border:'1px solid rgba(200,184,154,0.25)' }} />
                <span style={{ fontSize:'0.6rem', fontFamily:'var(--font-sans)', color: modeColor, letterSpacing:'0.06em', marginTop:6 }}>
                  {choices.bed ? choices.bed.split(' ').slice(0,3).join(' ') : ZONES.bed.label}
                </span>
                {!choices.bed && (
                  <div style={{ width:6, height:6, borderRadius:'50%', background: pulse ? modeColor : 'transparent', transition:'background 0.6s ease', position:'absolute', top:6, right:6 }} />
                )}
              </div>

              {/* Towels — right side */}
              <div
                onClick={() => setActiveZone(activeZone === 'towels' ? null : 'towels')}
                style={{ ...zoneStyle('towels'), top:'20%', right:'6%', width:'18%', height:'28%' }}
              >
                <div style={{ fontSize:'1rem', opacity:0.45 }}>{ZONES.towels.icon}</div>
                <span style={{ fontSize:'0.58rem', fontFamily:'var(--font-sans)', color: modeColor, letterSpacing:'0.05em', textAlign:'center', lineHeight:1.2 }}>
                  {choices.towels ? 'Set' : ZONES.towels.label}
                </span>
                {!choices.towels && (
                  <div style={{ width:5, height:5, borderRadius:'50%', background: pulse ? modeColor : 'transparent', transition:'background 0.6s ease', position:'absolute', top:5, right:5 }} />
                )}
              </div>

              {/* Minibar — bottom left */}
              <div
                onClick={() => setActiveZone(activeZone === 'minibar' ? null : 'minibar')}
                style={{ ...zoneStyle('minibar'), bottom:'12%', left:'8%', width:'22%', height:'20%' }}
              >
                <div style={{ fontSize:'0.9rem', opacity:0.45 }}>{ZONES.minibar.icon}</div>
                <span style={{ fontSize:'0.58rem', fontFamily:'var(--font-sans)', color: modeColor, letterSpacing:'0.05em', textAlign:'center', lineHeight:1.2 }}>
                  {choices.minibar ? 'Set' : ZONES.minibar.label}
                </span>
              </div>

              {/* Bathroom — bottom right */}
              <div
                onClick={() => setActiveZone(activeZone === 'bath' ? null : 'bath')}
                style={{ ...zoneStyle('bath'), bottom:'8%', right:'8%', width:'30%', height:'26%' }}
              >
                <div style={{ fontSize:'1rem', opacity:0.45 }}>{ZONES.bath.icon}</div>
                <span style={{ fontSize:'0.6rem', fontFamily:'var(--font-sans)', color: modeColor, letterSpacing:'0.05em', textAlign:'center', lineHeight:1.2 }}>
                  {choices.bath ? 'Set' : ZONES.bath.label}
                </span>
                {!choices.bath && (
                  <div style={{ width:5, height:5, borderRadius:'50%', background: pulse ? modeColor : 'transparent', transition:'background 0.6s ease', position:'absolute', top:5, right:5 }} />
                )}
              </div>

              {/* Room number label */}
              <div style={{ position:'absolute', bottom:12, left:14, fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.62rem', letterSpacing:'0.12em', color:'rgba(100,80,60,0.45)', textTransform:'uppercase' }}>Room 214</div>
            </div>

            {/* Zone choice overlay */}
            {activeZone && (
              <div style={{
                marginTop: '1rem',
                borderRadius: 16,
                background: 'rgba(250,248,244,0.95)',
                border: `1px solid ${modeColor}28`,
                padding: '1.4rem',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 8px 32px ${modeGlow}`,
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.68rem', letterSpacing:'0.14em', textTransform:'uppercase', color: modeColor, marginBottom:6 }}>{ZONES[activeZone].label}</p>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.85rem', color:'var(--color-earth)', lineHeight:1.6, marginBottom:'1rem' }}>{ZONES[activeZone].desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {ZONES[activeZone].options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setZoneChoice(activeZone, opt)}
                      style={{
                        textAlign:'left', padding:'10px 14px', borderRadius:10,
                        background: choices[activeZone] === opt ? `${modeColor}12` : 'rgba(255,255,255,0.6)',
                        border: choices[activeZone] === opt ? `1px solid ${modeColor}40` : '1px solid rgba(200,184,154,0.22)',
                        color: choices[activeZone] === opt ? modeColor : 'var(--color-earth)',
                        fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.85rem',
                        cursor:'pointer', transition:'all 0.25s ease',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: impact + confirm */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

            {/* Impact card */}
            {selectedMode && (
              <div style={{
                borderRadius:18, padding:'1.8rem',
                background:`linear-gradient(135deg, ${selectedMode.color}14 0%, ${selectedMode.color}06 100%)`,
                border:`1px solid ${selectedMode.color}28`,
                transition:'all 0.8s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.68rem', letterSpacing:'0.16em', textTransform:'uppercase', color: modeColor, marginBottom:'1rem' }}>Tonight&apos;s impact</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem' }}>
                  {[
                    { label:'Water saved',    value: selectedMode.saves.water,  unit:''},
                    { label:'CO₂ avoided',   value: selectedMode.saves.co2,    unit:''},
                    { label:'Time saved',     value: selectedMode.saves.time,   unit:''},
                    { label:'Trees equiv.',   value: selectedMode.saves.trees,  unit:''},
                  ].map(s => (
                    <div key={s.label} style={{ padding:'0.875rem', borderRadius:12, background:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.6)' }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'1.4rem', color: modeColor, lineHeight:1, marginBottom:4 }}>{s.value}</div>
                      <div style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.68rem', color:'var(--color-stone)', letterSpacing:'0.04em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.8rem', color:'var(--color-bark)', lineHeight:1.65, marginTop:'1rem', borderTop:`1px solid ${modeColor}15`, paddingTop:'1rem' }}>
                  {selectedMode.desc}
                </p>
              </div>
            )}

            {/* Choices summary */}
            {Object.keys(choices).length > 0 && (
              <div style={{ borderRadius:14, padding:'1.2rem', background:'rgba(250,248,244,0.8)', border:'1px solid rgba(200,184,154,0.22)' }}>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.68rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--color-stone)', marginBottom:'0.75rem' }}>Your preferences</p>
                {Object.entries(choices).map(([zone, choice]) => (
                  <div key={zone} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(200,184,154,0.12)' }}>
                    <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.8rem', color:'var(--color-bark)', textTransform:'capitalize' }}>{zone}</span>
                    <span style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.8rem', color: modeColor }}>{choice}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm */}
            {!confirmed ? (
              <button
                onClick={() => setConfirmed(true)}
                disabled={!mode}
                style={{
                  background: mode ? modeColor : 'rgba(200,190,180,0.4)',
                  color: mode ? '#FAFAF7' : 'rgba(150,140,130,0.6)',
                  border: 'none', borderRadius:100, padding:'12px 28px',
                  fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.88rem',
                  letterSpacing:'0.05em', cursor: mode ? 'pointer' : 'not-allowed',
                  transition:'all 0.4s ease',
                  boxShadow: mode ? `0 6px 24px ${modeGlow}` : 'none',
                }}
              >
                {mode ? `Confirm ${selectedMode?.name}` : 'Choose a mode first'}
              </button>
            ) : (
              <div style={{ borderRadius:18, padding:'2rem', background:'rgba(250,248,244,0.9)', border:`1px solid ${modeColor}28`, textAlign:'center' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:`${modeColor}15`, border:`1.5px solid ${modeColor}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'1.2rem' }}>✓</div>
                <h3 style={{ fontFamily:'var(--font-serif)', fontWeight:400, fontSize:'1.3rem', color:'var(--color-deep)', marginBottom:'0.4rem' }}>Noted with care.</h3>
                <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.85rem', color:'var(--color-bark)', lineHeight:1.65 }}>
                  Your room will be prepared as <strong style={{ color: modeColor }}>{selectedMode?.name}</strong>.
                  <br />Our team will honour every detail.
                </p>
              </div>
            )}

            {!mode && (
              <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'0.78rem', color:'var(--color-stone)', lineHeight:1.65 }}>
                Select a mode above, then touch elements in your room to personalise further.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
