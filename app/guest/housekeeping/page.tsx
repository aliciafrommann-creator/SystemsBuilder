'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useStay } from '@/lib/alpineflow/stay-context'

type Mode = 'refresh' | 'quiet' | 'full' | 'alpine' | null
type ZoneId = 'bed' | 'towels' | 'window' | 'minibar' | 'bath'

const ROOM_PHOTO = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80'

const MODES = [
  { id: 'refresh' as const, name: 'Eco Refresh',   desc: 'Fresh air, light touch.',              color: '#2D4A3E', light: 'rgba(45,74,62,0.06)',   saves: { water: '48L', co2: '0.8 kg', time: '22 min', trees: '0.04' }, glow: 'rgba(74,138,106,0.18)' },
  { id: 'quiet'   as const, name: 'Quiet Mode',    desc: 'Complete privacy. No entry today.',     color: '#283048', light: 'rgba(40,48,72,0.07)',    saves: { water: '80L', co2: '1.4 kg', time: '35 min', trees: '0.07' }, glow: 'rgba(80,100,160,0.18)' },
  { id: 'full'    as const, name: 'Full Comfort',  desc: 'Complete service, fresh everything.',   color: '#9B7D5E', light: 'rgba(155,125,94,0.07)',  saves: { water: '0L',  co2: '0 kg',   time: '0 min',  trees: '0'    }, glow: 'rgba(155,125,94,0.18)' },
  { id: 'alpine'  as const, name: 'Alpine Reset',  desc: 'Natural products, mountain herbs.',     color: '#3A5838', light: 'rgba(58,88,56,0.07)',    saves: { water: '30L', co2: '0.6 kg', time: '15 min', trees: '0.03' }, glow: 'rgba(90,138,86,0.18)' },
]

const ZONES: Record<ZoneId, { label: string; options: string[]; desc: string }> = {
  bed:     { label: 'Linen & Bed', options: ['Change full linen', 'Keep for tomorrow', 'Top sheet only'],         desc: 'Fresh mountain cotton or perfectly undisturbed.' },
  towels:  { label: 'Towels',     options: ['Replace all', 'Replace used only', 'Keep all'],                      desc: 'Floor = replace. Rail = keep.' },
  window:  { label: 'Air & Light',options: ['Open window before service', 'Keep closed', 'Air only, no service'], desc: 'Morning alpine air is the finest welcome.' },
  minibar: { label: 'Minibar',    options: ['Restock regional only', 'Restock full', 'Skip today'],               desc: 'Local producers, seasonal selections.' },
  bath:    { label: 'Bathroom',   options: ['Full clean', 'Light clean', 'Skip today'],                           desc: 'Natural alpine-herb cleaning products.' },
}

const ZONE_POS: Record<ZoneId, React.CSSProperties> = {
  window:  { top: '6%',    right: '9%'  },
  bed:     { top: '40%',   left: '42%', transform: 'translateX(-50%)' },
  towels:  { top: '22%',   right: '5%' },
  minibar: { bottom: '14%', left: '5%' },
  bath:    { bottom: '6%',  right: '6%' },
}

