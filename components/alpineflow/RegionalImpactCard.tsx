'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useStay } from '@/lib/alpineflow/stay-context'

const CAT_ICONS: Record<string, string> = {
  dairy: '🧀', bakery: '🍞', grain: '🌾', brewery: '🍺',
  meat: '🥩', produce: '🥬', honey: '🍯', herbs: '🌿',
}

type Partner = { id: string; name: string; category: string; distance_km: number; story_line: string }
type Impact  = { regional_percent: number; weekly_euros: number; meal_count: number }

const DEMO_PARTNERS: Partner[] = [
  { id: '1', name: 'Hof Unterberger',        category: 'dairy',   distance_km: 4, story_line: 'Der Käse zum Frühstück — handgeschöpft, 4 km entfernt.' },
  { id: '2', name: 'Bäckerei Tiefenbacher',  category: 'bakery',  distance_km: 2, story_line: 'Das Brot kommt täglich frisch aus Sölden.' },
  { id: '3', name: 'Bergbrauerei Ötztal',    category: 'brewery', distance_km: 9, story_line: 'Gebraut mit Quellwasser aus 2.400m Höhe.' },
  { id: '4', name: 'Gemüsehof Gruber',       category: 'produce', distance_km: 6, story_line: 'Saisonales Gemüse direkt aus dem Inntal.' },
]

const CSS = `@keyframes pIn { from{opacity:0;transform:scale(0.4);} to{opacity:1;transform:scale(1);} }`

export function RegionalImpactCard() {
  const { stay, isDemoMode } = useStay()
  const [partners, setPartners] = useState<Partner[]>([])
  const [impact, setImpact]     = useState<Impact | null>(null)
  const [featured, setFeatured] = useState<Partner | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setPartners(DEMO_PARTNERS); setFeatured(DEMO_PARTNERS[0])
      setImpact({ regional_percent: 74, weekly_euros: 2840, meal_count: 187 })
      setLoading(false); return
    }
    if (!stay) { setLoading(false); return }
    Promise.all([
      supabase.from('regional_partners').select('*').eq('hotel_id', stay.hotel_id).order('distance_km'),
      supabase.from('stay_impact').select('*').eq('stay_id', stay.id).single(),
    ]).then(([{ data: p }, { data: i }]) => {
      if (p?.length) { setPartners(p as Partner[]); setFeatured((p as Partner[])[0]) }
      if (i) setImpact(i as Impact)
      setLoading(false)
    })
  }, [stay, isDemoMode])

  if (loading) return (
    <div style={{ borderRadius: 20, padding: '1.5rem', background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.08)' }}>
      {[60,40].map((w,i) => <div key={i} style={{ height: 12, borderRadius: 8, background: 'rgba(201,169,110,0.07)', marginBottom: 10, width: `${w}%` }} />)}
    </div>
  )

  const pct = impact?.regional_percent ?? 0

  return (
    <>
      <style>{CSS}</style>
      <div style={{ borderRadius: 20, padding: '1.5rem 1.8rem', background: 'linear-gradient(135deg,#110e04,#1e1608)', border: '1px solid rgba(201,169,110,0.16)' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)', marginBottom: '0.55rem' }}>Gemeinsam</p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.12rem', color: '#FAFAF7', lineHeight: 1.3, marginBottom: '0.3rem' }}>
          <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>{pct}%</em> deiner Mahlzeiten<br />kamen von regionalen Produzenten
        </h3>
        <div style={{ margin: '0.9rem 0', height: 3, borderRadius: 2, background: 'rgba(201,169,110,0.1)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: 'linear-gradient(to right,#C9A96E,#e8c98a)', transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', margin: '0.9rem 0' }}>
          {partners.map((p, i) => (
            <button key={p.id} onClick={() => setFeatured(p)} title={p.name} style={{ width: 34, height: 34, borderRadius: '50%', background: featured?.id === p.id ? 'rgba(201,169,110,0.18)' : 'rgba(201,169,110,0.06)', border: featured?.id === p.id ? '1px solid rgba(201,169,110,0.4)' : '1px solid rgba(201,169,110,0.1)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pIn 0.4s ease both', animationDelay: `${i * 0.07}s`, transition: 'all 0.3s ease' }}>
              {CAT_ICONS[p.category] ?? '◇'}
            </button>
          ))}
        </div>
        {featured && (
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.8rem', color: 'rgba(201,169,110,0.7)', lineHeight: 1.65, fontStyle: 'italic', borderLeft: '2px solid rgba(201,169,110,0.22)', paddingLeft: '0.7rem', margin: '0.9rem 0' }}>
            "{featured.story_line}"
          </p>
        )}
        {impact && (
          <div style={{ paddingTop: '0.9rem', borderTop: '1px solid rgba(201,169,110,0.08)', display: 'flex', gap: '1.5rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.15rem', color: '#C9A96E' }}>€{impact.weekly_euros.toLocaleString('de')}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', color: 'rgba(201,169,110,0.38)', letterSpacing: '0.06em' }}>diese Woche, gemeinsam</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.15rem', color: '#C9A96E' }}>{impact.meal_count}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '0.62rem', color: 'rgba(201,169,110,0.38)', letterSpacing: '0.06em' }}>regionale Mahlzeiten</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
