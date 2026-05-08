import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://auelytkpbqhwabhzftkp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZWx5dGtwYnFod2FiaHpmdGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTA2NzYsImV4cCI6MjA5MzcyNjY3Nn0.9HJuMpyJHIvlBHdEM7GC3mASIK3sIJ4xJcN6kbCCrxI'
)

type ModeConf = { personality: string; upsellFocus: string[] }

const MODE_CONF: Record<string, ModeConf> = {
  eco: {
    personality: 'Speak about sustainability with genuine passion — never preachy, always inspiring. Mention local sourcing, carbon offset program, and regenerative practices when naturally relevant.',
    upsellFocus: ['foraging walk (€35/person)', 'e-bike day rental (€45)', 'Alpine Herb Ritual spa (€85)'],
  },
  quiet: {
    personality: 'Be calm and minimal — short, considered responses. Never suggest loud or busy activities. Prioritise rest, reading, and gentle movement.',
    upsellFocus: ['private sound bath (€65, 45 min)', 'in-room massage (€95, 60 min)', 'forest meditation walk (€40)'],
  },
  wellness: {
    personality: 'Be warm, knowledgeable, and health-focused. Naturally weave in spa treatments, movement classes, and nourishing food. You know the wellness schedule by heart.',
    upsellFocus: ['Alpine Stone Ritual (€120, 90 min)', 'private sunrise yoga (€85)', 'plant-based dinner at wellness kitchen (€48)'],
  },
  explorer: {
    personality: 'Be enthusiastic and knowledgeable about the Ötztal region. Give specific trail names, distances, and local tips. Always mention the shuttle service and regional food producers.',
    upsellFocus: ['guided summit of Seekofel (€75/person)', 'full-day e-bike rental (€45)', 'private mountain guide (€120 half-day)'],
  },
  'deep-rest': {
    personality: 'Be gentle and never pushy. The guest wants zero decisions — offer to handle everything. Use slow, restful language. Only suggest quiet, deeply restorative experiences.',
    upsellFocus: ['in-room floating breakfast (€28)', 'aromatherapy sleep ritual (€85)', 'sleep consultation with wellness doctor (€60)'],
  },
  'alpine-reset': {
    personality: 'Be invigorating and inspiring — you believe in the transformative power of the mountains. Cold water, pine sauna, fire, and stars. Suggest bold, transformative alpine experiences.',
    upsellFocus: ['guided cold plunge & breathwork (€45)', 'private fireside dinner for two (€95)', 'star-gazing with alpine telescope (€35)'],
  },
}

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
}

