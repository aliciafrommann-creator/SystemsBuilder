'use client'
import { useState, type CSSProperties } from 'react'
import { useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Html } from '@react-three/drei'
import { AlpineSky }                       from './AlpineSky'
import { AlpineTerrain, AlpineMeadow }     from './AlpineTerrain'
import { AlpineTrees }                     from './AlpineTrees'
import { AlpineHotel }                     from './AlpineHotel'
import { AlpineWater }                     from './AlpineWater'
import { AlpineParticles, AlpineMist }     from './AlpineParticles'
import { CameraRig }                       from './CameraRig'
import { getCurrentPreset, DayPreset }     from '@/lib/alpineflow/timeOfDay'

const preset = getCurrentPreset()

function makePill(dark: boolean): CSSProperties {
  const gold = 'rgba(201,169,110,'
  const snow = 'rgba(250,250,247,'
  return {
    background: dark ? 'rgba(12,24,18,0.85)' : 'rgba(247,244,239,0.88)',
    border: dark ? `1px solid ${gold}0.3)` : '1px solid rgba(200,184,154,0.35)',
    borderRadius: 100,
    padding: '7px 18px',
    color: dark ? `${snow}0.88)` : 'rgba(26,46,40,0.88)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
    fontSize: 12,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    backdropFilter: 'blur(14px)',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    textDecoration: 'none',
    display: 'block',
  }
}

function ScrollScene({ preset }: { preset: DayPreset }) {
  const scroll = useScroll()
  const [progress, setProgress] = useState(0)
  useFrame(() => setProgress(scroll.offset))

  const heroOn  = progress < 0.20
  const midOn   = progress > 0.14 && progress < 0.46
  const stayOn  = progress > 0.38 && progress < 0.66
  const enterOn = progress > 0.72

  const dark = preset.uiDark
  const gold = 'rgba(201,169,110,'
  const snow = 'rgba(250,250,247,'
  const pillStyle = makePill(dark)

  return (
    <>
      <CameraRig />
      <AlpineSky preset={preset} />
      <AlpineTerrain preset={preset} />
      <AlpineMeadow preset={preset} />
      <AlpineTrees preset={preset} />
      <AlpineHotel preset={preset} scrollProgress={progress} />
      <AlpineWater preset={preset} />
      <AlpineParticles preset={preset} />
      <AlpineMist preset={preset} />

      {/* ── HERO — aerial view ── */}
      <Html position={[0, 42, 62]} center distanceFactor={62}>
        <div style={{ textAlign:'center', opacity:heroOn?1:0, transform:heroOn?'none':'translateY(-24px)', transition:'all 1.4s cubic-bezier(0.16,1,0.3,1)', pointerEvents:'none' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:dark?`${gold}0.7)`:'rgba(45,74,62,0.65)', marginBottom:14 }}>Sustainable Alpine Hospitality</p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(42px,5.5vw,80px)', letterSpacing:'-0.035em', lineHeight:0.95, color:dark?'#FAFAF7':'#1A2E28', marginBottom:18, whiteSpace:'nowrap' }}>AlpineFlow</h1>
          <p style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:300, fontSize:'clamp(14px,1.8vw,22px)', color:dark?`${gold}0.8)`:'rgba(45,74,62,0.65)', marginBottom:28 }}>{preset.label} in the Alps</p>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:10, letterSpacing:'0.15em', color:dark?`${snow}0.35)`:'rgba(100,100,90,0.5)' }}>scroll to descend ↓</p>
        </div>
      </Html>

      {/* ── MANIFESTO — valley descent ── */}
      <Html position={[-22, 18, 42]} center distanceFactor={42}>
        <div style={{ opacity:midOn?1:0, transform:midOn?'none':'translateX(-28px)', transition:'all 1.1s cubic-bezier(0.16,1,0.3,1)', pointerEvents:'none', maxWidth:380 }}>
          <p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(22px,2.8vw,38px)', color:dark?`${snow}0.75)`:'rgba(26,46,40,0.72)', lineHeight:1.25, letterSpacing:'-0.015em' }}>
            Slow down.<br />
            <em style={{ color:dark?`${gold}0.88)`:'rgba(45,74,62,0.82)', fontStyle:'italic' }}>The mountain is patient.</em>
          </p>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:13, color:dark?`${snow}0.38)`:'rgba(45,74,62,0.42)', lineHeight:1.65, marginTop:14 }}>A place where nature sets the tempo.</p>
        </div>
      </Html>

      {/* ── STAY MODES — through the trees ── */}
      <Html position={[0, 8, 13]} center distanceFactor={28}>
        <div style={{ textAlign:'center', opacity:stayOn?1:0, transform:stayOn?'none':'translateY(14px)', transition:'all 1.05s cubic-bezier(0.16,1,0.3,1)', pointerEvents:stayOn?'all':'none' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:dark?`${gold}0.58)`:'rgba(155,125,94,0.75)', marginBottom:14 }}>Choose your stay</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', maxWidth:420 }}>
            {([['Eco Stay','/guest'],['Wellness','/guest/wellness'],['Explorer','/guest/discovery'],['Deep Rest','/guest']] as [string,string][]).map(([m, h]) => (
              <a key={m} href={h} style={pillStyle}>{m}</a>
            ))}
          </div>
        </div>
      </Html>

      {/* ── ENTER CTA — at the door ── */}
      <Html position={[0, 3.6, 2.2]} center distanceFactor={14}>
        <div style={{ textAlign:'center', opacity:enterOn?1:0, transform:enterOn?'none':'translateY(10px)', transition:'all 0.85s cubic-bezier(0.16,1,0.3,1)', pointerEvents:enterOn?'all':'none' }}>
          <p style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:300, fontSize:22, color:dark?`${snow}0.55)`:'rgba(26,46,40,0.55)', marginBottom:20 }}>Welcome.</p>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <a href="/guest">
              <button style={{ background:'#2D4A3E', color:'#FAFAF7', border:'none', borderRadius:100, padding:'11px 28px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:12, letterSpacing:'0.07em', cursor:'pointer', boxShadow:'0 6px 28px rgba(45,74,62,0.45)' }}>Guest Experience</button>
            </a>
            <a href="/hotel">
              <button style={{ background:'transparent', color:dark?`${snow}0.65)`:'rgba(45,74,62,0.65)', border:dark?`1px solid ${gold}0.28)`:'1px solid rgba(45,74,62,0.22)', borderRadius:100, padding:'11px 22px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:12, letterSpacing:'0.07em', cursor:'pointer', backdropFilter:'blur(14px)' }}>Hotel Team</button>
            </a>
          </div>
        </div>
      </Html>
    </>
  )
}

export function AlpineScene() {
  return (
    <ScrollControls pages={5} damping={0.25}>
      <ScrollScene preset={preset} />
    </ScrollControls>
  )
}
