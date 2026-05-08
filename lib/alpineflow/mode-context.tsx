'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type ModeConfig = {
  id: string; name: string
  color: string; light: string; accent: string; text: string; bg: string
}

const MODES: Record<string, ModeConfig> = {
  eco:            { id:'eco',           name:'Eco Stay',       color:'#1A2E28', light:'#2a4a38', accent:'#4a8a6a', text:'rgba(210,235,220,0.9)', bg:'#111e1a' },
  quiet:          { id:'quiet',         name:'Quiet Stay',     color:'#1E2638', light:'#283850', accent:'#5a82b8', text:'rgba(205,218,238,0.9)', bg:'#131825' },
  wellness:       { id:'wellness',      name:'Wellness Stay',  color:'#2C1E18', light:'#4a3228', accent:'#c9a96e', text:'rgba(240,225,205,0.9)', bg:'#1a1210' },
  explorer:       { id:'explorer',      name:'Explorer Stay',  color:'#1E2C18', light:'#2e4228', accent:'#a4b768', text:'rgba(222,235,210,0.9)', bg:'#131c10' },
  'deep-rest':    { id:'deep-rest',     name:'Deep Rest',      color:'#221830', light:'#362850', accent:'#9b78c8', text:'rgba(228,218,245,0.9)', bg:'#160f20' },
  'alpine-reset': { id:'alpine-reset',  name:'Alpine Reset',   color:'#18222E', light:'#243448', accent:'#7ba3a8', text:'rgba(212,228,235,0.9)', bg:'#101820' },
}

const Ctx = createContext<{ mode: ModeConfig | null }>({ mode: null })

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ModeConfig | null>(null)

  useEffect(() => {
    const apply = (id: string | null) => setMode(id ? (MODES[id] ?? null) : null)
    apply(localStorage.getItem('af_stay_mode'))
    const handler = (e: StorageEvent) => { if (e.key === 'af_stay_mode') apply(e.newValue) }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return <Ctx.Provider value={{ mode }}>{children}</Ctx.Provider>
}

export function useMode() { return useContext(Ctx) }
