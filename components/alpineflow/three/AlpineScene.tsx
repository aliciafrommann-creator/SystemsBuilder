'use client'
import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Html } from '@react-three/drei'
import { AlpineSky }                       from './AlpineSky'
import { AlpineTerrain, AlpineMeadow }     from './AlpineTerrain'
import { AlpineTrees }                     from './AlpineTrees'
import { AlpineHotel }                     from './AlpineHotel'
import { AlpineParticles, AlpineMist }     from './AlpineParticles'
import { CameraRig }                       from './CameraRig'
import { getCurrentPreset, DayPreset }     from '@/lib/alpineflow/timeOfDay'

const preset = getCurrentPreset()

function ScrollScene({ preset }: { preset: DayPreset }) {
  const scroll = useScroll()
  const [progress, setProgress] = useState(0)
  useFrame(() => setProgress(scroll.offset))

  const heroOn     = progress < 0.18
  const midOn      = progress > 0.15 && progress < 0.45
  const sectionsOn = progress > 0.35 && progress < 0.65
  const enterOn    = progress > 0.72

  const dark = preset.uiDark
  const gold = 'rgba(201,169,110,'
  const snow = 'rgba(250,250,247,'
  const fern = 'rgba(237,231,220,'

  return (
    <>
      <CameraRig />
      <AlpineSky preset={preset} />
      <AlpineTerrain preset={preset} />
      <AlpineMeadow preset={preset} />
      <AlpineTrees preset={preset} />
      <AlpineHotel preset={preset} scrollProgress={progress} />
      <AlpineParticles preset={preset} />
      <AlpineMist preset={preset} />

      {/* Hero title */}
      <Html position={[0,40,60]} center distanceFactor={60}>
        <div style={{ textAlign:'center', opacity:heroOn?1:0, transform:heroOn?'none':'translateY(-20px)', transition:'all 1.2s cubic-bezier(0.16,1,0.3,1)', pointerEvents:'none' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:dark?`${gold}0.8)`:' rgba(45,74,62,0.7)', marginBottom:12 }}>Sustainable Hospitality</p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(36px,5vw,72px)', letterSpacing:'-0.03em', lineHeight:1, color:dark?'#FAFAF7':'#1A2E28', marginBottom:16, whiteSpace:'nowrap' }}>AlpineFlow</h1>
          <p style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:300, fontSize:'clamp(14px,2vw,20px)', color:dark?`${gold}0.85)`:'rgba(45,74,62,0.7)' }}>{preset.label} in the Alps</p>
        </div>
      </Html>

      {/* Forest descent */}
      <Html position={[-20,18,40]} center distanceFactor={40}>
        <div style={{ opacity:midOn?1:0, transform:midOn?'none':'translateX(-30px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)', pointerEvents:'none' }}>
          <p style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:'clamp(18px,2.5vw,32px)', color:dark?`${snow}0.7)`:'rgba(26,46,40,0.7)', lineHeight:1.3, letterSpacing:'-0.01em', maxWidth:'22ch' }}>Slow down.<br /><em style={{ color:dark?`${gold}0.85)`:'rgba(45,74,62,0.8)' }}>The mountain is patient.</em></p>
        </div>
      </Html>

      {/* Stay modes */}
      <Html position={[0,8,12]} center distanceFactor={28}>
        <div style={{ textAlign:'center', opacity:sectionsOn?1:0, transform:sectionsOn?'none':'translateY(12px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)', pointerEvents:sectionsOn?'all':'none' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:dark?`${gold}0.6)`:'rgba(155,125,94,0.8)', marginBottom:8 }}>How will you stay?</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
            {['Eco Stay','Wellness','Explorer','Deep Rest'].map(m=>(<a key={m} href="/guest"><div style={{ background:dark?'rgba(15,28,24,0.8)':'rgba(247,244,239,0.85)', border:dark?`1px solid ${gold}0.25)`:'1px solid rgba(200,184,154,0.4)', borderRadius:100, padding:'7px 16px', color:dark?`${snow}0.85)`:'rgba(26,46,40,0.85)', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:11, letterSpacing:'0.04em', cursor:'pointer', backdropFilter:'blur(12px)', whiteSpace:'nowrap' }}>{m}</div></a>))}
          </div>
        </div>
      </Html>

      {/* Enter CTA */}
      <Html position={[0,3.5,2]} center distanceFactor={14}>
        <div style={{ textAlign:'center', opacity:enterOn?1:0, transform:enterOn?'none':'translateY(8px)', transition:'all 0.8s cubic-bezier(0.16,1,0.3,1)', pointerEvents:enterOn?'all':'none' }}>
          <p style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:300, fontSize:20, color:dark?`${snow}0.6)`:'rgba(26,46,40,0.6)', marginBottom:16 }}>Welcome.</p>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <a href="/guest"><button style={{ background:'#2D4A3E', color:'#FAFAF7', border:'none', borderRadius:100, padding:'10px 24px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:12, letterSpacing:'0.06em', cursor:'pointer', boxShadow:'0 4px 20px rgba(45,74,62,0.4)' }}>Guest Experience</button></a>
            <a href="/hotel"><button style={{ background:'transparent', color:dark?`${fern}0.7)`:'rgba(45,74,62,0.7)', border:dark?`1px solid ${gold}0.25)`:'1px solid rgba(45,74,62,0.25)', borderRadius:100, padding:'10px 20px', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:12, letterSpacing:'0.06em', cursor:'pointer', backdropFilter:'blur(12px)' }}>Hotel Team</button></a>
          </div>
        </div>
      </Html>
    </>
  )
}

export function AlpineScene() {
  return (
    <ScrollControls pages={5} damping={0.3}>
      <ScrollScene preset={preset} />
    </ScrollControls>
  )
}
