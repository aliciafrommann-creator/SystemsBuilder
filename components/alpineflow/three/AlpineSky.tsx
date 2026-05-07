'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

export function AlpineSky({ preset }: { preset: DayPreset }) {
  const dirRef = useRef<THREE.DirectionalLight>(null)
  const sunAz = preset.phase==='dawn'?130:preset.phase==='morning'?100:preset.phase==='day'?180:preset.phase==='golden'?250:preset.phase==='dusk'?270:0
  const turb  = preset.phase==='day'?2:preset.phase==='morning'?4:preset.phase==='golden'?8:preset.phase==='dawn'?10:preset.phase==='dusk'?12:14
  const ray   = preset.phase==='day'?1:preset.phase==='morning'?2:preset.phase==='golden'?4:preset.phase==='dawn'?3:preset.phase==='dusk'?5:0.1

  useFrame(({clock})=>{ if(dirRef.current) dirRef.current.intensity = preset.sunIntensity*(1+Math.sin(clock.elapsedTime*0.3)*0.04) })

  return (
    <>
      {preset.phase!=='night' ? <Sky distance={4500} sunPosition={preset.sunPosition} azimuth={sunAz/360} turbidity={turb} rayleigh={ray} mieCoefficient={0.005} mieDirectionalG={0.8} /> : <color attach="background" args={[preset.skyTop as THREE.ColorRepresentation]} />}
      {preset.starsVisible && <Stars radius={200} depth={80} count={preset.phase==='night'?6000:2000} factor={4} saturation={0.2} fade speed={0.3} />}
      <fog attach="fog" args={[preset.fogColor as THREE.ColorRepresentation, preset.fogNear, preset.fogFar]} />
      <directionalLight ref={dirRef} position={preset.sunPosition.map(v=>v*80) as [number,number,number]} intensity={preset.sunIntensity} color={preset.sunColor as THREE.ColorRepresentation} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={300} shadow-camera-left={-100} shadow-camera-right={100} shadow-camera-top={100} shadow-camera-bottom={-100} />
      <ambientLight intensity={preset.ambientIntensity} color={preset.ambientColor as THREE.ColorRepresentation} />
      <hemisphereLight args={[preset.skyHorizon as THREE.ColorRepresentation, preset.terrainColor as THREE.ColorRepresentation, 0.4]} />
    </>
  )
}
