export type HotelKitEvent =
  | 'housekeeping_request'
  | 'stay_mode_change'
  | 'adaptive_comfort_away'
  | 'guest_request'

type TaskPayload = {
  title: string
  description: string
  priority: 'low' | 'normal' | 'high'
  category: string
}

export function mapAlpineEventToHotelKitTask(
  event: HotelKitEvent,
  meta: Record<string, string | undefined>
): TaskPayload {
  const room = meta.roomId ?? '?'
  switch (event) {
    case 'housekeeping_request':
      return { title: `Housekeeping · Zimmer ${room}`, description: meta.notes ?? 'Gastpräferenz aktualisiert', priority: 'normal', category: 'housekeeping' }
    case 'stay_mode_change':
      return { title: `Stay-Modus · Zimmer ${room}`, description: `Gast wechselt zu ${meta.mode ?? 'unbekannt'}`, priority: 'low', category: 'guest_preference' }
    case 'adaptive_comfort_away':
      return { title: `Eco-Modus · Zimmer ${room}`, description: 'Gast hat Zimmer verlassen — Komfort reduziert', priority: 'low', category: 'room_management' }
    case 'guest_request':
      return { title: `Gastanfrage · Zimmer ${room}`, description: meta.message ?? 'Neue Anfrage', priority: 'high', category: 'guest_service' }
  }
}

export async function createHotelKitTask(
  event: HotelKitEvent,
  meta: Record<string, string | undefined>,
  instanceId: string,
  token: string
): Promise<{ success: boolean; taskId?: string; error?: string; status?: number }> {
  const task = mapAlpineEventToHotelKitTask(event, meta)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://api.hotelkit.net/v1/${instanceId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(task),
      })
      if (res.ok) {
        const json = await res.json().catch(() => ({}))
        return { success: true, taskId: json.id, status: res.status }
      }
      if (res.status < 500) return { success: false, error: `HTTP ${res.status}`, status: res.status }
    } catch (e) {
      if (attempt === 2) return { success: false, error: String(e) }
    }
    await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
  }
  return { success: false, error: 'max_retries' }
}
