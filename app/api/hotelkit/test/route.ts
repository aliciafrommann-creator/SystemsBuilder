import { NextResponse } from 'next/server'

export async function GET() {
  const token      = process.env.HOTELKIT_API_TOKEN
  const instanceId = process.env.HOTELKIT_INSTANCE_ID

  if (!token || !instanceId) return NextResponse.json({ ok: false, error: 'no_token' })

  try {
    const res = await fetch(`https://api.hotelkit.net/v1/${instanceId}/ping`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return NextResponse.json({ ok: res.ok, status: res.status })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
