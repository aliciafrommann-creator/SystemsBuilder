import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://auelytkpbqhwabhzftkp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZWx5dGtwYnFod2FiaHpmdGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTA2NzYsImV4cCI6MjA5MzcyNjY3Nn0.9HJuMpyJHIvlBHdEM7GC3mASIK3sIJ4xJcN6kbCCrxI'
)

const HOTEL_CTX: Record<string, { name: string; location: string; facilities: string; nearby: string; checkin: string; checkout: string; lateCheckout: string; wifi: string }> = {
  'hotel-demo': {
    name: 'Berghotel Sonnwend',
    location: 'Ötztal, Tirol, Austria',
    facilities: 'spa with thermal pools, wellness center (yoga, meditation, pilates), alpine restaurant with regional cuisine, concierge service, e-bike rental, hiking trail maps',
    nearby: 'Aqua Dome Längenfeld 4 km, Timmelsjoch mountain pass, Sölden ski resort, Obergurgl glacier, Alpenrosen Weg trail',
    checkin: '15:00', checkout: '11:00',
    lateCheckout: 'Late checkout until 13:00 available on request (€25)',
    wifi: 'AlpineFlow_Guest / sonnwend2024',
  },
  'berghotel-sonnwend': {
    name: 'Berghotel Sonnwend',
    location: 'Ötztal, Tirol, Austria',
    facilities: 'spa with thermal pools, wellness center (yoga, meditation, pilates), alpine restaurant with regional cuisine, concierge service, e-bike rental, hiking trail maps',
    nearby: 'Aqua Dome Längenfeld 4 km, Timmelsjoch mountain pass, Sölden ski resort, Obergurgl glacier, Alpenrosen Weg trail',
    checkin: '15:00', checkout: '11:00',
    lateCheckout: 'Late checkout until 13:00 available on request (€25)',
    wifi: 'AlpineFlow_Guest / sonnwend2024',
  },
}

type ChatMsg = { role: string; content: string }

export async function POST(req: NextRequest) {
  const { messages, stayId, hotelId } = await req.json() as { messages: ChatMsg[]; stayId?: string; hotelId?: string }

  let guestName = '', roomNumber = '', checkOut = ''
  if (stayId) {
    const { data } = await sb.from('stays').select('guest_name, room_number, check_out').eq('id', stayId).single()
    if (data) { guestName = data.guest_name ?? ''; roomNumber = data.room_number ?? ''; checkOut = data.check_out ?? '' }
  }

  const ctx = HOTEL_CTX[hotelId ?? 'hotel-demo'] ?? HOTEL_CTX['hotel-demo']
  const first = guestName.split(' ')[0]
  const coDate = checkOut ? new Date(checkOut).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }) : ''

  const system = `You are the personal AI concierge at ${ctx.name}, ${ctx.location}.
You are warm, attentive, and knowledgeable — the finest alpine hospitality.
${guestName ? `Guest: ${first} (${guestName}) · Room ${roomNumber} · Checkout: ${coDate}` : 'Guest is exploring the hotel.'}
Facilities: ${ctx.facilities}
Nearby: ${ctx.nearby}
Check-in ${ctx.checkin} · Check-out ${ctx.checkout} · ${ctx.lateCheckout}
WiFi: ${ctx.wifi}
Keep every reply under 3 sentences. Use the guest first name naturally (not every message).
If asked to arrange something, confirm enthusiastically and ask any needed detail.
Never invent specific prices or slot availability — offer to check.`

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    const last = messages.at(-1)?.content?.toLowerCase() ?? ''
    let reply = `Of course${first ? `, ${first}` : ''}! I’ll arrange that right away — is there anything else I can help with during your stay?`
    if (last.includes('taxi') || last.includes('transfer')) reply = `I’ll arrange a taxi for you. Where are you heading and at what time?`
    else if (last.includes('towel') || last.includes('handtuch')) reply = `Fresh towels are on their way to Room ${roomNumber || '214'}. They’ll arrive in about 10 minutes.`
    else if (last.includes('spa') || last.includes('massage')) reply = `Our Alpine Stone Ritual (90 min, €120) is our most loved treatment — shall I check tomorrow morning’s availability for you?`
    else if (last.includes('breakfast') || last.includes('dinner') || last.includes('frühstück')) reply = `Breakfast runs 07:00–10:30 in the main dining room. We can also arrange terrace service — shall I set that up for tomorrow?`
    else if (last.includes('bike') || last.includes('hike') || last.includes('trail')) reply = `The Alpenrosen Weg is spectacular right now — 45 minutes, easy grade, peak bloom. Shall I prepare a trail map and packed lunch?`
    else if (last.includes('wifi') || last.includes('password')) reply = `WiFi: AlpineFlow_Guest · Password: sonnwend2024`
    return NextResponse.json({ content: reply })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 280,
        system,
        messages: messages.slice(-12).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      }),
    })
    const data = await res.json()
    return NextResponse.json({ content: data.content?.[0]?.text ?? 'I apologise, I am briefly unavailable.' })
  } catch {
    return NextResponse.json({ content: 'I apologise — briefly unavailable. Please call reception at ext. 0.' })
  }
}
