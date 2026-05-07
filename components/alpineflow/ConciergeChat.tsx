'use client'
import { useState, useRef, useEffect } from 'react'
import { useStay } from '@/lib/alpineflow/stay-context'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ConciergeChat() {
  const { stay, hotel } = useStay()
  const [open, setOpen]         = useState(false)
  const [msgs, setMsgs]         = useState<Msg[]>([])
  const [input, setInput]       = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const color   = hotel?.color_primary ?? '#2D4A3E'
  const hotelName = hotel?.name ?? 'AlpineFlow'
  const first   = stay?.guest_name?.split(' ')[0] ?? null

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{
        role: 'assistant',
        content: `Guten Tag${first ? `, ${first}` : ''}! I'm your personal concierge at ${hotelName}. How can I make your stay more wonderful today?`,
      }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, thinking])

  const send = async () => {
    if (!input.trim() || thinking) return
    const text = input.trim()
    setInput('')
    const updated: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(updated)
    setThinking(true)
    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated,
          stayId: stay?.id,
          hotelId: stay?.hotel_id,
        }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', content: data.content }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'I apologise — I am briefly unavailable. Please call reception at ext. 0.' }])
    }
    setThinking(false)
  }

  return (
    <>
      {open && (
        <div style={{ position: 'fixed', bottom: 90, right: 24, width: 340, maxHeight: 500, borderRadius: 22, background: '#FAFAF7', boxShadow: `0 28px 72px rgba(0,0,0,0.2), 0 0 0 1px rgba(200,184,154,0.18)`, zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ background: color, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.05rem', color: '#FAFAF7', lineHeight: 1 }}>Concierge</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', color: 'rgba(237,231,220,0.55)', marginTop: 3 }}>{hotelName}</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(237,231,220,0.65)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: 0 }}>&times;</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '0.65rem 0.9rem', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? color : 'rgba(240,235,228,0.88)', color: m.role === 'user' ? '#FAFAF7' : 'var(--color-deep)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.83rem', lineHeight: 1.55 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '0.7rem 0.9rem', borderRadius: '14px 14px 14px 3px', background: 'rgba(240,235,228,0.88)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.55, animation: `chatBounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(200,184,154,0.16)', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything…"
              style={{ flex: 1, padding: '9px 14px', borderRadius: 100, border: '1px solid rgba(200,184,154,0.28)', background: 'rgba(250,248,244,0.85)', fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.82rem', color: 'var(--color-deep)', outline: 'none' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || thinking}
              style={{ width: 36, height: 36, borderRadius: '50%', background: input.trim() && !thinking ? color : 'rgba(200,190,180,0.4)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', color: '#FAFAF7', fontSize: '1rem', transition: 'background 0.2s ease', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              &#8594;
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: color, border: 'none', cursor: 'pointer', boxShadow: `0 8px 28px ${color}55`, zIndex: 100, fontSize: open ? '1.5rem' : '1.3rem', color: '#FAFAF7', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', transform: open ? 'scale(0.9)' : 'scale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {open ? '×' : '✦'}
      </button>

      <style>{`@keyframes chatBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
    </>
  )
}
