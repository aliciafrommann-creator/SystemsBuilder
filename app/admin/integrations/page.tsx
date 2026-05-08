'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminIntegrationsPage() {
  const [enabled, setEnabled]     = useState(false)
  const [instanceId, setInstanceId] = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [testing, setTesting]     = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const HOTEL_ID = 'hotel-demo'

  useEffect(() => {
    supabase.from('hotels').select('hotelkit_enabled,hotelkit_instance_id').eq('id', HOTEL_ID).single()
      .then(({ data }) => {
        if (data) { setEnabled(data.hotelkit_enabled ?? false); setInstanceId(data.hotelkit_instance_id ?? '') }
      })
  }, [])

  async function save() {
    setSaving(true)
    await supabase.from('hotels').update({ hotelkit_enabled: enabled, hotelkit_instance_id: instanceId }).eq('id', HOTEL_ID)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  async function testConnection() {
    setTesting(true); setTestResult(null)
    const res = await fetch('/api/hotelkit/test').then(r => r.json()).catch(() => ({ ok: false, error: 'network' }))
    setTestResult(res.ok ? { ok: true, msg: 'Verbindung erfolgreich.' } : { ok: false, msg: res.error === 'no_token' ? 'Kein API-Token gesetzt.' : `Fehler: ${res.error ?? res.status}` })
    setTesting(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060d0a,#0d1c14 55%,#060d0a)', padding: '2rem' }}>
      <style>{`
        .tog { width:42px;height:24px;borderRadius:12px;position:relative;cursor:pointer;border:none;transition:background 0.3s ease; }
        .tog-dot { position:absolute;top:3px;width:18px;height:18px;borderRadius:50%;background:#FAFAF7;transition:left 0.3s cubic-bezier(0.16,1,0.3,1); }
      `}</style>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.45)', marginBottom: '0.6rem' }}>Admin</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '2rem', color: '#FAFAF7', marginBottom: '0.5rem' }}>Integrationen</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.85rem', color: 'rgba(237,231,220,0.35)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '42ch' }}>
          AlpineFlow arbeitet mit euren bestehenden Tools. Ihr nutzt HotelKit? Perfekt.
        </p>

        <div style={{ borderRadius: 20, padding: '1.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.92rem', color: '#FAFAF7', marginBottom: '0.2rem' }}>HotelKit</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.74rem', color: 'rgba(237,231,220,0.35)' }}>Aufgaben automatisch synchronisieren</p>
            </div>
            <button className="tog" onClick={() => setEnabled(e => !e)} style={{ background: enabled ? '#2D4A3E' : 'rgba(255,255,255,0.1)', border: 'none' }}>
              <div className="tog-dot" style={{ left: enabled ? 21 : 3 }} />
            </button>
          </div>

          <label style={{ display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.72rem', color: 'rgba(237,231,220,0.38)', letterSpacing: '0.06em' }}>INSTANCE ID</label>
          <input
            value={instanceId}
            onChange={e => setInstanceId(e.target.value)}
            placeholder="sonnwend-hotel"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.88rem', color: '#FAFAF7', outline: 'none', boxSizing: 'border-box', marginBottom: '1.2rem' }}
          />

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={save} disabled={saving} style={{ padding: '10px 22px', borderRadius: 100, background: '#2D4A3E', border: '1px solid rgba(201,169,110,0.25)', color: '#FAFAF7', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              {saving ? 'Speichern…' : saved ? 'Gespeichert ✓' : 'Einstellungen speichern'}
            </button>
            <button onClick={testConnection} disabled={testing} style={{ padding: '10px 22px', borderRadius: 100, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(237,231,220,0.55)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', cursor: 'pointer' }}>
              {testing ? 'Teste…' : 'Verbindung testen'}
            </button>
          </div>

          {testResult && (
            <p style={{ marginTop: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.78rem', color: testResult.ok ? '#4a8a6a' : '#c97a4a' }}>{testResult.msg}</p>
          )}
        </div>

        <div style={{ borderRadius: 16, padding: '1.2rem 1.4rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.68rem', color: 'rgba(237,231,220,0.25)', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>ENVIRONMENT VARIABLES</p>
          {['HOTELKIT_API_TOKEN', 'HOTELKIT_INSTANCE_ID', 'HOTELKIT_ENABLED'].map(k => (
            <p key={k} style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'rgba(201,169,110,0.45)', marginBottom: '0.25rem' }}>{k}</p>
          ))}
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.7rem', color: 'rgba(237,231,220,0.2)', marginTop: '0.6rem' }}>In Vercel unter Settings → Environment Variables setzen.</p>
        </div>
      </div>
    </main>
  )
}
