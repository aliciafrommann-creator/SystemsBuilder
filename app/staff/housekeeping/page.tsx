'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Request = {
  id: string
  room_id: string
  preference: string
  time_from: string
  time_to: string
  notes: string
  hotelkit_sync_status?: 'pending' | 'synced' | 'failed' | 'skipped'
  hotelkit_task_id?: string
  created_at: string
}

function SyncBadge({ req, onRetry }: { req: Request; onRetry: (id: string) => void }) {
  const s = req.hotelkit_sync_status
  if (s === 'synced') return <span style={{ fontSize: '0.7rem', color: '#4a8a6a', background: 'rgba(74,138,106,0.12)', borderRadius: 100, padding: '2px 8px' }}>✓ HotelKit</span>
  if (s === 'failed') return (
    <button onClick={() => onRetry(req.id)} style={{ fontSize: '0.7rem', color: '#c97a4a', background: 'rgba(201,122,74,0.1)', border: '1px solid rgba(201,122,74,0.2)', borderRadius: 100, padding: '2px 8px', cursor: 'pointer' }}>⚠ Retry</button>
  )
  if (s === 'pending') return <span style={{ fontSize: '0.7rem', color: 'rgba(237,231,220,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(201,169,110,0.4)', display: 'inline-block', animation: 'pulse 1.5s ease infinite' }} />Sync…</span>
  return null
}

function buildRoute(requests: Request[]): Request[] {
  return [...requests].sort((a, b) => {
    if (a.time_from !== b.time_from) return a.time_from.localeCompare(b.time_from)
    return a.room_id.localeCompare(b.room_id)
  })
}

export default function StaffHousekeepingPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading]   = useState(true)
  const [done, setDone]         = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.from('housekeeping_requests').select('*').order('time_from')
      .then(({ data }) => { if (data) setRequests(data as Request[]); setLoading(false) })

    const ch = supabase.channel('hk_staff')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'housekeeping_requests' },
        () => supabase.from('housekeeping_requests').select('*').order('time_from')
          .then(({ data }) => { if (data) setRequests(data as Request[]) }))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  async function retrySync(id: string) {
    const req = requests.find(r => r.id === id)
    if (!req) return
    setRequests(rs => rs.map(r => r.id === id ? { ...r, hotelkit_sync_status: 'pending' } : r))
    fetch('/api/hotelkit/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'housekeeping_request', roomId: req.room_id, requestId: id, notes: req.notes }),
    }).then(() => supabase.from('housekeeping_requests').select('*').order('time_from')
      .then(({ data }) => { if (data) setRequests(data as Request[]) }))
  }

  const route = buildRoute(requests.filter(r => !done.has(r.id)))

  const PREF_LABEL: Record<string, string> = {
    prepare: 'Zimmer vorbereiten',
    dnd: 'Bitte nicht stören',
    towels_only: 'Nur Handtücher',
    eco_rhythm: 'Eco-Rhythmus',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060d0a,#0d1c14 55%,#060d0a)', padding: '2rem' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:0.4;}50%{opacity:1;}}`}</style>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <Link href="/staff"><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(237,231,220,0.3)', letterSpacing: '0.06em', cursor: 'pointer' }}>← Staff</span></Link>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.8rem', color: '#FAFAF7', marginTop: '0.3rem' }}>Housekeeping</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(201,169,110,0.55)', letterSpacing: '0.06em' }}>{route.length} ausstehend</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.65rem', color: 'rgba(237,231,220,0.22)' }}>Route optimiert</p>
          </div>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', color: 'rgba(237,231,220,0.35)', textAlign: 'center', paddingTop: '3rem' }}>Wird geladen…</p>
        ) : route.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.2rem', color: 'rgba(237,231,220,0.5)' }}>Alle Zimmer erledigt.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {route.map((req, i) => (
              <div key={req.id} style={{ borderRadius: 16, padding: '1.2rem 1.4rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 1, transition: 'all 0.3s ease' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(201,169,110,0.7)' }}>{i + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.88rem', color: '#FAFAF7' }}>Zimmer {req.room_id}</p>
                    <SyncBadge req={req} onRetry={retrySync} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.76rem', color: 'rgba(237,231,220,0.45)' }}>{PREF_LABEL[req.preference] ?? req.preference}</p>
                  {req.notes && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.28)', marginTop: '0.2rem', fontStyle: 'italic' }}>{req.notes}</p>}
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.66rem', color: 'rgba(201,169,110,0.35)', marginTop: '0.3rem' }}>{req.time_from}–{req.time_to} Uhr</p>
                </div>
                <button
                  onClick={() => setDone(d => new Set([...d, req.id]))}
                  style={{ padding: '7px 16px', borderRadius: 100, background: 'rgba(74,138,106,0.12)', border: '1px solid rgba(74,138,106,0.25)', color: 'rgba(74,138,106,0.8)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(74,138,106,0.22)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(74,138,106,0.12)' }}
                >
                  Erledigt
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