async function fetchWeatherCtx(): Promise<string> {
  const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY
  if (!key) return ''
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Innsbruck,AT&units=metric&appid=${key}`
    )
    if (!res.ok) return ''
    const d = await res.json()
    const fmt = (ts: number) =>
      new Date(ts * 1000).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })
    const temp = Math.round(d.main.temp)
    const desc = d.weather[0].description
    const sunrise = fmt(d.sys.sunrise)
    const sunset = fmt(d.sys.sunset)
    return `Current weather in the alpine region: ${temp}°C, ${desc}. Sunrise: ${sunrise}. Sunset: ${sunset}. Use this naturally in activity suggestions — never open with the weather, but weave it in when relevant.`
  } catch {
    return ''
  }
}

function timeContext(): string {
  const h = new Date().getHours()
  if (h < 6)  return 'late night'
  if (h < 10) return 'morning'
  if (h < 14) return 'midday'
  if (h < 18) return 'afternoon'
  if (h < 22) return 'evening'
  return 'late night'
}

type ChatMsg = { role: string; content: string }

export async function POST(req: NextRequest) {
  const { messages, stayId, hotelId, stayMode } = await req.json() as {
    messages: ChatMsg[]
    stayId?: string
    hotelId?: string
    stayMode?: string
  }

  let guestName = '', roomNumber = '', checkIn = '', checkOut = ''
  let hasWellnessBooking = false

  const [weatherCtx, stayData, bookingsData] = await Promise.all([
    fetchWeatherCtx(),
    stayId
      ? sb.from('stays').select('guest_name, room_number, check_in, check_out').eq('id', stayId).single()
      : Promise.resolve({ data: null }),
    stayId
      ? sb.from('bookings').select('id').eq('stay_id', stayId).limit(1)
      : Promise.resolve({ data: null }),
  ])

  if (stayData.data) {
    guestName    = stayData.data.guest_name   ?? ''
    roomNumber   = stayData.data.room_number  ?? ''
    checkIn      = stayData.data.check_in     ?? ''
    checkOut     = stayData.data.check_out    ?? ''
  }
  hasWellnessBooking = (bookingsData.data?.length ?? 0) > 0

  const ctx      = HOTEL_CTX[hotelId ?? 'hotel-demo'] ?? HOTEL_CTX['hotel-demo']
  const modeConf = stayMode ? (MODE_CONF[stayMode] ?? null) : null
  const first    = guestName.split(' ')[0]
  const time     = timeContext()

  const checkOutStr  = checkOut ? new Date(checkOut).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }) : ''
  const now          = new Date()
  const checkInDate  = checkIn ? new Date(checkIn) : null
  const dayOfStay    = checkInDate ? Math.ceil((now.getTime() - checkInDate.getTime()) / 86_400_000) + 1 : null
  const messageCount = messages.filter(m => m.role === 'user').length
  const shouldUpsell = messageCount >= 2 && !hasWellnessBooking && modeConf

  const upsellLine = shouldUpsell
    ? `\nAfter 2+ exchanges, if the moment feels natural, gently mention one experience: ${modeConf!.upsellFocus.join(', ')}.`
    : ''

  const system = `You are the personal AI concierge at ${ctx.name}, ${ctx.location}.
You are warm, attentive, and deeply knowledgeable — the finest alpine hospitality.

${guestName
  ? `Guest: ${first} (${guestName}) · Room ${roomNumber}${checkOutStr ? ` · Checkout: ${checkOutStr}` : ''}${dayOfStay ? ` · Day ${dayOfStay} of their stay` : ''}`
  : 'Guest is exploring the hotel.'}
Time of day: ${time}
${stayMode ? `Stay mode: ${stayMode.replace('-', ' ')} — adapt personality and suggestions accordingly.` : ''}

${modeConf ? `Personality: ${modeConf.personality}` : 'Be warm, professional, and genuinely helpful.'}

${weatherCtx ? `${weatherCtx}\n` : ''}Facilities: ${ctx.facilities}
Nearby: ${ctx.nearby}
Check-in ${ctx.checkin} · Check-out ${ctx.checkout} · ${ctx.lateCheckout}
WiFi: ${ctx.wifi}

Response rules:
- 3–5 sentences maximum per reply
- Use guest first name naturally, only occasionally (not every message)
- End every reply with a short open question
- Hiking/trail requests: always also mention the shuttle service (€12 return to any trailhead)
- Dinner/restaurant requests: mention the regional producer tasting menu (€54, seasonal)
- Never invent specific availability or prices beyond what is listed
- Never invent facilities or services not listed above${upsellLine}`

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    const last = messages.at(-1)?.content?.toLowerCase() ?? ''
    let reply = `Of course${first ? `, ${first}` : ''}! I'll arrange that right away — is there anything else I can help with during your stay?`
    if (last.includes('taxi') || last.includes('transfer') || last.includes('shuttle'))
      reply = `I'll arrange a shuttle — just €12 return to any trailhead or the valley station. Where are you heading and at what time?`
    else if (last.includes('towel') || last.includes('handtuch'))
      reply = `Fresh towels are on their way to Room ${roomNumber || '201'} — they'll arrive in about 10 minutes. Anything else for the room?`
    else if (last.includes('spa') || last.includes('massage') || last.includes('wellness'))
      reply = `Our Alpine Stone Ritual (90 min, €120) is our most beloved treatment — heated river stones from the Ötz valley. Shall I check tomorrow morning's availability?`
    else if (last.includes('breakfast') || last.includes('frühstück'))
      reply = `Breakfast runs 07:00–10:30 — eggs from our own hens, bread from the bakery in Längenfeld. Shall I set up terrace service for tomorrow?`
    else if (last.includes('dinner') || last.includes('restaurant'))
      reply = `Tonight's regional producer menu (€54) features venison from a local hunter and cheese from the Ötztal dairy co-op — it's something special. Shall I reserve a table?`
    else if (last.includes('bike') || last.includes('hike') || last.includes('trail') || last.includes('wander'))
      reply = `The Alpenrosen Weg is in full bloom right now — 45 minutes, easy grade, peak views. I can arrange a shuttle back (€12) and pack a trail lunch. Shall I set that up for tomorrow?`
    else if (last.includes('wifi') || last.includes('password'))
      reply = `WiFi: AlpineFlow_Guest · Password: sonnwend2024. Works throughout the hotel and on the panorama terrace.`
    else if (last.includes('yoga') || last.includes('meditation'))
      reply = `Sunrise yoga is at 07:00 on the panorama terrace — the alpenglow at that hour is unforgettable. Private sessions can also be arranged any time. Shall I reserve a mat for tomorrow?`
    return NextResponse.json({ content: reply })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 320,
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
