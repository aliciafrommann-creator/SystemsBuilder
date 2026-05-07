'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const HOTEL_ID = 'hotel-demo'

type Req = { id: string; type: string; payload: Record<string, unknown>; status: string; created_at: string; room?: string; guest?: string }
type Bk  = { id: string; session_label: string; session_time: string; duration: string; price_cents: number; payment_method: string; status: string; created_at: string; room?: string; guest?: string }

export default function StaffDashboard() {
  const [requests, setRequests] = useState<Req[]>([])
  const [bookings, setBookings] = useState<Bk[]>([])
  const [tab, setTab]           = useState<'requests' | 'bookings'>('requests')
  const [loaded, setLoaded]     = useState(false)
  const [live, setLive]         = useState(false)

  useEffect(() => {
    load()
    const ch = supabase
      .channel('staff:' + HOTEL_ID)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load)
      .subscribe(status => setLive(status === 'SUBSCRIBED'))
    return () => { supabase.removeChannel(ch) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load() {
    const [rRes, bRes] = await Promise.all([
      supabase.from('requests').select('*, stays(room_number, guest_name)').eq('hotel_id', HOTEL_ID).order('created_at', { ascending: false }).limit(60),
      supabase.from('bookings').select('*, stays(room_number, guest_name)').eq('hotel_id', HOTEL_ID).order('session_time').limit(60),
    ])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (rRes.data) setRequests(rRes.data.map((r: any) => ({ ...r, room: r.stays?.room_number, guest: r.stays?.guest_name })))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (bRes.data) setBookings(bRes.data.map((b: any) => ({ ...b, room: b.stays?.room_number, guest: b.stays?.guest_name })))
    setLoaded(true)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  }

  const pending = requests.filter(r => r.status === 'pending')
  const S: Record<string, string> = { pending: '#C9A96E', in_progress: '#4a9e6a', done: 'rgba(120,140,120,0.45)' }

  return (
    <main style={{ minHeight: '100vh', background: '#0a1210' }}>
      <header style={{ background: 'rgba(10,18,16,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(45,74,62,0.3)', padding: '1.2rem 2rem', position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.55)', marginBottom: 4 }}>Staff Dashboard</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.35rem', color: '#FAFAF7', lineHeight: 1 }}>Berghotel Sonnwend</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: live ? '#4a9e6a' : '#888', boxShadow: live ? '0 0 10px #4a9e6a' : 'none', transition: 'all 0.5s ease' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.4)' }}>{live ? 'Live' : 'Connecting…'}</span>
          {pending.length > 0 && <div style={{ background: '#C9A96E', borderRadius: 100, padding: '2px 10px', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.7rem', color: '#1a1208' }}>{pending.length} pending</div>}
          <Link href="/guest"><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', color: 'rgba(237,231,220,0.3)', cursor: 'pointer', letterSpacing: '0.04em' }}>Guest view →</span></Link>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 2rem 5rem' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
          {(['requests', 'bookings'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 20px', borderRadius: 100, fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.78rem', letterSpacing: '0.04em', cursor: 'pointer', background: tab === t ? '#2D4A3E' : 'rgba(45,74,62,0.12)', color: tab === t ? '#FAFAF7' : 'rgba(237,231,220,0.4)', border: tab === t ? '1px solid #2D4A3E' : '1px solid rgba(45,74,62,0.18)', transition: 'all 0.25s ease', textTransform: 'capitalize' }}>
              {t} ({t === 'requests' ? requests.length : bookings.length})
            </button>
          ))}
        </div>

        {!loaded && <div style={{ textAlign: 'center', padding: '5rem', fontFamily: 'var(--font-sans)', fontWeight: 300, color: 'rgba(237,231,220,0.2)' }}>Loading live data…</div>}

        {tab === 'requests' && loaded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {requests.length === 0 && <div style={{ textAlign: 'center', padding: '5rem', fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(237,231,220,0.2)' }}>All quiet — no requests yet.</div>}
            {requests.map(req => (
              <div key={req.id} style={{ borderRadius: 14, background: req.status === 'done' ? 'rgba(20,30,24,0.5)' : 'rgba(45,74,62,0.16)', border: req.status === 'pending' ? '1px solid rgba(201,169,110,0.28)' : '1px solid rgba(45,74,62,0.18)', padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1.25rem', opacity: req.status === 'done' ? 0.45 : 1, transition: 'all 0.3s ease' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: S[req.status] ?? '#888', flexShrink: 0, boxShadow: req.status === 'pending' ? `0 0 12px ${S.pending}` : 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.65)' }}>{req.type}</span>
                    {req.room && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.38)' }}>Room {req.room}</span>}
                    {req.guest && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.3)' }}>{req.guest}</span>}
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', color: 'rgba(237,231,220,0.7)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof req.payload === 'object' && req.payload !== null
                      ? Object.entries(req.payload).map(([k, v]) => `${k}: ${v}`).join(' · ')
                      : req.type}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {req.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(req.id, 'in_progress')} style={{ padding: '5px 14px', borderRadius: 100, background: 'rgba(74,158,106,0.15)', border: '1px solid rgba(74,158,106,0.3)', color: '#a0d4b4', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', cursor: 'pointer' }}>Accept</button>
                      <button onClick={() => updateStatus(req.id, 'done')} style={{ padding: '5px 14px', borderRadius: 100, background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.28)', color: '#C9A96E', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', cursor: 'pointer' }}>Done</button>
                    </>
                  )}
                  {req.status === 'in_progress' && (
                    <button onClick={() => updateStatus(req.id, 'done')} style={{ padding: '5px 14px', borderRadius: 100, background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.28)', color: '#C9A96E', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', cursor: 'pointer' }}>Mark done</button>
                  )}
                  {req.status === 'done' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.2)' }}>Done</span>}
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', color: 'rgba(237,231,220,0.2)', flexShrink: 0 }}>
                  {new Date(req.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'bookings' && loaded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {bookings.length === 0 && <div style={{ textAlign: 'center', padding: '5rem', fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(237,231,220,0.2)' }}>No bookings yet.</div>}
            {bookings.map(bk => (
              <div key={bk.id} style={{ borderRadius: 14, background: 'rgba(45,74,62,0.12)', border: '1px solid rgba(45,74,62,0.18)', padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ minWidth: 52, textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.05rem', color: '#C9A96E', lineHeight: 1 }}>{bk.session_time}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.6rem', color: 'rgba(237,231,220,0.3)', marginTop: 2 }}>{bk.duration}</p>
                </div>
                <div style={{ width: 1, height: 30, background: 'rgba(45,74,62,0.4)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '0.98rem', color: 'rgba(237,231,220,0.88)', marginBottom: 3 }}>{bk.session_label}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {bk.room && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.35)' }}>Room {bk.room}</span>}
                    {bk.guest && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.3)' }}>{bk.guest}</span>}
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: bk.payment_method === 'online' ? 'rgba(74,158,106,0.7)' : 'rgba(201,169,110,0.55)' }}>{bk.payment_method === 'online' ? 'Paid online' : 'Room bill'}</span>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.15rem', color: '#FAFAF7', flexShrink: 0 }}>€{Math.round((bk.price_cents ?? 0) / 100)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
