import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://auelytkpbqhwabhzftkp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZWx5dGtwYnFod2FiaHpmdGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTA2NzYsImV4cCI6MjA5MzcyNjY3Nn0.9HJuMpyJHIvlBHdEM7GC3mASIK3sIJ4xJcN6kbCCrxI'
)

export type Hotel = {
  id: string
  name: string
  tagline: string
  region: string
  color_primary: string
  color_accent: string
  cover_photo: string
}

export type Stay = {
  id: string
  code: string
  hotel_id: string
  room_number: string
  guest_name: string
  check_in: string
  check_out: string
}
