'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase, type Hotel, type Stay } from '@/lib/supabase'

const DEMO_STAY: Stay = {
  id: 'a1b2c3d4-0000-0000-0000-000000000001',
  code: 'ALPIN-2847',
  hotel_id: 'hotel-demo',
  room_number: '201',
  guest_name: 'Maria Gruber',
  check_in: '2026-05-05',
  check_out: '2026-05-10',
}

const DEMO_HOTEL: Hotel = {
  id: 'hotel-demo',
  name: 'Berghotel Sonnwend',
  tagline: 'Wo die Berge atmen',
  region: 'Ötztal, Tirol',
  color_primary: '#2D4A3E',
  color_accent: '#C9A96E',
  cover_photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
}

type StayCtx = {
  stay: Stay | null
  hotel: Hotel | null
  loading: boolean
  isDemoMode: boolean
  enterStay: (code: string) => Promise<boolean>
  clearStay: () => void
}

const Ctx = createContext<StayCtx>({
  stay: null, hotel: null, loading: true, isDemoMode: false,
  enterStay: async () => false, clearStay: () => {},
})

export function StayProvider({ children }: { children: ReactNode }) {
  const [stay, setStay]         = useState<Stay | null>(null)
  const [hotel, setHotel]       = useState<Hotel | null>(null)
  const [loading, setLoading]   = useState(true)
  const [isDemoMode, setIsDemo] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const demo = params.get('demo') === 'true' || localStorage.getItem('af_demo') === 'true'
    if (demo) {
      localStorage.setItem('af_demo', 'true')
      setIsDemo(true)
      setStay(DEMO_STAY)
      setHotel(DEMO_HOTEL)
      setLoading(false)
      return
    }
    const code = localStorage.getItem('af_stay_code')
    if (code) load(code).finally(() => setLoading(false))
    else setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load(code: string): Promise<boolean> {
    const { data: s } = await supabase
      .from('stays').select('*').eq('code', code.toUpperCase()).single()
    if (!s) return false
    setStay(s as Stay)
    const { data: h } = await supabase
      .from('hotels').select('*').eq('id', s.hotel_id).single()
    if (h) setHotel(h as Hotel)
    return true
  }

  async function enterStay(code: string): Promise<boolean> {
    setLoading(true)
    const ok = await load(code)
    if (ok) localStorage.setItem('af_stay_code', code.toUpperCase())
    setLoading(false)
    return ok
  }

  function clearStay() {
    setStay(null); setHotel(null); setIsDemo(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('af_stay_code')
      localStorage.removeItem('af_demo')
    }
  }

  return (
    <Ctx.Provider value={{ stay, hotel, loading, isDemoMode, enterStay, clearStay }}>
      {children}
    </Ctx.Provider>
  )
}

export const useStay = () => useContext(Ctx)