export default function HousekeepingPage() {
  const { stay } = useStay()
  const [mode, setMode]             = useState<Mode>(null)
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null)
  const [choices, setChoices]       = useState<Partial<Record<ZoneId, string>>>({})
  const [confirmed, setConfirmed]   = useState(false)
  const [loaded, setLoaded]         = useState(false)
  const [pulse, setPulse]           = useState(false)
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])
  useEffect(() => {
    pulseRef.current = setInterval(() => setPulse(p => !p), 2200)
    return () => { if (pulseRef.current) clearInterval(pulseRef.current) }
  }, [])

  const selectedMode = MODES.find(m => m.id === mode)
  const modeColor    = selectedMode?.color ?? '#2D4A3E'
  const modeGlow     = selectedMode?.glow  ?? 'rgba(45,74,62,0.12)'

  const setZoneChoice = (zone: ZoneId, option: string) => {
    setChoices(prev => ({ ...prev, [zone]: option }))
    setActiveZone(null)
  }

  const handleConfirm = async () => {
    setConfirmed(true)
    if (stay) {
      supabase.from('requests').insert({
        stay_id: stay.id,
        hotel_id: stay.hotel_id,
        type: 'housekeeping',
        payload: { mode, choices, room: stay.room_number, guest: stay.guest_name },
        status: 'pending',
      }).then(() => {})
    }
  }

  const zoneIds = Object.keys(ZONES) as ZoneId[]

  return (
    <main style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 50% 30%, ${modeGlow} 0%, #F0EBE3 60%, #E8E0D4 100%)`, transition: 'background 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.4rem 2rem', position: 'sticky', top: 0, background: 'rgba(247,244,239,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,184,154,0.18)', zIndex: 10 }}>
        <Link href="/"><span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.25rem', color: 'var(--color-deep)', cursor: 'pointer' }}>AlpineFlow</span></Link>
        <Link href="/guest"><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--color-stone)', cursor: 'pointer' }}>Back to Stay</span></Link>
      </header>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '3.5rem 2rem 5rem', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(18px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}>

        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: '0.8rem' }}>Room {stay?.room_number ?? '201'} &middot; Tonight</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem,4.5vw,3.4rem)', letterSpacing: '-0.025em', lineHeight: 1.08, color: 'var(--color-deep)', marginBottom: '0.6rem' }}>
          How shall we<br /><em style={{ fontStyle: 'italic', color: modeColor }}>prepare your room?</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.95rem', color: 'var(--color-bark)', lineHeight: 1.7, maxWidth: '44ch', marginBottom: '2.5rem' }}>Touch each element in your room to personalise your evening service.</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '3rem' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(mode === m.id ? null : m.id)} style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', letterSpacing: '0.03em', padding: '8px 18px', borderRadius: 100, cursor: 'pointer', background: mode === m.id ? m.color : 'rgba(250,250,247,0.8)', color: mode === m.id ? '#FAFAF7' : 'var(--color-earth)', border: mode === m.id ? `1px solid ${m.color}` : '1px solid rgba(200,184,154,0.28)', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow: mode === m.id ? `0 4px 18px ${m.glow}` : 'none' }}>
              {m.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: '1rem' }}>Your room &middot; touch to customise</p>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '70%', borderRadius: 20, overflow: 'hidden', boxShadow: `0 12px 56px ${modeGlow}, 0 4px 20px rgba(0,0,0,0.15)`, transition: 'box-shadow 1s ease' }}>
              <img src={ROOM_PHOTO} alt="Room" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.42) 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, background: selectedMode ? selectedMode.light : 'transparent', mixBlendMode: 'overlay', transition: 'background 1.2s ease', pointerEvents: 'none' }} />
              {zoneIds.map(id => (
                <div key={id} onClick={() => setActiveZone(activeZone === id ? null : id)} style={{ position: 'absolute', ...ZONE_POS[id], cursor: 'pointer', borderRadius: 100, padding: '7px 14px 7px 10px', display: 'flex', alignItems: 'center', gap: 7, background: choices[id] ? `${modeColor}e0` : activeZone === id ? 'rgba(252,250,246,0.92)' : 'rgba(10,8,6,0.58)', backdropFilter: 'blur(14px)', border: choices[id] ? `1px solid ${modeColor}` : activeZone === id ? `1px solid ${modeColor}70` : '1px solid rgba(255,255,255,0.2)', boxShadow: activeZone === id ? `0 6px 24px ${modeGlow}, 0 0 0 2px ${modeColor}20` : '0 2px 10px rgba(0,0,0,0.32)', transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)', zIndex: 2 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: choices[id] ? '#FAFAF7' : pulse ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)', transform: pulse && !choices[id] ? 'scale(1.45)' : 'scale(1)', transition: 'background 0.5s ease, transform 0.5s ease', boxShadow: choices[id] ? 'none' : pulse ? '0 0 6px rgba(255,255,255,0.6)' : 'none' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.04em', color: choices[id] ? '#FAFAF7' : activeZone === id ? modeColor : 'rgba(237,231,220,0.9)', whiteSpace: 'nowrap' }}>
                    {choices[id] ? `${ZONES[id].label} ✓` : ZONES[id].label}
                  </span>
                </div>
              ))}
              <div style={{ position: 'absolute', bottom: 14, left: 16, fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.14em', color: 'rgba(237,231,220,0.5)', textTransform: 'uppercase' }}>Room {stay?.room_number ?? '201'} &middot; Berghotel Sonnwend</div>
            </div>

            {activeZone && (
              <div style={{ marginTop: '1rem', borderRadius: 16, background: 'rgba(250,248,244,0.96)', border: `1px solid ${modeColor}28`, padding: '1.4rem', backdropFilter: 'blur(20px)', boxShadow: `0 8px 32px ${modeGlow}` }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: modeColor, marginBottom: 6 }}>{ZONES[activeZone].label}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.85rem', color: 'var(--color-earth)', lineHeight: 1.6, marginBottom: '1rem' }}>{ZONES[activeZone].desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ZONES[activeZone].options.map(opt => (
                    <button key={opt} onClick={() => setZoneChoice(activeZone, opt)} style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 10, background: choices[activeZone] === opt ? `${modeColor}12` : 'rgba(255,255,255,0.6)', border: choices[activeZone] === opt ? `1px solid ${modeColor}40` : '1px solid rgba(200,184,154,0.22)', color: choices[activeZone] === opt ? modeColor : 'var(--color-earth)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.25s ease' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {selectedMode && (
              <div style={{ borderRadius: 18, padding: '1.8rem', background: `linear-gradient(135deg, ${selectedMode.color}14 0%, ${selectedMode.color}06 100%)`, border: `1px solid ${selectedMode.color}28`, transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: modeColor, marginBottom: '1rem' }}>Tonight&apos;s impact</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  {[{ label: 'Water saved', value: selectedMode.saves.water }, { label: 'CO₂ avoided', value: selectedMode.saves.co2 }, { label: 'Time saved', value: selectedMode.saves.time }, { label: 'Trees equiv.', value: selectedMode.saves.trees }].map(s => (
                    <div key={s.label} style={{ padding: '0.875rem', borderRadius: 12, background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.4rem', color: modeColor, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', color: 'var(--color-stone)', letterSpacing: '0.04em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', color: 'var(--color-bark)', lineHeight: 1.65, marginTop: '1rem', borderTop: `1px solid ${modeColor}15`, paddingTop: '1rem' }}>{selectedMode.desc}</p>
              </div>
            )}

            {Object.keys(choices).length > 0 && (
              <div style={{ borderRadius: 14, padding: '1.2rem', background: 'rgba(250,248,244,0.8)', border: '1px solid rgba(200,184,154,0.22)' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: '0.75rem' }}>Your preferences</p>
                {(Object.entries(choices) as [ZoneId, string][]).map(([zone, choice]) => (
                  <div key={zone} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(200,184,154,0.12)' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', color: 'var(--color-bark)', textTransform: 'capitalize' }}>{ZONES[zone].label}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', color: modeColor }}>{choice}</span>
                  </div>
                ))}
              </div>
            )}

            {!confirmed ? (
              <button onClick={handleConfirm} disabled={!mode} style={{ background: mode ? modeColor : 'rgba(200,190,180,0.4)', color: mode ? '#FAFAF7' : 'rgba(150,140,130,0.6)', border: 'none', borderRadius: 100, padding: '12px 28px', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', letterSpacing: '0.05em', cursor: mode ? 'pointer' : 'not-allowed', transition: 'all 0.4s ease', boxShadow: mode ? `0 6px 24px ${modeGlow}` : 'none' }}>
                {mode ? `Confirm ${selectedMode?.name}` : 'Choose a mode first'}
              </button>
            ) : (
              <div style={{ borderRadius: 18, padding: '2rem', background: 'rgba(250,248,244,0.9)', border: `1px solid ${modeColor}28`, textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${modeColor}15`, border: `1.5px solid ${modeColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.2rem' }}>✓</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.3rem', color: 'var(--color-deep)', marginBottom: '0.4rem' }}>Noted with care.</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.85rem', color: 'var(--color-bark)', lineHeight: 1.65 }}>
                  Your room will be prepared as <strong style={{ color: modeColor }}>{selectedMode?.name}</strong>.<br />Our team will honour every detail.
                </p>
              </div>
            )}

            {!mode && (
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.78rem', color: 'var(--color-stone)', lineHeight: 1.65 }}>Select a mode above, then touch elements in your room to personalise further.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
