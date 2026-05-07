'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase, type Hotel, type Stay } from '@/lib/supabase'

type StayCtx = {
  stay: Stay | null
  hotel: Hotel | null
  loading: boolean
  enterStay: (code: string) => Promise<boolean>
  clearStay: () => void
}

const Ctx = createContext<StayCtx>({
  stay: null, hotel: null, loading: true,
  enterStay: async () => false, clearStay: () => {},
})

export function StayProvider({ children }: { children: ReactNode }) {
  const [stay, setStay]       = useState<Stay | null>(null)
  const [hotel, setHotel]     = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const code = typeof window !== 'undefined' ? localStorage.getItem('af_stay_code') : null
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
    setStay(null); setHotel(null)
    if (typeof window !== 'undefined') localStorage.removeItem('af_stay_code')
  }

  return (
    <Ctx.Provider value={{ stay, hotel, loading, enterStay, clearStay }}>
      {children}
    </Ctx.Provider>
  )
}

export const useStay = () => useContext(Ctx)
