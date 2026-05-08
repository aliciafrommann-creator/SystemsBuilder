'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useStay } from '@/lib/alpineflow/stay-context'

type RoomState = {
  comfort_mode: 'guest_present' | 'resting'
  updated_at: string
  guest_away_since?: string | null
}

const CSS = `
@keyframes breathe { 0%,100%{transform:scale(1);opacity:0.6;} 50%{transform:scale(1.22);opacity:1;} }
@keyframes sk { 0%,100%{opacity:0.25;} 50%{opacity:0.55;} }
`

export function AdaptiveComfortCard() {
  const { stay, isDemoMode } = useStay()
  const [state, setState]   = useState<RoomState | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [confirmed, setConfirmed] = useState('')

  const roomId  = stay?.room_number ?? '201'
  const hotelId = stay?.hotel_id   ?? 'hotel-demo'

  useEffect(() => {
    if (!stay) { setLoading(false); return }
    if (isDemoMode) {
      setState({ comfort_mode: 'guest_present', updated_at: new Date().toISOString() })
      setLoading(false)
      return
    }
    supabase.from('room_states').select('*')
      .eq('hotel_id', hotelId).eq('room_id', roomId).single()
      .then(({ data }) => { if (data) setState(data as RoomState); setLoading(false) })

    const ch = supabase.channel(`rm_${hotelId}_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_states', filter: `room_id=eq.${roomId}` },
        p => setState(p.new as RoomState))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [stay, hotelId, roomId, isDemoMode])

  async function toggle() {
    const next: 'resting' | 'guest_present' = state?.comfort_mode === 'guest_present' ? 'resting' : 'guest_present'
    const msg = next === 'resting' ? 'Zimmer erholt sich.' : 'Zimmer wartet auf dich.'
    if (isDemoMode) {
      setState(s => s ? { ...s, comfort_mode: next } : s)
      setConfirmed(msg); setTimeout(() => setConfirmed(''), 2500)
      return
    }
    if (saving) return
    setSaving(true)
    const { data } = await supabase.from('room_states').upsert({
      hotel_id: hotelId, room_id: roomId, comfort_mode: next,
      guest_away_since: next === 'resting' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'hotel_id,room_id' }).select().single()
    if (data) setState(data as RoomState)
    if (next === 'resting') {
      fetch('/api/hotelkit/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'adaptive_comfort_away', hotelId, roomId, stayId: stay?.id }) }).catch(() => {})
    }
    setSaving(false)
    setConfirmed(msg); setTimeout(() => setConfirmed(''), 2500)
  }

  const isResting = state?.comfort_mode === 'resting'
  const accent    = isResting ? '#4a8a6a' : '#C9A96E'

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div style={{ borderRadius: 20, padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[80, 55, 40].map((w, i) => (
          <div key={i} style={{ height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.07)', marginBottom: 10, width: `${w}%`, animation: 'sk 1.8s ease infinite', animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </>
  )

  return (
    <>
      <style>{CSS}</style>
      <button onClick={toggle} style={{ width: '100%', textAlign: 'left', borderRadius: 20, padding: '1.5rem 1.8rem', background: isResting ? 'linear-gradient(135deg,#0d1810,#182820)' : 'linear-gradient(135deg,#1a1208,#251c0c)', border: `1px solid ${accent}28`, cursor: 'pointer', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', right: '1.5rem', transform: 'translateY(-50%)', width: 52, height: 52, borderRadius: '50%', background: `${accent}14`, animation: 'breathe 4s ease-in-out infinite', pointerEvents: 'none' }} />
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: `${accent}70`, marginBottom: '0.55rem' }}>Dein Zimmer</p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.12rem', color: '#FAFAF7', lineHeight: 1.3, marginBottom: '0.3rem' }}>
          {isResting ? 'Dein Zimmer erholt sich gerade' : 'Dein Zimmer wartet auf dich'}
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.76rem', color: 'rgba(237,231,220,0.38)', lineHeight: 1.65 }}>
          {isResting ? 'Temperatur, Licht und Luft werden sanft zurückgefahren.' : 'Alles ist auf deine Ankunft vorbereitet.'}
        </p>
        {confirmed && <p style={{ marginTop: '0.75rem', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.74rem', color: accent, letterSpacing: '0.04em' }}>{confirmed}</p>}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 32, height: 18, borderRadius: 9, background: isResting ? '#1a3328' : 'rgba(255,255,255,0.08)', border: `1px solid ${accent}35`, position: 'relative', transition: 'all 0.4s ease', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 2, left: isResting ? 15 : 2, width: 12, height: 12, borderRadius: '50%', background: accent, transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', boxShadow: `0 0 8px ${accent}80` }} />
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', color: 'rgba(237,231,220,0.38)', letterSpacing: '0.06em' }}>
            {isResting ? 'Eco-Modus aktiv' : 'Komfort-Modus'}
          </span>
        </div>
      </button>
    </>
  )
}
