import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createHotelKitTask, type HotelKitEvent } from '@/lib/integrations/hotelkit'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { event, hotelId, roomId, stayId, requestId, ...meta } = body

  const logEntry = { event, hotel_id: hotelId, room_id: roomId, stay_id: stayId, request_id: requestId, status: 'pending', created_at: new Date().toISOString() }
  const { data: log } = await supabase.from('hotelkit_sync_log').insert(logEntry).select().single()

  const token      = process.env.HOTELKIT_API_TOKEN
  const instanceId = process.env.HOTELKIT_INSTANCE_ID
  const enabled    = process.env.HOTELKIT_ENABLED === 'true'

  if (!enabled || !token || !instanceId) {
    await supabase.from('hotelkit_sync_log').update({ status: 'skipped' }).eq('id', log?.id ?? '')
    return NextResponse.json({ success: true, status: 'skipped' })
  }

  const result = await createHotelKitTask(event as HotelKitEvent, { roomId, ...meta }, instanceId, token)

  const finalStatus = result.success ? 'synced' : 'failed'
  await supabase.from('hotelkit_sync_log').update({ status: finalStatus, task_id: result.taskId, error: result.error }).eq('id', log?.id ?? '')

  if (requestId) {
    await supabase.from('housekeeping_requests').update({
      hotelkit_sync_status: finalStatus,
      hotelkit_task_id: result.taskId,
    }).eq('id', requestId)
  }

  return NextResponse.json({ success: result.success, status: finalStatus })
}
